import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import FinalCta from "@/components/sections/FinalCta";
import Kicker from "@/components/ui/Kicker";
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
              <p>{plugin.description}</p>
              {plugin.skills.length > 0 && (
                <ul className={styles.scenarioSkills}>
                  {plugin.skills.map((skill) => (
                    <li key={skill.slug}>
                      <h3>{skill.name}</h3>
                      {skill.description && <p>{skill.description}</p>}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </div>
      </main>
      <FinalCta />
    </>
  );
}
