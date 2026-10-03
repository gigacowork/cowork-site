"use client";

import { useEffect, useRef, useState } from "react";
import { asset } from "@/lib/asset";
import { Icon } from "@/components/ui/Icon";
import styles from "./promo-v2.module.css";

type Article = { id: string; title: string; summary: string; url: string; publishedAt: string };
type Digest = { version: number; source: string; checkedAt: string | null; status: "ok" | "waiting"; items: Article[] };

const PROMPT = "Что нового на kommersant.ru";
const suggestions = [
  { icon: "file-stack", label: "Подготовить и проверить документ" },
  { icon: "file-chart", label: "Собрать и проанализировать данные" },
  { icon: "presentation", label: "Разобраться в новой теме" },
  { icon: "spec", label: "Спланировать проект", source: "site" },
  { icon: "commercial-offer", label: "Подготовить коммерческое предложение", source: "site" },
  { icon: "knowledge-base", label: "Найти ответы в базе знаний", source: "site" },
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

export function KommersantChat({ initialDigest }: { initialDigest: unknown }) {
  const [digest, setDigest] = useState<Digest>(() => isDigest(initialDigest) ? initialDigest : {
    version: 1, source: "", checkedAt: null, status: "waiting", items: [],
  });
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [pressing, setPressing] = useState(false);
  const [sentPrompt, setSentPrompt] = useState(PROMPT);
  const [submittedAt, setSubmittedAt] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(0);
  const [dockAnimationDone, setDockAnimationDone] = useState(false);
  const [docked, setDocked] = useState(false);
  const [showHelpers, setShowHelpers] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [headingInHistory, setHeadingInHistory] = useState(false);
  const userEdited = useRef(false);
  const sendTimer = useRef<number | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const composerRef = useRef<HTMLDivElement>(null);
  const dockSlotRef = useRef<HTMLDivElement>(null);

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
                setSentPrompt(PROMPT);
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
    if (articleCount === 0) return () => window.clearTimeout(dockTimer);
    let count = 1;
    setVisibleCount(1);
    const interval = articleCount > 1 ? window.setInterval(() => {
      count += 1;
      setVisibleCount(count);
      if (count >= articleCount) window.clearInterval(interval);
    }, 340) : 0;
    return () => { window.clearInterval(interval); window.clearTimeout(dockTimer); };
  }, [submitted, articleCount]);

  useEffect(() => {
    if (!submitted || !dockAnimationDone || visibleCount < articleCount) return;
    let frame = 0;
    const check = () => {
      frame = 0;
      const slot = dockSlotRef.current;
      const composer = composerRef.current;
      if (!slot || !composer) return;
      const safeBottom = 16;
      const consentSpace = parseFloat(getComputedStyle(slot).getPropertyValue("--consent-space-target")) || 56;
      const dockTop = window.innerHeight - composer.getBoundingClientRect().height - safeBottom
        - (showHelpers ? 0 : consentSpace);
      const noticeSpace = parseFloat(getComputedStyle(slot).getPropertyValue("--notice-space")) || 88;
      const reachedLastCard = slot.getBoundingClientRect().top + noticeSpace <= dockTop + 1;
      setDocked(reachedLastCard);
      if (reachedLastCard && window.scrollY > 24) setShowHelpers(true);
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
    if (!submitted) return;
    const check = () => { if (window.scrollY > 150) setHeadingInHistory(true); };
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, [submitted]);

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
    setPressing(true);
    setSubmittedAt(Date.now());
    if (sendTimer.current !== null) window.clearTimeout(sendTimer.current);
    sendTimer.current = window.setTimeout(() => {
      setSentPrompt(prompt);
      setSubmitted(true);
      setText("");
      setPressing(false);
    }, 180);
    inputRef.current?.blur();
  };

  const articles = digest.items.slice(0, 6);
  const checkedAt = submittedAt === null ? null : timeFormatter.format(new Date(submittedAt));
  const emailError = showHelpers && text.trim() ? workEmailError(text) : "";
  const canSend = !pressing && Boolean(text.trim()) && (!showHelpers || !emailError);

  return (
    <section className={`${styles.page} ${submitted ? styles.hasResults : ""} ${dockAnimationDone ? styles.dockReady : ""} ${docked ? styles.docked : ""} ${showHelpers ? styles.helpersVisible : ""} ${emailSubmitted ? styles.emailSubmitted : ""} ${headingInHistory ? styles.headingInHistory : ""}`} aria-label="Демо чата GigaCowork">
      <div className={styles.intro} aria-hidden={submitted}>
        <h1>А все остальное делегируйте <span className={styles.noWrap}>ИИ-агентам</span> в GigaCowork</h1>
      </div>

      {submitted && (
        <div className={styles.feed} aria-live="polite">
          <h1 className={styles.feedHeading}>А все остальное делегируйте <span className={styles.noWrap}>ИИ-агентам</span> в GigaCowork</h1>
          <div className={styles.userMessage}>{sentPrompt}</div>
          <p className={styles.answerIntro}>
            {articles.length
              ? "Вот самое актуальное для бизнеса — события, которые стоит держать в фокусе."
              : "Пока не удалось загрузить публикации. Попробуйте обновить страницу чуть позже."}
          </p>
          {checkedAt && <p className={styles.updated}>Лента проверена {checkedAt} МСК</p>}
          <div className={styles.articleList}>
            {articles.slice(0, visibleCount).map((article) => (
              <article className={styles.article} key={article.id}>
                <span className={styles.articleBody}>
                  <span className={styles.articleMeta}>Коммерсантъ · {shortTimeFormatter.format(new Date(article.publishedAt))} МСК</span>
                  <strong>{article.title}</strong>
                  <span className={styles.articleSummary}>{article.summary}</span>
                </span>
                <a className={styles.articleLink} href={article.url} target="_blank" rel="noopener noreferrer" aria-label={`Открыть статью: ${article.title}`}>
                  <Icon src="/img/icons/arrow-next.svg" className="size-[20px] text-icon-primary" />
                </a>
              </article>
            ))}
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
          <strong>Оставь рабочий email чтобы получить специальные условия</strong>
          {emailError && <span className={styles.noticeError}>{emailError}</span>}
        </div>
        <form className={`${styles.chatInput} ${showHelpers && text.trim() ? styles.emailInput : ""}`} onSubmit={(event) => { event.preventDefault(); send(); }}>
          <div className={styles.inputMain}>
            <textarea
              ref={inputRef}
              rows={1}
              value={text}
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
                <button type="submit" className={`${styles.sendButton} ${showHelpers && text.trim() ? styles.emailSubmit : ""} ${pressing ? styles.pressing : ""}`} disabled={!canSend} aria-label={showHelpers ? "Отправить рабочий email" : "Отправить сообщение"}>
                  {showHelpers && text.trim() ? "Отправить" : <FigmaIcon name="arrow-up" />}
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
        {showHelpers && (
          <p className={styles.consentText} aria-hidden={!docked}>
            Нажимая на&nbsp;кнопку, <a href="https://cowork.ru/legal/soglasie_na_obrabotku_personalnykh_dannykh.pdf" target="_blank" rel="noopener noreferrer">я соглашаюсь</a> на&nbsp;обработку моих персональных данных в&nbsp;соответствии с <a href="https://cowork.ru/legal/politika_konfidentsialnosti.pdf" target="_blank" rel="noopener noreferrer">Политикой конфиденциальности</a>.
          </p>
        )}
        </>
        )}
      </div>
      </div>

      <div className={styles.helpers} aria-hidden={!showHelpers}>
        <p>А еще GigaCowork поможет:</p>
        <div className={styles.suggestionList}>
          {suggestions.map((suggestion) => (
            <span key={suggestion.label}>
              {suggestion.source === "site"
                ? <Icon src={`/img/icons/${suggestion.icon}.svg`} className="size-[20px] text-[#808080]" />
                : <FigmaIcon name={suggestion.icon} size={20} />}
              {suggestion.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
