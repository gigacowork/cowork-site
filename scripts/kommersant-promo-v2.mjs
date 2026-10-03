export const FEED_URL = "https://www.kommersant.ru/rss/section-business.xml";
const ARTICLE_URL = /^https:\/\/(?:www\.)?kommersant\.ru\/doc\/\d+\/?$/;
const BUSINESS_SIGNAL = /компан|предприяти|бизнес|рынк|бирж|инвест|финанс|банк|кредит|налог|тариф|пошлин|нефт|газ|топлив|судов|перевоз|логист|торгов|актив|сделк|производ|промышлен|автомобил|ритейл|застрой|недвижим|арктик/i;

function decodeXml(value) {
  return value.replace(/&#(x[\da-f]+|\d+);|&(amp|lt|gt|quot|apos|nbsp);/gi, (match, number, named) => {
    if (number) {
      const codePoint = number[0].toLowerCase() === "x"
        ? Number.parseInt(number.slice(1), 16) : Number.parseInt(number, 10);
      return codePoint > 0 && codePoint <= 0x10ffff ? String.fromCodePoint(codePoint) : "";
    }
    return { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " }[named.toLowerCase()] ?? match;
  });
}

function field(xml, tag) {
  const match = xml.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match ? decodeXml(match[1].replace(/^<!\[CDATA\[([\s\S]*?)\]\]>$/, "$1").replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ").trim() : "";
}

export function parseBusinessFeed(xml, checkedAt = new Date().toISOString()) {
  if (!/<rss\b/i.test(xml) || !/<channel\b/i.test(xml)) throw new Error("Некорректная RSS-лента");
  const seen = new Set();
  const items = [];
  for (const match of xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi)) {
    const source = match[1];
    const url = field(source, "link");
    const title = field(source, "title");
    const summary = field(source, "description");
    const published = new Date(field(source, "pubDate"));
    if (!ARTICLE_URL.test(url) || !title || !summary || seen.has(url) || !Number.isFinite(published.getTime())
      || !BUSINESS_SIGNAL.test(`${title} ${summary}`)) continue;
    const publishedAt = published.toISOString();
    seen.add(url);
    items.push({ id: url, title, summary, url, publishedAt });
  }
  items.sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
  return {
    version: 1,
    source: FEED_URL,
    checkedAt,
    status: "ok",
    items: items.slice(0, 6),
  };
}
