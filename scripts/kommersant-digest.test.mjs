import assert from "node:assert/strict";
import test from "node:test";

import { latestDigest, parseDigestMessage, parseDigestObject } from "./kommersant-digest.mjs";

const checkedAt = "2026-10-02T18:00:00+03:00";
const item = {
  id: "https://www.kommersant.ru/doc/1234567",
  title: "Проверенный заголовок",
  url: "https://www.kommersant.ru/doc/1234567",
  publishedAt: "2026-10-02T17:50:00+03:00",
  summary: "Проверенный факт.",
  businessImpact: "Меняются условия для компаний.",
  primaryTopic: "Компании и инвестиции",
  topicTags: [],
  industryTags: ["Финансы"],
  priority: "normal",
  changeStatus: "new",
};
const issue = (items = [item], metrics = { newSinceLastRun: 1, significant24h: 1, highPriority24h: 0 }) =>
  `KOMMERSANT_DIGEST_V1\n\`\`\`json\n${JSON.stringify({ version: 1, status: "ok", checkedAt, metrics, items })}\n\`\`\``;

test("accepts a complete public-session issue", () => {
  const parsed = parseDigestMessage(issue());
  assert.equal(parsed?.metrics.significant24h, 1);
  assert.equal(parsed?.items[0].url, item.url);
});

test("rejects a mismatched count and a link outside Kommersant", () => {
  assert.equal(parseDigestMessage(issue([item], { newSinceLastRun: 1, significant24h: 2, highPriority24h: 0 })), null);
  assert.equal(parseDigestMessage(issue([{ ...item, url: "https://example.com/story" }])), null);
  assert.equal(parseDigestMessage(issue([item, { ...item, id: "another-id" }], {
    newSinceLastRun: 2,
    significant24h: 2,
    highPriority24h: 0,
  })), null);
});

test("keeps the latest valid issue after an incomplete answer", () => {
  const messages = [
    { role: "assistant", chunks: [{ type: "text", content: issue() }] },
    { role: "assistant", chunks: [{ type: "text", content: "Источник временно недоступен" }] },
  ];
  assert.equal(latestDigest(messages)?.items.length, 1);
});

test("accepts the agent's sectioned Russian snapshot", () => {
  const snapshot = {
    checkedAt,
    lastSuccessAt: checkedAt,
    status: "ok",
    metrics: { newSinceLastRun: null, significant24h: 1, highPriority24h: 1 },
    sections: [{ title: "Компании и инвестиции", items: [{
      ...item,
      id: "1234567",
      priority: "высокий",
      changeStatus: "новое",
      topicTags: ["Компании и инвестиции"],
    }] }],
  };
  const parsed = parseDigestObject(snapshot);
  assert.equal(parsed?.items[0].id, item.url);
  assert.equal(parsed?.items[0].priority, "high");
  assert.deepEqual(parsed?.items[0].topicTags, []);
  const message = `KOMMERSANT_DIGEST_V1\n\`\`\`json\n${JSON.stringify(snapshot)}\n\`\`\``;
  assert.equal(parseDigestMessage(message)?.metrics.highPriority24h, 1);
});
