"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Горизонтальная лента без закрепления секции и перехвата прокрутки страницы. */
export function NativeScrollCards({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const track = root?.querySelector<HTMLElement>("[data-cards-track]");
    if (!root || !track) return;

    const prev = root.querySelector<HTMLButtonElement>("[data-cards-prev]");
    const next = root.querySelector<HTMLButtonElement>("[data-cards-next]");

    const syncNav = () => {
      const end = track.scrollWidth - track.clientWidth;
      if (prev) prev.disabled = track.scrollLeft <= 1;
      if (next) next.disabled = track.scrollLeft >= end - 1;
    };

    const step = () => {
      const card = track.querySelector<HTMLElement>("li");
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return (card?.offsetWidth ?? track.clientWidth) + gap;
    };
    const onPrev = () => track.scrollBy({ left: -step(), behavior: "smooth" });
    const onNext = () => track.scrollBy({ left: step(), behavior: "smooth" });

    prev?.addEventListener("click", onPrev);
    next?.addEventListener("click", onNext);
    track.addEventListener("scroll", syncNav, { passive: true });
    const resizeObserver = new ResizeObserver(syncNav);
    resizeObserver.observe(track);
    syncNav();

    return () => {
      prev?.removeEventListener("click", onPrev);
      next?.removeEventListener("click", onNext);
      track.removeEventListener("scroll", syncNav);
      resizeObserver.disconnect();
    };
  }, []);

  return <div ref={rootRef}>{children}</div>;
}
