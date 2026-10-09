import Kicker from "@/components/ui/Kicker";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { HeroImage } from "@/components/ui/HeroImage";
import { asset } from "@/lib/asset";
import catalog from "@/content/cowork-hub-catalog.json";
import { catalogGitUrl, catalogMetrics, type CatalogKind } from "@/lib/catalog-source";
import ScenarioCatalogue, { type CatalogCard } from "./ScenarioCatalogue";
import styles from "./outreach.module.css";

const catalogueCategory = (slug: string) => catalog.categories.find((category) => category.slug === slug)?.name || "Другое";
const cardFiles = (kind: CatalogKind, slug: string, files: readonly string[], primary: string) =>
  [primary, ...(files.includes("README.md") ? ["README.md"] : [])].map((name) => ({
    name,
    href: catalogGitUrl(kind, slug, name),
  }));

const cards: CatalogCard[] = [
  ...Object.entries(catalog.plugins).map(([slug, plugin]) => ({
    href: `/marketplace-plugin/${slug}/`,
    type: "plugin" as const,
    category: catalogueCategory(plugin.category),
    eyebrow: "Плагин GigaCowork",
    title: plugin.name,
    description: plugin.description,
    tags: plugin.tags.map(String),
    fileCount: plugin.files.length,
    sourceFiles: cardFiles("plugins", slug, plugin.files, "plugin.yaml"),
    gitHref: catalogGitUrl("plugins", slug),
    metrics: catalogMetrics("plugins", slug),
  })),
  ...Object.entries(catalog.integrations).map(([slug, integration]) => ({
    href: `/marketplace-plugin/catalog/integrations/${slug}/`,
    type: "integration" as const,
    category: catalogueCategory(integration.category),
    eyebrow: "Интеграция Cowork",
    title: integration.name,
    description: integration.description,
    tags: [],
    fileCount: integration.files.length,
    sourceFiles: cardFiles("integrations", slug, integration.files, "integration.yaml"),
    gitHref: catalogGitUrl("integrations", slug),
    metrics: catalogMetrics("integrations", slug),
  })),
  ...Object.entries(catalog.skills).map(([slug, skill]) => ({
    href: `/marketplace-plugin/catalog/skills/${slug}/`,
    downloadHref: asset(`/catalog/skills/${slug}.md`),
    type: "skill" as const,
    category: catalogueCategory(skill.category),
    eyebrow: "Самостоятельный навык",
    title: skill.name,
    description: skill.description,
    tags: skill.tags.map(String),
    fileCount: skill.files.length,
    sourceFiles: cardFiles("skills", slug, skill.files, "SKILL.md"),
    gitHref: catalogGitUrl("skills", slug),
    metrics: catalogMetrics("skills", slug),
  })),
];

export default function OutreachShowcase() {
  return (
    <>
      <section className={styles.hero}>
        <Breadcrumbs items={[{ label: "Каталог решений" }]} />
        <HeroImage
          desktop="/img/marketplace/hero.webp"
          mobile="/img/marketplace/hero-mob.webp"
          className={styles.heroImage}
        />
        <div className="container-page">
          <div className={styles.heroCopy}>
            <h1>Готовые решения для&nbsp;ваших задач</h1>
            <p>Подключайте готовые плагины, навыки и интеграции для продаж, аналитики, документов и других рабочих процессов.</p>
            <a className={styles.heroLink} href="#catalogue">Смотреть расширения <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </section>

      <section className={styles.catalogue} id="catalogue" aria-labelledby="catalogue-title">
        <div className="container-page">
          <div className={styles.sectionHead}>
            <div>
              <h2 id="catalogue-title">Каталог расширений</h2>
              <p>Сценарии плагинов, самостоятельные навыки и интеграции GigaCowork.</p>
            </div>
          </div>

          {cards.length ? (
            <ScenarioCatalogue cards={cards} />
          ) : (
            <div className={styles.empty}><h3>Каталог временно недоступен</h3><p>Обновление данных ещё не завершилось.</p></div>
          )}
        </div>
      </section>

      <section className={styles.steps} aria-labelledby="steps-title">
        <div className="container-page">
          <div className={styles.stepsHead}><Kicker>Как пользоваться</Kicker><h2 id="steps-title">Как выбрать подходящее решение</h2></div>
          <div className={styles.stepsGrid}>
            <div><span>01</span><h3>Выберите тип решения</h3><p>Переключайтесь между плагинами, интеграциями и навыками.</p></div>
            <div><span>02</span><h3>Откройте карточку</h3><p>Посмотрите назначение решения, необходимые данные и состав плагина.</p></div>
            <div><span>03</span><h3>Обсудите применение</h3><p>Выберите подходящий процесс. Детали внедрения уточняются на данных компании.</p></div>
          </div>
        </div>
      </section>
    </>
  );
}
