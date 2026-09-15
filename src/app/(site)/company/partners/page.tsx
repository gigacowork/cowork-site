import type { Metadata } from "next";

import RevealCards from "@/components/interactive/RevealCards";
import { Clients, PARTNER_LOGOS } from "@/components/sections/Clients";
import LeadForm from "@/components/sections/LeadForm";
import Button from "@/components/ui/Button";
import { CTA_FALLBACK, CtaBackground } from "@/components/ui/CtaBackground";
import { HeroImage } from "@/components/ui/HeroImage";
import { Image } from "@/components/ui/Image";
import { Kicker } from "@/components/ui/Kicker";
import { PARTNER_LEAD } from "@/lib/crm";
import { pageMetadata } from "@/lib/site";

/**
 * «Партнёрам» — /company/partners
 *
 * Макеты: desktop 4325:37702, mobile 4419:89689.
 * Секции сверху вниз:
 *   Hero            4325:37703
 *   Почему выбирают 4350:38813 — большая карточка и три инфо-карточки
 *   Клиенты         4351:41575 — та же полоса логотипов, что на главной
 *   Рынок           4351:41692 — четыре карточки
 *   Как устроено    4351:41851 — три карточки с тегом и три пункта с линией
 *   Монетизация     4345:24789 — четыре карточки 2×2
 *   Возможности     4346:24942 — две широкие и три узкие карточки
 *   Для кого        4347:24979 — три инфо-карточки
 *   Старт           4348:25094 — четыре шага с крупными номерами
 *   CTA             4325:37773
 *
 * Кадры внутри карточек «Монетизации» и «Возможностей» в макете —
 * иллюстрации-мокапы. Готовых файлов для них нет, поэтому на их месте
 * подложка в стиле карточки: появятся исходники — меняется только `MediaSlot`.
 */

export const metadata: Metadata = pageMetadata({
  title: "Партнёрам — GigaCowork",
  description:
    "Партнёрская программа GigaCowork: продажа корпоративной AI-платформы, внедрение ИИ-агентов и сопровождение проектов. Обучение команды, совместный пресейл, защита сделок и доход на всём жизненном цикле клиента.",
  path: "/company/partners/",
});

/* ──────────────────────────── градиенты из макета ──────────────────────── */

/** Заливка карточек — та же линейная мятно-голубая, что на «О компании». */
const CARD_GRADIENT =
  "bg-[linear-gradient(55deg,#c5f8e5_0%,#caf5ff_48%,#cfedff_100%)]";

/**
 * Фон секций «Как устроено партнерство» и «Кто может стать партнером»
 * (4351:41851, 4347:24979). Угол пересчитан из матрицы градиента Figma.
 */
/**
 * Заливка номеров шагов — та же, что у «Как организовать рабочее пространство»
 * на /ai-platform/workspace: в макете номер градиентный, а не плоский.
 */
const STEP_NUMBER_GRADIENT =
  "bg-[linear-gradient(90deg,#00b8ca_0%,#1cbbf3_53.96%,#9fb6f8_102.04%)]";

const SECTION_GRADIENT =
  "bg-[linear-gradient(239deg,#d4e2ff_0%,#b3ebf6_74%,#b3f6e1_97%)]";

/** Мягкие цветные пятна поверх белой подложки — инфо-карточки макета. */
const glow = (rgb: string, size: string, at: string) =>
  `radial-gradient(${size} at ${at}, rgba(${rgb},0.3) 0%, rgba(${rgb},0.3) 34%, rgba(${rgb},0) 100%)`;

const INFO_CARD_STYLE = {
  backgroundColor: "rgba(255,255,255,0.72)",
  backgroundImage: [
    glow("140,143,228", "80.6% 89.3%", "103.2% 94.6%"),
    glow("207,248,239", "108.7% 125%", "17.4% 100%"),
    glow("179,210,240", "108.7% 125%", "87% -42.5%"),
  ].join(", "),
};

/* ──────────────────────────────── данные ───────────────────────────────── */

/** Три инфо-карточки справа от большой (4350:38827, 38828, 41452). */
const ADVANTAGES = [
  {
    title: "Готовая корпоративная платформа",
    text: "Не\u00A0нужно разрабатывать собственный продукт и\u00A0содержать отдельную продуктовую команду.",
  },
  {
    title: "Быстрый старт и\u00A0совместные продажи",
    text: "Обучаем команду, подключаемся к\u00A0пресейлу и\u00A0поддерживаем первые внедрения.",
  },
  {
    title: "Обучение и\u00A0сопровождение",
    text: "База знаний, консалтинг и\u00A0сопровождение внедрения. Корпоративные курсы по\u00A0ГенИИ в\u00A0СберУниверситете.",
  },
];

/** «Сейчас лучшее время стать партнером» (4351:41697). */
const MARKET = [
  {
    title: "Рынок ИИ быстро растет",
    text: "Спрос на\u00A0готовые платформы увеличивается кратно каждый год",
  },
  {
    title: "Бизнес переходит к\u00A0промышленному внедрению",
    text: "Предприятия ищут платформы с\u00A0поддержкой и\u00A0гарантиями",
  },
  {
    title: "Растет спрос на\u00A0внедрение и\u00A0сопровождение",
    text: "Компании нуждаются в\u00A0партнерах, которые доводят проект до\u00A0результата",
  },
  {
    title: "Проекты как долгосрочный источник дохода",
    text: "ИИ-платформы\u00A0– это многолетние контракты с\u00A0регулярным доходом",
  },
];

/** «Как устроено партнерство», верхний ряд с тегами (4351:41859). */
const MODEL_CARDS = [
  {
    tag: "Обучение",
    title: "Обучение команды",
    text: "Обучаем продукту, методологии внедрения и\u00A0работе с\u00A0типовыми сценариями",
  },
  {
    tag: "Пресейл",
    title: "Совместный пресейл",
    text: "Участвуем во\u00A0встречах, демонстрациях и\u00A0подготовке коммерческих предложений",
  },
  {
    tag: "Экспертиза",
    title: "Техническая поддержка",
    text: "Подключаем продуктовых и\u00A0технических экспертов к\u00A0сложным вопросам проекта",
  },
];

/** Нижний ряд той же секции — пункты с линией сверху (4351:41863). */
const MODEL_RULES = [
  {
    title: "Маркетинговая поддержка",
    text: "Предоставляем презентации, демо-материалы и\u00A0поддержку совместных активностей",
  },
  {
    title: "Партнерский менеджер",
    text: "Единая точка контакта по\u00A0проектам, условиям программы и\u00A0развитию сотрудничества",
  },
  {
    title: "Регистрация и\u00A0защита сделок",
    text: "Фиксируем проект за\u00A0партнером и\u00A0сохраняем его роль на\u00A0всем цикле работы с\u00A0клиентом",
  },
];

/**
 * Кадр-мокап внутри карточки «Монетизации» (2294:9655).
 *
 * В макете это не картинка, а набор рамок с подписями 12px — поэтому собран
 * разметкой, а не выгружен файлом: так он остаётся чётким на любом экране
 * и не тянет за собой лишние 50 КБ на карточку.
 */
type IllRow =
  | {
      kind: "row";
      label: string;
      accent?: boolean;
      check?: boolean;
      arrow?: boolean;
    }
  | { kind: "chips"; items: { label: string; accent?: boolean }[] }
  | { kind: "note"; label: string };

type Illustration = { caption: string; rowWidth?: string; rows: IllRow[] };

/** «Как вы зарабатываете» (4345:24794) — сетка 2×2. */
const REVENUE: { title: string; text: string; ill: Illustration }[] = [
  {
    title: "Продажа платформы",
    text: "Получайте комиссию с\u00A0продажи лицензий GigaCowork.",
    ill: {
      caption: "Монетизация",
      rows: [
        { kind: "row", label: "Продажа лицензии" },
        { kind: "row", label: "Комиссия партнёра", accent: true, arrow: true },
      ],
    },
  },
  {
    title: "Внедрение",
    text: "Проектируйте решение, создавайте AI-агентов, подключайте корпоративные системы и\u00A0запускайте автоматизацию.",
    ill: {
      caption: "Внедрение",
      rowWidth: "w-[166px]",
      rows: [
        { kind: "row", label: "AI-агенты", check: true },
        { kind: "row", label: "Коннекторы", check: true },
        { kind: "row", label: "Регламенты", check: true },
        { kind: "row", label: "Решение запущено", accent: true, check: true },
      ],
    },
  },
  {
    title: "Развитие решения",
    text: "Подключайте подразделения, автоматизируйте новые процессы и\u00A0сопровождайте продление лицензий.",
    ill: {
      caption: "Развитие",
      rowWidth: "w-[181px]",
      rows: [
        { kind: "note", label: "Подключаете подразделения" },
        {
          kind: "chips",
          items: [
            { label: "Финансы" },
            { label: "HR" },
            { label: "Закупки" },
            { label: "+ Ещё", accent: true },
          ],
        },
        { kind: "row", label: "Продление лицензии", accent: true, check: true },
      ],
    },
  },
  {
    title: "Поддержка и\u00A0консалтинг",
    text: "Оказывайте поддержку, обучайте пользователей и\u00A0консультируйте клиента после запуска.",
    ill: {
      caption: "Поддержка",
      rowWidth: "w-[189px]",
      rows: [
        { kind: "row", label: "«Как настроить агента?»" },
        { kind: "row", label: "Ответ эксперта", accent: true, check: true },
        {
          kind: "chips",
          items: [{ label: "Обучение" }, { label: "Консультация" }],
        },
      ],
    },
  },
];

/** «Что вы сможете предложить заказчикам» (4346:24947): 2 широкие + 3 узкие. */
const OFFERING_WIDE = [
  {
    title: "Создание AI-агентов",
    text: "Агенты работают по\u00A0регламентам компании и\u00A0выполняют задачи без\u00A0разработки.",
  },
  {
    title: "Рабочие пространства для\u00A0команд",
    text: "Единая среда для\u00A0совместной работы сотрудников и\u00A0AI-агентов.",
  },
];

const OFFERING_NARROW = [
  {
    title: "Интеграции с\u00A0CRM, ERP и\u00A01С",
    text: "Подключение к\u00A0CRM, ERP, 1С и\u00A0корпоративным данным.",
  },
  {
    title: "Корпоративные базы знаний",
    text: "Работа с\u00A0внутренними документами и\u00A0знаниями.",
  },
  {
    title: "Безопасное развертывание",
    text: "Облако, Гибрид или\u00A0ПАК\u00A0— под\u00A0требования заказчика.",
  },
];

/** «Кто может стать партнером» (4347:24984). */
const AUDIENCE = [
  {
    title: "Системные интеграторы и\u00A0ИТ-компании",
    text: "Добавьте GigaCowork в\u00A0портфель и\u00A0зарабатывайте на\u00A0лицензиях, интеграции и\u00A0сопровождении.",
  },
  {
    title: "Консалтинговые компании и\u00A0бизнес-консультанты",
    text: "Включайте AI-агентов в\u00A0проекты трансформации и\u00A0развивайте новые сценарии для\u00A0клиентов.",
  },
  {
    title: "Эксперты по\u00A0внедрению корпоративных решений",
    text: "Используйте опыт интеграции корпоративных систем для\u00A0запуска и\u00A0масштабирования GigaCowork.",
  },
];

/** «Начать просто» (4348:25099). */
const STEPS = [
  {
    n: "01",
    title: "Оставьте заявку",
    text: "Заполните форму\u00A0— свяжемся в\u00A0течение 1–2 рабочих дней.",
  },
  {
    n: "02",
    title: "Обсудим условия",
    text: "Обсудим специализацию, опыт и\u00A0формат сотрудничества, затем зафиксируем условия в\u00A0соглашении.",
  },
  {
    n: "03",
    title: "Проведем обучение",
    text: "Обучим команду продукту, пресейлу и\u00A0методологии внедрения.",
  },
  {
    n: "04",
    title: "Запустим первые проекты",
    text: "Проведем совместные пресейлы и\u00A0поддержим первые внедрения.",
  },
];

/* ─────────────────────────── мелкие компоненты ─────────────────────────── */

/** Кадр-мокап «Монетизации» — собран разметкой по 2294:9655. */
function CardIllustration({ ill }: { ill: Illustration }) {
  const rowBase =
    "flex items-center justify-between gap-8 rounded-[8px] px-8 py-8 text-caption";
  const chipBase = "rounded-full px-8 py-4 text-caption";
  return (
    <div
      aria-hidden
      className="flex w-[300px] flex-col gap-12 rounded-[16px] border-[1.5px] border-brand-blue/22 bg-white/72 p-16 shadow-[0_2px_4px_rgba(0,0,0,0.05)]"
    >
      <p className="text-caption text-text-primary">{ill.caption}</p>
      <div className="flex flex-col gap-8">
        {ill.rows.map((row, i) => {
          if (row.kind === "note") {
            return (
              <p key={i} className="text-caption text-text-secondary">
                {row.label}
              </p>
            );
          }
          if (row.kind === "chips") {
            return (
              <div key={i} className="flex flex-wrap gap-4">
                {row.items.map((chip) => (
                  <span
                    key={chip.label}
                    className={`${chipBase} ${
                      chip.accent
                        ? "bg-brand-blue/16 text-status-accent"
                        : "bg-bg-glass text-text-primary"
                    }`}
                  >
                    {chip.label}
                  </span>
                ))}
              </div>
            );
          }
          return (
            <span
              key={i}
              className={`${rowBase} ${ill.rowWidth ?? "w-full"} ${
                row.accent
                  ? "bg-brand-blue/16 text-status-accent"
                  : "bg-bg-glass text-text-primary"
              }`}
            >
              {row.label}
              {row.check ? <span>✓</span> : null}
              {row.arrow ? <span>↑</span> : null}
            </span>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────── страница ──────────────────────────────── */

export default function PartnersPage() {
  return (
    <>
      {/* ── Hero (4325:37703) ── */}
      <section className="relative isolate flex min-h-[588px] w-full flex-col justify-center overflow-hidden bg-bg-page pt-[152px] pb-[48px] md:min-h-[760px] md:pt-[272px] md:pb-96">
        <HeroImage
          desktop="/img/partners/hero.webp"
          mobile="/img/partners/hero-mob.webp"
          className="pointer-events-none absolute inset-0 -z-10 size-full object-cover"
        />
        <div className="container-page flex flex-col items-center gap-32 text-center md:items-start md:text-left">
          <div className="flex flex-col gap-16 md:gap-24">
            <h1 className="text-h2 font-medium text-text-primary md:text-h1">
              Станьте партнером <br className="hidden md:inline" />
              GigaCowork
            </h1>
            <p className="text-body-l text-text-secondary">
              Добавьте GigaCowork в&nbsp;портфель решений и&nbsp;зарабатывайте
              на&nbsp;продаже платформы, <br className="hidden lg:inline" />
              внедрении AI-агентов и&nbsp;сопровождении корпоративных проектов.
            </p>
          </div>
          <Button
            href="#partner-form"
            variant="primary"
            size="lg"
            className="w-[230px] text-body-m! md:w-auto"
          >
            Стать партнером
          </Button>
        </div>
      </section>

      {/* ── Почему партнеры выбирают GigaCowork (4350:38813) ── */}
      <section className="w-full bg-bg-page py-64 md:py-120">
        <div className="container-page flex flex-col gap-32 md:gap-64">
          <h2 className="text-h3 font-medium text-text-primary md:max-w-[409px] md:text-h2">
            Почему партнеры выбирают GigaCowork
          </h2>

          <RevealCards selector="article">
            <div className="grid gap-16 lg:grid-cols-[589fr_486fr] lg:gap-24">
              {/* Большая карточка с иллюстрацией партнёрства (4412:22394) */}
              <article
                className={`relative flex flex-col gap-40 overflow-hidden rounded-24 border border-white p-24 md:p-40 lg:h-[532px] ${CARD_GRADIENT}`}
              >
                <div className="flex flex-col gap-12 lg:max-w-[280px]">
                  {/*
                    Точек нет: две части разведены переносом, как в остальных
                    заголовках сайта.
                  */}
                  <h3 className="text-h3 font-medium text-text-primary">
                    Мы&nbsp;создаем платформу <br />
                    Вы&nbsp;развиваете бизнес
                  </h3>
                  <p className="text-body-m text-text-primary">
                    GigaCowork готов к&nbsp;внедрению в&nbsp;крупных компаниях.
                    Мы&nbsp;развиваем платформу и&nbsp;продуктовую экспертизу,
                    а&nbsp;партнер работает с&nbsp;заказчиком, внедряет решение
                    и&nbsp;развивает проект.
                  </p>
                </div>
                {/*
                  Кадр в макете выведен из потока и прижат к правому нижнему
                  углу карточки. Ниже lg он идёт обычным блоком под текстом.

                  В самом файле кадр шире колонки и наезжает на описание —
                  текст уходит под полупрозрачную карточку и не читается.
                  Поэтому здесь он ужат целиком (`scale` от правого нижнего
                  угла) и начинается правее текстовой колонки.

                  Правым краем кадр стоит вплотную к краю карточки: между ними
                  не должно быть поля. Ниже lg он так же выходит за внутренний
                  отступ карточки отрицательным полем.
                */}
                <Image
                  src="/img/partners/partnership.svg"
                  alt=""
                  width={319}
                  height={283}
                  aria-hidden
                  className="-mr-24 ml-auto w-[240px] md:-mr-40 md:w-[319px] lg:absolute lg:right-0 lg:bottom-40 lg:mr-0 lg:origin-bottom-right lg:scale-[0.78]"
                />
              </article>

              {/* Три инфо-карточки (4350:38827) */}
              <div className="flex flex-col gap-12">
                {ADVANTAGES.map((card) => (
                  <article
                    key={card.title}
                    style={INFO_CARD_STYLE}
                    className="flex flex-1 flex-col gap-16 rounded-24 border border-white p-24"
                  >
                    <h3 className="text-h4 font-medium text-text-primary">
                      {card.title}
                    </h3>
                    <p className="text-body-m text-text-secondary">
                      {card.text}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </RevealCards>
        </div>
      </section>

      {/* ── Логотипы партнёров (4351:41575) ── */}
      <Clients logos={PARTNER_LOGOS} id="partners-logos" alwaysMarquee />

      {/* ── Рынок (4351:41692) ── */}
      <section className="w-full bg-bg-page py-64 md:py-96">
        <div className="container-page flex flex-col gap-32 md:gap-48">
          <header className="flex flex-col gap-16">
            <Kicker>Рынок</Kicker>
            <h2 className="text-h3 font-medium text-text-primary md:text-h2">
              Сейчас лучшее время стать партнером
            </h2>
            <p className="text-body-l text-text-secondary">
              Компании переходят от&nbsp;пилотных проектов к&nbsp;масштабному
              внедрению ИИ. Им&nbsp;нужны корпоративные платформы, интеграция
              с&nbsp;внутренними системами и&nbsp;партнеры, которые доведут
              проект до&nbsp;результата.
            </p>
          </header>
          <RevealCards selector="article">
            <div className="grid gap-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-24">
              {MARKET.map((card) => (
                <article
                  key={card.title}
                  className={`flex flex-col gap-16 rounded-24 border border-white p-24 md:p-40 ${CARD_GRADIENT}`}
                >
                  <h3 className="text-h4 font-medium text-text-primary">
                    {card.title}
                  </h3>
                  <p className="text-body-m text-text-primary">{card.text}</p>
                </article>
              ))}
            </div>
          </RevealCards>
        </div>
      </section>

      {/* ── Как устроено партнерство (4351:41851) ── */}
      <section className={`w-full py-64 md:py-96 ${SECTION_GRADIENT}`}>
        <div className="container-page flex flex-col gap-32 md:gap-48">
          <header className="flex flex-col gap-16">
            <Kicker>Как это работает</Kicker>
            <h2 className="text-h3 font-medium text-text-primary md:text-h2">
              Как устроено партнерство
            </h2>
            <p className="text-body-l text-text-secondary">
              Партнер ведет клиента, проектирует решение, внедряет AI-агентов
              и&nbsp;сопровождает проект. Мы&nbsp;развиваем платформу,
              подключаемся к&nbsp;пресейлу и&nbsp;сложным этапам внедрения,
              предоставляем материалы и&nbsp;техническую поддержку.
            </p>
          </header>

          <div className="flex flex-col gap-16 lg:gap-24">
            <RevealCards selector="article">
              <div className="grid gap-16 md:grid-cols-3 lg:gap-24">
                {MODEL_CARDS.map((card) => (
                  <article
                    key={card.title}
                    className="flex flex-col gap-16 rounded-[16px] bg-bg-page p-24 shadow-[0_12px_24px_rgba(96,115,143,0.2)] md:p-32"
                  >
                    <span className="w-fit rounded-full bg-bg-card-lavender px-12 py-4 text-caption text-text-primary">
                      {card.tag}
                    </span>
                    <h3 className="text-h4 font-medium text-text-primary">
                      {card.title}
                    </h3>
                    <p className="text-caption text-text-secondary">
                      {card.text}
                    </p>
                  </article>
                ))}
              </div>
            </RevealCards>

            {/* Нижний ряд — линия сверху, как в макете (4351:41863) */}
            <div className="grid gap-16 md:grid-cols-3 lg:gap-24">
              {MODEL_RULES.map((rule) => (
                <article
                  key={rule.title}
                  className="flex flex-col gap-8 pt-[16px]"
                >
                  <span aria-hidden className="h-px w-full bg-text-primary" />
                  <h3 className="text-body-l text-text-primary">
                    {rule.title}
                  </h3>
                  <p className="text-caption text-text-secondary">
                    {rule.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Как вы зарабатываете (4345:24789) ── */}
      <section className="w-full bg-bg-page py-64 md:py-96">
        <div className="container-page flex flex-col gap-32 md:gap-48">
          <header className="flex flex-col gap-24">
            <Kicker>Монетизация</Kicker>
            <h2 className="text-h3 font-medium text-text-primary md:text-h2">
              Как вы&nbsp;зарабатываете
            </h2>
            <p className="text-body-l text-text-secondary">
              Партнер зарабатывает на&nbsp;всем жизненном цикле клиента: продаже
              платформы, внедрении, развитии сценариев, поддержке
              и&nbsp;консалтинге. Размер комиссии, зоны ответственности
              и&nbsp;SLA фиксируются в&nbsp;партнерском соглашении.
            </p>
          </header>
          <RevealCards selector="article">
            <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
              {REVENUE.map((card) => (
                <article
                  key={card.title}
                  className={`relative flex flex-col gap-24 overflow-hidden rounded-24 border border-white p-24 md:p-40 lg:h-[320px] ${CARD_GRADIENT}`}
                >
                  {/*
                    От lg кадр выведен из потока, прижат к правому верхнему
                    углу и обрезается карточкой — так в макете. Ниже lg он
                    идёт в потоке над текстом, иначе лёг бы на заголовок.
                  */}
                  <div className="lg:absolute lg:top-[19px] lg:-right-[72px]">
                    <CardIllustration ill={card.ill} />
                  </div>
                  <div className="flex flex-col gap-16 lg:mt-auto lg:max-w-[310px]">
                    <h3 className="text-h4 font-medium text-text-primary">
                      {card.title}
                    </h3>
                    <p className="text-body-m text-text-primary">{card.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </RevealCards>
        </div>
      </section>

      {/* ── Что вы сможете предложить заказчикам (4346:24942) ── */}
      <section className="w-full bg-bg-page py-64 md:py-96">
        <div className="container-page flex flex-col gap-32 md:gap-48">
          <header className="flex flex-col gap-24">
            <Kicker>Возможности</Kicker>
            <h2 className="text-h3 font-medium text-text-primary md:text-h2">
              Что вы&nbsp;сможете предложить заказчикам
            </h2>
            <p className="text-body-l text-text-secondary">
              Корпоративную AI-платформу для&nbsp;создания агентов,
              автоматизации процессов и&nbsp;работы с&nbsp;внутренними знаниями
              компании.
            </p>
          </header>

          <div className="flex flex-col gap-16 lg:gap-24">
            <RevealCards selector="article">
              <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
                {OFFERING_WIDE.map((card) => (
                  <article
                    key={card.title}
                    className={`flex flex-col justify-end rounded-24 border border-white p-24 md:p-40 lg:h-[269px] ${CARD_GRADIENT}`}
                  >
                    <div className="flex flex-col gap-12">
                      <h3 className="text-h4 font-medium text-text-primary">
                        {card.title}
                      </h3>
                      <p className="text-body-m text-text-primary">
                        {card.text}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </RevealCards>

            <RevealCards selector="article">
              <div className="grid gap-16 md:grid-cols-3 lg:gap-24">
                {OFFERING_NARROW.map((card) => (
                  <article
                    key={card.title}
                    className={`flex flex-col justify-end rounded-24 border border-white p-24 md:p-40 lg:h-[305px] ${CARD_GRADIENT}`}
                  >
                    <div className="flex flex-col gap-12">
                      <h3 className="text-h4 font-medium text-text-primary">
                        {card.title}
                      </h3>
                      <p className="text-body-m text-text-primary">
                        {card.text}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </RevealCards>
          </div>
        </div>
      </section>

      {/* ── Кто может стать партнером (4347:24979) ── */}
      <section className={`w-full py-64 md:py-96 ${SECTION_GRADIENT}`}>
        <div className="container-page flex flex-col gap-32 md:gap-48">
          <header className="flex flex-col gap-24">
            <Kicker>Для кого</Kicker>
            <h2 className="text-h3 font-medium text-text-primary md:text-h2">
              Кто может стать партнером
            </h2>
            <p className="text-body-l text-text-secondary">
              Программа подходит компаниям и&nbsp;экспертам, которые работают
              с&nbsp;корпоративными заказчиками, умеют внедрять
              и&nbsp;интегрировать ИТ-решения и&nbsp;готовы сопровождать клиента
              после запуска.
            </p>
          </header>
          <RevealCards selector="article">
            <div className="grid gap-16 md:grid-cols-3 lg:gap-24">
              {AUDIENCE.map((card) => (
                <article
                  key={card.title}
                  style={INFO_CARD_STYLE}
                  className="flex flex-col gap-16 rounded-24 border border-white p-24 md:p-40 lg:h-[269px]"
                >
                  <h3 className="text-h4 font-medium text-text-primary">
                    {card.title}
                  </h3>
                  <p className="text-body-m text-text-secondary">{card.text}</p>
                </article>
              ))}
            </div>
          </RevealCards>
        </div>
      </section>

      {/* ── Начать просто (4348:25094) ── */}
      <section className="w-full bg-bg-page py-64 md:py-96">
        <div className="container-page flex flex-col gap-32 md:gap-48">
          <header className="flex flex-col gap-24">
            <Kicker>Старт</Kicker>
            <h2 className="text-h3 font-medium text-text-primary md:text-h2">
              Начать просто
            </h2>
            <p className="text-body-l text-text-secondary">
              От&nbsp;заявки до&nbsp;первых совместных проектов&nbsp;— четыре
              понятных шага с&nbsp;поддержкой команды GigaCowork.
            </p>
          </header>
          <ol className="grid gap-32 sm:grid-cols-2 lg:grid-cols-4 lg:gap-24">
            {STEPS.map((step) => (
              <li key={step.n} className="flex flex-col gap-16">
                {/*
                  Номер набран заливкой по тексту: `text-transparent`
                  обязателен, иначе плоский цвет перекрывает градиент.
                */}
                <span
                  aria-hidden
                  className={`w-fit bg-clip-text text-h1 font-medium text-transparent ${STEP_NUMBER_GRADIENT}`}
                >
                  {step.n}
                </span>
                <div className="flex flex-col gap-8">
                  <h3 className="text-h4 font-medium text-text-primary">
                    {step.title}
                  </h3>
                  <p className="text-caption text-text-secondary lg:max-w-[235px]">
                    {step.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── CTA (4325:37773) — форма заявки прямо в блоке ── */}
      {/*
        Здесь стояла кнопка на /lead. Партнёрская заявка уходит в CRM
        со своей меткой источника (`PARTNER_LEAD`), поэтому форма живёт на
        странице, а не на общей странице заявки. До ломания на lg блоки
        идут друг под другом по центру — как на /lead.
      */}
      <section
        id="partner-form"
        className={`relative isolate w-full overflow-hidden py-64 md:py-120 ${CTA_FALLBACK}`}
      >
        <CtaBackground />
        <div className="container-page flex flex-col items-center gap-40 lg:flex-row lg:items-start lg:justify-between lg:gap-24">
          <div className="flex max-w-[720px] flex-col gap-16 text-center lg:max-w-[522px] lg:text-left">
            <h2 className="text-h3 font-medium text-text-primary md:text-h2">
              Начните развивать практику <br className="hidden md:block" />
              корпоративного ИИ уже сегодня
            </h2>
            <p className="text-body-l text-text-secondary">
              Присоединяйтесь к&nbsp;партнерской программе GigaCowork.
              Развивайте практику корпоративного ИИ, внедряйте решения
              для&nbsp;крупнейших компаний и&nbsp;зарабатывайте на&nbsp;каждом
              этапе работы с&nbsp;клиентами.
            </p>
          </div>
          <LeadForm
            target={PARTNER_LEAD}
            requireAll
            idPrefix="partner"
            submitLabel="Стать партнером"
            successText={
              "Мы\u00A0свяжемся с\u00A0вами по\u00A0указанным контактам и\u00A0расскажем о\u00A0следующих шагах партнёрской программы."
            }
          />
        </div>
      </section>
    </>
  );
}
