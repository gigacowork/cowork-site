"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Проигрывание иллюстраций в «Безлимитном количестве токенов».
 *
 * Раскладка слоёв живёт в CSS (globals.css, блок `[data-token-art]`), здесь
 * только переключение состояний:
 *
 *  • `is-js`      — включает стартовое, сложенное состояние. Вешается скриптом,
 *                   поэтому без JS слои просто нарисованы на месте;
 *  • `is-playing` — раскладывает стопку.
 *
 * Логика состояний:
 *  – по умолчанию слои сложены и остаются такими, пока карточка не перешла
 *    половину экрана или на неё не навели мышь;
 *  – повторное наведение ничего не перезапускает: разложенная стопка просто
 *    остаётся разложенной;
 *  – при обратном скролле, когда карточка уходит ниже половины экрана, слои
 *    складываются обратно тем же переходом — и следующий проход вниз снова
 *    показывает анимацию.
 */

/** Доля карточки во вьюпорте, на которой стопка раскладывается и складывается. */
const PLAY_RATIO = 0.5;

export function TokenIllustrations({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const arts = Array.from(
      root.querySelectorAll<HTMLElement>("[data-token-art]")
    );
    if (!arts.length) return;

    arts.forEach((art) => art.classList.add("is-js"));

    const cleanups: Array<() => void> = [];

    // Триггер 1 — половина экрана. Он же складывает стопку на обратном ходу.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const art = entry.target as HTMLElement;
          art.classList.toggle(
            "is-playing",
            entry.intersectionRatio >= PLAY_RATIO
          );
        });
      },
      { threshold: [0, PLAY_RATIO] }
    );
    arts.forEach((art) => observer.observe(art));
    cleanups.push(() => observer.disconnect());

    // Триггер 2 — наведение на карточку целиком, а не только на картинку.
    // Только раскладывает; если стопка уже разложена, ничего не происходит.
    arts.forEach((art) => {
      const card = art.closest<HTMLElement>("[data-token-card]") ?? art;
      const onEnter = () => art.classList.add("is-playing");
      card.addEventListener("mouseenter", onEnter);
      cleanups.push(() => card.removeEventListener("mouseenter", onEnter));
    });

    return () => {
      cleanups.forEach((fn) => fn());
      arts.forEach((art) => art.classList.remove("is-js", "is-playing"));
    };
  }, []);

  return <div ref={rootRef}>{children}</div>;
}

export default TokenIllustrations;
