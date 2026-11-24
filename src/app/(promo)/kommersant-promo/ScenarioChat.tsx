"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { MiniFooter } from "./MiniFooter";
import LeadForm from "@/components/sections/LeadForm";
import { asset } from "@/lib/asset";
import { workEmailError } from "@/lib/work-email";
import styles from "@/components/interactive/scenario-demo/ScenarioDemo.module.css";
import {
  Answer,
  Choices,
  Composer,
  Request,
  scheduleScenario,
  scenarios,
  useScenarioArticles,
  type Exchange,
  type Kind,
} from "@/components/interactive/scenario-demo/ScenarioDemo";

function LeadContent({ idPrefix }: { idPrefix: string }) {
  const [sent, setSent] = useState(false);
  return <>
    {!sent && <div className={styles.leadCopy}>
      <h2>Делегируйте задачи агентам</h2>
      <p>Месяц бесплатного доступа к GigaCowork</p>
    </div>}
    <LeadForm embedded fields={["name", "email", "phone"]} idPrefix={idPrefix} submitLabel="Получить доступ" validateEmail={workEmailError} onSuccess={() => setSent(true)} />
  </>;
}

function Brands() {
  return <div className={styles.brands} role="img" aria-label="Коммерсантъ × GigaCowork">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={asset("/img/kommersant-promo-v2/logo-kommersant.svg")} alt="" />
    <span aria-hidden="true">×</span>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={asset("/img/kommersant-promo/logo-figma.svg")} alt="" />
  </div>;
}
export function ScenarioChat({ initialDigest, footer }: { initialDigest: unknown; footer: ReactNode }) {
  const articles = useScenarioArticles(initialDigest);
  const [history, setHistory] = useState<Exchange[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const [idleLeadOpen, setIdleLeadOpen] = useState(false);
  const idleLeadOffered = useRef(false);
  const initialChoices = useRef<HTMLDivElement>(null);
  const idleOrigin = useRef<{ brand: number; copy: number; choices: number } | null>(null);
  const [leadScrollReady, setLeadScrollReady] = useState(false);
  const [completionStage, setCompletionStage] = useState<0 | 1 | 2>(0);
  const suggestionsVisible = completionStage > 0;
  const hintLayer = useRef<HTMLSpanElement>(null);
  const tail = useRef<HTMLDivElement>(null);
  const next = useRef<HTMLDivElement>(null);
  const more = useRef<HTMLElement>(null);
  const lead = useRef<HTMLElement>(null);
  const header = useRef<HTMLElement>(null);
  const follow = useRef(true);
  const pendingFollow = useRef(false);
  const [followRevision, setFollowRevision] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const running = useRef(false);
  const brandBar = useRef<HTMLDivElement>(null);
  const heroCopy = useRef<HTMLDivElement>(null);
  const historyElement = useRef<HTMLDivElement>(null);
  const heroOrigin = useRef<{ brand: number; copy: number; bottom: number } | null>(null);
  const latest = history.at(-1);
  const active = latest && !latest.complete;
  const remaining = scenarios.filter((scenario) => !history.some((exchange) => exchange.kind === scenario.kind));

  function transitionIdle(open: boolean) {
    if (brandBar.current && heroCopy.current && initialChoices.current) {
      idleOrigin.current = {
        brand: brandBar.current.getBoundingClientRect().top,
        copy: heroCopy.current.getBoundingClientRect().top,
        choices: initialChoices.current.getBoundingClientRect().top,
      };
    }
    setIdleLeadOpen(open);
  }

  useLayoutEffect(() => {
    const origin = idleOrigin.current;
    if (!origin || history.length) return;
    idleOrigin.current = null;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const motion = { duration: 600, easing: "cubic-bezier(.22, 1, .36, 1)" };
    for (const [element, top] of [[brandBar.current, origin.brand], [heroCopy.current, origin.copy], [initialChoices.current, origin.choices]] as const) {
      if (!element) continue;
      const distance = top - element.getBoundingClientRect().top;
      element.animate([{ transform: `translateY(${distance}px)` }, { transform: "translateY(0)" }], motion);
    }
  }, [idleLeadOpen, history.length]);

  useEffect(() => {
    if (history.length || idleLeadOffered.current) return;
    let timer: ReturnType<typeof setTimeout>;
    const arm = () => {
      clearTimeout(timer);
      if (document.visibilityState !== "visible") return;
      timer = setTimeout(() => {
        idleLeadOffered.current = true;
        transitionIdle(true);
      }, 4500);
    };
    const events = ["pointermove", "pointerdown", "click", "keydown", "scroll", "touchstart"] as const;
    events.forEach((event) => window.addEventListener(event, arm, { passive: true }));
    document.addEventListener("visibilitychange", arm);
    arm();
    return () => {
      clearTimeout(timer);
      events.forEach((event) => window.removeEventListener(event, arm));
      document.removeEventListener("visibilitychange", arm);
    };
  }, [history.length, idleLeadOpen]);

  useEffect(() => {
    if (history.length) return;
    let animation: Animation | undefined;
    let pressed: { id: number; x: number; y: number } | null = null;
    const wink = (target: EventTarget | null) => {
      if (target instanceof Element && target.closest('[aria-label="Выберите сценарий"] button')) return;
      if (!hintLayer.current) return;
      animation?.cancel();
      animation = hintLayer.current.animate([
        { opacity: 0, offset: 0, easing: "ease-in-out" },
        { opacity: 1, offset: .3 },
        { opacity: 1, offset: .6, easing: "ease-in-out" },
        { opacity: 0, offset: 1 },
      ], { duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 400 : 1200, easing: "linear" });
    };
    const onDown = (event: PointerEvent) => {
      if (event.isPrimary && event.button === 0) pressed = { id: event.pointerId, x: event.clientX, y: event.clientY };
    };
    const onUp = (event: PointerEvent) => {
      if (pressed?.id === event.pointerId && Math.hypot(event.clientX - pressed.x, event.clientY - pressed.y) < 8) wink(event.target);
      pressed = null;
    };
    const onCancel = () => { pressed = null; };
    const onKeyboardClick = (event: MouseEvent) => { if (event.detail === 0) wink(event.target); };
    // Pointer events include the disabled composer, which does not emit clicks.
    window.addEventListener("pointerdown", onDown, true);
    window.addEventListener("pointerup", onUp, true);
    window.addEventListener("pointercancel", onCancel, true);
    window.addEventListener("click", onKeyboardClick, true);
    return () => {
      animation?.cancel();
      window.removeEventListener("pointerdown", onDown, true);
      window.removeEventListener("pointerup", onUp, true);
      window.removeEventListener("pointercancel", onCancel, true);
      window.removeEventListener("click", onKeyboardClick, true);
    };
  }, [history.length]);

  useLayoutEffect(() => {
    const origin = heroOrigin.current;
    if (!origin || history.length !== 1 || !brandBar.current || !heroCopy.current) return;
    heroOrigin.current = null;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const copy = heroCopy.current.getBoundingClientRect();
    const motion = { duration: 600, easing: "cubic-bezier(.22, 1, .36, 1)" };
    const move = (element: HTMLElement | null, distance: number) => element?.animate([{ transform: `translateY(${distance}px)` }, { transform: "translateY(0)" }], motion);
    move(brandBar.current, origin.brand - brandBar.current.getBoundingClientRect().top);
    move(heroCopy.current, origin.copy - copy.top);
    move(historyElement.current, Math.max(0, origin.bottom - copy.bottom));
  }, [history.length]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => {
    const measure = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", measure, { passive: true });
    measure();
    return () => window.removeEventListener("scroll", measure);
  }, []);
  useEffect(() => {
    let resumeTimer: ReturnType<typeof setTimeout> | undefined;
    let touching = false;
    let draggingScrollbar = false;
    const resumeAfterPause = () => {
      clearTimeout(resumeTimer);
      if (touching || draggingScrollbar) return;
      resumeTimer = setTimeout(() => {
        follow.current = true;
        // Catch up only when content arrived during the user's scroll.
        // Browsing an already finished history must not pull the user back down.
        if (pendingFollow.current) setFollowRevision((revision) => revision + 1);
      }, 900);
    };
    const interrupt = () => { follow.current = false; resumeAfterPause(); };
    const onScroll = () => { if (!follow.current) resumeAfterPause(); };
    const onTouchStart = () => { touching = true; interrupt(); };
    const onTouchEnd = () => { touching = false; resumeAfterPause(); };
    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && event.clientX >= document.documentElement.clientWidth - 16) {
        draggingScrollbar = true;
        interrupt();
      }
    };
    const onPointerUp = () => {
      if (!draggingScrollbar) return;
      draggingScrollbar = false;
      resumeAfterPause();
    };
    const onKey = (event: KeyboardEvent) => {
      const editing = event.target instanceof HTMLElement && (event.target.matches("input, textarea, select") || event.target.isContentEditable);
      if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(event.key) && !editing) interrupt();
    };
    window.addEventListener("wheel", interrupt, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", interrupt, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    window.addEventListener("pointercancel", onPointerUp, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(resumeTimer);
      window.removeEventListener("wheel", interrupt);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", interrupt);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      window.removeEventListener("keydown", onKey);
    };
  }, []);
  useEffect(() => {
    if (!history.length) return;
    let frame = 0;
    const scrollToLatest = () => {
      if (!follow.current) { pendingFollow.current = true; return; }
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (!follow.current) { pendingFollow.current = true; return; }
        pendingFollow.current = false;
        const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth";
        if (lead.current?.contains(document.activeElement)) return;
        if (history.at(-1)?.complete && leadScrollReady && lead.current) {
          const anchor = more.current ?? lead.current;
          const pinned = window.matchMedia("(max-width: 700px)").matches ? brandBar.current : header.current;
          const top = anchor.getBoundingClientRect().top + window.scrollY - (pinned?.offsetHeight ?? 0) - 56;
          window.scrollTo({ top: Math.max(0, top), behavior });
        } else if (history.at(-1)?.complete && suggestionsVisible && next.current) {
          // Leave the conclusion above the suggestions, with the lead heading below them.
          window.scrollTo({ top: Math.max(0, next.current.getBoundingClientRect().top + window.scrollY - window.innerHeight * .5), behavior });
        } else tail.current?.scrollIntoView({ behavior, block: "end" });
      });
    };
    scrollToLatest();
    const content = historyElement.current;
    let height = content?.getBoundingClientRect().height ?? 0;
    const observer = new ResizeObserver(([entry]) => {
      if (Math.abs(entry.contentRect.height - height) < 1) return;
      height = entry.contentRect.height;
      scrollToLatest();
    });
    if (content) observer.observe(content);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); };
  }, [history, followRevision, suggestionsVisible, leadScrollReady]);


  function begin(kind: Kind) {
    if (running.current || history.some((exchange) => exchange.kind === kind)) return;
    running.current = true;
    setIdleLeadOpen(false);
    setLeadScrollReady(false);
    if (!history.length && brandBar.current && heroCopy.current) {
      const copy = heroCopy.current.getBoundingClientRect();
      heroOrigin.current = { brand: brandBar.current.getBoundingClientRect().top, copy: copy.top, bottom: copy.bottom };
    }
    follow.current = true;
    pendingFollow.current = false;
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setCompletionStage(0);
    const entry: Exchange = { kind, startedAt: Date.now(), phase: 0, count: 0, complete: false, articles: kind === "news" ? [...articles] : [] };
    setHistory((current) => [...current, entry]);
    const update = (values: Partial<Exchange>) => setHistory((current) => current.map((exchange) => exchange.startedAt === entry.startedAt ? { ...exchange, ...values } : exchange));
    const after = (time: number, callback: () => void) => timers.current.push(setTimeout(callback, time));
    const finish = () => {
      running.current = false;
      update({ phase: 4, complete: true });
      after(600, () => setCompletionStage(1));
      after(1250, () => setCompletionStage(2));
      after(3000 + Math.round(Math.random() * 500), () => {
        if (!lead.current?.contains(document.activeElement)) setLeadScrollReady(true);
      });
    };
    const scenario = scenarios.find((item) => item.kind === kind)!;
    scheduleScenario(entry, scenario, window.matchMedia("(prefers-reduced-motion: reduce)").matches, update, after, finish);
  }

  return <><section className={`${styles.page} ${history.length ? styles.started : styles.landing} ${!history.length && idleLeadOpen ? styles.idleLanding : ""} ${leadScrollReady ? styles.outroFocused : ""} ${scrolled ? styles.scrolled : ""}`} aria-label="Демо сценариев GigaCowork">
    <header ref={header} className={styles.header}>
      <div ref={brandBar} className={styles.brandBar}><Brands /></div>
      <div ref={heroCopy} className={styles.heroCopy}><h1>Читайте главное,<br /><span>делегируйте остальное</span></h1><p>ИИ-агенты GigaCowork возьмут рабочие задачи на себя</p></div>
    </header>
    {!history.length ? <div className={styles.start}>
      <Choices remaining={scenarios} onChoose={begin} hintRef={hintLayer} containerRef={initialChoices} initial />
      {idleLeadOpen ? <section className={`${styles.lead} ${styles.landingLead}`} aria-label="Бесплатный месяц GigaCowork"><LeadContent idPrefix="kommersant-idle" /></section> : <Composer />}
    </div> : <>
      <div ref={historyElement} className={styles.history} aria-label="История чата" aria-busy={Boolean(active)}>
        {history.map((exchange, index) => {
          const scenario = scenarios.find((item) => item.kind === exchange.kind)!;
          return <section className={styles.exchange} key={exchange.startedAt} aria-label={scenario.label}>
            <Request scenario={scenario} />
            {index === 0 && <hr className={styles.divider} />}
            <Answer exchange={exchange} scenario={scenario} />
          </section>;
        })}
      </div>
      <div ref={tail} className={styles.tail} />
      <div ref={next} className={styles.next} hidden={Boolean(active) || completionStage === 0}>
        {remaining.length > 0 && <section ref={more} className={styles.more}><p className={styles.status}>Что еще могут ИИ-агенты?</p><Choices remaining={remaining} onChoose={begin} /></section>}
        <section ref={lead} className={styles.lead} hidden={completionStage < 2} aria-label="Бесплатный месяц GigaCowork">
          <LeadContent idPrefix="kommersant-scenarios" />
        </section>
      </div>
    </>}
  </section>
    <MiniFooter key={history.length} enabled={!history.length || (!active && completionStage === 2)}>{footer}</MiniFooter></>;
}
