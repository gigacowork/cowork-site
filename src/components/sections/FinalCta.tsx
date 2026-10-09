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
  buttonLabel = "Попробовать бесплатно",
  buttonHref = "/lead",
}: {
  /** Заголовок. У части страниц он свой — например «Быстрый старт с GigaCowork». */
  title?: ReactNode;
  /** Кадр фона из макета страницы. По умолчанию — первый. */
  background?: CtaVariant;
  /** Переопределяется для сценариев с отдельным тарифным предложением. */
  buttonLabel?: string;
  buttonHref?: string;
}) {
  return (
    <section
      id="final-cta"
      className={`relative isolate w-full overflow-hidden py-64 md:py-[160px] ${CTA_FALLBACK}`}
    >
      <CtaBackground variant={background} />

      <div className="container-page flex items-center justify-center gap-24 md:items-start">
        {/* CTA / Left Column — 2546:41683 */}
        <div className="flex w-full flex-col items-center gap-40 md:w-[588px]">
          {/* CTA / Intro — 2546:41684 */}
          <div className="flex w-full flex-col items-center gap-32">
            <h2
              id="final-cta-title"
              className="w-full text-center text-h3 font-medium text-text-primary md:w-[522px] md:text-h2"
            >
              {title ?? (
                <>
                  Готовы делегировать
                  <br />
                  работу ИИ-агентам?
                </>
              )}
            </h2>
          </div>

          <Button
            href={buttonHref}
            variant="primary"
            size="lg"
            className="text-body-m!"
          >
            {buttonLabel}
          </Button>
        </div>
      </div>
    </section>
  );
}

export default FinalCta;
