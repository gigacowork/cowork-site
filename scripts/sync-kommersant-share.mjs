import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const shareToken = "aaaaaaaaaaaaaaaaaaaaaagqae-2hk4x2elgjwtlbd6fgiihap746lo2qaq";
const apiBase = "https://sasha-the-best.muravskiy.com";
const outputPath = resolve("src/data/kommersant-share.json");

async function getJson(path, headers = {}) {
  const response = await fetch(`${apiBase}${path}`, {
    headers,
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) {
    throw new Error(`${path}: HTTP ${response.status}`);
  }
  return response.json();
}

function textOf(message) {
  return (message.chunks ?? [])
    .filter((chunk) => chunk.type === "text" && typeof chunk.content === "string")
    .map((chunk) => chunk.content)
    .join("\n")
    .trim();
}

function parseDigest(markdown) {
  const sections = [];
  let activeSection = null;
  let heading = "";

  for (const rawLine of markdown.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (line.startsWith("## ")) {
      heading = line.slice(3).replace(/^📰\s*/, "");
      continue;
    }
    if (line.startsWith("### ")) {
      activeSection = { title: line.slice(4).replace(/^[^\p{L}]+/u, ""), items: [] };
      sections.push(activeSection);
      continue;
    }
    if (!activeSection || !line.startsWith("- **")) continue;

    const match = line.match(/^- \*\*(.+?)\*\*(.*)$/);
    if (!match) continue;
    const sourceMatch = match[2].match(/\s+\*\(([^*]+)\)\*\s*$/);
    const body = sourceMatch ? match[2].slice(0, sourceMatch.index) : match[2];
    activeSection.items.push({
      title: match[1],
      description: body.replace(/^\s*[—;,]\s*/, "").trim(),
      sources: sourceMatch ? sourceMatch[1] : "",
    });
  }

  if (!heading || sections.length === 0 || sections.every((section) => section.items.length === 0)) {
    throw new Error("В открытой сессии не найдена сводка с рубриками и событиями");
  }
  return { heading, sections };
}

try {
  const share = await getJson(`/api/share/${encodeURIComponent(shareToken)}`);
  const history = await getJson(
    `/api/sessions/${encodeURIComponent(share.session_id)}/messages`,
    { "X-Share-Token": shareToken },
  );
  const messages = history.messages ?? [];
  const digestMessage = [...messages]
    .reverse()
    .find((message) => message.role === "assistant" && textOf(message).includes("Новости за последний час —"));
  if (!digestMessage) throw new Error("В открытой сессии нет выпуска новостей");

  const prompt = messages.find((message) => message.role === "user");
  const digest = parseDigest(textOf(digestMessage));
  const payload = {
    sourceUrl: `${apiBase}/share/${shareToken}`,
    sourceExpiresAt: share.expires_at,
    syncedAt: new Date().toISOString(),
    prompt: prompt ? textOf(prompt) : "",
    ...digest,
  };

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`);
  console.log(`Kommersant: сохранено ${digest.sections.reduce((sum, section) => sum + section.items.length, 0)} событий`);
} catch (error) {
  try {
    await readFile(outputPath);
    console.warn(`Kommersant: источник недоступен, использован последний снимок (${error.message})`);
  } catch {
    throw error;
  }
}
