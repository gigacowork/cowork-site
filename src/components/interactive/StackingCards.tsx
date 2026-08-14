"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Stacking-scroll wrapper for "Как работают ИИ-агенты GigaCowork".
 *
 * Each card pins to the top of the viewport at a slightly lower offset than the
 * previous one, so the cards visually pile up as the user scrolls. The settled
 * offsets and scales come from Figma (2006:8925) and are carried on each card
 * as the `--stack-offset` / `--stack-scale` custom properties.
 *
 * Enhancement only — wraps the server-rendered <HowAgentsWork /> and drives the
 * `[data-stack-card]` elements. Disabled below `md` and under reduced motion.
 *
 * ── Why spacer elements instead of margins ──────────────────────────────────
 * A sticky item stays pinned only while its *margin box* fits inside its
 * containing block, which is the parent's *content* box. Two consequences:
 *
 *  1. Trailing room after the last card cannot be a margin on that card, nor
 *     padding on the list — neither extends the content box. Without real
 *     trailing content the list ends exactly at the last card's bottom edge,
 *     the sticky constraint is violated the instant it would engage, and the
 *     last card never settles into the stack — the page just scrolls on.
 *  2. Using `margin-bottom` on the earlier cards to space them out makes their
 *     margin boxes ~2× taller, so they unpin hundreds of pixels *before* the
 *     last one and slide out from under the finished stack.
 *
 * So all the scroll distance is expressed as spacer <li>s, and no card carries
 * a margin. Every card then unpins within ~40px of the others and the whole
 * stack leaves the viewport together.
 */

/** Scroll distance allotted to each card handover. */
const SCROLL_PER_CARD = 420;
/** Gap between the fixed header and the pinned section heading. */
const HEADING_GAP = 24;
/** Gap between the pinned heading and the first card. */
const CARD_GAP = 24;
/** Fallback pin offset when the section has no sticky heading. */
const PIN_TOP = 96;
/** Beat during which the completed stack stays pinned before the page moves on. */
const TAIL_HOLD = 460;

export function StackingCards({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const cards = Array.from(
      root.querySelectorAll<HTMLElement>("[data-stack-card]")
    );
    if (cards.length < 2) return;

    const list = cards[0].parentElement as HTMLElement | null;
    if (!list) return;

    /*
      The section heading stays pinned above the stack while the cards scroll,
      so the reader always knows which block they are in. The cards then pin
      below it — they never travel above their own pin offset, so they cannot
      overlap the heading.
    */
    const heading = root.querySelector<HTMLElement>("[data-stack-heading]");

    const desktop = window.matchMedia("(min-width: 768px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    let active = false;
    let frame = 0;
    let spacers: HTMLElement[] = [];

    const settled = cards.map((card, i) => {
      const cs = getComputedStyle(card);
      const scale = parseFloat(cs.getPropertyValue("--stack-scale")) || 1;
      const offset =
        parseFloat(cs.getPropertyValue("--stack-offset")) || i * 40;
      return { scale, offset };
    });

    const makeSpacer = (height: number) => {
      const spacer = document.createElement("li");
      spacer.setAttribute("aria-hidden", "true");
      spacer.dataset.stackSpacer = "";
      spacer.style.cssText = `height:${height}px;flex:0 0 auto;list-style:none;pointer-events:none`;
      spacers.push(spacer);
      return spacer;
    };

    const reset = () => {
      spacers.forEach((spacer) => spacer.remove());
      spacers = [];
      list.style.gap = "";
      if (heading) {
        heading.style.position = "";
        heading.style.top = "";
        heading.style.zIndex = "";
      }
      cards.forEach((card) => {
        card.style.position = "";
        card.style.top = "";
        card.style.zIndex = "";
        card.style.marginBottom = "";
        card.style.transform = "";
        card.style.transformOrigin = "";
        card.style.willChange = "";
      });
      active = false;
    };

    let headingTop = 0;
    let pinTop = PIN_TOP;

    const measure = () => {
      reset();
      if (!desktop.matches || reduced.matches) return;

      const headerH =
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue("--header-h")
        ) || 0;
      headingTop = headerH + HEADING_GAP;
      pinTop = heading
        ? headingTop + heading.offsetHeight + CARD_GAP
        : PIN_TOP;

      // Pinning would hide part of a card on short viewports — leave it alone.
      if (cards[0].offsetHeight + pinTop > window.innerHeight) return;

      active = true;
      list.style.gap = "0px";

      if (heading) {
        heading.style.position = "sticky";
        heading.style.top = `${headingTop}px`;
        heading.style.zIndex = "20";
      }

      cards.forEach((card, i) => {
        card.style.position = "sticky";
        card.style.top = `${pinTop + settled[i].offset}px`;
        card.style.zIndex = String(i + 1);
        card.style.transformOrigin = "top center";
        card.style.willChange = "transform";
        card.style.marginBottom = "0px";
        if (i < cards.length - 1) card.after(makeSpacer(SCROLL_PER_CARD));
      });
      list.appendChild(makeSpacer(TAIL_HOLD));

      update();
    };

    const update = () => {
      if (!active) return;

      /*
        Release the heading together with the stack.

        Sticky keeps an element pinned while its margin box fits its containing
        block. The heading is ~86px tall and the cards are 500px, so left alone
        the heading stays stuck ~600px LONGER than the cards — it hangs at the
        top of an empty viewport after the stack has already scrolled away.

        Instead of relying on the containing block, its `top` is walked upwards
        one-for-one with the scroll once the last card unpins, so the heading
        leaves at exactly the same moment and at the same speed.
      */
      if (heading) {
        const last = cards[cards.length - 1];
        const listBottom = list.getBoundingClientRect().bottom + window.scrollY;
        const releaseY =
          listBottom - (pinTop + settled[cards.length - 1].offset) - last.offsetHeight;
        const over = Math.max(0, window.scrollY - releaseY);
        heading.style.top = `${headingTop - over}px`;
      }

      for (let i = 0; i < cards.length - 1; i++) {
        const next = cards[i + 1].getBoundingClientRect();
        const pinnedTop = pinTop + settled[i].offset;
        const height = cards[i].offsetHeight;
        // 0 → the next card has not reached us; 1 → it fully covers us.
        const progress = Math.min(
          1,
          Math.max(0, (pinnedTop + height - next.top) / height)
        );
        const scale = 1 - (1 - settled[i].scale) * progress;
        cards[i].style.transform = `scale(${scale})`;
      }
      cards[cards.length - 1].style.transform = "";
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

  return <div ref={rootRef}>{children}</div>;
}

export default StackingCards;
