import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Kicker } from "@/components/ui/Kicker";
import { FinalCta } from "@/components/sections/FinalCta";
import { Lines } from "@/components/use-cases/Lines";
import { ScenarioStack } from "@/components/use-cases/ScenarioStack";
import { UseCaseBenefits } from "@/components/use-cases/UseCaseBenefits";
import { UseCaseHero } from "@/components/use-cases/UseCaseHero";
import { UseCaseMetrics } from "@/components/use-cases/UseCaseMetrics";
import { UseCaseSteps } from "@/components/use-cases/UseCaseSteps";
import { getUseCase, USE_CASES } from "@/lib/use-cases";

/**
 * Страницы «Для кого» — /use_cases/[slug].
 *
 * Один шаблон на все восемь ролей: в макете собрана HR-версия (2616:11204 и
 * далее, мобайл 2656:11527), остальные роли отличаются только текстом. Поэтому
 * здесь вёрстка, а весь контент — в src/lib/use-cases.ts.
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

  return (
    <>
      <UseCaseHero
        title={useCase.title}
        intro={useCase.intro}
        image={useCase.heroImage}
      />

      <UseCaseMetrics items={useCase.metrics} />

      {/* ── Какие задачи решают агенты (2616:11235 / 2787:16163) ── */}
      <section className="w-full bg-bg-page py-64 md:py-120">
        <div className="container-page flex flex-col gap-48 md:gap-96">
          <div className="flex flex-col items-center gap-24 text-center md:items-start md:text-left">
            <Kicker>Применение</Kicker>
            <h2 className="text-h3 font-medium text-text-primary md:max-w-[800px] md:text-h2">
              <Lines text={useCase.scenariosTitle} />
            </h2>
          </div>

          <ScenarioStack items={useCase.scenarios} />
        </div>
      </section>

      <UseCaseSteps title={useCase.stepsTitle} items={useCase.steps} />

      <UseCaseBenefits items={useCase.benefits} />

      <FinalCta surface="page" />
    </>
  );
}
