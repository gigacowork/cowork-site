"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";

/**
 * HeroChat — hero-embedded chat (NOT a modal).
 *
 * Figma (fileKey o8OtIvYjYSo8N7W6N7VKnB):
 *   1969:30031 → 1933:85345 "PROTO / Hero Chat · Embedded", 900 wide:
 *     Idle 1933:20980 (136)  Composer Empty 1933:44757 (136)
 *     Composer Filled 1933:51449 (136)
 *     Step 1 1933:58141 (251)  Step 2 1933:64987 (372)
 *     Step 3 1933:71805 (476)  Step 4 1933:78595 (605)
 *   1200:1621 "Chat / Message List" — Step 1 1200:1622 (91), Step 2 1200:2217 (212),
 *     Step 3 1200:2273 (316), Step 4 1200:2329 / Step=Full 488:227 (445)
 *   361:961 "Chat / Shell" State=Conversation — stack order:
 *     MessageList (700) ↓ Scenario List (900) — no composer in the hero
 *   361:621 "Chat / Composer"   361:774 "Chat / Scenario List"   353:903 "Chip"
 *
 * The composer stays put; the message list unfolds above it and the whole
 * assembly grows 136 → 251 → 372 → 476 → 605.
 * Mobile hero (1927:17359) contains neither composer nor chips → desktop only.
 */

/* ------------------------------------------------------------------ */
/* Copy — every string below is verbatim from the Figma nodes above     */
/* ------------------------------------------------------------------ */

type AgentStep = { title: string; text: string };

type Scenario = {
  /** Бейдж внутри чипа */
  role: string;
  /** Подпись чипа */
  scenario: string;
  /** Сообщение пользователя */
  prompt: string;
  /** Три шага агента */
  steps: [AgentStep, AgentStep, AgentStep];
  /** Финальный пузырь с действиями */
  result: { title: string; text: string; actions: [string, string, string] };
};

/** Chat / Scenario List — I1933:78661;361:626, тексты сценариев от заказчика */
const SCENARIOS: Scenario[] = [
  {
    role: "CEO",
    scenario: "Управленческая отчётность",
    prompt:
      "Собери управленческую отчётность за\u00A0неделю: выручку, воронку продаж, статус ключевых сделок. Сформируй отчет в\u00A0PowerPoint.",
    steps: [
      {
        title: "Подключаюсь к\u00A0системам",
        text: "Битрикс24 CRM, 1С:ERP, аналитика сайта. Данные за\u00A07\u00A0дней выгружены.",
      },
      {
        title: "Формирую отчёт",
        text: "Выручка: 18.4\u00A0млн ₽ (+12% к\u00A0прошлой неделе). Воронка: 94\u00A0сделки, конверсия 23%. Создаю файл в\u00A0PowerPoint, включая графики и\u00A0выводы по\u00A0ключевым сделкам.",
      },
      {
        title: "Ключевые сделки",
        text: "3\u00A0сделки на\u00A0финальной стадии. Общая сумма: 11.2\u00A0млн ₽.\nРиск срыва по\u00A0одной сделке\u00A0– от\u00A0клиента нет ответа 9\u00A0дней.",
      },
    ],
    result: {
      title: "Готово",
      text: "Отчёт подготовлен.",
      actions: ["Скачать .pptx", "Открыть в\u00A0браузере", "Отправить на\u00A0почту"],
    },
  },
  {
    role: "Продажи",
    scenario: "Обновление статуса в\u00A0CRM",
    prompt:
      "Звонок с\u00A0клиентом ООО «Луч» завершён. Подготовь саммари встречи, зафиксируй договоренности в\u00A0карточке клиента в\u00A0Битрикс24.",
    steps: [
      {
        title: "Обрабатываю запись",
        text: "Клиент: Алексей Морозов, ООО «Луч». Ключевая договоренность: согласовать спецификацию и\u00A0сроки поставки станочного оборудования, предоставить финальное КП.",
      },
      {
        title: "Квалифицирую сделку",
        text: "Потенциальная сумма сделки\u00A0— 3\u00A0млн ₽. ЛПР: технический директор и\u00A0финансовый директор.",
      },
      {
        title: "Следующий шаг",
        text: "Подготовить КП до\u00A0пятницы. Организовать повторный звонок через неделю.",
      },
    ],
    result: {
      title: "Готово",
      text: "Карточка в\u00A0CRM заполнена. Задача на\u00A0КП создана.",
      actions: ["Открыть карточку", "В\u00A0календарь", "Подготовить КП"],
    },
  },
  {
    role: "Закупки",
    scenario: "Выбор поставщика",
    prompt:
      "Поступил запрос на\u00A0закупку токарного станка с\u00A0ЧПУ. Оцени бюджет, найди поставщиков и\u00A0подготовь сравнительную таблицу.",
    steps: [
      {
        title: "Проверяю бюджет",
        text: "Статья 07-03 «Оборудование»: лимит\u00A0— 6\u00A0млн ₽, использовано\u00A0— 2,1\u00A0млн ₽. Остаток\u00A0— 3,9\u00A0млн ₽. Закупка в\u00A0рамках утвержденного бюджета.",
      },
      {
        title: "Нахожу поставщиков",
        text: "Найдены 3\u00A0поставщика из\u00A0реестра одобренных контрагентов. Получены актуальные коммерческие предложения.",
      },
      {
        title: "Сравниваю предложения",
        text: "Поставщик №1\u00A0— 3,1\u00A0млн ₽, срок поставки\u00A0— 30\u00A0дней. Поставщик №2\u00A0— 2,82\u00A0млн ₽, срок поставки\u00A0— 14\u00A0дней. Поставщик №3\u00A0— 3,4\u00A0млн ₽, срок поставки\u00A0— 21\u00A0день.",
      },
    ],
    result: {
      title: "Итог",
      text: "Сравнительная таблица подготовлена. Рекомендован поставщик №2: минимальная стоимость и\u00A0лучшие условия поставки.",
      actions: ["Скачать таблицу", "Создать заявку", "Подготовить пояснительную записку"],
    },
  },
  {
    role: "Юристы",
    scenario: "Проверка договора",
    prompt:
      "Сравни договор поставки с\u00A0внутренним шаблоном и\u00A0найди критические расхождения. Документы во\u00A0вложении.",
    steps: [
      {
        title: "Сравниваю структуру",
        text: "Договор содержит 18\u00A0разделов, в\u00A0соответствие с\u00A0шаблоном. Выявлено 4\u00A0содержательных отклонения.",
      },
      {
        title: "Критичные отклонения",
        text: "— П. 7.3 «Ответственность сторон»: срок ответственности\u00A0— 1\u00A0месяц вместо стандартных 3\u00A0месяцев.\n\n— П. 11.1: отсутствует арбитражная оговорка МКАС.",
      },
      {
        title: "Некритичные",
        text: "Выявлено 6\u00A0стилистических расхождений без\u00A0изменения юридического смысла. Договор можно принять после корректировки критичных пунктов.",
      },
    ],
    result: {
      title: "Готово",
      text: "Отчёт готов.",
      actions: ["Протокол разногласий", "Скачать .docx", "Внести правки"],
    },
  },
  {
    role: "Финансы",
    scenario: "План-факт продаж",
    prompt:
      "Собери план-факт продаж за\u00A0Q2: отклонения по\u00A0выручке и\u00A0расходам, ключевые причины и\u00A0прогноз на\u00A0Q3.",
    steps: [
      {
        title: "Выгружаю данные",
        text: "1С:ERP и\u00A0бюджетная модель. Выручка Q2\u00A0— 284\u00A0млн ₽ при\u00A0плане 310\u00A0млн ₽. Отклонение\u00A0— −8,4%.",
      },
      {
        title: "Анализирую отклонения",
        text: "Основное снижение\u00A0— в\u00A0сегменте SMB (−18%). Сегмент Enterprise превысил план на\u00A04%. Расходы в\u00A0пределах бюджета. EBITDA\u00A0— 22% при\u00A0плане 24%.",
      },
      {
        title: "Прогноз Q3",
        text: "При\u00A0текущей динамике выручка составит 290–305\u00A0млн ₽. Основной риск\u00A0— задержка двух крупных сделок на\u00A0общую сумму 34\u00A0млн ₽.",
      },
    ],
    result: {
      title: "Итог",
      text: "Отчёт готов.",
      actions: ["Скачать .xlsx", "Открыть дашборд", "Подготовить презентацию"],
    },
  },
];

/* ------------------------------------------------------------------ */
/* Model                                                                */
/* ------------------------------------------------------------------ */

export type ChatMessage =
  | { id: number; author: "user"; text: string }
  | {
      id: number;
      author: "agent";
      title: string;
      text: string;
      actions?: string[];
    };

/** Delay before each scripted agent reply lands (typing dots show first). */
const REPLY_DELAYS = [700, 1500, 1500];

/** Bubble width in 1200:1621 — user 1097:4488 is 460, agent bubbles render to the same edge. */
const BUBBLE_MAX = 460;

/**
 * Высота окна чата (1200:2329 «Step 4» = 445, +24 — зазор до блока сценариев).
 * Вмещает три с половиной сообщения: верхнее подрезано и уходит в размытие,
 * так видно, что выше есть ещё.
 *
 * Окно раскрывается на эту высоту сразу по клику на чипс и дальше не меняется:
 * пока сценарий отыгрывает, сообщения приходят внутрь неподвижной рамки, а не
 * раздвигают её — иначе страница под hero дёргается на каждом ответе.
 */
const LIST_GAP = 24;
const LIST_HEIGHT = 445 + LIST_GAP;


/** How much of the top dissolves once the list is capped and starts scrolling. */
const MAX_TOP_FADE = 88;

const HEIGHT_EASE = "cubic-bezier(0.22, 0.61, 0.36, 1)";
const HEIGHT_DURATION = 360;

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

/* ------------------------------------------------------------------ */
/* Component                                                            */
/* ------------------------------------------------------------------ */

export function HeroChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const [topFade, setTopFade] = useState(0);
  /** Chip State=Active 353:904 — выбранный сценарий */
  const [active, setActive] = useState<string | null>(null);

  const idRef = useRef(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const reduced = usePrefersReducedMotion();
  const reducedRef = useRef(reduced);
  reducedRef.current = reduced;

  /* Сообщение пользователя, затем сценарные ответы агента по одному. */
  const send = useCallback((item: Scenario) => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setActive(item.scenario);
    setMessages([{ id: ++idRef.current, author: "user", text: item.prompt }]);

    const replies = [
      ...item.steps,
      {
        title: item.result.title,
        text: item.result.text,
        actions: item.result.actions as unknown as string[],
      },
    ];

    let elapsed = 0;
    replies.forEach((reply, index) => {
      timers.current.push(setTimeout(() => setTyping(true), elapsed + 120));
      elapsed += REPLY_DELAYS[index] ?? 1200;
      timers.current.push(
        setTimeout(() => {
          setTyping(index < replies.length - 1);
          setMessages((prev) => [
            ...prev,
            {
              id: ++idRef.current,
              author: "agent",
              title: reply.title,
              text: reply.text,
              actions: "actions" in reply ? reply.actions : undefined,
            },
          ]);
          if (index === replies.length - 1) setTyping(false);
        }, elapsed)
      );
    });
  }, []);

  /* Повторный клик по активному чипу — сворачиваем чат обратно в Idle. */
  const close = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setTyping(false);
    setActive(null);
    /*
      Сообщения стираем не сразу: пока рамка съезжает в ноль, содержимое должно
      оставаться на месте. Если очистить список сразу, чат сначала мигает
      пустотой и только потом закрывается.
    */
    timers.current.push(
      setTimeout(() => setMessages([]), reducedRef.current ? 0 : HEIGHT_DURATION)
    );
  }, []);

  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    },
    []
  );

  /*
    Чат раскрыт с момента, когда выбран сценарий, и дальше высота не меняется.
    Раньше окно росло вслед за содержимым и упиралось в предел только на
    четвёртом ответе — из-за этого hero четыре раза подряд менял высоту, утягивая
    за собой всю страницу.
  */
  const opened = active !== null;
  const listHeight = opened ? LIST_HEIGHT : 0;

  /* Последнее сообщение держим в виду, пока сценарий отыгрывает. */
  useEffect(() => {
    if (!opened) return;
    const el = viewportRef.current;
    if (!el) return;
    const frame = requestAnimationFrame(() =>
      el.scrollTo({
        top: el.scrollHeight,
        behavior: reducedRef.current ? "auto" : "smooth",
      })
    );
    return () => cancelAnimationFrame(frame);
  }, [messages, typing, opened]);

  /* Верхние сообщения растворяются, когда список прокручен. */
  useEffect(() => {
    const el = viewportRef.current;
    if (!el || !opened) {
      setTopFade(0);
      return;
    }
    let frame = 0;
    const measure = () => {
      frame = 0;
      setTopFade(Math.min(el.scrollTop, MAX_TOP_FADE));
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    measure();
    return () => {
      el.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [opened]);

  /* Multi-stop ramp so the top edge dissolves instead of cutting off. */
  const fadeMask =
    topFade > 1
      ? `linear-gradient(to bottom, rgba(0,0,0,0) 0px, rgba(0,0,0,0.08) ${(
          topFade * 0.3
        ).toFixed(1)}px, rgba(0,0,0,0.45) ${(topFade * 0.62).toFixed(
          1
        )}px, rgba(0,0,0,1) ${topFade.toFixed(1)}px)`
      : undefined;

  return (
    /* PROTO / Hero Chat · Embedded — 900 wide, desktop only (1927:17359 has no chat) */
    <div className="hidden w-full max-w-[900px] flex-col items-center md:flex">
      {/* Chat / Message List 1200:1621 — grows 0 → 91 → 212 → 316 → 445 */}
      {/*
        overscroll-behavior намеренно оставлен по умолчанию: домотав список до
        конца, читатель продолжает тем же движением листать страницу дальше.
        С `overscroll-contain` прокрутка упиралась в чат и останавливалась.
      */}
      <div
        ref={viewportRef}
        data-chat-viewport
        aria-hidden={!opened}
        className={`w-full ${opened ? "overflow-y-auto" : "overflow-hidden"}`}
        style={{
          height: listHeight,
          transition: reduced
            ? "none"
            : `height ${HEIGHT_DURATION}ms ${HEIGHT_EASE}`,
          maskImage: fadeMask,
          WebkitMaskImage: fadeMask,
        }}
      >
        {/*
          Пока сообщений меньше, чем вмещает окно, они прижаты к низу: диалог
          растёт снизу вверх, как в настоящем чате, а не висит в пустой рамке.
        */}
        <div className="mx-auto flex min-h-full w-full max-w-[700px] flex-col justify-end pb-24">
          <ul aria-live="polite" className="flex flex-col gap-12">
            {messages.map((message) =>
              message.author === "user" ? (
                /* Chat / User Message 1913:14339 — wrapper p-8, right aligned */
                <li key={message.id} className="flex justify-end p-8">
                  <div className="chat-bubble-in chat-glass flex w-full max-w-[460px] flex-col gap-12 overflow-hidden rounded-[16px] px-16 py-12 backdrop-blur-[12px]">
                    <p className="whitespace-pre-wrap break-words text-body-m text-text-primary">
                      {message.text}
                    </p>
                  </div>
                </li>
              ) : (
                /* Chat / Message 1098:4383 (Type=Agent 357:596) */
                <li key={message.id} className="flex items-start gap-8 p-8">
                  {/* Icon=bot 826:6909, 24×24 */}
                  <Icon src="/img/icons/bot.svg" className="mt-4 size-[24px] text-icon-primary" />
                  <div
                    className={`chat-bubble-in chat-glass flex min-w-0 flex-1 flex-col gap-12 rounded-[16px] px-16 py-12 backdrop-blur-[12px] ${
                      message.actions ? "chat-glass-outlined" : ""
                    }`}
                    style={{ maxWidth: BUBBLE_MAX }}
                  >
                    <div className="flex flex-col gap-4">
                      <p className="text-caption text-icon-secondary">
                        {message.title}
                      </p>
                      <p className="whitespace-pre-line break-words text-body-m text-text-primary">
                        {message.text}
                      </p>
                    </div>

                    {/*
                      Кнопки финального сообщения — витрина, а не рабочие
                      действия: файла за ними нет. Ведём на страницу заявки,
                      это ближайший осмысленный шаг для того, кто досмотрел
                      сценарий. Подпись остаётся из макета, поэтому у ссылки
                      явный aria-label — иначе скринридер объявит «Скачать
                      .pptx», а откроется форма.
                    */}
                    {message.actions ? (
                      <div className="flex flex-wrap content-center items-center gap-8">
                        {message.actions.map((action) => (
                          <Link
                            key={action}
                            href="/lead"
                            aria-label={`${action} — оставить заявку`}
                            className="flex cursor-pointer items-center justify-center whitespace-nowrap rounded-full bg-action-secondary-default py-8 pl-16 pr-[18px] text-caption text-text-primary shadow-[inset_0_0_0_1px_var(--color-border-strong)] transition-colors duration-200 hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary"
                          >
                            {action}
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </li>
              )
            )}

            {typing ? (
              <li className="flex items-start gap-8 p-8">
                {/* Icon=bot 826:6909, 24×24 */}
                <Icon src="/img/icons/bot.svg" className="mt-4 size-[24px] text-icon-primary" />
                <span className="chat-bubble-in chat-glass flex items-center gap-4 rounded-[16px] px-16 py-12 backdrop-blur-[12px]">
                  {[0, 1, 2].map((dot) => (
                    <span
                      key={dot}
                      style={{ animationDelay: `${dot * 160}ms` }}
                      className="chat-dot size-[6px] rounded-full bg-icon-secondary"
                    />
                  ))}
                  <span className="sr-only">Агент печатает</span>
                </span>
              </li>
            ) : null}
          </ul>
        </div>
      </div>

      {/*
        No composer here on purpose. The hero Idle state (1927:15554) shows
        only the heading, the subtitle and the scenario chips — the chips are
        the trigger, and the block below shows just the user message and the
        agent's answer.
      */}

      {/*
        Chat / Scenario List 1933:78661 — 900, p 24, chips grid gap 12.

        Подписи «Какие задачи уже решают ИИ-агенты» над чипами больше нет: чипы
        идут сразу под подзаголовком hero. Раз подписи не осталось, внутренний
        gap 24 тоже не нужен — в колонке один элемент.
      */}
      <div className="flex w-full flex-col items-center p-24">
        {/*
          Chip 353:903 — три состояния, у всех opacity 70%:
            Default 353:902   bg-card       + border-subtle
            Hover   1171:4399 secondary-hover + border-default
            Active  353:904   bg-card       + icon-secondary
              («Active показывает выбранный сценарий» — описание компонента)
          В макете активный чип не кликается. Здесь он остаётся кликабельным:
          повторное нажатие сворачивает чат — иначе выйти из сценария нечем,
          и hero навсегда остаётся раскрытым на 469px.
          Граница задана внутренней тенью, потому что штрихи в Figma
          выровнены внутрь и не увеличивают габарит чипа.

          Hover уточнён по 3132:58205 (Chat / Scenario List, наведение на первый
          чип): вместо смены фона на #f7f8fa — заливка градиентом
          Gradient/Omni/Neuton 2, граница снимается, добавляется Elevation/Drop/Sm.
          Прозрачность 70% сохраняется во всех состояниях, роль-пилюля не меняется.
          Pressed в макете нет — на нажатии оставляем ту же заливку с более
          собранной тенью.
        */}
        <ul className="flex w-full flex-wrap content-center items-center justify-center gap-12">
          {SCENARIOS.map((item) => {
            const isActive = active === item.scenario;
            return (
              <li key={item.scenario}>
                <button
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => (isActive ? close() : send(item))}
                  /*
                    Ховер: заливка Gradient/Hero/Aurora (1078:3394) и обводка
                    Border/Default из State=Hover (1171:4399). Тени в макете
                    нет.

                    Нажатие — тот же ховер, только чип становится прозрачнее:
                    отдельного состояния Pressed в компоненте нет, а разница в
                    плотности читается как отклик на клик.

                    В покое прозрачности нет. Раньше на чипе висела opacity 70%
                    (из вариантов компонента), и сквозь него просвечивал фон
                    hero: белая подложка роли выглядела серой, а текст — блёклым.
                  */
                  className={`group flex cursor-pointer items-center justify-center gap-4 rounded-full p-8 transition-[box-shadow,background-color,background-image,opacity] duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary ${
                    isActive
                      ? "bg-bg-card shadow-[inset_0_0_0_1px_var(--color-icon-secondary)]"
                      : "bg-bg-card shadow-[inset_0_0_0_1px_var(--color-border-subtle)] hover:bg-[image:var(--gradient-hero-aurora)] hover:shadow-[inset_0_0_0_1px_var(--color-border-default)] active:bg-[image:var(--gradient-hero-aurora)] active:opacity-70 active:shadow-[inset_0_0_0_1px_var(--color-border-default)]"
                  }`}
                >
                  {/*
                    Отступы и заливки — по Chip / State=Default (1927:15561):
                    у чипа 8 со всех сторон и шаг 4, у подложки роли 8 по
                    горизонтали и 4 по вертикали, заливка neutral-100.

                    Кегль оставлен Body/M 14 — в макете здесь Caption 12, но
                    рядом с подзаголовком hero 16 чипы читались как подпись, а
                    не как перечень сценариев. Это единственное отступление.

                    В ховере подложка роли становится белой: под ней в этот
                    момент градиент Aurora, и серая пилюля на нём выглядела
                    грязным пятном. Правило висит на самом чипе (group-hover),
                    потому что курсор наводят на него, а не на пилюлю.
                  */}
                  <span className="flex items-center justify-center rounded-full bg-neutral-100 px-8 py-4 text-body-m text-text-secondary transition-colors duration-200 ease-out group-hover:bg-bg-card">
                    {item.role}
                  </span>
                  <span className="whitespace-nowrap text-body-m text-text-primary">
                    {item.scenario}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default HeroChat;
