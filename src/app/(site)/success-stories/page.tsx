import type { Metadata } from "next";

import CasesFeed from "@/components/interactive/CasesFeed";
import { CTA_FALLBACK, CtaBackground } from "@/components/ui/CtaBackground";
import { Button } from "@/components/ui/Button";
import { HeroImage } from "@/components/ui/HeroImage";
import { VISIBLE_CASES } from "@/content/cases";
import { pageMetadata } from "@/lib/site";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

/**
 * «Истории успеха наших клиентов» — /success-stories
 *
 * Макеты: desktop 5021:26854 (Cases / Desktop 1440), mobile 5021:26904.
 * Секции сверху вниз:
 *   Hero      5021:26855 / 5021:26905 — короткий, 500 против обычных 760
 *   Контент   5021:26863 / 5021:26913 — фильтры, карточки, пагинация
 *   CTA       5021:26902 / 5021:26946
 * Шапка и подвал — общие из src/app/(site)/layout.tsx.
 *
 * Данные кейсов — `src/content/cases.ts`, тот же справочник, что и у блока
 * «Опыт клиентов» на главной.
 */

export const metadata: Metadata = pageMetadata({
  title: "Кейсы — истории успеха клиентов GigaCowork",
  description:
    "Как компании внедряют ИИ-агентов GigaCowork: подбор персонала, речевая аналитика, консультации клиентов. Результаты в цифрах и разбор каждого проекта.",
  path: "/success-stories/",
});

export default function SuccessStoriesPage() {
  return (
    <>
      {/* ── Hero (5021:26855 / 5021:26905) ── */}
      <section className="relative isolate flex min-h-[318px] w-full flex-col justify-end overflow-hidden bg-bg-page pt-[120px] pb-80 md:min-h-[500px] md:pt-[272px] md:pb-[104px]">
        <Breadcrumbs items={[{ label: "Кейсы" }]} />
        <HeroImage
          desktop="/img/cases/hero.webp"
          mobile="/img/cases/hero-mob.webp"
          className="pointer-events-none absolute inset-0 -z-10 size-full object-cover"
        />
        <div className="container-page flex flex-col items-center text-center md:items-start md:text-left">
          <h1 className="w-full text-h2 font-medium text-text-primary md:text-h1">
            Истории успеха
            <br />
            наших клиентов
          </h1>
        </div>
      </section>

      {/* ── Фильтры, карточки, пагинация (5021:26863 / 5021:26913) ── */}
      <section className="w-full bg-bg-page pt-48 pb-64 md:py-64">
        <div className="container-page">
          <CasesFeed cases={VISIBLE_CASES} />
        </div>
      </section>

      {/* ── CTA (5021:26902 / 5021:26946) ── */}
      <section
        className={`relative isolate w-full overflow-hidden py-64 md:py-160 ${CTA_FALLBACK}`}
        aria-labelledby="cases-cta-title"
      >
        <CtaBackground variant="slab" />
        <div className="container-page flex flex-col items-center gap-40">
          <h2
            id="cases-cta-title"
            className="max-w-[522px] text-center text-h3 font-medium text-text-primary md:text-h2"
          >
            Готовы делегировать задачи ИИ-агентам?
          </h2>
          <Button
            href="/lead"
            variant="primary"
            size="lg"
            className="text-body-m!"
          >
            Попробовать бесплатно
          </Button>
        </div>
      </section>
    </>
  );
}
