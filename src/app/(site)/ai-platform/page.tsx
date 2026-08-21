import { readFileSync } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { HeroImage } from "@/components/ui/HeroImage";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { CTA_FALLBACK, CtaBackground } from "@/components/ui/CtaBackground";
import { Icon } from "@/components/ui/Icon";
import CountUp from "@/components/interactive/CountUp";
import FeatureStack from "@/components/interactive/FeatureStack";
import TokenIllustrations from "@/components/interactive/TokenIllustrations";
import { useCaseHref } from "@/lib/use-cases";

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
  title: "О\u00A0платформе\u00A0— GigaCowork",
  description:
    "GigaCowork\u00A0— платформа ИИ-агентов для\u00A0всей компании: общие и\u00A0личные пространства, навыки и\u00A0команды, коннекторы к\u00A0корпоративным системам и\u00A0безопасность корпоративного уровня.",
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
/* ──────────────────────────────── данные ───────────────────────────────── */

type TagItem = { label: string; icon: string };

const METRICS = [
  { value: 80, caption: "быстрее подготовка отчетов и\u00A0аналитики" },
  { value: 70, caption: "быстрее подготовка отчетов и\u00A0аналитики" },
  { value: 93, caption: "быстрее подготовка отчетов и\u00A0аналитики" },
];

/**
 * Микроанимация панелей в карточках пространств.
 *
 * Приём тот же, что в «Безлимитном количестве токенов»: SVG вставляется
 * инлайном (из <img> до слоёв внутри не добраться), каждой группе дописывается
 * `data-token-layer` и переменные — откуда выезжает, до какой прозрачности
 * доходит и с какой задержкой стартует. Проигрывание включает
 * TokenIllustrations, вся раскладка — в globals.css.
 *
 * В файлах ровно та структура, которая для этого нужна: первая группа — сама
 * панель, следующие — пилюли участников со своими тенями. Панель выезжает
 * справа, пилюли поднимаются снизу одна за другой.
 */
type ArtLayer = { from: [number, number]; delay: number };

/** Панель, затем четыре участника: два ряда по два (x 54/156 и 62/171). */
const TEAM_LAYERS: ArtLayer[] = [
  { from: [18, 0], delay: 0 },
  { from: [0, 14], delay: 180 },
  { from: [0, 14], delay: 260 },
  { from: [0, 14], delay: 340 },
  { from: [0, 14], delay: 420 },
];

/** В личном пространстве участник один. */
const PERSONAL_LAYERS: ArtLayer[] = [
  { from: [18, 0], delay: 0 },
  { from: [0, 14], delay: 200 },
];

function inlineWorkspaceArt(file: string, layers: ArtLayer[]) {
  const raw = readFileSync(
    path.join(process.cwd(), "public", "img", "platform", file),
    "utf8"
  );

  let index = -1;
  return raw
    .replace(
      "<svg ",
      '<svg class="pointer-events-none absolute top-px right-0 select-none" '
    )
    .replace(/<g\b([^>]*)>/g, (match, attrs: string) => {
      index += 1;
      const layer = layers[index];
      if (!layer) return match;
      const opacity = /opacity="([\d.]+)"/.exec(attrs)?.[1] ?? "1";
      return (
        `<g${attrs} data-token-layer style="` +
        `--from-x:${layer.from[0]}px;--from-y:${layer.from[1]}px;` +
        `--to-opacity:${opacity};--delay:${layer.delay}ms">`
      );
    });
}

const WORKSPACE_CARDS: {
  title: string;
  text: string;
  tags: TagItem[];
  /** инлайновый SVG со слоями для микроанимации */
  art: string;
}[] = [
  {
    title: "Работа команды",
    text: "Сотрудники используют общие документы, знания и\u00A0настроенных агентов в\u00A0одном рабочем пространстве",
    tags: [
      { label: "Общие агенты", icon: "/img/icons/shared-agents.svg" },
      { label: "Общие документы", icon: "/img/icons/document.svg" },
      { label: "Общие сессии", icon: "/img/icons/messages-square.svg" },
    ],
    art: inlineWorkspaceArt("workspace-team.svg", TEAM_LAYERS),
  },
  {
    title: "Личное пространство",
    text: "Персональные агенты, документы и\u00A0сессии для\u00A0индивидуальных задач и\u00A0экспериментов",
    tags: [
      { label: "Персональные агенты", icon: "/img/icons/bot.svg" },
      { label: "Приватные сессии", icon: "/img/icons/message-circle-lock.svg" },
    ],
    art: inlineWorkspaceArt("workspace-personal.svg", PERSONAL_LAYERS),
  },
];

/**
 * Возможности платформы (2888:17785 → Agent Block 0 и Agent Block Mobile).
 * В десктопном макете отрисован только первый блок, остальные четыре
 * раскрыты в мобильном фрейме 2888:17927 — тексты взяты оттуда. Превью —
 * пять вариантов компонента Card / Product Preview (2281:36520): Result,
 * Skills, Tasks, Connectors, Schedule.
 */
const AGENT_BLOCKS = [
  {
    title: "ИИ-агенты",
    text: "Передайте агентам трудоемкие задачи. Для\u00A0типовых процессов настройте агента один раз и\u00A0используйте всей командой.",
    preview: "/img/platform/agent-result.webp",
  },
  {
    title: "Навыки",
    text: "Превратите лучшие практики компании в\u00A0единый стандарт работы для\u00A0всех сотрудников",
    preview: "/img/platform/agent-skills.webp",
  },
  {
    title: "Быстрые команды",
    text: "Сохраните повторяющиеся действия один раз и\u00A0запускайте их одним нажатием",
    preview: "/img/platform/agent-tasks.webp",
  },
  {
    title: "Коннекторы",
    text: "Подключите корпоративные системы, чтобы агенты работали с\u00A0актуальными данными и\u00A0по\u00A0корпоративным правилам",
    preview: "/img/platform/agent-connectors.webp",
  },
  {
    title: "Запуск по\u00A0расписанию или\u00A0событию",
    text: "Настройте расписание или\u00A0триггер один раз. Повторяющиеся процессы будут выполняться автоматически.",
    preview: "/img/platform/agent-schedule.webp",
  },
];

const BENEFITS = [
  {
    title: "Прозрачность",
    text: "Каждый участник видит, что\u00A0сделал агент, и\u00A0берет результат на\u00A0проверку",
  },
  {
    title: "Скорость",
    text: "Ручные операции выполняются по\u00A0расписанию. Команда проверяет и\u00A0подтверждает готовый результат.",
  },
  {
    title: "Масштабируемость",
    text: "Тот\u00A0же состав команды обрабатывает больше задач. Агенты забирают рутину, сотрудники контролируют качество.",
  },
];

const SECURITY_CARDS = [
  {
    tag: { label: "Юрисдикция РФ", icon: "/img/icons/double-headed-eagle.svg" },
    title: "Работает в\u00A0РФ",
    text: "Российское правовое поле. Без\u00A0санкционных рисков и\u00A0вопросов к\u00A0юрисдикции данных.",
  },
  {
    tag: { label: "Приватность", icon: "/img/icons/shield.svg" },
    title: "Данные под\u00A0контролем",
    text: "Ваши данные никогда не\u00A0используются для\u00A0дообучения моделей",
  },
  {
    tag: { label: "On-premise", icon: "/img/icons/pentagon.svg" },
    title: "On-premise",
    text: "Под\u00A0строгие требования ИБ есть внедрение внутри контура компании",
  },
];

const SECURITY_RULES = [
  {
    title: "Управление доступом",
    text: "SSO: Keycloak, LDAP / AD. Ролевая модель: пользователь, менеджер данных, администратор",
  },
  {
    title: "Логирование",
    text: "Мониторинг, логирование и\u00A0шифрование всех данных и\u00A0операций агентов",
  },
  {
    title: "Политики хранения",
    text: "Гибкие политики хранения и\u00A0удаления данных под\u00A0требования вашей компании",
  },
];

/**
 * Карточки «ИИ-решение для всех подразделений».
 *
 * `useCase` — слаг страницы «Для кого», на которую ведёт карточка. Адрес
 * собирается через useCaseHref, а не пишется строкой: та же функция питает
 * меню в шапке и карточки главной, и опечатка в слаге валит сборку, а не
 * превращается в мёртвую ссылку.
 *
 * «Финансовый контроль» ведёт на /use_cases/finance: отдельной страницы под
 * этот заголовок в карте сайта нет, ближайшая по смыслу — «Финансы».
 */
const SOLUTIONS: {
  title: string;
  text: string;
  useCase: string;
  tags: TagItem[];
}[] = [
  {
    title: "Управленческие решения",
    text: "Отчеты, статусы и\u00A0аналитика без\u00A0переключения между системами.",
    useCase: "ceo",
    tags: [
      { label: "Отчеты", icon: "/img/icons/reports.svg" },
      { label: "Аналитика", icon: "/img/icons/analitics.svg" },
    ],
  },
  {
    title: "Продажи",
    text: "CRM, follow-up, подготовка ко\u00A0встречам и\u00A0коммерческие предложения за\u00A0считанные минуты.",
    useCase: "salesforce",
    tags: [
      { label: "CRM", icon: "/img/icons/crm.svg" },
      { label: "КП", icon: "/img/icons/commercial-offer.svg" },
    ],
  },
  {
    title: "Закупки",
    text: "Сравнение и\u00A0проверка предложений поставщиков, подготовка техзаданий и\u00A0рекомендаций.",
    useCase: "procurement",
    tags: [
      { label: "Поставщики", icon: "/img/icons/supplier.svg" },
      { label: "ТЗ", icon: "/img/icons/spec.svg" },
    ],
  },
  {
    title: "Финансовый контроль",
    text: "План-факт, бюджет, сводки и\u00A0контроль расходов без\u00A0ручного сбора данных.",
    useCase: "finance",
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
    <span className="w-fit rounded-full bg-bg-glass py-4 pl-12 pr-[14px] text-caption text-text-secondary uppercase">
      {children}
    </span>
  );
}

/** Tag (1388:5966) — иконка + подпись на полупрозрачной подложке */
function Tag({ label, icon }: TagItem) {
  return (
    <span className="flex items-center gap-4 rounded-full bg-bg-tag py-8 pl-8 pr-[10px] text-caption text-text-primary">
      <Icon src={icon} className="size-[24px] text-icon-primary" />
      {label}
    </span>
  );
}


/* ──────────────────────────────── страница ─────────────────────────────── */

export default function PlatformPage() {
  return (
    <>
      {/*
        ── Hero (2888:17748) ──

        `id="hero"` — рабочий, а не декоративный: по нему шапка понимает, что
        находится над hero, и остаётся прозрачной, пропуская фон под навигацию.
        Без него Header считает страницу «без hero» и с самого верха кладёт
        белую подложку (см. src/components/sections/Header.tsx).

        `isolate` — чтобы фоновая картинка со своим отрицательным слоем не
        уходила под заливку страницы: без изоляции слой всплывает к корню и
        картинку перекрывает белый фон body.
      */}
      <section
        id="hero"
        className="relative isolate flex w-full flex-col justify-center overflow-hidden bg-bg-page pt-120 pb-48 md:min-h-[760px] md:pb-[100px]"
      >
        {/*
          hero-illustration (2888:17749). В макете это заливка плюс растр на
          40% прозрачности; в экспорте прозрачность уже сведена, поэтому
          здесь картинка кладётся как есть.

          Два кадра: десктопный 2880×1520 и мобильный 780×1492 — это своя
          обрезка под вертикальный экран, а не тот же файл в другом размере.
        */}
        <HeroImage
          desktop="/img/platform/hero-bg.webp"
          mobile="/img/platform/hero-bg-mob.webp"
          className="pointer-events-none absolute inset-0 -z-10 size-full object-cover"
        />

        {/*
          Раньше справа стояла карточка со скриншотом и кнопкой воспроизведения
          (Hero Right, 2888:17757) — заглушка видео, которого пока нет. Кнопка
          запечена в сам растр, отдельным слоем её не снять, поэтому карточка
          убрана целиком, а сетка свёрнута в одну колонку.

          Ширина текста ограничена: на всю ширину контейнера строки заголовка и
          абзацев расползались бы на две трети экрана и читались бы тяжело.
        */}
        <div className="container-page flex flex-col gap-24">
          <div className="flex max-w-[720px] flex-col gap-32">
            <div className="flex flex-col gap-24">
              <h1 className="text-h2 font-medium text-text-primary md:text-h1">
                ИИ-агенты для
                <br />
                всей компании
              </h1>
              <div className="flex flex-col gap-16 text-body-l text-text-secondary">
                <p>
                  Создавайте без&nbsp;разработки агентов под&nbsp;любую роль, описывая
                  задачи обычным языком.
                </p>
                <p>
                  Подключайте корпоративные системы и&nbsp;базы знаний для&nbsp;ускорения
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

        </div>
      </section>

      {/* ── Metrics (2888:17761) ── */}
      <section className="w-full bg-bg-page py-64 md:py-48">
        <CountUp>
          <div className="container-page grid gap-40 sm:grid-cols-3">
            {METRICS.map((metric, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-16 overflow-hidden"
              >
                {/*
                  Размеры из макета: число — Display/XL (160) на десктопе и
                  Display/L (96) на мобильном (2888:17941), знак процента —
                  Heading/H1 (48) в обеих раскладках. Мельче делать нечего:
                  на 390 «80 %» в 96 пунктах занимает 216 из 358 доступных.
                */}
                <p className="flex items-baseline text-text-primary">
                  <span
                    data-counter
                    data-counter-value={metric.value}
                    className="text-display-l md:text-display-xl"
                  >
                    {metric.value}
                  </span>
                  <span className="text-h1">%</span>
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
      <section className="w-full bg-bg-page py-48 md:py-[100px]">
        <div className="container-page flex flex-col gap-32">
          <header className="flex flex-col gap-16">
            <Kicker>Совместная работа</Kicker>
            <h2 className="text-h3 font-medium text-text-primary md:text-h2">
              Каждая команда работает
              <br className="hidden md:block" /> вместе с&nbsp;агентами в&nbsp;своей среде
            </h2>
            <p className="text-body-l text-text-secondary">
              Сотрудники работают в&nbsp;своих рабочих пространствах с&nbsp;агентами,
              документами и&nbsp;политиками доступа
            </p>
          </header>

          <TokenIllustrations>
            <div className="grid gap-24 lg:grid-cols-2">
            {WORKSPACE_CARDS.map((card) => (
              <article
                key={card.title}
                data-token-card={card.title}
                className={`relative flex min-h-[291px] flex-col justify-between gap-24 overflow-hidden rounded-[24px] px-24 pt-32 pb-24 md:px-40 md:pt-40 ${CARD_GRADIENT_39}`}
              >
                <div className="flex flex-col gap-16 lg:max-w-[320px]">
                  <h3 className="text-h4 font-medium text-text-primary md:text-h3">
                    {card.title}
                  </h3>
                  <p className="text-body-m text-text-secondary">{card.text}</p>
                </div>
                <div className="flex flex-wrap gap-8 lg:max-w-[320px]">
                  {card.tags.map((tag) => (
                    <Tag key={tag.label} {...tag} />
                  ))}
                </div>
                {/*
                  Illustration (2888:17773 → x 360, y 19, 300×168) — панель
                  свисает за правый край и обрезается карточкой; в экспорте
                  обрезка уже учтена, поэтому ставим встык к правому краю.
                  В мобильном макете иллюстрации в карточках нет.

                  Вставлена инлайном ради микроанимации: слои внутри SVG
                  выезжают по очереди (см. inlineWorkspaceArt выше).
                */}
                <div
                  aria-hidden
                  data-token-art
                  className="hidden lg:block"
                  dangerouslySetInnerHTML={{ __html: card.art }}
                />
              </article>
            ))}
            </div>
          </TokenIllustrations>

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
      <section className="w-full bg-bg-page py-48 md:py-[100px]">
        <div className="container-page flex flex-col gap-48 md:gap-80">
          {/*
            Заголовок липкий: карточки в стопке едут долго, и без этого читатель
            быстро теряет, о каком разделе речь. Отступы стопки отсчитываются от
            его низа, см. STICKY_TOP в FeatureStack.

            Заливка нужна только на ширину левой колонки. В конце блока стопка
            открепляется и уезжает вверх — подпись карточки прошла бы прямо
            сквозь заголовок, поэтому под ним стоит фон. Но на всю ширину он
            срезал бы верхний край карточки белой полосой, а карточка идёт во
            второй колонке (680 + gap 40), поэтому фон обрывается по границе
            колонок.
          */}
          <header
            data-stack-header
            /*
              --stack-tail считает FeatureStack: это невидимый «хвост» снизу,
              которым липкий диапазон заголовка укорачивается до диапазона
              верхней карточки. Отрицательный margin гасит его в потоке, так что
              на раскладку хвост не влияет; pointer-events снимаются, чтобы
              пустая область не перехватывала курсор у стопки.
            */
            className="pointer-events-none relative z-20 flex flex-col gap-16 lg:sticky lg:top-[var(--header-h)] lg:pb-[var(--stack-tail,0px)]"
          >
            <div className="pointer-events-auto flex flex-col gap-16 lg:py-16">
              <Kicker>Возможности платформы</Kicker>
              <h2 className="text-h3 font-medium text-text-primary md:text-h2">
                Инструменты автоматизации
                <br className="hidden md:block" /> бизнес-процессов
              </h2>
            </div>
          </header>

          {/* Обёртка гасит хвост заголовка, чтобы он не растянул раскладку. */}
          <div className="lg:mt-[calc(var(--stack-tail,0px)*-1)]">
            <FeatureStack items={AGENT_BLOCKS} />
          </div>
        </div>
      </section>

      {/* ── Security (2888:17815) ── */}
      <section className={`w-full py-48 md:py-[100px] ${SECURITY_GRADIENT}`}>
        <div className="container-page flex flex-col gap-24 md:gap-[56px]">
          <header className="flex flex-col gap-16">
            <Kicker>Корпоративная безопасность</Kicker>
            <h2 className="text-h3 font-medium text-text-primary md:text-h2">
              Безопасность и&nbsp;контроль
              <br className="hidden md:block" /> корпоративного уровня
            </h2>
            <div className="flex flex-col gap-16 md:flex-row md:items-start md:justify-between">
              <p className="text-body-l text-text-primary">
                Защита данных, контроль доступа и&nbsp;соответствие требованиям
                корпоративной безопасности
              </p>
              {/*
                ВРЕМЕННО СКРЫТО: страницы про безопасность ещё нет, ссылка вела
                на форму заявки. Вернуть — раскомментировать блок ниже.

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
              */}
            </div>
          </header>

          <div className="flex flex-col gap-24">
            <div className="grid gap-24 md:grid-cols-3">
              {SECURITY_CARDS.map((card) => (
                <article
                  key={card.title}
                  className="flex flex-col gap-16 rounded-[16px] bg-bg-page p-24 shadow-[0_12px_24px_rgba(96,115,143,0.2)] md:p-32"
                >
                  <span className="flex w-fit items-center gap-4 rounded-full bg-bg-card-lavender py-8 pl-8 pr-[10px] text-caption text-text-primary">
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
                  className="flex flex-col gap-[10px] pt-[20px] pr-24"
                >
                  <span aria-hidden className="h-px w-full bg-text-primary" />
                  <h3 className="text-body-l text-text-primary">{rule.title}</h3>
                  <p className="text-body-m text-text-secondary">{rule.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Solutions (2888:17841) ── */}
      <section className="w-full bg-bg-page py-32 md:py-[100px]">
        <div className="container-page flex flex-col gap-24 md:gap-[56px]">
          <header className="flex flex-col gap-16">
            <Kicker>Решения для&nbsp;отделов</Kicker>
            <h2 className="text-h3 font-medium text-text-primary md:text-h2">
              ИИ-решение для&nbsp;всех подразделений
            </h2>
            <p className="text-body-l text-text-secondary">
              GigaCowork помогает облегчить работу руководителей, коммерческих
              команд и&nbsp;бэк-офиса
            </p>
          </header>

          <div className="grid gap-24 sm:grid-cols-2 xl:grid-cols-4">
            {SOLUTIONS.map((card) => (
              /*
                Состояния — те же, что у карточек кейсов на главной: утилита
                `card-interactive` из globals.css даёт наведение (тень
                Elevation/Drop/Lg), нажатие (Drop/Sm) и обводку по клавиатуре.
              */
              <article
                key={card.title}
                className={`card-interactive relative flex min-h-[291px] flex-col justify-between gap-24 overflow-hidden rounded-[24px] px-24 pt-32 pb-24 md:px-40 md:pt-40 ${CARD_GRADIENT_60}`}
              >
                <div className="flex flex-col gap-16">
                  <h3 className="text-h4 font-medium text-text-primary md:text-h3">
                    {/*
                      Ссылка обёрнута вокруг заголовка, а не положена поверх
                      карточки пустым слоем: так у неё есть собственный текст
                      для скринридера и истории браузера, а `stretched-target`
                      всё равно растягивает зону клика на всю карточку.
                    */}
                    <Link
                      href={useCaseHref(card.useCase)}
                      className="stretched-target focus-visible:outline-none"
                    >
                      {card.title}
                    </Link>
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
      <section
        className={`relative isolate w-full overflow-hidden py-64 md:py-160 ${CTA_FALLBACK}`}
      >
        <CtaBackground />
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
