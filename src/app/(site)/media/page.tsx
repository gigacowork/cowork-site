import type { Metadata } from "next";

import MediaFeed, { type Article } from "@/components/interactive/MediaFeed";
import SubscribeForm from "@/components/interactive/SubscribeForm";
import { HeroImage } from "@/components/ui/HeroImage";
import { Kicker } from "@/components/ui/Kicker";
import { pageMetadata } from "@/lib/site";

/**
 * «Медиа» — /media
 *
 * Макеты: desktop 4539:94849, mobile 4530:93740.
 * Секции сверху вниз:
 *   Hero      4539:94850 / 4530:93741 — короткий, 500 против обычных 760
 *   Фильтры   4539:94859 / 4530:93748
 *   Лента     4549:3002  / 4530:93757 — карточки, пагинация, «Читают чаще всего»
 *   Подписка  4579:97921 / 4530:93790
 *
 * Фотографии в карточках — заглушки: исходников для них нет, в макете стоят
 * рамки под снимки. Появятся файлы — меняется только `PhotoPlaceholder`
 * в `MediaFeed`.
 */

export const metadata: Metadata = pageMetadata({
  title: "Медиа — GigaCowork",
  description:
    "Новости GigaCowork, публикации в СМИ и блог о внедрении корпоративного ИИ: кейсы, руководства и разборы для тех, кто запускает ИИ-агентов в компании.",
  path: "/media/",
});

/* ──────────────────────────────── данные ───────────────────────────────── */

/** Материалы ленты (4549:3018). Порядок и типы карточек — как в макете. */
const ARTICLES: Article[] = [
  {
    tag: "СМИ о нас",
    date: "07 августа 2026",
    title:
      "СберБанк представил GigaCowork\u00A0— корпоративную платформу для\u00A0создания ИИ-агентов",
    text: "СберБанк предоставил доступ к\u00A0корпоративной платформе GigaCowork\u00A0— с\u00A0ней компании могут создавать персонализированных ИИ-агентов.",
    variant: "featured",
  },
  {
    tag: "Новости",
    date: "09 августа 2026",
    title:
      "В\u00A0России представили корпоративную платформу для\u00A0создания ИИ-агентов",
    text: "Платформа доступна в\u00A0трех конфигурациях",
    variant: "small",
  },
  {
    tag: "Блог",
    date: "15 августа 2026",
    title:
      "Сбер запустил платформу ГИГАЧАТ БИЗНЕС для\u00A0создания ИИ-агентов",
    text: "Платформа доступна в\u00A0трех конфигурациях",
    variant: "small",
  },
  {
    tag: "СМИ о нас",
    date: "15 августа 2026",
    title:
      "«ГигаЧат Бизнес» от\u00A0Сбера возьмёт на\u00A0себя рутинную работу российских компаний",
    text: "Сбер открыл корпоративным клиентам доступ к\u00A0своей внутренней платформе «ГигаЧат Бизнес» (GigaChat Enterprise).",
    variant: "wide",
  },
  {
    tag: "СМИ о нас",
    date: "07 августа 2026",
    title:
      "Андрей Белевцев: «Перестать развивать ИИ\u00A0— значит выпасть из\u00A0гонки навсегда»",
    text: "Современный искусственный интеллект\u00A0— это сложнейший технологический процесс.",
    variant: "featured",
  },
];

/** Сайдбар «Читают чаще всего» (4550:3063). */
const MOST_READ = [
  {
    title: "ФосАгро: −93% времени на\u00A0скрининг кандидатов",
    meta: "Блог · 6 мин",
  },
  {
    title: "С\u00A0чего начать внедрение AI: пошаговый план",
    meta: "Блог · 8 мин",
  },
  { title: "RAG для\u00A0корпоративной базы знаний", meta: "Блог · 10 мин" },
  {
    title: "Корпоративный AI в\u00A02025: опрос 200 компаний",
    meta: "Новости · 12 мин",
  },
];

/* ─────────────────────────────── страница ──────────────────────────────── */

export default function MediaPage() {
  return (
    <>
      {/* ── Hero (4539:94850 / 4530:93741) ── */}
      <section className="relative isolate flex min-h-[329px] w-full flex-col justify-end overflow-hidden bg-bg-page pt-[120px] pb-48 md:min-h-[500px] md:pt-[272px] md:pb-96">
        <HeroImage
          desktop="/img/media/hero.webp"
          mobile="/img/media/hero-mob.webp"
          className="pointer-events-none absolute inset-0 -z-10 size-full object-cover"
        />
        <div className="container-page flex flex-col gap-16 md:gap-24">
          <h1 className="text-h2 font-medium text-text-primary md:text-h1">
            Медиа
          </h1>
          <p className="text-body-l text-text-secondary">
            Знания для&nbsp;тех, кто внедряет ИИ
          </p>
        </div>
      </section>

      {/* ── Фильтры и лента (4539:94859 + 4549:3002) ── */}
      <section className="w-full bg-bg-page pt-24 pb-64 md:pt-40 md:pb-64">
        <div className="container-page flex flex-col gap-32 md:gap-40">
          {/*
            На десктопе лента и сайдбар идут в две колонки 894 + 282 с зазором
            24; ниже lg сайдбар уходит под ленту отдельной карточкой.
          */}
          <div className="flex flex-col gap-32 lg:grid lg:grid-cols-[894fr_282fr] lg:items-start lg:gap-24">
            <div className="flex flex-col gap-32 md:gap-40">
              <MediaFeed articles={ARTICLES} />
            </div>

            {/* Sidebar / Most Read (4550:3063) */}
            <aside className="flex flex-col gap-24 rounded-24 bg-[#f5f5f5] p-24 lg:bg-transparent lg:p-0">
              <Kicker>Читают чаще всего</Kicker>
              <ul className="flex flex-col gap-16">
                {MOST_READ.map((item, i) => (
                  <li
                    key={item.title}
                    className={`flex flex-col gap-8 ${
                      i < MOST_READ.length - 1
                        ? "border-b border-border-subtle pb-16"
                        : ""
                    }`}
                  >
                    <p className="text-body-l text-text-primary">
                      {item.title}
                    </p>
                    <p className="text-caption text-text-secondary">
                      {item.meta}
                    </p>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </section>

      {/* ── Подписка (4579:97921 / 4530:93790) ── */}
      {/* Фон секции из макета: светло-голубой к почти белому. */}
      <section className="w-full bg-[linear-gradient(180deg,#f0f8ff_0%,#f7f7f8_100%)] py-64 md:py-80">
        <div className="container-page">
          <SubscribeForm />
        </div>
      </section>
    </>
  );
}
