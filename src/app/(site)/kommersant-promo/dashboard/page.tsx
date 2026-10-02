import type { Metadata } from "next";
import Link from "next/link";

import styles from "./dashboard.module.css";

export const metadata: Metadata = {
  title: "Дашборд инфоповодов — демо GigaCowork",
  description: "Снимок данных из интерактивного демо GigaCowork для Коммерсанта.",
  robots: { index: false, follow: false },
};

const metrics = [
  { label: "Пожары", value: "2", detail: "Краснозаводск и Санкт-Петербург" },
  { label: "Погибшие", value: "1", detail: "В демо также указаны 5 пропавших" },
  { label: "ОРВИ за неделю", value: "727 тыс.", detail: "Значение из сводки демо" },
  { label: "Военные на Ближнем Востоке", value: "+10 тыс.", detail: "Значение из сводки демо" },
] as const;

const categories = [
  { label: "Происшествия", count: 3, tone: "coral" },
  { label: "Политика", count: 2, tone: "blue" },
  { label: "Космос", count: 1, tone: "violet" },
  { label: "Здоровье", count: 1, tone: "mint" },
  { label: "Технологии", count: 1, tone: "amber" },
] as const;

const events = [
  {
    category: "Происшествия",
    tone: "coral",
    title: "Пожар на химзаводе в Краснозаводске",
    description:
      "В сводке сообщается о взрыве и пожаре на предприятии в Московской области. Указаны один погибший и пять пропавших.",
    sources: "ТАСС, Вести, msk1.ru",
  },
  {
    category: "Происшествия",
    tone: "coral",
    title: "Пожар в особняке Миллера в Петербурге",
    description:
      "В демо говорится о пожаре в историческом здании на Исаакиевской площади. Пострадавших, согласно сводке, нет.",
    sources: "Фонтанка.ру, РИА Новости",
  },
  {
    category: "Космос",
    tone: "violet",
    title: "Crew Dragon и Международная космическая станция",
    description:
      "В сводке упоминается стыковка Crew Dragon с МКС с космонавтом С. Тетерятниковым на борту.",
    sources: "СПб-новости",
  },
  {
    category: "Политика",
    tone: "blue",
    title: "Переговоры России и Украины",
    description:
      "В демо говорится о подготовке формата переговоров по прекращению огня в Чёрном море при участии Турции и ООН.",
    sources: "СПб-новости, ptoday.ru",
  },
  {
    category: "Здоровье",
    tone: "mint",
    title: "Обсуждение ОРВИ без температуры",
    description:
      "В сводке описаны сообщения о симптомах ОРВИ без жара и приведено значение 727 тыс. случаев за неделю.",
    sources: "93.ru, 72.ru, pravda.ru",
  },
  {
    category: "Технологии",
    tone: "amber",
    title: "Сообщения о сбоях мобильного интернета",
    description:
      "В демо отмечены сообщения пользователей о перебоях связи в России.",
    sources: "Metaratings",
  },
  {
    category: "Политика",
    tone: "blue",
    title: "Контингент США на Ближнем Востоке",
    description:
      "В сводке говорится о переброске дополнительных 10 тыс. военных на Ближний Восток.",
    sources: "СПб-новости, TSN",
  },
  {
    category: "Происшествия",
    tone: "coral",
    title: "Приговор блогеру Алексею Поднебесному",
    description:
      "В демо приведено сообщение о приговоре к трём годам лишения свободы.",
    sources: "Известия",
  },
] as const;

export default function KommersantDashboardPage() {
  return (
    <div className={styles.page}>
      <div className="container-page">
        <div className={styles.topline}>
          <span className={styles.eyebrow}>GigaCowork · Коммерсант</span>
          <Link href="/kommersant-promo/" className={styles.backLink}>
            Вернуться к демо ↗
          </Link>
        </div>

        <header className={styles.intro}>
          <div>
            <h1>Дайджест инфоповодов</h1>
            <p>Данные из открытой выдачи интерактивного демо.</p>
          </div>
          <div className={styles.timestamp}>
            <span>Снимок данных</span>
            <strong>2 октября 2026 · 13:00 МСК</strong>
          </div>
        </header>

        <p className={styles.sourceNote}>
          Этот дашборд воспроизводит данные из демо на указанный момент. Данные не
          обновляются автоматически и не проходили независимую проверку.
        </p>

        <section aria-labelledby="metrics-title" className={styles.section}>
          <div className={styles.sectionHeading}>
            <h2 id="metrics-title">Показатели из сводки</h2>
            <span>4 показателя</span>
          </div>
          <div className={styles.metrics}>
            {metrics.map((metric) => (
              <article key={metric.label} className={styles.metric}>
                <h3>{metric.label}</h3>
                <strong>{metric.value}</strong>
                <p>{metric.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="categories-title" className={styles.section}>
          <div className={styles.sectionHeading}>
            <h2 id="categories-title">Темы по категориям</h2>
            <span>8 событий</span>
          </div>
          <div className={styles.categoryCard}>
            {categories.map((category) => (
              <div key={category.label} className={styles.categoryRow}>
                <span>{category.label}</span>
                <div
                  className={styles.barTrack}
                  role="img"
                  aria-label={`${category.label}: ${category.count} из 8 событий`}
                >
                  <span
                    className={`${styles.bar} ${styles[category.tone]}`}
                    style={{ width: `${(category.count / 8) * 100}%` }}
                  />
                </div>
                <strong>{category.count}</strong>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="events-title" className={styles.section}>
          <div className={styles.sectionHeading}>
            <h2 id="events-title">События из демо</h2>
            <span>8 материалов</span>
          </div>
          <div className={styles.events}>
            {events.map((event) => (
              <article key={event.title} className={styles.event}>
                <span className={`${styles.tag} ${styles[event.tone]}`}>
                  {event.category}
                </span>
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <span className={styles.sources}>В сводке указаны: {event.sources}</span>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
