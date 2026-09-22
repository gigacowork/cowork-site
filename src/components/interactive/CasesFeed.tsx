"use client";

import { useId, useMemo, useState } from "react";

import { CaseCard } from "@/components/cases/CaseCard";
import { Icon } from "@/components/ui/Icon";
import {
  ANY_INDUSTRY,
  ANY_ROLE,
  AVAILABLE_INDUSTRIES,
  AVAILABLE_ROLES,
  type CaseStudy,
} from "@/content/cases";

/**
 * Лента кейсов с двумя фильтрами — Filters / Cases 5156:28061 / 5159:28070
 * и Case Cards 5130:27310 / 5135:27436.
 *
 * Фильтрация на клиенте: все кейсы уже отрисованы на странице, ходить за
 * ними на сервер не за чем. Без JS страница остаётся полной — видны все
 * карточки, селекты просто ни на что не влияют.
 *
 * В списках только те отрасли и роли, по которым есть кейсы: пункт, по
 * которому находится пусто, — обещание, которого страница не выполняет.
 *
 * Селект — нативный `<select>`: он сам даёт клавиатуру, подсказки экранного
 * диктора и родной список на телефоне. Стрелка из макета нарисована поверх
 * (`appearance-none`), поле по размерам совпадает с Select / Filter 5150:15410.
 */

/** Сколько карточек на странице. Первая на первой странице — широкая. */
const PAGE_SIZE = 9;

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (next: string) => void;
}) {
  const id = useId();

  return (
    <div className="relative flex-1">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-[64px] w-full cursor-pointer appearance-none rounded-16 border border-border-default bg-bg-input px-16 py-12 pr-48 text-body-l text-text-secondary transition-colors duration-200 hover:border-border-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {/* Icon / Chevron 3440:15106 — 16×16, прижата к правому полю 16 */}
      <Icon
        src="/img/icons/chevron-down.svg"
        className="pointer-events-none absolute top-1/2 right-16 size-[16px] -translate-y-1/2 text-icon-primary"
      />
    </div>
  );
}

/** Пагинация — Pagination / Cases 5137:27637. */
function Pagination({
  page,
  pages,
  onChange,
}: {
  page: number;
  pages: number;
  onChange: (next: number) => void;
}) {
  return (
    <nav
      aria-label="Страницы кейсов"
      className="flex items-center justify-center gap-8"
    >
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        aria-label="Предыдущая страница"
        className="flex size-[48px] cursor-pointer items-center justify-center rounded-full border border-border-default disabled:cursor-default"
      >
        <Icon
          src="/img/icons/arrow-next.svg"
          className={`size-[20px] rotate-180 ${
            page === 1 ? "text-icon-secondary" : "text-icon-primary"
          }`}
        />
      </button>

      {Array.from({ length: pages }, (_, i) => i + 1).map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onChange(item)}
          aria-current={item === page ? "page" : undefined}
          className={`flex size-[40px] cursor-pointer items-center justify-center rounded-full text-body-m ${
            item === page
              ? "bg-action-secondary-hover text-text-strong"
              : "text-text-secondary"
          }`}
        >
          {item}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page === pages}
        aria-label="Следующая страница"
        className="flex size-[48px] cursor-pointer items-center justify-center rounded-full border border-border-default disabled:cursor-default"
      >
        <Icon
          src="/img/icons/arrow-next.svg"
          className={`size-[20px] ${
            page === pages ? "text-icon-secondary" : "text-icon-primary"
          }`}
        />
      </button>
    </nav>
  );
}

export function CasesFeed({ cases }: { cases: CaseStudy[] }) {
  const [industry, setIndustry] = useState<string>(ANY_INDUSTRY);
  const [role, setRole] = useState<string>(ANY_ROLE);
  const [page, setPage] = useState(1);

  const shown = useMemo(
    () =>
      cases.filter(
        (item) =>
          (industry === ANY_INDUSTRY || item.industry === industry) &&
          (role === ANY_ROLE || item.role === role),
      ),
    [cases, industry, role],
  );

  const pages = Math.max(1, Math.ceil(shown.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const visible = shown.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  /** Смена фильтра всегда возвращает на первую страницу. */
  const pick = (setter: (next: string) => void) => (next: string) => {
    setter(next);
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-32 md:gap-40">
      {/* Filters / Cases — 5156:28061 / 5159:28070 */}
      <div className="flex flex-col gap-24">
        <p className="text-h4 font-medium text-text-primary">
          Фильтры для&nbsp;поиска
        </p>
        <div className="flex flex-col gap-12 md:flex-row md:gap-24">
          <Select
            label="Отрасль"
            value={industry}
            options={[ANY_INDUSTRY, ...AVAILABLE_INDUSTRIES]}
            onChange={pick(setIndustry)}
          />
          <Select
            label="Роль"
            value={role}
            options={[ANY_ROLE, ...AVAILABLE_ROLES]}
            onChange={pick(setRole)}
          />
        </div>
      </div>

      {visible.length ? (
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          {visible.map((study, index) => (
            <CaseCard
              key={study.slug ?? study.company}
              study={study}
              featured={current === 1 && index === 0}
            />
          ))}
        </div>
      ) : (
        <p className="text-body-l text-text-secondary">
          По&nbsp;этим фильтрам кейсов пока нет. Попробуйте выбрать другую
          отрасль или&nbsp;роль.
        </p>
      )}

      {pages > 1 ? (
        <Pagination page={current} pages={pages} onChange={setPage} />
      ) : null}
    </div>
  );
}

export default CasesFeed;
