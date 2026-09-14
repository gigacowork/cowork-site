"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { CarouselControl } from "@/components/ui/CarouselControl";

/**
 * Карусель карточек экспертов — /company/about (4231:28431 / 4310:24526).
 *
 * Лента прокручивается нативно, со скролл-снапом: на тач-экранах работает
 * привычный свайп, мышью — колесо с Shift и перетаскивание полосы. Кнопки
 * «назад-вперёд» из макета двигают ленту ровно на одну карточку и гаснут на
 * краях; полосу прокрутки прячем, она здесь лишняя.
 *
 * Прогрессивное улучшение: без JS лента остаётся прокручиваемой, кнопки просто
 * не появляются — поэтому их рисует сам компонент, а не разметка страницы.
 */
export function ExpertCarousel({ children }: { children: ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setAtStart(el.scrollLeft <= 1);
    // Единица запаса: браузеры округляют scrollLeft и до конца добирают доли.
    setAtEnd(el.scrollLeft >= max - 1);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    sync();
    el.addEventListener("scroll", sync, { passive: true });
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", sync);
      ro.disconnect();
    };
  }, [sync]);

  const step = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.firstElementChild?.firstElementChild as HTMLElement | null;
    // Шаг — ширина карточки плюс зазор между ними, чтобы соседняя вставала на место ушедшей.
    const gap = parseFloat(
      getComputedStyle(el.firstElementChild as Element).columnGap || "0",
    );
    const by = card
      ? card.offsetWidth + (Number.isNaN(gap) ? 0 : gap)
      : el.clientWidth;
    el.scrollBy({ left: by * dir, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col gap-32">
      <div
        ref={trackRef}
        /*
          Лента шире колонки: обоими краями она доходит до краёв окна.
          Справа это макет: третья карточка видна наполовину и «обрезается»
          экраном. Слева — чтобы ушедшая карточка уезжала за край окна,
          а не обрывалась ровной линией посреди страницы, по левому краю
          колонки.

          Отрицательный отступ равен ширине поля контейнера, а слева
          компенсируется равным внутренним полем и `scroll-padding`, иначе
          первая карточка в нулевой позиции стояла бы не по сетке, а снап
          возвращал её к краю окна. Секция гасит вылет по горизонтали,
          поэтому страница вбок не едет.
        */
        className="-mx-16 scroll-px-16 overflow-x-auto px-16 [-ms-overflow-style:none] [scrollbar-width:none] md:-mx-[calc((100vw-100%)/2)] md:scroll-pl-[calc((100vw-100%)/2)] md:pr-0 md:pl-[calc((100vw-100%)/2)] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
      <div className="flex justify-center gap-8">
        <CarouselControl
          direction="previous"
          disabled={atStart}
          onClick={() => step(-1)}
        />
        <CarouselControl
          direction="next"
          disabled={atEnd}
          onClick={() => step(1)}
        />
      </div>
    </div>
  );
}

export default ExpertCarousel;
