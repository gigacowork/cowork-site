"use client";

import { useMemo, useState } from "react";

import { CarouselControl } from "@/components/ui/CarouselControl";
import { Icon } from "@/components/ui/Icon";

/**
 * Лента материалов на странице «Медиа» (4549:3002 / 4530:93740).
 *
 * Фильтры переключаются на клиенте: материалов немного и все они уже на
 * странице, поэтому ходить на сервер не за чем — карточки просто скрываются.
 * Без JS видны все материалы, а сами кнопки не появляются.
 *
 * Пагинация в макете нарисована, но листать пока нечего: материалы заданы
 * списком в разметке. Поэтому она отрисована как в макете и не кликается —
 * появятся страницы, здесь добавляется переход.
 */

export type Article = {
  tag: "Новости" | "СМИ о нас" | "Блог";
  date: string;
  title: string;
  text: string;
  /** featured — с фотографией, wide — во всю ширину, small — половина ряда. */
  variant: "featured" | "wide" | "small";
};

const FILTERS = ["Все", "Новости", "СМИ о нас", "Блог"] as const;

/** Пилюля тега на карточке (Tag / Content Category). */
const TAG_CLASS =
  "w-fit rounded-full bg-[linear-gradient(135deg,#e8f4ff_0%,#eafaf4_100%)] px-12 py-8 text-body-m text-text-primary";

/** Круглая стрелка «читать» (CTA / Arrow). */
function ArrowButton() {
  return (
    <span
      aria-hidden
      className="flex size-[48px] shrink-0 items-center justify-center rounded-full bg-bg-page"
    >
      <Icon
        src="/img/icons/arrow-up-right.svg"
        className="size-[12px] text-icon-primary"
      />
    </span>
  );
}

/** Заглушка вместо фотографии — исходников для карточек пока нет. */
function PhotoPlaceholder({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`flex items-center justify-center rounded-[16px] bg-[linear-gradient(135deg,#e3ecf7_0%,#eef3f8_100%)] ${className}`}
    >
      <span className="text-caption text-text-tertiary">Фото</span>
    </div>
  );
}

function Card({ article }: { article: Article }) {
  const withPhoto = article.variant === "featured";
  return (
    <article
      className={`flex flex-col overflow-hidden rounded-24 bg-[#f5f5f5] ${
        withPhoto ? "md:flex-row" : ""
      } ${article.variant === "small" ? "" : "md:col-span-2"}`}
    >
      <div
        className={`flex flex-1 flex-col justify-between gap-32 p-24 md:p-32 ${
          withPhoto ? "md:gap-80" : ""
        }`}
      >
        <div className="flex flex-wrap items-center gap-16 md:gap-32">
          <span className={TAG_CLASS}>{article.tag}</span>
          <span className="text-caption text-text-tertiary">
            {article.date}
          </span>
        </div>
        <div className="flex items-end gap-24">
          <div className="flex flex-1 flex-col gap-8">
            <h3 className="text-h4 font-medium text-text-primary">
              {article.title}
            </h3>
            <p className="text-body-l text-text-secondary">{article.text}</p>
          </div>
          <ArrowButton />
        </div>
      </div>
      {withPhoto ? (
        <PhotoPlaceholder className="order-first m-24 h-[200px] md:order-last md:my-32 md:mr-32 md:ml-0 md:h-auto md:w-[405px] md:shrink-0" />
      ) : null}
    </article>
  );
}

/** Пагинация из макета (4562:94201) — пока не кликается, см. комментарий выше. */
function Pagination() {
  const pages = ["1", "2", "3", "4", "5", "…", "15"];
  return (
    <nav
      aria-label="Страницы материалов"
      className="flex items-center justify-center gap-8"
    >
      {/*
        Стрелки — тот же Carousel Control (802:3907), что листает карточки в
        блоке «Не тратьте часы…» на главной: 56×44, рамка 1.5, состояния
        default / hover / pressed / disabled. Раньше здесь был свой кружок 48
        с рамкой 1 — две разные стрелки на одном сайте.

        Первая страница открыта, листать назад некуда: кнопка в состоянии
        disabled, и это же снимает её с клавиатуры.
      */}
      <CarouselControl
        direction="previous"
        label="Предыдущая страница"
        disabled
      />
      {pages.map((page, i) => (
        <span
          key={page + i}
          aria-current={page === "1" ? "page" : undefined}
          className={`flex size-[40px] items-center justify-center rounded-full text-body-m ${
            page === "1"
              ? "bg-action-secondary-hover text-text-strong"
              : "text-text-secondary"
          } ${i > 2 && i < 6 ? "hidden sm:flex" : ""}`}
        >
          {page}
        </span>
      ))}
      {/*
        Листать вперёд тоже пока некуда, но серой её не делаем: в макете
        пагинация нарисована рабочей. Чтобы кнопка не ловила фокус впустую,
        она убрана из обхода и от диктора — появятся страницы, снять
        `tabIndex` и `aria-hidden` и повесить обработчик.
      */}
      <CarouselControl
        direction="next"
        label="Следующая страница"
        tabIndex={-1}
        aria-hidden
      />
    </nav>
  );
}

export function MediaFeed({ articles }: { articles: Article[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("Все");
  const shown = useMemo(
    () =>
      filter === "Все" ? articles : articles.filter((a) => a.tag === filter),
    [articles, filter],
  );

  return (
    <>
      {/* Фильтры (4541:3003) — на узком экране лента прокручивается вбок. */}
      <div className="-mx-16 overflow-x-auto px-16 [-ms-overflow-style:none] [scrollbar-width:none] md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max gap-8">
          {FILTERS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              aria-pressed={filter === item}
              className={`cursor-pointer rounded-full px-12 py-12 text-body-m transition-colors duration-200 md:px-24 ${
                filter === item
                  ? "bg-action-primary-default text-text-inverse"
                  : "bg-action-secondary-default text-text-primary hover:bg-action-secondary-hover"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-40">
        <div className="grid gap-16 md:grid-cols-2 md:gap-24">
          {shown.map((article) => (
            <Card key={article.title} article={article} />
          ))}
        </div>
        {shown.length ? (
          <Pagination />
        ) : (
          <p className="text-body-l text-text-secondary">
            В этом разделе пока нет материалов.
          </p>
        )}
      </div>
    </>
  );
}

export default MediaFeed;
