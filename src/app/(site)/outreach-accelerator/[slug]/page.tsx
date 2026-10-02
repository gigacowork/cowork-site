import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import FinalCta from "@/components/sections/FinalCta";
import Kicker from "@/components/ui/Kicker";
import catalog from "@/content/cowork-hub-catalog.json";
import { categoryName, findPublishedScenario, publishedScenarios } from "@/content/outreach-published";
import styles from "../outreach.module.css";

export function generateStaticParams() {
  return publishedScenarios.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const scenario = findPublishedScenario(slug);
  if (!scenario) return {};
  return {
    title: `${scenario.item.scenario} — GigaCowork`,
    description: scenario.item.pain,
  };
}

export default async function ScenarioPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const scenario = findPublishedScenario(slug);
  if (!scenario) notFound();

  const { item, plugin } = scenario;

  return (
    <>
      <main className={styles.scenarioPage}>
        <div className="container-page">
          <Link className={styles.backLink} href="/outreach-accelerator/#catalogue">← Все сценарии</Link>
          <div className={styles.scenarioHero}>
            <Kicker>Сценарий применения</Kicker>
            <span className={styles.tag}>{categoryName(item.industry)}</span>
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
                              <Link className={styles.pluginComponentLink} href={`/outreach-accelerator/catalog/skills/${skill.slug}/`}>
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
