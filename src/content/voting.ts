export type VoteAnswer = "yes" | "no";

export const VOTING_QUESTIONS = [
  { id: "question-1", text: "Через три года цифровые сотрудники станут полноценной частью операционной модели большинства компаний." },
  { id: "question-2", text: "ИИ-агенты уже сегодня приносят бизнесу больше эффекта, чем затрат на их внедрение." },
  { id: "question-3", text: "Контроль работы ИИ-агентов может свести на нет эффект от автоматизации." },
  { id: "question-4", text: "Бизнесу необходимо внедрять ИИ-агентов уже сейчас, иначе он проиграет конкурентам." },
] as const;

export type QuestionId = (typeof VOTING_QUESTIONS)[number]["id"];
export type VoteAnswers = Record<QuestionId, VoteAnswer>;

export type VoteResults = {
  total: number;
  questions: Record<string, { yes: number; no: number }>;
  updatedAt: string | null;
};
