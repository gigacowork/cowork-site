"use client";

import { useLayoutEffect, useRef, type CSSProperties, type ReactNode } from "react";

import { applyStickyTail, clearStickyTail, stackRelease } from "@/lib/sticky-tail";

import styles from "./careers.module.css";

const SCENE_GUTTER = 16;
const STEP_TRANSITION = { duration: 280, easing: "ease-in-out" };

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
    const texts = Array.from(root.querySelectorAll<HTMLElement>("[data-team-text]"));
    const articles = Array.from(root.querySelectorAll("[data-team-text] > article"));
    const descriptions = Array.from(root.querySelectorAll("[data-team-description]"));
    if (cards.length < 2 || [texts, articles, descriptions].some((items) => items.length !== cards.length)) {
      return;
    }

    const desktop = window.matchMedia("(min-width: 1024px) and (min-height: 700px)");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let stepTop = 0;
    let current = -1;
    let frame = 0;
    let transitions: Animation[] = [];

    function cancelTransitions() {
      transitions.forEach((transition) => transition.cancel());
      transitions = [];
    }

    function reset() {
      if (!root || !storyHeading) return;
      cancelTransitions();
      delete root.dataset.layered;
      root.style.removeProperty("--team-heading-top");
      root.style.removeProperty("--team-content-offset");
      clearStickyTail(storyHeading);
      current = -1;
      for (const card of cards) {
        card.style.removeProperty("opacity");
        card.style.removeProperty("--team-description-offset");
      }
      for (const text of texts) {
        text.inert = false;
        clearStickyTail(text);
      }
    }

    function update() {
      frame = 0;
      if (!root?.hasAttribute("data-layered")) return;

      let next = 0;
      for (const [index, card] of cards.entries()) {
        if (card.getBoundingClientRect().top <= stepTop) next = index;
      }
      if (current === next) return;

      const previousCard = cards[current];
      const nextCard = cards[next];
      const outgoingOpacity = previousCard ? Number(getComputedStyle(previousCard).opacity) : 0;
      const incomingOpacity = previousCard ? Number(getComputedStyle(nextCard).opacity) : 1;
      cancelTransitions();
      cards.forEach((card, index) => {
        card.style.opacity = index === next ? "1" : "0";
      });

      // The scroll position selects the step. Its transition runs to completion on its own.
      if (previousCard) {
        transitions = [
          previousCard.animate({ opacity: [outgoingOpacity, 0] }, STEP_TRANSITION),
          nextCard.animate({ opacity: [incomingOpacity, 1] }, STEP_TRANSITION),
        ];
        const illustration = nextCard.firstElementChild;
        if (illustration && incomingOpacity === 0) {
          // Move the inner image so the motion doesn't affect the sticky card's threshold.
          const offset = next > current ? 12 : -12;
          transitions.push(illustration.animate({ transform: [`translateY(${offset}px)`, "none"] }, STEP_TRANSITION));
        }
      }

      current = next;
      texts.forEach((text, index) => { text.inert = index !== next; });
    }

    function onScroll() {
      if (root?.hasAttribute("data-layered") && !frame) {
        frame = requestAnimationFrame(update);
      }
    }

    function syncLayout() {
      if (!root || !storyHeading || !headingContent) return;
      if (!desktop.matches || reduceMotion.matches) {
        reset();
        return;
      }

      const rootStyle = getComputedStyle(root);
      const minHeadingTop = parseFloat(rootStyle.getPropertyValue("--header-h")) + SCENE_GUTTER;
      const headingHeight = headingContent.getBoundingClientRect().height;
      const sceneEnd = document.documentElement.clientHeight - SCENE_GUTTER;
      const articleRects = articles.map((article) => article.getBoundingClientRect());
      const tallestScene = Math.max(
        ...articleRects.map((rect) => rect.height),
        ...cards.map((card) => card.getBoundingClientRect().height),
      );
      const spaceForGap = sceneEnd - minHeadingTop - headingHeight - tallestScene;

      if (spaceForGap < SCENE_GUTTER) {
        reset();
        return;
      }

      // Fix the whole composition using the tallest team so the shared gap
      // stays the same on entry, at each switch and when the story releases.
      const gap = Math.min(parseFloat(rootStyle.rowGap), spaceForGap);
      const headingTop = minHeadingTop + Math.floor((spaceForGap - gap) / 2);
      const contentOffset = headingHeight + gap;
      stepTop = headingTop + contentOffset;
      const offsets = descriptions.map((description, index) =>
        description.getBoundingClientRect().top - articleRects[index].top,
      );

      root.dataset.layered = "";
      root.style.setProperty("--team-heading-top", `${headingTop}px`);
      root.style.setProperty("--team-content-offset", `${contentOffset}px`);
      cards.forEach((card, index) => {
        card.style.setProperty("--team-description-offset", `${offsets[index]}px`);
      });

      const release = stackRelease(cards, stepTop);
      applyStickyTail(storyHeading, release);
      texts.forEach((text) => applyStickyTail(text, release));
      if (frame) cancelAnimationFrame(frame);
      update();
    }

    syncLayout();
    const textSize = new ResizeObserver(syncLayout);
    textSize.observe(headingContent);
    articles.forEach((article) => textSize.observe(article));
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", syncLayout);
    reduceMotion.addEventListener("change", syncLayout);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      textSize.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", syncLayout);
      reduceMotion.removeEventListener("change", syncLayout);
      reset();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={styles.teamStory}
      style={{ "--team-rows": count + 1 } as CSSProperties}
    >
      <div className={styles.teamHeadingSlot}>
        <div ref={headingRef} className={styles.teamHeading} data-team-heading>
          {heading}
        </div>
      </div>
      <div className={styles.teamStorySteps}>
        {children}
        <div
          aria-hidden="true"
          className={styles.teamStorySpacer}
          style={{ gridRow: count + 2 }}
        />
      </div>
    </div>
  );
}
