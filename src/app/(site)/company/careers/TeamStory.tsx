"use client";

import { useLayoutEffect, useRef, type CSSProperties, type ReactNode } from "react";

import { createStackCollapse } from "@/lib/stack-collapse";
import { applyStickyTail, clearStickyTail, stackRelease } from "@/lib/sticky-tail";

import styles from "./careers.module.css";

const SCENE_GUTTER = 16;
const CARD_STEP = 12;

export function TeamStory({
  count,
  heading,
  children,
}: {
  count: number;
  heading: ReactNode;
  children: ReactNode;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const storyHeading = headingRef.current;
    const headingContent = storyHeading?.firstElementChild;
    if (!root || !storyHeading || !headingContent) return;

    const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-team-card]"));
    if (cards.length < 2) return;

    const desktop = window.matchMedia("(min-width: 1024px)");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const contents = cards.map((card) => card.firstElementChild as HTMLElement);
    let collapse: ReturnType<typeof createStackCollapse> | undefined;
    let frontCard: HTMLElement | undefined;
    let frame = 0;

    const reset = () => {
      collapse?.clear();
      collapse = undefined;
      frontCard?.removeAttribute("data-front");
      frontCard = undefined;
      root.removeAttribute("data-layered");
      root.style.removeProperty("--team-heading-top");
      root.style.removeProperty("--team-heading-height");
      root.style.removeProperty("--team-card-height");
      clearStickyTail(storyHeading);
    };

    function update() {
      frame = 0;
      if (!collapse) return;

      collapse.layout(collapse.progress());

      // As soon as the next card covers any part of the stack, it takes over its shadow.
      let front = cards[0];
      let previous = front.getBoundingClientRect();
      for (const card of cards.slice(1)) {
        const rect = card.getBoundingClientRect();
        if (rect.top < previous.bottom) front = card;
        previous = rect;
      }

      if (front === frontCard) return;
      frontCard?.removeAttribute("data-front");
      front.setAttribute("data-front", "");
      frontCard = front;
    }

    function onScroll() {
      if (collapse && !frame) frame = requestAnimationFrame(update);
    }

    function syncLayout() {
      if (!root || !storyHeading || !headingContent) return;
      if (!desktop.matches || reduceMotion.matches) {
        reset();
        return;
      }

      const rootStyle = getComputedStyle(root);
      const minHeadingTop = parseFloat(rootStyle.getPropertyValue("--header-h")) + SCENE_GUTTER;
      const headingHeight = Math.ceil(headingContent.getBoundingClientRect().height);
      const cardHeight = Math.ceil(Math.max(...contents.map((content) => content.getBoundingClientRect().height)));
      const gap = parseFloat(rootStyle.rowGap);
      const requiredHeight = minHeadingTop + headingHeight + gap + cardHeight + (cards.length - 1) * CARD_STEP;
      const extraSpace = document.documentElement.clientHeight - SCENE_GUTTER - requiredHeight;

      if (extraSpace < 0) {
        reset();
        return;
      }

      const headingTop = minHeadingTop + Math.floor(extraSpace / 2);
      const cardTop = headingTop + headingHeight + gap;
      root.dataset.layered = "";
      root.style.setProperty("--team-heading-top", `${headingTop}px`);
      root.style.setProperty("--team-heading-height", `${headingHeight}px`);
      root.style.setProperty("--team-card-height", `${cardHeight}px`);

      collapse = createStackCollapse({ root, cards, stickyTop: cardTop, cardStep: CARD_STEP });
      applyStickyTail(storyHeading, stackRelease(cards, cardTop));
      if (frame) cancelAnimationFrame(frame);
      update();
    }

    syncLayout();
    const contentSize = new ResizeObserver(syncLayout);
    contentSize.observe(headingContent);
    contents.forEach((content) => contentSize.observe(content));
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", syncLayout);
    reduceMotion.addEventListener("change", syncLayout);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      contentSize.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", syncLayout);
      reduceMotion.removeEventListener("change", syncLayout);
      reset();
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.teamStory} style={{ "--team-count": count } as CSSProperties}>
      <div className={styles.teamHeadingSlot}>
        <div ref={headingRef} className={styles.teamHeading}>
          {heading}
        </div>
      </div>
      <div className={styles.teamStorySteps}>
        {children}
        <div aria-hidden="true" data-spacer className={styles.teamStorySpacer} />
      </div>
    </div>
  );
}
