"use client";

import { useEffect, useState, type RefObject } from "react";
import { Icon } from "@/components/ui/Icon";
import { asset } from "@/lib/asset";
import { CustomerRequestResult, customerRequestPhase } from "./CustomerRequestResult";
import styles from "./ScenarioDemo.module.css";

export type Kind = "news" | "contract" | "offers" | "report" | "customer-request" | "candidate-selection";
type Article = { id: string; title: string; summary: string; url: string; publishedAt: string };
type Attachment = { name: string; size: string };
type Connection = {
  label: string;
  sources: { name: string; logo: string; readyAt: number }[];
  progress: string[];
};
export type Scenario = {
  kind: Kind;
  label: string;
  initialLabel: string;
  icon: string;
  prompt: string;
  status: string;
  files: Attachment[];
  connection?: Connection;
};
export type Exchange = { kind: Kind; startedAt: number; phase: number; count: number; complete: boolean; articles: Article[] };

export const scenarios: Scenario[] = [
  { kind: "news", initialLabel: "Дайджест новостей", label: "Собрать дайджест новостей", icon: "newspaper", prompt: "Собери обзор главных бизнес-новостей на kommersant.ru", status: "Собираю обзор бизнес-новостей", files: [] },
  { kind: "contract", initialLabel: "Проверка договора", label: "Проверить договор", icon: "file-check", prompt: "Проверь договор по чек-листу компании и выдели спорные условия", status: "Проверяю условия договора", files: [{ name: "Договор.pdf", size: "128 КБ" }, { name: "Чек-лист компании.pdf", size: "32 КБ" }] },
  { kind: "offers", initialLabel: "Анализ КП", label: "Проанализировать КП", icon: "files-compare", prompt: "Сравни предложения поставщиков по стоимости, комплектации и срокам", status: "Сравниваю условия предложений", files: [{ name: "КП поставщика А.pdf", size: "84 КБ" }, { name: "КП поставщика Б.pdf", size: "96 КБ" }, { name: "КП поставщика В.pdf", size: "72 КБ" }] },
  {
    kind: "report",
    initialLabel: "Подготовка отчета",
    label: "Подготовить отчет",
    icon: "file-chart",
    prompt: "Подготовь отчет для руководителя по данным amoCRM и 1С в формате XLSX",
    status: "Подключаюсь к amoCRM и 1С",
    files: [],
    connection: {
      label: "Источники данных отчета",
      sources: [
        { name: "amoCRM", logo: "amocrm.webp", readyAt: 2 },
        { name: "1С", logo: "1c.webp", readyAt: 2 },
      ],
      progress: ["Подключаю навык «Анализ данных»", "Собираю данные из amoCRM и 1С", "Готовлю отчет в XLSX"],
    },
  },
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

export function useScenarioArticles(initialDigest: unknown) {
  const [articles, setArticles] = useState(() => articlesFrom(initialDigest) ?? []);
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
  return articles;
}

function Svg({ name, size = 20 }: { name: string; size?: number }) {
  const path = name.startsWith("/") ? name : `/img/kommersant-promo-v2/${name}.svg`;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={asset(path)} width={size} height={size} alt="" />;
}
export function Choices({ remaining, onChoose, hintRef, initial = false, containerRef }: { remaining: Scenario[]; onChoose: (kind: Kind, fromKeyboard: boolean) => void; hintRef?: RefObject<HTMLSpanElement | null>; initial?: boolean; containerRef?: RefObject<HTMLDivElement | null> }) {
  return <div ref={containerRef} className={styles.choices} aria-label="Выберите сценарий">
    {remaining.map((scenario, index) => <button type="button" key={scenario.kind} onClick={(event) => onChoose(scenario.kind, event.detail === 0)} className={styles.chip}>
      {index === 0 && hintRef && <span ref={hintRef} className={styles.chipHintLayer} aria-hidden="true" />}
      <Svg name={scenario.icon} /><span>{initial ? scenario.initialLabel : scenario.label}</span>
    </button>)}
  </div>;
}
export function Composer() {
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

export function Request({ scenario }: { scenario: Scenario }) {
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

function Comparison({ highlighted, compact }: { highlighted: boolean; compact: boolean }) {
  return <div className={compact ? `${styles.tableWrap} ${styles.compactTable}` : styles.tableWrap} tabIndex={0} role="region" aria-label="Сравнение предложений поставщиков">
    <table>
      <caption>{compact ? "Сравнение двух поставщиков" : "Сравнение трех поставщиков"}</caption>
      <thead><tr><th scope="col">Параметр</th><th scope="col">Поставщик А</th><th scope="col">Поставщик Б</th>{!compact && <th scope="col">Поставщик В</th>}</tr></thead>
      <tbody>
        {!compact && <>
          <tr><th scope="row">Стоимость</th><td>1 180 000 ₽</td><td>1 150 000 ₽</td><td>1 210 000 ₽</td></tr>
          <tr><th scope="row">Комплектация</th><td>Полная</td><td>Полная</td><td>Полная</td></tr>
          <tr><th scope="row">Доставка</th><td className={highlighted ? styles.caution : ""}>Доставка оплачивается отдельно<span>45 000 ₽</span></td><td>Включена</td><td>Включена</td></tr>
        </>}
        <tr>
          <th scope="row">{compact ? "Цена с доставкой" : "Итого с доставкой"}</th>
          <td>1 225 000 ₽{compact && <span>Из них 45 000 ₽ за доставку</span>}</td>
          <td className={highlighted ? styles.positive : ""}>1 150 000 ₽</td>
          {!compact && <td>1 210 000 ₽</td>}
        </tr>
        <tr><th scope="row">Срок</th><td>14 дней</td><td>10 дней</td>{!compact && <td>7 дней</td>}</tr>
        <tr><th scope="row">Гарантия</th><td>12 месяцев</td><td className={highlighted ? styles.positive : ""}>{compact ? "24 месяца" : "Гарантия 24 месяца"}</td>{!compact && <td>12 месяцев</td>}</tr>
      </tbody>
    </table>
  </div>;
}
function Contract({ phase, inlineHighlights }: { phase: number; inlineHighlights: boolean }) {
  const paymentTerm = "Срок оплаты определяется поставщиком дополнительно.";
  const priceTerm = "Поставщик вправе изменить цену товара в одностороннем порядке";
  const showNotes = !inlineHighlights && phase >= 3;

  return <div className={styles.document}>
    <p className={styles.documentLabel}>{inlineHighlights ? "Договор поставки · выдержка" : "Договор поставки"}</p>
    <div className={showNotes ? styles.clauseFlagged : styles.clause}>
      <p>
        <b>3.1. Порядок оплаты</b><br />
        Оплата производится после подписания акта приемки.{" "}
        {inlineHighlights && phase >= 2 ? <mark>{paymentTerm}</mark> : paymentTerm}
      </p>
      {showNotes && <aside><mark>Нет предельного срока оплаты</mark></aside>}
    </div>
    <div className={showNotes ? styles.clauseFlagged : styles.clause}>
      <p>
        <b>4.2. Изменение стоимости</b><br />
        {inlineHighlights && phase >= 3 ? <mark>{priceTerm}</mark> : priceTerm}, уведомив покупателя.
      </p>
      {showNotes && <aside><mark>Поставщик может менять цену в одностороннем порядке</mark></aside>}
    </div>
  </div>;
}
function Connectors({ connection, phase }: { connection: Connection; phase: number }) {
  return <div className={styles.connectors} role="group" aria-label={connection.label}>
    {connection.sources.map(({ name, logo, readyAt }) => {
      const connected = phase >= readyAt;
      return <div className={styles.connector} key={name}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset(`/img/connectors/logos/${logo}`)} alt="" width={32} height={32} />
        <span><b>{name}</b><small>{connected ? "Подключено" : "Подключаюсь"}</small></span>
        {connected ? <Icon src="/img/icons/check.svg" className="size-[18px]" /> : <span className={styles.connecting} aria-hidden="true" />}
      </div>;
    })}
  </div>;
}

function ReportResult({ download }: { download: boolean }) {
  const fileContent = <>
    <span className={styles.fileIcon}><Icon src="/img/kommersant-promo-scenarios/file.svg" className="size-[24px]" /></span>
    <span><b>Отчет для руководителя.xlsx</b><small>{download ? "XLSX · Скачать отчет" : "XLSX · Отчёт готов"}</small></span>
  </>;

  return <div className={`${styles.result} ${styles.reportResult}`}>
    <p className={styles.reportExplanation}>Собрал сделки из amoCRM и расходы из 1С. Расходы на 7,2% выше плана — в основном из-за дополнительных поставок.{download && " Детали и выводы — в файле."}</p>
    {download ? (
      <a className={`${styles.file} ${styles.reportFile}`} href={asset("/data/kommersant-report-amocrm-1c.xlsx")} download="Отчет для руководителя.xlsx" aria-label="Скачать отчет для руководителя в формате XLSX">
        {fileContent}
      </a>
    ) : <div className={styles.file}>{fileContent}</div>}
  </div>;
}

const candidateSkills = ["SQL", "Python", "Power BI"] as const;
const recommendedCandidate = "А";
const candidates = [
  { id: "А", skills: ["SQL", "Python", "Power BI"] },
  { id: "Б", skills: ["SQL", "Power BI"] },
  { id: "В", skills: ["SQL"] },
];

function CandidateSelectionResult({ phase, complete }: { phase: number; complete: boolean }) {
  return <>
    {phase >= 2 && <p className={styles.reasoning}>Для аналитика данных нужны SQL, Python и Power BI.</p>}
    {phase >= 3 && (
      <div className={`${styles.tableWrap} ${styles.compactTable}`}>
        <table>
          <caption>Опыт по резюме</caption>
          <thead>
            <tr><th scope="col">Кандидат</th>{candidateSkills.map((skill) => <th key={skill} scope="col">{skill}</th>)}</tr>
          </thead>
          <tbody>
            {candidates.map(({ id, skills }) => (
              <tr key={id} className={complete && id === recommendedCandidate ? styles.positive : undefined}>
                <th scope="row">Кандидат {id}</th>
                {candidateSkills.map((skill) => <td key={skill}>{skills.includes(skill) ? "Указан" : "Не указан"}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
    {complete && <div className={styles.result}>
      <h3>На интервью — кандидат {recommendedCandidate}</h3>
      <p>В резюме есть отчёты на SQL, автоматизация на Python и дашборд продаж в Power BI. На интервью стоит спросить, как кандидат сверял цифры дашборда с источником.</p>
    </div>}
  </>;
}

export function Answer({ exchange, scenario, homepage = false }: {
  exchange: Exchange;
  scenario: Scenario;
  homepage?: boolean;
}) {
  const { phase, kind, complete } = exchange;
  const { connection } = scenario;
  const status = connection?.progress[phase - 2] ?? scenario.status;
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
        {phase >= 2 && <Comparison highlighted={phase >= 3} compact={homepage} />}
        {complete && <div className={styles.result}><h3>У поставщика Б ниже стоимость с учетом доставки</h3><p>Экономия — 75 000 ₽ относительно поставщика А. Комплектация полная, доставка включена, гарантия — 24 месяца.</p><p className={styles.done}><Icon src="/img/icons/check.svg" className="size-[18px]" />Вопросы поставщикам подготовлены</p></div>}
      </>}
      {kind === "contract" && <>
        <Contract phase={phase} inlineHighlights={homepage} />
        {complete && <div className={`${styles.result} ${homepage ? styles.contractSummary : ""}`}>
          <h3>Два условия требуют внимания юриста</h3>
          {homepage ? <ul>
            <li><b>Оплата.</b> Крайний срок не указан. Зафиксировать срок после приёмки.</li>
            <li><b>Цена.</b> Поставщик может изменить её единолично. Предусмотреть согласие покупателя.</li>
          </ul> : <p className={styles.done}><Icon src="/img/icons/check.svg" className="size-[18px]" />Варианты правок подготовлены</p>}
        </div>}
      </>}
      {connection && <Connectors connection={connection} phase={phase} />}
      {kind === "customer-request" && <CustomerRequestResult phase={phase} />}
      {kind === "report" && complete && <ReportResult download={!homepage} />}
      {kind === "candidate-selection" && <CandidateSelectionResult phase={phase} complete={complete} />}
    </>}
  </div>;
}

export function scheduleScenario(
  entry: Exchange,
  scenario: Scenario,
  reducedMotion: boolean,
  update: (values: Partial<Exchange>) => void,
  after: (delay: number, callback: () => void) => void,
  finish: (phase?: number) => void,
) {
  const { kind } = entry;
  const requestDuration = requestTiming(scenario, reducedMotion).total;
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
  } else if (kind === "customer-request") {
    const { reviewDeal, confirmDeal, createDeal, reviewEmail, confirmEmail, sendEmail } = customerRequestPhase;
    const timeline = [
      [250, 1],
      [1450, 2],
      [2700, 3],
      [3700, reviewDeal],
      [4900, confirmDeal],
      [5550, createDeal],
      [6450, reviewEmail],
      [7900, confirmEmail],
    ];
    for (const [delay, phase] of timeline) {
      after(requestDuration + delay, () => update({ phase }));
    }
    after(requestDuration + 8700, () => finish(sendEmail));
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
