import type { Metadata } from "next";
import { Fragment } from "react";
import { notFound } from "next/navigation";
import { Kicker } from "@/components/ui/Kicker";
import { FinalCta } from "@/components/sections/FinalCta";
import { Lines } from "@/components/use-cases/Lines";
import { ScenarioStack } from "@/components/use-cases/ScenarioStack";
import { UseCaseBenefits } from "@/components/use-cases/UseCaseBenefits";
import { UseCaseHero } from "@/components/use-cases/UseCaseHero";
import { UseCaseMetrics } from "@/components/use-cases/UseCaseMetrics";
import { UseCaseProcess } from "@/components/use-cases/UseCaseProcess";
import { UseCaseSteps } from "@/components/use-cases/UseCaseSteps";
import {
  DEFAULT_ORDER,
  getUseCase,
  USE_CASES,
  type UseCaseSection,
} from "@/lib/use-cases";

/**
 * Страницы «Для кого» — /use_cases/[slug].
 *
 * Один шаблон на все восемь ролей: здесь вёрстка, а весь контент — в
 * src/lib/use-cases.ts.
 *
 * Порядок секций у ролей разный: у финансов «Применение» идёт перед метриками,
 * у закупок блок преимуществ поднят сразу под метрики. Поэтому порядок — тоже
 * часть данных роли (`order`), а не зашит в разметку. Секция без данных
 * молча пропускается, так что лишние ключи в списке безопасны.
 *
 * Адреса берутся из ПРОЕКТ_COWORK_RU.md, раздел «Релиз 1»: /use_cases/ceo,
 * /finance, /salesforce, /procurement, /legal-team, /hr-team, /accounting,
 * /it-support. Список маршрутов строится из тех же данных, что и выпадающее
 * меню «Для кого», — разъехаться они не могут.
 *
 * Сборка статическая (output: "export"), поэтому маршруты перечисляются
 * заранее в generateStaticParams, а `dynamicParams = false` закрывает всё
 * остальное 404-й вместо попытки отрендерить на лету.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return USE_CASES.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const useCase = getUseCase(slug);
  if (!useCase) return {};

  const title = useCase.title.replace(/\n/g, " ");

  return {
    title: `${title} — GigaCowork`,
    description: useCase.intro.join(" "),
  };
}

export default async function UseCasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const useCase = getUseCase(slug);
  if (!useCase) notFound();

  const sections: Record<UseCaseSection, React.ReactNode> = {
    metrics: useCase.metrics?.length ? (
      <UseCaseMetrics items={useCase.metrics} />
    ) : null,

    /* Применение (2616:11235 / 2787:16163) */
    scenarios: useCase.scenarios.length ? (
      <section className="w-full bg-bg-page py-64 md:py-120">
        <div className="container-page flex flex-col gap-48 md:gap-96">
          {/* Ниже md текст по левому краю, пилюля — по центру. */}
          <div className="flex flex-col items-start gap-24 text-left">
            <Kicker className="self-center md:self-start">Применение</Kicker>
            <h2 className="text-h3 font-medium text-text-primary md:max-w-[800px] md:text-h2">
              <Lines text={useCase.scenariosTitle} />
            </h2>
          </div>

          <ScenarioStack items={useCase.scenarios} slug={useCase.slug} />
        </div>
      </section>
    ) : null,

    steps: useCase.steps.length ? (
      <UseCaseSteps
        title={useCase.stepsTitle}
        lead={useCase.stepsLead}
        items={useCase.steps}
      />
    ) : null,

    process: useCase.process ? <UseCaseProcess {...useCase.process} /> : null,

    benefits: useCase.benefits.length ? (
      <UseCaseBenefits
        title={useCase.benefitsTitle}
        lead={useCase.benefitsLead}
        kicker={
          useCase.benefitsKicker === undefined
            ? "Преимущества"
            : useCase.benefitsKicker
        }
        items={useCase.benefits}
      />
    ) : null,
  };

  return (
    <>
      <UseCaseHero
        title={useCase.title}
        intro={useCase.intro}
        image={useCase.heroImage}
        imageMobile={useCase.heroImageMobile}
      />

      {(useCase.order ?? DEFAULT_ORDER).map((key) => (
        <Fragment key={key}>{sections[key]}</Fragment>
      ))}

      {/*
        Подложка та же, что на главной: в макете CTA страниц «Для кого»
        (2745:15473) стоит тот же градиент 227.36°, а не белый фон.
      */}
      <FinalCta title={useCase.ctaTitle} />
    </>
  );
}
