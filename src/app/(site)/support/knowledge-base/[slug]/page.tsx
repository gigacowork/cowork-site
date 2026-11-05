import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import FaqAccordion from "@/components/interactive/FaqAccordion";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Kicker } from "@/components/ui/Kicker";
import {
  KNOWLEDGE_BASE,
  KNOWLEDGE_BASE_BY_SLUG,
  knowledgeBasePath,
} from "@/content/support-knowledge-base";
import { pageMetadata } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return KNOWLEDGE_BASE.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = KNOWLEDGE_BASE_BY_SLUG.get(slug);
  if (!article) return {};

  return pageMetadata({
    title: `${article.title} — База знаний GigaCowork`,
    description: article.description,
    path: knowledgeBasePath(slug),
  });
}

export default async function KnowledgeBaseArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = KNOWLEDGE_BASE_BY_SLUG.get(slug);
  if (!article) notFound();

  return (
    <>
      <section className="relative w-full bg-[linear-gradient(135deg,#edf6ff_10%,#d4eeef_95%)] pb-64 pt-160 md:pb-96 md:pt-[240px]">
        <Breadcrumbs
          items={[
            { label: "Поддержка", href: "/support/" },
            { label: article.title },
          ]}
        />
        <div className="container-page flex flex-col gap-24">
          <Kicker>База знаний</Kicker>
          <h1 className="max-w-[900px] text-h1 font-medium text-text-primary">
            {article.title}
          </h1>
          <p className="max-w-[760px] text-body-l text-text-secondary">
            {article.description}
          </p>
        </div>
      </section>

      <section className="w-full bg-white py-64 md:py-96" aria-labelledby="questions-title">
        <div className="container-page grid gap-32 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-64">
          <div className="flex flex-col gap-16">
            <h2 id="questions-title" className="text-h2 font-medium text-text-primary">
              Вопросы и ответы
            </h2>
            <p className="text-body-m text-text-secondary">
              Короткие ответы на частые вопросы по теме.
            </p>
          </div>
          <FaqAccordion
            items={article.questions.map(({ question, answer }) => ({
              question,
              answer: (
                <div className="min-w-0 space-y-16 overflow-x-auto">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      a: ({ children, ...props }) => (
                        <a {...props} className="underline underline-offset-2 hover:text-text-primary">
                          {children}
                        </a>
                      ),
                      ul: ({ children }) => <ul className="list-disc space-y-8 pl-24">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal space-y-8 pl-24">{children}</ol>,
                      table: ({ children }) => (
                        <table className="w-full min-w-[520px] border-collapse text-left text-body-m">
                          {children}
                        </table>
                      ),
                      th: ({ children }) => (
                        <th className="border border-border-subtle bg-bg-page p-12 font-medium text-text-primary">
                          {children}
                        </th>
                      ),
                      td: ({ children }) => <td className="border border-border-subtle p-12 align-top">{children}</td>,
                    }}
                  >
                    {answer}
                  </ReactMarkdown>
                </div>
              ),
            }))}
          />
        </div>
      </section>

      <section className="w-full bg-bg-page py-64 md:py-80">
        <div className="container-page flex flex-col gap-24 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-12">
            <h2 className="text-h3 font-medium text-text-primary">Остались вопросы?</h2>
            <p className="text-body-m text-text-secondary">
              Напишите команде поддержки, если не нашли нужный ответ.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-24">
            <Link href="/support/#knowledge-base" className="text-body-m text-text-primary hover:underline">
              Все темы ↗
            </Link>
            <a href="mailto:support_cowork@gigab2b.ru" className="text-body-m text-text-primary hover:underline">
              Написать в поддержку ↗
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
