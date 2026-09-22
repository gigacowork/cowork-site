import type { Metadata } from "next";
import { notFound } from "next/navigation";

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
  return (
    <li className="flex min-w-0 flex-1 basis-[307px] flex-col items-center gap-16">
      {/*
        Число — Display/L (96), а не Display/XL (160) из макета. В макете
        метрики набраны без знаков сравнения и без трёхзначных чисел; с «≥»
        и «100» на 160 px три колонки по 294 px (статья 894) смыкаются
        вплотную, и числа соседних метрик слипаются.

        Знак сравнения набран кеглем суффикса, а не числа, — по той же
        причине: на крупном кегле «≥» съедает треть колонки.
      */}
      <p className="flex items-baseline whitespace-nowrap text-text-primary">
        {metric.prefix ? (
          <span className="text-h1 font-medium">{metric.prefix}</span>
        ) : null}
        {/*
          Счётчик — тот же, что в блоках метрик на главной и на страницах
          «Для кого»: `data-counter` оборачивает ТОЛЬКО цифры, чтобы знак
          сравнения и суффикс не пересчитывались вместе с ними.
        */}
        <span className="text-display-l font-normal">
          <span data-counter data-counter-value={metric.value}>
            {metric.value}
          </span>
        </span>
        {metric.suffix ? (
          <span className="text-h1 font-medium">{metric.suffix}</span>
        ) : null}
      </p>
      <p className="w-full text-center text-body-l text-text-primary">
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
    <div className="flex flex-col gap-32 rounded-24 border border-border-subtle bg-bg-card-lavender p-24 shadow-drop-md">
      {/*
        Слот логотипа — только когда файл есть: без него `LogoSlot` вывел бы
        название компании, а оно тут же стоит строкой ниже, и получалось два
        одинаковых «versta.io» подряд.
      */}
      {study.logo ? <LogoSlot study={study} /> : null}

      <div className="flex flex-col gap-12">
        <p className="text-h3 font-medium text-text-primary">{company.name}</p>
        <p className="text-body-m text-text-secondary">{company.description}</p>
      </div>

      <div className="flex flex-col gap-8">
        <p className="text-h4 font-medium text-text-primary">
          Область автоматизации
        </p>
        <p className="text-body-l text-text-secondary">{company.automation}</p>
      </div>

      {/* Технологии ещё не согласованы — пока список пуст, блока нет. */}
      {company.technologies.length ? (
        <div className="flex flex-col gap-12">
          <p className="text-h4 font-medium text-text-primary">Технологии</p>
          <ul className="flex flex-wrap gap-8">
            {company.technologies.map((item) => (
              <li
                key={item}
                className="rounded-full bg-bg-tag p-8 text-caption text-text-primary"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
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
    case "heading":
      return (
        <h2 className="text-h3 font-medium text-text-primary md:text-h2">
          {block.text}
        </h2>
      );

    case "text":
      return <p className="text-body-l text-text-primary">{block.text}</p>;

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
            <Image
              src={block.src}
              alt={block.caption}
              width={768}
              height={400}
              className="w-full rounded-24 border border-[#f5f5f5] object-cover shadow-drop-lg"
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
        <figure className="flex flex-col gap-20 rounded-24 bg-bg-footer p-24 md:p-[30px]">
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
            <span>{block.author}</span>
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
        <Breadcrumbs items={[
            { label: "Кейсы", href: "/success-stories" },
            { label: study.company },
          ]} />
        <HeroImage
          desktop="/img/cases/hero.webp"
          mobile="/img/cases/hero-mob.webp"
          className="pointer-events-none absolute inset-0 -z-10 size-full object-cover"
        />
        <div className="container-page flex flex-col items-center gap-16 text-center md:items-start md:gap-24 md:text-left">
          <h1 className="w-full text-h2 font-medium text-text-primary md:text-h1">
            {story.title}
          </h1>
          <p className="w-full text-body-l text-text-secondary">{story.lead}</p>
        </div>
      </section>

      {/* ── Контент (5136:52440 / 5136:51893) ── */}
      <section className="w-full bg-bg-page pt-48 pb-64 md:py-64">
        <div className="container-page lg:grid lg:grid-cols-[894fr_282fr] lg:items-start lg:gap-24">
          <div className="flex flex-col gap-32 md:gap-40">
            {/* Metrics — 5160:53327 / 5173:54064 */}
            {/* Зазор 24, а не 8 из макета: колонки уже макетных 307. */}
            <CountUp>
              <ul className="flex flex-col items-center gap-40 py-64 lg:flex-row lg:justify-center lg:gap-24 lg:py-0 lg:pb-32">
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
          >
            Попробовать бесплатно
          </Button>
        </div>
      </section>
    </>
  );
}
