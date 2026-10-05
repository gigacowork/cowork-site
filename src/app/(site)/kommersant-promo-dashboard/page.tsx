import type { Metadata } from "next";

import digest from "@/data/kommersant-share.json";

import { Dashboard } from "../kommersant-promo/Dashboard";

export const metadata: Metadata = {
  title: "Что нового на kommersant.ru?",
  description: "Бизнес-дайджест свежих новостей, собранных ИИ-агентом GigaCowork.",
  robots: { index: false, follow: false },
};

export default function KommersantPromoDashboardPage() {
  return <Dashboard initialDigest={digest} />;
}
