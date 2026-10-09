import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FinalCta } from "@/components/sections/FinalCta";
import { Button } from "@/components/ui/Button";
import { Kicker } from "@/components/ui/Kicker";
import { Lines } from "@/components/use-cases/Lines";
import { ScenarioStack } from "@/components/use-cases/ScenarioStack";
import { UseCaseHero } from "@/components/use-cases/UseCaseHero";
import { UseCaseSteps } from "@/components/use-cases/UseCaseSteps";
import { SMB_COURSE_TITLE } from "@/content/ai-for-smb";
import { pageMetadata } from "@/lib/site";
import {
  getSmbUseCase,
  SMB_TARIFF_PATH,
  SMB_USE_CASES,
  smbUseCasePath,
} from "@/lib/smb-use-cases";

export const dynamicParams = false;

export function generateStaticParams() {
  return SMB_USE_CASES.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = getSmbUseCase(slug);
  if (!item) return {};

  return pageMetadata({
    title: `${item.title} — GigaCowork для малого бизнеса`,
    description: item.intro.join(" "),
    path: `${smbUseCasePath(slug)}/`,
  });
}

export default async function SmbUseCasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getSmbUseCase(slug);
  if (!item) notFound();

  return (
    <>
      <UseCaseHero
        title={item.title}
        breadcrumb={item.navLabel}
        intro={item.intro}
        ctaLabel="Посмотреть сценарии"
        ctaHref="#application"
      />

      <section
        id="application"
        className="w-full scroll-mt-[calc(var(--header-h)+24px)] bg-bg-page py-64 md:py-120"
      >
        <div className="container-page flex flex-col gap-48 md:gap-96">
          <div className="flex flex-col items-start gap-24 text-left">
            <Kicker className="self-center md:self-start">Применение</Kicker>
            <h2 className="text-h3 font-medium text-text-primary md:max-w-[800px] md:text-h2">
              <Lines text={item.scenariosTitle} />
            </h2>
          </div>
          <ScenarioStack
            items={item.scenarios}
            slug={item.slug}
            placeholderLabel="Здесь появится скриншот сценария"
          />
        </div>
      </section>

      <UseCaseSteps title={item.stepsTitle} items={[item.step]} />

      <section className="w-full bg-bg-page py-64 md:py-120">
        <div className="container-page flex flex-col items-start gap-24 text-left">
          <Kicker className="self-center md:self-start">Обучение</Kicker>
          <h2 className="text-h3 font-medium text-text-primary md:text-h2">
            {SMB_COURSE_TITLE}
          </h2>
          <p className="max-w-[620px] text-body-l text-text-secondary">
            Освойте GigaCowork на задачах малого бизнеса: от первого запроса
            до собственного агента и рабочего процесса для команды.
          </p>
          <Button href="/ai-academy/ai-for-smb" variant="primary" size="lg">
            Перейти к курсу
          </Button>
        </div>
      </section>

      <FinalCta
        title="Специальные тарифы для малого бизнеса"
        buttonLabel="Узнать подробнее"
        buttonHref={SMB_TARIFF_PATH}
      />
    </>
  );
}
