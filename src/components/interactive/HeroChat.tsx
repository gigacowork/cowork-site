"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import {
  Answer,
  Choices,
  Composer,
  Request,
  scheduleScenario,
  type Exchange,
  type Kind,
} from "@/components/interactive/scenario-demo/ScenarioDemo";
import { homeScenarios } from "@/components/interactive/scenario-demo/home-scenarios";
import styles from "@/components/interactive/scenario-demo/ScenarioDemo.module.css";
import { HERO_RESET_EVENT } from "@/lib/hero-reset";

const CLOSE_DURATION = 360;
const MAX_SCROLL_FADE = 32;

function updateScrollFade(viewport: HTMLDivElement) {
  const { scrollHeight, scrollTop, clientHeight } = viewport;
  const remaining = scrollHeight - scrollTop - clientHeight;
  const fadeLength = (distance: number) => `${Math.min(MAX_SCROLL_FADE, Math.max(0, distance))}px`;

  viewport.style.setProperty("--chat-fade-top", fadeLength(scrollTop));
  viewport.style.setProperty("--chat-fade-bottom", fadeLength(remaining));

  return { scrollTop, remaining };
}

export function HeroChat() {
  const [history, setHistory] = useState<Exchange[]>([]);
  const [opened, setOpened] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const conversationRef = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const following = useRef(true);
  const focusViewport = useRef(false);
  const lastScrollTop = useRef(0);
  const latest = history.at(-1);
  const active = opened && Boolean(latest && !latest.complete);
  const remaining = homeScenarios.filter((scenario) => !history.some((exchange) => exchange.kind === scenario.kind));

  const syncViewport = useCallback((viewport: HTMLDivElement) => {
    if (following.current) viewport.scrollTop = viewport.scrollHeight;
    lastScrollTop.current = updateScrollFade(viewport).scrollTop;
  }, []);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const close = useCallback(() => {
    clearTimers();
    setOpened(false);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Keep the conversation in place while the fixed window closes.
    timers.current.push(setTimeout(() => setHistory([]), reduced ? 0 : CLOSE_DURATION));
  }, [clearTimers]);

  useEffect(() => {
    window.addEventListener(HERO_RESET_EVENT, close);
    return () => {
      window.removeEventListener(HERO_RESET_EVENT, close);
      clearTimers();
    };
  }, [clearTimers, close]);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!opened || !viewport) return;

    if (focusViewport.current) viewport.focus({ preventScroll: true });
    syncViewport(viewport);
  }, [opened, history.length, syncViewport]);

  useEffect(() => {
    const viewport = viewportRef.current;
    const conversation = conversationRef.current;
    if (!opened || !viewport || !conversation) return;

    const observer = new ResizeObserver(() => syncViewport(viewport));
    observer.observe(conversation);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [opened, syncViewport]);

  function begin(kind: Kind, fromKeyboard: boolean) {
    if (opened && (active || history.some((exchange) => exchange.kind === kind))) return;

    const scenario = homeScenarios.find((item) => item.kind === kind);
    if (!scenario) return;

    clearTimers();
    following.current = true;
    focusViewport.current = fromKeyboard;

    const entry: Exchange = {
      kind,
      startedAt: Date.now(),
      phase: 0,
      count: 0,
      complete: false,
      articles: [],
    };
    setHistory((current) => opened ? [...current, entry] : [entry]);
    setOpened(true);

    const update = (values: Partial<Exchange>) => {
      setHistory((current) => current.map((exchange) => exchange.kind === kind ? { ...exchange, ...values } : exchange));
    };
    const after = (delay: number, callback: () => void) => {
      timers.current.push(setTimeout(callback, delay));
    };
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    scheduleScenario(entry, scenario, reduced, update, after, (phase = 4) => update({ phase, complete: true }));
  }

  return (
    <div className={styles.homeDemo} data-home-scenario={opened ? "open" : "idle"}>
      <div
        ref={viewportRef}
        data-chat-viewport
        className={styles.homeDemoViewport}
        role="region"
        aria-label="Диалог с ИИ-агентом"
        aria-busy={active}
        inert={!opened}
        tabIndex={opened ? 0 : -1}
        onScroll={(event) => {
          if (!opened) return;
          const { scrollTop, remaining } = updateScrollFade(event.currentTarget);
          if (remaining < MAX_SCROLL_FADE) following.current = true;
          else if (scrollTop < lastScrollTop.current) following.current = false;
          lastScrollTop.current = scrollTop;
        }}
      >
        <div ref={conversationRef} className={styles.homeDemoConversation}>
          {history.map((exchange) => {
            const scenario = homeScenarios.find((item) => item.kind === exchange.kind);
            if (!scenario) return null;

            return (
              <section key={exchange.kind} className={styles.exchange} aria-label={scenario.label}>
                <Request scenario={scenario} />
                <hr className={styles.divider} />
                <Answer exchange={exchange} scenario={scenario} homepage />
              </section>
            );
          })}
          {opened && latest?.complete && remaining.length > 0 && (
            <section className={styles.more} aria-labelledby="home-scenario-suggestions">
              <p id="home-scenario-suggestions" className={styles.status}>Что ещё могут ИИ-агенты?</p>
              <Choices remaining={remaining} onChoose={begin} />
            </section>
          )}
        </div>
      </div>

      <div className={styles.homeDemoControls}>
        {!opened && (
          <div className={styles.homeDemoChoicePanel}>
            <Choices remaining={homeScenarios} onChoose={begin} initial />
            <Composer />
          </div>
        )}
      </div>
    </div>
  );
}

export default HeroChat;
