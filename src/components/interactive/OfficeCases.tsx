"use client";

import Link from "next/link";
import { useMemo, useState, type CSSProperties } from "react";

import { Image } from "@/components/ui/Image";
import { asset } from "@/lib/asset";
import { keepRussianShortWords } from "@/lib/typography";
import type { CaseStudy } from "@/content/cases";
import styles from "./office-cases.module.css";

const departments = [
  { id: "hr", label: "HR и кадры", icon: "/img/icons/users-round.svg", x: 17, y: 12, robotX: 19, robotY: 37, activityX: 25, activityY: 29, glowX: 17, glowY: 33, before: "Резюме", after: "Подбор готов", companies: ["ФосАгро"] },
  { id: "finance", label: "Финансы", icon: "/img/icons/money.svg", x: 44, y: 12, robotX: 51, robotY: 37, activityX: 59, activityY: 29, glowX: 48, glowY: 32, before: "Данные", after: "Отчёт готов", companies: ["АПРИ"] },
  { id: "legal", label: "Юристы", icon: "/img/icons/document.svg", x: 78, y: 12, robotX: 90, robotY: 40, activityX: 91, activityY: 29, glowX: 78, glowY: 33, before: "Договор", after: "Проверено", companies: [] },
  { id: "it", label: "ИТ", icon: "/img/icons/cpu.svg", x: 18, y: 88, robotX: 29, robotY: 67, activityX: 26, activityY: 54, glowX: 18, glowY: 69, before: "Код", after: "Запуск готов", companies: ["Directum"] },
  { id: "procurement", label: "Закупки", icon: "/img/icons/supplier.svg", x: 56, y: 89, robotX: 65, robotY: 66, activityX: 69, activityY: 55, glowX: 56, glowY: 69, before: "Заявка", after: "Заказ готов", companies: [] },
  { id: "service", label: "Клиентский сервис", icon: "/img/icons/messages-square.svg", x: 83, y: 90, robotX: 91, robotY: 73, activityX: 91, activityY: 56, glowX: 83, glowY: 72, before: "Запрос", after: "Ответ готов", companies: ["BI Group", "versta.io"] },
] as const;

type DepartmentId = (typeof departments)[number]["id"];
type FilterId = DepartmentId | "all" | "other";

const caseFilters = [
  { id: "all", label: "Бэк-офис", icon: "/img/icons/building.svg" },
  { id: "finance", label: "Финансы", icon: "/img/icons/money.svg" },
  { id: "hr", label: "HR", icon: "/img/icons/users-round.svg" },
  { id: "legal", label: "Юридический отдел", icon: "/img/icons/document.svg" },
  { id: "procurement", label: "Закупки", icon: "/img/icons/supplier.svg" },
  { id: "it", label: "ИТ", icon: "/img/icons/cpu.svg" },
  { id: "service", label: "Клиентский сервис", icon: "/img/icons/messages-square.svg" },
  { id: "other", label: "Другие направления", icon: "/img/icons/network.svg" },
] as const;

const departmentCompanies = new Set<string>(departments.flatMap((item) => item.companies));

const caseImages: Record<string, string> = {
  "ФосАгро": "/img/cases/phosagro-card.webp",
  "АПРИ": "/img/use-cases/finance-documents-poster.webp",
  "Directum": "/img/use-cases/legal-review.webp",
  "BI Group": "/img/use-cases/smb-customer-hero.webp",
  "versta.io": "/img/use-cases/salesforce-feedback.webp",
};

const caseTitles: Record<string, string> = {
  "ФосАгро": "ИИ-агент помогает подбирать персонал",
  "АПРИ": "Проверка строительных документов",
  "Directum": "Подготовка документов с GigaChat API",
  "BI Group": "Консультации клиентов по недвижимости",
  "versta.io": "Контроль качества клиентских диалогов",
};

function ProjectCaseCard({ study }: { study: CaseStudy }) {
  const href = study.slug && study.story ? `/success-stories/${study.slug}/` : null;

  return (
    <article className={styles.caseCard}>
      <div className={styles.cardVisual}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset(caseImages[study.company] ?? "/img/cases/case-hero.webp")}
          alt=""
          loading="lazy"
        />
        <span className={styles.cardCategory}>{keepRussianShortWords(study.tags[1].label)}</span>
        {href ? <span className={styles.cardArrow} aria-hidden="true">↗</span> : null}
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
        <h3 className={styles.cardTitle}>{keepRussianShortWords(caseTitles[study.company] ?? study.company)}</h3>
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
          aria-label={`Открыть кейс — ${caseTitles[study.company] ?? study.company}`}
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
      <section id="special-project-office" className={styles.officeSection} aria-labelledby="office-title">
        <div className="container-page">
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.eyebrow}>{keepRussianShortWords("За кулисами бизнеса")}</span>
              <h2 id="office-title" className={styles.heading}>{keepRussianShortWords("Выберите отдел и узнайте, как ИИ-агенты меняют его повседневную работу")}</h2>
            </div>
          </div>

          <div
            className={styles.officeScroller}
            role="region"
            aria-label="Схема офиса, прокручивается горизонтально"
            tabIndex={0}
          >
            <div className={styles.officeFrame}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset("/img/special-project/office-open-plan.webp")}
                alt="Изометрическая схема офиса с шестью отделами компании"
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
                    <span className={styles.processState}>
                      <span className={styles.processBefore}>{activeRoom.before}</span>
                      <span className={styles.processAfter}>{activeRoom.after}</span>
                    </span>
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
                {selected === "all" ? "Показаны все кейсы." : `Выбран фильтр «${caseFilters.find((item) => item.id === selected)?.label}». Кейсов: ${shownCases.length}.`}
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
                <span
                  className={styles.caseFilterIcon}
                  style={{
                    maskImage: `url(${asset(filter.icon)})`,
                    WebkitMaskImage: `url(${asset(filter.icon)})`,
                  }}
                  aria-hidden="true"
                />
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
