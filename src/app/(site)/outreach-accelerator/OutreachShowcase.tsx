import Kicker from "@/components/ui/Kicker";
import { asset } from "@/lib/asset";
import catalog from "@/content/cowork-hub-catalog.json";
import { categoryName, publishedScenarios } from "@/content/outreach-published";
import ScenarioCatalogue, { type CatalogCard } from "./ScenarioCatalogue";
import styles from "./outreach.module.css";

const catalogueCategory = (slug: string) => catalog.categories.find((category) => category.slug === slug)?.name || "Другое";

const cards: CatalogCard[] = [
  ...publishedScenarios.map(({ item, plugin, slug }) => ({
    href: `/outreach-accelerator/${slug}/`,
    type: "plugin" as const,
    category: categoryName(item.industry),
    eyebrow: plugin.name,
    title: item.scenario,
    description: item.pain,
    tags: plugin.tags.map(String),
  })),
  ...Object.entries(catalog.integrations).map(([slug, integration]) => ({
    href: `/outreach-accelerator/catalog/integrations/${slug}/`,
    type: "integration" as const,
    category: catalogueCategory(integration.category),
    eyebrow: "Интеграция Cowork",
    title: integration.name,
    description: integration.description,
    tags: [],
  })),
  ...Object.entries(catalog.skills).map(([slug, skill]) => ({
    href: `/outreach-accelerator/catalog/skills/${slug}/`,
    downloadHref: asset(`/catalog/skills/${slug}.md`),
    type: "skill" as const,
    category: catalogueCategory(skill.category),
    eyebrow: "Самостоятельный навык",
    title: skill.name,
    description: skill.description,
    tags: skill.tags.map(String),
  })),
];

export default function OutreachShowcase() {
  return (
    <>
      <section className={styles.hero} style={{ backgroundImage: `url(${asset("/img/academy/hero.webp")})` }}>
        <div className="container-page">
          <div className={styles.heroCopy}>
            <Kicker>Каталог расширений GigaCowork</Kicker>
            <h1>Найдите сценарии применения под вашу задачу</h1>
            <p>Готовые ситуации и результаты применения корпоративных ИИ-агентов.</p>
            <a className={styles.heroLink} href="#catalogue">Смотреть сценарии <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </section>

      <section className={styles.catalogue} id="catalogue" aria-labelledby="catalogue-title">
        <div className="container-page">
          <div className={styles.sectionHead}>
            <div>
              <Kicker>Каталог</Kicker>
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
          <div className={styles.stepsHead}><Kicker>Как пользоваться</Kicker><h2 id="steps-title">От ситуации к следующему шагу</h2></div>
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
