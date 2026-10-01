import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";
import FinalCta from "@/components/sections/FinalCta";
import Kicker from "@/components/ui/Kicker";
import catalog from "@/content/cowork-hub-catalog.json";
import { asset } from "@/lib/asset";
import styles from "../../../outreach.module.css";

type Params = { kind: "skills" | "integrations"; slug: string };

export function generateStaticParams(): Params[] {
  return [
    ...Object.keys(catalog.skills).map((slug) => ({ kind: "skills" as const, slug })),
    ...Object.keys(catalog.integrations).map((slug) => ({ kind: "integrations" as const, slug })),
  ];
}

function findEntity({ kind, slug }: Params) {
  if (kind === "skills" && slug in catalog.skills) return { type: "Навык", entity: catalog.skills[slug as keyof typeof catalog.skills] };
  if (kind === "integrations" && slug in catalog.integrations) return { type: "Интеграция", entity: catalog.integrations[slug as keyof typeof catalog.integrations] };
  return null;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const entity = findEntity(await params);
  if (!entity) return {};
  return { title: `${entity.entity.name} — GigaCowork`, description: entity.entity.description };
}

export default async function CatalogEntityPage({ params }: { params: Promise<Params> }) {
  const { kind, slug } = await params;
  const entity = findEntity({ kind, slug });
  if (!entity) notFound();

  const category = catalog.categories.find((item) => item.slug === entity.entity.category)?.name || "Другое";
  const tags = "tags" in entity.entity ? entity.entity.tags.map(String) : [];
  const skill = kind === "skills" ? catalog.skills[slug as keyof typeof catalog.skills] : null;
  const markdown = skill ? readFileSync(join(process.cwd(), "public", "catalog", "skills", `${slug}.md`), "utf8") : null;
  const downloadHref = skill ? asset(`/catalog/skills/${slug}.md`) : null;

  return (
    <>
      <main className={styles.scenarioPage}>
        <div className="container-page">
          <Link className={styles.backLink} href="/outreach-accelerator/#catalogue">← Каталог расширений</Link>
          <div className={styles.scenarioHero}>
            <Kicker>{entity.type} GigaCowork</Kicker>
            <span className={styles.tag}>{category}</span>
            <h1>{entity.entity.name}</h1>
          </div>
          <div className={styles.scenarioBody}>
            <section className={styles.scenarioSection} aria-labelledby="purpose-title">
              <h2 id="purpose-title">Назначение</h2>
              <p>{entity.entity.description}</p>
            </section>
            {tags.length > 0 && (
              <section className={styles.scenarioSection} aria-labelledby="tags-title">
                <h2 id="tags-title">Теги</h2>
                <div className={styles.detailTags}>{tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
              </section>
            )}
            {skill && markdown && (
              <section className={styles.scenarioSection} aria-labelledby="skill-contents-title">
                <h2 id="skill-contents-title">Что внутри SKILL.md</h2>
                <div className={styles.skillContents}>
                  <p>Файл содержит инструкции для ИИ-агента по выполнению этого навыка. Основные разделы:</p>
                  <ul>{skill.sections.map((section) => <li key={section}>{section}</li>)}</ul>
                  <details className={styles.skillSource}>
                    <summary>Посмотреть полный SKILL.md</summary>
                    <pre>{markdown}</pre>
                  </details>
                </div>
              </section>
            )}
          </div>
          {downloadHref && <a className={styles.skillDownload} href={downloadHref} download="SKILL.md">Скачать файл .md <span aria-hidden="true">↓</span></a>}
        </div>
      </main>
      <FinalCta />
    </>
  );
}
