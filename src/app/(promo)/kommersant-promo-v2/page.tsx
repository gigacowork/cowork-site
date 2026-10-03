import type { Metadata } from "next";
import digest from "@/data/kommersant-promo-v2.json";
import { KommersantChat } from "./KommersantChat";

export const metadata: Metadata = {
  title: "Что нового на kommersant.ru? — GigaCowork",
  description: "Свежие материалы раздела «Бизнес» Коммерсанта в чате GigaCowork.",
  robots: { index: false, follow: false },
};

export default function KommersantPromoV2Page() {
  return <KommersantChat initialDigest={digest} />;
}
