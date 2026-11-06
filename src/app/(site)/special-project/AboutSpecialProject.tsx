import { keepRussianShortWords } from "@/lib/typography";
import { asset } from "@/lib/asset";
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
            <div className={styles.cardIllustration} aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset("/img/special-project/pic_routine.webp")} width={1536} height={1024} alt="" loading="lazy" />
            </div>
            <h3>{keepRussianShortWords("Повседневная рутина")}</h3>
            <p>{keepRussianShortWords("За большими результатами бизнеса скрывается повседневная рутина: документы, отчёты, согласования. Каждая задача отнимает считаные минуты, но вместе они складываются в часы, которых команде не хватает на главное.")}</p>
          </div>
          <div className={styles.secondBlock}>
            <div className={styles.cardIllustration} aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset("/img/special-project/pic_GC.webp")} width={1752} height={897} alt="" loading="lazy" />
            </div>
            <h3>{keepRussianShortWords("А что, если вернуть это время специалистам?")}</h3>
            <p>{keepRussianShortWords("В этом спецпроекте покажем, как ИИ-агенты GigaCowork берут на себя рутинные задачи в российских компаниях. Изучите сценарии и реальные кейсы, чтобы увидеть, как меняются рабочие процессы.")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
