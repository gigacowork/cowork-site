import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { FinalCta } from "@/components/sections/FinalCta";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Icon } from "@/components/ui/Icon";
import { NEWS_ARTICLES, NEWS_ARTICLE_BY_SLUG, newsDateLabel, type NewsBlock } from "@/content/news-articles";
import { pageMetadata } from "@/lib/site";
import { keepLegalFormWithName } from "@/lib/typography";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return NEWS_ARTICLES.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = NEWS_ARTICLE_BY_SLUG.get(slug);
  if (!article) return {};
  return pageMetadata({
    title: `${article.title} — Новости GigaCowork`,
    description: article.blocks.find((block) => block.kind === "paragraph")?.text ?? article.title,
    path: `/media/news/${slug}/`,
  });
}

function NewsBlockView({ block }: { block: NewsBlock }) {
  if (block.kind === "heading") {
    return <h2 className="pt-16 text-[25px] leading-[1.2] font-medium text-text-primary md:text-[36px]">{keepLegalFormWithName(block.text)}</h2>;
  }
  if (block.kind === "listItem") {
    return <li className="ml-24 list-disc whitespace-pre-line text-[16px] leading-[1.6] text-text-primary md:text-[18px]">{keepLegalFormWithName(block.text)}</li>;
  }
  return <p className="whitespace-pre-line text-[16px] leading-[1.6] text-text-primary md:text-[18px]">{keepLegalFormWithName(block.text)}</p>;
}

function RelatedNews({ currentSlug }: { currentSlug: string }) {
  const sorted = [...NEWS_ARTICLES].sort((a, b) => b.date.localeCompare(a.date));
  const currentIndex = sorted.findIndex((item) => item.slug === currentSlug);
  const related = [1, 2, 3].map((offset) => sorted[(currentIndex + offset) % sorted.length]);
  const allNewsHref = "/media/?category=news#media-feed";

  return (
    <section className="container-page py-64 md:py-80" aria-labelledby="related-news-heading">
      <div className="mb-16 flex items-center justify-between md:mb-32">
        <h2 id="related-news-heading" className="text-[25px] leading-[1.2] font-medium tracking-[-0.02em] text-text-primary md:text-[36px]">Читайте также</h2>
        <Link href={allNewsHref} className="hidden items-center gap-8 rounded-full px-24 py-12 text-[14px] text-text-primary hover:bg-[#f5f5f5] md:inline-flex">Все новости <span aria-hidden>↗</span></Link>
      </div>
      <div className="grid gap-16 md:grid-cols-3">
        {related.map((item) => (
          <Link key={item.slug} href={`/media/news/${item.slug}/`} className="group relative flex min-h-[270px] flex-col gap-32 rounded-24 bg-[#f5f5f5] p-24 transition-colors hover:bg-[#ebf3f7] md:p-32">
            <span className="flex w-full items-start justify-between gap-12">
              <span className="shrink-0 rounded-full bg-[linear-gradient(32.8533deg,#a6fddc_0.95206%,#b1f1ff_50.802%,#cfe7ff_101.64%)] px-[12px] py-[10px] text-[14px] leading-[1.2] text-text-primary">Новости</span>
              <span className="pt-8 text-right text-[12px] leading-[1.2] text-text-tertiary">{newsDateLabel(item.date)}</span>
            </span>
            <span className="flex flex-col gap-[10px] pr-[48px]">
              <span className="line-clamp-3 text-[20px] leading-[1.2] font-medium tracking-[-0.02em] text-text-primary">{keepLegalFormWithName(item.title)}</span>
              <span className="line-clamp-3 text-[16px] leading-[1.2] text-text-secondary">{keepLegalFormWithName(item.blocks.find((block) => block.kind === "paragraph")?.text ?? "")}</span>
            </span>
            <span aria-hidden className="absolute right-24 bottom-24 flex size-[48px] items-center justify-center rounded-full border border-border-subtle bg-white transition-transform group-hover:translate-x-1 md:right-32 md:bottom-32">
              <Icon src="/img/icons/arrow-next.svg" className="size-[20px] text-text-primary" />
            </span>
          </Link>
        ))}
      </div>
      <Link href={allNewsHref} className="mt-16 inline-flex py-4 text-[12px] leading-[1.2] text-text-secondary hover:underline md:hidden">Все новости</Link>
    </section>
  );
}

export default async function NewsPage({ params }: Props) {
  const { slug } = await params;
  const article = NEWS_ARTICLE_BY_SLUG.get(slug);
  if (!article) notFound();

  return (
    <>
      <section className="relative isolate flex min-h-[360px] items-end overflow-hidden bg-[linear-gradient(227deg,#d4e2ff_11%,#b3ebf6_80%,#b3f6e1_102%)] px-16 pb-48 pt-120 md:min-h-[500px] md:px-0 md:pb-96 md:pt-[272px]">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-transparent to-white/80" />
        <Breadcrumbs items={[{ label: "Медиа", href: "/media/" }, { label: article.title }]} />
        <div className="container-page w-full">
          <Link href="/media/" className="mb-24 inline-block rounded-full bg-[#f1f3f5] px-12 py-4 text-[12px] text-text-secondary hover:bg-white">НОВОСТИ</Link>
          <h1 className="max-w-[980px] text-[32px] leading-[1.2] font-medium tracking-[-0.02em] text-text-primary md:text-[48px]">{keepLegalFormWithName(article.title)}</h1>
        </div>
      </section>

      <div className="container-page py-40 md:py-64">
        <article className="max-w-[900px]">
          <p className="mb-32 text-[14px] text-text-secondary">{newsDateLabel(article.date)}</p>
          <div className="flex flex-col gap-24 md:gap-32">
            {article.blocks.map((block, index) => <NewsBlockView key={`${index}-${block.text.slice(0, 20)}`} block={block} />)}
          </div>
          {article.mediaUrl ? (
            <a className="mt-40 inline-block text-[16px] text-[#08789d] underline" href={article.mediaUrl} target="_blank" rel="noopener noreferrer">Публикация в СМИ ↗</a>
          ) : null}
        </article>
      </div>
      <RelatedNews currentSlug={slug} />
      <FinalCta title={<>Проверьте эффект<br />за 7 дней</>} />
    </>
  );
}
