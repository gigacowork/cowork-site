"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { MiniFooter } from "./MiniFooter";
import LeadForm from "@/components/sections/LeadForm";
import { Icon } from "@/components/ui/Icon";
import { asset } from "@/lib/asset";
import styles from "./scenarios.module.css";

type Kind = "news" | "contract" | "offers" | "report";
type Article = { id: string; title: string; summary: string; url: string; publishedAt: string };
type Attachment = { name: string; size: string };
type Scenario = { kind: Kind; label: string; initialLabel: string; icon: string; prompt: string; status: string; files: Attachment[] };
type Exchange = { kind: Kind; startedAt: number; phase: number; count: number; complete: boolean; articles: Article[] };

const scenarios: Scenario[] = [
  { kind: "news", initialLabel: "Дайджест новостей", label: "Собрать дайджест новостей", icon: "newspaper", prompt: "Собери обзор главных бизнес-новостей на kommersant.ru", status: "Собираю обзор бизнес-новостей", files: [] },
  { kind: "contract", initialLabel: "Проверка договора", label: "Проверить договор", icon: "file-check", prompt: "Проверь договор по чек-листу компании и выдели спорные условия", status: "Проверяю условия договора", files: [{ name: "Договор.pdf", size: "128 КБ" }, { name: "Чек-лист компании.pdf", size: "32 КБ" }] },
  { kind: "offers", initialLabel: "Анализ КП", label: "Проанализировать КП", icon: "files-compare", prompt: "Сравни предложения поставщиков по стоимости, комплектации и срокам", status: "Сравниваю условия предложений", files: [{ name: "КП поставщика А.pdf", size: "84 КБ" }, { name: "КП поставщика Б.pdf", size: "96 КБ" }, { name: "КП поставщика В.pdf", size: "72 КБ" }] },
  { kind: "report", initialLabel: "Подготовка отчета", label: "Подготовить отчет", icon: "file-chart", prompt: "Подготовь отчет для руководителя по данным amoCRM и 1С в формате XLSX", status: "Подключаюсь к amoCRM и 1С", files: [] },
];

const publishedTime = new Intl.DateTimeFormat("ru-RU", { timeZone: "Europe/Moscow", hour: "2-digit", minute: "2-digit" });
const checkedTime = new Intl.DateTimeFormat("ru-RU", { timeZone: "Europe/Moscow", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });
function checkedLabel(time: number) {
  const parts = checkedTime.formatToParts(time);
  const part = (type: string) => parts.find((value) => value.type === type)?.value ?? "";
  return `Лента проверена ${part("day")} ${part("month")} в ${part("hour")}:${part("minute")} МСК`;
}
function articlesFrom(value: unknown): Article[] | null {
  if (!value || typeof value !== "object" || !("items" in value) || !Array.isArray(value.items)) return null;
  const items = value.items.filter((item): item is Article => {
    if (!item || typeof item !== "object") return false;
    try {
      const url = new URL(item.url);
      return url.protocol === "https:" && ["kommersant.ru", "www.kommersant.ru"].includes(url.hostname)
        && typeof item.title === "string" && typeof item.summary === "string" && Number.isFinite(Date.parse(item.publishedAt));
    } catch { return false; }
  });
  return items.slice(0, 6);
}
const personalDomains = new Set(["gmail.com", "googlemail.com", "mail.ru", "bk.ru", "list.ru", "inbox.ru", "internet.ru", "yandex.ru", "yandex.com", "ya.ru", "rambler.ru", "yahoo.com", "outlook.com", "hotmail.com", "live.com", "msn.com", "icloud.com", "me.com", "proton.me", "protonmail.com", "tuta.com", "tutanota.com", "aol.com", "gmx.com", "gmx.de", "web.de", "qq.com", "163.com", "126.com"]);
function workEmailError(value: string) {
  const email = value.trim().toLowerCase();
  if (!/^[^\s@]{1,64}@[a-z0-9а-яё-]+(?:\.[a-z0-9а-яё-]+)+$/i.test(email) || email.length > 254) return "Проверьте адрес: например, name@company.ru";
  const domain = email.split("@")[1];
  if (domain.split(".").some((label) => label.startsWith("-") || label.endsWith("-")) || domain.split(".").at(-1)!.length < 2) return "Проверьте адрес: например, name@company.ru";
  return personalDomains.has(domain) ? "Укажите почту на домене компании" : "";
}

function LeadContent({ idPrefix }: { idPrefix: string }) {
  const [sent, setSent] = useState(false);
  return <>
    {!sent && <div className={styles.leadCopy}><h2>Делегируйте задачи агентам<br />Месяц бесплатного доступа к GigaCowork</h2></div>}
    <LeadForm embedded fields={["name", "email", "phone"]} idPrefix={idPrefix} submitLabel="Получить доступ" validateEmail={workEmailError} onSuccess={() => setSent(true)} />
  </>;
}

function Svg({ name, size = 20 }: { name: string; size?: number }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={asset(`/img/kommersant-promo-v2/${name}.svg`)} width={size} height={size} alt="" />;
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
function Choices({ remaining, onChoose, hintRef, initial = false, containerRef }: { remaining: Scenario[]; onChoose: (kind: Kind) => void; hintRef?: RefObject<HTMLSpanElement | null>; initial?: boolean; containerRef?: RefObject<HTMLDivElement | null> }) {
  return <div ref={containerRef} className={styles.choices} aria-label="Выберите сценарий">
    {remaining.map((scenario, index) => <button type="button" key={scenario.kind} onClick={() => onChoose(scenario.kind)} className={styles.chip}>
      {index === 0 && hintRef && <span ref={hintRef} className={styles.chipHintLayer} aria-hidden="true" />}
      <Svg name={scenario.icon} /><span>{initial ? scenario.initialLabel : scenario.label}</span>
    </button>)}
  </div>;
}
function Composer() {
  return <div className={styles.composer}>
    <div className={styles.input}>
      <textarea disabled rows={2} placeholder="Чем я могу помочь?" aria-label="Сообщение чату — выберите подсказку выше" />
      <div className={styles.tools} aria-hidden="true">
        <span><Svg name="plus" /><Svg name="square-slash" /><span className={styles.agent}><Svg name="dog" size={14} /> Агент <Svg name="chevron-down" size={12} /></span></span>
        <span><Svg name="microphone" /><span className={styles.send}><Svg name="arrow-up" size={24} /></span></span>
      </div>
    </div>
    <div className={styles.composerFooter}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={asset("/img/kommersant-promo/logo-figma.svg")} width={125} height={27} alt="GigaCowork" />
      <span>+ 40 интеграций <Svg name="chevrons-down-up" /></span>
    </div>
  </div>;
}

const FILE_UPLOAD_MS = 850;
const FILE_STAGGER_MS = 100;

function requestTiming(scenario: Scenario, reducedMotion: boolean) {
  const typing = reducedMotion ? 0 : Math.min(1100, Math.max(480, scenario.prompt.length * 14));
  return { typing, total: typing + (reducedMotion || !scenario.files.length ? 0 : FILE_UPLOAD_MS + (scenario.files.length - 1) * FILE_STAGGER_MS) };
}

function Request({ scenario }: { scenario: Scenario }) {
  const [reveal, setReveal] = useState({ characters: 0, visibleFiles: 0, readyFiles: 0 });
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      setReveal({ characters: scenario.prompt.length, visibleFiles: scenario.files.length, readyFiles: scenario.files.length });
      return;
    }
    const { typing, total } = requestTiming(scenario, false);
    const started = performance.now();
    let frame: number;
    const tick = () => {
      const elapsed = performance.now() - started;
      const characters = Math.min(scenario.prompt.length, Math.floor(elapsed / typing * scenario.prompt.length));
      const fileCount = (delay: number) => Math.max(0, Math.min(scenario.files.length, Math.floor((elapsed - typing - delay) / FILE_STAGGER_MS) + 1));
      const visibleFiles = fileCount(0);
      const readyFiles = fileCount(FILE_UPLOAD_MS);
      setReveal((current) => current.characters === characters && current.visibleFiles === visibleFiles && current.readyFiles === readyFiles ? current : { characters, visibleFiles, readyFiles });
      if (elapsed < total) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [scenario]);
  const typing = reveal.characters < scenario.prompt.length;
  return <div className={styles.request}>
    <p className={styles.requestText} aria-label={scenario.prompt}>
      <span className={styles.promptMeasure} aria-hidden="true">{scenario.prompt}</span>
      <span aria-hidden="true">{scenario.prompt.slice(0, reveal.characters)}{typing && <span className={styles.typingCaret} />}</span>
    </p>
    {reveal.visibleFiles > 0 && <div className={styles.attachments}>
      {scenario.files.slice(0, reveal.visibleFiles).map((file, index) => <div key={file.name} className={`${styles.file} ${styles.uploadFile}`} data-loading={index >= reveal.readyFiles} aria-busy={index >= reveal.readyFiles}>
        <span className={styles.fileIcon}><Icon src="/img/kommersant-promo-scenarios/file.svg" className="size-[20px]" />{index >= reveal.readyFiles && <span className={styles.uploadSpinner} aria-hidden="true" />}</span>
        <span><b>{file.name}</b><small>{index >= reveal.readyFiles ? "Загружаю…" : file.size}</small></span>
      </div>)}
    </div>}
  </div>;
}

function Comparison({ highlighted = true }: { highlighted?: boolean }) {
  return <div className={styles.tableWrap} tabIndex={0} role="region" aria-label="Сравнение предложений поставщиков">
    <table><caption>Сравнение трех поставщиков</caption><thead><tr><th scope="col">Параметр</th><th scope="col">Поставщик А</th><th scope="col">Поставщик Б</th><th scope="col">Поставщик В</th></tr></thead>
      <tbody>
        <tr><th scope="row">Стоимость</th><td>1 180 000 ₽</td><td>1 150 000 ₽</td><td>1 210 000 ₽</td></tr>
        <tr><th scope="row">Комплектация</th><td>Полная</td><td>Полная</td><td>Полная</td></tr>
        <tr><th scope="row">Доставка</th><td className={highlighted ? styles.caution : ""}>Доставка оплачивается отдельно<span>45 000 ₽</span></td><td>Включена</td><td>Включена</td></tr>
        <tr><th scope="row">Итого с доставкой</th><td>1 225 000 ₽</td><td className={highlighted ? styles.positive : ""}>1 150 000 ₽</td><td>1 210 000 ₽</td></tr>
        <tr><th scope="row">Срок</th><td>14 дней</td><td>10 дней</td><td>7 дней</td></tr>
        <tr><th scope="row">Гарантия</th><td>12 месяцев</td><td className={highlighted ? styles.positive : ""}>Гарантия 24 месяца</td><td>12 месяцев</td></tr>
      </tbody>
    </table>
  </div>;
}
function Contract({ highlighted = true }: { highlighted?: boolean }) {
  return <div className={styles.document}>
    <p className={styles.documentLabel}>Договор поставки</p>
    <div className={highlighted ? styles.clauseFlagged : styles.clause}><p><b>3.1. Порядок оплаты</b><br />Оплата производится после подписания акта приемки. Срок оплаты определяется поставщиком дополнительно.</p>{highlighted && <aside><mark>Нет предельного срока оплаты</mark></aside>}</div>
    <div className={highlighted ? styles.clauseFlagged : styles.clause}><p><b>4.2. Изменение стоимости</b><br />Поставщик вправе изменить цену товара в одностороннем порядке, уведомив покупателя.</p>{highlighted && <aside><mark>Поставщик может менять цену в одностороннем порядке</mark></aside>}</div>
  </div>;
}
function Report({ phase, complete }: { phase: number; complete: boolean }) {
  const connected = phase >= 2;
  return <>
    <div className={styles.connectors} aria-label="Источники данных отчета">
      {[{ name: "amoCRM", logo: "amocrm" }, { name: "1С", logo: "1c" }].map((connector) => <div className={styles.connector} key={connector.logo}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset(`/img/connectors/logos/${connector.logo}.webp`)} alt="" width={32} height={32} />
        <span><b>{connector.name}</b><small>{connected ? "Подключено" : "Подключаюсь"}</small></span>
        {connected ? <Icon src="/img/icons/check.svg" className="size-[18px]" /> : <span className={styles.connecting} aria-hidden="true" />}
      </div>)}
    </div>
    {complete && <div className={`${styles.result} ${styles.reportResult}`}>
      <p className={styles.reportExplanation}>Собрал сделки из amoCRM и расходы из 1С. Расходы на 7,2% выше плана — в основном из-за дополнительных поставок. Детали и выводы — в файле.</p>
      <a className={`${styles.file} ${styles.reportFile}`} href={asset("/data/kommersant-report-amocrm-1c.xlsx")} download="Отчет для руководителя.xlsx" aria-label="Скачать отчет для руководителя в формате XLSX">
        <span className={styles.fileIcon}><Icon src="/img/kommersant-promo-scenarios/file.svg" className="size-[24px]" /></span>
        <span><b>Отчет для руководителя.xlsx</b><small>XLSX · Скачать отчет</small></span>
      </a>
    </div>}
  </>;
}

function Answer({ exchange }: { exchange: Exchange }) {
  const scenario = scenarios.find((item) => item.kind === exchange.kind)!;
  const { phase, kind, complete } = exchange;
  const status = kind === "report" ? [scenario.status, "Подключаю навык «Анализ данных»", "Собираю данные из amoCRM и 1С", "Готовлю отчет в XLSX"][Math.min(phase - 1, 3)] : scenario.status;
  if (phase === 0) return null;
  return <div className={styles.answer}>
    <p className={styles.status} role="status"><Icon src={complete ? "/img/icons/check.svg" : "/img/icons/bot.svg"} className="size-[20px]" />{complete ? "Готово" : status}{!complete && <span className={styles.dots} aria-hidden="true"><i /><i /><i /></span>}</p>
    {kind === "news" ? <>
      <p className={styles.newsIntro}>Вот самое актуальное для бизнеса — события, которые стоит держать в фокусе.</p>
      {exchange.count > 0 && <table className={styles.newsTable}>
        <caption>Обзор бизнес-новостей Коммерсанта</caption>
        <tbody>{exchange.articles.slice(0, exchange.count).map((article) => <tr className={styles.newsRow} key={article.id}>
          <td><time className={styles.meta} dateTime={article.publishedAt}>{publishedTime.format(new Date(article.publishedAt))} МСК</time></td>
          <th scope="row"><strong>{article.title.split(" // ")[0]}</strong><p className={styles.newsSummary}>{article.summary}{article.summary && " "}<a href={article.url} target="_blank" rel="noopener noreferrer" aria-label={`Подробнее: ${article.title}`}>Подробнее</a></p></th>
        </tr>)}</tbody>
      </table>}
      {complete && <p className={styles.meta}>{exchange.articles.length ? checkedLabel(exchange.startedAt) : "Не удалось загрузить новости. Попробуйте другие сценарии."}</p>}
    </> : <>
      {kind === "offers" && <>
        <p className={styles.reasoning}>Сравню полную стоимость с учётом доставки, сроки поставки и условия гарантии.</p>
        {phase >= 2 && <Comparison highlighted={phase >= 3} />}
        {complete && <div className={styles.result}><h3>У поставщика Б ниже стоимость с учетом доставки</h3><p>Экономия — 75 000 ₽ относительно поставщика А. Комплектация полная, доставка включена, гарантия — 24 месяца.</p><p className={styles.done}><Icon src="/img/icons/check.svg" className="size-[18px]" />Вопросы поставщикам подготовлены</p></div>}
      </>}
      {kind === "contract" && <>
        <Contract highlighted={phase >= 3} />
        {complete && <div className={styles.result}><h3>Два условия требуют внимания юриста</h3><p className={styles.done}><Icon src="/img/icons/check.svg" className="size-[18px]" />Варианты правок подготовлены</p></div>}
      </>}
      {kind === "report" && <Report phase={phase} complete={complete} />}
    </>}
  </div>;
}

export function ScenarioChat({ initialDigest, footer }: { initialDigest: unknown; footer: ReactNode }) {
  const [articles, setArticles] = useState(() => articlesFrom(initialDigest) ?? []);
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

  useEffect(() => {
    const controller = new AbortController();
    const refresh = async () => {
      try {
        const response = await fetch(asset("/data/kommersant-promo.json"), { cache: "no-store", signal: controller.signal });
        if (!response.ok) return;
        const updated = articlesFrom(await response.json());
        if (updated?.length) setArticles(updated);
      } catch { /* Keep the last valid digest available offline. */ }
    };
    void refresh();
    const interval = setInterval(refresh, 300_000);
    return () => { controller.abort(); clearInterval(interval); };
  }, []);
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
    const requestDuration = requestTiming(scenario, window.matchMedia("(prefers-reduced-motion: reduce)").matches).total;
    if (kind === "news") {
      after(requestDuration + 150, () => update({ phase: 1 }));
      let elapsed = requestDuration + 150;
      let previous = 0;
      entry.articles.forEach((_, index) => {
        let delay = 750 + Math.round(Math.random() * 500);
        if (Math.abs(delay - previous) < 75) delay = previous < 1000 ? 1200 : 800;
        previous = delay;
        elapsed += delay;
        after(elapsed, () => update({ count: index + 1 }));
      });
      after(elapsed + 175, finish);
    } else if (kind === "report") {
      after(requestDuration + 250, () => update({ phase: 1 }));
      after(requestDuration + 1750, () => update({ phase: 2 }));
      after(requestDuration + 3250, () => update({ phase: 3 }));
      after(requestDuration + 5250, () => update({ phase: 4 }));
      after(requestDuration + 7250, finish);
    } else {
      after(requestDuration + 250, () => update({ phase: 1 }));
      after(requestDuration + 2250, () => update({ phase: 2 }));
      after(requestDuration + 4750, () => update({ phase: 3 }));
      after(requestDuration + 7250, finish);
    }
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
            <Answer exchange={exchange} />
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
