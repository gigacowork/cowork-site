import { Button } from "@/components/ui/Button";
import type { ReactNode } from "react";
import {
  CTA_FALLBACK,
  CtaBackground,
  type CtaVariant,
} from "@/components/ui/CtaBackground";

/**
 * FinalCta — «Готовы делегировать работу ИИ-агентам?»
 * Figma desktop: 2569:43352 (CTA 2572:11130 — 1440 wide, px 80 / py 160,
 *   column 588, gap 40)
 * Figma mobile:  2569:43383 (px 24 / py 64, H3 25px)
 *
 * Подложка приходит снаружи: в макетах кадров два и они чередуются по
 * страницам (см. `CtaVariant`). На главной — первый.
 *
 * Блок центрирован везде и на всех ширинах. Раньше на главной он ниже md был
 * прижат влево — под общую левую выключку мобильных секций; по просьбе
 * выровнен по центру, как в макете, и вариант с выключкой убран за
 * ненадобностью.
 */

export function FinalCta({
  title,
  background,
  description,
  detailsHref,
  detailsLabel = "Подробнее",
  wideContent = false,
  buttonLabel = "Попробовать бесплатно",
  buttonHref = "/lead",
  buttonNewTab = false,
}: {
  /** Заголовок. У части страниц он свой — например «Быстрый старт с GigaCowork». */
  title?: ReactNode;
  /** Кадр фона из макета страницы. По умолчанию — первый. */
  background?: CtaVariant;
  /** Дополнительное условие предложения под заголовком. */
  description?: ReactNode;
  /** Ссылка на подробные условия предложения. */
  detailsHref?: string;
  detailsLabel?: string;
  /** Более широкая колонка для длинного заголовка акции. */
  wideContent?: boolean;
  /** Переопределяется для сценариев с отдельным предложением. */
  buttonLabel?: ReactNode;
  /** null оставляет кнопку без перехода. */
  buttonHref?: string | null;
  /** Открыть ссылку кнопки в новой вкладке. */
  buttonNewTab?: boolean;
}) {
  return (
    <section
      id="final-cta"
      className={`relative isolate w-full overflow-hidden py-64 md:py-[160px] ${CTA_FALLBACK}`}
    >
      <CtaBackground variant={background} />

      <div className="container-page flex items-center justify-center gap-24 md:items-start">
        {/* CTA / Left Column — 2546:41683 */}
        <div className={`flex w-full flex-col items-center gap-40 ${wideContent ? "md:max-w-[720px]" : "md:w-[588px]"}`}>
          {/* CTA / Intro — 2546:41684 */}
          <div className="flex w-full flex-col items-center gap-32">
            <h2
              id="final-cta-title"
              className={`w-full text-center text-h3 font-medium text-text-primary md:text-h2 ${wideContent ? "" : "md:w-[522px]"}`}
            >
              {title ?? (
                <>
                  Готовы делегировать
                  <br />
                  работу ИИ-агентам?
                </>
              )}
            </h2>
            {description ? (
              <p className="w-full text-center text-body-l text-text-secondary">
                {description}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col items-center gap-16">
            {buttonHref === null ? (
              <Button variant="primary" size="lg" className="text-body-m!" disabled>
                {buttonLabel}
              </Button>
            ) : (
              <Button
                href={buttonHref}
                target={buttonNewTab ? "_blank" : undefined}
                rel={buttonNewTab ? "noopener noreferrer" : undefined}
                variant="primary"
                size="lg"
                className="text-body-m!"
              >
                {buttonLabel}
              </Button>
            )}
            {detailsHref ? (
              <a
                href={detailsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-body-m text-text-primary underline underline-offset-4 hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary"
              >
                {detailsLabel}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FinalCta;
