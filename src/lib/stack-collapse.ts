/**
 * Сборка липкой стопки в конце скролл-стори.
 *
 * Общая механика для всех трёх стопок сайта: `FeatureStack` («Возможности
 * платформы» на /ai-platform), `StickyScenarios` (подстраницы «О платформе») и
 * `ScenarioStack` («Применение» на страницах ролей). Раньше каждая из них
 * заканчивалась одинаково: последняя карточка вставала на место, и дальше до
 * открепления стопка просто стояла. Теперь на этом отрезке карточки синхронно
 * подтягиваются снизу вверх — шаг между ними тает от `cardStep` до нуля, и в
 * конце последняя закрывает остальные целиком.
 *
 * Собираются к верхней границе стопки, а не к передней карточке: у карточки
 * `i` `top` уменьшается от `S + i·cardStep` до `S`. Верхний край остаётся там
 * же, где был всё время прокрутки, — стопка не съезжает вниз относительно
 * соседних блоков и липкого заголовка секции. Едет передняя карточка и все,
 * что под ней, кроме самой верхней: та уже стоит на `S`.
 *
 * Отдельный модуль, а не копия в каждом компоненте: три файла и так живут
 * параллельно, и разъехавшаяся у них механика — вопрос времени.
 */

/**
 * Какую долю распорки в конце сетки занимает сборка.
 *
 * Распорка — это и есть запас прокрутки, на котором стопка стоит
 * прикреплённой. Остаток запаса стопка едет уже собранной, прежде чем
 * открепиться.
 */
const COLLAPSE_SHARE = 0.55;

export type StackCollapse = {
  /**
   * Доля сборки, 0…1. Ноль — стопка разложена, единица — собрана.
   * При `prefers-reduced-motion: reduce` всегда 0.
   */
  progress(): number;
  /** Расставляет `--top` по доле сборки. `0` возвращает исходные позиции. */
  layout(t: number): void;
  /** Снимает инлайновый `--top` — позиции снова берутся из разметки. */
  clear(): void;
  /** Медиазапрос уменьшенного движения: на него нужно подписаться снаружи. */
  reduceMotion: MediaQueryList;
};

export function createStackCollapse({
  root,
  cards,
  stickyTop,
  cardStep,
}: {
  /** Контейнер стопки — в нём ищется распорка `[data-spacer]`. */
  root: HTMLElement;
  /** Карточки стопки по порядку. */
  cards: HTMLElement[];
  /** Отступ первой карточки от верха окна. */
  stickyTop: number;
  /** Насколько выглядывает край предыдущей карточки. */
  cardStep: number;
}): StackCollapse {
  const spacer = root.querySelector<HTMLElement>("[data-spacer]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /** Позиция карточки в разложенной стопке. */
  const baseTop = (i: number) => stickyTop + i * cardStep;
  /** Где встаёт последняя карточка, когда стопка разложена целиком. */
  const settledTop = baseTop(cards.length - 1);

  return {
    reduceMotion,

    /*
      Меряем по распорке, а не по самой карточке: та прикреплена, её `top`
      перестаёт меняться ровно в тот момент, от которого нужно считать.
      Распорка же едет вместе со страницей всё время.

      Ноль отсчёта — положение распорки в тот миг, когда последняя карточка
      встала на место: это её `top` плюс высота карточки и вертикальный зазор
      сетки.
    */
    progress() {
      if (!spacer || reduceMotion.matches) return 0;
      const span = spacer.offsetHeight * COLLAPSE_SHARE;
      if (span <= 0) return 0;
      const gap = parseFloat(getComputedStyle(root).rowGap) || 0;
      const anchor = settledTop + cards[cards.length - 1].offsetHeight + gap;
      const past = anchor - spacer.getBoundingClientRect().top;
      return Math.max(0, Math.min(1, past / span));
    },

    layout(t: number) {
      cards.forEach((card, i) => {
        const top =
          t <= 0 ? baseTop(i) : baseTop(i) + (stickyTop - baseTop(i)) * t;
        card.style.setProperty("--top", `${top}px`);
      });
    },

    clear() {
      cards.forEach((card) => card.style.removeProperty("--top"));
    },
  };
}
