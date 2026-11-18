import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import { StageOverview } from "./StageOverview";

export const metadata: Metadata = pageMetadata({
  title: "Сводные итоги голосования — GigaCowork",
  description: "Результаты ответов «Да» и «Нет» по всем вопросам для экрана сцены.",
  path: "/vote/results/stage/",
});

export default function StageOverviewPage() {
  return <StageOverview />;
}
