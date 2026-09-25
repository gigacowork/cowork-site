"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";

import { CaseCard } from "@/components/cases/CaseCard";
import { SoonCard } from "@/components/cases/SoonCard";
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
 * Поле фильтра по размерам совпадает с Select / Filter 5150:15410, а вот
 * раскрытый список — не родной список браузера, а панель в стиле навигации
 * сайта (Dropdown Panel 3435:15092 и Dropdown Item 3432:15088): те же
 * скругление 24, рамка Border/Subtle, тень Elevation/Drop/Sm и пункты-таблетки
 * высотой 41. На телефоне список раскрывается так же, как на десктопе, вместо
 * системного колеса iOS.
 *
 * Плата за это — клавиатуру и экранный диктор нативный `<select>` больше не
 * даёт, их приходится вести самим: роль listbox, подсветка через
 * `aria-activedescendant`, стрелки, Home/End, Enter, пробел и Escape. Фокус
 * при этом всегда остаётся на кнопке — так устроен select-only combobox в
 * ARIA 1.2, и не надо возвращать фокус на место после выбора.
 *
 * Без JS страница остаётся полной: видны все карточки, кнопки просто не
 * раскрываются.
 */

/** Сколько карточек на странице. Первая на первой странице — широкая. */
const PAGE_SIZE = 9;

/**
 * Потолок высоты списка: в отраслях и ролях до одиннадцати пунктов, и панель
 * во весь список не помещалась бы на телефоне. Дальше — прокрутка внутри
 * панели.
 */
const LIST_MAX = "max-h-[320px]";

/**
 * Пункт списка — Dropdown Item 3432:15088. Курсора здесь нет: у выбираемого
 * пункта он `pointer`, у пункта-обещания — обычный, а два класса в одной строке
 * разрешались бы порядком правил в таблице стилей, а не порядком в строке.
 */
const ITEM_CLASS =
  "flex h-[41px] items-center rounded-full px-12 text-body-m transition-colors";

function Dropdown({
  label,
  value,
  options,
  soon,
  open,
  onToggle,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  /**
   * Последний пункт-обещание («Новые отрасли в разработке»). Он не
   * выбирается: кейсов по нему нет, и фильтр по нему давал бы пустую ленту.
   * Поэтому в `options` его нет — ни клавиатура, ни выбор его не трогают.
   */
  soon?: string;
  open: boolean;
  /** Просит ленту раскрыть этот фильтр или закрыть все: открыт всегда один. */
  onToggle: (next: boolean) => void;
  onChange: (next: string) => void;
}) {
  const id = useId();
  const labelId = `${id}-label`;
  const buttonId = `${id}-button`;
  const listId = `${id}-list`;
  const optionId = (index: number) => `${id}-option-${index}`;

  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  /** Подсвеченный пункт: клавиатура водит по нему, мышь ставит под курсор. */
  const [active, setActive] = useState(0);

  /* Раскрыли — подсветка встаёт на выбранное, а не на первое сверху. */
  useEffect(() => {
    if (open) setActive(Math.max(0, options.indexOf(value)));
  }, [open, options, value]);

  /* Escape и клик мимо закрывают список — как у раскрывашек в шапке. */
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onToggle(false);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) onToggle(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open, onToggle]);

  /* Подсвеченный пункт всегда в виду: список длиннее панели и прокручивается. */
  useEffect(() => {
    if (!open) return;
    listRef.current?.children[active]?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const pick = (index: number) => {
    onChange(options[index]);
    onToggle(false);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    const last = options.length - 1;

    switch (event.key) {
      case "ArrowDown":
      case "ArrowUp": {
        event.preventDefault();
        const step = event.key === "ArrowDown" ? 1 : -1;
        if (!open) {
          onToggle(true);
          return;
        }
        setActive((prev) => Math.min(last, Math.max(0, prev + step)));
        return;
      }
      case "Home":
      case "End":
        if (!open) return;
        event.preventDefault();
        setActive(event.key === "Home" ? 0 : last);
        return;
      case "Enter":
      case " ":
        event.preventDefault();
        if (open) pick(active);
        else onToggle(true);
        return;
      case "Tab":
        /* Уход с поля закрывает список — открытая панель поверх карточек мешает. */
        if (open) onToggle(false);
        return;
      default:
    }
  };

  return (
    <div ref={rootRef} className="relative flex-1">
      <span id={labelId} className="sr-only">
        {label}
      </span>

      {/*
        Кнопка повторяет поле из макета: высота 64, скругление 16, рамка
        Border/Default, заливка Bg/Input. Выбранное значение набрано основным
        цветом, «Все отрасли» и «Все роли» — вторичным: так видно, что фильтр
        включён, ещё до того, как считаешь подпись.
      */}
      <button
        id={buttonId}
        type="button"
        role="combobox"
        aria-controls={listId}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-labelledby={`${labelId} ${buttonId}`}
        aria-activedescendant={open ? optionId(active) : undefined}
        onClick={() => onToggle(!open)}
        onKeyDown={onKeyDown}
        className={`flex h-[64px] w-full cursor-pointer items-center justify-between gap-12 rounded-16 border bg-bg-input px-16 py-12 text-left text-body-l transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary ${
          open ? "border-border-strong" : "border-border-default"
        } hover:border-border-strong ${
          value === options[0] ? "text-text-secondary" : "text-text-primary"
        }`}
      >
        <span className="truncate">{value}</span>
        {/* Icon / Chevron 3440:15106 — 16×16, в открытом состоянии перевёрнута */}
        <Icon
          src="/img/icons/chevron-down.svg"
          className={`size-[16px] shrink-0 text-icon-primary transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/*
        Панель раскрывается вплотную под полем, как в шапке: появление только
        через прозрачность и сдвиг, геометрия всегда одна — ничего не прыгает.
        Ширина по полю, а не фиксированные 304 из шапки: поле занимает половину
        строки, и панель уже него выглядела бы обрубком.
      */}
      <div
        className={`absolute top-full right-0 left-0 z-20 pt-8 transition-[opacity,transform] duration-200 ${
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-4 opacity-0"
        }`}
      >
        <div className="rounded-24 border border-border-subtle bg-bg-page p-12 shadow-drop-sm">
          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            aria-labelledby={labelId}
            className={`flex flex-col gap-4 overflow-y-auto ${LIST_MAX}`}
          >
            {options.map((option, index) => {
              const selected = option === value;

              return (
                /* Клавиатуру ведёт кнопка выше, поэтому у пункта только мышь. */
                <li
                  key={option}
                  id={optionId(index)}
                  role="option"
                  aria-selected={selected}
                  onMouseEnter={() => setActive(index)}
                  onClick={() => pick(index)}
                  className={`${ITEM_CLASS} cursor-pointer ${
                    selected || (open && index === active)
                      ? "bg-action-secondary-hover text-text-strong"
                      : "text-text-primary"
                  }`}
                >
                  {option}
                </li>
              );
            })}

            {/*
              Пункт-обещание: тот же приём, что у ещё не собранных разделов в
              шапке (Navigation Item, Soon) — текст Text/Tertiary, курсор
              обычный, подсветки в наведении нет. `aria-disabled` говорит
              диктору, что выбрать нечего, а `listbox` остаётся валидным:
              недоступный пункт — штатное состояние роли `option`.
            */}
            {soon ? (
              <li
                role="option"
                aria-disabled="true"
                aria-selected={false}
                className={`${ITEM_CLASS} cursor-default text-text-tertiary select-none`}
              >
                {soon}
              </li>
            ) : null}
          </ul>
        </div>
      </div>
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
  /** Какой фильтр раскрыт: открыт всегда только один, как в шапке. */
  const [openFilter, setOpenFilter] = useState<"industry" | "role" | null>(
    null,
  );

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
        {/*
          `relative z-30`: раскрытая панель ложится поверх карточек. Просто
          `z-10` не хватает — у карточки ссылка-подложка лежит на том же
          уровне, а идёт в разметке позже, и перехватывала клики по пунктам
          списка. Шапка выше (z-50) и остаётся над панелью.
        */}
        <div className="relative z-30 flex flex-col gap-12 md:flex-row md:gap-24">
          <Dropdown
            label="Отрасль"
            value={industry}
            options={[ANY_INDUSTRY, ...AVAILABLE_INDUSTRIES]}
            soon="Новые отрасли в разработке"
            open={openFilter === "industry"}
            onToggle={(next) => setOpenFilter(next ? "industry" : null)}
            onChange={pick(setIndustry)}
          />
          <Dropdown
            label="Роль"
            value={role}
            options={[ANY_ROLE, ...AVAILABLE_ROLES]}
            soon="Новые роли в разработке"
            open={openFilter === "role"}
            onToggle={(next) => setOpenFilter(next ? "role" : null)}
            onChange={pick(setRole)}
          />
        </div>
      </div>

      {/*
        Карточка «на подходе» стоит последней и только на последней странице:
        в середине ленты обещание перебивало бы сами кейсы. В пустой выдаче
        она остаётся одна — иначе от фильтра без результата на странице
        оставалась бы одна строчка текста.
      */}
      {visible.length ? (
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          {visible.map((study, index) => (
            <CaseCard
              key={study.slug ?? study.company}
              study={study}
              featured={current === 1 && index === 0}
            />
          ))}
          {current === pages ? <SoonCard /> : null}
        </div>
      ) : (
        <div className="flex flex-col gap-24">
          <p className="text-body-l text-text-secondary">
            По&nbsp;этим фильтрам кейсов пока нет. Попробуйте выбрать другую
            отрасль или&nbsp;роль.
          </p>
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
            <SoonCard />
          </div>
        </div>
      )}

      {pages > 1 ? (
        <Pagination page={current} pages={pages} onChange={setPage} />
      ) : null}
    </div>
  );
}

export default CasesFeed;
