"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { Icon } from "@/components/ui/Icon";
import { Image } from "@/components/ui/Image";
import { keepLegalFormWithName } from "@/lib/typography";

/**
 * Лента материалов на странице «Медиа» (4549:3002 / 4530:93740).
 *
 * Фильтры переключаются на клиенте: материалов немного и все они уже на
 * странице, поэтому ходить на сервер не за чем — карточки просто скрываются.
 * Без JS видны все материалы, а сами кнопки не появляются.
 *
 * При выдаче больше десяти материалов карточки делятся на страницы по восемь:
 * каждая полная страница заканчивается парой обычных карточек.
 */

export type Article = {
  tag: "Новости" | "СМИ о нас" | "Блог";
  date: string;
  publishedAt?: string;
  title: string;
  previewTitle?: string;
  text: string;
  source?: string;
  sourceLogo?: { src: string; width: number; height: number };
  href?: string;
  external?: boolean;
};

const FILTERS = ["Все", "Новости", "СМИ о нас", "Блог"] as const;
const PAGE_SIZE = 8;
const PAGINATION_THRESHOLD = 10;

type PageItem = number | "ellipsis";

function pageItems(page: number, total: number, mobile: boolean): PageItem[] {
  const firstGroup = mobile ? 3 : 5;
  if (total <= firstGroup + 1) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }
  if (page <= firstGroup - 1) {
    return [...Array.from({ length: firstGroup }, (_, index) => index + 1), "ellipsis", total];
  }
  if (page >= total - firstGroup + 2) {
    return [1, "ellipsis", ...Array.from({ length: firstGroup }, (_, index) => total - firstGroup + index + 1)];
  }
  return mobile
    ? [1, "ellipsis", page, "ellipsis", total]
    : [1, "ellipsis", page - 1, page, page + 1, "ellipsis", total];
}

function Pagination({ page, total, onChange }: { page: number; total: number; onChange: (next: number) => void }) {
  const renderPages = (mobile: boolean) => (
    <div className={`items-center gap-8 ${mobile ? "flex md:hidden" : "hidden md:flex"}`}>
      {pageItems(page, total, mobile).map((item, index) => item === "ellipsis" ? (
        <span key={`ellipsis-${index}`} aria-hidden className="flex w-[24px] items-center justify-center text-body-m text-text-primary">…</span>
      ) : (
        <button
          key={item}
          type="button"
          onClick={() => onChange(item)}
          aria-label={`Страница ${item}`}
          aria-current={item === page ? "page" : undefined}
          className={`flex size-[40px] cursor-pointer items-center justify-center rounded-full border text-body-m transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0dace0] ${item === page
            ? "border-action-primary-default bg-action-primary-default text-text-inverse"
            : "border-border-subtle bg-action-secondary-default text-text-primary hover:border-text-primary"}`}
        >
          {item}
        </button>
      ))}
    </div>
  );

  return (
    <nav aria-label="Страницы медиа" className="flex items-center justify-center gap-8">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        aria-label="Предыдущая страница"
        className="flex size-[48px] cursor-pointer items-center justify-center rounded-full border border-border-subtle bg-action-secondary-default text-icon-primary transition-colors hover:border-text-primary disabled:cursor-default disabled:opacity-32 disabled:hover:border-border-subtle"
      >
        <Icon src="/img/icons/pagination-arrow-left.svg" className="size-[20px]" />
      </button>
      {renderPages(true)}
      {renderPages(false)}
      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page === total}
        aria-label="Следующая страница"
        className="flex size-[48px] cursor-pointer items-center justify-center rounded-full border border-border-subtle bg-action-secondary-default text-icon-primary transition-colors hover:border-text-primary disabled:cursor-default disabled:opacity-32 disabled:hover:border-border-subtle"
      >
        <Icon src="/img/icons/pagination-arrow-right.svg" className="size-[20px]" />
      </button>
    </nav>
  );
}

/** Пилюля тега на карточке (Tag / Content Category). */
const TAG_CLASS =
  "w-fit rounded-full bg-[linear-gradient(32.8533deg,#a6fddc_0.95206%,#b1f1ff_50.802%,#cfe7ff_101.64%)] px-12 py-8 text-body-m text-text-primary";

/** Стрелка вправо для страниц сайта, по диагонали — для внешних публикаций. */
function ArrowButton({ external }: { external: boolean }) {
  return (
    <span
      aria-hidden
      className={`flex size-[48px] shrink-0 items-center justify-center rounded-full bg-bg-page ${external ? "" : "border border-border-subtle"}`}
    >
      <Icon
        src={external ? "/img/icons/arrow-up-right.svg" : "/img/icons/pagination-arrow-right.svg"}
        className={`${external ? "size-[12px]" : "size-[20px]"} text-icon-primary`}
      />
    </span>
  );
}

function Card({ article, wide }: { article: Article; wide: boolean }) {
  return (
    <article
      className={`relative flex flex-col overflow-hidden rounded-24 bg-[#f5f5f5] ${article.href ? "transition-colors hover:bg-[#ebf3f7]" : ""} ${
        wide ? "h-[340px] md:col-span-2 md:h-[320px]" : "h-[340px] md:h-[320px]"
      }`}
    >
      <div
        className="relative z-10 flex min-h-0 flex-1 flex-col gap-24 overflow-hidden p-24 md:p-32"
      >
        <div className="flex shrink-0 flex-wrap items-center gap-16 md:gap-32">
          <span className={TAG_CLASS}>{article.tag}</span>
          {article.date ? <span className="text-caption text-text-tertiary">{article.date}</span> : null}
        </div>
        <div className="flex min-h-0 flex-col gap-8 overflow-hidden">
          <h3 className="line-clamp-3 shrink-0 text-h4 font-medium text-text-primary">
            {article.href ? <Link href={article.href} target={article.external ? "_blank" : undefined} rel={article.external ? "noopener noreferrer" : undefined} aria-label={article.title} title={article.title} className="after:absolute after:inset-0 focus-visible:rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0dace0]">{keepLegalFormWithName(article.previewTitle ?? article.title)}</Link> : keepLegalFormWithName(article.previewTitle ?? article.title)}
          </h3>
          {article.text ? (
            <p className="line-clamp-3 shrink-0 text-body-l text-text-secondary">
              {keepLegalFormWithName(article.text)}
            </p>
          ) : null}
          {article.sourceLogo ? (
            <Image {...article.sourceLogo} alt={article.source ?? ""} className="mt-8 h-[24px] w-auto max-w-[200px] shrink-0 object-contain object-left" />
          ) : article.source ? <span className="text-caption text-text-tertiary">{article.source}</span> : null}
        </div>
        {article.href ? <div className="absolute right-24 bottom-24 md:right-32 md:bottom-32">
          <ArrowButton external={Boolean(article.external)} />
        </div> : null}
      </div>
    </article>
  );
}

export function MediaFeed({ articles }: { articles: Article[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("Все");
  const [page, setPage] = useState(1);
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("category") === "news") {
      setFilter("Новости");
    }
  }, []);
  const shown = useMemo(
    () =>
      filter === "Все" ? articles : articles.filter((a) => a.tag === filter),
    [articles, filter],
  );
  const pages = shown.length > PAGINATION_THRESHOLD ? Math.ceil(shown.length / PAGE_SIZE) : 1;
  const visible = pages === 1 ? shown : shown.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const changePage = (next: number) => {
    if (next < 1 || next > pages || next === page) return;
    setPage(next);
    document.getElementById("media-feed")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      {/* Фильтры (4541:3003) — на узком экране лента прокручивается вбок. */}
      <div id="media-feed" className="-mx-16 scroll-mt-112 overflow-x-auto px-16 [-ms-overflow-style:none] [scrollbar-width:none] md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max gap-8">
          {FILTERS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => { setFilter(item); setPage(1); }}
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
          {visible.map((article, index) => (
            <Card key={article.title} article={article} wide={index % 3 === 2} />
          ))}
        </div>
        {shown.length ? null : (
          <p className="text-body-l text-text-secondary">
            В этом разделе пока нет материалов.
          </p>
        )}
        {pages > 1 ? <Pagination page={page} total={pages} onChange={changePage} /> : null}
      </div>
    </>
  );
}

export default MediaFeed;
