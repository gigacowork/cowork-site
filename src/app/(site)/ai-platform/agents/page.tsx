import type { Metadata } from "next";
import type { ReactNode } from "react";

import {
  StickyScenarios,
  type StickyScenario,
} from "@/components/interactive/StickyScenarios";
import TokenIllustrations from "@/components/interactive/TokenIllustrations";
import Button from "@/components/ui/Button";
import { CTA_FALLBACK, CtaBackground } from "@/components/ui/CtaBackground";
import { HeroImage } from "@/components/ui/HeroImage";
import { Icon } from "@/components/ui/Icon";
import { Kicker } from "@/components/ui/Kicker";
import { JsonLd } from "@/components/seo/JsonLd";
import { PAGE_SEO } from "@/content/seo";
import { seoMetadata } from "@/lib/site";

/**
 * «ИИ-агенты» — /ai-platform/agents
 *
 * Макеты: desktop 3671:26866 (Agents / Desktop 1440), mobile 3755:71356.
 * Секции сверху вниз:
 *   Hero          3672:27321 / 3755:71357
 *   How It Works  3671:26880 / 3755:72612   — липкая стопка, как на /workspace
 *   Capabilities  3696:44513 / 3755:71373
 *   Management    3695:28301 / 3755:71420
 *   Security      3755:71063 / 3755:71439
 *   CTA           3671:26926 / 3755:71449
 * Шапка и подвал — общие из src/app/(site)/layout.tsx.
 *
 * Иконки тегов выгружены из Figma плагином (SVG_STRING) в public/img/icons и
 * рендерятся через `Icon` маской, чтобы цвет брался из токена.
 */

export const metadata: Metadata = seoMetadata(PAGE_SEO.agents);

/* ──────────────────────────── градиенты из макета ──────────────────────── */

/** Слоты Image Slot в стопке «Как это работает» (2276:15336). */
const SLOT_GRADIENTS = [
  "bg-[linear-gradient(211.03deg,#d4e2ff_10.994%,#b3ebf6_79.923%,#b3f6e1_101.64%)]",
  "bg-[linear-gradient(48.74deg,#c5f8e5_0.952%,#caf5ff_50.802%,#cfedff_101.64%)]",
] as const;

/** Крупные карточки «Агенты умеют» (3696:44518). */
const FEATURE_GRADIENT =
  "bg-[linear-gradient(39.67deg,#c5f8e5_0.952%,#dcf9ff_50.802%,#e4f5ff_101.64%)]";
/** Плитки выгод под ними (3696:44561) — на тон плотнее. */
const BENEFIT_GRADIENT =
  "bg-[linear-gradient(35.43deg,#c5f8e4_1.027%,#c9f5ff_50.719%,#cfedff_101.64%)]";
/** Фон секции «Управление агентами» (3695:28301). */
const MANAGEMENT_GRADIENT =
  "bg-[linear-gradient(200.01deg,#d4e2ff_10.994%,#b3ebf6_79.923%,#b3f6e1_101.64%)]";
/** Карточки секции «Безопасность» (3755:71069). */
const SECURITY_GRADIENT =
  "bg-[linear-gradient(54.73deg,#c5f8e5_0.952%,#dcf9ff_50.802%,#e4f5ff_101.64%)]";

/*
  Цвета внутри декоративных иллюстраций (3700:20446, 3696:44489). Это не токены
  системы, а локальная палитра мока интерфейса: полупрозрачное стекло, голубой
  акцент и мягкая тень. Держим их рядом с самими иллюстрациями, чтобы не
  засорять @theme значениями, которые больше нигде не встречаются.
*/
const MOCK_SURFACE = "bg-[#ffffffb8]";
const MOCK_CELL = "bg-[#fffffff5]";
const MOCK_ACCENT = "bg-[#0dace038]";
const MOCK_BORDER = "border-[#0dace038]";
const MOCK_SHADOW = "shadow-[0_16px_34px_0_#173d631f]";
const MOCK_CELL_SHADOW = "shadow-[0_3px_10px_0_#173d6314]";

/* ──────────────────────────────── данные ───────────────────────────────── */

type Scenario = Omit<StickyScenario, "gradient">;

const SCENARIOS: Scenario[] = [
  {
    title: <>Простое создание агентов</>,
    image: "/img/agents/scenario-create.webp",
    body: (
      <>
        {/*
          Жёсткого переноса перед «как регламент» больше нет: он
          размечался под колонку 532 из макета, а на нынешней 360 строка
          и без него ломается — получалась третья короткая строка.
        */}
        <p>
          Напишите обычными словами инструкцию для&nbsp;агента, как регламент
          сотруднику.
        </p>
        <p>
          Детализируйте его роль, цель и&nbsp;порядок работы, стиль ответов,
          ограничения, чтобы результат соответствовал вашим требованиям.
        </p>
      </>
    ),
  },
  {
    title: <>Широкие возможности применения</>,
    image: "/img/agents/scenario-usage.webp",
    body: (
      <p>
        Агенты самостоятельно взаимодействуют с&nbsp;офисными системами
        и&nbsp;сервисами, автоматически выполняя задачи и&nbsp;избавляя
        сотрудников от&nbsp;работы в&nbsp;десятках разных приложений.
      </p>
    ),
  },
];

type TagItem = { label: string; icon: string };

const FEATURES: {
  title: string;
  text: ReactNode;
  tags: TagItem[];
  illustration: "docs" | "connectors";
}[] = [
  {
    title: "Работать с документами",
    text: (
      <>
        Читать, редактировать и&nbsp;создавать документы разных форматов
        и&nbsp;размеров&nbsp;– загружайте большие сканы или&nbsp;просите
        исправить данные в&nbsp;многостраничных таблицах.
      </>
    ),
    tags: [
      { label: "Документы", icon: "/img/icons/document.svg" },
      { label: "Сканы", icon: "/img/icons/document-set.svg" },
      { label: "Таблички", icon: "/img/icons/table.svg" },
    ],
    illustration: "docs",
  },
  {
    title: "Собирать данные",
    text: (
      <>
        Собирать информацию из&nbsp;различных источников: баз знаний, офисных
        приложений и&nbsp;систем учета&nbsp;– укажите название коннектора
        в&nbsp;задаче и&nbsp;агент сам найдет и&nbsp;заберет нужные данные.
      </>
    ),
    tags: [
      { label: "Базы знаний", icon: "/img/icons/knowledge-base.svg" },
      { label: "Офисные системы", icon: "/img/icons/network.svg" },
    ],
    illustration: "connectors",
  },
];

const BENEFITS: { title: ReactNode; text: ReactNode }[] = [
  {
    title: <>Выполнять многоэтапные задачи</>,
    text: (
      <>
        Использовать разные инструменты и&nbsp;несколько навыков
        для&nbsp;многоэтапных задач&nbsp;– просто добавьте нужные
        при&nbsp;создании агента.
      </>
    ),
  },
  {
    title: <>Работать параллельно</>,
    text: (
      <>
        Выполнять задачи параллельно с&nbsp;пользователем и&nbsp;другими
        агентами&nbsp;– спокойно переключайтесь на&nbsp;другие дела.
      </>
    ),
  },
  {
    title: <>Запускаться по&nbsp;расписанию</>,
    text: (
      <>
        Работать по&nbsp;расписанию&nbsp;– опишите условия запуска выполнения
        задачи.
      </>
    ),
  },
];

const MANAGEMENT: { tag: TagItem; title: ReactNode; text: ReactNode }[] = [
  {
    tag: { label: "Редактирование", icon: "/img/icons/sliders.svg" },
    title: <>Настраивайте агентов</>,
    text: (
      <>
        Созданных агентов можно редактировать: добавлять или&nbsp;убирать
        навыки, команды и&nbsp;коннекторы.
      </>
    ),
  },
  {
    tag: { label: "Тест", icon: "/img/icons/history.svg" },
    title: <>Проверяйте перед использованием</>,
    text: <>Агента можно протестировать, не&nbsp;создавая отдельную задачу.</>,
  },
  {
    tag: { label: "Совместный доступ", icon: "/img/icons/collaboration.svg" },
    title: <>Делитесь с&nbsp;коллегами</>,
    text: (
      <>
        Агентами можно делиться с&nbsp;другими сотрудниками, присоединяя коллег
        в&nbsp;совместное пространство.
      </>
    ),
  },
];

const SECURITY: { title: ReactNode; text: ReactNode; tags: TagItem[] }[] = [
  {
    title: (
      <>
        Журнал <br className="hidden lg:inline" />
        событий
      </>
    ),
    text: (
      <>
        Все шаги агента выполняются от&nbsp;имени сотрудника и&nbsp;фиксируются
        в&nbsp;журнале событий.
      </>
    ),
    tags: [
      { label: "От имени сотрудника", icon: "/img/icons/user.svg" },
      { label: "Журнал событий", icon: "/img/icons/status.svg" },
    ],
  },
  {
    title: <>Настраиваемая автономность</>,
    text: (
      <>
        Уровень автономности агента гибко настраивается: когда агенту нужно
        подтверждение на&nbsp;действие или&nbsp;доступ в&nbsp;систему.
      </>
    ),
    tags: [
      { label: "Подтверждение", icon: "/img/icons/shield-check.svg" },
      { label: "Доступ в систему", icon: "/img/icons/key.svg" },
    ],
  },
  {
    title: (
      <>
        Управление <br className="hidden lg:inline" />
        доступом
      </>
    ),
    text: (
      <>
        Вы сами управляете доступом к&nbsp;агентам: личные агенты и&nbsp;их
        история доступны только вам, а&nbsp;командными агентами можно делиться
        с&nbsp;участниками пространства.
      </>
    ),
    tags: [
      { label: "Личные агенты", icon: "/img/icons/bot.svg" },
      { label: "Командные агенты", icon: "/img/icons/users-round.svg" },
    ],
  },
];

/* ─────────────────────────── мелкие компоненты ─────────────────────────── */

/**
 * Слой иллюстрации для `TokenIllustrations` — того же проигрывателя, что
 * у «Безлимитного количества токенов» на главной.
 *
 * Раскладка и переходы живут в globals.css (`[data-token-art]`), здесь только
 * начальное смещение и задержка: слой выезжает из (x, y) в своё место, когда
 * карточка перешла половину экрана или на неё навели мышь. Обратный скролл
 * складывает всё назад тем же переходом, поэтому второй проход снова
 * показывает анимацию.
 */
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

/**
 * Иллюстрация карточки «Работать с документами» (3696:44527).
 *
 * В макете это не картинка, а собранный из прямоугольников мок таблицы —
 * поэтому он и здесь собран разметкой, а не вставлен растром: так он остаётся
 * чётким на любом экране и весит ноль.
 */
function DocsIllustration() {
  const cell = `h-[18px] flex-1 rounded-[6px] ${MOCK_CELL} ${MOCK_CELL_SHADOW}`;
  const check = `flex h-[18px] flex-1 items-center justify-center rounded-8 px-4 text-caption text-text-inverse ${MOCK_ACCENT}`;
  /* Позиция «галочки» в каждой из трёх строк — как в макете. */
  const rows = [0, 1, 0];

  return (
    <div
      aria-hidden
      className={`flex h-[189px] w-[300px] flex-col gap-12 overflow-hidden rounded-16 border-[1.5px] p-16 ${MOCK_SURFACE} ${MOCK_BORDER} ${MOCK_SHADOW}`}
    >
      <p className="text-caption text-text-primary" {...layer(0, -10, 0)}>
        Поставки_Q3.xlsx
      </p>
      <div className="flex flex-col gap-4">
        {rows.map((hit, i) => (
          <div key={i} className="flex gap-4" {...layer(-16, 0, 140 + i * 110)}>
            {[0, 1, 2].map((col) =>
              col === hit ? (
                <span key={col} className={check}>
                  ✓
                </span>
              ) : (
                <span key={col} className={cell} />
              ),
            )}
          </div>
        ))}
      </div>
      <div className="flex gap-4">
        {["PDF", "DOCX", "XLSX"].map((ext, i) => (
          <span
            key={ext}
            className={`rounded-[6px] px-8 py-4 text-caption text-text-primary ${MOCK_CELL} ${MOCK_CELL_SHADOW}`}
            {...layer(0, 12, 520 + i * 90)}
          >
            {ext}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Иллюстрация карточки «Собирать данные» (3696:44661) — тот же приём. */
function ConnectorsIllustration() {
  const sources: [string, string][] = [
    ["1C", "1С"],
    ["C", "CRM"],
    ["В", "База знаний"],
    ["M", "Почта"],
  ];

  return (
    <div
      aria-hidden
      className={`flex h-[189px] w-[270px] flex-col gap-8 overflow-hidden rounded-[18px] border-[1.5px] p-16 ${MOCK_SURFACE} ${MOCK_BORDER} ${MOCK_SHADOW}`}
    >
      <div
        className="flex items-center gap-4 rounded-8 bg-bg-page p-8"
        {...layer(0, -10, 0)}
      >
        <span
          className={`rounded-[6px] px-4 py-[2px] text-caption text-text-primary ${MOCK_ACCENT}`}
        >
          @1С
        </span>
        <span className="text-caption text-text-primary">
          остатки на складе
        </span>
      </div>
      <div className="flex flex-col gap-8">
        {sources.map(([mark, label], i) => (
          <span
            key={label}
            className="flex items-center gap-8"
            {...layer(-14, 0, 180 + i * 110)}
          >
            <span className="flex size-[16px] items-center justify-center rounded-full bg-decorative-hero-blue text-caption text-text-inverse">
              {mark}
            </span>
            <span className="text-caption text-text-primary">{label}</span>
          </span>
        ))}
      </div>
      <p className="text-caption text-status-info" {...layer(0, 8, 680)}>
        данные получены
      </p>
    </div>
  );
}

/* ─────────────────────────────── страница ──────────────────────────────── */

export default function AgentsPage() {
  return (
    <>
      <JsonLd data={PAGE_SEO.agents.jsonLd!} />

      {/*
        ── Hero (3672:27321 / 3755:71357) ──

        Фон — растр на всю секцию, два кадра: 2880×1520 (2× фрейма 1440×760)
        и 780×1442 (2× фрейма 390×721).
      */}
      <section className="relative isolate flex min-h-[721px] w-full flex-col justify-center overflow-hidden bg-bg-page pt-[152px] pb-[80px] md:min-h-[760px] md:pt-[180px] md:pb-120">
        <HeroImage
          desktop="/img/agents/hero.webp"
          mobile="/img/agents/hero-mob.webp"
          className="pointer-events-none absolute inset-0 -z-10 size-full object-cover"
        />

        <div className="container-page flex flex-col items-center gap-32 text-center md:items-start md:gap-40 md:text-left">
          <div className="flex flex-col gap-16 md:max-w-[720px] md:gap-24">
            <h1 className="text-h1 font-medium text-text-primary">
              ИИ-агенты забирают <br />
              задачи <br className="md:hidden" />
              на себя
            </h1>
            <div className="flex flex-col gap-16 text-body-l text-text-secondary">
              <p>
                Пользователь задает конечную цель, а&nbsp;не последовательность
                действий, <br className="hidden md:inline" />
                как в&nbsp;чат-боте.
              </p>
              <p>
                «Подготовь отчет», «проанализируй материал», «отправь
                письма»&nbsp;– <br className="hidden md:inline" />
                агент сам строит план действий, выбирает инструменты{" "}
                <br className="hidden md:inline" />и доводит задачу
                до&nbsp;готового результата.
              </p>
            </div>
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

      {/* ── How It Works (3671:26880 / 3755:72612) ── */}
      <section className="w-full bg-bg-page py-120">
        <div className="container-page flex flex-col gap-48 md:gap-80">
          <Kicker>Как это работает</Kicker>
          <StickyScenarios
            items={SCENARIOS.map((scenario, i) => ({
              ...scenario,
              gradient: SLOT_GRADIENTS[i],
            }))}
          />
        </div>
      </section>

      {/* ── Capabilities (3696:44513 / 3755:71373) ── */}
      <section className="w-full bg-bg-page py-48 md:py-96">
        <div className="container-page flex flex-col gap-32">
          <div className="flex flex-col gap-12 md:gap-16">
            <Kicker>Возможности</Kicker>
            <h2 className="text-h2 font-medium text-text-primary">
              Агенты умеют
            </h2>
          </div>

          {/*
            Крупные карточки. Иллюстрация в макете вылезает за правый край
            карточки и обрезается ею; ниже lg её нет вовсе — на 358 она
            занимала бы больше места, чем сам текст.
          */}
          <TokenIllustrations>
            <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
              {FEATURES.map((feature) => (
                <article
                  key={feature.title}
                  data-token-card={feature.illustration}
                  className={`relative flex flex-col justify-between gap-24 overflow-hidden rounded-24 px-24 pt-32 pb-24 lg:h-[291px] lg:px-40 lg:pt-40 ${FEATURE_GRADIENT}`}
                >
                  <div className="flex flex-col gap-16 lg:pr-[188px]">
                    <h3 className="text-h3 font-medium text-text-primary">
                      {feature.title}
                    </h3>
                    <p className="text-body-l text-text-secondary">
                      {feature.text}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-8 lg:pr-[188px]">
                    {feature.tags.map((tag) => (
                      <Tag key={tag.label} {...tag} />
                    ))}
                  </div>
                  {/*
                    В макете иллюстрация вылезает за правый край карточки и
                    обрезается ею: у «документов» на 93, у «данных» на 74 —
                    отсюда разные отступы.
                  */}
                  <div
                    data-token-art
                    className={`absolute top-[16px] hidden lg:block ${
                      feature.illustration === "docs"
                        ? "right-[-93px]"
                        : "right-[-74px]"
                    }`}
                  >
                    {feature.illustration === "docs" ? (
                      <DocsIllustration />
                    ) : (
                      <ConnectorsIllustration />
                    )}
                  </div>
                </article>
              ))}
            </div>
          </TokenIllustrations>

          {/* Плитки выгод (3696:44560) */}
          <div className="grid gap-12 md:grid-cols-3 md:gap-24">
            {BENEFITS.map((benefit, i) => (
              <div
                key={i}
                className={`flex flex-col gap-8 rounded-12 p-16 ${BENEFIT_GRADIENT}`}
              >
                <h3 className="text-h4 font-medium text-text-primary">
                  {benefit.title}
                </h3>
                <p className="text-body-l text-text-secondary">
                  {benefit.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Management (3695:28301 / 3755:71420) ── */}
      <section className={`w-full py-48 md:py-96 ${MANAGEMENT_GRADIENT}`}>
        <div className="container-page flex flex-col gap-24 md:gap-[56px]">
          <div className="flex flex-col gap-12 md:gap-16">
            <Kicker>Управление агентами</Kicker>
            <h2 className="text-h3 font-medium text-text-primary md:text-h2">
              Понятное управление <br className="hidden md:inline" />и
              использование
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

      {/* ── Security (3755:71063 / 3755:71439) ── */}
      <section className="w-full bg-bg-page py-32 md:py-96">
        <div className="container-page flex flex-col gap-24 md:gap-[56px]">
          <div className="flex flex-col gap-12 md:gap-16">
            <Kicker>Безопасность</Kicker>
            <h2 className="text-h3 font-medium text-text-primary md:text-h2">
              Действия агентов <br className="hidden md:inline" />
              под&nbsp;контролем
            </h2>
          </div>
          <div className="grid gap-12 lg:grid-cols-3 lg:gap-24">
            {SECURITY.map((card, i) => (
              <article
                key={i}
                className={`flex flex-col justify-between gap-24 overflow-hidden rounded-24 px-24 pt-32 pb-24 lg:h-[324px] lg:px-40 lg:pt-40 ${SECURITY_GRADIENT}`}
              >
                <div className="flex flex-col gap-16">
                  <h3 className="text-h3 font-medium text-text-primary">
                    {card.title}
                  </h3>
                  <p className="text-body-l text-text-secondary">{card.text}</p>
                </div>
                <div className="flex flex-wrap gap-8">
                  {card.tags.map((tag) => (
                    <Tag key={tag.label} {...tag} />
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA (3671:26926 / 3755:71449) ── */}
      <section
        className={`relative isolate w-full overflow-hidden py-64 md:py-160 ${CTA_FALLBACK}`}
      >
        <CtaBackground variant="slab" />
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
