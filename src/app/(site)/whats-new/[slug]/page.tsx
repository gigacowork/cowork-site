import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Button from "@/components/ui/Button";
import { RELEASES, getRelease, type Block } from "@/content/releases";

/**
 * Страница релиза — /whats-new/[slug]
 *
 * Тексты приходят из src/content/releases.ts; здесь только вёрстка блоков.
 * Слева липкое оглавление (как «Содержание» в источнике), справа — разделы.
 * Стили те же, что на «Обучающих видео»: container-page, радиус 24, h2/h3/h4,
 * body-l/body-m, caption.
 */

export function generateStaticParams() {
  return RELEASES.map((release) => ({ slug: release.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const release = getRelease(slug);
  if (!release) return { title: "Релиз не найден — GigaCowork" };

  return {
    title: `${release.title} ${release.version} — GigaCowork`,
    description: release.summary,
  };
}

/** Тот же фон, что у финального CTA главной (2572:11130). */
const HERO_GRADIENT =
  "bg-[linear-gradient(245.7deg,#f0f8ff_20.714%,#f7f7f8_94.867%)] " +
  "md:bg-[linear-gradient(227.36deg,#f0f8ff_20.714%,#f7f7f8_94.867%)]";

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "text":
      return (
        <p className="text-body-m text-text-secondary md:text-body-l">
          {block.text}
        </p>
      );

    case "subhead":
      return (
        <h3 className="text-body-l font-medium text-text-primary md:text-h4">
          {block.text}
        </h3>
      );

    case "list":
      return (
        <ul className="flex flex-col gap-8">
          {block.items.map((item) => (
            <li
              key={item}
              className="relative pl-[20px] text-body-m text-text-secondary md:text-body-l"
            >
              <span
                aria-hidden
                className="absolute top-[8px] left-0 size-[6px] rounded-full bg-text-tertiary md:top-[9px]"
              />
              {item}
            </li>
          ))}
        </ul>
      );

    case "cards":
      return (
        <ul className="grid gap-16 sm:grid-cols-2 lg:grid-cols-3">
          {block.items.map((item) => (
            <li
              key={item.title}
              className={`flex flex-col gap-8 rounded-[16px] p-24 ${HERO_GRADIENT}`}
            >
              <span className="text-body-l font-medium text-text-primary">
                {item.title}
              </span>
              <span className="text-body-m text-text-secondary">{item.text}</span>
            </li>
          ))}
        </ul>
      );

    case "stats":
      return (
        <ul className="flex flex-wrap gap-24 md:gap-48">
          {block.items.map((item) => (
            <li key={item.label} className="flex max-w-[240px] flex-col gap-8">
              <span className="text-h2 font-medium text-text-primary">
                {item.value}
              </span>
              <span className="text-body-m text-text-secondary">
                {item.label}
              </span>
            </li>
          ))}
        </ul>
      );

    case "groups":
      return (
        <div className="flex flex-col gap-32">
          {block.items.map((group) => (
            <div key={group.title} className="flex flex-col gap-12">
              <h3 className="text-caption tracking-[0.12em] text-text-tertiary uppercase">
                {group.title}
              </h3>
              <ul className="grid gap-12 sm:grid-cols-2">
                {group.items.map((item) => (
                  <li
                    key={item.name}
                    className="flex flex-col gap-4 rounded-[16px] border border-border-subtle bg-bg-card p-16"
                  >
                    <span className="text-body-m font-medium text-text-primary">
                      {item.name}
                    </span>
                    <span className="text-caption text-text-secondary">
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );

    case "note":
      return (
        <div className="flex flex-col gap-8 rounded-[16px] border border-border-subtle bg-neutral-50 p-24">
          <p className="text-body-m text-text-secondary">
            {block.text}
            {block.email ? (
              <>
                {" "}
                <a
                  href={`mailto:${block.email}`}
                  className="text-text-primary underline underline-offset-2"
                >
                  {block.email}
                </a>
              </>
            ) : null}
          </p>
        </div>
      );
  }
}

export default async function ReleasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const release = getRelease(slug);
  if (!release) notFound();

  return (
    <>
      {/* Hero */}
      <section
        className={`w-full pt-[calc(48px+var(--header-h))] pb-48 md:pt-[calc(64px+var(--header-h))] md:pb-64 ${HERO_GRADIENT}`}
      >
        <div className="container-page flex flex-col gap-24">
          <Link
            href="/whats-new"
            className="text-body-m text-text-secondary transition-colors hover:text-text-primary"
          >
            ← Что нового
          </Link>

          <div className="flex flex-wrap items-center gap-8">
            <span className="rounded-full bg-action-primary-default px-12 py-4 text-caption text-text-inverse">
              {release.tag}
            </span>
            <span className="rounded-full bg-bg-page/70 px-12 py-4 text-caption text-text-secondary">
              Версия {release.version}
            </span>
            <time
              dateTime={release.date}
              className="text-caption text-text-tertiary"
            >
              {release.dateLabel}
            </time>
          </div>

          <h1 className="text-h3 font-medium text-neutral-1000 md:text-h2">
            {release.title}
          </h1>
          <p className="max-w-[720px] text-body-l text-text-secondary">
            {release.summary}
          </p>
        </div>
      </section>

      {/* Содержание + разделы */}
      <section className="w-full bg-bg-page py-48 md:py-80">
        <div className="container-page flex flex-col gap-40 lg:grid lg:grid-cols-[minmax(0,240px)_minmax(0,1fr)] lg:items-start lg:gap-64">
          {/* Оглавление */}
          <nav
            aria-label="Содержание релиза"
            className="lg:sticky lg:top-[calc(var(--header-h)+24px)]"
          >
            <p className="mb-12 text-caption tracking-[0.12em] text-text-tertiary uppercase">
              Содержание
            </p>
            <ul className="flex flex-col gap-4">
              {release.sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="block rounded-[10px] px-12 py-8 text-body-m text-text-secondary transition-colors hover:bg-neutral-100 hover:text-text-primary"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Разделы */}
          <div className="flex flex-col gap-48 md:gap-64">
            {release.sections.map((section) => (
              <article
                key={section.id}
                id={section.id}
                className="flex scroll-mt-[calc(var(--header-h)+24px)] flex-col gap-16"
              >
                <h2 className="text-h4 font-medium text-text-primary md:text-h3">
                  {section.title}
                </h2>
                {section.blocks.map((block, i) => (
                  <BlockView key={i} block={block} />
                ))}
              </article>
            ))}

            {/* Нижний CTA */}
            <div
              className={`flex flex-col items-center gap-24 rounded-[24px] px-24 py-40 text-center md:px-48 md:py-48 ${HERO_GRADIENT}`}
            >
              <p className="text-h4 font-medium text-text-primary md:text-h3">
                Начните использовать GigaCowork уже сегодня
              </p>
              <p className="max-w-[560px] text-body-m text-text-secondary">
                Мы хотим, чтобы технологии снижали нагрузку на сотрудников и
                упрощали работу всей компании, поэтому описываем и обучаем разным
                сценариям использования ИИ-агентов.
              </p>
              <div className="flex flex-wrap justify-center gap-16">
                <Button
                  href="/lead"
                  variant="primary"
                  size="lg"
                  className="text-body-m!"
                >
                  Попробовать продукт
                </Button>
                <Button
                  href="/video"
                  variant="secondary"
                  size="lg"
                  className="text-body-m!"
                >
                  Обучающие видео
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
