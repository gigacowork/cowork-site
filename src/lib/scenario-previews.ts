/**
 * Содержимое превью в блоке «Какие задачи ИИ-агенты решают прямо сейчас»
 * (`ScenarioStack`, Figma 2616:11235 + доп. карточки 2787:16163).
 *
 * Зачем отдельный файл. В `use-cases.ts` лежит текст страницы — то, что человек
 * читает слева от карточки. Здесь — то, что нарисовано внутри карточки: кроп
 * интерфейса GigaCowork с синтетическими данными. Разные вещи и разный цикл
 * согласования: тексты страницы идут от маркетинга, начинка скриншотов — от
 * продукта. Поэтому и файлы разные, связка — по slug роли и порядку сценария.
 *
 * Композиция кадра повторяет секцию «Инструменты автоматизации бизнес-процессов»
 * на /ai-platform (`FeatureStack`, ассеты `public/img/platform/agent-*.svg`):
 * градиент виден полосой слева и сверху, приглушённая подложка интерфейса
 * уходит за правый и нижний край, поверх — ровно один контрастный блок с
 * данными. Подробности и чек-лист приёмки — в `SCREENSHOTS-ceo.md`.
 *
 * ВАЖНО: все компании, ФИО, суммы и номера документов ниже — вымышленные.
 * Легенда сквозная: холдинг ГК «Ориент», машиностроение, дата в интерфейсе —
 * 19 августа 2026.
 *
 * Пока превью рисуется картинкой (`asset`), эта структура работает как ТЗ
 * дизайнеру. Когда превью будем собирать в коде — она же становится данными
 * компонента, и текст перестаёт быть запечённым в PNG (плюс к поиску и
 * доступности).
 */

/** Смысловая окраска чипа или строки; конкретные цвета — на стороне вёрстки. */
export type PreviewTone =
  | "neutral"
  | "muted"
  | "info" // R — исполняет
  | "accent" // A — утверждает
  | "warning" // риск, «проверить»
  | "danger" // просрочка, «требует изменения»
  | "success"; // норма соответствует, задача в работе

/** Ячейка таблицы: голый текст либо чип с окраской. */
export type PreviewCell = string | { label: string; tone: PreviewTone };

export type PreviewTable = {
  columns: string[];
  rows: PreviewCell[][];
  /** Индексы строк с янтарной подсветкой — конфликт или просрочка. */
  highlightRows?: number[];
  /** Подпись под таблицей мелким кеглем. */
  legend?: string;
};

export type PreviewStat = {
  value: string;
  caption: string;
  tone?: PreviewTone;
};

/** Строка списка «пункт — предмет — статус». */
export type PreviewListItem = {
  term: string;
  text: string;
  status?: { label: string; tone: PreviewTone };
};

/** Блок «было / стало» с зачёркиванием и подсветкой правки. */
export type PreviewDiff = {
  beforeLabel: string;
  /** `~~…~~` — фрагмент под зачёркивание. */
  before: string;
  afterLabel: string;
  /** `**…**` — фрагмент под подсветку. */
  after: string;
  note?: string;
};

/** Плашка-акцент: то, ради чего сделан кадр. */
export type PreviewCallout = {
  title: string;
  lines: string[];
  link?: string;
  tone: PreviewTone;
};

/** Всплывающая карточка с готовым текстом и кнопками. */
export type PreviewCard = {
  title: string;
  subtitle?: string;
  body: string;
  primaryAction: string;
  secondaryAction?: string;
};

export type ScenarioPreview = {
  /** Экспорт из Figma; пусто — рисуем градиент-заглушку, как сейчас. */
  asset?: string;
  /** alt для картинки и подпись для скринридера, если превью соберём в коде. */
  alt: string;
  /**
   * Приглушённый нижний слой: хлебная крошка и обрезанные строки интерфейса.
   * Читается как фактура, не как текст, — контраст ≈60 %.
   *
   * Необязателен: у ролей, где кадр уже нарисован и приехал картинкой, описывать
   * его слои не нужно — достаточно `asset` и `alt`. Описание нужно там, где
   * кадра ещё нет и файл работает как ТЗ, либо когда превью будем собирать в
   * коде.
   */
  backdrop?: {
    breadcrumb: string;
    lines: string[];
  };
  /** Контрастный слой. Ровно один на кадр — иначе кадр рассыпается. */
  focus?: {
    title: string;
    subtitle?: string;
    stats?: PreviewStat[];
    table?: PreviewTable;
    list?: PreviewListItem[];
    diff?: PreviewDiff;
    callout?: PreviewCallout;
    card?: PreviewCard;
  };
};

/**
 * Превью роли «Управленческие решения» (/use_cases/ceo).
 * Порядок совпадает с `USE_CASES[slug: "ceo"].scenarios`.
 *
 * Кадры собраны из папки «Сценарии Роли / Управленческие решения» и приехали
 * экспортом, поэтому здесь только файл и alt — расписывать слои незачем.
 * В исходниках вокруг карточки была запечена мягкая тень; она снята кропом до
 * самой карточки (1176×800, как у бухгалтерии), потому что тень вешает сам
 * `ScenarioStack` фильтром — иначе на странице их было бы две.
 *
 * Данные в кадрах — вымышленные. Легенда сквозная: холдинг ГК «Ориент»,
 * машиностроение, дата в интерфейсе — 19 августа 2026.
 */
const CEO: ScenarioPreview[] = [
  {
    asset: "/img/use-cases/ceo-market.webp",
    alt: "Интерфейс GigaCowork: доля рынка ГК «Ориент» за\u00A0январь\u00A0— июль 2026, разложение отклонения объёма на\u00A0влияние рынка и\u00A0потерю доли",
  },
  {
    asset: "/img/use-cases/ceo-strategy.webp",
    alt: "Интерфейс GigaCowork: разбор стратегии развития до\u00A02030 года\u00A0— претензии с\u00A0позиции конкурента и\u00A0то, чем они опровергаются",
  },
  {
    asset: "/img/use-cases/ceo-raci.webp",
    alt: "Интерфейс GigaCowork: матрица ответственности RACI по\u00A011\u00A0управленческим процессам с\u00A0найденными пересечениями зон",
  },
];

/**
 * Превью роли «Бухгалтерия» (/use_cases/accounting).
 *
 * Кадры уже нарисованы и приехали экспортом из Figma, поэтому здесь только
 * файл и alt — расписывать слои незачем. Порядок совпадает с
 * `USE_CASES[slug: "accounting"].scenarios`.
 *
 * Экспорт — цельная карточка: градиентная рамка и скругления запечены в
 * картинку, углы вырезаны прозрачностью. Поэтому подложка и обводка от
 * заглушки к ним не применяются, а тень вешается фильтром — он идёт по контуру
 * альфа-канала и повторяет скругление на любой ширине.
 */
const ACCOUNTING: ScenarioPreview[] = [
  {
    asset: "/img/use-cases/accounting-1c.webp",
    alt: "Интерфейс GigaCowork: обработка входящих УПД и\u00A0пакет документов, готовый к\u00A0загрузке в\u00A01С",
  },
  {
    asset: "/img/use-cases/accounting-mismatch.webp",
    alt: "Интерфейс GigaCowork: сводка проверки цепочки заказов с\u00A0найденными расхождениями по\u00A0поставщикам",
  },
  {
    asset: "/img/use-cases/accounting-contracts.webp",
    alt: "Интерфейс GigaCowork: разбор договора с\u00A0выделенными условиями и\u00A0рисками",
  },
];

/**
 * Превью роли «Финансы» (/use_cases/finance).
 * Порядок совпадает с `USE_CASES[slug: "finance"].scenarios`.
 */
const FINANCE: ScenarioPreview[] = [
  {
    asset: "/img/use-cases/finance-investment.webp",
    alt: "Интерфейс GigaCowork: комплект документации по\u00A0инвестиционному проекту, собранный агентом",
  },
  {
    asset: "/img/use-cases/finance-reconciliation.webp",
    alt: "Интерфейс GigaCowork: сверка расчётов с\u00A0найденными расхождениями",
  },
  {
    asset: "/img/use-cases/finance-budget.webp",
    alt: "Интерфейс GigaCowork: разбор отклонений бюджета\u00A0— план, факт и\u00A0причины расхождений",
  },
];

/**
 * Превью роли «Продажи» (/use_cases/salesforce).
 * Порядок совпадает с `USE_CASES[slug: "salesforce"].scenarios`.
 */
const SALESFORCE: ScenarioPreview[] = [
  {
    asset: "/img/use-cases/salesforce-offers.webp",
    alt: "Интерфейс GigaCowork: коммерческое предложение, собранное агентом под\u00A0запрос клиента",
  },
  {
    asset: "/img/use-cases/salesforce-reports.webp",
    alt: "Интерфейс GigaCowork: отчёт по\u00A0выполнению плана продаж за\u00A0месяц",
  },
  {
    asset: "/img/use-cases/salesforce-feedback.webp",
    alt: "Интерфейс GigaCowork: разбор обратной связи клиентов с\u00A0выделенными темами",
  },
];

/**
 * Превью роли «Закупки» (/use_cases/procurement).
 * Порядок совпадает с `USE_CASES[slug: "procurement"].scenarios`.
 */
const PROCUREMENT: ScenarioPreview[] = [
  {
    asset: "/img/use-cases/procurement-compare.webp",
    alt: "Интерфейс GigaCowork: сравнение предложений поставщиков по\u00A0цене, срокам и\u00A0условиям",
  },
  {
    asset: "/img/use-cases/procurement-stock.webp",
    alt: "Интерфейс GigaCowork: расчёт нормирования запасов ТМЦ\u00A0— излишки, риск дефицита и\u00A0замороженные средства",
  },
  {
    asset: "/img/use-cases/procurement-search.webp",
    alt: "Интерфейс GigaCowork: подбор поставщиков и\u00A0аналогов МТР по\u00A0техническим требованиям",
  },
];

/**
 * Превью роли «Юристы» (/use_cases/legal-team).
 * Порядок совпадает с `USE_CASES[slug: "legal-team"].scenarios`.
 */
const LEGAL_TEAM: ScenarioPreview[] = [
  {
    asset: "/img/use-cases/legal-draft.webp",
    alt: "Интерфейс GigaCowork: проект договора, подготовленный агентом по\u00A0шаблону компании",
  },
  {
    asset: "/img/use-cases/legal-claim.webp",
    alt: "Интерфейс GigaCowork: расчёт задолженности и\u00A0неустойки с\u00A0проверкой сроков исковой давности и\u00A0готовым черновиком претензии",
  },
  {
    asset: "/img/use-cases/legal-review.webp",
    alt: "Интерфейс GigaCowork: разбор договора контрагента с\u00A0выделенными условиями и\u00A0рисками",
  },
];

/**
 * Превью роли «HR и кадры» (/use_cases/hr-team).
 * Порядок совпадает с `USE_CASES[slug: "hr-team"].scenarios`.
 */
const HR_TEAM: ScenarioPreview[] = [
  {
    asset: "/img/use-cases/hr-transcripts.webp",
    alt: "Интерфейс GigaCowork: разбор расшифровки интервью\u00A0— ключевые тезисы, соответствие компетенциям и\u00A0риски",
  },
  {
    asset: "/img/use-cases/hr-screening.webp",
    alt: "Интерфейс GigaCowork: рейтинг кандидатов по\u00A0соответствию требованиям вакансии",
  },
  {
    asset: "/img/use-cases/hr-analytics.webp",
    alt: "Интерфейс GigaCowork: дашборд по\u00A0персоналу\u00A0— текучесть по\u00A0подразделениям и\u00A0конверсия воронки подбора",
  },
];

/**
 * Превью роли «ИТ-поддержка» (/use_cases/it-support).
 * Порядок совпадает с `USE_CASES[slug: "it-support"].scenarios`.
 */
const IT_SUPPORT: ScenarioPreview[] = [
  {
    asset: "/img/use-cases/it-incidents.webp",
    alt: "Интерфейс GigaCowork: разбор инцидента по\u00A0логам приложения с\u00A0найденной причиной",
  },
  {
    asset: "/img/use-cases/it-first-line.webp",
    alt: "Интерфейс GigaCowork: ответ агента первой линии на\u00A0обращение сотрудника",
  },
  {
    asset: "/img/use-cases/it-service-desk.webp",
    alt: "Интерфейс GigaCowork: обращение в\u00A0сервис-деске с\u00A0историей и\u00A0результатами анализа",
  },
];

/**
 * Ключ — slug роли из `USE_CASES`. Роли без превью просто отсутствуют:
 * `ScenarioStack` в этом случае рисует градиент-заглушку, как сейчас.
 */
export const SCENARIO_PREVIEWS: Record<string, ScenarioPreview[]> = {
  ceo: CEO,
  finance: FINANCE,
  salesforce: SALESFORCE,
  procurement: PROCUREMENT,
  "legal-team": LEGAL_TEAM,
  "hr-team": HR_TEAM,
  accounting: ACCOUNTING,
  "it-support": IT_SUPPORT,
};

/** Превью конкретного сценария; `undefined` — заглушка. */
export function getScenarioPreview(
  slug: string,
  index: number,
): ScenarioPreview | undefined {
  return SCENARIO_PREVIEWS[slug]?.[index];
}
