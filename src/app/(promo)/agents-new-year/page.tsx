import type { Metadata } from "next";
import Link from "next/link";
import { asset } from "@/lib/asset";
import { absoluteUrl } from "@/lib/site";
import { agents } from "./agents";
import CopyButton from "./CopyButton";
import RoleNavigation from "./RoleNavigation";
import ShareProfileButton from "./ShareProfileButton";
import styles from "./page.module.css";

const figmaAsset = asset("/agents-new-year/figma");
const game = asset("/game_agents/index.html");

export const metadata: Metadata = {
  title: "Шоколадные агенты — GigaCowork",
  description: "Шесть ролей из подарочного набора и их готовые инструкции для GigaCowork.",
  alternates: { canonical: absoluteUrl("/agents-new-year/") },
};

function AgentSection({ agent, index }: { agent: (typeof agents)[number]; index: number }) {
  const profileFile = asset(`/agents-new-year/${agent.id}.md`);
  return (
    <section id={agent.id} className={styles.agentSection} aria-labelledby={`${agent.id}-title`}>
      <div className={styles.intro}>
        <picture className={styles.agentImage}>
          <source media="(max-width: 767px)" srcSet={`${figmaAsset}/mobile/imgChocolateAgents${agent.image}.png`} />
          <img src={`${figmaAsset}/desktop/imgChocolateAgents${agent.image}.png`} width="496" height="496" alt={`Шоколадный агент «${agent.name}»`} loading={index === 0 ? "eager" : "lazy"} />
        </picture>
        <div className={styles.agentContent}>
          <span className={styles.kicker}>
            <picture>
              <source media="(max-width: 767px)" srcSet={`${figmaAsset}/mobile/imgIcon${agent.icon}1.svg`} />
              <img src={`${figmaAsset}/desktop/imgIcon${agent.icon}1.svg`} width="16" height="16" alt="" />
            </picture>
            {agent.short}
          </span>
          <h2 id={`${agent.id}-title`}>{agent.name}</h2>
          <p className={styles.summary}>{agent.summary}</p>
          <div className={styles.io}>
            <div><span>Что передать агенту</span><p>{agent.input}</p></div>
            <div><span>Что выдаст агент</span><p>{agent.result}</p></div>
          </div>
          <div className={styles.profile}>
            <div className={styles.profileHead}>
              <span className={styles.fileIcon}>.md</span>
              <div><strong>Профиль агента</strong><span>Файл с инструкцией роли</span></div>
            </div>
            <div className={styles.profileDesktopActions}>
              <CopyButton file={profileFile} />
              <a href={profileFile} download>Скачать .md</a>
            </div>
            <ShareProfileButton file={profileFile} name={agent.name} />
          </div>
        </div>
      </div>
      <div className={styles.skills}>
        <h3>Навыки агента</h3>
        <div className={styles.skillGrid}>
          {agent.skills.map((skill, skillIndex) => {
            const file = asset(`/catalog/skills/${skill.file}.md`);
            return (
              <article className={styles.skillCard} key={skill.file}>
                <div className={styles.skillMeta}>
                  <span>{String(skillIndex + 1).padStart(2, "0")}</span>
                  <span className={styles.mdBadge}>.md</span>
                </div>
                <h4>{skill.name}</h4>
                <p>{skill.description}</p>
                <div className={styles.skillActions}>
                  <CopyButton file={file} />
                  <a href={file} download>Скачать</a>
                </div>
                <div className={styles.mobileSkillCopy}><CopyButton file={file} label="Скопировать навык" /></div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function NewYearAgentsPage() {
  return (
    <div className={styles.page} id="top">
      <div className={styles.heroBackdrop} aria-hidden="true" />
      <header className={styles.header}>
        <Link href="/" aria-label="GigaCowork — на главную">
          <picture><source media="(max-width: 767px)" srcSet={`${figmaAsset}/mobile/imgLogo.svg`} /><img src={`${figmaAsset}/desktop/imgLogo.svg`} width="130" height="28" alt="GigaCowork" /></picture>
        </Link>
      </header>
      <RoleNavigation />
      <main>
        <section className={styles.hero} aria-labelledby="page-title">
          <h1 id="page-title">У каждого шоколадного агента есть рабочая версия</h1>
          <p className={styles.desktopHeroText}>Познакомьтесь с шестью ролями из подарочного набора. Посмотрите, какие задачи можно делегировать, и заберите готовые инструкции для GigaCowork.</p>
          <p className={styles.mobileHeroText}>Шесть ролей из подарочного набора и их готовые инструкции для GigaCowork</p>
          <div className={styles.heroActions}>
            <a href="#finance" className={styles.primaryButton}><span className={styles.desktopActionLabel}>Выбрать агента</span><span className={styles.mobileActionLabel}>Познакомиться с агентами</span></a>
            <a href={game} className={styles.secondaryButton}>Сыграть в «Делегируй до полуночи»</a>
          </div>
        </section>
        <RoleNavigation mobile />
        <div className={styles.agentList}>
          {agents.map((agent, index) => <AgentSection agent={agent} index={index} key={agent.id} />)}
        </div>
        <section className={styles.final} aria-labelledby="final-title">
          <div className={styles.finalCard}>
            <h2 id="final-title">Подарок, <br className={styles.desktopBreak} />который продолжает работать</h2>
            <p>Задачи у агентов, праздник у вас. <br className={styles.desktopBreak} />Шоколад останется на праздники, навыки пригодятся в работе после них.</p>
            <div className={styles.finalActions}>
              <Link href="/" className={styles.primaryButton}>Узнать о GigaCowork</Link>
              <a href={game} className={styles.secondaryButton}>Сыграть в «Делегируй до полуночи»</a>
            </div>
            <a href="#top" className={styles.backToTop}>Наверх ↑</a>
          </div>
        </section>
      </main>
      <footer className={styles.footer}>
        <Link href="/" aria-label="GigaCowork — на главную">
          <picture><source media="(max-width: 767px)" srcSet={`${figmaAsset}/mobile/imgLogoGigaCowork.svg`} /><img src={`${figmaAsset}/desktop/imgLogoGigaCowork.svg`} width="112" height="24" alt="GigaCowork" /></picture>
        </Link>
        <div className={styles.footerText}><a href="https://cowork.ru">cowork.ru</a><span>Новый год 2027</span></div>
      </footer>
    </div>
  );
}
