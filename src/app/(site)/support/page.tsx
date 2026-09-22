import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/Button";
import { CTA_FALLBACK, CtaBackground } from "@/components/ui/CtaBackground";
import { HeroImage } from "@/components/ui/HeroImage";
import { Kicker } from "@/components/ui/Kicker";
import { pageMetadata } from "@/lib/site";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

/**
 * «Поддержка» — /support
 *
 * Макеты: desktop 5025:27402 (Help / Desktop 1440), mobile 5025:27452.
 * Секции сверху вниз:
 *   Hero                   5025:27403 / 5025:27453 — короткий, 500 против обычных 760
 *   Направления поддержки  5093:37709 / 5093:37871 — три карточки Card / Feature
 *   CTA                    5025:27450 / 5025:27494 — кадр «диск», как на главной
 * Шапка и подвал — общие из src/app/(site)/layout.tsx.
 *
 * Слот иллюстрации в карточке (Card / Feature 502:1158) в десктопном макете
 * пуст: инстанс «Illustration / Layers» стоит за правым краем карточки и
 * целиком обрезается. Поэтому в вёрстке это просто распорка высотой 88 —
 * ниже md её нет, как и в мобильном макете.
 */

export const metadata: Metadata = pageMetadata({
  title: "Поддержка — GigaCowork",
  description:
    "Поддержка GigaCowork: консультации по конфигурации и возможностям платформы, диагностика инцидентов в облаке, гибриде и ПАК, обслуживание оборудования.",
  path: "/support/",
});

/* ──────────────────────────── градиенты из макета ──────────────────────── */

/*
  Заливка карточки (Gradient/Omni/Blue_light). Угол у мобильного и десктопного
  макета разный (198.95° против 211.72°) — в Figma градиент задан в координатах
  объекта, и при другой пропорции карточки тот же наклон даёт другой рисунок.
*/
const CARD_GRADIENT =
  "bg-[linear-gradient(198.95deg,#edf6ff_10.47%,#d4eeef_94.87%)] " +
  "md:bg-[linear-gradient(211.72deg,#edf6ff_10.47%,#d4eeef_94.87%)]";

/* ──────────────────────────────── данные ───────────────────────────────── */

type SupportArea = {
  id: string;
  title: ReactNode;
  text: ReactNode;
};

/** Карточки блока «С чем помогаем» (5093:37719 / 37720 / 37721). */
const AREAS: SupportArea[] = [
  {
    id: "consulting",
    title: (
      <>
        Консультации
        <br />
        по&nbsp;продукту
      </>
    ),
    text: (
      <>
        Подскажем конфигурацию,
        <br />
        ответим на&nbsp;вопросы по&nbsp;платформе
      </>
    ),
  },
  {
    id: "incidents",
    /*
      В мобильном макете у этой карточки заголовок обрезан до «Инциденты» —
      судя по всему, недосмотр: смысл направления теряется. Оставлены обе
      строки, карточка на телефоне становится выше на строку.
    */
    title: (
      <>
        Инциденты
        <br />и&nbsp;неисправности
      </>
    ),
    text: (
      <>
        Облако, Гибрид, ПАК:
        <br className="lg:hidden" /> диагностируем и&nbsp;устраняем
      </>
    ),
  },
  {
    id: "hardware",
    title: "Поддержка оборудования",
    text: "Диагностика, замена компонентов, выезд специалиста",
  },
];

/* ─────────────────────────────── страница ──────────────────────────────── */

export default function SupportPage() {
  return (
    <>
      {/* ── Hero (5025:27403 / 5025:27453) ── */}
      <section className="relative isolate flex min-h-[382px] w-full flex-col justify-end overflow-hidden bg-bg-page pt-[120px] pb-80 md:min-h-[500px] md:pt-[272px] md:pb-[102px]">
        <Breadcrumbs items={[{ label: "Поддержка" }]} />
        <HeroImage
          desktop="/img/support/hero.webp"
          mobile="/img/support/hero-mob.webp"
          className="pointer-events-none absolute inset-0 -z-10 size-full object-cover"
        />
        <div className="container-page flex flex-col items-center gap-16 text-center md:items-start md:gap-24 md:text-left">
          <h1 className="w-full text-h1 font-medium text-text-primary">
            Поддержка
          </h1>
          <p className="w-full text-body-l text-text-secondary">
            Интеграция не идёт, агент отвечает не так, документация не даёт
            ответа.
            {/* Перенос из макета — он есть и на десктопе, и на 390: делит
                абзац по предложениям, а не по ширине колонки. */}
            <br />
            Для&nbsp;таких моментов здесь есть люди, которые знают платформу
            изнутри.
          </p>
        </div>
      </section>

      {/* ── С чем помогаем (5093:37709 / 5093:37871) ── */}
      <section
        id="areas"
        className="w-full bg-bg-page py-64 md:py-96"
        aria-labelledby="areas-title"
      >
        <div className="container-page flex flex-col gap-32 md:gap-48">
          {/* Support Header — 5093:37710 / 5093:37872 */}
          <div className="flex flex-col gap-16 md:gap-24">
            <Kicker>Направления поддержки</Kicker>
            <h2
              id="areas-title"
              className="text-h2 font-medium text-text-primary"
            >
              С чем помогаем
            </h2>
          </div>

          {/* Support Grid — 5093:37714 / 5093:37876 */}
          {/*
            Три колонки — с lg, а не с md: на 768 колонка выходит 213 px, и
            заголовок 25 px («неисправности», «оборудования») в неё не влезает.
            До lg карточки идут в столбик, как в мобильном макете.
          */}
          <ul className="flex flex-col gap-16 lg:flex-row lg:gap-24">
            {AREAS.map((area) => (
              <li
                key={area.id}
                /*
                  Колонки равной ширины: без `min-w-0` длинное слово в
                  заголовке («оборудования») раздувает свою карточку и
                  ряд уезжает за край. Высота из макета задана минимумом, а
                  не фиксом, — чтобы карточка тянулась, если текст встанет
                  в лишнюю строку.
                */
                className={`flex flex-col rounded-24 p-24 lg:min-h-[305px] lg:min-w-0 lg:flex-1 lg:gap-16 lg:px-40 ${CARD_GRADIENT}`}
              >
                {/* Media slot (I5093:37719;532:221) — в макете пуст */}
                <div aria-hidden className="hidden h-[88px] w-full lg:block" />
                <div className="flex flex-col gap-12">
                  <h3 className="text-h3 font-medium text-text-primary">
                    {area.title}
                  </h3>
                  <p className="text-body-l text-text-secondary">{area.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── CTA (5025:27450 / 5025:27494) ── */}
      <section
        className={`relative isolate w-full overflow-hidden py-64 md:py-160 ${CTA_FALLBACK}`}
        aria-labelledby="support-cta-title"
      >
        <CtaBackground />
        <div className="container-page flex flex-col items-center gap-40">
          <div className="flex flex-col items-center gap-32 text-center">
            <h2
              id="support-cta-title"
              className="text-h2 font-medium text-text-primary"
            >
              Мы на связи
            </h2>
            <p className="max-w-[304px] text-body-l text-text-primary">
              Задайте вопрос.
              <br />
              Ответим, а&nbsp;не перенаправим.
            </p>
          </div>
          <Button
            href="mailto:support_cowork@gigab2b.ru"
            variant="primary"
            size="lg"
            className="text-body-m!"
          >
            Написать в&nbsp;поддержку
          </Button>
        </div>
      </section>
    </>
  );
}
