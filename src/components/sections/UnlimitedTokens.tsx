/**
 * UnlimitedTokens — "Безлимитное количество токенов" (Benefits)
 * Figma desktop: 2061:9010 (1440 artboard, pt 48 / pb 80 / px 80, gap 24, two 588×300 cards, card gap 24)
 * Figma mobile:  1927:17404 (390 artboard, py 64 / px 16, gap 24, stacked full-width cards, inner gap 48)
 *
 * The illustrations are pre-rendered PNGs (548×206) cropped to the card clip box:
 * the crop's right edge == the card's right edge and its top edge == the card's top edge,
 * so each image is pinned `top-0 right-0` at natural size and clipped by the card
 * (`overflow-hidden`) — exactly the overflow behaviour of the Figma "Media slot".
 *
 * Hooks for the animation layer: `data-tokens-section`, `data-token-card="<id>"`.
 */

import Image from "@/components/ui/Image";

export type TokenBenefitCard = {
  id: string;
  /** illustration, cropped to the card clip box */
  image: string;
  imageAlt: string;
  /** title split exactly on the Figma line break */
  titleLines: [string, string];
  /** body split exactly on the Figma line break */
  bodyLines: [string, string];
  /** mobile + md: card gradients straight from Figma (Gradient / Omni / Neuton_Light) */
  gradient: string;
};

export const TOKEN_BENEFIT_CARDS: TokenBenefitCard[] = [
  {
    id: "per-user",
    image: "/img/tokens/per-user.svg",
    imageAlt: "Тарификация по пользователям",
    titleLines: ["Тарификация", "по пользователям"],
    bodyLines: [
      "Стоимость определяется числом людей,",
      "а не интенсивностью их работы с агентами",
    ],
    gradient:
      "bg-[linear-gradient(61.831deg,rgb(218,253,228)_0.952%,rgb(228,250,255)_50.802%,rgb(244,251,255)_101.64%)] " +
      "md:bg-[linear-gradient(40.431deg,rgb(197,248,229)_0.952%,rgb(220,249,255)_50.802%,rgb(228,245,255)_101.64%)]",
  },
  {
    id: "no-limits",
    image: "/img/tokens/no-limits.svg",
    imageAlt: "Без ограничений по количеству задач",
    titleLines: ["Без ограничений", "по количеству задач"],
    bodyLines: [
      "Агенты выполняют столько задач, сколько требует бизнес.",
      "Цена не меняется.",
    ],
    gradient:
      "bg-[linear-gradient(59.38deg,rgb(218,253,228)_0.952%,rgb(228,250,255)_50.802%,rgb(244,251,255)_101.64%)] " +
      "md:bg-[linear-gradient(40.526deg,rgb(197,248,229)_0.952%,rgb(220,249,255)_50.802%,rgb(228,245,255)_101.64%)]",
  },
];

export function UnlimitedTokens() {
  return (
    <section
      data-tokens-section
      className="bg-bg-page w-full py-64 md:pt-48 md:pb-80"
    >
      <div className="container-page flex flex-col gap-24">
        {/* Benefits / Left Column (2061:9011 / 1927:17405) */}
        <div className="flex flex-col items-center md:h-[104px]">
          <h2 className="text-h3 text-center font-medium text-neutral-1000 md:text-h2">
            <span className="md:block">Безлимитное</span> количество токенов
          </h2>
        </div>

        {/* Benefits / Content (2061:9013) — row on desktop, stack on mobile */}
        <ul className="flex flex-col gap-24 md:flex-row md:items-start md:justify-center">
          {TOKEN_BENEFIT_CARDS.map((card) => (
            <li
              key={card.id}
              data-token-card={card.id}
              className={`relative flex w-full flex-col gap-48 overflow-hidden rounded-[24px] bg-neutral-0 p-40 md:min-h-[300px] md:w-auto md:max-w-[588px] md:flex-1 md:gap-24 min-[1200px]:h-[300px] ${card.gradient}`}
            >
              {/* Illustration — pinned to the card's top-right corner, clipped by the card */}
              <Image
                src={card.image}
                alt={card.imageAlt}
                width={548}
                height={206}
                className="pointer-events-none absolute top-0 right-0 h-[206px] w-[548px] max-w-none select-none"
              />

              {/* Media slot (532:221) — reserves the 104px the illustration sits over */}
              <div aria-hidden className="h-[104px] w-full shrink-0" />

              {/* Content (532:222) */}
              <div className="relative flex w-full flex-col gap-12 text-text-primary">
                <h3 className="text-h3 font-medium">
                  {card.titleLines[0]}
                  <br />
                  {card.titleLines[1]}
                </h3>
                <p className="text-body-l">
                  {card.bodyLines[0]}
                  <br />
                  {card.bodyLines[1]}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default UnlimitedTokens;
