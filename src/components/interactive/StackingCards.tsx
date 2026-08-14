"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Stacking-scroll wrapper for "Как работают ИИ-агенты GigaCowork".
 *
 * Секция пиннится на весь экран, карточки выезжают снизу и складываются в
 * стопку: каждая садится на свой offset из Figma (2006:8925 — 214 / 254 / 294,
 * то есть 0 / 40 / 80 от верха стопки) и уменьшается до своего `--stack-scale`,
 * когда её накрывает следующая.
 *
 * Enhancement only — разметку секции не трогает, работает по хукам
 * `[data-stack-card]` / `[data-stack-list]`. Ниже `md`, при reduced-motion и на
 * низких экранах (стопка не помещается) всё остаётся обычным потоком.
 *
 * ── Почему шаг, а не привязка к скроллу ─────────────────────────────────────
 * Раньше положение карточки считалось напрямую от прогресса скролла. Пока путь
 * был длинным (640px на карточку) это читалось как плавное движение, но стоило
 * его сократить — и карточка стала повторять рывки колеса: сколько дёрнул, на
 * столько и прыгнула. Плавность там недостижима в принципе, потому что источник
 * движения — сам скролл, а он дискретный.
 *
 * Поэтому скролл больше не двигает карточку, а только ПЕРЕКЛЮЧАЕТ шаг. Каждая
 * карточка едет собственным CSS-переходом фиксированной длительности, то есть
 * одинаково плавно при любой скорости прокрутки. Пока переход не доиграл, шаг
 * не меняется — следующая карточка не может начать, пока предыдущая не села.
 */

/** Скролл, на котором стопка переключается на следующую карточку. */
const STEP = 220;
/** Пауза, на которой собранная стопка стоит перед уходом страницы дальше. */
const TAIL_HOLD = 260;
/** Длительность выезда одной карточки. */
const DURATION = 760;
/** Плавный выход без «пружины»: быстрый старт, мягкая посадка. */
const EASING = "cubic-bezier(0.33, 1, 0.68, 1)";
/** Запас снизу, чтобы карточка стартовала за краем экрана, а не от его границы. */
const ENTRY_GAP = 24;

export function StackingCards({ children }: { children: ReactNode }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outer = outerRef.current;
    const pin = pinRef.current;
    if (!outer || !pin) return;

    const cards = Array.from(
      outer.querySelectorAll<HTMLElement>("[data-stack-card]")
    );
    if (cards.length < 2) return;

    const list = cards[0].parentElement as HTMLElement | null;
    if (!list) return;

    const desktop = window.matchMedia("(min-width: 768px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const settled = cards.map((card, i) => {
      const cs = getComputedStyle(card);
      return {
        scale: parseFloat(cs.getPropertyValue("--stack-scale")) || 1,
        offset: parseFloat(cs.getPropertyValue("--stack-offset")) || i * 40,
      };
    });

    let active = false;
    let frame = 0;
    let distance = 0;
    let entry: number[] = [];

    /** Сколько карточек уже выложено: 0 — на экране только первая. */
    let step = 0;
    /** Идёт переход — шаг заморожен. */
    let busy = false;
    let timer = 0;

    const reset = () => {
      window.clearTimeout(timer);
      outer.style.height = "";
      pin.style.position = "";
      pin.style.top = "";
      pin.style.height = "";
      pin.style.overflow = "";
      list.style.position = "";
      list.style.height = "";
      list.style.display = "";
      cards.forEach((card) => {
        card.style.position = "";
        card.style.top = "";
        card.style.left = "";
        card.style.width = "";
        card.style.zIndex = "";
        card.style.transform = "";
        card.style.transformOrigin = "";
        card.style.transition = "";
        card.style.willChange = "";
      });
      active = false;
      busy = false;
      step = 0;
    };

    const measure = () => {
      reset();
      if (!desktop.matches || reduced.matches) return;

      // Пиннить имеет смысл, только если собранная стопка целиком влезает в экран.
      const stackHeight =
        cards[0].offsetHeight + settled[cards.length - 1].offset;
      const chrome = pin.offsetHeight - list.offsetHeight; // заголовок + отступы
      if (stackHeight + chrome > window.innerHeight) return;

      active = true;
      distance = (cards.length - 1) * STEP + TAIL_HOLD;

      outer.style.height = `${window.innerHeight + distance}px`;
      pin.style.position = "sticky";
      pin.style.top = "0px";
      pin.style.height = "100vh";
      pin.style.overflow = "hidden";

      // Список становится системой координат стопки.
      list.style.position = "relative";
      list.style.display = "block";
      list.style.height = `${stackHeight}px`;

      cards.forEach((card, i) => {
        card.style.position = "absolute";
        card.style.left = "0";
        card.style.width = "100%";
        card.style.top = `${settled[i].offset}px`;
        card.style.zIndex = String(i + 1);
        card.style.transformOrigin = "top center";
        card.style.willChange = "transform";
        card.style.transition = `transform ${DURATION}ms ${EASING}`;
      });

      /*
        Стартовая точка — за нижней кромкой пиннутого экрана. Позиция списка
        нужна ОТНОСИТЕЛЬНО пиннутого блока, а не окна: в момент measure() секция
        может быть где угодно на странице.
      */
      const listTop =
        list.getBoundingClientRect().top - pin.getBoundingClientRect().top;
      entry = settled.map(
        (s) => window.innerHeight + ENTRY_GAP - (listTop + s.offset)
      );

      // Начальное состояние ставим без анимации, иначе стопка «собирается» сама.
      step = wantedStep();
      paint(false);
      update();
    };

    const wantedStep = () => {
      const scrolled = Math.min(
        distance,
        Math.max(0, -outer.getBoundingClientRect().top)
      );
      return Math.min(cards.length - 1, Math.floor(scrolled / STEP));
    };

    /** Раскладывает карточки по текущему шагу. */
    const paint = (animated: boolean) => {
      cards.forEach((card, i) => {
        if (!animated) card.style.transition = "none";
        const shown = i <= step;
        const y = shown ? 0 : entry[i];
        // Карточка сжимается, когда следующая уже выложена.
        const scale = i < step ? settled[i].scale : 1;
        card.style.transform = `translate3d(0,${y}px,0) scale(${scale})`;
      });
      if (!animated) {
        // Форсируем пересчёт стилей до того, как вернём переходы.
        void cards[0].offsetHeight;
        cards.forEach((card) => {
          card.style.transition = `transform ${DURATION}ms ${EASING}`;
        });
      }
    };

    /*
      Один шаг за раз. Скролл может улететь сразу на три карточки вперёд — мы
      всё равно двигаемся по одной и ждём конца перехода, поэтому анимация
      всегда проигрывается целиком и ни одна карточка не «проскакивает».
    */
    const update = () => {
      if (!active || busy) return;
      const want = wantedStep();
      if (want === step) return;

      step += want > step ? 1 : -1;
      busy = true;
      paint(true);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        busy = false;
        update();
      }, DURATION);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    desktop.addEventListener("change", measure);
    reduced.addEventListener("change", measure);

    // Картинки и шрифты меняют высоту карточек — перемерить, когда они дойдут.
    document.fonts?.ready.then(measure).catch(() => {});
    measure();

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      desktop.removeEventListener("change", measure);
      reduced.removeEventListener("change", measure);
      reset();
    };
  }, []);

  return (
    <div ref={outerRef} className="relative">
      <div ref={pinRef} className="flex flex-col justify-center">
        {children}
      </div>
    </div>
  );
}

export default StackingCards;
