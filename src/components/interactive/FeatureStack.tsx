"use client";

import Image from "next/image";
import { Fragment, useEffect, useRef } from "react";

/**
 * Стопка возможностей платформы (2888:17785).
 *
 * Механика как в референсе stack-cards.webflow.io: превью наслаиваются друг на
 * друга на липких позициях, а текст слева стоит на месте и целиком сменяется на
 * подпись той карточки, что сейчас наверху.
 *
 * Наслоение сделано на чистом CSS (`position: sticky` с нарастающим `top`),
 * поэтому оно не зависит от JS и не дёргается за колесом. JS нужен только
 * чтобы понять, какая карточка взяла верх, и переключить текст.
 *
 * ── Почему одна сетка, а не две колонки ─────────────────────────────────────
 * На мобильном макете (2888:17927) текст идёт НАД своим превью, на десктопе —
 * сбоку и с подменой. Чтобы не дублировать заголовки в разметке ради двух
 * раскладок, всё лежит в одной grid: в DOM порядок мобильный (текст, превью,
 * текст, превью…), а на lg тексты переезжают в первую колонку и занимают одну
 * и ту же ячейку на всю высоту секции, превью — во вторую, по строкам.
 *
 * ── Почему подмена написана на стилях, а не на состоянии React ───────────────
 * Переключение через `useState` работало, но применялось с заметной и плавающей
 * задержкой: обновление приходит из обработчика скролла, вне событий React, и
 * планировщик волен отложить перерисовку — на скролле это читается как «подпись
 * отстала от картинки». Здесь достаточно снять и вернуть прозрачность, поэтому
 * пишем напрямую в стиль, как это уже сделано в StackingCards. Разметка от
 * этого не зависит: без JS видна первая подпись, и это корректное состояние.
 */

export type FeatureStackItem = {
  title: string;
  text: string;
  preview: string;
};

/** Отступ липкой стопки от верха окна — фиксированная шапка (81px) плюс воздух. */
const STICKY_TOP = 120;
/** Насколько выглядывает край предыдущей карточки. */
const CARD_STEP = 44;
/**
 * Момент, когда карточка считается «взявшей верх» и текст слева сменяется:
 * её край опустился ниже липкой линии на эту долю собственной высоты, то есть
 * она закрыла больше половины предыдущей. Считаем от карточки, а не от высоты
 * окна, иначе на низком экране подмена уезжает относительно картинки.
 */
const TAKEOVER = 0.45;

export function FeatureStack({ items }: { items: FeatureStackItem[] }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-card]"));
    const texts = Array.from(root.querySelectorAll<HTMLElement>("[data-text]"));
    if (cards.length < 2 || texts.length !== cards.length) return;

    const desktop = window.matchMedia("(min-width: 1024px)");
    let shown = -1;

    const paint = (next: number) => {
      if (next === shown) return;
      shown = next;
      texts.forEach((text, i) => {
        const on = i === next;
        text.style.opacity = on ? "1" : "0";
        text.style.pointerEvents = on ? "" : "none";
        text.setAttribute("aria-hidden", on ? "false" : "true");
      });
    };

    const reset = () => {
      shown = -1;
      texts.forEach((text) => {
        text.style.opacity = "";
        text.style.pointerEvents = "";
        text.removeAttribute("aria-hidden");
      });
    };

    const update = () => {
      // Ниже lg подмены нет: текст и превью идут парами обычным потоком.
      if (!desktop.matches) {
        reset();
        return;
      }

      const line = STICKY_TOP + cards[0].offsetHeight * TAKEOVER;
      let next = 0;
      cards.forEach((card, i) => {
        if (card.getBoundingClientRect().top <= line) next = i;
      });
      paint(next);
    };

    /*
      Считаем синхронно в обработчике: браузер и так отдаёт не больше одного
      события скролла на кадр, а пять замеров стоят дёшево. Плюс одна проверка
      следующим кадром — на случай одиночного прыжка (переход по якорю,
      восстановление позиции при возврате «назад»), когда события скролла
      больше не будет, а липкие координаты к моменту обработчика ещё не
      пересчитаны.
    */
    let frame = 0;
    const onScroll = () => {
      update();
      if (!frame) {
        frame = requestAnimationFrame(() => {
          frame = 0;
          update();
        });
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    desktop.addEventListener("change", onScroll);
    update();

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      desktop.removeEventListener("change", onScroll);
      reset();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      /*
        Строки задаём явно: без них `grid-row: 1 / -1` у текстовой колонки
        схлопнулось бы в одну неявную строку, и текст перестал бы быть липким.
        Плюс одна строка сверху нормы — под распорку в конце.
      */
      style={{ "--rows": String(items.length + 1) } as React.CSSProperties}
      className="grid grid-cols-1 gap-24 lg:grid-cols-[minmax(0,1fr)_588px] lg:grid-rows-[repeat(var(--rows),auto)] lg:gap-x-40 lg:gap-y-[88px]"
    >
      {items.map((item, i) => (
        <Fragment key={item.title}>
          {/*
            Тексты занимают одну и ту же ячейку первой колонки на всю высоту
            секции, поэтому липкий блок внутри может ехать вдоль всей стопки.
          */}
          <div className="lg:col-start-1 lg:row-[1/-1]">
            <div
              data-text
              className={`lg:sticky lg:top-[160px] lg:transition-opacity lg:duration-500 motion-reduce:lg:transition-none ${
                i === 0 ? "" : "lg:opacity-0"
              }`}
            >
              <div className="flex flex-col gap-16 lg:max-w-[460px]">
                <h3 className="text-h4 font-medium text-text-primary md:text-h3">
                  {item.title}
                </h3>
                <p className="text-body-l text-text-secondary">{item.text}</p>
              </div>
            </div>
          </div>

          {/*
            Card / Product Preview (2281:36520) — в экспорте уже есть подложка,
            скругление и тень, поэтому обёртка не нужна.
          */}
          <div
            data-card
            style={
              {
                "--row": String(i + 1),
                "--top": `${STICKY_TOP + i * CARD_STEP}px`,
                zIndex: i + 1,
              } as React.CSSProperties
            }
            className="lg:sticky lg:top-[var(--top)] lg:col-start-2 lg:row-start-[var(--row)]"
          >
            <Image
              src={item.preview}
              alt={`Интерфейс GigaCowork: ${item.title.toLowerCase()}`}
              width={668}
              height={480}
              priority={i === 0}
              className="h-auto w-full"
            />
          </div>
        </Fragment>
      ))}

      {/*
        Пустая строка-распорка в конце. Липкий диапазон карточки ограничен
        контентной областью сетки, поэтому нижний padding его не удлинил бы:
        нужна именно строка. Без неё последняя карточка уезжает вверх, едва
        успев сесть на своё место.
      */}
      <div
        aria-hidden
        style={{ "--row": String(items.length + 1) } as React.CSSProperties}
        className="hidden lg:col-start-2 lg:row-start-[var(--row)] lg:block lg:h-[55vh]"
      />
    </div>
  );
}

export default FeatureStack;
