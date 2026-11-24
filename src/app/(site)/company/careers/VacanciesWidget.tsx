"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import Button from "@/components/ui/Button";
import { CarouselControl } from "@/components/ui/CarouselControl";
import Icon from "@/components/ui/Icon";

import { VACANCIES_URL } from "./content";
import {
  loadVacancies,
  vacancySalary,
  vacancySummary,
  type Vacancy,
} from "./vacancies-feed";
import styles from "./careers.module.css";

const desktopMedia = "(min-width: 768px)";

function subscribeToViewport(onChange: () => void) {
  const media = window.matchMedia(desktopMedia);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function getPageSize() {
  return window.matchMedia(desktopMedia).matches ? 6 : 4;
}

const getServerPageSize = () => null;

type Result =
  | { attempt: number; status: "ready"; vacancies: Vacancy[] }
  | { attempt: number; status: "error" };

export default function VacanciesWidget() {
  const pageSize = useSyncExternalStore<number | null>(
    subscribeToViewport,
    getPageSize,
    getServerPageSize,
  );
  const [offset, setOffset] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<Result>();
  const panelRef = useRef<HTMLDivElement>(null);
  const current = result?.attempt === attempt ? result : undefined;
  const vacancies = current?.status === "ready" ? current.vacancies : [];
  const pageCount = pageSize === null ? 0 : Math.ceil(vacancies.length / pageSize);
  const page = pageSize === null ? 0 : Math.min(Math.floor(offset / pageSize), Math.max(0, pageCount - 1));
  const first = page * (pageSize ?? 0);
  const items = pageSize === null ? [] : vacancies.slice(first, first + pageSize);
  const loading = pageSize === null || !current;

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    const timeout = window.setTimeout(() => controller.abort(), 10000);

    loadVacancies(controller.signal)
      .then((vacancies) => {
        if (active) setResult({ attempt, status: "ready", vacancies });
      })
      .catch(() => {
        controller.abort();
        if (active) setResult({ attempt, status: "error" });
      })
      .finally(() => window.clearTimeout(timeout));

    return () => {
      active = false;
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [attempt]);

  function goToPage(nextPage: number) {
    if (pageSize === null) return;

    setOffset(nextPage * pageSize);
    panelRef.current?.focus({ preventScroll: true });
    panelRef.current?.scrollIntoView({ block: "start" });
  }

  return (
    <div
      ref={panelRef}
      role="region"
      aria-label="Список вакансий GigaCowork"
      tabIndex={-1}
      className={`${styles.vacanciesPanel} flex flex-col gap-24`}
    >
      <div aria-busy={loading}>
        {items.length > 0 ? (
          <ul className="grid gap-16 md:grid-cols-2 md:gap-24 lg:grid-cols-3">
            {items.map((vacancy) => {
              const summary = vacancySummary(vacancy.snippet);
              const salary = vacancySalary(vacancy.salary);
              const details = [vacancy.area?.name, vacancy.experience?.name && `Опыт: ${vacancy.experience.name}`];

              return (
                <li
                  key={vacancy.id}
                  className="relative flex min-w-0 flex-col gap-16 rounded-24 border border-border-subtle bg-bg-page p-24 transition-colors hover:bg-bg-glass"
                >
                  <h3 className="text-h4 wrap-anywhere">
                    <a
                      href={vacancy.alternateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start justify-between gap-12 after:absolute after:inset-0 after:rounded-24 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2"
                    >
                      {vacancy.name}
                      <Icon src="/img/icons/arrow-up-right.svg" className="mt-4 size-[14px] text-text-secondary" />
                    </a>
                  </h3>
                  <div className="flex flex-wrap gap-x-16 gap-y-4 text-body-m text-text-secondary">
                    {details.filter(Boolean).map((detail) => <span key={detail}>{detail}</span>)}
                  </div>
                  {salary && <p className="text-body-m font-medium">{salary}</p>}
                  {summary && <p className="text-body-m wrap-anywhere text-text-secondary">{summary}</p>}
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="flex min-h-[96px] flex-wrap items-center gap-16 rounded-24 bg-bg-glass p-24 text-body-m text-text-secondary">
            {loading && <p role="status">Загружаем вакансии…</p>}
            {!loading && current?.status === "ready" && <p role="status">Сейчас нет открытых вакансий в списке.</p>}
            {current?.status === "error" && (
              <>
                <p role="status">Не удалось загрузить вакансии.</p>
                <Button variant="secondary" onClick={() => setAttempt((value) => value + 1)}>
                  Повторить
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      <p className="sr-only" aria-live="polite">
        {items.length > 0 ? `Вакансии ${first + 1}–${first + items.length} из ${vacancies.length}` : ""}
      </p>
      <div className="flex flex-col items-center gap-16 md:grid md:grid-cols-[1fr_auto_1fr]">
        {pageCount > 1 && (
          <div className="flex items-center justify-center gap-8 md:col-start-2">
            <CarouselControl
              direction="previous"
              label="Предыдущие вакансии"
              disabled={page === 0}
              onClick={() => goToPage(page - 1)}
            />
            <CarouselControl
              direction="next"
              label="Следующие вакансии"
              disabled={page + 1 >= pageCount}
              onClick={() => goToPage(page + 1)}
            />
          </div>
        )}
        <Button
          href={VACANCIES_URL}
          target="_blank"
          rel="noopener noreferrer"
          size="lg"
          className="md:col-start-3 md:justify-self-end"
        >
          Все вакансии на hh.ru
          <Icon src="/img/icons/arrow-up-right.svg" className="size-[10px]" />
        </Button>
      </div>
    </div>
  );
}
