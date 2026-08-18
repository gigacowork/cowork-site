import { Button } from "@/components/ui/Button";

/**
 * FinalCta — «Готовы делегировать работу ИИ-агентам?»
 * Figma desktop: 2569:43352 (CTA 2572:11130 — 1440 wide, px 80 / py 160,
 *   gradient 227.36deg #f0f8ff 20.714% → #f7f7f8 94.867%, column 588, gap 40)
 * Figma mobile:  2569:43383 (px 24 / py 64, gradient 245.7deg, H3 25px)
 *
 * `surface` — подложка секции. На главной это градиент (2572:11130), на
 * страницах «Для кого» тот же компонент вставлен на белую страницу
 * (2616:11300): там CTA идёт следом за цветным блоком преимуществ, и второй
 * градиент подряд читался бы как продолжение предыдущей секции.
 *
 * `align` — выключка. По макету блок центрированный, и на страницах «Для кого»
 * он таким и остаётся. На главной вся типографика секций выровнена по левому
 * краю, поэтому там колонка прижата к краю контейнера: центрированный блок в
 * 588 внутри 1200 начинался бы с отступом 426 и выпадал бы из общей линии.
 */

const SURFACES = {
  gradient:
    "bg-[linear-gradient(245.7deg,#f0f8ff_20.714%,#f7f7f8_94.867%)] " +
    "md:bg-[linear-gradient(227.36deg,#f0f8ff_20.714%,#f7f7f8_94.867%)]",
  page: "bg-bg-page",
} as const;

const ALIGN = {
  center: {
    row: "items-center justify-center md:items-start",
    column: "items-center md:w-[588px]",
    intro: "items-center",
    title: "text-center md:w-[522px]",
  },
  /*
    Влево — только ниже md. На десктопе блок остаётся центрированным, как в
    макете: колонка 588 внутри 1200 при выключке влево начиналась бы с отступом
    426 и всё равно не вставала бы на линию остальных заголовков.
  */
  left: {
    row: "items-start justify-start md:items-start md:justify-center",
    column: "items-start md:w-[588px] md:items-center",
    intro: "items-start md:items-center",
    title: "text-left md:w-[522px] md:text-center",
  },
} as const;

export function FinalCta({
  surface = "gradient",
  align = "center",
}: {
  surface?: keyof typeof SURFACES;
  align?: keyof typeof ALIGN;
}) {
  const a = ALIGN[align];

  return (
    <section
      id="final-cta"
      className={`w-full py-64 md:py-[160px] ${SURFACES[surface]}`}
    >
      <div className={`container-page flex gap-24 ${a.row}`}>
        {/* CTA / Left Column — 2546:41683 */}
        <div className={`flex w-full flex-col gap-40 ${a.column}`}>
          {/* CTA / Intro — 2546:41684 */}
          <div className={`flex w-full flex-col gap-32 ${a.intro}`}>
            <h2
              id="final-cta-title"
              className={`w-full text-h3 font-medium text-text-primary md:text-h2 ${a.title}`}
            >
              Готовы делегировать
              <br />
              работу ИИ-агентам?
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
