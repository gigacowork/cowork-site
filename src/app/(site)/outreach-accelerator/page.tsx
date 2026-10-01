import type { Metadata } from "next";
import FinalCta from "@/components/sections/FinalCta";
import OutreachShowcase from "./OutreachShowcase";

export const metadata: Metadata = {
  title: "Каталог расширений GigaCowork",
  description:
    "Плагины, интеграции и навыки GigaCowork с готовыми сценариями применения.",
};

export default function OutreachAcceleratorPage() {
  return (
    <>
      <OutreachShowcase />
      <FinalCta />
    </>
  );
}
