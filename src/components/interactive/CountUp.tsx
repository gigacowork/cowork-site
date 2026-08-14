"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Counter animation for the metrics block.
 *
 * Animates every `[data-counter][data-counter-value]` inside from 0 to its
 * final value once the block enters the viewport. The markup already renders
 * the final number server-side, so with JS off (or reduced motion on) the
 * correct value is simply shown straight away.
 */

const DURATION = 1400;
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export function CountUp({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const nodes = Array.from(
      root.querySelectorAll<HTMLElement>("[data-counter][data-counter-value]")
    );
    if (!nodes.length) return;

    const targets = nodes.map((n) => {
      const raw = n.dataset.counterValue ?? n.textContent ?? "0";
      const value = Number.parseFloat(raw);
      return Number.isFinite(value) ? value : 0;
    });

    // Lock the rendered width so the layout does not jump while counting.
    // The final value stays on screen until the animation actually starts —
    // if the block is never scrolled into view, nothing changes.
    nodes.forEach((n) => {
      n.style.display = "inline-block";
      n.style.minWidth = `${n.getBoundingClientRect().width}px`;
      n.style.textAlign = "center";
    });

    let raf = 0;
    let start = 0;
    let done = false;

    const tick = (now: number) => {
      if (!start) start = now;
      const t = Math.min(1, (now - start) / DURATION);
      const eased = easeOutCubic(t);
      nodes.forEach((n, i) => {
        n.textContent = String(Math.round(targets[i] * eased));
      });
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        nodes.forEach((n, i) => {
          n.textContent = String(targets[i]);
        });
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !done) {
            done = true;
            observer.disconnect();
            nodes.forEach((n) => {
              n.textContent = "0";
            });
            raf = requestAnimationFrame(tick);
          }
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(root);

    return () => {
      observer.disconnect();
      if (raf) cancelAnimationFrame(raf);
      nodes.forEach((n, i) => {
        n.textContent = String(targets[i]);
      });
    };
  }, []);

  return <div ref={rootRef}>{children}</div>;
}

export default CountUp;
