import { CountUp } from "@/components/interactive/CountUp";
import { Lines } from "@/components/use-cases/Lines";
import type { UseCaseMetric } from "@/lib/use-cases";

/**
 * Метрики страниц «Для кого».
 * Figma desktop: 2616:11217 (pt 80 / pb 64 / px 120, gap 64, ряд из трёх
 *   равных колонок с gap 48, сноска Caption по центру)
 * Figma mobile:  2656:11540 (py 64 / px 16, колонка, gap 40, сноска через 40)
 *
 * Размер числа — по 2888:17941, как и в остальных блоках метрик на сайте:
 * Display/L (96) на мобильном, Display/XL (160) на десктопе. Знак процента —
 * Heading/H1 (48) в обеих раскладках, он не уменьшается вместе с числом.
 */
export function UseCaseMetrics({ items }: { items: UseCaseMetric[] }) {
  return (
    <section className="w-full bg-bg-page py-64 md:pt-80 md:pb-64">
      <CountUp>
        <div className="container-page flex flex-col items-center gap-40 md:gap-64">
          <div className="flex w-full flex-col gap-40 md:flex-row md:items-start md:gap-48">
            {items.map((metric) => (
              <div
                key={metric.caption}
                className="flex flex-1 flex-col items-center gap-16 overflow-hidden"
              >
                <p className="flex items-baseline whitespace-nowrap text-text-primary">
                  <span
                    data-counter
                    data-counter-value={metric.value}
                    className="text-display-l font-normal md:text-display-xl"
                  >
                    {metric.value}
                  </span>
                  <span className="text-h1 font-medium">%</span>
                </p>
                <p className="w-full text-center text-body-l text-text-primary">
                  <Lines text={metric.caption} always />
                </p>
              </div>
            ))}
          </div>

          <p className="text-caption text-text-tertiary">
            *на основе данных клиентов GigaCowork
          </p>
        </div>
      </CountUp>
    </section>
  );
}

export default UseCaseMetrics;
