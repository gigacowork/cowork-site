import type { Metadata } from "next";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { CTA_FALLBACK, CtaBackground } from "@/components/ui/CtaBackground";
import { RELEASES } from "@/content/releases";

/**
 * «Что нового» — /whats-new
 *
 * Разводящая по релизам. Макета в Figma нет, поэтому страница собрана из
 * готовых элементов системы: тот же градиент героя, что у «Обучающих видео»
 * (2572:11130), карточки радиусом 24 и типографика h2/h3/body-l.
 *
 * Список берётся из src/content/releases.ts: первый релиз показывается крупной
 * карточкой, остальные — компактным списком ниже.
 */

export const metadata: Metadata = {
  title: "Что\u00A0нового\u00A0— GigaCowork",
  description:
    "Релизы и\u00A0обновления платформы GigaCowork: новые возможности агентов, навыки, команды, пространства и\u00A0коннекторы.",
};

/** Тот же фон, что у финального CTA главной (2572:11130). */
const HERO_GRADIENT =
  "bg-[linear-gradient(245.7deg,#f0f8ff_20.714%,#f7f7f8_94.867%)] " +
  "md:bg-[linear-gradient(227.36deg,#f0f8ff_20.714%,#f7f7f8_94.867%)]";

export default function WhatsNewPage() {
  const [latest, ...rest] = RELEASES;

  return (
    <>
      {/* Hero */}
      <section
        className={`w-full pt-[calc(64px+var(--header-h))] pb-48 md:pt-[calc(80px+var(--header-h))] md:pb-64 ${HERO_GRADIENT}`}
      >
        <div className="container-page flex flex-col gap-16">
          <h1 className="text-h3 font-medium text-neutral-1000 md:text-h2">
            Что&nbsp;нового
          </h1>
          <p className="max-w-[560px] text-body-l text-text-secondary">
            Рассказываем, что&nbsp;изменилось в&nbsp;платформе: новые возможности агентов,
            навыки и&nbsp;команды, пространства и&nbsp;коннекторы к&nbsp;внешним системам.
          </p>
        </div>
      </section>

      {/* Список релизов */}
      <section className="w-full bg-bg-page py-48 md:py-80">
        <div className="container-page flex flex-col gap-48 md:gap-64">
          {/* Последний релиз — крупной карточкой */}
          <article
            className={`flex flex-col gap-24 rounded-[24px] p-24 md:p-48 ${HERO_GRADIENT}`}
          >
            <div className="flex flex-wrap items-center gap-8">
              <span className="rounded-full bg-action-primary-default py-4 pl-12 pr-[14px] text-caption text-text-inverse">
                {latest.tag}
              </span>
              <span className="rounded-full bg-bg-page/70 py-4 pl-12 pr-[14px] text-caption text-text-secondary">
                Версия {latest.version}
              </span>
              <time
                dateTime={latest.date}
                className="text-caption text-text-tertiary"
              >
                {latest.dateLabel}
              </time>
            </div>

            <div className="flex flex-col gap-16">
              <h2 className="text-h4 font-medium text-text-primary md:text-h3">
                {latest.title}
              </h2>
              <p className="max-w-[720px] text-body-m text-text-secondary md:text-body-l">
                {latest.summary}
              </p>
            </div>

            <ul className="flex flex-wrap gap-8">
              {latest.highlights.map((item) => (
                <li
                  key={item}
                  className="rounded-full bg-bg-page/70 py-8 pl-12 pr-[14px] text-caption text-text-primary"
                >
                  {item}
                </li>
              ))}
            </ul>

            <div>
              <Button
                href={`/ai-platform/new-features/${latest.slug}`}
                variant="primary"
                size="lg"
                className="text-body-m!"
              >
                Читать релиз
              </Button>
            </div>
          </article>

          {/* Предыдущие релизы */}
          {rest.length > 0 ? (
            <div className="flex flex-col gap-24">
              <h2 className="text-h4 font-medium text-text-primary">
                Предыдущие релизы
              </h2>
              <ul className="flex flex-col gap-16">
                {rest.map((release) => (
                  <li key={release.slug}>
                    <Link
                      href={`/ai-platform/new-features/${release.slug}`}
                      className="flex flex-col gap-8 rounded-[24px] border border-border-subtle bg-bg-card p-24 transition-shadow duration-300 hover:shadow-drop-sm md:flex-row md:items-center md:justify-between md:gap-24"
                    >
                      <span className="flex flex-col gap-4">
                        <span className="text-body-l font-medium text-text-primary">
                          {release.title}
                        </span>
                        <span className="text-body-m text-text-secondary">
                          Версия {release.version} · {release.dateLabel}
                        </span>
                      </span>
                      <span className="text-body-m whitespace-nowrap text-text-secondary">
                        Открыть
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-body-m text-text-tertiary">
              Это первый релиз платформы. Следующие обновления будут появляться
              здесь&nbsp;— от&nbsp;версии к&nbsp;версии.
            </p>
          )}

          {/* Нижний CTA */}
          <div
            className={`relative isolate flex flex-col items-center gap-24 overflow-hidden rounded-[24px] px-24 py-40 text-center md:px-48 md:py-48 ${CTA_FALLBACK}`}
          >
            <CtaBackground />
            <p className="text-h4 font-medium text-text-primary md:text-h3">
              Попробуйте новые возможности
            </p>
            <Button
              href="/lead"
              variant="primary"
              size="lg"
              className="text-body-m!"
            >
              Попробовать бесплатно
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
