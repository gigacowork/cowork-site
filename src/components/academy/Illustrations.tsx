import { Icon } from "@/components/ui/Icon";

/**
 * Интерфейсные иллюстрации «Академии» (/ai-academy).
 *
 * В макете это не картинки, а нарисованные в Figma кусочки интерфейса —
 * стеклянная панель с заголовком и списком строк (5265:82951 «Card / Process»,
 * 5321:15442 «Card / Feature/Compact Top», 5314:90209 «Illustration» в блоке
 * «Курсы»). Поэтому они и здесь собраны разметкой, а не выгружены в webp:
 * текст остаётся текстом, панель тянется под ширину карточки и не мылится на
 * ретине.
 *
 * ── Про em ────────────────────────────────────────────────────────────────
 * Одна и та же панель встречается в макете в двух масштабах: 12 px в
 * карточках форматов и в «Курсах» и 15.6 px (ровно ×1.3) в карточках
 * сценариев. Поэтому ВСЕ размеры внутри панели заданы в em и считаются от её
 * кегля: отступ 16 → 1.3333em, скругление 16 → 1.3333em, маркер 16 →
 * 1.3333em, рамка 1.5 → 0.125em. Масштаб задаётся одним `fontSize` на самой
 * панели — дублировать вёрстку под второй размер не нужно.
 *
 * Цвета акцента взяты из макета как есть (переменных `card/accent` в токенах
 * проекта нет): сплошной #0dace0 — это Brand/Blue, и полупрозрачные 22% и 16%
 * от него же.
 */

/** Заливка 16% акцента — подложка неактивных маркеров и пилюль. */
const ACCENT_16 = "#0dace029";
/** Граница маркера — акцент 22%. */
const ACCENT_22 = "#0dace038";
/** Сплошной акцент — отметка «сделано». */
const ACCENT = "#0dace0";

/*
  Значения акцента и подложки повторены здесь литералами: Tailwind собирает
  классы, читая исходный текст, и подстановку `border-[${ACCENT_22}]` он бы
  просто не увидел — правило не попало бы в сборку.
*/
const PANEL_CLASS =
  "flex flex-col gap-[1em] rounded-[1.3333em] border-[0.125em] border-[#0dace038] bg-[#ffffffb8] " +
  "p-[1.3333em] leading-[1.2] tracking-[-0.02em] text-text-primary " +
  "shadow-[0_0.1667em_0.3333em_0_#0000000d]";

/**
 * Строка списка — Elevation/Drop/Sm на подложке Bg/Glass. Тень тоже в em,
 * иначе в увеличенной панели она осталась бы «мелкой» и выдала подмену
 * масштаба.
 */
const ROW_CLASS =
  "flex w-full items-center gap-[0.6667em] overflow-hidden rounded-[0.6667em] bg-bg-glass " +
  "px-[0.8333em] py-[0.6667em] shadow-[0_0.3333em_1.3333em_-0.3333em_#60738f33]";

export function GlassPanel({
  /** Кегль панели в пикселях: от него считаются все внутренние размеры. */
  size = 12,
  className = "",
  children,
}: {
  size?: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      aria-hidden
      style={{ fontSize: `${size}px` }}
      className={`${PANEL_CLASS} ${className}`}
    >
      {children}
    </div>
  );
}

/** Маркеры строк из макета. */
type MarkerKind = "done" | "todo" | "dot" | "play" | "ask";

const MARKER_BASE =
  "flex size-[1.3333em] shrink-0 items-center justify-center overflow-hidden";

function Marker({ kind }: { kind: MarkerKind }) {
  if (kind === "done") {
    return (
      <span
        className={`${MARKER_BASE} rounded-full text-text-inverse`}
        style={{ background: ACCENT }}
      >
        ✓
      </span>
    );
  }

  if (kind === "todo") {
    return (
      <span
        className={`${MARKER_BASE} rounded-full border-[0.125em]`}
        style={{ borderColor: ACCENT_22 }}
      />
    );
  }

  if (kind === "play") {
    return (
      <span
        className={`${MARKER_BASE} rounded-[0.6667em]`}
        style={{ background: ACCENT }}
      >
        <Icon
          src="/img/icons/play.svg"
          className="size-[0.8333em] text-icon-inverse"
        />
      </span>
    );
  }

  if (kind === "ask") {
    return (
      <span
        className={`${MARKER_BASE} rounded-[0.6667em] text-text-secondary`}
        style={{ background: ACCENT_16 }}
      >
        ?
      </span>
    );
  }

  return (
    <span
      className={`${MARKER_BASE} rounded-[0.6667em]`}
      style={{ background: ACCENT_16 }}
    />
  );
}

function Row({ marker, children }: { marker: MarkerKind; children: string }) {
  return (
    <span className={ROW_CLASS}>
      <Marker kind={marker} />
      <span className="whitespace-nowrap">{children}</span>
    </span>
  );
}

/* ─────────────────────────── карточки форматов ─────────────────────────── */

/** «Туториалы» — чек-лист шагов (5290:6503). */
export function TutorialSteps() {
  return (
    <>
      <span>Туториал</span>
      <span className="flex w-full flex-col gap-[0.6667em]">
        <Row marker="done">Загрузите документ</Row>
        <Row marker="done">Создайте агента</Row>
        <Row marker="todo">Запустите задачу</Row>
      </span>
    </>
  );
}

/** «Сценарии» — список ролей (5294:6503). */
export function ScenarioList() {
  return (
    <>
      <span>Сценарии</span>
      <span className="flex w-full flex-col gap-[0.6667em]">
        <Row marker="dot">Продажи — разбор сделки</Row>
        <Row marker="dot">HR — онбординг</Row>
        <Row marker="dot">Финансы — отчёт</Row>
      </span>
    </>
  );
}

/**
 * «Вебинары» — запись и вопрос эксперту (5294:6541).
 *
 * В макете первая строка называется «Вебинар: коннекторы» — здесь «интеграции»
 * по тому же решению о переименовании, что и подпись темы в блоке видео.
 */
export function WebinarList() {
  return (
    <>
      <span>Вебинары</span>
      <span className="flex w-full flex-col gap-[0.6667em]">
        <Row marker="play">Вебинар: интеграции</Row>
        <Row marker="ask">Вопрос эксперту</Row>
      </span>
    </>
  );
}

/**
 * «Курсы» — прогресс по модулям (5294:6577 в карточке формата, 5314:90209
 * в отдельной секции).
 *
 * `modules` — сколько строк показать: в карточке формата панель обрезана
 * и дальше второго модуля ничего не видно, в секции «Курсы» видны все пять.
 */
export function CourseModules({
  modules = 5,
  done = 2,
  total = 5,
  wide = false,
}: {
  modules?: number;
  /** Сколько модулей пройдено — столько же делений закрашено в полосе. */
  done?: number;
  total?: number;
  /** Полоса прогресса во всю ширину панели (секция «Курсы»). */
  wide?: boolean;
}) {
  return (
    <>
      <span>Курс GigaCowork</span>
      <span
        className={`flex items-center gap-[0.6667em] overflow-hidden ${
          wide ? "w-full justify-between" : ""
        }`}
      >
        <span
          className={`h-[0.5em] overflow-hidden rounded-full ${
            wide ? "flex-1" : "w-[10em] shrink-0"
          }`}
          style={{ background: ACCENT_16 }}
        >
          <span
            className="block h-full rounded-full"
            style={{ background: ACCENT, width: `${(done / total) * 100}%` }}
          />
        </span>
        <span className="shrink-0 whitespace-nowrap text-text-secondary">
          {done} из&nbsp;{total} модулей
        </span>
      </span>
      <span className="flex w-full flex-col gap-[0.6667em]">
        {Array.from({ length: modules }, (_, index) => (
          <Row key={index} marker={index < done ? "done" : "dot"}>
            {`Модуль ${index + 1}`}
          </Row>
        ))}
      </span>
    </>
  );
}

/* ────────────────────────── карточки сценариев ─────────────────────────── */

/**
 * «Юристы» — разбор договора (5326:6475).
 *
 * Внутренний блок лежит на Bg/Glass с объёмной тенью Elevation/Raised/Sm.
 * Она единственная здесь в пикселях, а не в em: это готовый токен проекта, и
 * разница на масштабе ×1.3 глазу не видна, а расхождение с остальным сайтом
 * было бы заметно.
 */
export function ContractReview() {
  return (
    <>
      <span>Проверка договора</span>
      <span className="flex w-full flex-col gap-[0.6667em] rounded-[0.6667em] bg-bg-glass p-[0.6667em] shadow-raised-sm">
        <span className="flex items-center justify-between gap-[0.6667em]">
          <span>Договор поставки</span>
          <span className="text-text-secondary">DOCX</span>
        </span>
        <span
          className="flex flex-col gap-[0.3333em] rounded-[0.6667em] p-[0.6667em]"
          style={{ background: ACCENT_16 }}
        >
          <span>Срок оплаты — 90 дней</span>
          <span className="text-text-secondary">Риск: длительная отсрочка</span>
        </span>
        <span className="flex items-center justify-between gap-[0.6667em]">
          <span>Предложена правка</span>
          <span className="text-text-secondary">На проверке</span>
        </span>
      </span>
    </>
  );
}

/** Пилюля стадии сделки. */
function Stage({
  children,
  state = "past",
}: {
  children: string;
  /** `current` — текущая стадия: акцентная заливка и цвет Status/Accent. */
  state?: "done" | "current" | "past";
}) {
  if (state === "current") {
    return (
      <span
        className="flex shrink-0 items-center rounded-full px-[0.6667em] py-[0.3333em] text-status-accent"
        style={{ background: ACCENT_16 }}
      >
        {children}
      </span>
    );
  }

  return (
    <span
      className={`flex shrink-0 items-center gap-[0.4167em] rounded-full bg-bg-glass px-[0.6667em] py-[0.3333em] shadow-[0_0.3333em_1.3333em_-0.2564em_#60738f33] ${
        state === "done" ? "" : "text-text-secondary"
      }`}
    >
      {state === "done" ? (
        <span
          className="size-[0.5em] shrink-0 rounded-full"
          style={{ background: ACCENT }}
        />
      ) : null}
      {children}
    </span>
  );
}

/** «Продажи» — стадии сделки и подсказка агента (5394:6502). */
export function DealStages() {
  return (
    <>
      <span>Сделка · ООО&nbsp;«Сатурн»</span>
      <span className="flex items-center gap-[0.5em] overflow-hidden">
        <Stage state="done">Звонок</Stage>
        <span className="shrink-0 text-text-secondary">→</span>
        <Stage state="current">Предложение</Stage>
        <span className="shrink-0 text-text-secondary">→</span>
        <Stage>Оплата</Stage>
      </span>
      <span className="flex w-full items-center rounded-[0.6667em] bg-bg-glass px-[0.8333em] py-[0.6667em] shadow-[0_0.3333em_1.3333em_-0.2564em_#60738f33]">
        <span className="whitespace-nowrap">Клиент запросил предложение</span>
      </span>
    </>
  );
}
