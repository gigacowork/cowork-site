import { Icon } from "@/components/ui/Icon";
import { Kicker } from "@/components/ui/Kicker";
import { Lines } from "@/components/use-cases/Lines";
import { StepVideoCard } from "@/components/use-cases/StepVideoCard";
import type { UseCaseStep } from "@/lib/use-cases";

/**
 * «Начните с одной задачи…» — три шага с заглушками видео.
 * Figma desktop: 2616:11259 (padding 120, gap 48 до стопки, ряды через 96,
 *   текст 480 и заглушка 588×400 через 80, второй ряд — зеркальный)
 * Figma mobile:  2656:11582 (py 64 / px 16, gap 40 до стопки, ряды через 64,
 *   текст, под ним заглушка 358×244)
 *
 * Ряды чередуются: 1 и 3 — текст слева, 2 — справа. На мобильном порядок всегда
 * «текст, затем видео», поэтому зеркалит не flex-direction, а `order`: так в DOM
 * текст идёт первым во всех рядах и порядок чтения совпадает с визуальным.
 */

/*
  Фон секции (2672:11905) — Gradient/Omni/Neuton 2 под углом 233.478°.
  Раньше здесь был Neuton_Light (2616:11259), более светлый и в другую
  сторону: голубой уходил вправо вверх, а теперь — сине-сиреневый сверху
  справа к мятному снизу слева.
*/
const SECTION_GRADIENT =
  "bg-[linear-gradient(233.478deg,#d4e2ff_10.994%,#b3ebf6_79.923%,#b3f6e1_101.64%)]";

/**
 * Video Placeholder (2801:16380) — белая карточка с кнопкой воспроизведения.
 *
 * Скругление 24, а не 20 из макета: во всём остальном на сайте карточки
 * скруглены на 24 (--radius-24), и в одной секции рядом с записями экрана
 * разнобой был бы заметен.
 */
function VideoPlaceholder({ label }: { label?: string }) {
  return (
    <div className="flex aspect-[588/400] w-full flex-col items-center justify-center gap-16 overflow-hidden rounded-[24px] bg-bg-page p-32 shadow-drop-lg">
      <div className="flex w-full flex-col items-center justify-center gap-[20px]">
        {/*
          Кнопка белая на белой карточке — держится только на тени. В макете
          она задана эффектом, в экспорте его не видно, поэтому берём ближайшую
          ступень Elevation из токенов проекта.
        */}
        <span className="flex size-[64px] items-center justify-center rounded-[32px] border border-[#ffffff80] bg-neutral-0 shadow-drop-sm backdrop-blur-[6px]">
          <Icon
            src="/img/icons/play.svg"
            className="size-[48px] text-icon-primary"
          />
        </span>
        {/* Подписи под кнопкой в макете есть не у всех ролей. */}
        {label ? (
          <span className="text-center text-body-m font-medium text-text-secondary">
            {label}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export function UseCaseSteps({
  title,
  lead,
  items,
}: {
  /** Заголовок секции. В макете Финансов его нет — остаётся один кикер. */
  title?: string;
  /** Короткая строка-связка под заголовком («Агенты:» и т.п.). */
  lead?: string;
  items: UseCaseStep[];
}) {
  return (
    <section className={`w-full py-64 md:py-120 ${SECTION_GRADIENT}`}>
      <div className="container-page flex flex-col gap-40 md:gap-48">
        {/* Ниже md текст по левому краю, пилюля — по центру. */}
        <div className="flex flex-col items-start gap-24 text-left">
          <Kicker className="self-center md:self-start">Решения</Kicker>
          {title ? (
            <h2 className="text-h3 font-medium text-text-primary md:max-w-[800px] md:text-h2">
              <Lines text={title} />
            </h2>
          ) : null}
          {lead ? (
            <p className="text-body-l text-text-secondary">{lead}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-64 md:gap-96">
          {items.map((step, i) => {
            const mirrored = i % 2 === 1;

            return (
              <div
                key={step.title}
                className="flex flex-col gap-24 md:flex-row md:items-start md:justify-between md:gap-80"
              >
                {/*
                  В макете ниже md этот текст стоял по центру (2656:11587) — по
                  просьбе выключка левая на всех ширинах, как у остального
                  текста вне карточек на страницах «Для кого».
                */}
                <div
                  className={`flex flex-col items-start gap-16 text-left md:w-[480px] md:gap-[20px] ${
                    mirrored ? "md:order-2" : ""
                  }`}
                >
                  <h3 className="text-h4 font-medium text-text-primary md:text-h3">
                    <Lines text={step.title} />
                  </h3>
                  {/*
                    В этом блоке абзацы разделены отступом 16 (2616:11267), а не
                    пустой строкой, как в hero и сценариях, — поэтому здесь
                    отдельные <p> с gap, а не один текстовый блок.
                  */}
                  <div className="flex flex-col gap-16 text-body-l text-text-secondary">
                    {step.paragraphs.map((paragraph) => (
                      <p key={paragraph}>
                        <Lines text={paragraph} />
                      </p>
                    ))}

                    {/* Перечень под абзацами — есть только у части рядов. */}
                    {step.bullets?.length ? (
                      <ul className="flex flex-col gap-12 text-left">
                        {step.bullets.map((bullet) => (
                          <li key={bullet} className="flex items-start gap-8">
                            <span
                              aria-hidden
                              className="flex size-[24px] shrink-0 items-center justify-center"
                            >
                              <span className="size-[8px] rounded-full bg-icon-primary" />
                            </span>
                            <span className="flex-1 text-body-m">{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </div>

                <div className={`md:w-[588px] ${mirrored ? "md:order-1" : ""}`}>
                  {step.video ? (
                    <StepVideoCard
                      src={step.video}
                      poster={step.videoPoster}
                      label={step.videoLabel}
                      ratio={step.videoRatio}
                    />
                  ) : (
                    <VideoPlaceholder label={step.videoLabel} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default UseCaseSteps;
