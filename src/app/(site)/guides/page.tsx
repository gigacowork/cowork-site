import { asset } from "@/lib/asset";
import { JsonLd } from "@/components/seo/JsonLd";
import { PAGE_SEO } from "@/content/seo";
import { seoMetadata } from "@/lib/site";
import type { Metadata } from "next";
import Button from "@/components/ui/Button";
import { CTA_FALLBACK, CtaBackground } from "@/components/ui/CtaBackground";
import VideoGuides from "@/components/interactive/VideoGuides";

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

type Guide = {
  id: string;
  /** короткая подпись для таба */
  tab: string;
  number: string;
  title: string;
  /** абзацы описания (во втором ролике источника их два) */
  paragraphs: string[];
  video: string;
};

const GUIDES: Guide[] = [
  {
    id: "overview",
    tab: "Обзор платформы",
    number: "01",
    title: "Обзор возможностей платформы",
    paragraphs: [
      "Первый релиз GigaCowork\u00A0— это все необходимое для\u00A0продуктивной работы: от\u00A0анализа документов до\u00A0автоматизации рутинных задач.",
      "Делегируйте работу агентам уже сегодня: добавляйте документы, навыки, подключайте свои системы и\u00A0приглашайте коллег к\u00A0совместной работе.",
    ],
    video: "/video/overview.mp4",
  },
  {
    id: "first-task",
    tab: "Первый запуск",
    number: "02",
    title: "Первый запуск: как\u00A0поставить задачу",
    paragraphs: [
      "Откройте платформу и\u00A0просто напишите, что\u00A0нужно сделать. Своими словами, как\u00A0коллеге. Агент сам разберется в\u00A0задаче, найдет нужные документы и\u00A0предложит решение. Никаких настроек перед стартом. Поставьте первую задачу прямо сейчас.",
    ],
    video: "/video/first-task.mp4",
  },
  {
    id: "agent-skill",
    tab: "Навыки",
    number: "03",
    title: "Как\u00A0создать навык для\u00A0агента",
    paragraphs: [
      "Навык\u00A0— это набор правил, по\u00A0которым агент решает задачу. Например, оформлять документы в\u00A0фирменном стиле или\u00A0разбирать предложения поставщиков по\u00A0вашим правилам. Опишите задачу максимально подробно, как\u00A0должностную инструкцию, один раз и\u00A0сохраните как\u00A0навык. Дальше агент применит его сам, когда понадобится.",
    ],
    video: "/video/agent-skill.mp4",
  },
  {
    id: "quick-commands",
    tab: "Команды",
    number: "04",
    title: "Быстрые команды",
    paragraphs: [
      "Запросы, которые вы повторяете каждый день, сохраните как /команду. Например, если нужно ежедневно формировать отчеты или\u00A0анализировать ТКП, договоры и\u00A0прочие документы. Один символ вместо длинного описания задачи. Команда запускает нужный сценарий за\u00A0секунду.",
    ],
    video: "/video/quick-commands.mp4",
  },
  {
    id: "connectors",
    tab: "Коннекторы",
    number: "05",
    title: "Как\u00A0подключить корпоративные системы",
    paragraphs: [
      "Агент работает с\u00A0вашими сервисами напрямую через открытый стандарт MCP. В\u00A0релизе уже 19\u00A0готовых коннекторов к\u00A0самым популярным системам. Выберите нужный сервис из\u00A0списка и\u00A0подключите за\u00A0пару кликов. Дальше агент берет данные оттуда сам.",
    ],
    video: "/video/connectors.mp4",
  },
  {
    id: "spaces",
    tab: "Пространства",
    number: "06",
    title: "Как\u00A0добавить коллег и\u00A0создать общие документы",
    paragraphs: [
      "Пространство хранит знания и\u00A0документы одного проекта отдельно от\u00A0других. Откройте доступ коллегам, и\u00A0вы работаете над\u00A0задачами вместе. Общие документы видны всей команде и\u00A0обновляются для\u00A0всех сразу. Соберите проект в\u00A0одном месте и\u00A0пригласите тех, кому он нужен.",
    ],
    video: "/video/spaces.mp4",
  },
];

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
                    poster={asset(`/img/guides/${guide.id}-poster.webp`)}
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

          {/* Нижний CTA */}
          <div
            className={`relative isolate flex flex-col items-center gap-24 overflow-hidden rounded-[24px] px-24 py-40 text-center md:px-48 md:py-48 ${CTA_FALLBACK}`}
          >
            <CtaBackground />
            <p className="text-h4 font-medium text-text-primary md:text-h3">
              Узнайте больше о&nbsp;платформе
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
    </VideoGuides>
  );
}
