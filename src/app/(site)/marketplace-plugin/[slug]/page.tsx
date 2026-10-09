import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import FinalCta from "@/components/sections/FinalCta";
import Kicker from "@/components/ui/Kicker";
import catalog from "@/content/cowork-hub-catalog.json";
import { categoryName, findPublishedScenario, publishedScenarios } from "@/content/outreach-published";
import CatalogFiles from "../CatalogFiles";
import PluginDetailContent from "../PluginDetailContent";
import CatalogTypeIcon from "../CatalogTypeIcon";
import { catalogGitUrl } from "@/lib/catalog-source";
import { absoluteUrl } from "@/lib/site";
import styles from "../outreach.module.css";

export function generateStaticParams() {
  return [
    ...Object.keys(catalog.plugins).map((slug) => ({ slug })),
    ...publishedScenarios.map(({ slug }) => ({ slug })),
  ];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const plugin = catalog.plugins[slug as keyof typeof catalog.plugins];
  if (plugin) return {
    title: `${plugin.name} — GigaCowork`,
    description: plugin.description,
    alternates: { canonical: absoluteUrl(`/marketplace-plugin/${slug}/`) },
  };
  const scenario = findPublishedScenario(slug);
  if (!scenario) return {};
  return {
    title: `${scenario.item.scenario} — GigaCowork`,
    description: scenario.item.pain,
    alternates: { canonical: absoluteUrl(`/marketplace-plugin/${slug}/`) },
  };
}

export default async function ScenarioPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const catalogPlugin = catalog.plugins[slug as keyof typeof catalog.plugins];
  if (catalogPlugin) {
    const category = catalog.categories.find((item) => item.slug === catalogPlugin.category)?.name || "Другое";
    const scenarios = publishedScenarios.filter((entry) => entry.plugin === catalogPlugin);

    return (
      <>
        <main className={styles.scenarioPage}>
          <div className="container-page">
            <Link className={styles.backLink} href="/marketplace-plugin/#catalogue">← Каталог расширений</Link>
            <div className={`${styles.scenarioHero} ${styles.pluginHero}`}>
              <div className={styles.detailBadgeRow}>
                <Kicker>Плагин GigaCowork</Kicker>
                <span className={styles.tag}>{category}</span>
              </div>
              <div className={styles.pluginTitleRow}>
                <span className={styles.pluginHeroIcon}><CatalogTypeIcon kind="plugin" /></span>
                <h1>{catalogPlugin.name}</h1>
              </div>
              <span className={styles.pluginVersion}>Версия: {catalogPlugin.version}</span>
              <p className={styles.scenarioPlugin}>{catalogPlugin.description}</p>
              <a className={styles.pluginGitButton} href={catalogGitUrl("plugins", slug)} target="_blank" rel="noopener noreferrer">Открыть в GitVerse ↗</a>
            </div>
            <div className={`${styles.scenarioBody} ${styles.pluginDetailBody}`}>
              <PluginDetailContent
                slug={slug}
                readme={catalogPlugin.readme}
                files={catalogPlugin.files}
                agents={catalogPlugin.agents}
                skills={catalogPlugin.skills}
                commands={catalogPlugin.commands}
                standaloneSkills={Object.keys(catalog.skills)}
              />
              {scenarios.length > 0 && (
                <section className={styles.scenarioSection} aria-labelledby="plugin-scenarios-title">
                  <h2 id="plugin-scenarios-title">Сценарии применения</h2>
                  <ul className={styles.scenarioLinks}>
                    {scenarios.map((entry) => (
                      <li key={entry.slug}>
                        <Link href={`/marketplace-plugin/${entry.slug}/`}>{entry.item.scenario} <span aria-hidden="true">↗</span></Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
              <CatalogFiles kind="plugins" slug={slug} files={catalogPlugin.files} collapsible />
            </div>
          </div>
        </main>
        <FinalCta />
      </>
    );
  }
  const scenario = findPublishedScenario(slug);
  if (!scenario) notFound();

  const { item, plugin } = scenario;

  return (
    <>
      <main className={styles.scenarioPage}>
        <div className="container-page">
          <Link className={styles.backLink} href="/marketplace-plugin/#catalogue">← Все сценарии</Link>
          <div className={styles.scenarioHero}>
            <div className={styles.detailBadgeRow}>
              <Kicker>Сценарий применения</Kicker>
              <span className={styles.tag}>{categoryName(item.industry)}</span>
            </div>
            <h1>{item.scenario}</h1>
            <p className={styles.scenarioPlugin}>{plugin.name}</p>
          </div>

          <div className={styles.scenarioBody}>
            <section className={styles.scenarioSection} aria-labelledby="situation-title">
              <h2 id="situation-title">Ситуация</h2>
              <p>{item.pain}</p>
            </section>
            <section className={styles.scenarioSection} aria-labelledby="result-title">
              <h2 id="result-title">Результат</h2>
              <p>{item.output}</p>
            </section>
            <section className={styles.scenarioSection} aria-labelledby="input-title">
              <h2 id="input-title">Какие данные нужны</h2>
              <p>{item.input}</p>
            </section>
            <section className={styles.scenarioSection} aria-labelledby="composition-title">
              <h2 id="composition-title">Состав плагина</h2>
              <div className={styles.pluginComposition}>
                <p>{plugin.description}</p>
                {plugin.agents.length > 0 && (
                  <div>
                    <h3>Агент</h3>
                    <ul className={styles.pluginComponents}>
                      {plugin.agents.map((agent) => (
                        <li key={agent.slug}>
                          <h4>{agent.name}</h4>
                          <p>{agent.description}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {plugin.skills.length > 0 && (
                  <div>
                    <h3>Навыки</h3>
                    <ul className={styles.pluginComponents}>
                      {plugin.skills.map((skill) => {
                        const hasStandalonePage = skill.slug in catalog.skills;
                        return (
                          <li key={skill.slug}>
                            {hasStandalonePage ? (
                              <Link className={styles.pluginComponentLink} href={`/marketplace-plugin/catalog/skills/${skill.slug}/`}>
                                {skill.name}<span aria-hidden="true">↗</span>
                              </Link>
                            ) : <h4>{skill.name}</h4>}
                            <p>{skill.description}</p>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
      <FinalCta />
    </>
  );
}
