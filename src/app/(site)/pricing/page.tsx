import type { CSSProperties } from "react";

import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import ComparisonTable, {
  type ComparisonColumn,
  type ComparisonGroup,
} from "@/components/interactive/ComparisonTable";
import FaqAccordion, {
  type FaqItem,
} from "@/components/interactive/FaqAccordion";
import Button from "@/components/ui/Button";
import { CTA_FALLBACK, CtaBackground } from "@/components/ui/CtaBackground";
import { HeroImage } from "@/components/ui/HeroImage";
import { Image } from "@/components/ui/Image";
import { Kicker } from "@/components/ui/Kicker";
import { JsonLd } from "@/components/seo/JsonLd";
import { PAGE_SEO } from "@/content/seo";
import { seoMetadata } from "@/lib/site";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

/**
 * «Поставки» — /pricing
 *
 * Макеты: desktop 3956:35191 (Supplies / Desktop 1440), mobile 4158:77673.
 * Состояния мобильных вкладок таблицы: 4175:21328 (Гибрид), 4175:21439 (ПАК).
 * Секции сверху вниз:
 *   Hero        3956:35192 / 4158:77674
 *   Cards       4042:45964 / 4158:77683
 *   Comparison  3956:35218 / 4158:77703 — таблица, ниже lg переключатель
 *   CTA         3956:35262 / 4158:77734
 *   FAQ         4127:77428 / 4158:77726
 * Шапка и подвал — общие из src/app/(site)/layout.tsx.
 *
 * Порядок секций взят из десктопного макета: CTA стоит перед «Частыми
 * вопросами», а не в конце страницы, — на мобильном так же.
 */

export const metadata: Metadata = seoMetadata(PAGE_SEO.pricing);

/* ──────────────────────────── градиенты из макета ──────────────────────── */

/*
  Фон секции с карточками (4042:45964). В макете три слоя: градиент, растровая
  текстура поверх на 80% и мятная подсветка, уходящая в прозрачность. Текстуры
  у нас нет — остальные два слоя стоят как в макете, они и дают основной тон.
*/
const CARDS_GRADIENT =
  "bg-[linear-gradient(68.5deg,#b3f4e4_0%,#ffffff00_100%),linear-gradient(212.5deg,#d4e2ff_0%,#b3ebf6_100%)]";
/** Карточка поставки (4087:48886) — общая для всех трёх. */
const CARD_GRADIENT = "bg-[linear-gradient(242.3deg,#edf6ff_0%,#d4eeef_100%)]";
/*
  Заливки шапок колонок (4110:23589 / 23593 / 23597). Углы пересчитаны из
  матриц Figma под пропорции самой ячейки (282×112): у Figma градиент задан
  в координатах объекта, у CSS — углом, и при другом соотношении сторон тот же
  угол дал бы другую картинку.
*/
const COLUMN_GRADIENTS = [
  "bg-[linear-gradient(197.2deg,#edf6ff_0%,#d4eeef_100%)]",
  "bg-[linear-gradient(33.6deg,#c5f8e5_0%,#dcf9ff_50.45%,#e4f5ff_100%)]",
  "bg-[linear-gradient(199.4deg,#d4e2ff_0%,#b3ebf6_73.84%,#b3f6e1_97.12%)]",
] as const;

/* ──────────────────────────────── данные ───────────────────────────────── */

type SupplyTag = { label: string; icon: string };
type SupplyBenefit = { title: string; text: string };

type Supply = {
  id: string;
  title: string;
  /**
   * Подзаголовок под названием — в макете до двух абзацев, с переносами
   * строк из макета. Переносы здесь не украшение: кадр поставки висит поверх
   * правого верхнего угла карточки, и без них строки уходили бы под него.
   */
  lead: ReactNode;
  tags: SupplyTag[];
  /**
   * Кадр поставки (4071:15194).
   *
   * `width`/`height` — реальные размеры файла: из них берётся пропорция.
   * `box` — ширина кадра на десктопе; высота считается сама, поэтому у файла
   * с другой пропорцией (у «ПАК» снизу шире прозрачная рамка) рисунок не
   * сплющивается.
   *
   * Верхний край у всех трёх один и тот же — так в макете: рамки стоят на
   * 140 / −68 от угла карточки, и отличаются только шириной. Раньше `top`
   * подбирался каждой карточке свой, чтобы совпали нижние края рисунков; из-за
   * этого кадры уезжали вверх и заходили на hero, а верхние края расходились.
   */
  illustration: {
    src: string;
    width: number;
    height: number;
    box: number;
    top: number;
  };
  benefits: SupplyBenefit[];
};

/**
 * Карточки поставок (4087:48886 / 48939 / 48991).
 *
 * Две правки против макета, согласованы: заголовок «Пак» приведён к «ПАК»
 * (в таблице и подвале везде верхний регистр) и снят четвёртый пункт
 * карточки «Облако» — он дословно повторял третий.
 */
const SUPPLIES: Supply[] = [
  {
    id: "cloud",
    title: "Облако",
    lead: (
      <p>
        Данные и&nbsp;модель <br />
        (LLM) в&nbsp;облаке
      </p>
    ),
    tags: [
      { label: "до 200 пользователей", icon: "/img/pricing/tags/xs.svg" },
      { label: "до 400 пользователей", icon: "/img/pricing/tags/s.svg" },
    ],
    illustration: {
      src: "/img/pricing/cloud.webp",
      width: 504,
      height: 400,
      box: 252,
      top: -68,
    },
    benefits: [
      {
        title: "Подключение сотрудников",
        text: "Ваша команда получит доступ к платформе сразу после подписания договора.",
      },
      {
        title: "Защищённая инфраструктура",
        text: "Шифрование, контроль доступа, ЦОД на территории РФ",
      },
      {
        title: "Безлимитное количество токенов",
        text: "Тарификация по пользователям",
      },
    ],
  },
  {
    id: "hybrid",
    title: "Гибрид",
    lead: (
      <>
        <p>
          Данные в&nbsp;периметре компании, <br />
          модель (LLM) в&nbsp;облаке
        </p>
        <p>
          Для баланса гибкости и&nbsp;контроля <br />
          без собственного железа.
        </p>
      </>
    ),
    tags: [
      { label: "до 1 250 пользователей", icon: "/img/pricing/tags/m.svg" },
      { label: "до 2 500 пользователей", icon: "/img/pricing/tags/l.svg" },
    ],
    illustration: {
      src: "/img/pricing/hybrid.webp",
      width: 477,
      height: 400,
      box: 238,
      top: -68,
    },
    benefits: [
      {
        title: "Данные остаются в вашем контуре",
        text: "Чувствительная информация хранится на ваших серверах — в облако передаются только запросы.",
      },
      {
        title: "Без затрат на собственную инфраструктуру",
        text: "Используйте мощности облачной модели без закупки GPU-серверов.",
      },
      {
        title: "Безлимитные токены и доступ к API",
        text: "Использование платформы без ограничений по токенам. API-токены для интеграций — по запросу.",
      },
      {
        title: "Помощь с внедрением и обучением",
        text: "100 часов консалтинга по настройке процессов и корпоративное обучение.",
      },
    ],
  },
  {
    id: "pak",
    title: "ПАК",
    lead: (
      <>
        <p>
          Решение работает на&nbsp;серверах внутри <br />
          вашего контура.
        </p>
        <p>
          Для компаний с&nbsp;жесткими требованиями <br />
          к&nbsp;размещению данных.
        </p>
      </>
    ),
    tags: [
      {
        label: "Безлимитные пользователи и токены, API — по запросу",
        icon: "/img/pricing/tags/infinity.svg",
      },
      {
        label: "Доставка и пусконаладка под ключ",
        icon: "/img/pricing/tags/delivery.svg",
      },
    ],
    illustration: {
      src: "/img/pricing/pak.webp",
      width: 443,
      height: 421,
      box: 221,
      top: -68,
    },
    benefits: [
      {
        title: "Сервер с 8 GPU H200",
        text: "Базовая или кастомная конфигурация.",
      },
      { title: "ОС в составе ПАК", text: "Поставляется вместе с сервером." },
      {
        title: "Внедрение и обучение",
        text: "200 часов консалтинга и корпоративное обучение.",
      },
      {
        title: "12 месяцев поддержки",
        text: "Помощь при запуске и в течение первого года.",
      },
    ],
  },
];

/** Шапки колонок таблицы (4110:23586). */
const COLUMNS: [ComparisonColumn, ComparisonColumn, ComparisonColumn] = [
  {
    title: "Облако",
    image: "/img/pricing/cloud.webp",
    gradient: COLUMN_GRADIENTS[0],
  },
  {
    title: "Гибрид",
    image: "/img/pricing/hybrid.webp",
    gradient: COLUMN_GRADIENTS[1],
  },
  {
    title: "ПАК",
    image: "/img/pricing/pak.webp",
    gradient: COLUMN_GRADIENTS[2],
  },
];

/** Группы и строки таблицы (4111:23584, 4113:23591, 4115:23594, 4118:23595). */
const COMPARISON: ComparisonGroup[] = [
  {
    title: "Инфраструктура",
    icon: "/img/icons/supplier.svg",
    rows: [
      {
        label: "Размещение данных",
        values: ["Облако (ЦОД РФ)", "На ваших серверах", "Ваш контур"],
      },
      {
        label: "Размещение модели",
        values: ["Облако", "Облако", "Ваш контур"],
      },
      {
        label: "Доступ к интернету",
        values: ["Требуется", "Требуется", "Не требуется"],
      },
      {
        label: "Собственные серверы",
        values: ["—", "Требуются", "Поставляется ПАК"],
      },
    ],
  },
  {
    title: "Безопасность",
    icon: "/img/icons/shield-check.svg",
    rows: [
      {
        label: "Изоляция данных",
        values: [
          "Шифрование, контроль доступа",
          "Данные в вашем контуре",
          "Полная изоляция сети",
        ],
      },
      {
        label: "Шифрование канала",
        values: ["TLS", "mTLS / IPsec VPN", "Внутренний контур"],
      },
      {
        label: "Данные для обучения",
        values: ["Не используются", "Не используются", "Не используются"],
      },
      {
        label: "Управление логами",
        values: [
          "Администратор клиента",
          "Администратор клиента",
          "Полный контроль",
        ],
      },
    ],
  },
  {
    title: "Масштаб и тарификация",
    icon: "/img/icons/table.svg",
    rows: [
      { label: "Пользователи", values: ["До 400", "До 2 500", "Безлимит"] },
      { label: "Токены", values: ["Безлимит", "Безлимит", "Безлимит"] },
      {
        label: "Тарификация",
        values: ["По пользователям", "По пользователям", "Единовременно"],
      },
    ],
  },
  {
    title: "Внедрение",
    icon: "/img/icons/cpu.svg",
    rows: [
      { label: "Скорость старта", values: ["Быстро", "Среднее", "Дольше"] },
      { label: "Консультации", values: ["—", "100 часов", "До 200 часов"] },
      {
        label: "Поддержка",
        values: ["Email, включено", "Email, включено", "12 месяцев"],
      },
      {
        label: "Лицензии на ПО",
        values: ["Подписка", "Подписка", "Бессрочные"],
      },
    ],
  },
];

/**
 * «Частые вопросы» (4135:23607).
 *
 * Тексты пришли от заказчика и заменяют набор из макета: там было семь
 * вопросов, из них раскрыт один, остальные без ответов. Здесь четыре вопроса,
 * каждый с ответом.
 */
const FAQ: FaqItem[] = [
  {
    question: "Чем отличаются Облако, Гибрид и ПАК?",
    answer: (
      <>
        <p>
          <b className="font-medium text-text-primary">Облако.</b> Данные
          и&nbsp;модель в&nbsp;облаке.
        </p>
        <p>
          <b className="font-medium text-text-primary">Гибрид.</b> Платформа
          интегрируется в&nbsp;контур компании, модель&nbsp;– в&nbsp;облаке.
        </p>
        <p>
          <b className="font-medium text-text-primary">ПАК.</b> Решение работает
          на&nbsp;серверах внутри контура компании.
        </p>
      </>
    ),
  },
  {
    question: "Можно ли начать с Облака, а затем перейти на Гибрид или ПАК?",
    answer: (
      <p>
        Да. Условия и&nbsp;сроки обсуждаются с&nbsp;менеджером индивидуально.
      </p>
    ),
  },
  {
    question: "Как тарифицируются токены?",
    answer: (
      <p>
        Токены не&nbsp;тарифицируются отдельно. Во&nbsp;всех поставках
        безлимитное количество токенов&nbsp;– тарификация по&nbsp;пользователям.
        Для&nbsp;поставки ПАК доступно неограниченное количество пользователей.
      </p>
    ),
  },
  {
    question: "Какие требования к инфраструктуре для ПАК?",
    answer: (
      <>
        <FaqSpec
          title="Размещение оборудования"
          items={[
            '8U Rackmount в 19" стойке, глубина ≥1200 мм, полный доступ спереди и сзади',
            "Холодный коридор: ≥1200 мм, горячий коридор: ≥1000 мм",
            "Температура на входе 18–22 °C, направление airflow front-to-back",
            "Отсутствие горячего потока воздуха над и под устройствами",
          ]}
        />
        <FaqSpec
          title="Электропитание"
          items={[
            "Разъемы: C19-C20 (IEC 60320)",
            "Мощность: 15 кВт",
            "Обязательно: 2 независимых ввода",
          ]}
        />
        <FaqSpec
          title="Типы соединений к сети передачи данных"
          items={[
            "Сеть: 2×100 GbE QSFP56, 2×10 GbE RJ45 (Cat6a), 1×1 GbE IPMI",
          ]}
        />
        <FaqSpec
          title="Габариты"
          items={["Вес: 115 кг", "Габариты по коробке: 120×80×60 + паллета"]}
        />
      </>
    ),
  },
];

/* ─────────────────────────── мелкие компоненты ─────────────────────────── */

/** Блок «подзаголовок + список» внутри ответа FAQ. */
function FaqSpec({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="flex flex-col gap-8">
      <p className="font-medium text-text-primary">{title}</p>
      <ul className="flex flex-col gap-4">
        {items.map((item) => (
          <li key={item} className="flex gap-8">
            <span aria-hidden className="shrink-0">
              •
            </span>
            <span className="flex-1">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─────────────────────────────── страница ──────────────────────────────── */

export default function PricingPage() {
  return (
    <>
      <JsonLd data={PAGE_SEO.pricing.jsonLd!} />

      {/*
        ── Hero (3956:35192 / 4158:77674) ──

        Фон — растр на всю секцию: 2880×1520 (2× фрейма 1440×760) и 780×1176
        (2× фрейма 390×588).
      */}
      <section className="relative isolate flex min-h-[588px] w-full flex-col justify-center overflow-hidden bg-bg-page pt-[152px] pb-[80px] md:min-h-[760px] md:pt-[180px] md:pb-120">
        <Breadcrumbs items={[{ label: "Поставки" }]} />
        <HeroImage
          desktop="/img/pricing/hero.webp"
          mobile="/img/pricing/hero-mob.webp"
          className="pointer-events-none absolute inset-0 -z-10 size-full object-cover"
        />
        <div className="container-page flex flex-col items-center gap-32 text-center md:items-start md:gap-40 md:text-left">
          <div className="flex flex-col gap-16 md:gap-24">
            <h1 className="text-h2 font-medium text-text-primary md:text-h1">
              GigaCowork разворачивается там,{" "}
              <br className="hidden md:inline" />
              где удобно вам
            </h1>
            <p className="text-body-l text-text-secondary">
              Выбирайте поставку в&nbsp;зависимости от&nbsp;требований
              к&nbsp;инфраструктуре и&nbsp;безопасности&nbsp;–{" "}
              <br className="hidden md:inline" />
              облако, гибридный формат или&nbsp;решение внутри вашего контура.
            </p>
          </div>
          <Button
            href="/lead"
            variant="primary"
            size="lg"
            className="w-[230px] text-body-m! md:w-auto"
          >
            Оставить заявку
          </Button>
        </div>
      </section>

      {/* ── Cards (4042:45964 / 4158:77683) ── */}
      {/*
        `overflow-x-clip`, а не `overflow-hidden`: кадры поставок выступают
        и вправо, и вверх. Вправо на узком экране они вылезали за край окна и
        страница начинала прокручиваться горизонтально; вверх — так задумано,
        и это должно остаться видимым. `clip` по одной оси как раз оставляет
        вторую нетронутой, `hidden` обрезал бы обе.
      */}
      <section
        className={`w-full overflow-x-clip py-64 md:py-120 ${CARDS_GRADIENT}`}
      >
        {/*
          Строки сетки: шапка, теги, остальное. Карточка растягивается на все
          три через `grid-rows-subgrid`, поэтому шапка у всех трёх карточек
          одной высоты и теги встают на один уровень, даже если подзаголовок
          у «Облака» короче на две строки. Отбивки между строками заданы
          отступами внутри карточки, а не зазором сетки: по макету они разные,
          24 и 32.
        */}
        <div className="container-page grid gap-16 lg:grid-cols-3 lg:grid-rows-[auto_auto_1fr] lg:gap-x-24 lg:gap-y-0">
          {SUPPLIES.map((supply) => (
            <article
              key={supply.id}
              id={supply.id}
              className={`relative flex scroll-mt-[120px] flex-col gap-32 rounded-24 border border-bg-page p-24 md:p-40 lg:row-span-3 lg:grid lg:grid-rows-subgrid lg:gap-0 ${CARD_GRADIENT}`}
            >
              {/*
                Шапка карточки. Ниже lg это обычный блок, а не колонка флексов:
                кадр обтекается текстом (`float`), поэтому заголовок и первые
                строки идут слева от него, а дальше текст занимает всю ширину.
                Отступом справа так не сделать — у «Гибрида» и «ПАК» лид
                длинный, и он сжимался в узкую колонку с дырой под кадром.
              */}
              {/*
                48 между названием и лидом — из макета (Header 4071:15190:
                заголовок 0…30, лид с 78). Отбивка большая не для красоты: лид
                начинается ровно там, где кончается кадр поставки, и без неё
                первые строки «Гибрида» и «ПАК» уходили под рисунок.
              */}
              <div className="lg:flex lg:flex-col lg:gap-48">
                {/*
                  Кадр поставки. От lg он выходит из потока и висит над верхним
                  краем карточки — так в макете (4071:15194 — absolute,
                  140/-68), и `top` берётся из данных. Ниже lg тот же вынос
                  вверх клал кадр на предыдущую карточку, поэтому там он
                  обтекаемый и сидит в правом верхнем углу своей карточки.
                */}
                <Image
                  src={supply.illustration.src}
                  alt=""
                  width={supply.illustration.width}
                  height={supply.illustration.height}
                  aria-hidden
                  style={
                    {
                      "--ill-top": `${supply.illustration.top}px`,
                      "--ill-box": `${supply.illustration.box}px`,
                    } as CSSProperties
                  }
                  className="pointer-events-none float-right -mr-8 ml-12 h-[150px] w-auto object-contain lg:absolute lg:top-[var(--ill-top)] lg:left-[140px] lg:float-none lg:mr-0 lg:ml-0 lg:h-auto lg:w-[var(--ill-box)]"
                />
                <h2 className="text-h3 font-medium text-text-primary">
                  {supply.title}
                </h2>
                {/*
                  Не флекс, а обычный поток: флекс-контейнер float не обтекает —
                  его целиком отодвигает в сторону, и лид ужимался в узкую
                  колонку по всей высоте. В потоке у абзацев укорачиваются
                  только строки рядом с кадром, ниже они идут во всю ширину.
                */}
                <div className="mt-8 space-y-12 text-body-m text-text-secondary lg:mt-0">
                  {supply.lead}
                </div>
              </div>

              {/* Tag (1383:8542) — кружок-бейдж с подписью на белой подложке */}
              <ul className="mt-24 flex flex-col gap-12">
                {supply.tags.map((tag) => (
                  <li
                    key={tag.label}
                    className="flex items-center gap-8 rounded-full bg-bg-tag py-8 pr-16 pl-8"
                  >
                    <Image
                      src={tag.icon}
                      alt=""
                      width={24}
                      height={24}
                      className="size-[24px] shrink-0"
                    />
                    <span className="text-caption text-text-primary">
                      {tag.label}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-32 flex flex-col gap-32">
                {/* Benefit list (4071:15197) — точка 8 в боксе 24 + описание */}
                <ul className="flex flex-col gap-16">
                  {supply.benefits.map((benefit) => (
                    <li key={benefit.title} className="flex flex-col gap-8">
                      <div className="flex items-start gap-8">
                        <span
                          aria-hidden
                          className="flex size-[24px] shrink-0 items-center justify-center"
                        >
                          <span className="size-[8px] rounded-full bg-icon-primary" />
                        </span>
                        <span className="flex-1 text-body-m font-medium text-text-primary">
                          {benefit.title}
                        </span>
                      </div>
                      <p className="pl-32 text-caption text-text-secondary">
                        {benefit.text}
                      </p>
                    </li>
                  ))}
                </ul>

                {/* Ссылка прижата к низу карточки (4071:15207 — y=878 при 940). */}
                <Link
                  href="/lead"
                  className="mt-auto w-fit py-4 text-caption text-text-secondary transition-opacity hover:opacity-70"
                >
                  Подробнее
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Comparison (3956:35218 / 4158:77703) ── */}
      <section
        id="compare"
        className="w-full scroll-mt-[100px] bg-bg-page py-64 md:py-80"
      >
        <div className="container-page flex flex-col gap-32">
          <div className="flex max-w-[760px] flex-col gap-16">
            <Kicker>Варианты поставок</Kicker>
            <h2 className="text-h3 font-medium text-text-primary md:text-h2">
              Сравните варианты поставки
            </h2>
            <p className="text-body-l text-text-secondary">
              Выберите модель размещения GigaCowork под&nbsp;требования вашей
              инфраструктуры, безопасности и&nbsp;масштаба.
            </p>
          </div>
          <ComparisonTable columns={COLUMNS} groups={COMPARISON} />
        </div>
      </section>

      {/* ── CTA (3956:35262 / 4158:77734) ── */}
      <section
        className={`relative isolate w-full overflow-hidden py-64 md:py-160 ${CTA_FALLBACK}`}
      >
        <CtaBackground />
        <div className="container-page flex flex-col items-center gap-40">
          <h2 className="max-w-[522px] text-center text-h3 font-medium text-text-primary md:text-h2">
            Готовы делегировать <br className="hidden md:block" />
            работу ИИ-агентам?
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

      {/* ── FAQ (4127:77428 / 4158:77726) ── */}
      <section className="w-full bg-bg-page py-64 md:py-80">
        {/*
          Блок целиком по центру колонки — кикер, заголовок и аккордеон
          (4127:77428: у секции выравнивание CENTER, заголовок с центровкой
          текста, лента вопросов шириной 992 посередине).
        */}
        <div className="container-page flex flex-col items-center gap-32">
          <div className="flex flex-col items-center gap-16">
            <Kicker>Вопросы и ответы</Kicker>
            <h2 className="text-center text-h3 font-medium text-text-primary md:text-h1">
              Частые вопросы
            </h2>
          </div>
          <div className="w-full lg:max-w-[992px]">
            <FaqAccordion items={FAQ} />
          </div>
        </div>
      </section>
    </>
  );
}
