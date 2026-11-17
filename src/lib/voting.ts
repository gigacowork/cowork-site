import {
  VOTING_QUESTIONS,
  type QuestionId,
  type VoteAnswer,
  type VoteAnswers,
  type VoteResults,
} from "@/content/voting";

const STORAGE_KEY = "gigacowork-voting-demo-v2";
const LEGACY_STORAGE_KEY = "gigacowork-voting-demo-v1";
const VOTER_ID_KEY = "gigacowork-voting-voter-id-v1";
const API_BASE_URL = process.env.NEXT_PUBLIC_VOTING_API_BASE_URL?.replace(/\/+$/, "");
const DEFAULT_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx3fnef6NNMLLSMIfYSqXP0uCPhD_T49zEFATv6VUzpYh9tq8DSUmz5G_5L_PN3ehFJvg/exec";
const APPS_SCRIPT_URL = (process.env.NEXT_PUBLIC_VOTING_APPS_SCRIPT_URL ?? DEFAULT_APPS_SCRIPT_URL).trim();
export const isSharedVotingEnabled = Boolean(APPS_SCRIPT_URL || API_BASE_URL);
export const VOTING_RELOAD_MESSAGE = "Не удалось загрузить данные. Перезагрузите страницу.";
let jsonpCounter = 0;

type StoredVote = {
  questionId: QuestionId;
  answer: VoteAnswer;
  submittedAt: string;
};

type VoteState = {
  version: 2;
  ownAnswers: Partial<VoteAnswers>;
  votes: StoredVote[];
};

export type VoteSnapshot = {
  ownAnswers: Partial<VoteAnswers>;
  results: VoteResults;
};

function isAnswer(value: unknown): value is VoteAnswer {
  return value === "yes" || value === "no";
}

function isQuestionId(value: unknown): value is QuestionId {
  return VOTING_QUESTIONS.some(({ id }) => id === value);
}

function isStoredVote(value: unknown): value is StoredVote {
  if (!value || typeof value !== "object") return false;
  const vote = value as Partial<StoredVote>;
  return isQuestionId(vote.questionId) && isAnswer(vote.answer) && typeof vote.submittedAt === "string";
}

function emptyState(): VoteState {
  return { version: 2, ownAnswers: {}, votes: [] };
}

function readLegacyState(): VoteState {
  const raw = window.localStorage.getItem(LEGACY_STORAGE_KEY);
  if (!raw) return emptyState();

  const ballots: unknown = JSON.parse(raw);
  if (!Array.isArray(ballots)) throw new Error("Не удалось прочитать сохранённые голоса.");

  const votes: StoredVote[] = [];
  for (const ballot of ballots) {
    if (!ballot || typeof ballot !== "object") continue;
    const record = ballot as { submittedAt?: unknown; answers?: Record<string, unknown> };
    if (typeof record.submittedAt !== "string" || !record.answers || typeof record.answers !== "object") continue;
    for (const { id } of VOTING_QUESTIONS) {
      const answer = record.answers[id];
      if (isAnswer(answer)) votes.push({ questionId: id, answer, submittedAt: record.submittedAt });
    }
  }

  // Старые бюллетени были тестовыми: их считаем, но не выдаём за личные голоса.
  return { version: 2, ownAnswers: {}, votes };
}

function readState(): VoteState {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return readLegacyState();

  const parsed: unknown = JSON.parse(raw);
  if (!parsed || typeof parsed !== "object") throw new Error("Не удалось прочитать сохранённые голоса.");
  const state = parsed as Partial<VoteState>;
  if (state.version !== 2 || !Array.isArray(state.votes) || !state.votes.every(isStoredVote) || !state.ownAnswers || typeof state.ownAnswers !== "object") {
    throw new Error("Не удалось прочитать сохранённые голоса.");
  }

  const ownAnswers: Partial<VoteAnswers> = {};
  for (const { id } of VOTING_QUESTIONS) {
    const answer = state.ownAnswers[id];
    if (isAnswer(answer)) ownAnswers[id] = answer;
  }
  return { version: 2, ownAnswers, votes: state.votes };
}

function snapshotFromState(state: VoteState): VoteSnapshot {
  const questions: VoteResults["questions"] = {};
  for (const { id } of VOTING_QUESTIONS) {
    questions[id] = {
      yes: state.votes.filter((vote) => vote.questionId === id && vote.answer === "yes").length,
      no: state.votes.filter((vote) => vote.questionId === id && vote.answer === "no").length,
    };
  }

  return {
    ownAnswers: state.ownAnswers,
    results: {
      total: state.votes.length,
      questions,
      updatedAt: state.votes.at(-1)?.submittedAt ?? null,
    },
  };
}

export function getVoteSnapshot(): VoteSnapshot {
  return snapshotFromState(readState());
}

export function getVoteResults(): VoteResults {
  return getVoteSnapshot().results;
}

function submitLocalQuestionVote(questionId: QuestionId, answer: VoteAnswer): VoteSnapshot {
  if (!isQuestionId(questionId) || !isAnswer(answer)) throw new Error("Выберите ответ «Да» или «Нет».");

  const state = readState();
  if (state.ownAnswers[questionId]) throw new Error("Вы уже голосовали по этому вопросу. Изменить ответ нельзя.");

  const next: VoteState = {
    version: 2,
    ownAnswers: { ...state.ownAnswers, [questionId]: answer },
    votes: [...state.votes, { questionId, answer, submittedAt: new Date().toISOString() }],
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return snapshotFromState(next);
}

function parseApiResults(value: unknown): VoteResults {
  if (!value || typeof value !== "object") throw new Error(VOTING_RELOAD_MESSAGE);
  const data = value as { questions?: Record<string, { yes?: unknown; no?: unknown }>; updatedAt?: unknown };
  const questions: VoteResults["questions"] = {};
  let total = 0;

  for (const { id } of VOTING_QUESTIONS) {
    const row = data.questions?.[id];
    if (!row || !Number.isInteger(row.yes) || !Number.isInteger(row.no) || Number(row.yes) < 0 || Number(row.no) < 0) {
      throw new Error(VOTING_RELOAD_MESSAGE);
    }
    questions[id] = { yes: Number(row.yes), no: Number(row.no) };
    total += questions[id].yes + questions[id].no;
  }

  return { total, questions, updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : null };
}

function parseApiSnapshot(value: unknown): VoteSnapshot {
  if (!value || typeof value !== "object") throw new Error(VOTING_RELOAD_MESSAGE);
  const data = value as { ownAnswers?: Record<string, unknown>; results?: unknown };
  if (!data.ownAnswers || typeof data.ownAnswers !== "object") throw new Error(VOTING_RELOAD_MESSAGE);

  const ownAnswers: Partial<VoteAnswers> = {};
  for (const { id } of VOTING_QUESTIONS) {
    const answer = data.ownAnswers[id];
    if (answer !== undefined && !isAnswer(answer)) throw new Error(VOTING_RELOAD_MESSAGE);
    if (isAnswer(answer)) ownAnswers[id] = answer;
  }
  return { ownAnswers, results: parseApiResults(data.results) };
}

async function requestApi(path: string, init?: RequestInit): Promise<unknown> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      cache: "no-store",
      credentials: "include",
      ...init,
    });
  } catch {
    throw new Error(VOTING_RELOAD_MESSAGE);
  }

  if (response.status === 409) throw new Error("Вы уже голосовали по этому вопросу. Изменить ответ нельзя.");
  if (!response.ok) throw new Error(VOTING_RELOAD_MESSAGE);
  try {
    return await response.json();
  } catch {
    throw new Error(VOTING_RELOAD_MESSAGE);
  }
}

function getVoterId(): string {
  const saved = window.localStorage.getItem(VOTER_ID_KEY);
  if (saved && /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(saved)) return saved;
  let id: string;
  if (typeof window.crypto.randomUUID === "function") {
    id = window.crypto.randomUUID();
  } else {
    const bytes = window.crypto.getRandomValues(new Uint8Array(16));
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
    id = `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }
  window.localStorage.setItem(VOTER_ID_KEY, id);
  return id;
}

function requestAppsScript(action: "snapshot" | "results", voterId?: string): Promise<unknown> {
  if (!APPS_SCRIPT_URL) throw new Error(VOTING_RELOAD_MESSAGE);

  return new Promise((resolve, reject) => {
    const callback = `coworkVotingCallback_${Date.now()}_${++jsonpCounter}`;
    const url = new URL(APPS_SCRIPT_URL);
    url.searchParams.set("action", action);
    url.searchParams.set("callback", callback);
    url.searchParams.set("_", String(Date.now()));
    if (voterId) url.searchParams.set("voterId", voterId);

    const script = document.createElement("script");
    let done = false;
    const callbacks = window as Window & typeof globalThis & Record<string, unknown>;
    const finish = (error?: Error, result?: unknown) => {
      if (done) return;
      done = true;
      window.clearTimeout(timeout);
      script.remove();
      delete callbacks[callback];
      if (error) reject(error);
      else resolve(result);
    };
    const timeout = window.setTimeout(() => finish(new Error(VOTING_RELOAD_MESSAGE)), 15000);
    callbacks[callback] = (result: unknown) => finish(undefined, result);
    script.onerror = () => finish(new Error(VOTING_RELOAD_MESSAGE));
    script.src = url.toString();
    document.head.appendChild(script);
  });
}

async function requestAppsScriptData(action: "snapshot" | "results", voterId?: string): Promise<unknown> {
  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const data = await requestAppsScript(action, voterId);
      if (data && typeof data === "object" && "error" in data) {
        throw new Error(VOTING_RELOAD_MESSAGE);
      }
      return data;
    } catch (error) {
      lastError = error;
      if (attempt < 2) await new Promise((resolve) => window.setTimeout(resolve, 400 * (attempt + 1)));
    }
  }
  throw lastError;
}

async function submitAppsScriptVote(questionId: QuestionId, answer: VoteAnswer): Promise<VoteSnapshot> {
  if (!APPS_SCRIPT_URL) throw new Error(VOTING_RELOAD_MESSAGE);
  const voterId = getVoterId();
  const before = parseApiSnapshot(await requestAppsScriptData("snapshot", voterId));
  if (before.ownAnswers[questionId]) throw new Error("Вы уже голосовали по этому вопросу. Изменить ответ нельзя.");

  try {
    await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      body: new URLSearchParams({ voterId, questionId, answer }),
    });
  } catch {
    throw new Error(VOTING_RELOAD_MESSAGE);
  }

  // Ответ на cross-origin POST непрозрачен: подтверждаем запись отдельным запросом.
  for (let attempt = 0; attempt < 12; attempt += 1) {
    await new Promise((resolve) => window.setTimeout(resolve, attempt === 0 ? 300 : 1000));
    const next = parseApiSnapshot(await requestAppsScriptData("snapshot", voterId));
    if (next.ownAnswers[questionId] === answer) return next;
    if (next.ownAnswers[questionId]) throw new Error("Вы уже голосовали по этому вопросу. Изменить ответ нельзя.");
  }
  throw new Error(VOTING_RELOAD_MESSAGE);
}

export async function loadVoteSnapshot(): Promise<VoteSnapshot> {
  if (APPS_SCRIPT_URL) return parseApiSnapshot(await requestAppsScriptData("snapshot", getVoterId()));
  if (!API_BASE_URL) return getVoteSnapshot();
  return parseApiSnapshot(await requestApi("/snapshot"));
}

export async function loadVoteResults(): Promise<VoteResults> {
  if (APPS_SCRIPT_URL) return parseApiResults(await requestAppsScriptData("results"));
  if (!API_BASE_URL) return getVoteResults();
  return parseApiResults(await requestApi("/results"));
}

export async function submitQuestionVote(questionId: QuestionId, answer: VoteAnswer): Promise<VoteSnapshot> {
  if (!isQuestionId(questionId) || !isAnswer(answer)) throw new Error("Выберите ответ «Да» или «Нет».");
  if (APPS_SCRIPT_URL) return submitAppsScriptVote(questionId, answer);
  if (!API_BASE_URL) return submitLocalQuestionVote(questionId, answer);
  return parseApiSnapshot(await requestApi("/votes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ questionId, answer }),
  }));
}
