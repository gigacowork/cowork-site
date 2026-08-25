"use client";

import { Fragment, useEffect, useRef } from "react";
import Image from "@/components/ui/Image";
import { Lines, Paragraphs } from "@/components/use-cases/Lines";
import { getScenarioPreview } from "@/lib/scenario-previews";
import type { UseCaseScenario } from "@/lib/use-cases";

/**
 * «Какие задачи ИИ-агенты решают прямо сейчас».
 * Figma desktop: 2616:11235 (один сценарий) + 2787:16163 (все три — «доп
 *   карточки для анимации»): текст 480 слева, превью 588×400 справа с отступом
 *   612, ряды через 96
 * Figma mobile:  2656:11558 (текст, под ним превью 358, ряды через 80)
 *
 * Механика та же, что в «Возможностях платформы» (FeatureStack): превью
 * наслаиваются на липких позициях с нарастающим `top`, а текст слева стоит на
 * месте и целиком сменяется на подпись верхней карточки. В макете все три ряда
 * нарисованы подряд — Figma не умеет показывать липкость, поэтому «доп
 * карточки» и лежат отдельным фреймом.
 *
 * Наслоение — чистый CSS (`position: sticky`), JS только решает, какая карточка
 * взяла верх, и переключает текст. Подмена пишется прямо в стиль, а не через
 * состояние React: обновление из обработчика скролла планировщик волен
 * отложить, и на прокрутке это читается как «подпись отстала от картинки».
 */

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

/** Заливка превью (2616:11258) — Gradient/Omni/Neuton_Light. */
const PREVIEW_GRADIENT =
  "bg-[linear-gradient(48.74deg,#c5f8e5_0.95%,#caf5ff_50.8%,#cfedff_101.64%)]";

/**
 * Тень карточки — Elevation/Drop/Lg, та же, что в разметке.
 *
 * Носят её только передняя карточка и те, что ещё идут снизу. У карточек,
 * ушедших под стопку, тень снимается: пять теней падали друг на друга и на
 * выступающие сверху полоски, складывались и давали вокруг стопки грязную
 * серую кайму. Так же сделано в FeatureStack на «О платформе».
 */
const SHADOW = "0 12px 48px -8px #60738f33";
/*
  Та же тень в записи для filter: у drop-shadow нет spread, а радиус вдвое
  меньше, чем у box-shadow.
*/
const IMAGE_SHADOW = "drop-shadow(0 12px 24px #60738f33)";

export function ScenarioStack({
  items,
  slug,
}: {
  items: UseCaseScenario[];
  /** Роль — по ней берутся готовые кадры из `scenario-previews`. */
  slug: string;
}) {
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
      /*
        Тень остаётся у передней карточки и у тех, что ещё идут снизу: они
        видны на фоне и должны отделяться от него. У закрытых карточек её нет —
        от них видна только верхняя полоска, и тень там лишняя.
      */
      surfaces.forEach((surface, i) => {
        if (!surface) return;
        /*
          У заглушки скругление задано стилем — годится box-shadow. У готового
          кадра оно запечено в альфу картинки, и тень должна идти по контуру,
          поэтому там фильтр.
        */
        if (surface.tagName === "IMG") {
          surface.style.filter = i >= next ? IMAGE_SHADOW : "none";
        } else {
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
        if (!surface) return;
        surface.style.boxShadow = "";
        surface.style.filter = "";
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
        Ниже lg сетка одноколоночная и шаг между ячейками — 32 (текст → своё
        превью). Разрыв между сценариями (80 в макете) добирается отступом снизу
        у превью: сделать это одним gap нельзя, у них разные величины.
      */
      /*
        Текстовая колонка — 30% ширины контейнера (360 на 1200 против 480 в
        макете), зазор — те же 132, а превью забирает весь остаток: 708 вместо
        588. Кадры выгружены в 1176×800, то есть двойными к макетным 588×400, —
        на 708 они всё ещё выводятся с запасом плотности.

        Доли и `1fr` вместо двух жёстких колонок заодно чинят промежуточные
        ширины: сумма 480 + 588 не влезала в контейнер на 1024–1199, и страница
        ехала вбок (на 1024 — на 116px). Теперь обе колонки сжимаются вместе с
        контейнером.
      */
      className="grid grid-cols-1 gap-32 lg:grid-cols-[30%_1fr] lg:grid-rows-[repeat(var(--rows),auto)] lg:gap-x-[132px] lg:gap-y-96"
    >
      {items.map((item, i) => (
        <Fragment key={item.title}>
          <div className="lg:col-start-1 lg:row-[1/-1]">
            <div
              data-text
              /*
                В макете ниже lg текст стоял по центру (2656:11565) — по
                просьбе выключка левая на всех ширинах, как у остального текста
                вне карточек на страницах «Для кого».
              */
              className={`flex flex-col items-start gap-24 text-left lg:sticky lg:top-[var(--text-top)] lg:transition-opacity lg:duration-500 motion-reduce:lg:transition-none ${
                i === 0 ? "" : "lg:opacity-0"
              }`}
              style={{ "--text-top": `${TEXT_TOP}px` } as React.CSSProperties}
            >
              <h3 className="text-h4 font-medium text-text-primary md:text-h3">
                <Lines text={item.title} />
              </h3>
              <p className="text-body-l text-text-secondary">
                <Paragraphs items={item.paragraphs} />
              </p>
              {/* Effects List (2616:11246) — маркер-точка 24 + Body/M */}
              <ul className="flex flex-col gap-12">
                {item.effects.map((effect) => (
                  <li
                    key={effect}
                    className="flex items-center justify-start gap-8"
                  >
                    {/*
                      Маркер из макета — точка 8px в боксе 24px (390:1185), а не
                      list-style: у пункта высота строки 24, и центр точки должен
                      совпадать с центром первой строки.
                    */}
                    <span
                      aria-hidden
                      className="flex size-[24px] shrink-0 items-center justify-center"
                    >
                      <span className="size-[8px] rounded-full bg-icon-primary" />
                    </span>
                    <span className="text-body-m text-text-secondary lg:flex-1">
                      {effect}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Media Container (2616:11257) */}
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
              i < items.length - 1 ? "mb-48" : ""
            }`}
          >
            {(() => {
              const preview = getScenarioPreview(slug, i);
              /*
                Готовый кадр — цельная карточка: градиент, обводка и скругления
                запечены в файл, углы вырезаны прозрачностью. Поэтому подложка
                заглушки к нему не применяется, а тень висит фильтром: он идёт
                по контуру альфа-канала и повторяет скругление на любой ширине.
                Так же сделано в FeatureStack на «О платформе».
              */
              return preview?.asset ? (
                <Image
                  data-surface
                  src={preview.asset}
                  alt={preview.alt}
                  width={588}
                  height={400}
                  priority={i === 0}
                  className="h-auto w-full drop-shadow-[0_12px_24px_#60738f33]"
                />
              ) : (
                <div
                  aria-hidden
                  data-surface
                  className={`aspect-[588/400] w-full rounded-[20px] border border-border-subtle shadow-drop-lg ${PREVIEW_GRADIENT}`}
                />
              );
            })()}
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

export default ScenarioStack;
