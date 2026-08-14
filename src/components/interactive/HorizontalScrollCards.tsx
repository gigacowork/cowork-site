"use client";

import { useEffect, useRef, type ReactNode } from "react";

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
    let active = false;
    let frame = 0;

    const reset = () => {
      outer.style.height = "";
      pin.style.position = "";
      pin.style.top = "";
      pin.style.height = "";
      pin.style.overflow = "";
      track.style.overflowX = "";
      track.style.transform = "";
      track.style.willChange = "";
      active = false;
      syncFromTrack();
    };

    const measure = () => {
      reset();
      if (!desktop.matches || reduced.matches) return;

      // Overflow that has to be travelled horizontally.
      distance = track.scrollWidth - track.clientWidth;
      const contentHeight = pin.offsetHeight;
      if (distance <= 0 || contentHeight > window.innerHeight) return;

      active = true;
      outer.style.height = `${window.innerHeight + distance}px`;
      pin.style.position = "sticky";
      pin.style.top = "0px";
      pin.style.height = "100vh";
      pin.style.overflow = "hidden";
      // The track is what gets translated, so it must NOT clip itself —
      // the pinned wrapper above does the clipping instead.
      track.style.overflowX = "visible";
      track.style.willChange = "transform";
      update();
    };

    const update = () => {
      if (!active) return;
      const top = outer.getBoundingClientRect().top;
      const progress = Math.min(1, Math.max(0, -top / distance));
      track.style.transform = `translate3d(${-progress * distance}px,0,0)`;
      syncNav(progress);
    };

    const syncFromTrack = () => {
      const max = track.scrollWidth - track.clientWidth;
      syncNav(max <= 0 ? 1 : track.scrollLeft / max);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    };

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

    prevBtn?.addEventListener("click", onPrev);
    nextBtn?.addEventListener("click", onNext);
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
      if (frame) cancelAnimationFrame(frame);
      prevBtn?.removeEventListener("click", onPrev);
      nextBtn?.removeEventListener("click", onNext);
      track.removeEventListener("scroll", syncFromTrack);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      desktop.removeEventListener("change", measure);
      reduced.removeEventListener("change", measure);
      ro.disconnect();
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

export default HorizontalScrollCards;
