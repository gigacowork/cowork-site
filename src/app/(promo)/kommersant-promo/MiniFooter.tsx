"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./scenarios.module.css";

export function MiniFooter({ children, enabled }: { children: ReactNode; enabled: boolean }) {
  const [revealed, setRevealed] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const revealScroll = useRef(false);

  useEffect(() => {
    if (!enabled || revealed) return;
    let intentUntil = 0;
    let touchY = 0;
    const checkEnd = () => {
      if (performance.now() > intentUntil || !panel.current) return;
      if (panel.current.getBoundingClientRect().top <= window.innerHeight + 12) {
        revealScroll.current = true;
        setRevealed(true);
      }
    };
    const intend = () => { intentUntil = performance.now() + 1200; checkEnd(); };
    const inDialog = (target: EventTarget | null) => target instanceof Element && Boolean(target.closest('[role="dialog"]'));
    const onWheel = (event: WheelEvent) => { if (!inDialog(event.target) && event.deltaY > 0) intend(); };
    const onTouchStart = (event: TouchEvent) => { touchY = event.touches[0]?.clientY ?? 0; };
    const onTouchMove = (event: TouchEvent) => {
      if (inDialog(event.target)) return;
      const y = event.touches[0]?.clientY ?? touchY;
      if (touchY - y > 8) { intend(); touchY = y; }
      else if (y > touchY) touchY = y;
    };
    const onKey = (event: KeyboardEvent) => {
      if (inDialog(event.target)) return;
      if (event.target instanceof Element && event.target.closest("input, textarea, select, button, a, [contenteditable='true']")) return;
      if (["ArrowDown", "PageDown", "End", " "].includes(event.key)) intend();
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", checkEnd, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", checkEnd);
    };
  }, [revealed, enabled]);

  useEffect(() => {
    if (!enabled || !revealed || !revealScroll.current || !panel.current) return;
    const startY = window.scrollY;
    const start = performance.now();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let stopped = false;
    const stopOnUp = (event: WheelEvent) => { if (event.deltaY < 0) stopped = true; };
    const follow = () => {
      if (stopped) return;
      window.scrollTo({ top: startY + (panel.current?.getBoundingClientRect().height ?? 0), behavior: "instant" });
      if (!reduced && performance.now() - start < 560) frame = requestAnimationFrame(follow);
    };
    frame = requestAnimationFrame(follow);
    window.addEventListener("wheel", stopOnUp, { passive: true });
    return () => { cancelAnimationFrame(frame); window.removeEventListener("wheel", stopOnUp); };
  }, [revealed, enabled]);

  return <div ref={panel} hidden={!enabled} className={`${styles.footerReveal} ${revealed ? styles.footerRevealed : ""}`} aria-hidden={!enabled || !revealed} inert={!enabled || !revealed}>
    <div className={styles.footerClip}>{children}</div>
  </div>;
}
