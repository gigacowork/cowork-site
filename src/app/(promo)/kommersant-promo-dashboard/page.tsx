import type { Metadata } from "next";

import digest from "@/data/kommersant-share.json";

import { DashboardChat } from "./DashboardChat";

export const metadata: Metadata = {
  title: "Что нового на kommersant.ru?",
  description: "Бизнес-дайджест свежих новостей, собранных ИИ-агентом GigaCowork.",
  robots: { index: false, follow: false },
};

export default function KommersantPromoDashboardPage() {
  return <DashboardChat initialDigest={digest} />;
}
