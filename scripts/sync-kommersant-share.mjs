import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

import { latestDigest } from "./kommersant-digest.mjs";

const outputPath = resolve("src/data/kommersant-share.json");
const publicPath = resolve("public/data/kommersant-share.json");

function sourceFrom(urlText) {
  const url = new URL(urlText);
  const match = url.pathname.match(/^\/share\/([^/]+)\/?$/);
  if (url.protocol !== "https:" || !match) throw new Error("Ожидается HTTPS-ссылка на публичную сессию /share/<token>");
  return { url: `${url.origin}/share/${match[1]}`, apiBase: url.origin, token: match[1] };
}

async function getJson(base, path, headers = {}) {
  const response = await fetch(`${base}${path}`, { headers, signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
  return response.json();
}

async function previousSnapshot() {
  try {
    return JSON.parse(await readFile(outputPath, "utf8"));
  } catch {
    return null;
  }
}

async function save(payload) {
  const serialized = `${JSON.stringify(payload, null, 2)}\n`;
  await mkdir(dirname(outputPath), { recursive: true });
  await mkdir(dirname(publicPath), { recursive: true });
  await Promise.all([writeFile(outputPath, serialized), writeFile(publicPath, serialized)]);
}

const source = process.env.KOMMERSANT_SHARE_URL?.trim()
  ? sourceFrom(process.env.KOMMERSANT_SHARE_URL.trim())
  : null;
const previous = await previousSnapshot();
const sameSource = previous?.version === 1 && previous.sourceUrl === (source?.url ?? null);
const baseline = sameSource ? previous : {
  version: 1,
  sourceUrl: source?.url ?? null,
  sourceExpiresAt: null,
  status: "waiting",
  digestCheckedAt: null,
  siteCheckedAt: null,
  metrics: { newSinceLastRun: null, significant24h: null, highPriority24h: null },
  items: [],
};

if (!source) {
  await save(baseline);
  console.log("Kommersant: публичная сессия не настроена (KOMMERSANT_SHARE_URL)");
} else try {
  const share = await getJson(source.apiBase, `/api/share/${encodeURIComponent(source.token)}`);
  if (!share.session_id) throw new Error("Публичная ссылка не содержит идентификатор сессии");
  const history = await getJson(
    source.apiBase,
    `/api/sessions/${encodeURIComponent(share.session_id)}/messages`,
    { "X-Share-Token": source.token },
  );
  const digest = latestDigest(history.messages ?? []);
  const now = new Date().toISOString();
  if (digest && (!baseline.digestCheckedAt || Date.parse(digest.digestCheckedAt) >= Date.parse(baseline.digestCheckedAt))) {
    await save({
      version: 1,
      sourceUrl: source.url,
      sourceExpiresAt: share.expires_at ?? null,
      status: "ok",
      ...digest,
      siteCheckedAt: now,
    });
    console.log(`Kommersant: принят выпуск из публичной сессии (${digest.items.length} событий)`);
  } else {
    await save({ ...baseline, sourceExpiresAt: share.expires_at ?? null, siteCheckedAt: now });
    console.log("Kommersant: нового корректного выпуска в публичной сессии нет");
  }
} catch (error) {
  await save({ ...baseline, siteCheckedAt: new Date().toISOString() });
  console.warn(`Kommersant: публичная сессия недоступна, сохранен последний выпуск (${error.message})`);
}
