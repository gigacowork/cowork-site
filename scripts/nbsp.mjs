/**
 * Расстановка неразрывных пробелов в текстах сайта.
 *
 * Правила — по «Справочнику издателя и автора» Мильчина (§ о переносах) и
 * общепринятой практике русской вёрстки:
 *
 *  1. Не оставлять в конце строки однобуквенные предлоги и союзы
 *     (в, к, с, о, у, а, и) — они уходят на новую строку вместе со словом.
 *  2. То же для двух- и трёхбуквенных предлогов и союзов (на, за, по, до, из,
 *     от, для, при, под, над, без, что, как…). Для трёхбуквенных правило
 *     рекомендательное, поэтому связываем только с короткими словами — иначе
 *     в узкой колонке пара «предлог + длинное слово» не помещается в строку.
 *  3. Частицы «бы», «ли», «же», «ль» не отрываются от предыдущего слова.
 *  4. Тире не начинает строку: перед ним неразрывный пробел.
 *  5. Число не отрывается от следующего за ним слова: «35 коннекторов».
 *  6. Не разбиваются сокращения «и т. д.», «т. е.», «т. п.» и инициалы.
 *
 * Почему codemod, а не обработка при рендере: сайт — статический экспорт без
 * контентного конвейера, тексты лежат прямо в исходниках. Скрипт правит только
 * строковые литералы и текст в JSX, где есть кириллица, — имена классов, пути и
 * комментарии он не трогает, потому что разбирает файл в синтаксическое дерево,
 * а не ищет по тексту.
 *
 * Неразрывный пробел вставляется escape-последовательностью (` ` в
 * строках, `&nbsp;` в JSX), а не самим символом: в редакторе он невидим, и
 * править такой текст вслепую нельзя.
 *
 * Запуск: node scripts/nbsp.mjs [--dry]
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join, extname } from "node:path";
import { readdirSync, statSync } from "node:fs";
import ts from "typescript";

const ROOT = new URL("../src/", import.meta.url).pathname;
const DRY = process.argv.includes("--dry");

/*
  В списках только предлоги, союзы и частицы — то, что по правилу не должно
  оставаться в конце строки. Местоимения и наречия («то», «уже», «их», «где»)
  сюда не входят: они самостоятельные слова, и связывать их со следующим не
  нужно.
*/
/** Однобуквенные и двухбуквенные — связываем всегда. */
const SHORT =
  "а|и|в|к|о|с|у|во|до|за|из|ко|на|не|ни|но|об|от|по|со";
/** Трёхбуквенные — только если следующее слово короткое (см. правило 2). */
const MEDIUM = "без|для|как|над|обо|под|при|про|что|чем|или|ото|изо";
/** Частицы, которые прилипают к предыдущему слову. */
const PARTICLES = "бы|б|ли|ль|же|ж";
/*
  Насколько длинным может быть слово после трёхбуквенного предлога. Ограничение
  на случай узкой колонки: пара «предлог + очень длинное слово» не должна
  перестать помещаться в строку. 16 подобрано по факту — при нём в самой узкой
  колонке сайта (карточки 306px, текст 16px) переполнения нет, проверено.
*/
const MEDIUM_MAX_WORD = 16;

const NB = " ";

/** Есть ли кириллица — по этому признаку отличаем копирайт от кода и путей. */
const hasCyrillic = (s) => /[а-яё]/i.test(s);

export function nbsp(text) {
  let out = text;

  // 4. Тире не начинает строку.
  out = out.replace(/ (?=[—–])/g, NB);

  // 3. Частицы не отрываются от предыдущего слова.
  out = out.replace(
    new RegExp(`(?<=[а-яёa-z0-9]) (?=(?:${PARTICLES})[\\s.,;:!?)]|(?:${PARTICLES})$)`, "gi"),
    NB
  );

  // 1–2. Короткие предлоги и союзы.
  out = out.replace(
    new RegExp(`(^|[\\s(«"„\\u00A0])(${SHORT}) `, "gi"),
    (_m, before, word) => `${before}${word}${NB}`
  );

  // 2. Трёхбуквенные — только перед коротким словом.
  out = out.replace(
    new RegExp(`(^|[\\s(«"„\\u00A0])(${MEDIUM}) ([а-яё-]+)`, "gi"),
    (match, before, word, next) =>
      next.length <= MEDIUM_MAX_WORD
        ? `${before}${word}${NB}${next}`
        : match
  );

  // 5. Число и слово за ним.
  out = out.replace(/(\d) (?=[а-яё%])/gi, `$1${NB}`);

  // 6. Сокращения и инициалы.
  out = out.replace(/\bт\. ?е\./g, `т.${NB}е.`);
  out = out.replace(/\bт\. ?д\./g, `т.${NB}д.`);
  out = out.replace(/\bт\. ?п\./g, `т.${NB}п.`);
  out = out.replace(/\b([А-ЯЁ])\. ?([А-ЯЁ])\./g, `$1.${NB}$2.`);

  return out;
}

/* ── обход файлов ────────────────────────────────────────────────────────── */

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) yield* walk(full);
    else if ([".ts", ".tsx"].includes(extname(full))) yield full;
  }
}

/** Экранируем неразрывный пробел, чтобы в исходнике он оставался видимым. */
const escapeForLiteral = (s) => s.replaceAll(NB, "\\u00A0");
const escapeForJsx = (s) => s.replaceAll(NB, "&nbsp;");

let changedFiles = 0;
let changedNodes = 0;

for (const file of walk(ROOT)) {
  const source = readFileSync(file, "utf8");
  const sf = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const edits = [];

  const visit = (node) => {
    if (
      ts.isStringLiteral(node) ||
      ts.isNoSubstitutionTemplateLiteral(node)
    ) {
      // Пути импортов и атрибуты вроде className кириллицы не содержат.
      if (hasCyrillic(node.text)) {
        const fixed = nbsp(node.text);
        if (fixed !== node.text) {
          // Заменяем только содержимое между кавычками.
          const start = node.getStart() + 1;
          const end = node.getEnd() - 1;
          const raw = source.slice(start, end);
          /*
            Пересобираем из исходного текста, сохраняя уже имеющиеся escape.
            `\n` в литерале — это два символа, и для правил он должен работать
            как пробел: иначе предлог сразу после ручного переноса строки
            остаётся висеть («…договоренности\nиз разных источников»).
          */
          const patched = escapeForLiteral(
            nbsp(raw.replaceAll("\\u00A0", NB).replaceAll("\\n", "\n"))
          ).replaceAll("\n", "\\n");
          if (patched !== raw) edits.push({ start, end, text: patched });
        }
      }
    } else if (ts.isJsxText(node)) {
      const raw = node.getText();
      if (hasCyrillic(raw)) {
        const patched = escapeForJsx(nbsp(raw.replaceAll("&nbsp;", NB)));
        if (patched !== raw) {
          edits.push({ start: node.getStart(), end: node.getEnd(), text: patched });
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);

  if (!edits.length) continue;
  edits.sort((a, b) => b.start - a.start);
  let out = source;
  for (const e of edits) out = out.slice(0, e.start) + e.text + out.slice(e.end);
  changedFiles += 1;
  changedNodes += edits.length;
  if (!DRY) writeFileSync(file, out);
  console.log(`${edits.length.toString().padStart(3)}  ${file.replace(ROOT, "")}`);
}

console.log(`\n${DRY ? "нашлось" : "поправлено"}: ${changedNodes} мест в ${changedFiles} файлах`);
