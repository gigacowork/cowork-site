import { Kicker } from "@/components/ui/Kicker";
import { Lines } from "@/components/use-cases/Lines";
import type { UseCaseProcess as UseCaseProcessData } from "@/lib/use-cases";

/**
 * «Как это работает» — ряд пронумерованных шагов и широкая плашка под ними.
 * Figma desktop: 2919:17802 (px 120 / pt 100, заголовок с gap 16, ряд из
 *   четырёх карточек 282 с gap 24, плашка 1200 с внутренними полями 40)
 *
 * Пока блок есть только у юристов (2919:17802), поэтому на остальных страницах
 * данных для него нет и секция не рисуется. Компонент общий — если блок
 * появится у другой роли, достаточно добавить `process` в её данные.
 *
 * Ниже md ряд разворачивается в колонку: четыре карточки по 282 в строку на
 * 390 не помещаются, а горизонтальная прокрутка здесь была бы лишней — это не
 * карусель, а последовательность шагов, её читают сверху вниз.
 */

/** Плашка под шагами — та же заливка, что у карточек преимуществ. */
const CALLOUT_GRADIENT =
  "bg-[linear-gradient(56.4deg,#c5f8e5_0.95%,#dcf9ff_50.8%,#e4f5ff_101.64%)]";

export function UseCaseProcess({ kicker, title, steps, callout }: UseCaseProcessData) {
  return (
    <section className="w-full bg-bg-page py-64 md:pt-[100px] md:pb-64">
      <div className="container-page flex flex-col gap-40 md:gap-48">
        <div className="flex flex-col items-center gap-16 text-center md:items-start md:text-left">
          <Kicker>{kicker}</Kicker>
          {/* Заголовка может не быть — тогда над шагами остаётся один кикер. */}
          {title ? (
            <h2 className="text-h3 font-medium text-text-primary md:text-h2">
              <Lines text={title} />
            </h2>
          ) : null}
        </div>

        <ol className="flex flex-col gap-24 md:flex-row md:items-stretch">
          {steps.map((step) => (
            <li
              key={step.number}
              className="flex flex-1 flex-col gap-12 border-t border-border-subtle pt-16"
            >
              <span className="text-body-m text-text-tertiary">{step.number}</span>
              <h3 className="text-h4 font-medium text-text-primary">
                <Lines text={step.title} />
              </h3>
              <p className="text-body-m text-text-secondary">{step.text}</p>
            </li>
          ))}
        </ol>

        {callout ? (
          /*
            Плашка: слева заголовок, справа пояснение. На десктопе колонки
            стоят рядом (в макете 400 и 688), ниже md — друг под другом.
          */
          <div
            className={`flex flex-col gap-16 rounded-[24px] p-24 md:flex-row md:items-center md:gap-32 md:p-40 ${CALLOUT_GRADIENT}`}
          >
            <h3 className="text-h4 font-medium text-text-primary md:w-[400px] md:shrink-0 md:text-h3">
              <Lines text={callout.title} />
            </h3>
            <p className="text-body-m text-text-secondary md:flex-1">
              {callout.text}
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default UseCaseProcess;
