import { keepRussianShortWords } from "@/lib/typography";
import { Kicker } from "@/components/ui/Kicker";
import styles from "./about-special-project.module.css";

export function AboutSpecialProject() {
  return (
    <section id="about-project" className={styles.section} aria-labelledby="about-project-title">
      <div className="container-page">
        <div className={styles.intro}>
          <Kicker className="self-start">О спецпроекте</Kicker>
          <h2 id="about-project-title" className={styles.title}>{keepRussianShortWords("Большие перемены начинаются с повседневных задач")}</h2>
        </div>
        <div className={styles.grid}>
          <div className={styles.firstBlock}>
            <h3>{keepRussianShortWords("Повседневная рутина")}</h3>
            <p>{keepRussianShortWords("За большими результатами бизнеса скрывается повседневная рутина: документы, отчёты, согласования. Каждая задача отнимает считаные минуты, но вместе они складываются в часы, которых команде не хватает на главное.")}</p>
          </div>
          <div className={styles.secondBlock}>
            <h3>{keepRussianShortWords("А что, если вернуть это время специалистам?")}</h3>
            <p>{keepRussianShortWords("В этом спецпроекте мы заглянем в бэк-офис российских компаний и покажем, как ИИ-агенты GigaCowork становятся частью привычных рабочих процессов. Они берут на себя рутину, освобождая специалистов для задач, где незаменимы человеческий опыт, экспертиза и ответственность.")}</p>
            <p>{keepRussianShortWords("Исследуйте интерактивную схему подразделений и реальные кейсы, чтобы увидеть, как ИИ-агенты упрощают рабочие процессы и помогают бизнесу достигать большего. Возможно, среди этих историй найдётся решение ваших задач.")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
