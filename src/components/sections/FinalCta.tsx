import { Button } from "@/components/ui/Button";

/**
 * FinalCta — «Готовы делегировать работу ИИ-агентам?»
 * Figma desktop: 2569:43352 (CTA 2572:11130 — 1440 wide, px 80 / py 160,
 *   gradient 227.36deg #f0f8ff 20.714% → #f7f7f8 94.867%, column 588, gap 40)
 * Figma mobile:  2569:43383 (px 24 / py 64, gradient 245.7deg, H3 25px)
 */

export function FinalCta() {
  return (
    <section
      id="final-cta"
      className="w-full bg-[linear-gradient(245.7deg,#f0f8ff_20.714%,#f7f7f8_94.867%)] py-64 md:bg-[linear-gradient(227.36deg,#f0f8ff_20.714%,#f7f7f8_94.867%)] md:py-[160px]"
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
              Готовы делегировать
              <br />
              работу ИИ-агентам?
            </h2>
          </div>

          <Button
            href="#lead"
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
