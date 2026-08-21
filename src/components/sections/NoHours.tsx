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

import Link from "next/link";
import { CarouselNavigation } from "@/components/ui/CarouselControl";
import { Icon } from "@/components/ui/Icon";
import { TaskDialog } from "@/components/interactive/TaskDialog";
import { useCaseHrefByCardId } from "@/lib/use-cases";

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
  /**
   * Карточка временно не показывается. Оставлена в данных, а не удалена:
   * вернуть её нужно будет вместе с формой, которая за ней стоит.
   */
  hidden?: boolean;
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
    /*
      ВРЕМЕННО СКРЫТА: в первый релиз не идёт. Вернуть — снять `hidden`.
      Форма, которая открывалась по этой карточке, лежит на месте
      (TaskDialog), трогать её не нужно.
    */
    hidden: true,
  },
];

/** Карточки, которые реально выводятся. */
const VISIBLE_CARDS = NO_HOURS_CARDS.filter((card) => !card.hidden);

/*
  Заливка карточек — Gradient/Omni/Neuton_Light_5 (1603:21768, Preview /
  Gradient / Hero / Aurora): бледно-зелёный в левом нижнем углу переходит в
  светло-голубой к правому верхнему.

  Задана на всех ширинах, а не только с md. Раньше ниже md стояла ровная
  #f2f3fa — она повторяла мобильную версию блока «Безопасная российская
  ИИ-инфраструктура», и карточки на телефоне выглядели иначе, чем на десктопе.

  Белая подложка из макета не нужна: все три опоры непрозрачные, а за пределами
  4.3–92.9% CSS продлевает крайние цвета — белого не видно.
*/
const CARD_GRADIENT =
  "bg-[linear-gradient(54.15deg,rgb(218,253,228)_4.332%,rgb(228,250,255)_22.937%,rgb(230,246,255)_92.893%)] " +
  /*
    Зелёное начало градиента уведено за левый нижний угол. Сам градиент не
    тронут: он рисуется на холсте, который на 40 шире и выше карточки и сдвинут
    влево-вниз, поэтому точка 0% оказывается снаружи, а в углу карточки видна
    уже более светлая часть перехода. Фон рисуется только внутри border-box,
    так что за пределами карточки ничего не появляется.
  */
  "[background-position:-40px_0] [background-size:calc(100%+40px)_calc(100%+40px)]";

/* Highlighted card: mobile fill (1927:17384) + desktop fill (1927:15577) */
const CARD_GRADIENT_HIGHLIGHT =
  "bg-[linear-gradient(226.357deg,rgba(212,226,255,0.72)_0%,rgba(196,231,251,0.72)_50%,rgba(179,235,246,0.72)_100%)] " +
  "md:bg-[linear-gradient(66.111deg,rgb(166,253,220)_0%,rgb(172,247,238)_25%,rgb(177,241,255)_50%,rgb(192,236,255)_75%,rgb(207,231,255)_100%)] " +
  "border border-[#ffffff99] backdrop-blur-[8px] drop-shadow-[0_4px_8px_rgba(96,115,143,0.2)]";

/*
  Тело карточки. В макете это Caption 12px; по просьбе поднято до 16px — это
  Body/L, обычная ступень шкалы. Тем же размером набран текст в карточках
  блоков «Как работают ИИ-агенты» и «Сделайте ИИ-агентов частью команды».
*/
const CARD_TEXT = "text-body-l";

export function NoHours() {
  return (
    <section
      id="audience"
      data-cards-section
      className="bg-bg-page flex w-full flex-col items-center gap-40 py-64 md:gap-48 md:pt-96 md:pb-64"
    >
      {/* Header — Role Carousel / in (1927:15564 / 1927:17371) */}
      {/*
        Ниже md заголовок и подзаголовок прижаты влево — как и весь текст вне
        карточек в мобильной раскладке. На десктопе выключка по центру, как в
        макете (1927:15564).
      */}
      <div className="container-page flex flex-col items-start gap-16 text-left text-neutral-1000 md:items-center md:text-center">
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
        {VISIBLE_CARDS.map((card) => (
          <li
            key={card.id}
            data-card-id={card.id}
            className={`card-interactive relative flex min-h-[404px] w-[306px] shrink-0 snap-start flex-col justify-between rounded-[24px] px-32 py-40 ${
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

              {/*
                Задачи и «забрал агент» лежат в одной коробке: список остаётся
                в потоке и задаёт высоту, знак стоит поверх него. Иначе при
                подмене одного другим карточка меняла бы высоту прямо во время
                прокрутки.

                Что именно происходит по мере прокрутки, описано в globals.css
                (блок «Не тратьте часы…»): карточка получает --done от 0 до 1,
                и от него считаются оба состояния.
              */}
              <div className="relative w-full">
                {card.items ? (
                  <ul
                    className={`w-full list-disc space-y-8 pl-[18px] text-text-secondary ${CARD_TEXT}`}
                  >
                    {card.items.map((item, i) => (
                      <li
                        key={item}
                        data-task
                        style={{ "--i": i } as React.CSSProperties}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p
                    data-task
                    style={{ "--i": 0 } as React.CSSProperties}
                    className={`w-full text-text-secondary ${CARD_TEXT}`}
                  >
                    {card.text}
                  </p>
                )}

                {/*
                  Одна отметка на карточку: агент и галочка собраны в один
                  знак, а не разложены по пунктам — иначе на четыре строки
                  пришлось бы четыре пары иконок, и это был бы шум.
                */}
                {/*
                  Знак прижат к верху колонки задач, а не выровнен по её центру:
                  списки разной длины, и по центру знак вставал бы у каждой
                  карточки на своей высоте — при прокрутке иконки скакали бы.
                  Верх колонки у всех карточек общий (заголовок ровно 48), так
                  что от него отсчёт и идёт.
                */}
                <div
                  data-card-done
                  aria-hidden
                  className="pointer-events-none absolute inset-0 flex flex-col items-center gap-12 pt-16"
                >
                  <span className="relative flex size-[56px] items-center justify-center rounded-full bg-neutral-0/70 shadow-drop-sm">
                    <Icon
                      src="/img/icons/bot.svg"
                      className="size-[28px] text-icon-primary"
                    />
                    <span
                      data-card-check
                      className="absolute -right-4 -bottom-4 flex size-[24px] items-center justify-center rounded-full bg-neutral-0 shadow-drop-sm"
                    >
                      <Icon
                        src="/img/icons/check.svg"
                        className="size-[16px] text-status-success"
                      />
                    </span>
                  </span>
                  <p className={`text-text-secondary ${CARD_TEXT}`}>
                    Выполнил ИИ-агент
                  </p>
                </div>
              </div>
            </div>

            {/*
              Text Link (695:4830). Зона клика растянута на всю карточку —
              кликабельна карточка целиком (Card / Info 1312:4755).

              Адрес берётся из общего списка ролей по id карточки, а не пишется
              здесь: те же данные питают выпадающее меню «Для кого» и сами
              страницы. Последняя карточка своей роли не имеет: она открывает
              попап с формой, а не уводит на отдельную страницу — задачу
              описывают, не отрываясь от каталога.
            */}
            {card.id === "custom" ? (
              <TaskDialog label={card.linkLabel} cardTitle={card.title} />
            ) : (
              <Link
                href={useCaseHrefByCardId(card.id) ?? "/lead"}
                aria-label={`${card.linkLabel} — ${card.title}`}
                /*
                  mt-16 — гарантированный зазор до списка. Карточка выстроена
                  через justify-between, и в самой длинной («Руководителю») на
                  16px текст вырос настолько, что подпись вплотную прилипала к
                  последнему пункту.
                */
                className={`text-link stretched-target mt-16 flex cursor-pointer items-center justify-start self-start py-4 text-left focus-visible:outline-none ${CARD_TEXT}`}
              >
                {card.linkLabel}
              </Link>
            )}
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
