import type { Metadata } from "next";

import { Button } from "@/components/ui/Button";
import { asset } from "@/lib/asset";
import digest from "@/data/kommersant-share.json";

import { ShareButton } from "./ShareButton";
import styles from "./promo.module.css";

export const metadata: Metadata = {
  title: "GigaCowork для Коммерсанта",
  description: "Дайджест инфоповодов из открытой демо-сессии GigaCowork.",
  robots: { index: false, follow: false },
};

const sections = digest.sections;
const allItems = sections.flatMap((section) =>
  section.items.map((item) => ({ ...item, category: section.title })),
);
const maxCategoryCount = Math.max(...sections.map((section) => section.items.length));
const syncedAt = new Intl.DateTimeFormat("ru-RU", {
  timeZone: "Europe/Moscow",
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
}).format(new Date(digest.syncedAt));

const metrics = [
  { value: allItems.length, label: "инфоповодов" },
  { value: sections.length, label: "рубрики" },
  { value: sections[0]?.items.length ?? 0, label: "событий в России" },
  { value: sections[1]?.items.length ?? 0, label: "событий в мире" },
];

const steps = [
  { title: "Прочитал открытые источники", detail: "По запросу из демо-сессии" },
  { title: "Отобрал ключевые события", detail: `${allItems.length} инфоповодов в выпуске` },
  { title: "Сгруппировал по рубрикам", detail: sections.map((section) => section.title).join(", ") },
  { title: "Собрал дайджест", detail: "С описаниями и названиями источников" },
];

export default function KommersantPromoPage() {
  return (
    <>
      <div className={styles.canvas}>
        <section data-kommersant-promo className={styles.hero}>
          <div className="container-page">
            <span className={styles.eyebrow}>GigaCowork × Коммерсантъ</span>
            <h1>Дайджест актуальных новостей на kommersant.ru</h1>
            <p>
              Попробуйте ИИ-агента в действии: задавайте вопросы
              <br />
              и получайте ответы в интерактивном демо
            </p>
          </div>
        </section>

        <section className={styles.demoSection} aria-label="Пример работы агента">
          <div className="container-page">
            <div className={styles.demoWindow}>
              <aside className={styles.taskPanel} aria-label="Задача агента">
                <div className={styles.taskHeader}>
                  <h2>Задача</h2>
                  <span className={styles.routineChip}>Рутина · каждый час</span>
                </div>
                <p className={styles.prompt}>{digest.prompt}</p>
                <h3 className={styles.stepHeading}>Как агент выполнил задачу</h3>
                <ol className={styles.steps}>
                  {steps.map((step) => (
                    <li key={step.title} className={styles.step}>
                      {/* The 28×28 icon is the asset supplied for the Figma step component. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={asset("/img/kommersant-promo/check-figma.svg")} width={28} height={28} alt="" />
                      <div>
                        <strong>{step.title}</strong>
                        <span>{step.detail}</span>
                      </div>
                    </li>
                  ))}
                </ol>
                <p className={styles.taskFooter}>Данные из открытой демо-сессии</p>
              </aside>

              <div className={styles.artifact}>
                <div className={styles.artifactHeader}>
                  <div>
                    <h2>Дайджест инфоповодов</h2>
                    <p>{digest.heading}</p>
                  </div>
                  <ShareButton className={styles.shareButton} />
                </div>

                <div className={styles.metrics} aria-label="Показатели выпуска">
                  {metrics.map((metric) => (
                    <div key={metric.label} className={styles.metric}>
                      <strong>{metric.value}</strong>
                      <span>{metric.label}</span>
                    </div>
                  ))}
                </div>

                <div className={styles.artifactBody}>
                  <div className={styles.news}>
                    <h3>Главное в выпуске</h3>
                    <div className={styles.newsList}>
                      {allItems.map((item) => (
                        <article key={`${item.category}:${item.title}`} className={styles.newsItem}>
                          <span className={styles.newsTag}>{item.category}</span>
                          <h4>{item.title}</h4>
                          {item.description ? <p>{item.description}</p> : null}
                          {item.sources ? (
                            <span className={styles.newsSource}>В демо указаны: {item.sources}</span>
                          ) : null}
                        </article>
                      ))}
                    </div>
                  </div>

                  <aside className={styles.agenda} aria-label="Повестка по рубрикам">
                    <h3>Повестка по рубрикам</h3>
                    <p>число инфоповодов</p>
                    <div className={styles.agendaRows}>
                      {sections.map((section) => (
                        <div key={section.title} className={styles.agendaRow}>
                          <div>
                            <span>{section.title}</span>
                            <strong>{section.items.length}</strong>
                          </div>
                          <div className={styles.agendaTrack}>
                            <span style={{ width: `${(section.items.length / maxCategoryCount) * 100}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </aside>
                </div>
              </div>
            </div>

            <p className={styles.caption}>
              Данные взяты из{" "}
              <a href={digest.sourceUrl} target="_blank" rel="noopener noreferrer">
                открытой демо-сессии
              </a>
              . Снимок обновлён {syncedAt} при сборке сайта; первоисточники не
              проверены независимо.
            </p>
            <div className={styles.buttonRow}>
              <Button href="/lead" variant="primary" size="lg" className={styles.bottomButton}>
                Поручить задачу агенту
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
