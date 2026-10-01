"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { Icon } from "@/components/ui/Icon";
import { Image } from "@/components/ui/Image";

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
  previewTitle?: string;
  text: string;
  href?: string;
  previewImage?: string;
  previewOnCompact?: boolean;
};

const FILTERS = ["Все", "Новости", "СМИ о нас", "Блог"] as const;

/** Пилюля тега на карточке (Tag / Content Category). */
const TAG_CLASS =
  "w-fit rounded-full bg-[linear-gradient(32.8533deg,#a6fddc_0.95206%,#b1f1ff_50.802%,#cfe7ff_101.64%)] px-12 py-8 text-body-m text-text-primary";

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

/** Сгенерированные абстракции в палитре хиро для широких карточек. */
const ABSTRACT_PREVIEWS: Record<Article["tag"], string> = {
  "СМИ о нас": "/img/media/card-abstract-press.png",
  Новости: "/img/media/card-abstract-news.png",
  Блог: "/img/media/card-abstract-blog.png",
};

function Card({ article, wide }: { article: Article; wide: boolean }) {
  const withMedia = wide;
  return (
    <article
      className={`relative flex flex-col overflow-hidden rounded-24 bg-[#f5f5f5] ${article.href ? "transition-colors hover:bg-[#ebf3f7]" : ""} ${
        wide ? "h-[500px] md:col-span-2 md:h-[420px] md:flex-row" : "h-[340px] md:h-[320px]"
      }`}
    >
      {!wide && article.previewOnCompact && article.previewImage ? (
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <Image src={article.previewImage} alt="" width={1254} height={1254} className="size-full object-cover opacity-55" />
        </div>
      ) : null}
      <div
        className="relative z-10 flex min-h-0 flex-1 flex-col gap-24 overflow-hidden p-24 pb-[88px] md:p-32 md:pb-[96px]"
      >
        <div className="flex shrink-0 flex-wrap items-center gap-16 md:gap-32">
          <span className={TAG_CLASS}>{article.tag}</span>
          {article.date ? <span className="text-caption text-text-tertiary">{article.date}</span> : null}
        </div>
        <div className="flex min-h-0 flex-col gap-8 overflow-hidden">
          <h3 className="line-clamp-3 text-h4 font-medium text-text-primary">
            {article.href ? <Link href={article.href} aria-label={article.title} title={article.title} className="after:absolute after:inset-0 focus-visible:rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0dace0]">{article.previewTitle ?? article.title}</Link> : article.previewTitle ?? article.title}
          </h3>
          <p className="line-clamp-2 text-body-l text-text-secondary">{article.text}</p>
        </div>
        <div className="absolute right-24 bottom-24 md:right-32 md:bottom-32">
          <ArrowButton />
        </div>
      </div>
      {withMedia ? (
        <div aria-hidden className="order-first m-[24px] h-[200px] shrink-0 overflow-hidden rounded-[16px] md:order-last md:my-[32px] md:mr-[32px] md:ml-0 md:size-[356px]">
          <Image src={article.previewImage ?? ABSTRACT_PREVIEWS[article.tag]} alt="" width={1254} height={1254} className="size-full object-cover" />
        </div>
      ) : null}
    </article>
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
          {shown.map((article, index) => (
            <Card key={article.title} article={article} wide={index % 5 === 0} />
          ))}
        </div>
        {shown.length ? null : (
          <p className="text-body-l text-text-secondary">
            В этом разделе пока нет материалов.
          </p>
        )}
      </div>
    </>
  );
}

export default MediaFeed;
