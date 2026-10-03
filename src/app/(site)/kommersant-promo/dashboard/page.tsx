import type { Metadata } from "next";

import digest from "@/data/kommersant-share.json";

import { Dashboard } from "../Dashboard";

export const metadata: Metadata = {
  title: "Бизнес-дайджест Ъ — GigaCowork",
  description: "Дайджест из публичной сессии агента GigaCowork.",
  robots: { index: false, follow: false },
};

export default function KommersantDashboardPage() {
  return <Dashboard initialDigest={digest} />;
}
