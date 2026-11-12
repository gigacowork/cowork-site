import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VOTING_QUESTIONS } from "@/content/voting";
import { pageMetadata } from "@/lib/site";
import { StageResults } from "./StageResults";

type StagePageProps = {
  params: Promise<{ questionId: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return VOTING_QUESTIONS.map(({ id }) => ({ questionId: id }));
}

export async function generateMetadata({ params }: StagePageProps): Promise<Metadata> {
  const { questionId } = await params;
  const question = VOTING_QUESTIONS.find(({ id }) => id === questionId);
  if (!question) notFound();

  return pageMetadata({
    title: `Итоги вопроса ${VOTING_QUESTIONS.indexOf(question) + 1} — GigaCowork`,
    description: `Результаты голосования: ${question.text}`,
    path: `/vote/${question.id}/results/`,
  });
}

export default async function StagePage({ params }: StagePageProps) {
  const { questionId } = await params;
  const question = VOTING_QUESTIONS.find(({ id }) => id === questionId);
  if (!question) notFound();

  return <StageResults question={question} index={VOTING_QUESTIONS.indexOf(question)} />;
}
