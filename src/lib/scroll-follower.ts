/**
 * Плавное следование за прокруткой.
 *
 * Зачем. Эффекты, привязанные к позиции прокрутки, повторяют её характер: с
 * трекпада значения приходят мелким шагом и всё едет гладко, а колесо мыши
 * отдаёт прокрутку рывками по 100+ пикселей за щелчок — и карточки прыгают
 * ровно так же. Сгладить сам скролл нельзя, зато можно не привязывать
 * анимацию к нему намертво.
 *
 * Как. Заводится «догоняющая» позиция: каждый кадр она проходит долю пути до
 * настоящей. Наружу отдаётся не она сама, а отставание `lag` — на сколько
 * пикселей анимация отстала от страницы. Дальше эффект просто прибавляет его
 * к своим замерам: `rect.top + lag` — это положение элемента таким, каким оно
 * было мгновение назад. Рывок в 100 пикселей превращается в ход за 5–6
 * кадров, а на трекпаде отставание почти нулевое и ничего не меняется.
 *
 * Цикл не крутится вхолостую: он засыпает, как только догнал страницу, и
 * будится обратно на прокрутке. При «уменьшить движение» сглаживания нет —
 * `lag` всегда 0.
 */

/** Доля пути до цели за кадр при 60 к/с. Больше — жёстче привязка к скроллу. */
const SMOOTHING = 0.18;

/** Ближе этого расстояния (px) считаем, что догнали. */
const EPSILON = 0.4;

export type ScrollFollower = {
  /** Разбудить цикл — вызывается на прокрутке. */
  kick: () => void;
  /** Приравнять догоняющую позицию к текущей: после пересчёта раскладки. */
  sync: () => void;
  stop: () => void;
};

export function createScrollFollower(
  /** Отрисовка кадра. `lag` — отставание анимации от страницы в пикселях. */
  render: (lag: number) => void,
  smoothing: number = SMOOTHING,
): ScrollFollower {
  let smooth = window.scrollY;
  let frame = 0;
  let prev = 0;
  let idle = 0;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  const step = (time: number) => {
    frame = 0;

    /*
      Шаг считается от реальной длительности кадра, а не от их числа: иначе на
      экране 120 Гц догон идёт вдвое быстрее, чем на 60 Гц.
    */
    const dt = prev ? Math.min(64, time - prev) : 1000 / 60;
    prev = time;

    const target = window.scrollY;

    if (reduced.matches) {
      smooth = target;
    } else {
      smooth +=
        (target - smooth) * (1 - Math.pow(1 - smoothing, dt / (1000 / 60)));
      if (Math.abs(target - smooth) < EPSILON) smooth = target;
    }

    render(target - smooth);

    if (smooth === target) {
      /*
        Пара холостых кадров после остановки: скролл мог прийти уже после
        того, как кадр посчитан, и цикл лучше гасить не в тот же миг.
      */
      idle += 1;
      if (idle > 2) {
        prev = 0;
        return;
      }
    } else {
      idle = 0;
    }

    frame = requestAnimationFrame(step);
  };

  return {
    kick() {
      idle = 0;
      if (!frame) {
        prev = 0;
        frame = requestAnimationFrame(step);
      }
    },
    sync() {
      smooth = window.scrollY;
    },
    stop() {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    },
  };
}
