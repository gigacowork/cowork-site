import type { Metadata } from "next";
import FinalCta from "@/components/sections/FinalCta";
import { pageMetadata } from "@/lib/site";
import OutreachShowcase from "./OutreachShowcase";

export const metadata: Metadata = pageMetadata({
  title: "Каталог расширений GigaCowork",
  description:
    "Плагины, интеграции и навыки GigaCowork с готовыми сценариями применения.",
  path: "/marketplace-plugin/",
});

export default function OutreachAcceleratorPage() {
  return (
    <>
      <OutreachShowcase />
      <FinalCta />
    </>
  );
}
