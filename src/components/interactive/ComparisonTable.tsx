"use client";

import { useEffect, useRef, useState } from "react";

import { Icon } from "@/components/ui/Icon";
import { asset } from "@/lib/asset";

/**
 * Таблица сравнения вариантов поставки — /pricing (десктоп 4110:23585,
 * мобильный 4174:3008 + 4174:3015).
 *
 * Один компонент на обе раскладки, потому что данные одни и те же:
 *   • от lg — таблица из четырёх колонок (характеристика + три поставки);
 *   • ниже lg — переключатель «Облако / Гибрид / ПАК» и те же строки в две
 *     колонки, где вторая показывает значение выбранной поставки.
 * Держать это двумя компонентами значило бы дублировать разбивку по группам
 * и следить, чтобы строки не разъехались.
 *
 * Клиентский компонент нужен только ради переключателя, поэтому данные
 * приходят пропсами и остаются обычными строками — сериализуются без потерь.
 */

export type ComparisonRow = {
  label: string;
  /** Значения по колонкам в том же порядке, что и `SUPPLIES`. */
  values: [string, string, string];
};

export type ComparisonGroup = {
  title: string;
  /** Путь к иконке-маске рядом с заголовком группы. */
  icon: string;
  rows: ComparisonRow[];
};

export type ComparisonColumn = {
  title: string;
  /** Кадр поставки в шапке колонки (только десктоп). */
  image: string;
  /** Заливка шапки колонки — у каждой поставки своя. */
  gradient: string;
};

/**
 * Разделитель строк (#e6e9ed). Обводки по периметру таблицы нет: в макете она
 * есть, но на светлом фоне страницы читалась как лишняя серая рамка вокруг
 * блока. Сняли по просьбе — внутренние разделители остались.
 */
const BORDER = "border-border-subtle";

/** Одна группа строк: заголовок с иконкой и сами строки. */
function Group({ group }: { group: ComparisonGroup }) {
  return (
    <div>
      <div className="flex items-center gap-8 bg-[#f2fafa] px-24 py-12">
        <Icon
          src={group.icon}
          className="size-[24px] shrink-0 text-icon-primary"
        />
        <span className="text-h4 font-medium text-text-primary">
          {group.title}
        </span>
      </div>
      {group.rows.map((row) => (
        <div
          key={row.label}
          className={`grid grid-cols-4 gap-24 border-t ${BORDER}`}
        >
          {/*
            Высота строки 64 из макета — минимум, а не жёсткий размер:
            значения в две строки («Шифрование, контроль доступа»)
            разъезжают ячейку до 80, как и в макете.
          */}
          <div className="flex min-h-[64px] items-center px-24 py-12 text-body-m text-text-secondary">
            {row.label}
          </div>
          {row.values.map((value, i) => (
            <div
              key={i}
              className="flex min-h-[64px] items-center px-24 py-12 text-body-m text-text-primary"
            >
              {value}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export function ComparisonTable({
  columns,
  groups,
}: {
  columns: [ComparisonColumn, ComparisonColumn, ComparisonColumn];
  groups: ComparisonGroup[];
}) {
  const [tab, setTab] = useState(0);

  /*
    Пока шапка стоит на своём месте, её плашки скруглены только сверху:
    снизу к ним вплотную идёт таблица. Как только шапка отрывается
    и начинает ехать над строками, она становится отдельным слоем —
    и плашки скругляются со всех сторон.

    Момент прилипания ловит невидимый маячок над шапкой: у `sticky` своих
    событий нет. Шапка считается прилипшей, когда маячок ушёл выше
    шапки сайта; её высоту берём из `--header-h`, чтобы не дублировать
    число из CSS.
  */
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    /*
      Состояние считается по положению маячка, а не через IntersectionObserver.
      Наблюдатель срабатывает только на пересечении границы, а «не виден
      сверху» и «не виден снизу» для него одно и то же состояние: при
      резком переходе сверху вниз (Home/End, восстановление прокрутки)
      события не было вовсе, и стекло оставалось включённым в нулевой
      позиции страницы.

      Чтение геометрии прижато к кадру через rAF, а setState с тем же
      значением React гасит сам — перерисовка только на смене состояния.
    */
    let frame = 0;
    let headerH = 0;

    const readHeaderH = () => {
      headerH =
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--header-h",
          ),
        ) || 0;
    };

    const update = () => {
      frame = 0;
      setStuck(el.getBoundingClientRect().top < headerH);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const onResize = () => {
      readHeaderH();
      onScroll();
    };

    readHeaderH();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <>
      {/* ── Десктоп: четыре колонки (4110:23585) ── */}
      {/*
        `overflow-x-clip`, а не `overflow-hidden`: любой `overflow: hidden`
        у родителя делает его областью прокрутки и отключает `sticky`
        у потомков. `clip` области прокрутки не создаёт, а по вертикали
        остаётся `visible` — шапка прилипает, а кадры поставок
        по-прежнему обрезаются своими ячейками.
      */}
      <div className="hidden overflow-x-clip rounded-24 bg-bg-page shadow-[0_12px_48px_-8px_#60738f33] lg:block">
        {/*
          Шапка липнет не до конца таблицы, а до последней группы.
          `sticky` держится в границах своего родителя, поэтому шапка
          и все группы, кроме последней, лежат в одной обёртке: как только
          начинается последняя («Внедрение»), шапка отлипает и уезжает
          вверх вместе с остальной таблицей.
        */}
        <div>
          {/*
            Шапка: ячейка «Характеристика» + три поставки. Колонки разделены
            зазором 24 — в макете это auto-layout с gap, и на цветных ячейках
            зазоры читаются как белые промежутки между «вкладками».

            Шапка прилипает под шапкой сайта (`--header-h`): таблица длинная,
            и без этого к середине непонятно, какой колонке принадлежит
            значение.

            Сплошной белой заливки у шапки нет: она читалась полосой,
            заливая зазоры 24 между колонками. Вместо неё — матовое стекло,
            как у шапки сайта: полупрозрачный белый с размытием. Строки
            под шапкой не читаются, но зазоры не выглядят глухими.
          */}
          {/* Маячок без высоты: разметку не сдвигает. */}
          <div ref={sentinelRef} aria-hidden className="h-0" />
          <div className="sticky top-[var(--header-h)] z-10 grid grid-cols-4 gap-24">
            {/*
              Подложка отдельным слоем, а не фоном сетки: так её можно
              плавно вводить по прозрачности и показывать только в прилипшем
              состоянии: пока шапка стоит на месте, закрывать нечего.
              Значения стекла — те же, что у таблетки навигации
              (см. Header.tsx): белый 78% и размытие 11.
            */}
            <div
              aria-hidden
              className={`pointer-events-none absolute inset-0 -z-10 bg-[rgba(255,255,255,0.78)] backdrop-blur-[11px] transition-opacity duration-200 ${
                stuck ? "opacity-100" : "opacity-0"
              }`}
            />
            <div
              className={`flex min-h-[112px] items-center rounded-t-24 bg-neutral-50 p-24 transition-[border-radius] duration-200 ${
                stuck ? "rounded-b-24" : ""
              }`}
            >
              <span className="text-h4 font-medium text-text-primary">
                Характеристика
              </span>
            </div>
            {columns.map((column) => (
              <div
                key={column.title}
                className={`relative flex min-h-[112px] items-center gap-16 overflow-hidden rounded-t-24 p-24 transition-[border-radius] duration-200 ${column.gradient} ${
                  stuck ? "rounded-b-24" : ""
                }`}
              >
                <span className="text-h4 font-medium whitespace-nowrap text-text-primary">
                  {column.title}
                </span>
                {/* Кадр поставки прижат к правому краю ячейки и обрезается ею. */}
                <img
                  src={asset(column.image)}
                  alt=""
                  aria-hidden
                  className="pointer-events-none absolute top-1/2 right-0 h-[134px] -translate-y-1/2 object-contain"
                />
              </div>
            ))}
          </div>

          {groups.slice(0, -1).map((group) => (
            <Group key={group.title} group={group} />
          ))}
        </div>

        {groups.slice(-1).map((group) => (
          <Group key={group.title} group={group} />
        ))}
      </div>

      {/* ── Мобильный: переключатель поставок (4174:3008) ── */}
      <div className="flex flex-col gap-24 lg:hidden">
        <div
          role="tablist"
          aria-label="Вариант поставки"
          className="flex gap-4 rounded-full bg-neutral-50 p-4"
        >
          {columns.map((column, i) => (
            <button
              key={column.title}
              type="button"
              role="tab"
              aria-selected={i === tab}
              onClick={() => setTab(i)}
              className={`flex-1 rounded-full px-12 py-8 text-body-m transition-colors ${
                i === tab
                  ? "bg-bg-page text-text-primary shadow-[0_2px_4px_#60738f29]"
                  : "text-text-secondary"
              }`}
            >
              {column.title}
            </button>
          ))}
        </div>

        <div className="overflow-hidden rounded-24 bg-bg-page shadow-[0_12px_48px_-8px_#60738f33]">
          {groups.map((group) => (
            <div key={group.title}>
              <div className="flex items-center gap-8 bg-[#f2fafa] px-16 py-12">
                <Icon
                  src={group.icon}
                  className="size-[24px] shrink-0 text-icon-primary"
                />
                <span className="text-body-l font-medium text-text-primary">
                  {group.title}
                </span>
              </div>
              {group.rows.map((row) => (
                <div
                  key={row.label}
                  className={`flex items-start justify-between gap-16 border-t px-16 py-12 ${BORDER}`}
                >
                  <span className="text-body-m text-text-secondary">
                    {row.label}
                  </span>
                  <span className="text-right text-body-m text-text-primary">
                    {row.values[tab]}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default ComparisonTable;
