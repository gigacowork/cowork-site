"use client";

import { useEffect, useMemo, useState } from "react";

import { asset } from "@/lib/asset";

import { ShareButton } from "../../(site)/kommersant-promo/ShareButton";
import styles from "./dashboard-chat.module.css";

type Item = {
  id: string;
  title: string;
  url: string;
  publishedAt: string;
  updatedAt?: string;
  summary: string;
  businessImpact: string;
  primaryTopic: string;
  topicTags: string[];
  industryTags: string[];
  priority: "high" | "normal";
  changeStatus: "new" | "updated" | "existing";
};

type Digest = {
  version: number;
  sourceUrl: string | null;
  status: "waiting" | "ok";
  digestCheckedAt: string | null;
  siteCheckedAt: string | null;
  metrics: {
    newSinceLastRun: number | null;
    significant24h: number | null;
    highPriority24h: number | null;
  };
  items: Item[];
};

const PROMPT = "Открой kommersant.ru, найди значимые бизнес-события за последние 24 часа и собери тематический дайджест";
const steps = [
  { title: "Прочитал открытые источники", detail: "Лента + рубрики «Экономика», «Бизнес», «Финансы», «Потребительский рынок», «Телекоммуникации»" },
  { title: "Отобрал ключевые события", detail: "14 значимых событий за 24 часа, каждое проверено по прямой публикации" },
  { title: "Сгруппировал по темам", detail: "Регулирование, технологии, энергетика, компании, потребительский рынок" },
  { title: "Собрал дайджест", detail: "С описаниями, приоритетами и прямыми ссылками на «Ъ»" },
];
const topicOrder = [
  "Регулирование и налоги", "Макроэкономика и рынки", "Компании и инвестиции",
  "Потребительский рынок", "Технологии и связь", "Энергетика и промышленность",
  "Логистика и внешняя торговля",
];
const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  timeZone: "Europe/Moscow", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
});

function formatDate(value: string | null) {
  return value && Number.isFinite(Date.parse(value)) ? dateFormatter.format(new Date(value)) : null;
}

function isDigest(value: unknown): value is Digest {
  if (!value || typeof value !== "object") return false;
  const data = value as Partial<Digest>;
  return data.version === 1
    && (data.status === "ok" || data.status === "waiting")
    && (data.sourceUrl === null || typeof data.sourceUrl === "string")
    && !!data.metrics
    && Array.isArray(data.items);
}

export function DashboardChat({ initialDigest }: { initialDigest: unknown }) {
  const [digest, setDigest] = useState<Digest>(() => {
    if (!isDigest(initialDigest)) throw new Error("Некорректный начальный выпуск «Ъ»");
    return initialDigest;
  });
  const [typedPrompt, setTypedPrompt] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [visibleSteps, setVisibleSteps] = useState(0);
  const [showDigest, setShowDigest] = useState(false);
  const [secondsToNextCheck, setSecondsToNextCheck] = useState(300);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTypedPrompt(PROMPT);
      setSubmitted(true);
      setVisibleSteps(steps.length);
      setShowDigest(true);
      return;
    }
    let position = 0;
    let submitTimer = 0;
    const startTimer = window.setTimeout(() => {
      const typingTimer = window.setInterval(() => {
        position = Math.min(PROMPT.length, position + 2);
        setTypedPrompt(PROMPT.slice(0, position));
        if (position === PROMPT.length) {
          window.clearInterval(typingTimer);
          submitTimer = window.setTimeout(() => setSubmitted(true), 350);
        }
      }, 32);
      typingInterval = typingTimer;
    }, 500);
    let typingInterval = 0;
    return () => {
      window.clearTimeout(startTimer);
      window.clearInterval(typingInterval);
      window.clearTimeout(submitTimer);
    };
  }, []);

  useEffect(() => {
    if (!submitted || showDigest) return;
    const timers = steps.map((_, index) => window.setTimeout(() => setVisibleSteps(index + 1), 300 + index * 450));
    timers.push(window.setTimeout(() => setShowDigest(true), 300 + steps.length * 450));
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [submitted, showDigest]);

  useEffect(() => {
    let active = true;
    const refresh = async () => {
      setSecondsToNextCheck(300);
      try {
        const response = await fetch(`${asset("/data/kommersant-share.json")}?t=${Date.now()}`, { cache: "no-store" });
        if (!response.ok) return;
        const latest: unknown = await response.json();
        if (active && isDigest(latest)) {
          setDigest((current) => {
            if (latest.sourceUrl !== current.sourceUrl) return latest;
            const currentTime = Date.parse(current.digestCheckedAt ?? "") || 0;
            const latestTime = Date.parse(latest.digestCheckedAt ?? "") || 0;
            return latestTime >= currentTime ? latest : current;
          });
        }
      } catch {
        // Keep the last published digest until the next check.
      }
    };
    void refresh();
    const interval = window.setInterval(() => void refresh(), 5 * 60 * 1000);
    const countdown = window.setInterval(() => setSecondsToNextCheck((seconds) => Math.max(0, seconds - 1)), 1000);
    const onVisible = () => { if (document.visibilityState === "visible") void refresh(); };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      active = false;
      window.clearInterval(interval);
      window.clearInterval(countdown);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  const sections = useMemo(() => {
    const grouped = new Map<string, Item[]>();
    const items = [...digest.items].sort((a, b) => {
      const changed = (item: Item) => item.changeStatus === "new" || item.changeStatus === "updated" ? 1 : 0;
      return changed(b) - changed(a)
        || Number(b.priority === "high") - Number(a.priority === "high")
        || Date.parse(b.publishedAt) - Date.parse(a.publishedAt);
    }).slice(0, 12);
    for (const item of items) grouped.set(item.primaryTopic, [...(grouped.get(item.primaryTopic) ?? []), item]);
    return topicOrder.filter((topic) => grouped.has(topic)).map((title) => ({ title, items: grouped.get(title)! }));
  }, [digest.items]);

  const topicCounts = topicOrder
    .map((title) => ({ title, count: digest.items.filter((item) => item.primaryTopic === title).length }))
    .filter((topic) => topic.count > 0);
  const maxCategoryCount = Math.max(1, ...topicCounts.map((topic) => topic.count));
  const digestCheckedAt = formatDate(digest.digestCheckedAt);
  const siteCheckedAt = formatDate(digest.siteCheckedAt);
  const isStale = digest.digestCheckedAt !== null && digest.siteCheckedAt !== null
    && Date.parse(digest.siteCheckedAt) - Date.parse(digest.digestCheckedAt) > 15 * 60 * 1000;
  const metrics = [
    { value: digest.metrics.newSinceLastRun ?? "—", label: "Новых с прошлого запуска" },
    { value: digest.metrics.significant24h ?? "—", label: "Значимых за 24 часа" },
    { value: digest.metrics.highPriority24h ?? "—", label: "Высокий приоритет" },
  ];
  const countdown = `${String(Math.floor(secondsToNextCheck / 60)).padStart(2, "0")}:${String(secondsToNextCheck % 60).padStart(2, "0")}`;

  return (
    <section className={styles.page} data-kommersant-promo aria-label="Дайджест GigaCowork в формате чата">
      <header className={styles.brandPair} role="img" aria-label="Коммерсантъ и GigaCowork">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset("/img/kommersant-promo-v2/logo-kommersant.svg")} alt="" />
        <span aria-hidden="true">×</span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset("/img/kommersant-promo/logo-figma.svg")} alt="" />
      </header>

      <div className={styles.content}>
        <div className={styles.hero}>
          <h1>Что нового на kommersant.ru?</h1>
          <p>Бизнес-дайджест свежих новостей, собранных ИИ-агентом GigaCowork</p>
        </div>

        {!submitted ? (
          <div className={styles.composer} aria-label="Агент вводит запрос">
            <p>{typedPrompt || <span className={styles.placeholder}>Чем я могу помочь?</span>}<span className={styles.caret} aria-hidden="true" /></p>
            <div className={styles.composerActions} aria-hidden="true">
              <span>＋</span><span>Агент⌄</span><span className={styles.sendIcon}>↑</span>
            </div>
            <div className={styles.connectorRow}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset("/img/kommersant-promo/logo-figma.svg")} alt="GigaCowork" />
              <span>+ 40 коннекторов</span>
            </div>
          </div>
        ) : (
          <div className={styles.thread} aria-live="polite">
            <div className={styles.userMessage}>{PROMPT}</div>
            <div className={styles.agentIdentity}>
              <span className={styles.agentAvatar} aria-hidden="true">✦</span>
              <span>Агент GigaCowork</span>
            </div>
            <section className={styles.stepsBlock} aria-labelledby="agent-steps-title">
              <h2 id="agent-steps-title">Как агент выполнил задачу</h2>
              <ol className={styles.steps}>
                {steps.slice(0, visibleSteps).map((step) => (
                  <li key={step.title} className={styles.step}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={asset("/img/kommersant-promo/check-figma.svg")} width={28} height={28} alt="" />
                    <div><strong>{step.title}</strong><p>{step.detail}</p></div>
                  </li>
                ))}
              </ol>
            </section>

            {showDigest && (
              <section className={styles.digest} aria-labelledby="digest-title">
                <div className={styles.digestHeader}>
                  <div>
                    <p className={styles.digestEyebrow}>Результат работы агента</p>
                    <h2 id="digest-title">Бизнес-дайджест Ъ</h2>
                    <p className={styles.issueDate}>{digestCheckedAt ? `${isStale ? "Последний выпуск" : "Выпуск"} от ${digestCheckedAt} МСК` : "Ожидаем первый выпуск из публичной сессии"}</p>
                  </div>
                  <ShareButton className={styles.shareButton} />
                </div>

                <div className={styles.liveStatus} aria-live="off">
                  <span className={styles.onlineDot} aria-hidden="true" />
                  <span>Агент онлайн (обновление через {countdown})</span>
                </div>

                <div className={styles.metrics} aria-label="Показатели выпуска">
                  {metrics.map((metric) => <div key={metric.label} className={styles.metric}><strong>{metric.value}</strong><span>{metric.label}</span></div>)}
                </div>

                <div className={styles.digestBody}>
                  <div className={styles.news}>
                    <h3 id="kommersant-news-heading">Главное в выпуске</h3>
                    {sections.length === 0 ? (
                      <p className={styles.emptyNews}>{digest.status === "ok" ? "За последние 24 часа значимых событий не найдено." : "В публичной сессии пока нет подходящего выпуска."}</p>
                    ) : (
                      <div className={styles.newsList} role="region" aria-labelledby="kommersant-news-heading" tabIndex={0}>
                        {sections.flatMap((section) => section.items.map((item) => (
                          <article key={item.id} className={styles.newsItem}>
                            <span className={styles.newsTag}>{section.title}</span>
                            <h4><a href={item.url} target="_blank" rel="noopener noreferrer">{item.title}</a></h4>
                            <p>{item.summary}</p>
                            <p><strong>Для бизнеса:</strong> {item.businessImpact}</p>
                            <span className={styles.newsSource}>
                              {item.priority === "high" ? "Высокий" : "Обычный"} приоритет · {formatDate(item.publishedAt)} МСК
                              {item.updatedAt ? ` · обновлено ${formatDate(item.updatedAt)} МСК` : ""}
                              {item.topicTags.length || item.industryTags.length ? ` · ${[...item.topicTags, ...item.industryTags].join(" · ")}` : ""}
                            </span>
                          </article>
                        )))}
                      </div>
                    )}
                  </div>
                  <aside className={styles.agenda} aria-label="Повестка по темам">
                    <h3>Повестка по темам</h3>
                    <p>все значимые события за 24 часа</p>
                    <div className={styles.agendaRows}>
                      {topicCounts.map((topic) => (
                        <div key={topic.title} className={styles.agendaRow}>
                          <div><span>{topic.title}</span><strong>{topic.count}</strong></div>
                          <div className={styles.agendaTrack}><span style={{ width: `${topic.count / maxCategoryCount * 100}%` }} /></div>
                        </div>
                      ))}
                    </div>
                  </aside>
                </div>
              </section>
            )}

            {showDigest && (
              <>
                <p className={styles.caption}>
                  {digest.sourceUrl ? <>{digest.status === "ok" ? "Выпуск получен из " : "Ожидается выпуск в "}<a href={digest.sourceUrl} target="_blank" rel="noopener noreferrer">публичной сессии GigaCowork</a>.</> : "Публичная сессия для дайджеста пока не подключена."}
                  {digestCheckedAt ? ` Агент проверил материалы ${digestCheckedAt} МСК.` : ""}
                  {siteCheckedAt ? ` Сайт проверил сессию ${siteCheckedAt} МСК.` : ""}
                  {isStale ? " Новый выпуск задерживается; показан последний полученный." : ""}
                </p>
                <div className={styles.cta}>
                  <p>Проверьте GigaCowork на своих задачах 7 дней бесплатно</p>
                  <a href={asset("/lead/")}>Поручить задачу агенту</a>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
