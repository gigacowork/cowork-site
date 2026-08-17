#!/usr/bin/env node
/*
  Обёртка выгрузки документации в оформление сайта.

  Antora генерирует самостоятельный статический сайт со своей тёмно-серой
  плашкой сверху и служебным подвалом. Скрипт приводит выгрузку к остальному
  сайту:

    • снимает плашку `header.header` (навигацию заменяет шапка сайта);
    • переносит поле поиска из плашки в строку с хлебными крошками;
    • вставляет шапку и подвал сайта (scripts/docs-chrome/);
    • подключает свои стили и скрипт;
    • копирует chrome.css и chrome.js внутрь выгрузки.

  Запускать ПОСЛЕ каждой пересборки документации — свежая выгрузка затирает
  предыдущие правки:

      node scripts/wrap-docs.mjs                 # public/docs
      node scripts/wrap-docs.mjs путь/к/выгрузке

  Скрипт идемпотентен: страницы, где метка уже стоит, пропускаются, так что
  повторный запуск ничего не ломает.
*/

import { readFile, writeFile, readdir, mkdir, copyFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(HERE, "docs-chrome");
const ROOT = path.resolve(HERE, "..");

/** Метка обработанной страницы — по ней же работает защита от повторов. */
const MARK = "<!-- site-chrome -->";

/** Куда внутри выгрузки лечь стилям и скрипту (рядом с ассетами Antora). */
const ASSET_DIR = path.join("_", "site-chrome");

const target = path.resolve(process.argv[2] || path.join(ROOT, "public", "docs"));

/** Рекурсивный обход: все .html внутри выгрузки. */
async function htmlFiles(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await htmlFiles(full)));
    else if (entry.name.endsWith(".html")) out.push(full);
  }
  return out;
}

/**
 * Вырезает элемент вместе с содержимым по открывающему тегу.
 * Пары <header>/<footer> здесь не вкладываются друг в друга, поэтому хватает
 * поиска ближайшего закрывающего тега — разбирать DOM ради этого незачем.
 */
function cutElement(html, openTag, closeTag) {
  const start = html.indexOf(openTag);
  if (start < 0) return { html, cut: "" };
  const end = html.indexOf(closeTag, start);
  if (end < 0) return { html, cut: "" };
  const stop = end + closeTag.length;
  return { html: html.slice(0, start) + html.slice(stop), cut: html.slice(start, stop) };
}

/** Достаёт из снятой плашки блок поиска, чтобы переставить его ниже. */
function extractSearch(chunk) {
  const start = chunk.indexOf('<div class="navbar-item search');
  if (start < 0) return "";
  // Блок поиска — три вложенных div: сам блок, #search-field и поле внутри.
  const end = chunk.indexOf("</div>", chunk.indexOf("</div>", start) + 6);
  if (end < 0) return "";
  return chunk.slice(start, end + 6);
}

async function processFile(file, chrome) {
  const original = await readFile(file, "utf8");
  if (original.includes(MARK)) return "пропущена";

  // Страница-редирект без разметки — трогать нечего.
  if (!original.includes('<header class="header">')) return "пропущена";

  let html = original;

  // 1. Снимаем плашку и забираем из неё поиск.
  const header = cutElement(html, '<header class="header">', "</header>");
  html = header.html;
  const search = extractSearch(header.cut);

  // 2. Меняем служебный подвал Antora на подвал сайта.
  const footer = cutElement(html, '<footer class="footer">', "</footer>");
  html = footer.html;

  /*
    3. Строку с хлебными крошками поднимаем из main наверх, над обеими
    колонками, — тогда она тянется во всю ширину страницы. Заодно убираем
    ссылку-домик: путь и так начинается с корневого раздела.

    Порядок шагов важен: сейчас внутри строки нет ни одного вложенного div,
    поэтому её конец находится по первому же закрывающему тегу. Поиск с его
    парой вложенных div переезжает сюда шагом ниже, уже после переноса.
  */
  const bar = cutElement(html, '<div class="toolbar"', "</div>");
  html = bar.html;
  /*
    На индексной странице версии у домика добавляется класс `is-current`,
    поэтому сравнивать класс целиком нельзя — ищем по началу значения.

    Первый пункт пути Antora называет именем компонента («GigaCowork»), что на
    сайте выглядит как повтор логотипа. Заменяем подпись на «Документация» —
    ссылка остаётся прежней, меняется только текст.
  */
  const toolbar = bar.cut
    .replace(/\s*<a[^>]*class="home-link[^"]*"[^>]*>\s*<\/a>/, "")
    .replace(
      /(<nav class="breadcrumbs"[\s\S]*?<li>(?:<a[^>]*>)?)[^<]*/,
      "$1Документация"
    );

  // 4. Убираем заголовок раздела над меню — он дублирует первый пункт пути.
  html = html.replace(
    /(<nav class="nav-menu">[\s\S]*?)<h3 class="title">[\s\S]*?<\/h3>\s*/,
    "$1"
  );

  /*
    5. Оборачиваем каркас документации, чтобы он встал на сетку страницы:
    боковое меню начинается под логотипом. Закрываем обёртку перед скриптами
    Antora — это последний устойчивый ориентир в конце разметки.
  */
  html = html.replace(
    '<div class="body">',
    `<div class="sc-docs-shell">\n${toolbar}\n<div class="body">`
  );
  html = html.replace('<script id="site-script"', '</div>\n<script id="site-script"');

  // 6. Поиск — в конец перенесённой строки с крошками.
  if (search) {
    const at = html.indexOf('<div class="toolbar"');
    if (at >= 0) {
      const close = html.indexOf("</div>", html.indexOf("</nav>", at));
      if (close >= 0) html = html.slice(0, close) + search + "\n" + html.slice(close);
    }
  }

  // 7. Стили — последними в <head>, чтобы перебивать site.css при равной специфичности.
  const depth = path.relative(path.dirname(file), target).split(path.sep).filter(Boolean).length;
  const up = depth ? "../".repeat(depth) : "./";
  html = html.replace(
    "</head>",
    `<link rel="stylesheet" href="${up}${ASSET_DIR.split(path.sep).join("/")}/chrome.css">\n  </head>`
  );

  // 8. Шапка сразу после <body>, подвал и скрипт — перед </body>.
  html = html.replace(/(<body[^>]*>)/, `$1\n${MARK}\n${chrome.header}`);
  html = html.replace(
    "</body>",
    `${chrome.footer}\n<script src="${up}${ASSET_DIR.split(path.sep).join("/")}/chrome.js" defer></script>\n  </body>`
  );

  await writeFile(file, html, "utf8");
  return "обработана";
}

async function main() {
  if (!existsSync(target)) {
    console.error(`Выгрузка не найдена: ${target}`);
    console.error("Укажите путь: node scripts/wrap-docs.mjs путь/к/выгрузке");
    process.exit(1);
  }

  const chrome = {
    header: await readFile(path.join(SRC, "header.html"), "utf8"),
    footer: await readFile(path.join(SRC, "footer.html"), "utf8"),
  };

  const assets = path.join(target, ASSET_DIR);
  await mkdir(assets, { recursive: true });
  for (const name of ["chrome.css", "chrome.js"]) {
    await copyFile(path.join(SRC, name), path.join(assets, name));
  }

  const files = await htmlFiles(target);
  const stats = { обработана: 0, пропущена: 0 };
  for (const file of files) stats[await processFile(file, chrome)]++;

  console.log(`Выгрузка: ${target}`);
  console.log(`  обработано страниц: ${stats["обработана"]}`);
  console.log(`  пропущено (уже с оформлением или без разметки): ${stats["пропущена"]}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
