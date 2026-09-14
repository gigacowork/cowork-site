"use client";

import { Fragment, useEffect, useRef } from "react";
import type { ReactNode } from "react";

import { asset } from "@/lib/asset";

/**
 * Липкая стопка сценариев подстраниц «О платформе».
 *
 * Механика — ровно та же, что в «Применении» на страницах «Для кого»
 * (`src/components/use-cases/ScenarioStack.tsx`): превью наслаиваются друг на
 * друга на липких позициях с нарастающим `top`, текст слева стоит на месте и
 * целиком сменяется на подпись верхней карточки. Константы перенесены оттуда
 * без изменений.
 *
 * Отдельный файл, а не переиспользование `ScenarioStack`: тот завязан на тип
 * `UseCaseScenario` и на готовые кадры ролей из `scenario-previews`, а здесь
 * приходят произвольные узлы и градиентные заглушки вместо скриншотов.
 * Разводить их шаблоном значило бы переписывать компонент, от которого зависят
 * восемь живых страниц. **Правку механики нужно вносить в оба файла.**
 *
 * Используется на /ai-platform/workspace (3657:4896) и /ai-platform/agents
 * (3671:26882).
 *
 * Наслоение — чистый CSS (`position: sticky`), JS только решает, какая карточка
 * взяла верх, и переключает текст. Подмена пишется прямо в стиль, а не через
 * состояние React: обновление из обработчика скролла планировщик волен
 * отложить, и на прокрутке это читается как «подпись отстала от картинки».
 */

export type StickyScenario = {
  title: ReactNode;
  /**
   * Описание — готовые <p>, а не массив узлов: массив React проверяет на
   * уникальные `key`, и на каждый абзац прилетало предупреждение. Отбивку
   * между абзацами (16 по макету, а не пустая строка) держит обёртка ниже.
   */
  body: ReactNode;
  /** Маркированный список под описанием. Нет — блок не рисуется. */
  effects?: string[];
  /** Класс-заливка слота Image Slot (2276:15336) — у каждого сценария своя. */
  gradient: string;
  /**
   * Кадр интерфейса в слоте. Нет — остаётся одна заливка: так слот выглядел,
   * пока не было исходников, и так же он работает для сценариев без картинки.
   */
  image?: string;
};

/** Шапка сайта (81) плюс воздух. */
const STICKY_TOP = 140;
/** Насколько выглядывает край предыдущей карточки. */
const CARD_STEP = 32;
/** Текст держится чуть ниже верхнего края карточки. */
const TEXT_TOP = STICKY_TOP + 24;
/**
 * Момент подмены подписи: край карточки опустился ниже липкой линии на эту
 * долю её высоты, то есть она закрыла больше половины предыдущей. Считаем от
 * карточки, а не от окна, иначе на низком экране подмена уезжает от картинки.
 */
const TAKEOVER = 0.45;

/**
 * Тень карточки — Elevation/Drop/Lg, та же, что в разметке.
 *
 * Носят её только передняя карточка и те, что ещё идут снизу. У карточек,
 * ушедших под стопку, тень снимается: тени падали бы друг на друга и на
 * выступающие сверху полоски и давали вокруг стопки грязную серую кайму.
 */
const SHADOW = "0 12px 48px -8px #60738f33";

export function StickyScenarios({ items }: { items: StickyScenario[] }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-card]"));
    const texts = Array.from(root.querySelectorAll<HTMLElement>("[data-text]"));
    const surfaces = cards.map((card) =>
      card.querySelector<HTMLElement>("[data-surface]"),
    );
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
      surfaces.forEach((surface, i) => {
        // Тень стопки — только для пустых слотов: у кадра она своя, внутри
        // файла, и вторая ложилась бы прямоугольником вокруг картинки.
        if (surface && surface.tagName !== "IMG") {
          surface.style.boxShadow = i >= next ? SHADOW : "none";
        }
      });
    };

    const reset = () => {
      shown = -1;
      texts.forEach((text) => {
        text.style.opacity = "";
        text.style.pointerEvents = "";
        text.removeAttribute("aria-hidden");
      });
      /* Ниже lg стопки нет, карточки не перекрываются — тень у всех. */
      surfaces.forEach((surface) => {
        if (surface) surface.style.boxShadow = "";
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
      Считаем синхронно в обработчике: браузер отдаёт не больше одного события
      скролла на кадр, а три замера стоят дёшево. Плюс проверка следующим
      кадром — на случай одиночного прыжка (переход по якорю, восстановление
      позиции при возврате «назад»), когда события скролла больше не будет.
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
        схлопнулось бы в одну неявную строку и текст перестал бы быть липким.
        Плюс одна строка сверху нормы — под распорку в конце.
      */
      style={{ "--rows": String(items.length + 1) } as React.CSSProperties}
      /*
        Колонки те же, что в «Применении» на страницах ролей: текст — 30%
        ширины контейнера (360 на 1200), зазор 132, превью забирает остаток —
        708. В макете пара 532 + 588 при зазоре 80, но по просьбе масштаб
        карточек приведён к сценариям, а там превью крупнее.

        Доли и `1fr` вместо двух жёстких колонок заодно чинят промежуточные
        ширины: на 1024–1439 контейнер уже 1200, и пара фиксированных колонок
        выехала бы за край.

        Ниже lg сетка одноколоночная, шаг 40 (текст → своё превью). Разрыв
        между сценариями (80 в макете) добирается отступом снизу у превью:
        одним gap не обойтись, величины разные.
      */
      className="grid grid-cols-1 gap-40 lg:grid-cols-[30%_1fr] lg:grid-rows-[repeat(var(--rows),auto)] lg:gap-x-[132px] lg:gap-y-96"
    >
      {items.map((item, i) => (
        <Fragment key={i}>
          {/*
            Тексты занимают одну и ту же ячейку первой колонки на всю высоту
            секции, поэтому липкий блок внутри может ехать вдоль всей стопки.
          */}
          <div className="lg:col-start-1 lg:row-[1/-1]">
            <div
              data-text
              className={`flex flex-col items-start gap-24 lg:sticky lg:top-[var(--text-top)] lg:transition-opacity lg:duration-500 motion-reduce:lg:transition-none ${
                i === 0 ? "" : "lg:opacity-0"
              }`}
              style={{ "--text-top": `${TEXT_TOP}px` } as React.CSSProperties}
            >
              <h3 className="text-h3 font-medium text-text-primary">
                {item.title}
              </h3>
              <div className="flex flex-col gap-16 text-body-l text-text-secondary">
                {item.body}
              </div>

              {/* Effects List (3649:3156) — точка 8 в боксе 24 + Body/L */}
              {item.effects ? (
                <ul className="flex flex-col gap-12">
                  {item.effects.map((effect) => (
                    <li key={effect} className="flex items-center gap-8">
                      <span
                        aria-hidden
                        className="flex size-[24px] shrink-0 items-center justify-center"
                      >
                        <span className="size-[8px] rounded-full bg-icon-primary" />
                      </span>
                      <span className="flex-1 text-body-l text-text-secondary">
                        {effect}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>

          {/*
            Card / Product Preview (3502:19071). В макете внутри карточки пустой
            Image Slot — скриншота интерфейса на неё ещё нет, поэтому здесь ровно
            то же, что в макете: заливка, скругление 24 и тень Elevation/Drop/Lg.
            Когда кадры появятся, картинка кладётся внутрь этого блока.
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
            className={`lg:sticky lg:top-[var(--top)] lg:col-start-2 lg:row-start-[var(--row)] lg:mb-0 ${
              i < items.length - 1 ? "mb-40" : ""
            }`}
          >
            {item.image ? (
              /*
                Кадр подменяет слот целиком, а не ложится внутрь него: заливка
                и скругление у кадра свои, нарисованные в исходнике, углы
                вырезаны прозрачностью. Если оставить их и у слота,
                получается карточка в карточке.

                Разметка такая же, как у такой же стопки на страницах
                ролей (`ScenarioStack`): высоту задаёт сам кадр, а не коробка
                с фиксированной пропорцией. Исходники — 1176×800, то есть
                ровно два макетных слота 588×400, поэтому карточка
                совпадает с макетом и с карточкой на страницах ролей.
                Тень — фильтром: он идёт по контуру альфа-канала
                и повторяет скругление на любой ширине.
              */
              <img
                src={asset(item.image)}
                alt=""
                aria-hidden
                data-surface
                width={588}
                height={400}
                loading="lazy"
                decoding="async"
                className="h-auto w-full drop-shadow-[0_12px_24px_#60738f33]"
              />
            ) : (
              <div
                aria-hidden
                data-surface
                className={`aspect-[358/260] w-full rounded-[24px] shadow-drop-lg lg:aspect-[588/400] ${item.gradient}`}
              />
            )}
          </div>
        </Fragment>
      ))}

      {/*
        Пустая строка-распорка. Липкий диапазон карточки ограничен контентной
        областью сетки, поэтому нижний padding его не удлинит — нужна именно
        строка. Без неё последняя карточка уезжает вверх, едва успев сесть.
      */}
      <div
        aria-hidden
        style={{ "--row": String(items.length + 1) } as React.CSSProperties}
        className="hidden lg:col-start-2 lg:row-start-[var(--row)] lg:block lg:h-[45vh]"
      />
    </div>
  );
}

export default StickyScenarios;
