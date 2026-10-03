import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(".");
const [digest, pageCss, clientJs, logo, checkIcon] = await Promise.all([
  readFile(resolve(root, "src/data/kommersant-share.json"), "utf8"),
  readFile(resolve(root, "src/app/(site)/kommersant-promo/promo.module.css"), "utf8"),
  readFile(resolve(root, "scripts/kommersant-standalone-client.js"), "utf8"),
  readFile(resolve(root, "public/img/logo-gigacowork.svg"), "utf8"),
  readFile(resolve(root, "public/img/kommersant-promo/check-figma.svg"), "utf8"),
]);

// JSON is embedded as inert text, so the file also works without a web server.
const initialDigest = JSON.stringify(JSON.parse(digest)).replace(/</g, "\\u003c");
const steps = [
  ["Читает свежие материалы Ъ", "46 публикаций за последние сутки"],
  ["Отбирает значимое для бизнеса", "Отсеял происшествия и повторы"],
  ["Группирует по отраслям", "Финансы, ритейл, энергетика, логистика"],
  ["Обновляет каждые 5 минут", "Регулярные обновления по источникам"],
];

const html = `<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex,nofollow">
  <title>Что нового на kommersant.ru?</title>
  <meta name="description" content="Бизнес-дайджест свежих новостей, собранных ИИ-агентом GigaCowork">
  <style>
    :root { --font-display: system-ui, -apple-system, "Segoe UI", sans-serif; --header-h: 96px; }
    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body { margin: 0; color: #0f141a; font-family: system-ui, -apple-system, "Segoe UI", sans-serif; }
    button, a { font: inherit; }
    button { cursor: pointer; }
    h1, h2, h3, h4, p, ol { margin: 0; }
    .container-page { width: min(100% - 64px, 1280px); margin-inline: auto; }
    .siteHeader { position: absolute; z-index: 2; inset: 0 0 auto; height: var(--header-h); display: flex; align-items: center; justify-content: space-between; gap: 24px; padding: 0 max(32px, calc((100vw - 1280px) / 2)); background: #fff; }
    .siteHeader a { color: #171f2d; text-decoration: none; }
    .siteHeader svg { display: block; width: 155px; height: auto; }
    .headerActions { display: flex; align-items: center; gap: 32px; }
    .headerActions .headerLink { font-size: 15px; }
    .headerActions .headerCta, .bottomButton { display: inline-flex; align-items: center; justify-content: center; border-radius: 100px; background: #171f2d; color: #fff; text-decoration: none; }
    .headerActions .headerCta { padding: 14px 24px; }
    .headerActions .headerCta:hover, .bottomButton:hover { background: #314058; }
    .step svg { flex: 0 0 28px; width: 28px; height: 28px; }
    .newsItem h4 a { color: inherit; text-decoration: none; }
    .siteFooter { display: flex; justify-content: space-between; gap: 24px; padding: 40px max(32px, calc((100vw - 1280px) / 2)); border-top: 1px solid #e2e8ef; color: #5f6b7a; font-size: 14px; }
    .siteFooter a { color: #0b7f86; }
    ${pageCss}
    @media (max-width: 700px) {
      :root { --header-h: 76px; }
      .container-page { width: min(100% - 32px, 1280px); }
      .siteHeader { padding: 0 16px; }
      .siteHeader svg { width: 117px; }
      .headerActions { gap: 0; }
      .headerActions .headerLink { display: none; }
      .headerActions .headerCta { padding: 11px 16px; font-size: 14px; }
      .siteFooter { flex-direction: column; padding: 28px 16px; }
    }
  </style>
</head>
<body>
  <header class="siteHeader">
    <a href="./" aria-label="GigaCowork — главная">${logo}</a>
    <div class="headerActions">
      <a class="headerLink" href="./ai-platform/">О платформе</a>
      <a class="headerLink" href="./use_cases/ceo/">Для кого</a>
      <a class="headerLink" href="./trust-and-safety/">Безопасность</a>
      <a class="headerLink" href="./pricing/">Поставки</a>
      <a class="headerLink" href="./outreach-accelerator/">Центр знаний</a>
      <a class="headerLink" href="./company/about/">Компания</a>
      <a class="headerCta" href="./lead/">Попробовать</a>
    </div>
  </header>
  <main class="canvas">
    <section class="hero" aria-labelledby="page-title">
      <div class="container-page">
        <h1 id="page-title">Что нового на kommersant.ru?</h1>
        <p>Бизнес-дайджест свежих новостей, собранных ИИ-агентом GigaCowork</p>
      </div>
    </section>
    <section class="demoSection" aria-label="Пример работы агента">
      <div class="container-page">
        <div class="demoWindow">
          <aside class="taskPanel" aria-label="Задача агента">
            <div class="taskHeader"><h2>Промпт</h2><span class="routineChip">Регулярная задача</span></div>
            <p class="prompt">Что нового на kommersant.ru? Веди для меня мониторинг новосте: что изменилось для бизнеса, по отраслям, со ссылками на материалы.</p>
            <h3 class="stepHeading">Как агент выполняет задачу</h3>
            <ol class="steps">${steps.map(([title, detail]) => `
              <li class="step">${checkIcon}<div><strong>${title}</strong><span>${detail}</span></div></li>`).join("")}</ol>
            <div class="liveStatus" aria-live="off"><span class="onlineDot" aria-hidden="true"></span><span>Агент онлайн (обновление через <span id="next-check">05:00</span>)</span></div>
          </aside>
          <div id="digest-content" class="artifact" aria-live="polite"></div>
        </div>
        <p id="digest-caption" class="caption"></p>
        <p class="ctaDescription">Проверьте GigaCowork на своих задачах 7 дней бесплатно</p>
        <div class="buttonRow"><a href="./lead/" class="bottomButton">Поручить задачу агенту</a></div>
      </div>
    </section>
  </main>
  <footer class="siteFooter">
    <span>© 2026 ООО «Салют для Бизнеса»</span>
    <span>Данные из публичной сессии агента GigaCowork</span>
  </footer>
  <script id="initial-digest" type="application/json">${initialDigest}</script>
  <script>${clientJs}</script>
</body>
</html>
`;

const output = resolve(root, "public/kommersant-promo.html");
await writeFile(output, html);
console.log(`Kommersant: создан отдельный HTML-файл ${output}`);
