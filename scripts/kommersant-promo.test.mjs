import assert from "node:assert/strict";
import test from "node:test";
import { parseBusinessFeed } from "./kommersant-promo.mjs";

const item = (id, title, description = "Компания сообщает об изменениях на рынке") => `
  <item>
    <title>${title}</title>
    <link>https://www.kommersant.ru/doc/${id}</link>
    <pubDate>Sat, 03 Oct 2026 15:45:40 +0300</pubDate>
    <description>${description}</description>
  </item>`;

test("keeps six business stories, decodes text, and ignores unrelated and unsafe links", () => {
  const xml = `<rss><channel>
    ${item(1, "Банк &amp; бизнес")}
    ${item(1, "Банк &amp; бизнес")}
    ${item(2, "В аэропорту сняли ограничения", "Рейсы выполняются по расписанию")}
    ${item(3, "Нефтяная компания объявила о сделке")}
    ${item(4, "Новые пошлины на сталь")}
    ${item(5, "Инвестиции в производство")}
    ${item(6, "Продажи автомобилей выросли")}
    ${item(7, "Газовый рынок меняется")}
    <item><title>Кредитные ставки</title><link>https://example.com/doc/8</link><pubDate>Sat, 03 Oct 2026 15:45:40 +0300</pubDate><description>Банк</description></item>
  </channel></rss>`;
  const digest = parseBusinessFeed(xml);
  assert.equal(digest.items.length, 6);
  assert.equal(digest.items[0].title, "Банк & бизнес");
  assert.ok(digest.items.every((story) => story.url.startsWith("https://www.kommersant.ru/doc/")));
  assert.ok(!digest.items.some((story) => story.title.includes("аэропорту")));
});
