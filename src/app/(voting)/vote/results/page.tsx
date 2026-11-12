import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import { VoteReport } from "./VoteReport";

export const metadata: Metadata = pageMetadata({
  title: "Результаты голосования — GigaCowork",
  description: "Отчёт по результатам голосования: ответы «Да» и «Нет» на вопросы.",
  path: "/vote/results/",
});

export default function VoteResultsPage() {
  return <VoteReport />;
}
