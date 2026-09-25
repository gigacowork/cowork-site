"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { createStackCollapse } from "@/lib/stack-collapse";

/**
 * Липкая стопка блока «Как работают ИИ-агенты GigaCowork» на главной.
 *
 * Механика — та же, что у скролл-стори на подстраницах «О платформе»
 * (`StickyScenarios`), на страницах ролей (`ScenarioStack`) и в «Возможностях
 * платформы» (`FeatureStack`): карточки стоят на липких позициях с нарастающим
 * `top`, каждая следующая наезжает на предыдущую и оставляет от неё полоску в
 * `CARD_STEP`, а в конце стопка синхронно собирается — шаг тает до нуля, и
 * последняя карточка закрывает остальные целиком. Сборка вынесена в общий
 * `src/lib/stack-collapse.ts`, чтобы четыре стопки сайта не разъехались.
 *
 * Раньше здесь была своя механика из прототипа 2006:8925: карточки
 * прикалывались с уменьшением масштаба, между ними вставлялись распорки, а
 * заголовок секции ехал липким над стопкой. По просьбе блок приведён к
 * остальным страницам, поэтому от неё остались только хуки в разметке.
 *
 * Наслоение — чистый CSS (`position: sticky`), JS считает только сборку в
 * конце и снимает тень с закрытых карточек. Ниже lg и при
 * `prefers-reduced-motion: reduce` стопки нет: карточки идут обычным потоком.
 */

/** Шапка сайта (81) плюс воздух — как в StickyScenarios. */
const STICKY_TOP = 140;
/** Насколько выглядывает край предыдущей карточки. */
const CARD_STEP = 32;

/** Тень карточки — Elevation/Drop/Lg, та же, что в разметке. */
const SHADOW = "0 12px 48px -8px #60738f33";

export function StackingCards({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const cards = Array.from(
      root.querySelectorAll<HTMLElement>("[data-stack-card]"),
    );
    if (cards.length < 2) return;

    const list = cards[0].parentElement as HTMLElement | null;
    if (!list) return;

    const desktop = window.matchMedia("(min-width: 1024px)");
    const collapse = createStackCollapse({
      root: list,
      cards,
      stickyTop: STICKY_TOP,
      cardStep: CARD_STEP,
    });

    /** Какая карточка сейчас верхняя — по ней раздаём тени. */
    let shown = -1;

    /*
      Тень остаётся у передней карточки и у тех, что ещё идут снизу: они видны
      целиком и должны отделяться от фона. У закрытых карточек её нет — от них
      видна только полоска сверху, и тени там складывались в грязную кайму.
      Так же сделано в StickyScenarios, ScenarioStack и FeatureStack.
    */
    const paint = (next: number) => {
      if (next === shown) return;
      shown = next;
      cards.forEach((card, i) => {
        card.style.boxShadow = i >= next ? SHADOW : "none";
      });
    };

    const reset = () => {
      shown = -1;
      cards.forEach((card) => {
        card.style.boxShadow = "";
      });
      collapse.layout(0);
    };

    const update = () => {
      if (!desktop.matches) {
        reset();
        return;
      }

      const t = collapse.progress();
      collapse.layout(t);

      /*
        Пока стопка собирается, карточки едут вверх и край каждой снова
        оказывается выше липкой линии — без этой оговорки тень перескакивала бы
        назад на предпоследнюю карточку.
      */
      if (t > 0) {
        paint(cards.length - 1);
        return;
      }

      /*
        Верхняя карточка — последняя, чей край уже поднялся к своей липкой
        линии. Считаем от самой карточки, а не от окна: на низком экране
        подмена уезжала бы от картинки.
      */
      let top = 0;
      cards.forEach((card, i) => {
        if (card.getBoundingClientRect().top <= STICKY_TOP + i * CARD_STEP + 1)
          top = i;
      });
      paint(top);
    };

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
    collapse.reduceMotion.addEventListener("change", onScroll);
    update();

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      desktop.removeEventListener("change", onScroll);
      collapse.reduceMotion.removeEventListener("change", onScroll);
      reset();
      /* Последним: `reset` возвращает исходные `--top`, здесь они уже не нужны. */
      collapse.clear();
    };
  }, []);

  return <div ref={rootRef}>{children}</div>;
}

export default StackingCards;
