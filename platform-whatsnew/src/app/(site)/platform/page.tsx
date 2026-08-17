import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import CountUp from "@/components/interactive/CountUp";

/**
 * «О платформе» — /platform
 *
 * Макеты: desktop 2888:17747 (about-desktop-1440), mobile 2888:17927.
 * Секции по порядку: Hero (2888:17748), Metrics (2888:17761),
 * Workspace (2888:17766), AI Agents (2888:17785), Security (2888:17815),
 * Solutions (2888:17841), CTA (2888:17852). Шапка и подвал — общие из
 * src/app/(site)/layout.tsx, в макете они инстансы тех же компонентов.
 *
 * Тексты, отступы и типографика перенесены из макета; вёрстка — на токенах
 * проекта (container-page, text-h1…caption, space-*), как на остальных
 * страницах. Иконки тегов выгружены из Figma в public/img/icons.
 */

export const metadata: Metadata = {
  title: "О платформе — GigaCowork",
  description:
    "GigaCowork — платформа ИИ-агентов для всей компании: общие и личные пространства, навыки и команды, коннекторы к корпоративным системам и безопасность корпоративного уровня.",
};

/* ──────────────────────────── градиенты из макета ──────────────────────── */

/** Карточки пространств (2888:17773) и решений (2888:17848) */
const CARD_GRADIENT_39 =
  "bg-[linear-gradient(39.67deg,#c5f8e5_0.95%,#dcf9ff_50.8%,#e4f5ff_101.64%)]";
const CARD_GRADIENT_60 =
  "bg-[linear-gradient(59.96deg,#c5f8e5_0.95%,#dcf9ff_50.8%,#e4f5ff_101.64%)]";
/** Плитки выгод (2888:17776) — на тон плотнее */
const BENEFIT_GRADIENT =
  "bg-[linear-gradient(33.38deg,#c5f8e5_0.95%,#caf5ff_50.8%,#cfedff_101.64%)]";
/** Фон секции безопасности (2888:17815) */
const SECURITY_GRADIENT =
  "bg-[linear-gradient(205.74deg,#d4e2ff_10.99%,#b3ebf6_79.92%,#b3f6e1_101.64%)]";
/** Фон CTA (2888:17852) — тот же, что у финального CTA главной */
const CTA_GRADIENT =
  "bg-[linear-gradient(245.7deg,#f0f8ff_20.714%,#f7f7f8_94.867%)] " +
  "md:bg-[linear-gradient(227.36deg,#f0f8ff_20.714%,#f7f7f8_94.867%)]";
/** Подложка карточки с превью агента (2888:17814) */
const PREVIEW_GRADIENT =
  "bg-[linear-gradient(39.67deg,#a6fddc_0%,#b1f1ff_50.45%,#cfe7ff_100%)]";

/* ──────────────────────────────── данные ───────────────────────────────── */

type TagItem = { label: string; icon: string };

const METRICS = [
  { value: 80, caption: "быстрее подготовка отчетов и аналитики" },
  { value: 70, caption: "быстрее подготовка отчетов и аналитики" },
  { value: 93, caption: "быстрее подготовка отчетов и аналитики" },
];

const WORKSPACE_CARDS: {
  title: string;
  text: string;
  tags: TagItem[];
  illustration: "team" | "personal";
}[] = [
  {
    title: "Работа команды",
    text: "Сотрудники используют общие документы, знания и настроенных агентов в одном рабочем пространстве",
    tags: [
      { label: "Общие агенты", icon: "/img/icons/shared-agents.svg" },
      { label: "Общие документы", icon: "/img/icons/document.svg" },
      { label: "Общие сессии", icon: "/img/icons/messages-square.svg" },
    ],
    illustration: "team",
  },
  {
    title: "Личное пространство",
    text: "Персональные агенты, документы и сессии для индивидуальных задач и экспериментов",
    tags: [
      { label: "Персональные агенты", icon: "/img/icons/bot.svg" },
      { label: "Приватные сессии", icon: "/img/icons/message-circle-lock.svg" },
    ],
    illustration: "personal",
  },
];

const BENEFITS = [
  {
    title: "Прозрачность",
    text: "Каждый участник видит, что сделал агент, и берет результат на проверку",
  },
  {
    title: "Скорость",
    text: "Ручные операции выполняются по расписанию. Команда проверяет и подтверждает готовый результат.",
  },
  {
    title: "Масштабируемость",
    text: "Тот же состав команды обрабатывает больше задач. Агенты забирают рутину, сотрудники контролируют качество.",
  },
];

const SECURITY_CARDS = [
  {
    tag: { label: "Юрисдикция РФ", icon: "/img/icons/double-headed-eagle.svg" },
    title: "Работает в РФ",
    text: "Российское правовое поле. Без санкционных рисков и вопросов к юрисдикции данных.",
  },
  {
    tag: { label: "Приватность", icon: "/img/icons/shield.svg" },
    title: "Данные под контролем",
    text: "Ваши данные никогда не используются для дообучения моделей",
  },
  {
    tag: { label: "On-premise", icon: "/img/icons/pentagon.svg" },
    title: "On-premise",
    text: "Под строгие требования ИБ есть внедрение внутри контура компании",
  },
];

const SECURITY_RULES = [
  {
    title: "Управление доступом",
    text: "SSO: Keycloak, LDAP / AD. Ролевая модель: пользователь, менеджер данных, администратор",
  },
  {
    title: "Логирование",
    text: "Мониторинг, логирование и шифрование всех данных и операций агентов",
  },
  {
    title: "Политики хранения",
    text: "Гибкие политики хранения и удаления данных под требования вашей компании",
  },
];

const SOLUTIONS: { title: string; text: string; tags: TagItem[] }[] = [
  {
    title: "CEO решения",
    text: "Отчеты, статусы и аналитика без переключения между системами.",
    tags: [
      { label: "Отчеты", icon: "/img/icons/reports.svg" },
      { label: "Аналитика", icon: "/img/icons/analitics.svg" },
    ],
  },
  {
    title: "Продажи",
    text: "CRM, follow-up, подготовка ко встречам и коммерческие предложения за считанные минуты.",
    tags: [
      { label: "CRM", icon: "/img/icons/crm.svg" },
      { label: "КП", icon: "/img/icons/commercial-offer.svg" },
    ],
  },
  {
    title: "Закупки",
    text: "Сравнение и проверка предложений поставщиков, подготовка техзаданий и рекомендаций.",
    tags: [
      { label: "Поставщики", icon: "/img/icons/supplier.svg" },
      { label: "ТЗ", icon: "/img/icons/spec.svg" },
    ],
  },
  {
    title: "Финансовый контроль",
    text: "План-факт, бюджет, сводки и контроль расходов без ручного сбора данных.",
    tags: [
      { label: "Бюджет", icon: "/img/icons/budget.svg" },
      { label: "Расходы", icon: "/img/icons/expenses.svg" },
    ],
  },
];

/* ─────────────────────────── мелкие компоненты ─────────────────────────── */

/** Kicker (2972:16059) — подпись-пилюля над заголовком секции */
function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <span className="w-fit rounded-full bg-bg-glass px-12 py-4 text-caption text-text-secondary uppercase">
      {children}
    </span>
  );
}

/** Tag (1388:5966) — иконка + подпись на полупрозрачной подложке */
function Tag({ label, icon }: TagItem) {
  return (
    <span className="flex items-center gap-4 rounded-full bg-bg-tag p-8 text-caption text-text-primary">
      <Icon src={icon} className="size-[24px] text-icon-primary" />
      {label}
    </span>
  );
}

/**
 * Мини-иллюстрации карточек пространств (I2888:17773;2294:9655 и
 * I2888:17774;2294:9655) — стеклянная панель со списком участников.
 */
function WorkspaceIllustration({ variant }: { variant: "team" | "personal" }) {
  const members =
    variant === "team"
      ? ["Иван", "Петр", "Мария", "Ольга"]
      : ["Иван"];

  return (
    <div className="pointer-events-none absolute top-[19px] right-[-72px] hidden h-[168px] w-[300px] overflow-hidden rounded-[18px] border-[1.5px] border-[#0dace038] bg-white/72 shadow-[0_16px_34px_0_rgba(23,61,99,0.12)] lg:block">
      <p className="flex items-center gap-8 px-16 pt-16 text-body-m font-semibold text-text-primary">
        {variant === "personal" ? (
          <Icon
            src="/img/icons/message-circle-lock.svg"
            className="size-[16px] text-icon-primary"
          />
        ) : null}
        {variant === "team" ? "Пространство Продажи" : "Личная сессия"}
      </p>
      <div className="mx-16 mt-14 h-px bg-[#dae1e9]" />
      <div className="mt-14 flex flex-wrap gap-8 px-16">
        {members.map((name) => (
          <span
            key={name}
            className="flex h-[36px] w-[132px] items-center gap-8 rounded-[10px] bg-white/72 px-8 shadow-[0_3px_5px_rgba(23,61,99,0.08)]"
          >
            <span className="flex size-[22px] items-center justify-center rounded-full bg-[#0dace01f] text-[11px] font-semibold text-[#0dace0]">
              {name[0]}
            </span>
            <span className="text-caption text-text-primary">{name}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ──────────────────────────────── страница ─────────────────────────────── */

export default function PlatformPage() {
  return (
    <>
      {/* ── Hero (2888:17748) ── */}
      <section className="relative w-full overflow-hidden bg-bg-page pt-[calc(64px+var(--header-h))] pb-64 md:pt-[calc(120px+var(--header-h))] md:pb-96">
        {/*
          hero-illustration (2888:17749): сплошная заливка + растровая
          подложка на 40% прозрачности поверх неё.
        */}
        <Image
          src="/img/platform/hero-bg.png"
          alt=""
          aria-hidden
          fill
          priority
          sizes="100vw"
          className="pointer-events-none absolute inset-0 -z-10 object-cover opacity-40"
        />

        <div className="container-page flex flex-col gap-48 lg:grid lg:grid-cols-[minmax(0,530px)_minmax(0,590px)] lg:items-center lg:justify-between lg:gap-40">
          <div className="flex flex-col gap-32">
            <div className="flex flex-col gap-24">
              <h1 className="text-h2 font-medium text-text-primary md:text-h1">
                ИИ-агенты для
                <br />
                всей компании
              </h1>
              <div className="flex flex-col gap-16 text-body-l text-text-secondary">
                <p>
                  Создавайте без разработки агентов под любую роль, описывая
                  задачи обычным языком.
                </p>
                <p>
                  Подключайте корпоративные системы и базы знаний для ускорения
                  рабочих процессов.
                </p>
              </div>
            </div>
            <div className="flex">
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

          {/* Hero Right (2888:17757) — превью с кнопкой воспроизведения */}
          <Link
            href="/video"
            aria-label="Смотреть обучающие видео"
            className="group relative block aspect-[590/326] w-full overflow-hidden rounded-[24px] bg-neutral-50 shadow-drop-md"
          >
            <Image
              src="/img/platform/hero-preview.png"
              alt="Интерфейс GigaCowork"
              fill
              priority
              sizes="(min-width: 1024px) 590px, 100vw"
              className="object-cover"
            />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex size-[64px] items-center justify-center rounded-full bg-bg-page/85 shadow-drop-sm transition-transform duration-300 group-hover:scale-105">
                <span
                  aria-hidden
                  className="ml-4 size-0 border-y-[10px] border-l-[16px] border-y-transparent border-l-text-primary"
                />
              </span>
            </span>
          </Link>
        </div>
      </section>

      {/* ── Metrics (2888:17761) ── */}
      <section className="w-full bg-bg-page py-48 md:py-64">
        <CountUp>
          <div className="container-page grid gap-40 sm:grid-cols-3">
            {METRICS.map((metric, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-16 overflow-hidden"
              >
                <p className="flex items-baseline text-text-primary">
                  <span
                    data-counter
                    data-counter-value={metric.value}
                    className="text-h1 md:text-display-xl"
                  >
                    {metric.value}
                  </span>
                  <span className="text-h3 md:text-h1">%</span>
                </p>
                <p className="max-w-[307px] text-center text-body-l text-text-primary">
                  {metric.caption}
                </p>
              </div>
            ))}
          </div>
        </CountUp>
      </section>

      {/* ── Workspace (2888:17766) ── */}
      <section className="w-full bg-bg-page py-64 md:py-100">
        <div className="container-page flex flex-col gap-32">
          <header className="flex flex-col gap-16">
            <Kicker>Совместная работа</Kicker>
            <h2 className="text-h3 font-medium text-text-primary md:text-h2">
              Каждая команда работает
              <br className="hidden md:block" /> вместе с агентами в своей среде
            </h2>
            <p className="text-body-l text-text-secondary">
              Сотрудники работают в своих рабочих пространствах с агентами,
              документами и политиками доступа
            </p>
          </header>

          <div className="grid gap-24 lg:grid-cols-2">
            {WORKSPACE_CARDS.map((card) => (
              <article
                key={card.title}
                className={`relative flex min-h-[291px] flex-col justify-between gap-24 overflow-hidden rounded-[24px] px-24 pt-32 pb-24 md:px-40 md:pt-40 ${CARD_GRADIENT_39}`}
              >
                <div className="flex flex-col gap-16 lg:pr-[188px]">
                  <h3 className="text-h4 font-medium text-text-primary md:text-h3">
                    {card.title}
                  </h3>
                  <p className="text-body-m text-text-secondary">{card.text}</p>
                </div>
                <div className="flex flex-wrap gap-8 lg:pr-[188px]">
                  {card.tags.map((tag) => (
                    <Tag key={tag.label} {...tag} />
                  ))}
                </div>
                <WorkspaceIllustration variant={card.illustration} />
              </article>
            ))}
          </div>

          <div className="grid gap-24 md:grid-cols-3">
            {BENEFITS.map((benefit) => (
              <article
                key={benefit.title}
                className={`flex flex-col gap-12 rounded-[16px] p-24 md:p-32 ${BENEFIT_GRADIENT}`}
              >
                <h3 className="text-h4 font-medium text-text-primary">
                  {benefit.title}
                </h3>
                <p className="text-body-m text-text-secondary">{benefit.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI Agents (2888:17785) ── */}
      <section className="w-full bg-bg-page py-64 md:py-100">
        <div className="container-page flex flex-col gap-48 md:gap-80">
          <header className="flex flex-col gap-16">
            <Kicker>Возможности платформы</Kicker>
            <h2 className="text-h3 font-medium text-text-primary md:text-h2">
              Инструменты автоматизации
              <br className="hidden md:block" /> бизнес-процессов
            </h2>
          </header>

          <div className="flex flex-col gap-32 lg:grid lg:grid-cols-2 lg:items-center lg:gap-24">
            <div className="flex flex-col gap-16 lg:max-w-[532px]">
              <h3 className="text-h4 font-medium text-text-primary md:text-h3">
                ИИ-агенты
              </h3>
              <p className="text-body-l text-text-secondary">
                Передайте агентам трудоемкие задачи. Для типовых процессов
                настройте агента один раз и используйте всей командой.
              </p>
            </div>

            {/* Card / Product Preview (2888:17814) */}
            <div
              className={`relative aspect-[588/400] w-full overflow-hidden rounded-[24px] ${PREVIEW_GRADIENT}`}
            >
              <Image
                src="/img/platform/agent-preview.png"
                alt="Настройка ИИ-агента в GigaCowork"
                fill
                sizes="(min-width: 1024px) 588px, 100vw"
                className="object-cover object-left-top"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Security (2888:17815) ── */}
      <section className={`w-full py-64 md:py-100 ${SECURITY_GRADIENT}`}>
        <div className="container-page flex flex-col gap-40 md:gap-56">
          <header className="flex flex-col gap-16">
            <Kicker>Корпоративная безопасность</Kicker>
            <h2 className="text-h3 font-medium text-text-primary md:text-h2">
              Безопасность и контроль
              <br className="hidden md:block" /> корпоративного уровня
            </h2>
            <div className="flex flex-col gap-16 md:flex-row md:items-start md:justify-between">
              <p className="text-body-l text-text-primary">
                Защита данных, контроль доступа и соответствие требованиям
                корпоративной безопасности
              </p>
              <Link
                href="/lead"
                className="flex shrink-0 items-center gap-8 text-body-m text-text-primary transition-opacity hover:opacity-70"
              >
                Подробнее о безопасности
                <Icon
                  src="/img/icons/arrow-up-right.svg"
                  className="size-[9px] text-icon-primary"
                />
              </Link>
            </div>
          </header>

          <div className="flex flex-col gap-24">
            <div className="grid gap-24 md:grid-cols-3">
              {SECURITY_CARDS.map((card) => (
                <article
                  key={card.title}
                  className="flex flex-col gap-16 rounded-[16px] bg-bg-page p-24 shadow-[0_12px_24px_rgba(96,115,143,0.2)] md:p-32"
                >
                  <span className="flex w-fit items-center gap-4 rounded-full bg-bg-card-lavender p-8 text-caption text-text-primary">
                    <Icon
                      src={card.tag.icon}
                      className="size-[24px] text-icon-primary"
                    />
                    {card.tag.label}
                  </span>
                  <h3 className="text-h4 font-medium text-text-primary">
                    {card.title}
                  </h3>
                  <p className="text-body-m text-text-primary">{card.text}</p>
                </article>
              ))}
            </div>

            <div className="grid gap-24 md:grid-cols-3">
              {SECURITY_RULES.map((rule) => (
                <article
                  key={rule.title}
                  className="flex flex-col gap-10 pt-20 pr-24"
                >
                  <span aria-hidden className="h-px w-full bg-text-primary" />
                  <h3 className="text-body-l text-text-primary">{rule.title}</h3>
                  <p className="text-caption text-text-secondary">{rule.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Solutions (2888:17841) ── */}
      <section className="w-full bg-bg-page py-64 md:py-100">
        <div className="container-page flex flex-col gap-40 md:gap-56">
          <header className="flex flex-col gap-16">
            <Kicker>Решения для отделов</Kicker>
            <h2 className="text-h3 font-medium text-text-primary md:text-h2">
              ИИ-решение для всех подразделений
            </h2>
            <p className="text-body-l text-text-secondary">
              GigaCowork помогает облегчить работу руководителей, коммерческих
              команд и бэк-офиса
            </p>
          </header>

          <div className="grid gap-24 sm:grid-cols-2 xl:grid-cols-4">
            {SOLUTIONS.map((card) => (
              <article
                key={card.title}
                className={`flex min-h-[291px] flex-col justify-between gap-24 overflow-hidden rounded-[24px] px-24 pt-32 pb-24 md:px-40 md:pt-40 ${CARD_GRADIENT_60}`}
              >
                <div className="flex flex-col gap-16">
                  <h3 className="text-h4 font-medium text-text-primary md:text-h3">
                    {card.title}
                  </h3>
                  <p className="text-body-m text-text-secondary">{card.text}</p>
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

      {/* ── CTA (2888:17852) ── */}
      <section className={`w-full py-80 md:py-160 ${CTA_GRADIENT}`}>
        <div className="container-page flex flex-col items-center gap-40">
          <h2 className="max-w-[522px] text-center text-h3 font-medium text-text-primary md:text-h2">
            Готовы делегировать
            <br className="hidden md:block" /> работу ИИ-агентам?
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
