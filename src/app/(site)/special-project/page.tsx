import type { Metadata } from "next";

import { OfficeCases } from "@/components/interactive/OfficeCases";
import { VISIBLE_CASES } from "@/content/cases";
import { pageMetadata } from "@/lib/site";
import { SpecialProjectHero } from "./SpecialProjectHero";

export const metadata: Metadata = pageMetadata({
  title: "От Калининграда до Владивостока — спецпроект GigaCowork",
  description:
    "Как ИИ-агенты GigaCowork меняют российский бизнес: реальные кейсы и результаты компаний по всей стране.",
  path: "/special-project/",
});

export default function SpecialProjectPage() {
  return (
    <>
      <SpecialProjectHero />

      <OfficeCases cases={VISIBLE_CASES} />
    </>
  );
}
