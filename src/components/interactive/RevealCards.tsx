"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Плавное появление карточек при скролле.
 *
 * Обёртка ничего не знает о секции: она находит внутри себя элементы по
 * `selector`, прячет их (opacity 0 + сдвиг вниз) и возвращает по одному, когда
 * блок входит во вьюпорт. Разметка секции не меняется — это тот же приём, что и
 * у HorizontalScrollCards / StackingCards / CountUp.
 *
 * Прогрессивное улучшение: пряток нет ни в HTML, ни в CSS — их ставит JS уже
 * после монтирования. Без JS и при `prefers-reduced-motion: reduce` карточки
 * просто отрисованы на месте, никакого «пустого экрана».
 */

/** Сдвиг, с которого карточка выезжает. */
const RISE = 24;
/** Длительность одной карточки. */
const DURATION = 600;
/** Задержка между соседними карточками. */
const STAGGER = 120;
/** Доля секции во вьюпорте, после которой отсчитывается задержка. */
const THRESHOLD = 0.35;
/**
 * Пауза между входом блока в кадр и стартом выезда.
 *
 * Без неё карточки начинали появляться, пока секция ещё едет вверх: два
 * движения складывались и выезд читался как рывок. Задержка даёт блоку встать
 * на место, и карточки появляются уже на неподвижном фоне.
 */
const START_DELAY = 380;

export type RevealCardsProps = {
  children: ReactNode;
  /** Что именно появляется. По умолчанию — карточки блока «частью команды». */
  selector?: string;
};

export function RevealCards({
  children,
  selector = "[data-part-of-team] article",
}: RevealCardsProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cards = Array.from(root.querySelectorAll<HTMLElement>(selector));
    if (!cards.length) return;

    // Если секция уже во вьюпорте на момент монтирования (прямой заход по
    // якорю, восстановление скролла), прятать нечего — показываем как есть.
    const rect = root.getBoundingClientRect();
    const alreadyVisible =
      rect.top < window.innerHeight * (1 - THRESHOLD) && rect.bottom > 0;
    if (alreadyVisible) return;

    cards.forEach((card, i) => {
      card.style.opacity = "0";
      card.style.transform = `translateY(${RISE}px)`;
      card.style.transition =
        `opacity ${DURATION}ms cubic-bezier(0.16,1,0.3,1) ${i * STAGGER}ms, ` +
        `transform ${DURATION}ms cubic-bezier(0.16,1,0.3,1) ${i * STAGGER}ms`;
      card.style.willChange = "opacity, transform";
    });

    const clear = () => {
      cards.forEach((card) => {
        card.style.opacity = "";
        card.style.transform = "";
        card.style.transition = "";
        card.style.willChange = "";
      });
    };

    const reveal = () => {
      cards.forEach((card) => {
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      });
      // Снимаем inline-стили после анимации, чтобы не мешать hover-эффектам
      // карточек (`.card-interactive` меняет box-shadow, а willChange на
      // transform создаёт лишний слой композитинга).
      window.setTimeout(clear, DURATION + STAGGER * cards.length + 50);
    };

    let startTimer = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            observer.disconnect();
            startTimer = window.setTimeout(reveal, START_DELAY);
          }
        }
      },
      { threshold: THRESHOLD }
    );
    observer.observe(root);

    return () => {
      observer.disconnect();
      window.clearTimeout(startTimer);
      clear();
    };
  }, [selector]);

  return <div ref={rootRef}>{children}</div>;
}

export default RevealCards;
