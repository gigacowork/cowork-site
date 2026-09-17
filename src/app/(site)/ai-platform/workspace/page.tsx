import type { Metadata } from "next";
import type { ReactNode } from "react";

import {
  StickyScenarios,
  type StickyScenario,
} from "@/components/interactive/StickyScenarios";
import Button from "@/components/ui/Button";
import { CTA_FALLBACK, CtaBackground } from "@/components/ui/CtaBackground";
import { HeroImage } from "@/components/ui/HeroImage";
import { Kicker } from "@/components/ui/Kicker";
import { JsonLd } from "@/components/seo/JsonLd";
import { PAGE_SEO } from "@/content/seo";
import { seoMetadata } from "@/lib/site";

/**
 * «Рабочие пространства» — /ai-platform/workspace
 *
 * Макеты: desktop 3501:19035 (Spaces / Desktop 1440), mobile 3656:22461
 * (Spaces / Mobile 390). Секции сверху вниз:
 *   Hero          3501:19036 / 3656:22462
 *   Use Cases     3649:3155  / 3656:22481
 *   How It Works  3503:19989 / 3656:22535
 *   CTA           3504:82129 / 3656:22547
 * Шапка и подвал — общие из src/app/(site)/layout.tsx, в макете это инстансы
 * тех же компонентов.
 *
 * Тексты, отступы и типографика перенесены из макета; вёрстка — на токенах
 * проекта (container-page, text-h1…caption, space-*), как на остальных
 * страницах.
 */

export const metadata: Metadata = seoMetadata(PAGE_SEO.workspace);

/* ──────────────────────────── градиенты из макета ──────────────────────── */

/*
  Заливки слота Image Slot внутри Card / Product Preview (2276:15336).
  У каждого сценария своя — в макете это три разных градиента, а не один
  повторённый. Угол взят из десктопной раскладки: в Figma он задан в абсолютных
  координатах, поэтому на мобильной карточке другой пропорции читается на
  полтора градуса иначе — разница неразличима, дублировать значение смысла нет.
*/
const SLOT_GRADIENTS = [
  "bg-[linear-gradient(211.03deg,#d4e2ff_10.994%,#b3ebf6_79.923%,#b3f6e1_101.64%)]",
  "bg-[linear-gradient(48.74deg,#c5f8e5_0.952%,#caf5ff_50.802%,#cfedff_101.64%)]",
  "bg-[linear-gradient(49.27deg,#dafde4_4.332%,#e4faff_22.937%,#e6f6ff_92.893%)]",
] as const;

/** Заливка номера шага в «Как это работает» (2925:14881). */
const STEP_NUMBER_GRADIENT =
  "bg-[linear-gradient(90deg,#00b8ca_0%,#1cbbf3_53.96%,#9fb6f8_102.04%)]";

/* ──────────────────────────────── данные ───────────────────────────────── */

/* Заливка слота приписывается при отрисовке — в тексте сценария ей не место. */
type Scenario = Omit<StickyScenario, "gradient">;

/*
  Переносы строк размечены как везде на сайте, но порог здесь lg, а не md:
  на две колонки блок раскладывается именно от lg, ниже текст идёт во всю
  ширину и жёсткая разбивка рвала бы строки не в тех местах.

  В абзацах переносов почти нет: они размечались под колонку 532 из макета, а
  после приведения масштаба к сценариям колонка 360 — на ней те же переносы
  давали рваные короткие строки. Единственное исключение отмечено на месте.
*/
const SCENARIOS: Scenario[] = [
  {
    image: "/img/workspace/scenario-docs.webp",
    title: (
      <>
        Документы и&nbsp;знания <br className="hidden lg:inline" />
        разделены по&nbsp;командам
      </>
    ),
    body: (
      <p>
        Продажи, финансы, HR, юридическая функция и&nbsp;другие команды получают
        собственное пространство, где работают с&nbsp;документами, знаниями
        и&nbsp;обмениваются файлами.
      </p>
    ),
    effects: [
      /*
        Порог xl, а не lg: на 1024 колонка ещё 251, и жёсткий перенос ломал бы
        пункт на три строки вместо двух. От 1280 колонка 328 — ровно на «для
        каждой команды» второй строкой.
      */
      <>
        Изолированная рабочая область <br className="hidden xl:inline" />
        для каждой команды
      </>,
      "Документы и знания доступны участникам пространства",
    ],
  },
  {
    image: "/img/workspace/scenario-collab.webp",
    title: <>Совместная работа и&nbsp;использование агентов</>,
    body: (
      <>
        <p>Внутри пространства агентов можно передавать коллегам.</p>
        {/*
          Единственный перенос в абзацах на странице: без него в конце строки
          оставался одинокий союз «и» после тире. Ломаем сразу за тире — это
          граница мысли, и на любой ширине колонки строка кончается там же.
        */}
        <p>
          Создайте своего агента: загрузите документы, подключите корпоративные
          системы и&nbsp;опишите правила в&nbsp;навыке&nbsp;—{" "}
          <br className="hidden lg:inline" />и команда сможет использовать его
          в&nbsp;ежедневной работе.
        </p>
      </>
    ),
    effects: [
      "Команда совместно использует настроенных агентов",
      "Правила работы агента сохраняются в навыке",
    ],
  },
  {
    image: "/img/workspace/scenario-practices.webp",
    title: (
      <>
        Передача опыта <br className="hidden lg:inline" />и лучших практик
      </>
    ),
    body: (
      <>
        <p>
          Результаты работы агентов и&nbsp;сотрудников сохраняются
          в&nbsp;пространстве.
        </p>
        <p>
          Передавайте сессии коллегам без&nbsp;потери истории, документов
          и&nbsp;решений&nbsp;— новый исполнитель сразу продолжает работу.
        </p>
      </>
    ),
    effects: [
      "История, документы и решения сохраняются в пространстве",
      "Коллега продолжает работу с полным контекстом",
    ],
  },
];

const STEPS: { number: string; title: string; text: ReactNode }[] = [
  {
    number: "01",
    title: "Создайте пространство",
    text: (
      <>
        Определите команду, проект или&nbsp;процесс, для&nbsp;которого нужна
        изолированная рабочая область.
      </>
    ),
  },
  {
    number: "02",
    title: "Настройте агентов",
    text: (
      <>
        Опишите и&nbsp;сохраните навыки, подключите системы и&nbsp;задайте
        правила выполнения задач.
      </>
    ),
  },
  {
    number: "03",
    title: "Добавьте знания",
    text: (
      <>
        Загрузите документы, регламенты, шаблоны и&nbsp;инструкции, которые
        агенты будут использовать в&nbsp;работе.
      </>
    ),
  },
  {
    number: "04",
    title: "Пригласите команду",
    text: (
      <>
        Откройте сотрудникам доступ, настройте роли и&nbsp;работайте
        над&nbsp;задачами вместе с&nbsp;агентами.
      </>
    ),
  },
];

/* ─────────────────────────────── страница ──────────────────────────────── */

export default function WorkspacePage() {
  return (
    <>
      <JsonLd data={PAGE_SEO.workspace.jsonLd!} />

      {/*
        ── Hero (3501:19036 / 3656:22462) ──

        Фон — растр на всю секцию. В макете это белая подложка, картинка
        на 30% прозрачности и градиент поверх; в экспорте всё сведено в один
        файл, поэтому кладётся как есть.

        Два кадра: десктопный 2880×1520 (ровно 2× фрейма 1440×760) и мобильный
        780×1590 (2× фрейма 390×795) — своя обрезка под вертикальный экран,
        а не тот же файл в другом размере.

        `isolate` — чтобы отрицательный слой картинки не всплывал к корню и её
        не перекрывал белый фон body.
      */}
      <section className="relative isolate flex min-h-[795px] w-full flex-col justify-center overflow-hidden bg-bg-page pt-[180px] pb-120 md:min-h-[760px] md:pt-120 md:pb-96">
        <HeroImage
          desktop="/img/workspace/hero.webp"
          mobile="/img/workspace/hero-mob.webp"
          className="pointer-events-none absolute inset-0 -z-10 size-full object-cover"
        />

        <div className="container-page flex flex-col items-center gap-40 text-center md:items-start md:gap-32 md:text-left">
          <div className="flex flex-col gap-48 md:gap-24">
            {/*
              Единственное место на странице, где мобильная разбивка заголовка
              оставлена: hero набран по центру и в макете разложен ровно на три
              строки, естественный перенос ломал бы композицию.
            */}
            <h1 className="text-h1 font-medium text-text-primary">
              Задачи <br className="md:hidden" />и контекст команды&nbsp;—{" "}
              <br />в одном пространстве
            </h1>
            <p className="text-body-l text-text-secondary">
              Все, что нужно команде <br className="md:hidden" />
              для&nbsp;продуктивной работы с&nbsp;ИИ: <br />
              агенты, документы и&nbsp;доступы к&nbsp;системам объединены{" "}
              <br className="hidden md:inline" />в одной рабочей области.
            </p>
          </div>
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

      {/*
        ── Use Cases (3649:3155 / 3656:22481) ──

        От lg карточки собираются в липкую стопку, а слева остаётся подпись
        верхней из них — та же механика, что в «Применении» на страницах
        «Для кого». В макете все три ряда нарисованы подряд: Figma не умеет
        показывать липкость.
      */}
      <section className="w-full bg-bg-page py-120">
        <div className="container-page flex flex-col gap-48 md:gap-80">
          <Kicker>Рабочие пространства</Kicker>
          <StickyScenarios
            items={SCENARIOS.map((scenario, i) => ({
              ...scenario,
              gradient: SLOT_GRADIENTS[i],
            }))}
          />
        </div>
      </section>

      {/* ── How It Works (3503:19989 / 3656:22535) ── */}
      <section className="w-full bg-bg-page py-64 md:py-120">
        <div className="container-page flex flex-col gap-16 md:gap-48">
          <Kicker>Как это работает</Kicker>
          <h2 className="text-h2 font-medium text-text-primary">
            Как организовать рабочее пространство{" "}
            <br className="hidden md:inline" />
            для&nbsp;команды
          </h2>

          {/*
            В макете четыре колонки по 282 при контейнере 1200. На планшете
            такая сетка не живёт: 282 там не помещается, поэтому между md и lg
            шаги идут в две колонки, а ниже md — одной лентой.
          */}
          <div className="mt-24 flex flex-col gap-32 md:mt-0 md:grid md:grid-cols-2 md:gap-x-24 md:gap-y-48 lg:grid-cols-4 lg:gap-y-0">
            {STEPS.map((step) => (
              <div key={step.number} className="flex flex-col gap-16">
                {/*
                  Номер набран заливкой по тексту: в макете это градиент, а не
                  плоский цвет. `text-transparent` обязателен — без него текст
                  перекрывает собственную заливку.
                */}
                <span
                  aria-hidden
                  className={`w-fit bg-clip-text text-h1 font-medium text-transparent ${STEP_NUMBER_GRADIENT}`}
                >
                  {step.number}
                </span>
                <div className="flex flex-col gap-8">
                  <h3 className="text-h3 font-medium text-text-primary">
                    {step.title}
                  </h3>
                  <p className="text-body-l text-text-secondary">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA (3504:82129 / 3656:22547) ── */}
      <section
        className={`relative isolate w-full overflow-hidden py-64 md:py-160 ${CTA_FALLBACK}`}
      >
        <CtaBackground />
        <div className="container-page flex flex-col items-center gap-40">
          <h2 className="max-w-[522px] text-center text-h3 font-medium text-text-primary md:text-h2">
            Начните работать
            <br className="hidden md:block" /> в&nbsp;GigaCowork
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
