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

import { readFileSync } from "node:fs";
import path from "node:path";

/* ------------------------------------------------------------------ */
/*  Иллюстрации                                                         */
/* ------------------------------------------------------------------ */

/**
 * SVG вставляются инлайном, а не через <img>: анимировать нужно слои ВНУТРИ
 * файла, а из <img> до них не добраться. Файл читается на сервере при сборке,
 * каждой группе верхнего уровня дописывается `data-token-layer` и три
 * переменные — откуда она выезжает, до какой прозрачности доходит и с какой
 * задержкой стартует. Дальше всё делает CSS, JS только включает проигрывание.
 */
type Layer = {
  /** сдвиг стартовой позиции в координатах SVG */
  from: [number, number];
  /** задержка старта, мс */
  delay: number;
};

function inlineTokenArt(file: string, layers: Layer[]) {
  const raw = readFileSync(
    path.join(process.cwd(), "public", "img", "tokens", file),
    "utf8"
  );

  let index = -1;
  return raw
    .replace(
      "<svg ",
      '<svg class="pointer-events-none absolute top-0 right-0 h-[206px] w-[548px] max-w-none select-none" '
    )
    .replace(/<g\b([^>]*)>/g, (match, attrs: string) => {
      index += 1;
      const layer = layers[index];
      if (!layer) return match;
      // Собственная прозрачность группы из макета — к ней и возвращаемся.
      const opacity = /opacity="([\d.]+)"/.exec(attrs)?.[1] ?? "1";
      return (
        `<g${attrs} data-token-layer style="` +
        `--from-x:${layer.from[0]}px;--from-y:${layer.from[1]}px;` +
        `--to-opacity:${opacity};--delay:${layer.delay}ms">`
      );
    });
}

/**
 * no-limits.svg — пять карточек задач, уложенных лесенкой вверх-вправо
 * (x/y из файла: 416/−22, 382/8, 348/38, 314/68, 280/98). Передняя, нижняя —
 * «Отчёт для совета директоров»; остальные стартуют ровно на ней и одна за
 * другой разъезжаются вверх. Сдвиг каждой — разница координат с передней.
 */
const NO_LIMITS_LAYERS: Layer[] = [
  { from: [-136, 120], delay: 520 },
  { from: [-102, 90], delay: 390 },
  { from: [-68, 60], delay: 260 },
  { from: [-34, 30], delay: 130 },
  { from: [0, 0], delay: 0 },
];

/**
 * per-user.svg — три круга (cx 411 / 468 / 526). Выезжают в плашку справа
 * налево: первым правый, за ним средний, последним левый. Стартовая точка
 * вынесена за правый край карточки, а карточка обрезает вылет — за её
 * границами анимации не видно.
 */
const PER_USER_LAYERS: Layer[] = [
  { from: [150, 0], delay: 280 },
  { from: [150, 0], delay: 140 },
  { from: [150, 0], delay: 0 },
];

export type TokenBenefitCard = {
  id: string;
  /** инлайн-SVG иллюстрации, обрезанный клип-боксом карточки */
  art: string;
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
    art: inlineTokenArt("per-user.svg", PER_USER_LAYERS),
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
    art: inlineTokenArt("no-limits.svg", NO_LIMITS_LAYERS),
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
        {/* Ниже md — по левому краю, на десктопе по центру, как в макете. */}
        <div className="flex flex-col items-start md:h-[104px] md:items-center">
          <h2 className="text-h3 text-left font-medium text-neutral-1000 md:text-center md:text-h2">
            <span className="md:block">Безлимитное</span> количество токенов
          </h2>
        </div>

        {/* Benefits / Content (2061:9013) — row on desktop, stack on mobile */}
        {/*
          items-stretch, а не items-start: карточки в ряду должны быть одной
          высоты — иначе та, у которой описание длиннее, торчит ниже соседней.
        */}
        <ul className="flex flex-col gap-24 md:flex-row md:items-stretch md:justify-center">
          {TOKEN_BENEFIT_CARDS.map((card) => (
            <li
              key={card.id}
              data-token-card={card.id}
              /*
                Высота только минимальная. В макете карточка 588×300, но живой
                текст в наших метриках занимает ~342px, и жёсткие 300px вместе с
                overflow-hidden срезали нижнюю строку описания и весь нижний
                паддинг. Теперь карточка растёт под контент.
              */
              className={`relative flex w-full flex-col gap-48 overflow-hidden rounded-[24px] bg-neutral-0 p-40 md:min-h-[300px] md:w-auto md:max-w-[588px] md:flex-1 md:gap-24 ${card.gradient}`}
            >
              {/*
                Illustration — pinned to the card's top-right corner, clipped by
                the card. Декоративная: смысл несут заголовок и текст рядом.
              */}
              <div
                aria-hidden
                data-token-art
                dangerouslySetInnerHTML={{ __html: card.art }}
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
