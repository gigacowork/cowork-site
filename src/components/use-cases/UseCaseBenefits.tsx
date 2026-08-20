import { Icon } from "@/components/ui/Icon";
import { Kicker } from "@/components/ui/Kicker";
import { Lines, Paragraphs } from "@/components/use-cases/Lines";
import type { UseCaseBenefit } from "@/lib/use-cases";

/**
 * Блок «Преимущества» — три карточки Card / Workspace.
 * Figma desktop: 2625:41950 (px 120 / py 100, gap 56, ряд из трёх равных
 *   карточек 345 высотой с gap 24, внутри pt 40 / px 40 / pb 24)
 * Figma mobile:  2656:39896 (py 48 / px 16, кикер по центру, карточки в
 *   колонку с gap 16, высота по содержимому)
 *
 * Заголовка у секции нет — только кикер: так в макете.
 */

/** Card / Workspace (2697:40608) — Gradient/Omni/Neuton_Light_3. */
const CARD_GRADIENT =
  "bg-[linear-gradient(56.4deg,#c5f8e5_0.95%,#dcf9ff_50.8%,#e4f5ff_101.64%)]";

export function UseCaseBenefits({
  title,
  lead,
  kicker = "Преимущества",
  items,
}: {
  title?: string;
  lead?: string;
  /** `null` — кикера нет: в макете закупок блок идёт обычным заголовком. */
  kicker?: string | null;
  items: UseCaseBenefit[];
}) {
  const hasTags = items.some((item) => item.tags?.length);

  return (
    <section className="w-full bg-bg-page py-48 md:py-[100px]">
      <div className="container-page flex flex-col gap-[56px]">
        {/*
          В макете у секции только кикер. Заголовок и строка-связка появляются
          там, где они есть в тексте роли, — размеры те же, что у заголовков
          остальных секций шаблона.
        */}
        <div className="flex flex-col items-center gap-24 text-center md:items-start md:text-left">
          {kicker ? <Kicker>{kicker}</Kicker> : null}
          {title ? (
            <h2 className="text-h3 font-medium text-text-primary md:max-w-[800px] md:text-h2">
              <Lines text={title} />
            </h2>
          ) : null}
          {lead ? <p className="text-body-l text-text-secondary">{lead}</p> : null}
        </div>

        {/*
          Отступы карточки одинаковы в обеих раскладках (2707:12039):
          pt 40 / px 40 / pb 24. Высота задана только на десктопе — там ряд
          выровнен по 345; на мобильном карточка растёт по содержимому, и теги
          встают сразу под текстом.
        */}
        <div className="flex flex-col gap-16 md:flex-row md:gap-24">
          {items.map((benefit) => (
            <article
              key={benefit.title}
              className={`flex flex-1 flex-col gap-16 overflow-hidden rounded-[24px] px-40 pt-40 pb-24 ${
                /*
                  345 из макета — под карточку с тегами внизу. Без тегов такая
                  высота оставляла половину карточки пустой, поэтому ряд
                  выравнивается по содержимому.
                */
                hasTags ? "md:h-[345px]" : "md:min-h-[220px]"
              } ${CARD_GRADIENT}`}
            >
              <div className="flex flex-col gap-16 md:flex-1">
                <h3 className="text-h4 font-medium text-text-primary md:text-h3">
                  <Lines text={benefit.title} />
                </h3>
                <p className="text-body-m text-text-secondary">
                  <Paragraphs items={benefit.paragraphs} />
                </p>
              </div>

              {/* Tags (1388:5966) — только если они заданы в тексте роли */}
              <ul className="flex flex-wrap gap-8 empty:hidden">
                {(benefit.tags ?? []).map((tag) => (
                  <li
                    key={tag.label}
                    className="flex items-center justify-center gap-4 rounded-full bg-bg-tag py-8 pl-8 pr-[10px] text-caption text-text-primary"
                  >
                    <Icon src={tag.icon} className="size-[24px] text-icon-primary" />
                    {tag.label}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default UseCaseBenefits;
