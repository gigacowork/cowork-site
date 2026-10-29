import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

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
              answer: <p>{answer}</p>,
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
