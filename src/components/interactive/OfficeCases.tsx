"use client";

import Link from "next/link";
import { useMemo, useState, type CSSProperties } from "react";

import { Image } from "@/components/ui/Image";
import { Kicker } from "@/components/ui/Kicker";
import { asset } from "@/lib/asset";
import { keepRussianShortWords } from "@/lib/typography";
import type { CaseStudy } from "@/content/cases";
import styles from "./office-cases.module.css";

const departments = [
  { id: "hr", label: "HR", icon: "/img/icons/users-round.svg", x: 15, y: 10, robotX: 16, robotY: 31, activityX: 20, activityY: 24, glowX: 15, glowY: 29, task: "Подбор кандидатов", companies: ["ФосАгро"] },
  { id: "finance", label: "Финансы", icon: "/img/icons/money.svg", x: 33, y: 10, robotX: 34, robotY: 31, activityX: 39, activityY: 24, glowX: 33, glowY: 29, task: "Подготовка отчета", companies: ["АПРИ", "Уралметхим"] },
  { id: "legal", label: "Юридический отдел", icon: "/img/icons/document.svg", x: 50, y: 10, robotX: 51, robotY: 31, activityX: 56, activityY: 24, glowX: 50, glowY: 29, task: "Проверка договора", companies: ["Уралметхим"] },
  { id: "marketing", label: "Маркетинг", icon: "/img/icons/chart-no-axes-combined.svg", x: 68, y: 10, robotX: 69, robotY: 31, activityX: 74, activityY: 24, glowX: 68, glowY: 29, task: "Анализ конкурентов", companies: [] },
  { id: "project", label: "Проектный офис", icon: "/img/icons/reports.svg", x: 86, y: 10, robotX: 86, robotY: 31, activityX: 91, activityY: 24, glowX: 86, glowY: 29, task: "Планирование проекта", companies: [] },
  { id: "sales", label: "Продажи", icon: "/img/icons/commercial-offer.svg", x: 19, y: 87, robotX: 19, robotY: 66, activityX: 24, activityY: 59, glowX: 19, glowY: 66, task: "Подготовка предложения", companies: ["BI Group"] },
  { id: "procurement", label: "Закупки", icon: "/img/icons/supplier.svg", x: 40, y: 87, robotX: 40, robotY: 66, activityX: 45, activityY: 59, glowX: 40, glowY: 66, task: "Подбор поставщиков", companies: [] },
  { id: "logistics", label: "Логистика", icon: "/img/icons/truck.svg", x: 61, y: 87, robotX: 61, robotY: 66, activityX: 66, activityY: 59, glowX: 61, glowY: 66, task: "Планирование поставки", companies: [] },
  { id: "production", label: "Производство и сервис", icon: "/img/icons/factory.svg", x: 82, y: 87, robotX: 82, robotY: 66, activityX: 87, activityY: 59, glowX: 82, glowY: 66, task: "Контроль качества", companies: [] },
] as const;

type DepartmentId = (typeof departments)[number]["id"];
type FilterId = DepartmentId | "all" | "other";

const caseFilters = [
  { id: "all", label: "Все кейсы", icon: null },
  { id: "hr", label: "HR", icon: "/img/icons/users-round.svg" },
  { id: "finance", label: "Финансы", icon: "/img/icons/money.svg" },
  { id: "legal", label: "Юридический отдел", icon: "/img/icons/document.svg" },
  { id: "marketing", label: "Маркетинг", icon: "/img/icons/chart-no-axes-combined.svg" },
  { id: "project", label: "Проектный офис", icon: "/img/icons/reports.svg" },
  { id: "sales", label: "Продажи", icon: "/img/icons/commercial-offer.svg" },
  { id: "procurement", label: "Закупки", icon: "/img/icons/supplier.svg" },
  { id: "logistics", label: "Логистика", icon: "/img/icons/truck.svg" },
  { id: "production", label: "Производство и сервис", icon: "/img/icons/factory.svg" },
  { id: "other", label: "Другие направления", icon: "/img/icons/network.svg" },
] as const;

const departmentCompanies = new Set<string>(departments.flatMap((item) => item.companies));

const caseTitles: Record<string, string> = {
  "ФосАгро": "ИИ-агент помогает подбирать персонал",
  "АПРИ": "Проверка строительных документов",
  "Уралметхим": "Обработка писем и документов",
  "Directum": "Подготовка документов с GigaChat API",
  "BI Group": "Консультации клиентов по недвижимости",
  "versta.io": "Контроль качества клиентских диалогов",
};

function ProjectCaseCard({ study }: { study: CaseStudy }) {
  const href = study.slug && study.story ? `/success-stories/${study.slug}/` : null;
  const title = caseTitles[study.company] ?? study.story?.title ?? study.company;

  return (
    <article className={styles.caseCard}>
      <div className={styles.cardVisual}>
        {study.photo ? (
          <picture>
            {study.photo.mobile ? <source media="(max-width: 1023.98px)" srcSet={asset(study.photo.mobile)} /> : null}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset(study.photo.desktop)}
              alt=""
              loading="lazy"
              decoding="async"
              className={study.photo.fit === "contain" ? styles.cardVisualContain : undefined}
            />
          </picture>
        ) : null}
        <span className={styles.cardCategory}>{keepRussianShortWords(study.tags[1].label)}</span>
        {href ? <span className={styles.cardArrow} aria-hidden="true">→</span> : null}
      </div>
      <div className={styles.cardBody}>
        <div className={styles.cardCompany}>
          {study.logo ? (
            <Image
              src={study.logo.src}
              alt={study.company}
              width={study.logo.width}
              height={study.logo.height}
              className="max-h-[28px] w-auto max-w-[150px] object-contain object-left"
            />
          ) : (
            <span>{study.company}</span>
          )}
        </div>
        <h3 className={styles.cardTitle}>{keepRussianShortWords(title)}</h3>
        <p className={styles.cardDescription}>{keepRussianShortWords(study.cardDescription ?? study.description)}</p>
        <div className={styles.cardMetric}>
          <strong>{keepRussianShortWords(study.metric)}</strong>
          <span>{keepRussianShortWords(study.metricCaption)}</span>
        </div>
      </div>
      {href ? (
        <Link
          href={href}
          className={styles.cardLink}
          aria-label={`Открыть кейс — ${title}`}
        />
      ) : null}
    </article>
  );
}

export function OfficeCases({ cases }: { cases: CaseStudy[] }) {
  const [selected, setSelected] = useState<FilterId>("all");
  const [hovered, setHovered] = useState<DepartmentId | null>(null);
  const activeDepartment = departments.find((item) => item.id === selected);
  const activeRoom = departments.find((item) => item.id === (hovered ?? selected));
  const shownCases = useMemo(() => {
    if (selected === "all") return cases;
    if (selected === "other") return cases.filter((item) => !departmentCompanies.has(item.company));
    if (!activeDepartment) return [];
    return cases.filter((item) =>
      (activeDepartment.companies as readonly string[]).includes(item.company),
    );
  }, [activeDepartment, cases, selected]);

  const choose = (id: DepartmentId) => {
    setSelected(id);

    window.requestAnimationFrame(() => {
      const filterList = document.getElementById("special-project-case-filters");
      const activeFilter = document.getElementById(`special-project-case-filter-${id}`);

      if (filterList && activeFilter) {
        const listRect = filterList.getBoundingClientRect();
        const filterRect = activeFilter.getBoundingClientRect();
        filterList.scrollTo({
          left: filterList.scrollLeft + filterRect.left - listRect.left - (filterList.clientWidth - filterRect.width) / 2,
        });
      }

      document.getElementById("special-project-cases")?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "start",
      });
      activeFilter?.focus({ preventScroll: true });
    });
  };

  return (
    <>
      <section id="special-project-office" className={styles.officeSection} aria-labelledby="about-project-title">
        <div className="container-page">
          <div id="about-project" className={styles.officeIntro}>
            <Kicker className="self-start">О спецпроекте</Kicker>
            <h2 id="about-project-title" className={styles.introTitle}>{keepRussianShortWords("Большие перемены начинаются с повседневных задач")}</h2>
            <div className={styles.introCopy}>
              <p>{keepRussianShortWords("Документы, отчёты и согласования отнимают у специалистов время, которого не хватает на главное.")}</p>
              <p id="office-instruction">{keepRussianShortWords("Выберите отдел и посмотрите, как ИИ-агенты берут на себя рутинные задачи в разных отделах компаний")}</p>
            </div>
          </div>

          <div
            className={styles.officeScroller}
            role="region"
            aria-label="Схема офиса, прокручивается горизонтально"
            aria-describedby="office-instruction"
            tabIndex={0}
          >
            <div className={styles.officeFrame}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset("/img/special-project/pic_office.webp")}
                alt="Изометрическая схема офиса с девятью отделами компании"
                className={styles.officeImage}
              />
              {activeRoom ? (
                <div
                  key={activeRoom.id}
                  className={styles.roomEffect}
                  style={{
                    "--glow-x": `${activeRoom.glowX}%`,
                    "--glow-y": `${activeRoom.glowY}%`,
                    "--robot-x": `${activeRoom.robotX}%`,
                    "--robot-y": `${activeRoom.robotY}%`,
                    "--activity-x": `${activeRoom.activityX}%`,
                    "--activity-y": `${activeRoom.activityY}%`,
                  } as CSSProperties}
                  aria-hidden="true"
                >
                  <span className={styles.roomLight} />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={asset("/img/special-project/office-ai-robot.webp")}
                    alt=""
                    className={styles.agentRobot}
                  />
                  <span className={styles.processCard}>
                    <span className={styles.processSymbol}>✦</span>
                    <span className={styles.processState}>{activeRoom.task}</span>
                    <span className={styles.processCheck}>✓</span>
                    <span className={styles.processProgress} />
                  </span>
                </div>
              ) : null}
              <div className={styles.hotspots} aria-label="Отделы компании">
                {departments.map((department) => (
                  <button
                    key={department.id}
                    type="button"
                    className={`${styles.hotspot} ${selected === department.id || hovered === department.id ? styles.hotspotActive : ""}`}
                    style={{ left: `${department.x}%`, top: `${department.y}%` }}
                    onClick={() => choose(department.id)}
                    onPointerEnter={(event) => {
                      if (event.pointerType === "mouse" || event.pointerType === "pen") setHovered(department.id);
                    }}
                    onPointerLeave={() => setHovered(null)}
                    onFocus={(event) => {
                      if (event.currentTarget.matches(":focus-visible")) setHovered(department.id);
                    }}
                    onBlur={() => setHovered(null)}
                    aria-pressed={selected === department.id}
                    aria-controls="special-project-cases"
                  >
                    <span
                      className={styles.hotspotIcon}
                      style={{
                        maskImage: `url(${asset(department.icon)})`,
                        WebkitMaskImage: `url(${asset(department.icon)})`,
                      }}
                      aria-hidden="true"
                    />
                    {keepRussianShortWords(department.label)}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <p className={styles.officeScrollHint}>{keepRussianShortWords("Листайте схему по горизонтали, чтобы увидеть все отделы")} <span aria-hidden="true">→</span></p>
        </div>
      </section>

      <section id="special-project-cases" className={styles.casesSection} aria-labelledby="project-cases-title">
        <div className="container-page">
          <div className={styles.casesHeading}>
            <div>
              <h2 id="project-cases-title" className={styles.heading}>Опыт компаний</h2>
              <p>{keepRussianShortWords("Познакомьтесь с лучшими практиками использования ИИ-агентов и узнайте, каких результатов уже добились ведущие игроки.")}</p>
              <span className="sr-only" aria-live="polite">
                {selected === "all" ? "Выбран фильтр «Все кейсы». Показаны все кейсы." : `Выбран фильтр «${caseFilters.find((item) => item.id === selected)?.label}». Кейсов: ${shownCases.length}.`}
              </span>
            </div>
          </div>

          <div id="special-project-case-filters" className={styles.caseFilters} role="group" aria-label="Фильтр кейсов">
            {caseFilters.map((filter) => (
              <button
                key={filter.id}
                id={`special-project-case-filter-${filter.id}`}
                type="button"
                className={`${styles.caseFilter} ${selected === filter.id ? styles.caseFilterActive : ""}`}
                aria-pressed={selected === filter.id}
                aria-controls="case-results"
                onClick={() => setSelected(filter.id)}
              >
                {filter.icon ? (
                  <span
                    className={styles.caseFilterIcon}
                    style={{
                      maskImage: `url(${asset(filter.icon)})`,
                      WebkitMaskImage: `url(${asset(filter.icon)})`,
                    }}
                    aria-hidden="true"
                  />
                ) : null}
                {keepRussianShortWords(filter.label)}
              </button>
            ))}
          </div>

          {shownCases.length ? (
            <div id="case-results" className={styles.cardsGrid}>
              {shownCases.map((study) => <ProjectCaseCard key={study.company} study={study} />)}
            </div>
          ) : (
            <div id="case-results" className={styles.emptyState}>
              <span aria-hidden="true">✦</span>
              <h3>{selected === "other" ? "Кейсы других направлений скоро появятся" : "Кейсы этого отдела скоро появятся"}</h3>
              <p>Пока можно посмотреть истории других команд.</p>
              <button type="button" onClick={() => setSelected("all")}>Показать все кейсы</button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
