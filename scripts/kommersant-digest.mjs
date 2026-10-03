export const DIGEST_MARKER = "KOMMERSANT_DIGEST_V1";

const topics = new Set([
  "Регулирование и налоги",
  "Макроэкономика и рынки",
  "Компании и инвестиции",
  "Потребительский рынок",
  "Технологии и связь",
  "Энергетика и промышленность",
  "Логистика и внешняя торговля",
]);

const isDate = (value) => typeof value === "string"
  && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(value)
  && Number.isFinite(Date.parse(value));
const isText = (value) => typeof value === "string" && value.trim().length > 0;
const isTags = (value) => Array.isArray(value) && value.length <= 2 && value.every(isText);

export function textOf(message) {
  return (message.chunks ?? [])
    .filter((chunk) => chunk.type === "text" && typeof chunk.content === "string")
    .map((chunk) => chunk.content)
    .join("\n")
    .trim();
}

export function parseDigestMessage(markdown) {
  const match = markdown.match(/```json\s*([\s\S]*?)\s*```/i);
  const jsonText = match?.[1] ?? (markdown.trim().startsWith("{") ? markdown.trim() : null);
  if (!jsonText) return null;
  let data;
  try {
    data = JSON.parse(jsonText);
  } catch {
    return null;
  }
  return parseDigestObject(data);
}

export function parseDigestObject(data) {
  if (data?.status !== "ok" || !isDate(data.checkedAt) || !data.metrics) return null;
  const isSectioned = Array.isArray(data.sections);
  if (!isSectioned && (data.version !== 1 || !Array.isArray(data.items))) return null;
  if (isSectioned && !data.sections.every((section) => topics.has(section.title) && Array.isArray(section.items))) return null;
  const rawItems = isSectioned
    ? data.sections.flatMap((section) => section.items.map((item) => ({ ...item, primaryTopic: section.title })))
    : data.items;
  if (rawItems.length > 200) return null;

  const { newSinceLastRun, significant24h, highPriority24h } = data.metrics;
  const isCount = (value) => Number.isInteger(value) && value >= 0;
  if (!(newSinceLastRun === null || isCount(newSinceLastRun))
    || !isCount(significant24h) || !isCount(highPriority24h)) return null;

  const checkedAt = Date.parse(data.checkedAt);
  const ids = new Set();
  const items = [];
  for (const item of rawItems) {
    const priority = item.priority === "высокий" ? "high" : item.priority === "обычный" ? "normal" : item.priority;
    const changeStatus = item.changeStatus === "новое" ? "new"
      : item.changeStatus === "обновлено" ? "updated"
        : item.changeStatus === "ранее учтено" ? "existing" : item.changeStatus;
    if (!isText(item.id) || !isText(item.title) || !isText(item.summary)
      || !isText(item.businessImpact) || !isDate(item.publishedAt)
      || !topics.has(item.primaryTopic) || !isTags(item.topicTags)
      || !isTags(item.industryTags)
      || !["high", "normal"].includes(priority)
      || !["new", "updated", "existing"].includes(changeStatus)
      || (item.updatedAt !== undefined && !isDate(item.updatedAt))) return null;
    let url;
    try {
      url = new URL(item.url);
    } catch {
      return null;
    }
    if (url.protocol !== "https:" || !["kommersant.ru", "www.kommersant.ru"].includes(url.hostname)
      || !item.topicTags.every((topic) => topics.has(topic))) return null;
    if (ids.has(url.href) || checkedAt - Date.parse(item.publishedAt) > 24 * 60 * 60 * 1000
      || Date.parse(item.publishedAt) - checkedAt > 10 * 60 * 1000) return null;
    ids.add(url.href);
    items.push({
      id: url.href,
      title: item.title,
      url: url.href,
      publishedAt: item.publishedAt,
      ...(item.updatedAt ? { updatedAt: item.updatedAt } : {}),
      summary: item.summary,
      businessImpact: item.businessImpact,
      primaryTopic: item.primaryTopic,
      topicTags: item.topicTags.filter((topic) => topic !== item.primaryTopic),
      industryTags: item.industryTags,
      priority,
      changeStatus,
    });
  }

  if (significant24h !== items.length
    || highPriority24h !== items.filter((item) => item.priority === "high").length
    || (newSinceLastRun !== null
      && newSinceLastRun !== items.filter((item) => item.changeStatus === "new").length)) return null;

  return {
    digestCheckedAt: data.checkedAt,
    metrics: { newSinceLastRun, significant24h, highPriority24h },
    items,
  };
}

export function latestDigest(messages) {
  for (const message of [...messages].reverse()) {
    if (message.role !== "assistant") continue;
    const digest = parseDigestMessage(textOf(message));
    if (digest) return digest;
  }
  return null;
}
