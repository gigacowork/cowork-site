/**
 * NoHours — "Не тратьте часы на задачи, которые ИИ сделает за минуты" (Role Carousel)
 * Figma desktop: 1927:15563 (1440 artboard, pt 96 / pb 64 / px 80, gap 48, track gap 24, card 282×380)
 * Figma mobile:  1927:17369 (390 artboard, py 64 / px 16, gap 40, same 282×380 cards, no nav row)
 *
 * The track is a plain horizontally-scrollable <ul> so that a scroll-jacking
 * behaviour (vertical wheel -> horizontal card scroll) can be attached later.
 * Hooks exposed for that work: `data-cards-section`, `data-cards-track`,
 * `data-cards-prev`, `data-cards-next` and the `NO_HOURS_CARDS` data export.
 */

import { CarouselNavigation } from "@/components/ui/CarouselControl";

export type NoHoursCard = {
  /** stable key, also usable as a scroll target id by the animation layer */
  id: string;
  title: string;
  /** bullet list (regular cards) */
  items?: string[];
  /** plain paragraph instead of a list (CTA card) */
  text?: string;
  linkLabel: string;
  /** last card in the mock — lighter gradient + border + blur + shadow */
  highlighted?: boolean;
};

export const NO_HOURS_CARDS: NoHoursCard[] = [
  {
    id: "leader",
    title: "Руководителю",
    items: [
      "собирать статусы от руководителей перед советом директоров",
      "читать длинные переписки ради одного решения",
      "искать, о чём договорились на прошлой встрече",
      "переписывать один и тот же посыл для совета директоров, команды и партнёров",
    ],
    linkLabel: "Подробнее",
  },
  {
    id: "finance",
    title: "Финансам",
    items: [
      "напоминать подразделениям про план-факт и бюджет",
      "сводить Excel-файлы из разных подразделений",
      "объяснять, как правильно оформить заявку",
      "вручную искать ответ на вопрос «Сколько потратили на...»",
    ],
    linkLabel: "Подробнее",
  },
  {
    id: "commercial",
    title: "Коммерческому блоку",
    items: [
      "заполнять CRM после каждого звонка",
      "писать follow-up после каждой встречи",
      "собирать информацию о клиенте перед встречей",
      "пересказывать контекст сделки разным отделам",
    ],
    linkLabel: "Подробнее",
  },
  {
    id: "legal",
    title: "Юристам",
    items: [
      "сравнивать договоры пункт за пунктом",
      "объяснять коллегам одни и те же правки",
      "искать, где остановилось согласование",
      "доставать условия из старых договоров по запросу",
    ],
    linkLabel: "Подробнее",
  },
  {
    id: "hr",
    title: "HR и кадрам",
    items: [
      "отвечать на одинаковые вопросы сотрудников",
      "искать время у нанимателей для десятков собеседований",
      "повторять один и тот же онбординг",
      "анализировать сотни одинаковых резюме",
    ],
    linkLabel: "Подробнее",
  },
  {
    id: "accounting",
    title: "Бухгалтерии",
    items: [
      "гоняться за закрывающими документами",
      "исправлять ошибки в реквизитах",
      "отвечать на одинаковые вопросы про выплаты",
      "искать расхождения",
    ],
    linkLabel: "Подробнее",
  },
  {
    id: "it-support",
    title: "ИТ-поддержке / Сервис-деск",
    items: [
      "вручную разбирать однотипные заявки",
      "пересказывать инструкции, которые никто не прочитал",
      "искать владельца доступов",
      "допрашивать сотрудников для выявления реальной",
    ],
    linkLabel: "Подробнее",
  },
  {
    id: "procurement",
    title: "Закупкам",
    items: [
      "сравнивать десятки КП поставщиков вручную",
      "собирать требования от инициаторов по почте и в чатах",
      "собирать итоговую рекомендацию для закупочной КОМИССИИ",
      "готовить однотипную пояснительную",
    ],
    linkLabel: "Подробнее",
  },
  {
    id: "custom",
    title: "Не нашли свою задачу?",
    text: "Опишите ее, мы соберем агента под вас",
    linkLabel: "Описать задачу",
    highlighted: true,
  },
];

/* Figma card fills (Gradient / Omni / Neuton_Light) */
const CARD_GRADIENT =
  "bg-[linear-gradient(66.503deg,rgb(218,253,228)_4.332%,rgb(228,250,255)_22.937%,rgb(230,246,255)_92.893%)]";

/* Highlighted card: mobile fill (1927:17384) + desktop fill (1927:15577) */
const CARD_GRADIENT_HIGHLIGHT =
  "bg-[linear-gradient(226.357deg,rgba(212,226,255,0.72)_10.474%,rgba(179,235,246,0.72)_94.872%)] " +
  "md:bg-[linear-gradient(66.111deg,rgb(166,253,220)_0.952%,rgb(177,241,255)_50.802%,rgb(207,231,255)_101.64%)] " +
  "border border-[#ffffff99] backdrop-blur-[8px] drop-shadow-[0_4px_8px_rgba(96,115,143,0.2)]";

export function NoHours() {
  return (
    <section
      data-cards-section
      className="bg-bg-page flex w-full flex-col items-center gap-40 py-64 md:gap-48 md:pt-96 md:pb-64"
    >
      {/* Header — Role Carousel / in (1927:15564 / 1927:17371) */}
      <div className="container-page flex flex-col items-center gap-16 text-center text-neutral-1000">
        <h2 className="text-h3 font-medium md:text-h2">
          Не тратьте часы на задачи,
          <br />
          которые ИИ сделает{" "}
          <span className="block md:inline">за минуты</span>
        </h2>
        <p className="text-h4 font-medium md:text-h3">С GigaCowork не нужно</p>
      </div>

      {/*
        Track viewport (1927:15567 / 1927:17374).
        Native horizontal scroll = mobile swipe behaviour out of the box;
        the animation layer only has to drive `scrollLeft` on [data-cards-track].
      */}
      <ul
        data-cards-track
        className="container-page no-scrollbar flex snap-x snap-mandatory gap-24 overflow-x-auto scroll-smooth"
      >
        {NO_HOURS_CARDS.map((card) => (
          <li
            key={card.id}
            data-card-id={card.id}
            className={`card-interactive relative flex min-h-[380px] w-[282px] shrink-0 snap-start flex-col justify-between rounded-[24px] px-32 py-40 ${
              card.highlighted
                ? `bg-neutral-0 ${CARD_GRADIENT_HIGHLIGHT}`
                : CARD_GRADIENT
            }`}
          >
            <div className="flex w-full flex-col gap-[30px]">
              {/* Title Wrapper — fixed 48px so every card's body starts on the same line */}
              <div className="flex h-[48px] w-full items-start pl-[3px]">
                <h3 className="text-h4 font-medium text-text-primary">
                  {card.title}
                </h3>
              </div>

              {card.items ? (
                <ul className="w-full list-disc space-y-8 pl-[18px] text-caption text-text-secondary">
                  {card.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="w-full text-caption text-text-secondary">
                  {card.text}
                </p>
              )}
            </div>

            {/*
              Text Link (695:4830). Зона клика растянута на всю карточку —
              кликабельна карточка целиком (Card / Info 1312:4755).
            */}
            <a
              href="#more"
              aria-label={`${card.linkLabel} — ${card.title}`}
              className="text-link stretched-target flex cursor-pointer items-center justify-start self-start py-4 text-left text-caption focus-visible:outline-none"
            >
              {card.linkLabel}
            </a>
          </li>
        ))}
      </ul>

      {/*
        Navigation row (1927:15578) — desktop only, absent from the mobile mock.
        Carousel Navigation 804:3916: two controls, gap-8, 120×44 total.
      */}
      <div className="container-page hidden items-center justify-center md:flex">
        <CarouselNavigation />
      </div>
    </section>
  );
}

export default NoHours;
