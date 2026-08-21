/**
 * HowAgentsWork — "Как работают ИИ-агенты GigaCowork" (process / stack cards)
 * Figma desktop: 2006:8925  (PROTO / How it works · Scroll story — 1440 artboard,
 *                            title 36px at y=80, cards 1040×500, p-40, r-24, Elevation/Drop/Lg)
 * Figma mobile:  1927:17394 (How_it_works — 390 artboard, py 64 / px 16, gap 40,
 *                            card grid gap 16, cards 358×500, p-40, r-24, no shadow)
 *
 * The three cards are meant to получить a "stacking scroll" effect later: each card
 * becomes sticky and the previous one shrinks behind it. That logic is NOT implemented
 * here — the markup only exposes the hooks for it:
 *   • `<section data-stack-section>`   — the scroll container
 *   • `<ul data-stack-list>`           — the card track
 *   • `<li data-stack-card data-stack-index={i}>` — one card, still in normal flow
 *   • `--stack-scale` / `--stack-offset` CSS custom properties per card, taken from the
 *     Figma proto (settled widths 980 / 1010 / 1040 and tops 214 / 254 / 294)
 *   • the `HOW_IT_WORKS_CARDS` data export
 */

import Image from "@/components/ui/Image";
import { Lines } from "@/components/use-cases/Lines";

export type HowItWorksCard = {
  id: string;
  /** two lines — the line break comes from both Figma frames */
  titleLines: [string, string];
  description: string;
  image: {
    src: string;
    /** intrinsic size of the exported crop (== desktop size, bottom/right anchored) */
    width: number;
    height: number;
    /** rendered width, mobile / desktop */
    className: string;
  };
  /** desktop card fill (mobile fill is the shared Gradient/Omni/Blue_light) */
  fillClassName: string;
  /** desktop text-column width from Figma */
  contentClassName: string;
  /** settled width of the card in the stack, relative to the front card (980/1010/1040) */
  stackScale: number;
  /** vertical offset of the card inside its sticky viewport (214/254/294 → 0/40/80) */
  stackOffset: number;
};

export const HOW_IT_WORKS_CARDS: HowItWorksCard[] = [
  {
    id: "receive",
    titleLines: ["Получают задачу", "от сотрудников"],
    description: "Принимают запрос на естественном языке и уточняют детали",
    image: {
      src: "/img/agents/receive.png",
      // исходник перевыгружен в 1.5× — рендер-ширина прежняя, растр чётче
      width: 830,
      height: 632,
      className: "w-[431px] md:w-[553px]",
    },
    fillClassName: "md:bg-[#e8f5fd]",
    contentClassName: "md:max-w-[463px]",
    stackScale: 0.942,
    stackOffset: 0,
  },
  {
    id: "analyze",
    titleLines: ["Анализируют", "и структурируют данные"],
    description:
      "Интегрируются с корпоративными системами, находят информацию в базах знаний, деловых переписках",
    image: {
      src: "/img/agents/analyze.png",
      width: 906,
      height: 636,
      className: "w-[471px] md:w-[604px]",
    },
    fillClassName: "md:bg-[#f3fafe]",
    contentClassName: "md:max-w-[418px]",
    stackScale: 0.971,
    stackOffset: 40,
  },
  {
    id: "result",
    titleLines: ["Выдают", "результат"],
    /* Перенос после двоеточия: перечень форматов уходит на свою строку. */
    description:
      "Документ, таблицу, отчет в удобном формате:\nMD, pdf, excel, word",
    image: {
      src: "/img/agents/result.png",
      width: 1259,
      height: 860,
      className: "w-[491px] md:w-[630px]",
    },
    fillClassName: "md:bg-bg-card",
    contentClassName: "md:max-w-[463px]",
    stackScale: 1,
    stackOffset: 80,
  },
];

/* Section fill — Gradient/Omni/Blue (mobile 254.1° / desktop 206.5°) */
const SECTION_GRADIENT =
  "bg-[linear-gradient(254.104deg,rgb(212,226,255)_10.474%,rgb(179,235,246)_94.872%)] " +
  "md:bg-[linear-gradient(206.508deg,rgb(212,226,255)_10.474%,rgb(179,235,246)_94.872%)]";

/* Card fill on mobile — Gradient/Omni/Blue_light (227.4°); desktop overrides it per card */
const CARD_GRADIENT =
  "bg-[linear-gradient(227.381deg,rgb(237,246,255)_10.474%,rgb(212,238,239)_94.872%)]";

export function HowAgentsWork() {
  return (
    <section
      data-stack-section
      className={`w-full py-64 md:pt-80 md:pb-80 ${SECTION_GRADIENT}`}
    >
      <div className="container-page flex flex-col items-center gap-40 md:gap-48">
        {/* 1927:17395 / 2006:8933 */}
        {/* Ниже md — по левому краю, на десктопе по центру, как в макете. */}
        <h2
          data-stack-heading
          className="w-full max-w-[358px] text-left text-h3 font-medium text-neutral-1000 md:max-w-none md:text-center md:text-h2"
        >
          Как работают ИИ-агенты
          <br />
          GigaCowork
        </h2>

        {/* Card grid (1927:17396) / sticky stack (2006:8926–2006:8931) */}
        <ul
          data-stack-list
          className="flex w-full max-w-[1040px] flex-col gap-16 md:gap-24"
        >
          {HOW_IT_WORKS_CARDS.map((card, index) => (
            <li
              key={card.id}
              data-stack-card
              data-stack-index={index}
              style={
                {
                  "--stack-scale": card.stackScale,
                  "--stack-offset": `${card.stackOffset}px`,
                } as React.CSSProperties
              }
              className={`relative h-[500px] overflow-hidden rounded-[24px] p-40 md:shadow-elevation-lg ${CARD_GRADIENT} ${card.fillClassName}`}
            >
              <div
                className={`relative z-10 flex flex-col gap-16 ${card.contentClassName}`}
              >
                <h3 className="text-h4 font-medium text-text-primary md:text-h3">
                  {card.titleLines[0]}
                  <br />
                  {card.titleLines[1]}
                </h3>
                {/*
                  Через Lines: в данных жёсткий перенос помечен «\n» и работает
                  с md. Ниже md он снимается — на 390 колонка узкая, и разбивка,
                  рассчитанная на широкую карточку, рвала бы строку не там.
                */}
                <p className="text-body-m text-text-secondary md:text-body-l">
                  <Lines text={card.description} />
                </p>
              </div>

              {/*
                Illustration — exported crop, anchored to the bottom (and to the right on
                desktop) so that it bleeds out of the card exactly like in Figma.
              */}
              <Image
                src={card.image.src}
                alt={`${card.titleLines[0]} ${card.titleLines[1]}`}
                width={card.image.width}
                height={card.image.height}
                sizes="(max-width: 767px) 491px, 630px"
                className={`pointer-events-none absolute bottom-0 left-0 h-auto max-w-none select-none md:left-auto md:right-0 ${card.image.className}`}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default HowAgentsWork;
