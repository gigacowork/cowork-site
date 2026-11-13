import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { asset } from "@/lib/asset";
import { absoluteUrl } from "@/lib/site";
import { agents } from "./agents";
import CopyButton from "./CopyButton";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Новогодняя команда агентов — GigaCowork",
  description: "Шесть цифровых агентов из новогоднего набора. Узнайте, чем они помогают, и скопируйте их навыки в Markdown.",
  alternates: { canonical: absoluteUrl("/agents-new-year/") },
};

export default function NewYearAgentsPage() {
  return (
    <div className={styles.page} style={{ "--avatar-sheet": `url("${asset("/agents-new-year/avatar-sheet-v2.webp")}")` } as React.CSSProperties}>
      <header className={styles.topbar}>
        <Link href="/" className={styles.brand} aria-label="GigaCowork — на главную">
          <Image src={asset("/img/logo-gigacowork.svg")} alt="GigaCowork" width={155} height={33} priority />
        </Link>
        <span className={styles.topbarLabel}>Новогодняя коллекция · 2026</span>
      </header>

      <div className={styles.navWrap}>
        <nav className={styles.nav} aria-label="Перейти к агенту">
          {agents.map((agent) => (
            <a key={agent.id} href={`#${agent.id}`} className={styles.chip}>{agent.short}</a>
          ))}
        </nav>
      </div>

      <main>
        <section className={styles.hero} aria-labelledby="page-title">
          <div className={styles.heroInner}>
            <div className={styles.heroCopy}>
              <h1 id="page-title">У каждой фигурки<br /><em>есть цифровой двойник</em></h1>
              <p>Вы попали сюда по QR-коду на шоколадном агенте. Найдите своего героя, узнайте, чем он может помочь, и заберите готовые навыки в формате Markdown.</p>
              <a className={styles.heroLink} href="#finance">Познакомиться с командой <span aria-hidden="true">↘</span></a>
            </div>
            <div className={styles.heroArt} aria-hidden="true">
              <div className={styles.heroPortrait} />
              <span className={styles.heroSeal}>6<br /><small>агентов</small></span>
              <span className={styles.sparkleOne}>✳</span><span className={styles.sparkleTwo}>✦</span>
            </div>
          </div>
        </section>

        <div id="agents" className={styles.agents}>
          {agents.map((agent) => (
            <section id={agent.id} key={agent.id} className={styles.agentSection} aria-labelledby={`${agent.id}-title`}>
              <div className={styles.agentHeading}>
                <span className={styles.agentTag}>{agent.short}</span>
              </div>
              <div className={styles.agentGrid}>
                <div className={styles.portraitFrame}>
                  <div className={styles.avatar} style={{ "--avatar-x": `${(agent.avatar % 3) * 50}%`, "--avatar-y": `${Math.floor(agent.avatar / 3) * 100}%` } as React.CSSProperties} role="img" aria-label={`Цифровой аватар: ${agent.name}`} />
                </div>
                <div className={styles.agentContent}>
                  <h2 id={`${agent.id}-title`}>{agent.name}</h2>
                  <p className={styles.promise}>{agent.promise}</p>
                  <p className={styles.description}>{agent.description}</p>
                  <div className={styles.workNotes}>
                    <div><span>Что дать на вход</span><p>{agent.input}</p></div>
                    <div><span>Что получите</span><p>{agent.result}</p></div>
                  </div>
                  <div className={styles.profileRow}>
                    <div><strong>Цифровой профиль</strong><small>Готовая роль в формате .md</small></div>
                    <CopyButton file={asset(`/agents-new-year/${agent.id}.md`)} label="Скопировать профиль" />
                    <a href={asset(`/agents-new-year/${agent.id}.md`)} download className={styles.downloadLink}>Скачать .md ↗</a>
                  </div>
                </div>
              </div>
              <div className={styles.skillsBlock}>
                <div className={styles.skillsHeading}><h3>Навыки агента</h3><span>Скопируйте нужный навык или скачайте файл</span></div>
                <div className={styles.skillsGrid}>
                  {agent.skills.map((skill, skillIndex) => {
                    const file = asset(`/catalog/skills/${skill.file}.md`);
                    return <article className={styles.skillCard} key={skill.file}>
                      <div className={styles.skillTop}><span>{String(skillIndex + 1).padStart(2, "0")}</span><span className={styles.mdBadge}>.md</span></div>
                      <h4>{skill.name}</h4>
                      <p>{skill.description}</p>
                      <div className={styles.skillActions}><CopyButton file={file} /><a href={file} download>Скачать ↗</a></div>
                    </article>;
                  })}
                </div>
              </div>
            </section>
          ))}
        </div>

        <section className={styles.outro}>
          <span className={styles.star}>✳</span>
          <h2>Подарок, который<br /><em>продолжает работать.</em></h2>
          <p>Шоколадный агент останется с вами на праздники, а его цифровые навыки помогут в рабочих задачах после них.</p>
          <a href="#page-title">Вернуться наверх ↑</a>
        </section>
      </main>
      <footer className={styles.footer}>
        <Link href="/" aria-label="GigaCowork — на главную">
          <Image src={asset("/img/footer/logo-gigacowork.svg")} alt="GigaCowork" width={161} height={34} />
        </Link>
        <span>Новогодняя коллекция агентов · 2026</span>
      </footer>
    </div>
  );
}
