import { Button } from "@/components/ui/Button";

/**
 * FinalCta — «Готовы делегировать работу ИИ-агентам?»
 * Figma desktop: 2569:43352 (CTA 2572:11130 — 1440 wide, px 80 / py 160,
 *   gradient 227.36deg #f0f8ff 20.714% → #f7f7f8 94.867%, column 588, gap 40)
 * Figma mobile:  2569:43383 (px 24 / py 64, gradient 245.7deg, H3 25px)
 *
 * Подложка одна на все страницы — градиент 227.36° (2572:11130 на главной,
 * 2745:15473 на страницах «Для кого»).
 *
 * Блок центрирован везде и на всех ширинах. Раньше на главной он ниже md был
 * прижат влево — под общую левую выключку мобильных секций; по просьбе
 * выровнен по центру, как в макете, и вариант с выключкой убран за
 * ненадобностью.
 */

const SURFACE =
  "bg-[linear-gradient(245.7deg,#f0f8ff_20.714%,#f7f7f8_94.867%)] " +
  "md:bg-[linear-gradient(227.36deg,#f0f8ff_20.714%,#f7f7f8_94.867%)]";

export function FinalCta({
  title,
}: {
  /** Заголовок. У части страниц он свой — например «Быстрый старт с GigaCowork». */
  title?: string;
}) {
  return (
    <section
      id="final-cta"
      className={`w-full py-64 md:py-[160px] ${SURFACE}`}
    >
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
            href="/lead"
            variant="primary"
            size="lg"
            className="text-body-m!"
          >
            Попробовать бесплатно
          </Button>
        </div>
      </div>
    </section>
  );
}

export default FinalCta;
