"use client";

import Image from "@/components/ui/Image";
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

/**
 * Отступ липкой стопки от верха окна: шапка сайта (81) плюс липкий заголовок
 * секции (≈150) плюс воздух. Заголовок остаётся на виду, пока едут карточки,
 * поэтому стопка начинается под ним, а не под одной шапкой.
 */
const STICKY_TOP = 248;
/**
 * Насколько выглядывает край предыдущей карточки. 36, а не 44: со сдвинутым
 * вниз началом стопки более крупный шаг уводил нижний край последней карточки
 * за пределы экрана высотой 900.
 */
const CARD_STEP = 36;
/**
 * Момент, когда карточка считается «взявшей верх» и текст слева сменяется:
 * её край опустился ниже липкой линии на эту долю собственной высоты, то есть
 * она закрыла больше половины предыдущей. Считаем от карточки, а не от высоты
 * окна, иначе на низком экране подмена уезжает относительно картинки.
 */
const TAKEOVER = 0.45;

/**
 * Схлопывание стопки после последней карточки.
 *
 * Когда «Запуск по расписанию или событию» встал на своё место, стопка ещё
 * какое-то время стоит прикреплённой — раньше в этот момент не происходило
 * ничего. Теперь на этом отрезке карточки синхронно подтягиваются снизу
 * вверх: шаг между всеми уменьшается от `CARD_STEP` до нуля, и в конце
 * последняя закрывает остальные целиком.
 *
 * Собираются к верхней границе стопки, а не к передней карточке: у карточки
 * `i` `top` уменьшается от `S + i·CARD_STEP` до `S`. Верхний край стопки
 * остаётся там же, где был всё время прокрутки, — она не съезжает вниз
 * относительно липкого заголовка секции и соседних блоков. Едет передняя
 * карточка и все, что под ней, кроме самой верхней: та уже стоит на `S`.
 *
 * Длину отрезка берём долей от распорки в конце сетки: это и есть тот запас
 * прокрутки, на котором стопка стоит прикреплённой. Остаток запаса стопка
 * едет уже собранной, прежде чем открепиться.
 */
const COLLAPSE_SHARE = 0.55;

/**
 * Тень карточки — Elevation/Drop/Lg (2888:17921) в записи для filter.
 *
 * Её носит только передняя карточка и те, что ещё въезжают снизу. У карточек,
 * которые уже ушли под стопку, тень снимается: их тени падали друг на друга и
 * на выступающие сверху полоски, пять слоёв складывались, и вокруг стопки
 * набиралась грязная серая кайма.
 */
const SHADOW = "drop-shadow(0 12px 24px #60738f33)";

export function FeatureStack({ items }: { items: FeatureStackItem[] }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-card]"));
    const texts = Array.from(root.querySelectorAll<HTMLElement>("[data-text]"));
    const shots = cards.map((card) => card.querySelector("img"));
    if (cards.length < 2 || texts.length !== cards.length) return;

    const desktop = window.matchMedia("(min-width: 1024px)");
    const spacer = root.querySelector<HTMLElement>("[data-spacer]");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    /** Позиция карточки в разложенной стопке. */
    const baseTop = (i: number) => STICKY_TOP + i * CARD_STEP;
    /** Где встаёт последняя карточка, когда стопка разложена целиком. */
    const settledTop = baseTop(cards.length - 1);

    /*
      Липкий заголовок секции живёт снаружи стопки, но открепиться должен вместе
      с ней: иначе стопка уезжает вверх, а заголовок ещё стоит.

      Момент открепления у липкого элемента — когда до низа общего контейнера
      остаётся ровно его высота плюс смещение сверху. У карточки это
      STICKY_TOP + её высота, у заголовка — top + его высота, и второе меньше,
      поэтому он и держится дольше. Разницу дописываем ему прозрачным хвостом
      снизу: липкий диапазон удлиняется на неё, и оба отрываются одновременно.

      Хвост гасится отрицательным отступом не у самого заголовка, а у обёртки
      стопки: собственный отрицательный margin вошёл бы в ту же границу, по
      которой считается открепление, и погасил бы прибавку.
    */
    const header =
      root
        .closest("section")
        ?.querySelector<HTMLElement>("[data-stack-header]") ?? null;
    /* Переменную держим на общем родителе — её читают и заголовок, и обёртка. */
    const scope = header?.parentElement ?? null;

    /*
      Тем же приёмом укорачивается липкий диапазон подписи слева.

      Подпись живёт в ячейке на всю высоту сетки, а низ у сетки дальше низа
      стопки: после карточек идёт строка-распорка. Из-за этого подпись
      отрывалась почти на 350 позже карточек и последняя из них — «Запуск по
      расписанию или событию» — оставалась висеть в пустоте, когда заголовок
      и стопка уже уехали.

      Хвост здесь — не отступ родителя, а собственный `padding-bottom`
      подписи: он входит в её габарит, по которому считается открепление, и
      при этом ничего не двигает — подпись прозрачная, а ячейка втрое выше.
    */
    const tailFor = (el: HTMLElement) => {
      const top = parseFloat(getComputedStyle(el).top) || 0;
      return Math.max(
        0,
        Math.round(STICKY_TOP + cards[0].offsetHeight - top - el.offsetHeight),
      );
    };

    const syncTail = () => {
      if (!desktop.matches) {
        scope?.style.removeProperty("--stack-tail");
        texts.forEach((text) => text.style.removeProperty("padding-bottom"));
        return;
      }

      // Сначала снимаем прошлый хвост, иначе он попадёт в замер высоты.
      texts.forEach((text) => {
        text.style.paddingBottom = "0px";
        text.style.paddingBottom = `${tailFor(text)}px`;
      });

      if (!header || !scope) return;
      scope.style.setProperty("--stack-tail", "0px");
      scope.style.setProperty("--stack-tail", `${tailFor(header)}px`);
    };

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
      /*
        Тень остаётся у передней карточки и у тех, что ещё идут снизу: они
        видны на фоне и отделяются от стопки. У закрытых карточек её нет —
        показывается только верхняя полоска, и тень там не нужна.
      */
      shots.forEach((shot, i) => {
        if (shot) shot.style.filter = i >= next ? SHADOW : "none";
      });
    };

    const reset = () => {
      shown = -1;
      texts.forEach((text) => {
        text.style.opacity = "";
        text.style.pointerEvents = "";
        text.removeAttribute("aria-hidden");
      });
      /* Хвост держится на инлайновом стиле — снимаем вместе с остальным. */
      if (!desktop.matches) {
        texts.forEach((text) => text.style.removeProperty("padding-bottom"));
      }
      /* Ниже lg стопки нет, карточки не перекрываются — тень у всех. */
      shots.forEach((shot) => {
        if (shot) shot.style.filter = "";
      });
      /* И раскладка возвращается к исходным позициям из разметки. */
      cards.forEach((card, i) =>
        card.style.setProperty("--top", `${baseTop(i)}px`),
      );
    };

    /**
     * Доля схлопывания, 0…1.
     *
     * Меряем по распорке, а не по самой карточке: та прикреплена, её `top`
     * перестаёт меняться ровно в тот момент, от которого нужно считать.
     * Распорка же едет вместе со страницей всё время.
     *
     * Ноль отсчёта — положение распорки в тот миг, когда последняя карточка
     * встала на место: это её `top` плюс высота карточки и вертикальный зазор
     * сетки.
     */
    const collapseProgress = () => {
      if (!spacer || reduceMotion.matches) return 0;
      const span = spacer.offsetHeight * COLLAPSE_SHARE;
      if (span <= 0) return 0;
      const gap = parseFloat(getComputedStyle(root).rowGap) || 0;
      const anchor = settledTop + cards[cards.length - 1].offsetHeight + gap;
      const past = anchor - spacer.getBoundingClientRect().top;
      return Math.max(0, Math.min(1, past / span));
    };

    /*
      Шаг между карточками тает от CARD_STEP до нуля — синхронно у всех.
      Цель у всех одна, STICKY_TOP: стопка собирается вверх, к своей верхней
      границе, а не вниз к передней карточке.
    */
    const layout = (t: number) => {
      cards.forEach((card, i) => {
        const top =
          t <= 0 ? baseTop(i) : baseTop(i) + (STICKY_TOP - baseTop(i)) * t;
        card.style.setProperty("--top", `${top}px`);
      });
    };

    const update = () => {
      // Ниже lg подмены нет: текст и превью идут парами обычным потоком.
      if (!desktop.matches) {
        reset();
        return;
      }

      const t = collapseProgress();
      layout(t);

      /*
        Пока стопка схлопывается, карточки едут вниз, и их край снова
        оказывается выше линии подмены — без этой оговорки подпись слева
        перескочила бы назад на предпоследний пункт. Сложилась стопка —
        значит, верх за последней карточкой.
      */
      if (t > 0) {
        paint(cards.length - 1);
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

    /* Хвост зависит от размеров, а не от прокрутки — пересчитываем по resize. */
    const onResize = () => {
      syncTail();
      onScroll();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    desktop.addEventListener("change", onResize);
    reduceMotion.addEventListener("change", onResize);
    syncTail();
    update();

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      desktop.removeEventListener("change", onResize);
      reduceMotion.removeEventListener("change", onResize);
      scope?.style.removeProperty("--stack-tail");
      cards.forEach((card) => card.style.removeProperty("--top"));
      texts.forEach((text) => text.style.removeProperty("padding-bottom"));
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
      className="grid grid-cols-1 gap-24 lg:grid-cols-[minmax(0,1fr)_680px] lg:grid-rows-[repeat(var(--rows),auto)] lg:gap-x-40 lg:gap-y-[88px]"
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
              className={`lg:sticky lg:top-[288px] lg:transition-opacity lg:duration-500 motion-reduce:lg:transition-none ${
                i === 0 ? "" : "lg:opacity-0"
              }`}
            >
              <div className="flex flex-col gap-12 lg:max-w-[380px]">
                <h3 className="text-h4 font-medium text-text-primary md:text-h3">
                  {item.title}
                </h3>
                <p className="text-body-m text-text-secondary">{item.text}</p>
              </div>
            </div>
          </div>

          {/*
            Card / Product Preview (2281:36520). В экспорте есть подложка и
            скругление (углы вырезаны прозрачностью), а тени нет — она из
            макета, Elevation/Drop/Lg (2888:17921).

            Тень висит фильтром на самой картинке, а не box-shadow на обёртке:
            фильтр повторяет вырезанный контур, поэтому скругление совпадает на
            любой ширине. Обёртке пришлось бы задавать радиус числом, а он у
            картинки меняется вместе с масштабом — 24px на 680 и вдвое меньше
            на мобильной.

            0 12px 24px — это тот же Elevation/Drop/Lg в записи для filter:
            у drop-shadow нет spread, и радиус вдвое меньше, чем у box-shadow
            (0 12px 48px −8px).
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
              className="h-auto w-full drop-shadow-[0_12px_24px_#60738f33]"
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
        data-spacer
        style={{ "--row": String(items.length + 1) } as React.CSSProperties}
        className="hidden lg:col-start-2 lg:row-start-[var(--row)] lg:block lg:h-[55vh]"
      />
    </div>
  );
}

export default FeatureStack;
