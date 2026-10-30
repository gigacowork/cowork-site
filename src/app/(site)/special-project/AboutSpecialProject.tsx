import { keepRussianShortWords } from "@/lib/typography";
import styles from "./about-special-project.module.css";

export function AboutSpecialProject() {
  return (
    <section id="about-project" className={styles.section} aria-labelledby="about-project-title">
      <div className={`container-page ${styles.grid}`}>
        <div className={styles.heading}>
          <span className={styles.eyebrow}>{keepRussianShortWords("О СПЕЦПРОЕКТЕ")}</span>
          <h2 id="about-project-title" className={styles.title}>{keepRussianShortWords("Большие перемены начинаются с повседневных задач")}</h2>
        </div>
        <div className={styles.body}>
          <p>{keepRussianShortWords("За большими результатами бизнеса скрывается повседневная рутина: документы, отчёты, согласования. Каждая задача отнимает считаные минуты, но вместе они складываются в часы, которых команде не хватает на главное.")}</p>
          <h3>{keepRussianShortWords("А что, если вернуть это время специалистам?")}</h3>
          <p>{keepRussianShortWords("В этом спецпроекте мы заглянем в бэк-офис российских компаний и покажем, как ИИ-агенты GigaCowork становятся частью привычных рабочих процессов. Они берут на себя рутину, освобождая специалистов для задач, где незаменимы человеческий опыт, экспертиза и ответственность.")}</p>
          <p>{keepRussianShortWords("Исследуйте интерактивную схему подразделений и реальные кейсы, чтобы увидеть, как ИИ-агенты упрощают рабочие процессы и помогают бизнесу достигать большего. Возможно, среди этих историй найдётся решение ваших задач.")}</p>
        </div>
      </div>
    </section>
  );
}
