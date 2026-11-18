import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { keepLegalFormWithName } from "@/lib/typography";

import { Button } from "@/components/ui/Button";
import { CTA_FALLBACK, CtaBackground } from "@/components/ui/CtaBackground";
import { HeroImage } from "@/components/ui/HeroImage";
import { Image } from "@/components/ui/Image";
import CountUp from "@/components/interactive/CountUp";
import { LogoSlot } from "@/components/cases/CaseCard";
import {
  CASES_WITH_STORY,
  findCase,
  type CaseStudy,
  type StoryBlock,
  type StoryMetric,
} from "@/content/cases";
import { pageMetadata } from "@/lib/site";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

/**
 * Страница кейса — /success-stories/[slug]
 *
 * Макеты: desktop 5136:51867 (Case only / Desktop 1440), mobile 5136:51885.
 * Секции сверху вниз:
 *   Hero       5136:51868 / 5136:51886 — заголовок и лид
 *   Контент    5136:52440 / 5136:51893 — метрики, статья, карточка компании
 *   CTA        5136:51883 / 5136:51899
 *
 * Страница типовая: разметка одна на все кейсы, различаются только данные
 * из `story` в `src/content/cases.ts`. Собирается только для кейсов, где
 * `story` заполнен, — `generateStaticParams` перечисляет именно их.
 *
 * Раскладка в две колонки (894 + 282) включается с lg: на 768 сайдбар 282
 * оставил бы статье 440 и порвал бы строки. Ниже lg карточка компании
 * встаёт между метриками и статьёй, как в мобильном макете.
 */

export function generateStaticParams() {
  return CASES_WITH_STORY.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = findCase(slug);
  if (!study) return {};

  return pageMetadata({
    title: `${study.story.company.name} — кейс GigaCowork`,
    description: study.story.lead,
    path: `/success-stories/${slug}/`,
  });
}

/* ─────────────────────────── блоки страницы ────────────────────────────── */

/** Metric / Content 1562:3014 — число Display/XL и подпись Body/L. */
function Metric({ metric }: { metric: StoryMetric }) {
  const displayValue = metric.sourceValue ?? `${metric.prefix ?? ""}${metric.value}${metric.suffix ?? ""}`;
  const parts = /^(\D*?)(\d+(?:[.,]\d+)?(?:[–-]\d+(?:[.,]\d+)?)?%?)(.*)$/u.exec(displayValue);
  const prefix = parts?.[1] ?? "";
  const number = parts?.[2] ?? displayValue;
  const suffix = parts?.[3] ?? "";
  const canAnimate = !metric.sourceValue && metric.animate !== false && /^\d+$/.test(metric.value);
  const numberClass = prefix.trim().length > 1 || number.length > 3 || suffix.trim().length > 3
    ? "text-display-l lg:text-[clamp(80px,7vw,112px)]"
    : "text-display-l lg:text-[clamp(96px,8vw,128px)]";

  return (
    <li className="flex w-full min-w-0 flex-none flex-col items-center gap-16 lg:w-auto lg:flex-1 lg:basis-0">
      <p className="flex max-w-full items-baseline justify-center whitespace-nowrap text-text-primary">
        {prefix ? <span className="mr-4 text-h3 font-normal lg:text-h2">{prefix}</span> : null}
        <span className={`${numberClass} font-normal leading-none`}>
          {canAnimate ? (
            <>
              <span data-counter data-counter-value={metric.value}>{metric.value}</span>
              {number.slice(metric.value.length)}
            </>
          ) : number}
        </span>
        {suffix ? <span className="ml-4 text-h4 font-normal lg:text-h3">{suffix}</span> : null}
      </p>
      <p className="w-full max-w-[307px] text-center text-body-l text-text-primary">
        {metric.label.split("\n").map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </p>
    </li>
  );
}

/** Card / Case Company / Desktop 5168:15418 — правая колонка 282. */
function CompanyCard({ study }: { study: CaseStudy }) {
  const company = study.story!.company;

  return (
    <div className="flex flex-col gap-32 rounded-24 border border-border-subtle bg-[linear-gradient(60.08deg,#C5F8E5_0.95%,#DCF9FF_50.8%,#E4F5FF_101.64%)] p-24 shadow-drop-md">
      {/* В кейсах из DOCX название компании — часть исходного текста. */}
      {study.logo ? <LogoSlot study={study} /> : null}

      <div className="flex flex-col gap-12">
        {!study.logo || study.story?.sourceCategory ? (
          <p className="text-h3 font-medium text-text-primary">{keepLegalFormWithName(company.name)}</p>
        ) : null}
        <p className="text-body-m text-text-secondary">{company.description}</p>
      </div>

      {company.automation ? (
        <div className="flex flex-col gap-8">
          <p className="text-h4 font-medium text-text-primary">
            Область автоматизации
          </p>
          <p className="text-body-l text-text-secondary">{company.automation}</p>
        </div>
      ) : null}

      {company.territorialBank ? (
        <span className="max-w-full self-start whitespace-pre-line rounded-16 bg-bg-tag px-12 py-8 text-caption text-text-primary">
          {company.territorialBank}
        </span>
      ) : null}

    </div>
  );
}

/** Заглушка вместо кадра интерфейса — исходников пока нет (как на /media). */
function ArticlePlaceholder() {
  return (
    <div
      aria-hidden
      className="flex aspect-[768/400] w-full items-center justify-center rounded-24 border border-[#f5f5f5] bg-[linear-gradient(135deg,#e3ecf7_0%,#eef3f8_100%)] shadow-drop-lg"
    >
      <span className="text-caption text-text-tertiary">Кадр интерфейса</span>
    </div>
  );
}

function Block({ block }: { block: StoryBlock }) {
  switch (block.type) {
    case "task":
      return (
        <div className="flex flex-col gap-12 md:gap-16">
          <h2 className="text-h3 font-medium text-text-primary md:text-h2">Задача</h2>
          <h3 className="text-h4 font-medium text-text-primary">{block.text}</h3>
        </div>
      );

    case "heading":
      return (
        <h2 className="mt-12 text-h3 font-medium text-text-primary md:mt-16 md:text-h2">
          {block.text}
        </h2>
      );

    case "subheading":
      return <h3 className="text-h4 font-medium text-text-primary">{block.text}</h3>;

    case "text":
      return <p className="text-body-l text-text-primary">{block.text}</p>;

    case "richText":
      return (
        <p className="text-body-l text-text-primary">
          {block.parts.map((part, index) => (
            <span key={index} className={part.bold ? "font-semibold" : undefined}>{part.text}</span>
          ))}
        </p>
      );

    /* Article Callout 5173:54004 — Heading/H4 на подложке bg-footer */
    case "callout":
      return (
        <div className="rounded-24 bg-bg-footer p-24 md:p-[30px]">
          <p className="text-h4 font-medium text-text-primary">{block.text}</p>
        </div>
      );

    /* Article Image 5173:53988 — кадр 768×400 и подпись под ним */
    case "image":
      /* max-w, а не w: на 768 колонка уже 755 и страница уезжала вбок */
      return (
        <figure className="mx-auto flex w-full max-w-[755px] flex-col gap-8">
          {block.src ? (
            /*
              Кадр подменяет слот целиком, а не ложится внутрь него: рамка,
              скругление и тень нарисованы в самом файле, поля вокруг вырезаны
              прозрачностью. Со стилями слота получалась карточка в карточке, а
              `object-cover` подрезал бы кадр, если пропорции файла и слота
              разойдутся. Тот же приём, что у превью в `ScenarioStack`.

              Высоту задаёт сам файл: размеры здесь — из исходника, чтобы
              браузер держал место до загрузки и страница не прыгала.
            */
            <Image
              src={block.src}
              alt={block.caption}
              width={835}
              height={543}
              className="h-auto w-full"
            />
          ) : (
            <ArticlePlaceholder />
          )}
          <figcaption className="text-body-m text-text-tertiary">
            {block.caption}
          </figcaption>
        </figure>
      );

    /* Info Card 5173:54044 — цитата с кавычкой */
    case "quote":
      return (
        <figure className="flex flex-col gap-16 rounded-24 bg-bg-footer p-24 md:gap-24 md:p-[30px]">
          {/*
            Кавычка — не через `Icon`: в макете она залита градиентом
            (#00B8CA → #1CBBF3 → #9FB6F8), а маска взяла бы один цвет.
          */}
          <Image
            src="/img/cases/quote.svg"
            alt=""
            width={40}
            height={19}
            className="h-[19px] w-[40px]"
          />
          <blockquote className="flex flex-col gap-16">
            {block.text.map((paragraph) => (
              <p key={paragraph} className="text-body-l text-text-primary">
                {paragraph}
              </p>
            ))}
          </blockquote>
          <figcaption className="flex flex-col text-body-m text-text-tertiary">
            {block.author ? <span>{block.author}</span> : null}
            <span>{block.role}</span>
          </figcaption>
        </figure>
      );

    case "disclaimer":
      return <p className="text-body-m text-text-tertiary">{block.text}</p>;
  }
}

/* ─────────────────────────────── страница ──────────────────────────────── */

export default async function CaseStoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = findCase(slug);
  if (!study) notFound();

  const { story } = study;
  const company = <CompanyCard study={study} />;

  return (
    <>
      {/* ── Hero (5136:51868 / 5136:51886) ── */}
      <section className="relative isolate flex min-h-[539px] w-full flex-col justify-end overflow-hidden bg-bg-page pt-[120px] pb-80 md:min-h-[500px] md:pt-[160px] md:pb-[73px]">
        <Breadcrumbs
          items={[
            { label: "Кейсы", href: "/special-project/" },
            { label: study.company },
          ]}
        />
        {/*
          Кадр у детальной страницы свой: у ленты hero ниже (318 на телефоне),
          и её мобильный кадр 780×636 на экране кейса (539) растянулся бы.
        */}
        <HeroImage
          desktop="/img/cases/case-hero.webp"
          mobile="/img/cases/case-hero-mob.webp"
          className="pointer-events-none absolute inset-0 -z-10 size-full object-cover"
        />
        <div className="container-page flex flex-col items-center gap-16 text-center md:items-start md:gap-24 md:text-left">
          {story.sourceCategory ? (
            <p className="w-full text-body-m text-text-secondary">{story.sourceCategory}</p>
          ) : null}
          <h1 className="w-full text-h2 font-medium text-text-primary md:text-h1">
            {story.title}
          </h1>
          <p className="w-full text-body-l text-text-secondary">{story.lead}</p>
        </div>
      </section>

      {/* ── Контент (5136:52440 / 5136:51893) ── */}
      <section className="w-full bg-bg-page pt-64 pb-64 md:py-64">
        <div className="container-page lg:grid lg:grid-cols-[894fr_282fr] lg:items-start lg:gap-24">
          <div className="flex flex-col gap-16 md:gap-24">
            {/* Metrics — 5160:53327 / 5173:54064 */}
            <CountUp>
              <ul className="flex flex-col items-center gap-40 pb-48 lg:flex-row lg:justify-center lg:gap-24 lg:pb-32">
                {story.metrics.map((metric) => (
                  <Metric key={metric.label} metric={metric} />
                ))}
              </ul>
            </CountUp>

            {/* Ниже lg карточка компании стоит здесь, как в мобильном макете */}
            <div className="lg:hidden">{company}</div>

            {story.blocks.map((block, index) => (
              <Block key={`${block.type}-${index}`} block={block} />
            ))}

            <div className="pt-8">
              <Button
                href="/special-project/#special-project-cases"
                variant="secondary"
                size="lg"
              >
                Читать другие кейсы
              </Button>
            </div>
          </div>

          <aside className="hidden lg:block">{company}</aside>
        </div>
      </section>

      {/* ── CTA (5136:51883 / 5136:51899) ── */}
      <section
        className={`relative isolate w-full overflow-hidden py-64 md:py-160 ${CTA_FALLBACK}`}
        aria-labelledby="case-cta-title"
      >
        <CtaBackground />
        <div className="container-page flex flex-col items-center gap-40">
          <h2
            id="case-cta-title"
            className="max-w-[522px] text-center text-h3 font-medium text-text-primary md:text-h2"
          >
            Готовы делегировать задачи ИИ-агентам?
          </h2>
          <Button
            href="/lead"
            variant="primary"
            size="lg"
            className="text-body-m!"
            data-metrica-goal="footer-try"
          >
            Попробовать бесплатно
          </Button>
        </div>
      </section>
    </>
  );
}
