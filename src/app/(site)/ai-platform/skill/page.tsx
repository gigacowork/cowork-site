import type { Metadata } from "next";
import type { ReactNode } from "react";

import TokenIllustrations from "@/components/interactive/TokenIllustrations";
import Button from "@/components/ui/Button";
import { CTA_FALLBACK, CtaBackground } from "@/components/ui/CtaBackground";
import { HeroImage } from "@/components/ui/HeroImage";
import { Icon } from "@/components/ui/Icon";
import { Kicker } from "@/components/ui/Kicker";
import { asset } from "@/lib/asset";
import { pageMetadata } from "@/lib/site";

/**
 * «Навыки» — /ai-platform/skill
 *
 * Макеты: desktop 3680:27472 (Skills / Desktop 1440), mobile 3832:61679.
 * Секции сверху вниз:
 *   Hero          3680:27473 / 3832:61680
 *   How It Works  3680:27486 / 3832:61689   — один сценарий, стопки нет
 *   Assets        3806:25204 / 3832:61706
 *   Management    3826:21844 / 3832:61717   — фон-градиент
 *   How To Add    3806:25522 / 3839:64117
 *   CTA           3680:27521 / 3832:61733
 * Шапка и подвал — общие из src/app/(site)/layout.tsx.
 */

export const metadata: Metadata = pageMetadata({
  title: "Навыки агентов — GigaCowork",
  description:
    "Навык GigaCowork — экспертиза компании, записанная один раз: задача и результат, методика и стандарты, источники данных и требования безопасности. Агент работает по ней независимо от того, кто поставил задачу.",
  path: "/ai-platform/skill/",
});

/* ──────────────────────────── градиенты из макета ──────────────────────── */

/** Слот превью в «Как это работает» (2276:15336). */
const SLOT_GRADIENT =
  "bg-[linear-gradient(211.03deg,#d4e2ff_10.994%,#b3ebf6_79.923%,#b3f6e1_101.64%)]";
/** Карточки «Корпоративная экспертиза» (3806:25209). */
const CARD_GRADIENT =
  "bg-[linear-gradient(39.67deg,#c5f8e5_0.952%,#dcf9ff_50.802%,#e4f5ff_101.64%)]";
/** Фон секции «Управление» (3826:21844). */
const MANAGEMENT_GRADIENT =
  "bg-[linear-gradient(200.01deg,#d4e2ff_0%,#b3ebf6_73.845%,#b3f6e1_97.115%)]";
/** Заливка номера шага (2925:14881). */
const STEP_NUMBER_GRADIENT =
  "bg-[linear-gradient(90deg,#00b8ca_0%,#1cbbf3_53.96%,#9fb6f8_102.04%)]";

/* Локальная палитра моков интерфейса — см. /ai-platform/agents. */
const MOCK_SURFACE = "bg-[#ffffffb8]";
const MOCK_CELL = "bg-[#fffffff5]";
const MOCK_ACCENT = "bg-[#0dace038]";
const MOCK_SOLID = "bg-[#0dace0]";
const MOCK_BORDER = "border-[#0dace038]";
const MOCK_SHADOW = "shadow-[0_16px_34px_0_#173d631f]";
const MOCK_CELL_SHADOW = "shadow-[0_3px_10px_0_#173d6314]";

/* ──────────────────────────────── данные ───────────────────────────────── */

type TagItem = { label: string; icon: string };

const SKILL_PARTS = [
  "задача и ожидаемый результат;",
  "методика, алгоритм и стандарты компании;",
  "источники данных и корпоративные системы;",
  "требования безопасности, качества и согласования.",
];

const ASSET_CARDS: {
  title: ReactNode;
  text: ReactNode;
  tags: TagItem[];
  illustration: "reach" | "sources";
}[] = [
  {
    title: <>Знания становятся активом</>,
    text: (
      <>
        Один эксперт создает методику&nbsp;— тысячи сотрудников используют{" "}
        <br className="hidden lg:inline" />
        ее в&nbsp;работе.
      </>
    ),
    tags: [
      { label: "Общий стандарт", icon: "/img/icons/status.svg" },
      { label: "Экспертиза", icon: "/img/icons/knowledge-base.svg" },
    ],
    illustration: "reach",
  },
  {
    title: (
      <>
        Короткий путь <br className="hidden lg:inline" />к данным
      </>
    ),
    text: (
      <>
        В навыке прописаны коннекторы к&nbsp;базам знаний и&nbsp;системам&nbsp;—
        агент берет данные с&nbsp;учетом политик доступа.
      </>
    ),
    tags: [
      { label: "Коннекторы", icon: "/img/icons/component.svg" },
      { label: "Политики доступа", icon: "/img/icons/key.svg" },
    ],
    illustration: "sources",
  },
];

const MANAGEMENT: { tag: TagItem; title: ReactNode; text: ReactNode }[] = [
  {
    tag: { label: "Навыки", icon: "/img/icons/skills.svg" },
    title: <>Создание и&nbsp;стандарт</>,
    text: (
      <>
        Создавайте и&nbsp;обновляйте навыки, задавайте единый стандарт работы
        ИИ-агентов.
      </>
    ),
  },
  {
    tag: { label: "Доступ", icon: "/img/icons/key.svg" },
    title: <>Права доступа</>,
    text: (
      <>
        Назначайте, кто из&nbsp;сотрудников и&nbsp;команд может пользоваться
        навыками.
      </>
    ),
  },
  {
    tag: { label: "Контроль", icon: "/img/icons/shield-check.svg" },
    title: <>Контроль использования</>,
    text: (
      <>Отслеживайте, как используется корпоративная экспертиза компании.</>
    ),
  },
];

const STEPS: { number: string; title: ReactNode; text: ReactNode }[] = [
  {
    number: "01",
    title: <>Опишите, чем должен заниматься агент</>,
    text: (
      <>
        Например: «подготовка еженедельных отчётов по&nbsp;продажам
        и&nbsp;выявление отклонений от&nbsp;плана».
      </>
    ),
  },
  {
    number: "02",
    title: <>Добавьте агенту нужные навыки</>,
    text: (
      <>
        Например: «анализ продаж; подготовка управленческих отчётов;
        прогнозирование рисков»
      </>
    ),
  },
  {
    number: "03",
    title: <>Определите, чем может пользоваться агент</>,
    text: <>Например: «документы папки «Отдел продаж», CRM, 1С»</>,
  },
];

/* ─────────────────────────── мелкие компоненты ─────────────────────────── */

/** Tag (1388:5966) — иконка + подпись на полупрозрачной подложке. */
function Tag({ label, icon, lavender }: TagItem & { lavender?: boolean }) {
  return (
    <span
      className={`flex items-center gap-4 rounded-full py-8 pl-8 pr-[10px] text-caption text-text-primary ${
        lavender ? "bg-bg-card-lavender" : "bg-bg-tag"
      }`}
    >
      <Icon src={icon} className="size-[24px] text-icon-primary" />
      {label}
    </span>
  );
}

/** Слой иллюстрации для `TokenIllustrations` — см. /ai-platform/agents. */
function layer(x: number, y: number, delay: number) {
  return {
    "data-token-layer": "",
    style: {
      "--from-x": `${x}px`,
      "--from-y": `${y}px`,
      "--delay": `${delay}ms`,
    } as React.CSSProperties,
  };
}

/**
 * Иллюстрация «Знания становятся активом» (3811:36425): методика и подразделения,
 * которые её используют. В макете собрана из прямоугольников — здесь тоже
 * разметкой, а не растром.
 */
function ReachIllustration() {
  const teams = ["Продажи", "Финансы", "HR", "Закупки", "Логистика"];
  return (
    <div
      aria-hidden
      className={`flex h-[182px] w-[300px] flex-col gap-12 overflow-hidden rounded-[18px] border-[1.5px] p-16 ${MOCK_SURFACE} ${MOCK_BORDER} ${MOCK_SHADOW}`}
    >
      <div className="flex flex-col gap-32" {...layer(0, -10, 0)}>
        <p className="text-caption text-text-primary">
          Методика: Анализ продаж
        </p>
        <p className="text-caption text-text-secondary">используют в работе</p>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-[6px]">
        {teams.map((team, i) => (
          <span
            key={team}
            className={`rounded-8 px-8 py-4 text-caption text-text-primary ${MOCK_CELL} ${MOCK_CELL_SHADOW}`}
            {...layer(-12, 0, 160 + i * 90)}
          >
            {team}
          </span>
        ))}
        <span
          className={`rounded-8 px-8 py-4 text-caption text-text-inverse ${MOCK_SOLID}`}
          {...layer(0, 10, 660)}
        >
          +240
        </span>
      </div>
    </div>
  );
}

/** Иллюстрация «Короткий путь к данным» (3811:36444) — источники и политика. */
function SourcesIllustration() {
  const sources = ["База знаний", "1С", "CRM"];
  return (
    <div
      aria-hidden
      className={`flex w-[300px] flex-col gap-12 overflow-hidden rounded-[18px] border-[1.5px] p-16 ${MOCK_SURFACE} ${MOCK_BORDER} ${MOCK_SHADOW}`}
    >
      <p className="text-caption text-text-primary" {...layer(0, -10, 0)}>
        Источники навыка
      </p>
      <div className="flex flex-col gap-4">
        {sources.map((source, i) => (
          <div
            key={source}
            className="flex items-stretch gap-4"
            {...layer(-14, 0, 180 + i * 120)}
          >
            <span
              className={`flex w-[32px] items-center justify-center rounded-8 text-caption text-text-inverse ${MOCK_ACCENT}`}
            >
              ✓
            </span>
            <span
              className={`flex-1 rounded-8 p-8 text-caption text-text-primary ${MOCK_CELL} ${MOCK_CELL_SHADOW}`}
            >
              {source}
            </span>
          </div>
        ))}
      </div>
      <div
        className={`flex items-center gap-4 rounded-8 p-8 ${MOCK_ACCENT}`}
        {...layer(0, 10, 620)}
      >
        <span className={`size-[14px] rounded-[4px] ${MOCK_SOLID}`} />
        <span className="text-caption text-text-primary">
          Доступ по политике компании
        </span>
      </div>
    </div>
  );
}

/* ─────────────────────────────── страница ──────────────────────────────── */

export default function SkillPage() {
  return (
    <>
      {/* ── Hero (3680:27473 / 3832:61680) ── */}
      <section className="relative isolate flex min-h-[668px] w-full flex-col justify-center overflow-hidden bg-bg-page pt-[152px] pb-[80px] md:min-h-[760px] md:pt-[180px] md:pb-120">
        <HeroImage
          desktop="/img/skills/hero.webp"
          mobile="/img/skills/hero-mob.webp"
          className="pointer-events-none absolute inset-0 -z-10 size-full object-cover"
        />
        <div className="container-page flex flex-col items-center gap-32 text-center md:items-start md:gap-40 md:text-left">
          <div className="flex flex-col gap-16 md:max-w-[720px] md:gap-24">
            <h1 className="text-h1 font-medium text-text-primary">
              Навык&nbsp;— экспертиза, которую можно передать ИИ
            </h1>
            <p className="text-body-l text-text-secondary">
              GigaCowork позволяет сохранить опыт и&nbsp;лучшие практики ваших
              специалистов, <br className="hidden md:inline" />
              сделав их доступными всей компании.
            </p>
          </div>
          <Button
            href="/lead"
            variant="primary"
            size="lg"
            className="w-[230px] text-body-m! md:w-auto"
          >
            Попробовать бесплатно
          </Button>
        </div>
      </section>

      {/*
        ── How It Works (3680:27486 / 3832:61689) ──

        Сценарий здесь один, поэтому липкой стопки нет — обычные две колонки:
        текст 532 и превью 588 при зазоре 80, как в макете.
      */}
      <section className="w-full bg-bg-page py-120">
        <div className="container-page flex flex-col gap-48 md:gap-80">
          <Kicker>Как это работает</Kicker>
          <div className="flex flex-col gap-40 lg:grid lg:grid-cols-[minmax(0,532fr)_minmax(0,588fr)] lg:gap-x-80">
            <div className="flex flex-col gap-24">
              <h2 className="text-h3 font-medium text-text-primary md:text-h2">
                ИИ-агент использует навык как инструкцию
              </h2>
              <div className="flex flex-col gap-16 text-body-l text-text-secondary">
                <p>
                  Опишите навык один раз, и&nbsp;агент будет использовать эти
                  правила независимо от&nbsp;того, кто поставил ему задачу.
                </p>
                <p>В навыке задаются:</p>
              </div>
              {/* Effects List (3806:25544) — точка 8 в боксе 24 + Body/L */}
              <ul className="flex flex-col gap-12">
                {SKILL_PARTS.map((part) => (
                  <li key={part} className="flex items-center gap-8">
                    <span
                      aria-hidden
                      className="flex size-[24px] shrink-0 items-center justify-center"
                    >
                      <span className="size-[8px] rounded-full bg-icon-primary" />
                    </span>
                    <span className="flex-1 text-body-l text-text-secondary">
                      {part}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            {/*
              Card / Product Preview (3832:61363) — кадр экрана редактора
              навыка. Заливки и скругления у слота нет: рамка нарисована
              в самом кадре, иначе выходит карточка в карточке. Высоту задаёт
              сам кадр (1176×800 — два макетных слота 588×400), как в
              `StickyScenarios` и на страницах ролей.
            */}
            <img
              src={asset("/img/skills/scenario-instruction.webp")}
              alt=""
              aria-hidden
              width={588}
              height={400}
              loading="lazy"
              decoding="async"
              className="h-auto w-full drop-shadow-[0_12px_24px_#60738f33]"
            />
          </div>
        </div>
      </section>

      {/* ── Assets (3806:25204 / 3832:61706) ── */}
      <section className="w-full bg-bg-page py-48 md:py-96">
        <div className="container-page flex flex-col gap-32 md:gap-48">
          <div className="flex flex-col gap-12 md:gap-16">
            <Kicker>Корпоративная экспертиза</Kicker>
            <h2 className="text-h3 font-medium text-text-primary md:text-h2">
              Навыки превращают знания <br className="hidden md:inline" />в
              актив компании
            </h2>
            <p className="text-body-l text-text-primary">
              Создавайте навыки для&nbsp;всей компании, отдельных команд
              или&nbsp;проектов.
            </p>
          </div>

          <TokenIllustrations>
            <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
              {ASSET_CARDS.map((card) => (
                <article
                  key={card.illustration}
                  data-token-card={card.illustration}
                  className={`relative flex flex-col justify-between gap-24 overflow-hidden rounded-24 px-24 pt-32 pb-24 lg:h-[291px] lg:px-40 lg:pt-40 ${CARD_GRADIENT}`}
                >
                  <div className="flex flex-col gap-16 lg:pr-[188px]">
                    <h3 className="text-h3 font-medium text-text-primary">
                      {card.title}
                    </h3>
                    <p className="text-body-l text-text-secondary">
                      {card.text}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-8 lg:pr-[188px]">
                    {card.tags.map((tag) => (
                      <Tag key={tag.label} {...tag} />
                    ))}
                  </div>
                  {/* В макете иллюстрация вылезает за правый край и обрезается им. */}
                  <div
                    data-token-art
                    className={`absolute hidden lg:block ${
                      card.illustration === "reach"
                        ? "top-[25px] right-[-94px]"
                        : "top-[21px] right-[-110px]"
                    }`}
                  >
                    {card.illustration === "reach" ? (
                      <ReachIllustration />
                    ) : (
                      <SourcesIllustration />
                    )}
                  </div>
                </article>
              ))}
            </div>
          </TokenIllustrations>
        </div>
      </section>

      {/* ── Management (3826:21844 / 3832:61717) ── */}
      <section className={`w-full py-48 md:py-120 ${MANAGEMENT_GRADIENT}`}>
        <div className="container-page flex flex-col gap-24 md:gap-48">
          <div className="flex flex-col gap-12 md:gap-16">
            <Kicker>Управление</Kicker>
            <h2 className="text-h3 font-medium text-text-primary md:text-h2">
              Управляйте знаниями <br className="hidden md:inline" />и
              компетенциями централизованно
            </h2>
          </div>
          <div className="grid gap-16 md:grid-cols-3 md:gap-24">
            {MANAGEMENT.map((card, i) => (
              <article
                key={i}
                className="flex flex-col items-start gap-16 rounded-16 bg-bg-page p-32 drop-shadow-[0_12px_24px_#60738f33]"
              >
                <Tag {...card.tag} lavender />
                <h3 className="text-h4 font-medium text-text-primary">
                  {card.title}
                </h3>
                <p className="text-body-m text-text-primary">{card.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── How To Add (3806:25522 / 3839:64117) ── */}
      <section className="w-full bg-bg-page py-64 md:py-96">
        <div className="container-page flex flex-col gap-16">
          <Kicker>Настройка навыка</Kicker>
          <h2 className="text-h3 font-medium text-text-primary md:text-h2">
            Как добавить навык <br className="hidden md:inline" />
            ИИ-агенту
          </h2>
          <div className="mt-24 flex flex-col gap-32 md:grid md:grid-cols-3 md:gap-24">
            {STEPS.map((step) => (
              <div key={step.number} className="flex flex-col gap-16">
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

      {/* ── CTA (3680:27521 / 3832:61733) ── */}
      <section
        className={`relative isolate w-full overflow-hidden py-64 md:py-160 ${CTA_FALLBACK}`}
      >
        <CtaBackground />
        <div className="container-page flex flex-col items-center gap-40">
          <h2 className="max-w-[522px] text-center text-h3 font-medium text-text-primary md:text-h2">
            Делегируйте работу
            <br className="hidden md:block" /> ИИ-агентам
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
