/**
 * Metrics — ×2 / -20% / 3 мес
 * Figma desktop: 1927:15594 (1440 artboard, py 64 / px 120, row, gap 40, items-start, 3 × 307px columns)
 * Figma mobile:  1927:17400 (390 artboard, py 64 / px 16, column, gap 40, items-center, same 307px columns)
 * Metric / Content component: 1562:3014 (Value row 1642:6684 + Body/L description 1477:6173)
 *
 * Counter animation hooks (animation is intentionally NOT implemented here):
 *  - `data-metrics-section` on the <section> — viewport trigger target
 *  - `data-counter` + `data-counter-value={n}` on the <span> that wraps ONLY the digits,
 *    so the animation layer can rewrite textContent while prefix ("×" / "-") and
 *    suffix ("%" / "мес") stay untouched.
 *  - the `METRICS` export below holds the parsed parts.
 * The statically rendered text is already the final value, so the block reads
 * correctly with JS disabled.
 */

export type Metric = {
  /** stable key, also usable as a target id by the animation layer */
  id: string;
  /** rendered at Display/XL size, before the digits ("×", "-", "") */
  prefix: string;
  /** the animated number */
  value: number;
  /** rendered at Heading/H1 size, after the digits ("%", "мес", "") */
  suffix: string;
  /** Body/L description; "\n" is an explicit line break in the mock */
  label: string;
};

export const METRICS: Metric[] = [
  {
    id: "speed",
    prefix: "×",
    value: 2,
    suffix: "",
    label: "быстрее выполненных\nтиповых задач",
  },
  {
    id: "headcount",
    prefix: "-",
    value: 20,
    suffix: "%",
    label: "потребности\nв расширении штата",
  },
  {
    id: "time-to-value",
    prefix: "",
    value: 3,
    suffix: "мес",
    label: "до первых\nрезультатов",
  },
];

export function Metrics() {
  return (
    <section
      data-metrics-section
      aria-label="Результаты внедрения GigaCowork"
      className="bg-bg-page w-full py-64"
    >
      {/*
        Ниже md метрики прижаты влево — как и весь текст вне карточек на
        главной. На десктопе это по-прежнему ряд из трёх равных колонок, где
        число и подпись стоят по центру своей колонки (1927:15594).
      */}
      <ul className="container-page flex flex-col items-start gap-40 md:flex-row md:items-start md:justify-center">
        {METRICS.map((metric) => (
          <li
            key={metric.id}
            className="flex w-[307px] max-w-full shrink-0 flex-col items-start gap-16 md:items-center"
          >
            {/* Value (1642:6684) — baseline-aligned Display/XL + Heading/H1 suffix */}
            {/*
              Размер числа по 2888:17941: Display/L (96) на мобильном и
              Display/XL (160) на десктопе. Суффикс — Heading/H1 (48) в обеих
              раскладках, он не уменьшается вместе с числом.
            */}
            <p className="flex items-baseline whitespace-nowrap text-neutral-1000">
              <span className="text-display-l font-normal md:text-display-xl">
                {metric.prefix}
                <span data-counter data-counter-value={metric.value}>
                  {metric.value}
                </span>
              </span>
              {metric.suffix ? (
                <span className="text-h1 font-medium">{metric.suffix}</span>
              ) : null}
            </p>

            {/* Description (1477:6173) — Body/L, hard line break from Figma */}
            <p className="text-body-l w-full whitespace-pre-line text-left text-text-primary md:text-center">
              {metric.label}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Metrics;
