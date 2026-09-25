import { asset } from "@/lib/asset";
import { JsonLd } from "@/components/seo/JsonLd";
import { PAGE_SEO } from "@/content/seo";
import { seoMetadata } from "@/lib/site";
import type { Metadata } from "next";
import Button from "@/components/ui/Button";
import { CTA_FALLBACK, CtaBackground } from "@/components/ui/CtaBackground";
import VideoGuides from "@/components/interactive/VideoGuides";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { GUIDES, guidePoster } from "@/content/guides";

/**
 * «Обучающие видео» — /video
 *
 * Источник: «Исходники Обучающие видео/index.html». Тексты, порядок роликов,
 * табы и нижний CTA перенесены оттуда дословно; вёрстка переписана на систему
 * главной страницы — те же токены (container-page, text-h2/h3, body-l, caption,
 * радиус 24, Elevation/Drop), тот же Button и те же брейкпоинты.
 *
 * Шапка и подвал не объявляются здесь: они лежат в src/app/layout.tsx и общие
 * для всех страниц сайта.
 *
 * Хуки для интерактива: `data-guide-tab`, `data-guide-item`, `data-guide-video`.
 */

export const metadata: Metadata = seoMetadata(PAGE_SEO.guides);

/** Тот же фон, что у финального CTA главной (2572:11130). */
const HERO_GRADIENT =
  "bg-[linear-gradient(245.7deg,#f0f8ff_20.714%,#f7f7f8_94.867%)] " +
  "md:bg-[linear-gradient(227.36deg,#f0f8ff_20.714%,#f7f7f8_94.867%)]";

export default function VideoGuidesPage() {
  return (
    <VideoGuides>
      <JsonLd data={PAGE_SEO.guides.jsonLd!} />

      {/*
        Hero.

        `id="hero"` — не украшение: по нему шапка понимает, что находится над
        hero, и остаётся прозрачной, пропуская фон под навигацию. Пока его не
        было, Header считал страницу «без hero» и с самого верха закрывал
        градиент сплошной заливкой (см. src/components/sections/Header.tsx).

        Верхний отступ включает высоту шапки: она фиксированная и лежит поверх
        секции, поэтому место под неё резервирует сам hero.

        Вертикальный ритм взят с hero главной (1927:15554 — 1440×685, pt-160 /
        pb-80; мобильный 1927:17359 — pt-120 / pb-64). Там высоту набирает
        встроенный чат, здесь текста заметно меньше, поэтому высота задана
        напрямую, а содержимое центрируется по вертикали — иначе весь запас
        собрался бы пустотой под текстом.
      */}
      <section
        id="hero"
        className={`w-full pt-[calc(120px+var(--header-h))] pb-64 md:pt-[calc(160px+var(--header-h))] md:pb-80 ${HERO_GRADIENT}`}
      >
        <div className="container-page flex flex-col gap-16">
          {/* hero без растрового фона — крошки стоят в потоке, а не абсолютом */}
          <Breadcrumbs variant="inline" items={[{ label: "Обучающие видео" }]} />
          <h1 className="text-h3 font-medium text-neutral-1000 md:text-h2">
            Начните работать
            <br />
            с&nbsp;GigaCowork
          </h1>
          <p className="max-w-[560px] text-body-l text-text-secondary">
            Короткие видео помогут разобраться в&nbsp;основных возможностях
            платформы и&nbsp;покажут, как&nbsp;делегировать задачи ИИ-агентам.
          </p>
        </div>
      </section>

      {/* Ролики */}
      <section className="bg-bg-page w-full py-48 md:py-80">
        <div className="container-page flex flex-col gap-48 md:gap-64">
          {/* Табы — навигация по роликам */}
          <nav aria-label="Разделы видеоинструкций">
            <ul className="no-scrollbar -mx-16 flex gap-8 overflow-x-auto px-16 md:mx-0 md:flex-wrap md:px-0">
              {GUIDES.map((guide) => (
                <li key={guide.id} className="shrink-0">
                  <a
                    href={`#${guide.id}`}
                    data-guide-tab={guide.id}
                    className="flex cursor-pointer items-center justify-center rounded-full bg-bg-card py-8 pl-16 pr-[18px] text-body-m whitespace-nowrap text-text-secondary shadow-[inset_0_0_0_1px_var(--color-border-subtle)] transition-[box-shadow,background-color,color] duration-200 hover:bg-action-secondary-hover hover:text-text-primary hover:shadow-[inset_0_0_0_1px_var(--color-border-default)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary aria-[current=true]:bg-action-primary-default aria-[current=true]:text-text-inverse aria-[current=true]:shadow-none"
                  >
                    {guide.tab}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <ul className="flex flex-col gap-64 md:gap-96">
            {GUIDES.map((guide) => (
              <li
                key={guide.id}
                id={guide.id}
                data-guide-item={guide.id}
                className="flex scroll-mt-[calc(var(--header-h)+24px)] flex-col gap-24 md:grid md:grid-cols-[minmax(0,340px)_minmax(0,1fr)] md:items-start md:gap-40"
              >
                {/* Текстовая колонка */}
                <div className="flex flex-col gap-12">
                  <span className="text-caption tracking-[0.12em] text-text-tertiary uppercase">
                    {guide.number}
                  </span>
                  <h2 className="text-h4 font-medium text-text-primary md:text-h3">
                    {guide.title}
                  </h2>
                  {guide.paragraphs.map((text) => (
                    <p
                      key={text}
                      className="text-body-m text-text-secondary md:text-body-l"
                    >
                      {text}
                    </p>
                  ))}
                </div>

                {/* Видео */}
                <div
                  data-guide-video
                  className="relative aspect-video w-full overflow-hidden rounded-[24px] border border-border-subtle bg-neutral-50 shadow-drop-sm transition-shadow duration-300 hover:shadow-drop-lg"
                >
                  <video
                    src={asset(guide.video)}
                    /*
                      Постер — первый кадр ролика. Нужен не только глазу (без
                      него до запуска видна чёрная плашка), но и микроразметке:
                      у VideoObject поле thumbnailUrl обязательное, и ссылается
                      оно на этот же файл (см. src/content/seo.ts).
                    */
                    poster={asset(guidePoster(guide.id))}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    aria-label={guide.title}
                    className="absolute inset-0 size-full object-cover"
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/*
        CTA — такой же, как на остальных страницах: секция во всю ширину
        с кадром-подложкой, а не карточка внутри контентной секции.
        Ритм и кегль взяты оттуда же (например, /pricing): py-64 / md:py-160,
        шаг 40, заголовок H3 → H2. Текст остался свой.
      */}
      <section
        className={`relative isolate w-full overflow-hidden py-64 md:py-160 ${CTA_FALLBACK}`}
      >
        <CtaBackground />
        <div className="container-page flex flex-col items-center gap-40">
          <h2 className="max-w-[522px] text-center text-h3 font-medium text-text-primary md:text-h2">
            Узнайте больше <br className="hidden md:block" />
            о&nbsp;платформе
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
    </VideoGuides>
  );
}
