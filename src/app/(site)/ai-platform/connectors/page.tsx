import { existsSync } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import type { ReactNode } from "react";

import TokenIllustrations from "@/components/interactive/TokenIllustrations";
import Button from "@/components/ui/Button";
import { CTA_FALLBACK, CtaBackground } from "@/components/ui/CtaBackground";
import { HeroImage } from "@/components/ui/HeroImage";
import Image from "@/components/ui/Image";
import { Kicker } from "@/components/ui/Kicker";
import { JsonLd } from "@/components/seo/JsonLd";
import { PAGE_SEO } from "@/content/seo";
import { seoMetadata } from "@/lib/site";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

/**
 * «Интеграции» — /ai-platform/connectors
 *
 * Макеты: desktop 3680:27873 (Connectors / Desktop 1440), mobile 3919:32444.
 * Секции: Hero (3680:27874 / 3919:32445), Catalog (3856:64808 / 3919:34145),
 * Benefits (3947:34636 / 3919:32501), How To Add (3855:64787 / 3947:35100),
 * CTA (3680:27922).
 */

export const metadata: Metadata = seoMetadata(PAGE_SEO.connectors);

/* ──────────────────────────── градиенты из макета ──────────────────────── */

/**
 * Заливка широкой карточки «Собственные интеграции» (3872:23371). Остальные
 * карточки каталога белые, эта одна — с градиентом.
 */
const OWN_CARD_GRADIENT =
  "bg-[linear-gradient(232.5deg,#f8f3ed_0%,#e9f6fa_100%)]";
/** Фон каталога (3856:64808). */
const CATALOG_GRADIENT =
  "bg-[linear-gradient(200.01deg,#d4e2ff_0%,#b3ebf6_73.845%,#b3f6e1_97.115%)]";
/** Карточки выгод (3947:34692). */
const BENEFIT_GRADIENT =
  "bg-[linear-gradient(48.09deg,#c5f8e5_0.952%,#dcf9ff_50.802%,#e4f5ff_101.64%)]";
/** Заливка номера шага (2925:14881). */
const STEP_NUMBER_GRADIENT =
  "bg-[linear-gradient(90deg,#00b8ca_0%,#1cbbf3_53.96%,#9fb6f8_102.04%)]";

/* Локальная палитра моков интерфейса — см. /ai-platform/agents. */
const MOCK_SURFACE = "bg-[#ffffffb8]";
const MOCK_CELL = "bg-[#ffffffe6]";
const MOCK_ACCENT_16 = "bg-[#0dace029]";
const MOCK_SOLID = "bg-[#0dace0]";
const MOCK_BORDER = "border-[#0dace038]";
const MOCK_SHADOW = "shadow-[0_16px_34px_0_#173d631f]";
const MOCK_CELL_SHADOW = "shadow-[0_3px_10px_0_#173d6314]";

/* ──────────────────────────── каталог интеграций ──────────────────────── */

/**
 * Логотипы сервисов лежат в `public/img/connectors/logos/<slug>.{svg,png,webp}`.
 * Взяты из выгрузки макета `Connectors / Catalog` (3856:64808): векторные —
 * как есть, растровые — уменьшены до 96px по длинной стороне и переведены в
 * webp (в слоте они рисуются 32×32, 96 — запас под 3×).
 *
 * Файла нет — на месте логотипа остаётся нейтральный квадрат того же размера,
 * и строка не разъезжается. Добавить сервис можно, положив файл рядом: код
 * править не нужно.
 */
const LOGO_DIR = path.join(
  process.cwd(),
  "public",
  "img",
  "connectors",
  "logos",
);

function logoSrc(slug: string): string | null {
  for (const ext of [".svg", ".png", ".webp"]) {
    if (existsSync(path.join(LOGO_DIR, slug + ext))) {
      return `/img/connectors/logos/${slug}${ext}`;
    }
  }
  return null;
}

type Product = { label: string; slug: string };
type Category = { title: ReactNode; products: Product[]; wide?: boolean };

const CATEGORIES: Category[] = [
  {
    title: <>Почтовые сервисы</>,
    products: [
      { label: "Gmail", slug: "gmail" },
      { label: "Mail.ru", slug: "mail-ru" },
      { label: "Microsoft Outlook", slug: "outlook" },
      { label: "Яндекс Почта", slug: "yandex-mail" },
      { label: "IMAP", slug: "imap" },
    ],
  },
  {
    title: (
      <>
        Планировщики <br className="hidden lg:inline" />и календари
      </>
    ),
    products: [
      { label: "Google Calendar", slug: "google-calendar" },
      { label: "Calendly", slug: "calendly" },
      { label: "Zoom", slug: "zoom" },
    ],
  },
  {
    title: <>Облачные хранилища</>,
    products: [
      { label: "Google Drive", slug: "google-drive" },
      { label: "Яндекс Диск", slug: "yandex-disk" },
      { label: "Microsoft OneDrive", slug: "onedrive" },
    ],
  },
  {
    title: <>CRM-системы</>,
    products: [
      { label: "amoCRM", slug: "amocrm" },
      { label: "Битрикс24", slug: "bitrix24" },
      { label: "RetailCRM", slug: "retailcrm" },
      { label: "СБИС CRM", slug: "sbis-crm" },
      { label: "YClients", slug: "yclients" },
    ],
  },
  {
    title: <>ERP и&nbsp;учетные системы</>,
    products: [
      { label: "1С", slug: "1c" },
      { label: "МойСклад", slug: "moysklad" },
      { label: "ПланФакт", slug: "planfact" },
      { label: "Мое Дело", slug: "moe-delo" },
      { label: "InSales", slug: "insales" },
    ],
  },
  {
    title: (
      <>
        Управление задачами <br className="hidden lg:inline" />и проектами
      </>
    ),
    products: [
      { label: "Asana", slug: "asana" },
      { label: "Кайтен", slug: "kaiten" },
      { label: "Miro", slug: "miro" },
    ],
  },
  {
    title: <>Телефония и&nbsp;мессенджеры</>,
    products: [
      { label: "UIS", slug: "uis" },
      { label: "Wazzup", slug: "wazzup" },
      { label: "Telegram", slug: "telegram" },
      { label: "TextBack", slug: "textback" },
      { label: "MAX", slug: "max" },
    ],
  },
  {
    title: <>Обучение и&nbsp;рекрутинг</>,
    products: [
      { label: "iSpring Learn", slug: "ispring-learn" },
      { label: "ProgressMe", slug: "progressme" },
      { label: "Skillaz", slug: "skillaz" },
      { label: "Huntflow", slug: "huntflow" },
    ],
  },
  {
    title: <>Маркетинг и&nbsp;аналитика</>,
    products: [
      { label: "MPSTATS", slug: "mpstats" },
      { label: "Roistat", slug: "roistat" },
      { label: "Mindbox", slug: "mindbox" },
      { label: "Unisender", slug: "unisender" },
      { label: "BotHelp", slug: "bothelp" },
    ],
  },
  {
    title: <>Help Desk и&nbsp;поддержка</>,
    products: [
      { label: "HelpDeskEddy", slug: "helpdeskeddy" },
      { label: "Юздеск", slug: "usedesk" },
    ],
  },
  {
    title: <>Базы знаний</>,
    products: [{ label: "Confluence", slug: "confluence" }],
  },
  {
    title: <>Рестораны и&nbsp;логистика</>,
    products: [
      { label: "iiko", slug: "iiko" },
      { label: "Почта России", slug: "pochta-rossii" },
    ],
  },
  {
    title: <>Вебинары и&nbsp;мероприятия</>,
    products: [{ label: "MTS Link", slug: "mts-link" }],
  },
  {
    /* В макете карточка шире — занимает две колонки из трёх (3872:23371). */
    title: <>Собственные интеграции</>,
    products: [{ label: "MCP-серверы вашей компании", slug: "mcp" }],
    wide: true,
  },
];

/* ──────────────────────────────── данные ───────────────────────────────── */

const BENEFITS: {
  title: ReactNode;
  text: ReactNode;
  illustration: "own" | "control";
}[] = [
  {
    title: (
      <>
        Настраивайте <br className="hidden lg:inline" />
        собственные интеграции
      </>
    ),
    text: (
      <>
        Используйте готовые интеграции или&nbsp;подключайте свои MCP-серверы.
        Работайте с&nbsp;внешними сервисами через платформу.
      </>
    ),
    illustration: "own",
  },
  {
    title: (
      <>
        Контролируйте <br className="hidden lg:inline" />
        действия агентов
      </>
    ),
    text: (
      <>
        Агент работает только с&nbsp;разрешенными системами и&nbsp;в пределах
        прав вашей учетной записи. Вы определяете доступ, а&nbsp;все действия
        фиксируются в&nbsp;журнале аудита.
      </>
    ),
    illustration: "control",
  },
];

const STEPS: { number: string; title: ReactNode; text: ReactNode }[] = [
  {
    number: "01",
    title: (
      <>
        Выберите <br className="hidden lg:inline" />
        систему
      </>
    ),
    text: (
      <>
        Откройте раздел «Интеграции» или&nbsp;выберите нужный сервис
        в&nbsp;чате. Используйте готовые интеграции или&nbsp;подключайте свой
        MCP-сервер через администратора вашей компании.
      </>
    ),
  },
  {
    number: "02",
    title: (
      <>
        Авторизуйтесь <br className="hidden lg:inline" />в аккаунте
      </>
    ),
    text: (
      <>
        Войдите в&nbsp;корпоративный аккаунт и&nbsp;подтвердите доступ. После
        этого GigaCowork сможет работать с&nbsp;системой в&nbsp;рамках
        назначенных прав.
      </>
    ),
  },
  {
    number: "03",
    title: (
      <>
        Используйте <br className="hidden lg:inline" />в задачах
      </>
    ),
    text: (
      <>
        Опишите логику работы агента или&nbsp;навыка простым языком&nbsp;— ИИ
        подключится к&nbsp;системе и&nbsp;выполнит действия по&nbsp;заданным
        правилам.
      </>
    ),
  },
];

/* ─────────────────────────── мелкие компоненты ─────────────────────────── */

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

/** Иллюстрация «Настраивайте собственные интеграции» (2294:9655). */
function OwnIllustration() {
  const pairs = [
    ["1С", "CRM"],
    ["Почта", "Диск"],
  ];
  return (
    <div
      aria-hidden
      className={`flex w-[300px] flex-col gap-12 overflow-hidden rounded-[18px] border-[1.5px] p-16 ${MOCK_SURFACE} ${MOCK_BORDER} ${MOCK_SHADOW}`}
    >
      <p className="text-caption text-text-primary" {...layer(0, -10, 0)}>
        Интеграции
      </p>
      <div className="flex flex-col gap-8">
        {pairs.map((pair, i) => (
          <div key={i} className="flex gap-8" {...layer(-14, 0, 160 + i * 130)}>
            {pair.map((name) => (
              <span
                key={name}
                className={`flex flex-1 items-center gap-4 rounded-8 p-8 text-caption text-text-primary ${MOCK_CELL} ${MOCK_CELL_SHADOW}`}
              >
                <span
                  className={`size-[16px] rounded-[5px] ${MOCK_ACCENT_16}`}
                />
                {name}
              </span>
            ))}
          </div>
        ))}
        <div
          className={`flex items-center gap-4 rounded-8 p-8 ${MOCK_SOLID}`}
          {...layer(0, 10, 460)}
        >
          <span className="flex size-[16px] items-center justify-center rounded-[5px] bg-neutral-0 text-caption text-[#0dace0]">
            +
          </span>
          <span className="text-caption text-text-inverse">
            Свой MCP-сервер
          </span>
        </div>
      </div>
    </div>
  );
}

/** Иллюстрация «Контролируйте действия агентов» (2294:9655). */
function ControlIllustration() {
  const rows: [string, boolean][] = [
    ["CRM", true],
    ["1С", true],
    ["Почта", false],
  ];
  return (
    <div
      aria-hidden
      className={`flex w-[300px] flex-col gap-12 overflow-hidden rounded-[18px] border-[1.5px] p-16 ${MOCK_SURFACE} ${MOCK_BORDER} ${MOCK_SHADOW}`}
    >
      <p className="text-caption text-text-primary" {...layer(0, -10, 0)}>
        Доступ к системам
      </p>
      <div className="flex flex-col gap-4">
        {rows.map(([name, on], i) => (
          <div
            key={name}
            className={`flex items-center gap-8 rounded-8 p-8 ${MOCK_CELL} ${MOCK_CELL_SHADOW}`}
            {...layer(-14, 0, 170 + i * 120)}
          >
            {/* Переключатель: включённый — акцентный, выключенный — серый. */}
            <span
              className={`flex h-[16px] w-[28px] items-center rounded-full p-[2px] ${
                on ? `justify-end ${MOCK_SOLID}` : "bg-[#d1d9e0]"
              }`}
            >
              <span className="size-[12px] rounded-full bg-neutral-0" />
            </span>
            <span className="text-caption text-text-primary">{name}</span>
          </div>
        ))}
      </div>
      <div
        className={`flex items-center gap-4 rounded-8 p-8 ${MOCK_ACCENT_16}`}
        {...layer(0, 10, 560)}
      >
        <span
          className={`flex h-[14px] items-center justify-center rounded-[4px] px-[3px] text-caption text-text-inverse ${MOCK_SOLID}`}
        >
          ✓
        </span>
        <span className="text-caption text-text-primary">
          CRM · чтение · зафиксировано
        </span>
      </div>
    </div>
  );
}

/* ─────────────────────────────── страница ──────────────────────────────── */

export default function ConnectorsPage() {
  return (
    <>
      <JsonLd data={PAGE_SEO.connectors.jsonLd!} />

      {/* ── Hero (3680:27874 / 3919:32445) ── */}
      <section className="relative isolate flex min-h-[629px] w-full flex-col justify-center overflow-hidden bg-bg-page pt-[152px] pb-[80px] md:min-h-[760px] md:pt-[180px] md:pb-120">
        <Breadcrumbs items={[{ label: "Интеграции" }]} />
        <HeroImage
          desktop="/img/connectors/hero.webp"
          mobile="/img/connectors/hero-mob.webp"
          className="pointer-events-none absolute inset-0 -z-10 size-full object-cover"
        />
        <div className="container-page flex flex-col items-center gap-32 text-center md:items-start md:gap-40 md:text-left">
          <div className="flex flex-col gap-16 md:max-w-[720px] md:gap-24">
            <h1 className="text-h1 font-medium text-text-primary">
              Работайте в&nbsp;привычных системах вместе с&nbsp;ИИ
            </h1>
            <p className="text-body-l text-text-secondary">
              Интегрируйте агентов в&nbsp;бизнес-контекст компании: CRM, 1С,{" "}
              <br className="hidden md:inline" />
              почту и&nbsp;другие корпоративные сервисы
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

      {/* ── Catalog (3856:64808 / 3919:34145) ── */}
      <section className={`w-full py-64 md:py-96 ${CATALOG_GRADIENT}`}>
        {/*
            56 нет в шкале `--spacing-*` (globals.css), поэтому `md:gap-56`
            молча уходил в дефолтную шкалу Tailwind — 14rem, 224px вместо 56.
            Держим значение явно.
          */}
        <div className="container-page flex flex-col gap-32 md:gap-[56px]">
          <div className="flex flex-col gap-12 md:gap-16">
            <Kicker>Интеграции</Kicker>
            <h2 className="text-h3 font-medium text-text-primary md:text-h2">
              40+ готовых интеграций <br className="hidden md:inline" />
              уже на&nbsp;платформе
            </h2>
            <p className="text-body-l text-text-primary">
              Подключайте агентов к&nbsp;привычным корпоративным системам
            </p>
          </div>

          <div className="grid gap-16 md:grid-cols-2 md:gap-24 lg:grid-cols-3">
            {CATEGORIES.map((category, i) => (
              <article
                key={i}
                className={`flex flex-col gap-24 rounded-24 p-32 drop-shadow-[0_12px_24px_#60738f33] ${
                  category.wide
                    ? `lg:col-span-2 ${OWN_CARD_GRADIENT}`
                    : "bg-bg-page"
                }`}
              >
                <h3 className="text-h4 font-medium text-text-primary">
                  {category.title}
                </h3>
                <ul className="flex flex-col gap-12">
                  {category.products.map((product) => {
                    const src = logoSrc(product.slug);
                    return (
                      <li
                        key={product.slug}
                        className="flex items-center gap-16"
                      >
                        {src ? (
                          <Image
                            src={src}
                            alt=""
                            width={32}
                            height={32}
                            className="size-[32px] shrink-0 object-contain"
                          />
                        ) : (
                          <span
                            aria-hidden
                            className="size-[32px] shrink-0 rounded-8 bg-neutral-100"
                          />
                        )}
                        <span className="text-body-l text-text-primary">
                          {product.label}
                        </span>
                      </li>
                    );
                  })}
                </ul>
                {/*
                  ВРЕМЕННО СКРЫТО: в макете под списком стоит ссылка
                  «Подробнее» (Text Link, 3875:70077), но страницы про
                  MCP-серверы в структуре проекта нет, и адрес брать неоткуда.
                  Появится раздел — раскомментировать и подставить href.

                  {category.wide ? (
                    <Link
                      href="#"
                      className="w-fit py-4 text-caption text-text-secondary transition-opacity hover:opacity-70"
                    >
                      Подробнее
                    </Link>
                  ) : null}
                */}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits (3947:34636 / 3919:32501) ── */}
      <section className="w-full bg-bg-page py-64 md:py-120">
        <TokenIllustrations>
          {/*
            Строки сетки: распорка, заголовок, описание. Карточка растягивается
            на все три через `grid-rows-subgrid` — значит строка заголовка у
            обеих карточек одной высоты и строка описания тоже, и заголовки
            стоят на одном уровне независимо от того, что описание слева
            короче на строку. Распорка сверху забирает остаток высоты, поэтому
            текст по-прежнему прижат к низу, как в макете.

            Текст ставим со второй строки явно (`row-start-2`): без этого
            авторазмещение отдало бы ему первую, то есть распорку, и зазор
            вылез бы между заголовком и описанием.

            Высота 391 из макета висит на сетке, а не на карточке: карточка
            занимает три строки, и её собственная высота из них и складывается —
            `h` на ней сетка бы проигнорировала.

            Ниже lg карточки идут в одну колонку, стопки нет — там обычная
            колонка с прижимом к низу.
          */}
          <div className="container-page grid gap-16 lg:grid-cols-2 lg:grid-rows-[1fr_auto_auto] lg:gap-24 lg:h-[391px]">
            {BENEFITS.map((card) => (
              <article
                key={card.illustration}
                data-token-card={card.illustration}
                className={`relative flex flex-col justify-end gap-24 overflow-hidden rounded-24 px-24 pt-32 pb-24 lg:row-span-3 lg:grid lg:grid-rows-subgrid lg:px-40 lg:pt-40 ${BENEFIT_GRADIENT}`}
              >
                <div className="flex flex-col gap-16 lg:row-span-2 lg:row-start-2 lg:grid lg:grid-rows-subgrid lg:gap-y-16 lg:pr-[188px]">
                  <h2 className="text-h3 font-medium text-text-primary">
                    {card.title}
                  </h2>
                  <p className="text-body-l text-text-primary">{card.text}</p>
                </div>
                <div
                  data-token-art
                  className={`absolute hidden lg:block ${
                    card.illustration === "own"
                      ? "top-[19px] right-[-72px]"
                      : "top-[19px] right-[-72px]"
                  }`}
                >
                  {card.illustration === "own" ? (
                    <OwnIllustration />
                  ) : (
                    <ControlIllustration />
                  )}
                </div>
              </article>
            ))}
          </div>
        </TokenIllustrations>
      </section>

      {/* ── How To Add (3855:64787 / 3947:35100) ── */}
      <section className="w-full bg-bg-page py-64 md:py-96">
        <div className="container-page flex flex-col gap-16">
          <Kicker>Настройка интеграции</Kicker>
          <h2 className="text-h3 font-medium text-text-primary md:text-h2">
            Как начать работу
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

      {/* ── CTA (3680:27922 / 3919:32509) ── */}
      <section
        className={`relative isolate w-full overflow-hidden py-64 md:py-160 ${CTA_FALLBACK}`}
      >
        <CtaBackground variant="slab" />
        <div className="container-page flex flex-col items-center gap-40">
          <h2 className="max-w-[522px] text-center text-h3 font-medium text-text-primary md:text-h2">
            Готовы делегировать работу
            <br className="hidden md:block" /> ИИ-агентам?
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
