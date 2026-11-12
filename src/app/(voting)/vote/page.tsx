import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import { VoteOverview } from "./VoteOverview";

export const metadata: Metadata = pageMetadata({
  title: "Голосование — GigaCowork",
  description: "Ответьте на вопросы голосования.",
  path: "/vote/",
});

export default function VotePage() {
  return <VoteOverview />;
}
