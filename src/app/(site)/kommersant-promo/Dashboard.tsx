"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { asset } from "@/lib/asset";

import { ShareButton } from "./ShareButton";
import styles from "./promo.module.css";

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

const topicOrder = [
  "Регулирование и налоги",
  "Макроэкономика и рынки",
  "Компании и инвестиции",
  "Потребительский рынок",
  "Технологии и связь",
  "Энергетика и промышленность",
  "Логистика и внешняя торговля",
];

const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  timeZone: "Europe/Moscow",
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
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

export function Dashboard({ initialDigest }: { initialDigest: unknown }) {
  const [digest, setDigest] = useState<Digest>(() => {
    if (!isDigest(initialDigest)) throw new Error("Некорректный начальный выпуск «Ъ»");
    return initialDigest;
  });
  const [secondsToNextCheck, setSecondsToNextCheck] = useState(300);

  useEffect(() => {
    let active = true;
    const refresh = async () => {
      setSecondsToNextCheck(300);
      try {
        const response = await fetch(`${asset("/data/kommersant-share.json")}?t=${Date.now()}`, {
          cache: "no-store",
        });
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
    const onVisible = () => {
      if (document.visibilityState === "visible") void refresh();
    };
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
    for (const item of items) {
      const group = grouped.get(item.primaryTopic) ?? [];
      group.push(item);
      grouped.set(item.primaryTopic, group);
    }
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
  const steps = [
    { title: "Читает свежие материалы Ъ", detail: "46 публикаций за последние сутки" },
    { title: "Отбирает значимое для бизнеса", detail: "Отсеял происшествия и повторы" },
    { title: "Группирует по отраслям", detail: "Финансы, ритейл, энергетика, логистика" },
    { title: "Обновляет каждые 5 минут", detail: "Регулярные обновления по источникам" },
  ];

  return (
    <div className={styles.canvas}>
      <section data-kommersant-promo className={styles.hero}>
        <div className="container-page">
          <h1>Что нового на kommersant.ru?</h1>
          <p>Бизнес-дайджест свежих новостей, собранных ИИ-агентом GigaCowork</p>
        </div>
      </section>

      <section className={styles.demoSection} aria-label="Пример работы агента">
        <div className="container-page">
          <div className={styles.demoWindow}>
            <aside className={styles.taskPanel} aria-label="Задача агента">
              <div className={styles.taskHeader}>
                <h2>Промпт</h2>
                <span className={styles.routineChip}>Регулярная задача</span>
              </div>
              <p className={styles.prompt}>Что нового на kommersant.ru? Веди для меня мониторинг новосте: что изменилось для бизнеса, по отраслям, со ссылками на материалы.</p>
              <h3 className={styles.stepHeading}>Как агент выполняет задачу</h3>
              <ol className={styles.steps}>
                {steps.map((step) => (
                  <li key={step.title} className={styles.step}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={asset("/img/kommersant-promo/check-figma.svg")} width={28} height={28} alt="" />
                    <div><strong>{step.title}</strong><span>{step.detail}</span></div>
                  </li>
                ))}
              </ol>
              <div className={styles.liveStatus} aria-live="off">
                <span className={styles.onlineDot} aria-hidden="true" />
                <span>Агент онлайн (обновление через {String(Math.floor(secondsToNextCheck / 60)).padStart(2, "0")}:{String(secondsToNextCheck % 60).padStart(2, "0")})</span>
              </div>
            </aside>

            <div className={styles.artifact}>
              <div className={styles.artifactHeader}>
                <div>
                  <h2>Бизнес-дайджест Ъ</h2>
                  <p>{digestCheckedAt ? `${isStale ? "Последний выпуск" : "Выпуск"} от ${digestCheckedAt} МСК` : "Ожидаем первый выпуск из публичной сессии"}</p>
                </div>
                <ShareButton className={styles.shareButton} />
              </div>

              <div className={styles.metrics} aria-label="Показатели выпуска">
                {metrics.map((metric) => (
                  <div key={metric.label} className={styles.metric}>
                    <strong>{metric.value}</strong><span>{metric.label}</span>
                  </div>
                ))}
              </div>

              <div className={styles.artifactBody}>
                <div className={styles.news}>
                  <h3 id="kommersant-news-heading">Главное в выпуске</h3>
                  {sections.length === 0 ? <p className={styles.emptyNews}>{digest.status === "ok" ? "За последние 24 часа значимых событий не найдено." : "В публичной сессии пока нет подходящего выпуска."}</p> : (
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
                      ))) }
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
                        <div className={styles.agendaTrack}>
                          <span style={{ width: `${(topic.count / maxCategoryCount) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </aside>
              </div>
            </div>
          </div>

          <p className={styles.caption}>
            {digest.sourceUrl ? (
              <>
                {digest.status === "ok" ? "Выпуск получен из " : "Ожидается выпуск в "}
                <a href={digest.sourceUrl} target="_blank" rel="noopener noreferrer">публичной сессии GigaCowork</a>.
              </>
            ) : "Публичная сессия для дайджеста пока не подключена."}
            {digestCheckedAt ? ` Агент проверил материалы ${digestCheckedAt} МСК.` : ""}
            {siteCheckedAt ? ` Сайт проверил сессию ${siteCheckedAt} МСК.` : ""}
            {isStale ? " Новый выпуск задерживается; показан последний полученный." : ""}
          </p>
          <p className={styles.ctaDescription}>Проверьте GigaCowork на своих задачах 7 дней бесплатно</p>
          <div className={styles.buttonRow}>
            <Button href="/lead" variant="primary" size="lg" className={styles.bottomButton}>
              Поручить задачу агенту
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
