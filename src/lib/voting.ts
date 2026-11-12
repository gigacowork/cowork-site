import {
  VOTING_QUESTIONS,
  type QuestionId,
  type VoteAnswer,
  type VoteAnswers,
  type VoteResults,
} from "@/content/voting";

const STORAGE_KEY = "gigacowork-voting-demo-v2";
const LEGACY_STORAGE_KEY = "gigacowork-voting-demo-v1";
const API_BASE_URL = process.env.NEXT_PUBLIC_VOTING_API_BASE_URL?.replace(/\/+$/, "");
export const isSharedVotingEnabled = Boolean(API_BASE_URL);

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
  if (!value || typeof value !== "object") throw new Error("Некорректный ответ сервера голосования.");
  const data = value as { questions?: Record<string, { yes?: unknown; no?: unknown }>; updatedAt?: unknown };
  const questions: VoteResults["questions"] = {};
  let total = 0;

  for (const { id } of VOTING_QUESTIONS) {
    const row = data.questions?.[id];
    if (!row || !Number.isInteger(row.yes) || !Number.isInteger(row.no) || Number(row.yes) < 0 || Number(row.no) < 0) {
      throw new Error("Некорректный ответ сервера голосования.");
    }
    questions[id] = { yes: Number(row.yes), no: Number(row.no) };
    total += questions[id].yes + questions[id].no;
  }

  return { total, questions, updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : null };
}

function parseApiSnapshot(value: unknown): VoteSnapshot {
  if (!value || typeof value !== "object") throw new Error("Некорректный ответ сервера голосования.");
  const data = value as { ownAnswers?: Record<string, unknown>; results?: unknown };
  if (!data.ownAnswers || typeof data.ownAnswers !== "object") throw new Error("Некорректный ответ сервера голосования.");

  const ownAnswers: Partial<VoteAnswers> = {};
  for (const { id } of VOTING_QUESTIONS) {
    const answer = data.ownAnswers[id];
    if (answer !== undefined && !isAnswer(answer)) throw new Error("Некорректный ответ сервера голосования.");
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
    throw new Error("Не удалось связаться с сервером голосования.");
  }

  if (response.status === 409) throw new Error("Вы уже голосовали по этому вопросу. Изменить ответ нельзя.");
  if (!response.ok) throw new Error(`Сервер голосования ответил ошибкой (${response.status}).`);
  try {
    return await response.json();
  } catch {
    throw new Error("Некорректный ответ сервера голосования.");
  }
}

export async function loadVoteSnapshot(): Promise<VoteSnapshot> {
  if (!API_BASE_URL) return getVoteSnapshot();
  return parseApiSnapshot(await requestApi("/snapshot"));
}

export async function loadVoteResults(): Promise<VoteResults> {
  if (!API_BASE_URL) return getVoteResults();
  return parseApiResults(await requestApi("/results"));
}

export async function submitQuestionVote(questionId: QuestionId, answer: VoteAnswer): Promise<VoteSnapshot> {
  if (!API_BASE_URL) return submitLocalQuestionVote(questionId, answer);
  if (!isQuestionId(questionId) || !isAnswer(answer)) throw new Error("Выберите ответ «Да» или «Нет».");
  return parseApiSnapshot(await requestApi("/votes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ questionId, answer }),
  }));
}
