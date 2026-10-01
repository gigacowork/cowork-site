import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BLOG_ARTICLES, BLOG_ARTICLE_BY_SLUG, type BlogArticle, type BlogBlock } from "@/content/blog-articles";
import { FinalCta } from "@/components/sections/FinalCta";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProductivityVisual } from "@/components/ui/ProductivityVisual";
import { pageMetadata } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return BLOG_ARTICLES.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = BLOG_ARTICLE_BY_SLUG.get(slug);
  if (!article) return {};
  return pageMetadata({
    title: `${article.title} — Блог GigaCowork`,
    description: article.description,
    path: `/media/blog/${slug}/`,
  });
}

function headingId(index: number) {
  return `section-${index}`;
}

function readingLabel(minutes: number) {
  const ending = minutes % 10 === 1 && minutes % 100 !== 11 ? "минута" : minutes % 10 >= 2 && minutes % 10 <= 4 && (minutes % 100 < 12 || minutes % 100 > 14) ? "минуты" : "минут";
  return `${minutes} ${ending} чтения`;
}

function Toc({ article }: { article: BlogArticle }) {
  const headings = article.blocks
    .map((block, index) => ({ ...block, index }))
    .filter((block) => block.kind === "heading");

  return (
    <nav aria-label="Содержание статьи" className="rounded-24 bg-[#f7f8fa] p-24">
      <p className="mb-12 text-[14px] text-text-tertiary">Содержание</p>
      <ol className="flex flex-col gap-12">
        {headings.map((heading) => (
          <li key={heading.index}>
            <a className="text-[14px] leading-[1.2] text-text-secondary hover:text-[#0dace0]" href={`#${headingId(heading.index)}`}>
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function ArticleBlock({ block, index }: { block: BlogBlock; index: number }) {
  if (block.kind === "heading") {
    return <h2 id={headingId(index)} className="scroll-mt-112 pt-24 text-[25px] leading-[1.2] font-medium tracking-[-0.02em] text-text-primary md:pt-0 md:text-[36px]">{block.text}</h2>;
  }
  if (block.kind === "subheading") {
    return <h3 className="text-[20px] leading-[1.25] font-medium text-text-primary md:text-[24px]">{block.text}</h3>;
  }
  if (block.kind === "listItem") {
    return <p className="border-l-2 border-[#a6fddc] pl-16 text-[16px] leading-[1.6] text-text-primary md:text-[18px]">{block.text.replace(/^[-–•]\s+/, "")}</p>;
  }
  return <p className="text-[16px] leading-[1.6] text-text-primary md:text-[18px]">{block.text}</p>;
}

const PRODUCTIVITY_METRICS = [
  { value: "×60", label: "быстрее оценка задержки поставки: 2 минуты вместо 2 часов" },
  { value: "×18", label: "быстрее решение по договору: 10 минут вместо 3 часов" },
  { value: "×6", label: "быстрее подготовка КП: 10 минут вместо 1–2 часов" },
];

function Metrics() {
  return (
    <div className="grid md:grid-cols-3 md:gap-16" aria-label="Показатели из статьи">
      {PRODUCTIVITY_METRICS.map((metric) => (
        <div key={metric.value} className="flex items-center gap-16 border-t border-border-subtle py-16 first:border-t-0 md:flex-col md:gap-16 md:border-0 md:py-0">
          <strong className="w-[88px] shrink-0 text-[36px] leading-none font-medium tracking-[-0.02em] text-text-primary md:w-auto md:text-[96px] md:font-normal">{metric.value}</strong>
          <span className="text-[14px] leading-[1.2] text-text-secondary md:text-center md:text-[16px] md:text-text-primary">{metric.label}</span>
        </div>
      ))}
    </div>
  );
}

const SCENARIO_RESULTS = [
  "2 часа → 2 минуты",
  "Несколько часов → один диалог",
  "1–2 часа → 10 минут",
  "3 часа → 10 минут",
  "День → несколько минут",
];

function ProductivityFigure() {
  return (
    <figure className="flex flex-col gap-12">
      <ProductivityVisual />
      <figcaption className="text-[12px] text-text-tertiary">Агент собирает данные из корпоративных систем, решение подтверждает сотрудник</figcaption>
    </figure>
  );
}

function ProductivityBlocks({ article }: { article: BlogArticle }) {
  return article.blocks.map((block, index) => {
    if (index === 8) {
      return <div key={index} className="flex flex-col gap-24"><ArticleBlock block={block} index={index} /><ProductivityFigure /><blockquote className="rounded-24 bg-[#f7f8fa] p-24 text-[20px] leading-[1.2] font-medium md:p-32">Сотрудник перестает быть «диспетчером между системами» и начинает управлять результатом.</blockquote></div>;
    }
    if (index >= 9 && index <= 18) {
      if (index % 2 === 0) return null;
      const scenario = Math.floor((index - 9) / 2);
      return <section key={index} className="flex flex-col gap-24 rounded-24 bg-[#f7f8fa] p-24 md:p-32">
        <h3 className="text-[20px] leading-[1.2] font-medium md:text-[24px]">{block.text}</h3>
        <p className="text-[16px] leading-[1.6] md:text-[18px]">{article.blocks[index + 1].text}</p>
        <div className="border-t border-border-subtle pt-16 text-[16px] font-medium text-text-primary">{SCENARIO_RESULTS[scenario]}</div>
      </section>;
    }
    if (index >= 20 && index <= 25) {
      if (index !== 20) return null;
      return <div key={index} className="grid gap-16 md:grid-cols-2">{article.blocks.slice(20, 26).map((step, stepIndex) => <div key={stepIndex} className="flex min-h-[160px] flex-col justify-start gap-[16px] rounded-24 bg-[#f7f8fa] p-24"><span className="text-[14px] text-[#0dace0]">{String(stepIndex + 1).padStart(2, "0")}</span><p className="text-[16px] leading-[1.4]">{step.text.replace(/^\d+[.)]\s*/, "")}</p></div>)}</div>;
    }
    return <ArticleBlock key={`${index}-${block.text.slice(0,20)}`} block={block} index={index} />;
  });
}

function PlatformOverviewBlocks({ article }: { article: BlogArticle }) {
  const introIndex = article.blocks.findIndex((block) => block.text === "По данным пилотных внедрений платформы:");

  return article.blocks.map((block, index) => {
    if (index === introIndex) {
      return (
        <div key={index} className="flex flex-col gap-[24px]">
          <ArticleBlock block={block} index={index} />
          <ul className="grid gap-16 sm:grid-cols-2">
            {article.blocks.slice(index + 1, index + 7).map((metric) => {
              const [label, value] = metric.text.split(/\s+–\s+/, 2);
              return (
                <li key={metric.text} className="flex min-h-[130px] flex-col justify-start gap-[16px] rounded-24 bg-[#f7f8fa] p-24 md:min-h-[170px]">
                  <span className="text-[16px] leading-[1.3] text-text-primary">{label}</span>
                  <strong className="text-[28px] leading-[1.15] font-medium tracking-[-0.02em] text-[#08789d] md:text-[32px]">{value}</strong>
                </li>
              );
            })}
          </ul>
        </div>
      );
    }
    if (index > introIndex && index <= introIndex + 6) return null;
    return <ArticleBlock key={`${index}-${block.text.slice(0,20)}`} block={block} index={index} />;
  });
}

function Related({ article }: { article: BlogArticle }) {
  const currentIndex = BLOG_ARTICLES.findIndex((item) => item.slug === article.slug);
  const related = [1, 2, 3].map((offset) => BLOG_ARTICLES[(currentIndex + offset) % BLOG_ARTICLES.length]);
  return (
    <section className="container-page py-64 md:py-80" aria-labelledby="related-heading">
      <div className="mb-24 flex flex-col gap-16 md:mb-32 md:flex-row md:items-center md:justify-between">
        <h2 id="related-heading" className="text-[25px] leading-[1.2] font-medium tracking-[-0.02em] md:text-[36px]">Читайте также</h2>
        <Link href="/media/" className="text-[14px] text-text-primary hover:underline">Все статьи блога ↗</Link>
      </div>
      <div className="grid gap-16 md:grid-cols-3">
        {related.map((item) => (
          <Link key={item.slug} href={`/media/blog/${item.slug}/`} className="group flex min-h-[230px] flex-col justify-start gap-[24px] rounded-24 bg-[#f5f5f5] p-24 transition-colors hover:bg-[#ebf3f7] md:p-32">
            <span className="w-fit rounded-full bg-[linear-gradient(35deg,#a6fddc,#b1f1ff,#cfe7ff)] px-12 py-8 text-[14px]">Блог</span>
            <span className="flex items-end justify-between gap-16">
              <span className="text-[20px] leading-[1.2] font-medium text-text-primary">{item.title}</span>
              <span aria-hidden className="flex size-40 shrink-0 items-center justify-center rounded-full bg-white transition-transform group-hover:translate-x-1">↗</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = BLOG_ARTICLE_BY_SLUG.get(slug);
  if (!article) notFound();
  const readingMinutes = slug === "ai-agents-productivity" ? 5 : Math.max(3, Math.ceil(`${article.intro} ${article.blocks.map((block) => block.text).join(" ")}`.split(/\s+/).length / 220));

  return (
    <>
      <section className="relative isolate flex min-h-[360px] items-end overflow-hidden bg-[linear-gradient(227deg,#d4e2ff_11%,#b3ebf6_80%,#b3f6e1_102%)] px-16 pb-48 pt-120 md:min-h-[500px] md:px-0 md:pb-96 md:pt-[272px]">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-transparent to-white/80" />
        <Breadcrumbs items={[{ label: "Медиа", href: "/media/" }, { label: article.title }]} />
        <div className="container-page w-full">
          <Link href="/media/" className="mb-24 inline-block rounded-full bg-[#f1f3f5] px-12 py-4 text-[12px] text-text-secondary hover:bg-white">БЛОГ</Link>
          <h1 className="max-w-[980px] text-[32px] leading-[1.2] font-medium tracking-[-0.02em] text-text-primary md:text-[48px]">{article.title}</h1>
          {article.heroDescription ? <p className="mt-24 max-w-[820px] text-[16px] leading-[1.4] text-text-secondary">{article.heroDescription}</p> : null}
        </div>
      </section>

      <div className="container-page grid gap-40 py-40 md:gap-24 md:py-64 lg:grid-cols-[minmax(0,720px)_minmax(250px,1fr)]">
        <article className="min-w-0">
          <div className="md:hidden mb-24 text-[12px] text-text-secondary">{article.date ? `${article.date} · ` : ""}{readingLabel(readingMinutes)}</div>
          {slug === "ai-agents-productivity" ? <div className="mb-40 md:mb-64"><Metrics /></div> : null}
          {article.intro ? <p className="mb-24 text-[16px] leading-[1.6] text-text-primary md:mb-64 md:text-[18px]">{article.intro}</p> : null}
          <div className="mb-40 md:hidden"><Toc article={article} /></div>
          <div className="flex flex-col gap-24 md:gap-32">
            {slug === "ai-agents-productivity" ? <ProductivityBlocks article={article} /> : slug === "gigacowork-platform-overview" ? <PlatformOverviewBlocks article={article} /> : article.blocks.map((block, index) => <ArticleBlock key={`${index}-${block.text.slice(0,20)}`} block={block} index={index} />)}
          </div>
        </article>
        <aside className="hidden lg:block">
          <div className="sticky top-[calc(var(--header-h)+24px)] flex flex-col gap-24">
            <p className="text-[12px] text-text-secondary">{article.date ? `${article.date} · ` : ""}{readingLabel(readingMinutes)}</p>
            <Toc article={article} />
            <div className="flex flex-col gap-12 rounded-24 bg-[linear-gradient(135deg,#eaf8f3,#e5f1ff)] p-24">
              <h2 className="text-[20px] leading-[1.2] font-medium">Проверьте эффект за 7 дней</h2>
              <Link href="/lead/" className="w-fit rounded-full bg-action-primary-default px-24 py-12 text-[14px] text-white hover:opacity-80">Попробовать бесплатно</Link>
            </div>
          </div>
        </aside>
      </div>

      <Related article={article} />
      <FinalCta title={<>Проверьте эффект<br />за 7 дней</>} />
    </>
  );
}
