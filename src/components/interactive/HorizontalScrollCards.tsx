"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { createScrollFollower } from "@/lib/scroll-follower";

/**
 * Scroll-jacking wrapper for the "Не тратьте часы на задачи…" section.
 *
 * Vertical scrolling is converted into horizontal card movement: the section
 * pins to the viewport and the card track translates until the last card is
 * fully visible, only then does the page continue scrolling down.
 *
 * Enhancement only — it wraps the server-rendered <NoHours /> and drives the
 * `[data-cards-track]` element. Disabled below `md` (native swipe stays) and
 * when the user prefers reduced motion, or when the section is taller than the
 * viewport (pinning would hide content).
 */
export function HorizontalScrollCards({ children }: { children: ReactNode }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outer = outerRef.current;
    const pin = pinRef.current;
    if (!outer || !pin) return;

    const track = outer.querySelector<HTMLElement>("[data-cards-track]");
    if (!track) return;

    const prevBtn = outer.querySelector<HTMLButtonElement>("[data-cards-prev]");
    const nextBtn = outer.querySelector<HTMLButtonElement>("[data-cards-next]");

    /*
      Carousel Navigation 804:3916 — Position=Start disables Previous,
      Position=End disables Next, Middle enables both.
    */
    const syncNav = (progress: number) => {
      if (prevBtn) prevBtn.disabled = progress <= 0.001;
      if (nextBtn) nextBtn.disabled = progress >= 0.999;
    };

    const desktop = window.matchMedia("(min-width: 768px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    let distance = 0;

    /** Смещение, на котором секция закрепляется; отрицательное, если она выше окна. */

    let stickyTop = 0;
    let active = false;

    /*
      Превращение карточек: задачи уходят, на их месте появляется знак «забрал
      ИИ-агент». Здесь считается только число `--done` от 0 до 1 для каждой
      карточки, всё остальное рисует CSS (блок «Не тратьте часы…» в globals).

      Отсчёт идёт от пройденного по горизонтали расстояния, а не от индекса
      «активной» карточки: тогда превращение идёт ровно за прокруткой и само
      разворачивается назад, когда её крутят обратно.

      Карточки уходят по очереди: старт каждой сдвинут на `stagger`. Величины
      считаются из длины ленты, а не заданы числом, — чтобы последняя карточка
      успевала обернуться ровно к концу ленты на любой ширине и при любом
      количестве карточек.

      Лента для отсчёта длиннее самой прокрутки на `tail`. Последние карточки
      выезжают на экран под самый конец ленты, и раньше их задачи забирались
      почти сразу, прочитать не успеваешь. Хвост уводит их превращение за край
      горизонтального хода — оно доигрывает уже на переходе к вертикальной
      прокрутке, пока секция уезжает вверх. Поэтому и отсчёт ведётся от
      непорезанного `-top`, а не от прогресса 0…1.
    */
    const cards = Array.from(
      track.querySelectorAll<HTMLElement>("[data-card-id]"),
    );
    /* Во сколько раз превращение одной карточки длиннее шага между ними. */
    const SPAN_RATIO = 1.6;
    /*
      Мёртвая зона в начале: секция прилипает не идеально в ноль, и без неё
      первая карточка на старте уже стояла бы чуть подтаявшей.
    */
    const DEAD = 40;
    let stagger = 0;
    let span = 0;
    /** Последнее записанное `--done` каждой карточки. */
    const painted: (string | null)[] = cards.map(() => null);

    const measureCards = () => {
      /*
        Хвост берём долей окна, а не числом: сколько ещё видно карточки после
        открепления, зависит от высоты экрана. Половины хватает — к этому
        моменту секция уезжает вверх, но карточки ещё на виду.
      */
      const tail = active ? window.innerHeight * 0.5 : 0;
      const range = track.scrollWidth - track.clientWidth + tail - DEAD;
      stagger =
        range > 0 && cards.length > 1
          ? range / (cards.length - 1 + SPAN_RATIO)
          : 0;
      span = stagger * SPAN_RATIO;
    };

    const paintCards = (shift: number) => {
      /*
        Ниже md превращения нет. Там лента листается пальцем, карточка занимает
        почти весь экран, и задачи сгорали бы прямо под пальцем — прочитать их
        не успеваешь. На телефоне карточки остаются со списком задач.
      */
      if (!desktop.matches || reduced.matches || !span) {
        cards.forEach((card, i) => {
          card.style.removeProperty("--done");
          painted[i] = null;
        });
        return;
      }
      cards.forEach((card, i) => {
        const done = Math.min(
          1,
          Math.max(0, (shift - DEAD - i * stagger) / span),
        );
        /*
          Записываем только изменившееся: каждая запись переменной пересчитывает
          стили всех задач внутри карточки, а на большей части хода значение
          стоит на 0 или 1 и трогать его незачем.
        */
        const next = done.toFixed(3);
        if (painted[i] !== next) {
          painted[i] = next;
          card.style.setProperty("--done", next);
        }
      });
    };

    const reset = () => {
      outer.style.height = "";
      pin.style.position = "";
      pin.style.top = "";
      pin.style.height = "";
      stickyTop = 0;
      pin.style.overflow = "";
      track.style.overflowX = "";
      track.style.transform = "";
      track.style.willChange = "";
      active = false;
    };

    const measure = () => {
      reset();
      measureCards();
      syncFromTrack();
      if (!desktop.matches || reduced.matches) return;

      // Overflow that has to be travelled horizontally.
      distance = track.scrollWidth - track.clientWidth;
      if (distance <= 0) return;

      /*
        Точка прилипания.

        Раньше здесь стояла проверка «секция выше окна → выключаемся», и на
        ноутбуках с невысоким экраном эффект молча пропадал: секция ~870px не
        влезала в ~760px вьюпорта, карточки просто стояли в ряд. Теперь высота
        секции ни на что не влияет — меняется только точка прилипания.

        Пока секция помещается в окно, всё как было: `top: 0`,высота 100vh.
        Если не помещается — `top` отрицательный, и секция прилипает НИЖНИМ
        краем к низу экрана: карточки и стрелки видны целиком, а верх с
        заголовком успевает уехать вверх. Высота при этом натуральная, чтобы
        ничего не обрезалось.
      */
      const contentHeight = pin.offsetHeight;
      const pinHeight = Math.max(contentHeight, window.innerHeight);
      stickyTop = Math.min(0, window.innerHeight - contentHeight);

      active = true;
      outer.style.height = `${pinHeight + distance}px`;
      pin.style.position = "sticky";
      pin.style.top = `${stickyTop}px`;
      pin.style.height = `${pinHeight}px`;
      pin.style.overflow = "hidden";
      // The track is what gets translated, so it must NOT clip itself —
      // the pinned wrapper above does the clipping instead.
      track.style.overflowX = "visible";
      track.style.willChange = "transform";
      // Хвост считается только для закреплённой секции — пересчитываем здесь.
      measureCards();
      /* После пересчёта раскладки догонять нечего — начинаем с нуля. */
      follower.sync();
      update();
    };

    /*
      `lag` — насколько анимация отстаёт от страницы (см. lib/scroll-follower).
      Прибавляем его к замеру: получается положение секции, каким оно было
      мгновение назад. Благодаря этому щелчок колеса, двигающий страницу
      сразу на сотню пикселей, лента проезжает за несколько кадров, а не
      прыжком.
    */
    const update = (lag = 0) => {
      if (!active) return;
      /*
        `travelled` не режется по длине ленты: после того как лента доехала до
        конца, счётчик продолжает расти, пока секция уезжает вверх, — на этом
        хвосте доигрывает превращение последних карточек. Сама лента стоит:
        её сдвиг считается по обрезанному прогрессу.
      */
      const travelled = Math.max(
        0,
        stickyTop - (outer.getBoundingClientRect().top + lag),
      );
      const progress = Math.min(1, travelled / distance);
      track.style.transform = `translate3d(${-progress * distance}px,0,0)`;
      syncNav(progress);
      paintCards(travelled);
    };

    const follower = createScrollFollower(update);

    /*
      Когда секция не закреплена (телефон, «уменьшить движение», низкое окно),
      лента едет собственной прокруткой — и пройденное расстояние берётся из
      неё же.
    */
    const syncFromTrack = () => {
      const max = track.scrollWidth - track.clientWidth;
      syncNav(max <= 0 ? 1 : track.scrollLeft / max);
      paintCards(track.scrollLeft);
    };

    const onScroll = () => follower.kick();

    // Prev / next buttons: drive window scroll while pinned, scrollLeft otherwise.
    const step = () => {
      const card = track.querySelector<HTMLElement>("li");
      const gap = parseFloat(getComputedStyle(track).columnGap || "24") || 24;
      return (card?.offsetWidth ?? 282) + gap;
    };
    const nudge = (dir: 1 | -1) => () => {
      if (active) {
        window.scrollBy({ top: dir * step(), behavior: "smooth" });
      } else {
        track.scrollBy({ left: dir * step(), behavior: "smooth" });
      }
    };
    const onPrev = nudge(-1);
    const onNext = nudge(1);

    /*
      Горизонтальный жест на трекпаде.

      Пока секция закреплена, у дорожки `overflow-x: visible` и двигает её не
      собственная прокрутка, а transform от прокрутки страницы. Нативный
      горизонтальный скролл в этот момент двигать нечего, и двупальцевый смах
      вбок не делал ничего. Переводим его в вертикальную прокрутку окна — ту
      самую, что и так крутит карточки.

      `deltaX > deltaY` — чтобы не перехватывать обычную вертикальную прокрутку
      и диагональные жесты. На краях (в начале и в конце ленты) жест не
      перехватываем: смах отдаётся странице, иначе из блока было бы не выйти —
      и заодно на macOS остаётся жест «назад» в браузере.
    */
    const onWheel = (event: WheelEvent) => {
      if (!active || Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;

      const progress = Math.min(
        1,
        Math.max(0, -outer.getBoundingClientRect().top / distance),
      );
      if (
        (event.deltaX < 0 && progress <= 0) ||
        (event.deltaX > 0 && progress >= 1)
      ) {
        return;
      }

      event.preventDefault();
      window.scrollBy({ top: event.deltaX, behavior: "auto" });
    };

    prevBtn?.addEventListener("click", onPrev);
    nextBtn?.addEventListener("click", onNext);
    pin.addEventListener("wheel", onWheel, { passive: false });
    track.addEventListener("scroll", syncFromTrack, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    desktop.addEventListener("change", measure);
    reduced.addEventListener("change", measure);

    const ro = new ResizeObserver(measure);
    ro.observe(track);

    // Fonts change card widths — re-measure once they land.
    document.fonts?.ready.then(measure).catch(() => {});
    measure();

    return () => {
      follower.stop();
      prevBtn?.removeEventListener("click", onPrev);
      nextBtn?.removeEventListener("click", onNext);
      pin.removeEventListener("wheel", onWheel);
      track.removeEventListener("scroll", syncFromTrack);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      desktop.removeEventListener("change", measure);
      reduced.removeEventListener("change", measure);
      ro.disconnect();
      reset();
      cards.forEach((card) => card.style.removeProperty("--done"));
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

export default HorizontalScrollCards;
