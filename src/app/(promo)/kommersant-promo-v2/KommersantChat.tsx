"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { asset } from "@/lib/asset";
import { Icon } from "@/components/ui/Icon";
import styles from "./promo-v2.module.css";

type Article = { id: string; title: string; summary: string; url: string; publishedAt: string };
type Digest = { version: number; source: string; checkedAt: string | null; status: "ok" | "waiting"; items: Article[] };

const PROMPT = "Что нового на kommersant.ru";

function nextArticleDelay(previousDelay: number | null): number {
  const delay = 1500 + Math.round(Math.random() * 1000);
  if (previousDelay === null || Math.abs(delay - previousDelay) >= 200) return delay;
  const variation = 250 + Math.round(Math.random() * 250);
  return previousDelay < 2000
    ? Math.min(2500, previousDelay + variation)
    : Math.max(1500, previousDelay - variation);
}

const suggestions = [
  { icon: "file-stack", label: "Подготовить и проверить документ", href: "/use_cases/legal-team/#application" },
  { icon: "file-chart", label: "Собрать и проанализировать данные", href: "/use_cases/ceo/#solutions" },
  { icon: "presentation", label: "Разобраться в новой теме", href: "/use_cases/ceo/#market-overview" },
  { icon: "spec", label: "Спланировать проект", source: "site", href: "/use_cases/salesforce/#meeting-action-plan" },
  { icon: "commercial-offer", label: "Подготовить коммерческое предложение", source: "site", href: "/use_cases/salesforce/#commercial-proposals" },
  { icon: "knowledge-base", label: "Найти ответы в базе знаний", source: "site", href: "/use_cases/legal-team/#knowledge-base-search" },
];
const personalEmailDomains = new Set([
  "gmail.com", "googlemail.com", "mail.ru", "bk.ru", "list.ru", "inbox.ru", "internet.ru",
  "yandex.ru", "yandex.com", "ya.ru", "rambler.ru", "rambler.ua", "yahoo.com",
  "outlook.com", "hotmail.com", "live.com", "msn.com", "icloud.com", "me.com",
  "proton.me", "protonmail.com", "tuta.com", "tutanota.com", "aol.com",
  "gmx.com", "gmx.de", "web.de", "qq.com", "163.com", "126.com",
]);

function workEmailError(value: string): string {
  const email = value.trim().toLowerCase();
  if (!email) return "Введите рабочий email";
  if (email.length > 254 || !/^[^\s@]{1,64}@[a-z0-9а-яё-]+(?:\.[a-z0-9а-яё-]+)+$/i.test(email))
    return "Проверьте адрес: например, name@company.ru";
  const domain = email.slice(email.lastIndexOf("@") + 1);
  const labels = domain.split(".");
  if (labels.some((label) => label.startsWith("-") || label.endsWith("-")) || labels.at(-1)!.length < 2)
    return "Проверьте адрес: например, name@company.ru";
  if (personalEmailDomains.has(domain)) return "Укажите почту на домене компании";
  return "";
}
const timeFormatter = new Intl.DateTimeFormat("ru-RU", {
  timeZone: "Europe/Moscow", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit",
});
const shortTimeFormatter = new Intl.DateTimeFormat("ru-RU", {
  timeZone: "Europe/Moscow", hour: "2-digit", minute: "2-digit",
});

function isDigest(value: unknown): value is Digest {
  if (!value || typeof value !== "object") return false;
  const data = value as Partial<Digest>;
  return data.version === 1 && (data.status === "ok" || data.status === "waiting")
    && Array.isArray(data.items) && data.items.every((item) => {
      try {
        const url = new URL(item.url);
        return url.protocol === "https:" && ["kommersant.ru", "www.kommersant.ru"].includes(url.hostname)
          && typeof item.title === "string" && typeof item.summary === "string"
          && Number.isFinite(Date.parse(item.publishedAt));
      } catch { return false; }
    });
}

function FigmaIcon({ name, size }: { name: string; size?: number }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={asset(`/img/kommersant-promo-v2/${name}.svg`)} width={size} height={size} alt="" />;
}

function BrandPair() {
  return (
    <div className={styles.brandPair} role="img" aria-label="Коммерсантъ и GigaCowork">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={asset("/img/kommersant-promo-v2/logo-kommersant.svg")} alt="" />
      <span aria-hidden="true">×</span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={asset("/img/kommersant-promo/logo-figma.svg")} alt="" />
    </div>
  );
}

function HeroCopy({ inFeed = false }: { inFeed?: boolean }) {
  return (
    <>
      <h1 className={`${styles.heroTitle} ${inFeed ? styles.feedHeading : ""}`}>
        Читайте главное,<br />делегируйте остальное.
      </h1>
      <p className={`${styles.heroSubtitle} ${inFeed ? styles.feedSubtitle : ""}`}>
        ИИ-агенты GigaCowork возьмут рабочие задачи на себя.
      </p>
    </>
  );
}

export function KommersantChat({ initialDigest }: { initialDigest: unknown }) {
  const [digest, setDigest] = useState<Digest>(() => isDigest(initialDigest) ? initialDigest : {
    version: 1, source: "", checkedAt: null, status: "waiting", items: [],
  });
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [pressing, setPressing] = useState(false);
  const [submittedAt, setSubmittedAt] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(0);
  const [dockAnimationDone, setDockAnimationDone] = useState(false);
  const [docked, setDocked] = useState(false);
  const [showHelpers, setShowHelpers] = useState(false);
  const [leadProgress, setLeadProgress] = useState(0);
  const animatedLeadProgress = useRef(0);
  const [leadRequestId, setLeadRequestId] = useState(0);
  const leadRequested = leadRequestId > 0;
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const heroOrigin = useRef<DOMRect[]>([]);
  const previousEmailMode = useRef(false);
  const emailDraft = useRef("");
  const chatDraft = useRef("");
  const userEdited = useRef(false);
  const autoFollow = useRef(true);
  const leadRevealed = useRef(false);
  const handledLeadRequest = useRef(0);
  const sendTimer = useRef<number | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const articleListRef = useRef<HTMLDivElement>(null);
  const updatedRef = useRef<HTMLParagraphElement>(null);
  const composerRef = useRef<HTMLDivElement>(null);
  const dockSlotRef = useRef<HTMLDivElement>(null);
  const feedHeroRef = useRef<HTMLDivElement>(null);
  const mobileBrandRef = useRef<HTMLDivElement>(null);
  const feedResponseRef = useRef<HTMLDivElement>(null);

  const scrollToLead = useCallback(() => {
    const slot = dockSlotRef.current;
    const composer = composerRef.current;
    if (!slot || !composer) return;
    const style = getComputedStyle(slot);
    const noticeSpace = parseFloat(style.getPropertyValue("--notice-space")) || 160;
    const panelHeight = parseFloat(style.getPropertyValue("--notice-panel-height")) || 128;
    const panelPadding = parseFloat(style.getPropertyValue("--glass-vertical-pad")) || 24;
    const consentSpace = parseFloat(style.getPropertyValue("--consent-space-target")) || 56;
    const header = window.innerWidth <= 700 ? mobileBrandRef.current : feedHeroRef.current;
    const headerBottom = Math.max(0, header?.getBoundingClientRect().bottom ?? 0);
    const chatHeight = composer.querySelector<HTMLElement>("form")?.offsetHeight ?? 148;
    const composerTop = Math.min(headerBottom + 24 + panelHeight + panelPadding,
      window.innerHeight - chatHeight - consentSpace - 40);
    const target = window.scrollY + slot.getBoundingClientRect().top + noticeSpace - composerTop;
    leadRevealed.current = true;
    window.scrollTo({ top: Math.max(0, target),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }, []);

  const captureHeroOrigin = () => {
    heroOrigin.current = Array.from(introRef.current?.querySelectorAll<HTMLElement>('[role="img"], h1, p') ?? [])
      .map((node) => node.getBoundingClientRect());
  };

  useEffect(() => {
    if (previousEmailMode.current === showHelpers || emailSubmitted) return;
    previousEmailMode.current = showHelpers;
    setText((current) => {
      if (showHelpers) {
        chatDraft.current = current;
        return emailDraft.current;
      }
      emailDraft.current = current;
      return chatDraft.current;
    });
    inputRef.current?.blur();
  }, [showHelpers, emailSubmitted]);

  useLayoutEffect(() => {
    if (!submitted || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const targets = [
      (window.innerWidth <= 700 ? mobileBrandRef.current : feedHeroRef.current)?.querySelector<HTMLElement>('[role="img"]'),
      feedHeroRef.current?.querySelector<HTMLElement>('h1'),
      feedHeroRef.current?.querySelector<HTMLElement>('p'),
    ];
    const animations = targets.map((node, index) => {
      const origin = heroOrigin.current[index];
      if (!node || !origin) return null;
      const target = node.getBoundingClientRect();
      const x = origin.left + origin.width / 2 - target.left - target.width / 2;
      const y = origin.top - target.top;
      const scale = index === 0 || window.innerWidth <= 700 ? 1 : 1.5;
      return node.animate([
        { transform: `translate(${x}px, ${y}px) scale(${scale})` },
        { transform: 'translate(0, 0) scale(1)' },
      ], { duration: 750, easing: 'cubic-bezier(.22, 1, .36, 1)', fill: 'both' });
    });
    const response = feedResponseRef.current;
    const subtitleOrigin = heroOrigin.current[2];
    const message = response?.querySelector<HTMLElement>(`.${styles.userMessage}`);
    if (response && subtitleOrigin && message) {
      const offset = subtitleOrigin.bottom + 32 - message.getBoundingClientRect().top;
      animations.push(response.animate([
        { transform: `translateY(${offset}px)` },
        { transform: 'translateY(0)' },
      ], { duration: 750, easing: 'cubic-bezier(.22, 1, .36, 1)', fill: 'both' }));
    }
    return () => animations.forEach((animation) => animation?.cancel());
  }, [submitted]);

  useEffect(() => {
    window.scrollTo(0, 0);
    let interval = 0;
    let finish = 0;
    const start = window.setTimeout(() => {
      let count = 0;
      interval = window.setInterval(() => {
        if (userEdited.current) { window.clearInterval(interval); return; }
        count += 1;
        setText(PROMPT.slice(0, count));
        if (count >= PROMPT.length) {
          window.clearInterval(interval);
          finish = window.setTimeout(() => {
            if (!userEdited.current) {
              setPressing(true);
              setSubmittedAt(Date.now());
              sendTimer.current = window.setTimeout(() => {
                captureHeroOrigin();
                setSubmitted(true);
                setText("");
                setPressing(false);
              }, 180);
            }
          }, 360);
        }
      }, 54);
    }, 1800);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(interval);
      window.clearTimeout(finish);
      if (sendTimer.current !== null) window.clearTimeout(sendTimer.current);
    };
  }, []);

  const articleCount = Math.min(digest.items.length, 6);

  useEffect(() => {
    if (!submitted) return;
    const dockTimer = window.setTimeout(() => setDockAnimationDone(true), 720);
    if (leadRequested) {
      setVisibleCount(articleCount);
      return () => window.clearTimeout(dockTimer);
    }
    if (articleCount === 0) return () => window.clearTimeout(dockTimer);
    let count = 0;
    let previousDelay: number | null = null;
    let revealTimer = 0;
    const revealNext = () => {
      const delay = nextArticleDelay(previousDelay);
      previousDelay = delay;
      revealTimer = window.setTimeout(() => {
        count += 1;
        setVisibleCount(count);
        if (count < articleCount) revealNext();
      }, delay);
    };
    revealNext();
    return () => { window.clearTimeout(revealTimer); window.clearTimeout(dockTimer); };
  }, [submitted, articleCount, leadRequested]);

  useEffect(() => {
    if (!submitted) return;
    const stopFollowing = () => { autoFollow.current = false; };
    const updateHeader = () => setHeaderScrolled(window.scrollY > 4);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    window.addEventListener("wheel", stopFollowing, { passive: true });
    window.addEventListener("touchstart", stopFollowing, { passive: true });
    window.addEventListener("pointerdown", stopFollowing, { passive: true });
    return () => {
      window.removeEventListener("scroll", updateHeader);
      window.removeEventListener("wheel", stopFollowing);
      window.removeEventListener("touchstart", stopFollowing);
      window.removeEventListener("pointerdown", stopFollowing);
    };
  }, [submitted]);

  useEffect(() => {
    if (!submitted || !visibleCount || !autoFollow.current) return;
    const frame = window.requestAnimationFrame(() => {
      const lastArticle = articleListRef.current?.lastElementChild;
      const composer = composerRef.current;
      if (!lastArticle || !composer || !autoFollow.current) return;
      const bottomLimit = window.innerHeight - composer.offsetHeight - 32;
      const lastContent = updatedRef.current ?? lastArticle;
      const nextScroll = window.scrollY + lastContent.getBoundingClientRect().bottom - bottomLimit;
      if (nextScroll > window.scrollY + 2) {
        window.scrollTo({
          top: nextScroll,
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
        });
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [submitted, visibleCount]);

  useEffect(() => {
    if (!submitted || !dockAnimationDone || visibleCount < articleCount) return;
    let frame = 0;
    const check = () => {
      frame = 0;
      const slot = dockSlotRef.current;
      const composer = composerRef.current;
      if (!slot || !composer) return;
      const safeBottom = 16;
      const consentSpace = emailSubmitted ? 0 : (parseFloat(getComputedStyle(slot).getPropertyValue("--consent-space-target")) || 56);
      const chatHeight = composer.querySelector<HTMLElement>('form')?.offsetHeight ?? 148;
      const dockTop = window.innerHeight - chatHeight - safeBottom - consentSpace;
      const noticeSpace = parseFloat(getComputedStyle(slot).getPropertyValue("--notice-space")) || 88;
      const slotTop = slot.getBoundingClientRect().top + noticeSpace;
      const reachedLastCard = slotTop <= dockTop + 1;
      setDocked(reachedLastCard);
      // Separate entry/exit thresholds prevent wheel jitter from flipping the form state.
      setShowHelpers((current) => window.scrollY > 24 && slotTop <= dockTop + (current ? 90 : 45));
    };
    const onScroll = () => { if (!frame) frame = window.requestAnimationFrame(check); };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [submitted, dockAnimationDone, visibleCount, articleCount, emailSubmitted, showHelpers]);

  useEffect(() => {
    const target = showHelpers && !emailSubmitted ? 1 : 0;
    const origin = animatedLeadProgress.current;
    if (origin === target) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      animatedLeadProgress.current = target;
      setLeadProgress(target);
      return;
    }
    let frame = 0;
    const startedAt = performance.now();
    const animate = (now: number) => {
      const elapsed = Math.min(1, (now - startedAt) / 650);
      const eased = elapsed * elapsed * (3 - 2 * elapsed);
      const value = origin + (target - origin) * eased;
      animatedLeadProgress.current = value;
      setLeadProgress(value);
      if (elapsed < 1) frame = window.requestAnimationFrame(animate);
    };
    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, [showHelpers, emailSubmitted]);

  useEffect(() => {
    if (leadProgress >= 1) leadRevealed.current = true;
  }, [leadProgress]);

  useEffect(() => {
    if (!leadRequested || !dockAnimationDone || visibleCount < articleCount || handledLeadRequest.current === leadRequestId) return;
    const timer = window.setTimeout(() => {
      handledLeadRequest.current = leadRequestId;
      scrollToLead();
    }, 280);
    return () => window.clearTimeout(timer);
  }, [leadRequested, leadRequestId, dockAnimationDone, visibleCount, articleCount, scrollToLead]);

  useEffect(() => {
    if (!submitted || !articleCount || visibleCount < articleCount || emailSubmitted || leadRequested || leadRevealed.current) return;
    let timer = 0;
    const revealLead = () => {
      if (leadRevealed.current || document.visibilityState !== "visible") return;
      const composer = composerRef.current;
      if (!composer || composer.contains(document.activeElement)) return;
      scrollToLead();
    };
    const resetTimer = () => {
      window.clearTimeout(timer);
      if (!leadRevealed.current) timer = window.setTimeout(revealLead, 5000);
    };
    timer = window.setTimeout(revealLead, 5280);
    window.addEventListener("scroll", resetTimer, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", resetTimer);
    };
  }, [submitted, articleCount, visibleCount, emailSubmitted, leadRequested, scrollToLead]);

  useEffect(() => {
    let active = true;
    const refresh = async () => {
      try {
        const response = await fetch(`${asset("/data/kommersant-promo-v2.json")}?v=${Date.now()}`, { cache: "no-store" });
        if (!response.ok) return;
        const latest: unknown = await response.json();
        if (active && isDigest(latest)) setDigest((current) =>
          Date.parse(latest.checkedAt ?? "") >= (Date.parse(current.checkedAt ?? "") || 0) ? latest : current);
      } catch { /* The last valid issue stays visible during network errors. */ }
    };
    void refresh();
    const interval = window.setInterval(() => void refresh(), 5 * 60 * 1000);
    const onVisible = () => { if (document.visibilityState === "visible") void refresh(); };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      active = false;
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  const interruptAuto = () => {
    userEdited.current = true;
    if (sendTimer.current !== null) window.clearTimeout(sendTimer.current);
    setPressing(false);
  };

  const send = () => {
    if (!submitted) return;
    const prompt = text.trim();
    if (!prompt) return;
    if (showHelpers) {
      if (workEmailError(prompt) || emailSubmitted) return;
      // Prototype state only: connect a dedicated lead endpoint before collecting addresses.
      setEmailSubmitted(true);
      setText("");
      inputRef.current?.blur();
      return;
    }
    userEdited.current = true;
    autoFollow.current = false;
    setPressing(true);
    setText("");
    chatDraft.current = "";
    if (sendTimer.current !== null) window.clearTimeout(sendTimer.current);
    sendTimer.current = window.setTimeout(() => {
      if (!submitted) {
        captureHeroOrigin();
        setSubmittedAt(Date.now());
        setSubmitted(true);
      }
      setLeadRequestId((current) => current + 1);
      setPressing(false);
    }, 180);
    inputRef.current?.blur();
  };

  const articles = digest.items.slice(0, 6);
  const checkedAt = submittedAt === null ? null : timeFormatter.format(new Date(submittedAt));
  const emailError = showHelpers && text.trim() ? workEmailError(text) : "";
  const canSend = submitted && !pressing && Boolean(text.trim()) && (!showHelpers || !emailError);

  return (
    <section style={{ "--lead-progress": emailSubmitted ? 0 : leadProgress } as CSSProperties} className={`${styles.page} ${submitted ? styles.hasResults : ""} ${dockAnimationDone ? styles.dockReady : ""} ${docked ? styles.docked : ""} ${showHelpers ? styles.helpersVisible : ""} ${leadProgress > 0 ? styles.leadTransition : ""} ${emailSubmitted ? styles.emailSubmitted : ""} ${headerScrolled ? styles.headerScrolled : ""}`} aria-label="Демо чата GigaCowork">
      <div className={styles.intro} ref={introRef} aria-hidden={submitted}>
        <BrandPair />
        <HeroCopy />
      </div>

      {submitted && (
        <div className={styles.feed} aria-live="polite">
          <div className={styles.mobileFeedBrand} ref={mobileBrandRef}><BrandPair /></div>
          <div className={styles.feedHero} ref={feedHeroRef}>
            <BrandPair />
            <HeroCopy inFeed />
          </div>
          <div ref={feedResponseRef}>
          <div className={styles.userMessage}>{PROMPT}</div>
          <hr className={styles.answerDivider} />
          <p className={styles.answerIntro}>
            {articles.length
              ? "Вот самое актуальное для бизнеса — события, которые стоит держать в фокусе."
              : "Пока не удалось загрузить публикации. Попробуйте обновить страницу чуть позже."}
          </p>
          <div className={styles.articleList} ref={articleListRef}>
            {articles.slice(0, visibleCount).map((article) => (
              <article className={styles.article} key={article.id}>
                <span className={styles.articleBody}>
                  <span className={styles.articleMeta}>Коммерсантъ · {shortTimeFormatter.format(new Date(article.publishedAt))} МСК</span>
                  <strong>{article.title}</strong>
                  <span className={styles.articleSummary}>
                    {article.summary}{" "}
                    <a className={styles.articleLink} href={article.url} target="_blank" rel="noopener noreferrer" aria-label={`Подробнее: ${article.title}`}>
                      Подробнее
                    </a>
                  </span>
                </span>
              </article>
            ))}
          </div>
          {checkedAt && visibleCount >= articles.length && (
            <p className={styles.updated} ref={updatedRef}>Лента проверена {checkedAt} МСК</p>
          )}
          </div>
        </div>
      )}

      <div className={styles.dockSlot} ref={dockSlotRef}>
      <div className={styles.composerDock} ref={composerRef}>
        {emailSubmitted ? (
          <div className={styles.successBanner} role="status">
            <svg className={styles.successIcon} width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
              <circle cx="24" cy="24" r="18.4" stroke="currentColor" strokeWidth="3.2" />
              <path d="m15.8 24.6 5.8 5.8 10.6-11.8" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div>
              <strong>Заявка отправлена</strong>
              <p>Мы свяжемся с вами по указанной почте и расскажем о специальных условиях.</p>
            </div>
          </div>
        ) : (
        <>
        <div className={styles.systemNotice} role="status" aria-hidden={!docked || !showHelpers}>
          <strong>1 месяц – за наш счёт</strong>
          <p>Оставьте email и делегируйте рабочие задачи ИИ-агентам в GigaCowork бесплатно в течение месяца</p>
          {emailError && <span className={styles.noticeError}>{emailError}</span>}
        </div>
        <form className={`${styles.chatInput} ${showHelpers ? styles.emailInput : ""}`} onSubmit={(event) => { event.preventDefault(); send(); }}>
          <div className={styles.inputMain}>
            <textarea
              ref={inputRef}
              rows={1}
              value={text}
              disabled={!submitted}
              onFocus={interruptAuto}
              onChange={(event) => { interruptAuto(); setText(event.target.value); }}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); send(); }
              }}
              placeholder={showHelpers ? "Введите рабочий email" : "Чем я могу помочь?"}
              aria-label={showHelpers ? "Рабочий email" : "Сообщение чату"}
              inputMode={showHelpers ? "email" : "text"}
              autoComplete={showHelpers ? "email" : "off"}
            />
            <div className={styles.actions}>
              <div className={styles.startActions} aria-hidden="true">
                <span className={styles.iconButton}><FigmaIcon name="plus" /></span>
                <span className={styles.iconButton}><FigmaIcon name="square-slash" /></span>
                <span className={styles.agentBadge}><FigmaIcon name="dog" size={12} /> Агент <FigmaIcon name="chevron-down" size={12} /></span>
              </div>
              <div className={styles.endActions}>
                <span className={styles.iconButton} aria-hidden="true"><FigmaIcon name="microphone" /></span>
                <button type="submit" className={`${styles.sendButton} ${pressing ? styles.pressing : ""}`} disabled={!canSend} aria-label={showHelpers ? "Забрать бесплатный месяц" : "Отправить сообщение"}>
                  <span className={styles.sendArrow} aria-hidden="true"><FigmaIcon name="arrow-up" /></span>
                  <span className={styles.sendLabel} aria-hidden="true">Забрать бесплатный месяц</span>
                </button>
              </div>
            </div>
          </div>
          <div className={styles.connectorRow}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.connectorLogo} src={asset("/img/kommersant-promo/logo-figma.svg")} width="125" height="27" alt="GigaCowork" />
            <span className={styles.connectorCount}><span>+ 40 коннекторов</span><FigmaIcon name="chevrons-down-up" size={20} /></span>
          </div>
        </form>
        {submitted && (
          <p className={styles.consentText} aria-hidden={!docked}>
            Нажимая на&nbsp;кнопку, <a href="https://cowork.ru/legal/soglasie_na_obrabotku_personalnykh_dannykh.pdf" target="_blank" rel="noopener noreferrer">я соглашаюсь</a> на&nbsp;обработку моих персональных данных в&nbsp;соответствии с <a href="https://cowork.ru/legal/politika_konfidentsialnosti.pdf" target="_blank" rel="noopener noreferrer">Политикой конфиденциальности</a>.
          </p>
        )}
        </>
        )}
      </div>
      </div>

      <div className={styles.helpers} aria-hidden={!showHelpers}>
        <p>GigaCowork возьмет на себя вашу рутину</p>
        <div className={styles.suggestionList}>
          {suggestions.map((suggestion) => (
            <a key={suggestion.label} href={asset(suggestion.href)} target="_blank" rel="noopener noreferrer">
              {suggestion.source === "site"
                ? <Icon src={`/img/icons/${suggestion.icon}.svg`} className="size-[20px] text-[#808080]" />
                : <FigmaIcon name={suggestion.icon} size={20} />}
              {suggestion.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
