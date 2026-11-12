import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VOTING_QUESTIONS } from "@/content/voting";
import { pageMetadata } from "@/lib/site";
import { QuestionVote } from "./QuestionVote";

type QuestionPageProps = {
  params: Promise<{ questionId: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return VOTING_QUESTIONS.map(({ id }) => ({ questionId: id }));
}

export async function generateMetadata({ params }: QuestionPageProps): Promise<Metadata> {
  const { questionId } = await params;
  const question = VOTING_QUESTIONS.find(({ id }) => id === questionId);
  if (!question) notFound();

  return pageMetadata({
    title: `Вопрос ${VOTING_QUESTIONS.indexOf(question) + 1} — голосование GigaCowork`,
    description: question.text,
    path: `/vote/${question.id}/`,
  });
}

export default async function QuestionPage({ params }: QuestionPageProps) {
  const { questionId } = await params;
  const question = VOTING_QUESTIONS.find(({ id }) => id === questionId);
  if (!question) notFound();

  return <QuestionVote question={question} index={VOTING_QUESTIONS.indexOf(question)} />;
}
