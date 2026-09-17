"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { groupDigits } from "@/lib/format";

/**
 * Counter animation for the metrics block.
 *
 * Animates every `[data-counter][data-counter-value]` inside from 0 to its
 * final value once the block enters the viewport. The markup already renders
 * the final number server-side, so with JS off (or reduced motion on) the
 * correct value is simply shown straight away.
 */

const DURATION = 1400;
/**
 * Пауза между входом блока в кадр и стартом счёта.
 *
 * Порог 0.5 срабатывает, когда блок виден наполовину и ещё едет вверх — цифры
 * успевали докрутиться до того, как читатель их увидит. Задержка даёт блоку
 * встать на место, и счёт начинается уже на неподвижной секции.
 */
const START_DELAY = 420;
/** Доля секции во вьюпорте, после которой отсчитывается задержка. */
const THRESHOLD = 0.5;
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export function CountUp({
  children,
  className = "",
}: {
  children: ReactNode;
  /**
   * Классы обёртки. Обёртка — реальный блок в потоке (по ней и считается
   * попадание в кадр), поэтому там, где она мешает раскладке, позиционирование
   * вешается на неё, а не на содержимое.
   */
  className?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const nodes = Array.from(
      root.querySelectorAll<HTMLElement>("[data-counter][data-counter-value]"),
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
      /*
        По умолчанию по центру — так набраны крупные метрики. В строке, где
        число стоит рядом с подписью, выключка должна быть та же, что у
        строки, иначе цифры на ходу гуляют относительно подписи.
      */
      n.style.textAlign = n.dataset.counterAlign ?? "center";
    });

    /* `data-counter-group` — разбивать ли разряды по дороге и в конце. */
    const render = (node: HTMLElement, value: number) =>
      "counterGroup" in node.dataset ? groupDigits(value) : String(value);

    let raf = 0;
    let start = 0;
    let done = false;
    let delayTimer = 0;

    const tick = (now: number) => {
      if (!start) start = now;
      const t = Math.min(1, (now - start) / DURATION);
      const eased = easeOutCubic(t);
      nodes.forEach((n, i) => {
        n.textContent = render(n, Math.round(targets[i] * eased));
      });
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        nodes.forEach((n, i) => {
          n.textContent = render(n, targets[i]);
        });
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !done) {
            done = true;
            observer.disconnect();
            delayTimer = window.setTimeout(() => {
              nodes.forEach((n) => {
                n.textContent = "0";
              });
              raf = requestAnimationFrame(tick);
            }, START_DELAY);
          }
        }
      },
      { threshold: THRESHOLD },
    );
    observer.observe(root);

    return () => {
      observer.disconnect();
      window.clearTimeout(delayTimer);
      if (raf) cancelAnimationFrame(raf);
      nodes.forEach((n, i) => {
        n.textContent = render(n, targets[i]);
      });
    };
  }, []);

  return (
    <div ref={rootRef} className={className}>
      {children}
    </div>
  );
}

export default CountUp;
