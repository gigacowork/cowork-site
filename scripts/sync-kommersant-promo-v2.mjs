import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { FEED_URL, parseBusinessFeed } from "./kommersant-promo-v2.mjs";

const paths = [resolve("src/data/kommersant-promo-v2.json"), resolve("public/data/kommersant-promo-v2.json")];

try {
  const response = await fetch(FEED_URL, {
    headers: { "User-Agent": "GigaCoworkKommersantPromo/1.0 (+https://gigacowork.ru)" },
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const digest = parseBusinessFeed(await response.text());
  if (!digest.items.length) throw new Error("В ленте нет публикаций");
  const json = `${JSON.stringify(digest, null, 2)}\n`;
  await Promise.all(paths.map(async (path) => {
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, json);
  }));
  console.log(`Kommersant promo v2: ${digest.items.length} статей`);
} catch (error) {
  // A transient source failure must not replace the last valid published issue.
  let previous;
  try { previous = JSON.parse(await readFile(paths[0], "utf8")); } catch { /* first run */ }
  if (!Array.isArray(previous?.items) || !previous.items.length) {
    console.warn(`Kommersant promo v2: источник недоступен (${error.message}), публикаций пока нет`);
  } else {
    console.warn(`Kommersant promo v2: источник недоступен (${error.message}), сохранён предыдущий выпуск`);
  }
}
