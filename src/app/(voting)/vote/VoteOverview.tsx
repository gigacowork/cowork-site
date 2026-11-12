"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { VOTING_QUESTIONS, type VoteAnswers } from "@/content/voting";
import { isSharedVotingEnabled, loadVoteSnapshot } from "@/lib/voting";
import styles from "./voting.module.css";

export function VoteOverview() {
  const [ownAnswers, setOwnAnswers] = useState<Partial<VoteAnswers> | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function refresh() {
      try {
        const snapshot = await loadVoteSnapshot();
        if (active) {
          setOwnAnswers(snapshot.ownAnswers);
          setError("");
        }
      } catch (cause) {
        if (active) setError(cause instanceof Error ? cause.message : "Не удалось прочитать голоса.");
      }
    }
    const onStorage = () => { void refresh(); };
    void refresh();
    window.addEventListener("storage", onStorage);
    return () => {
      active = false;
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return (
    <section className={`${styles.page} ${styles.overviewPage}`}>
      <div className="container-page">
        <div className={styles.overviewHeader}>
          <div className={styles.heading}>
            <span className={styles.eyebrow}>Голосование</span>
            <h1 className={styles.title}>Ваше мнение важно</h1>
            <p className={styles.lead}>Выберите вопрос и ответьте «Да» или «Нет». После ответа откроется текущая статистика.</p>
          </div>
          <Link href="/vote/results/" className={styles.secondaryButton}>Общий отчёт <span aria-hidden="true">↗</span></Link>
        </div>

        {error && <div className={styles.errorBox} role="alert">{error}</div>}
        <div className={styles.overviewGrid}>
          {VOTING_QUESTIONS.map(({ id, text }, index) => {
            const answer = ownAnswers?.[id];
            return (
              <article className={styles.overviewCard} key={id}>
                <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
                <h2>{text}</h2>
                <p className={styles.overviewStatus}>
                  {answer ? `Ваш ответ: ${answer === "yes" ? "Да" : "Нет"}. Изменить его нельзя.` : "Ожидает вашего ответа"}
                </p>
                <Link href={`/vote/${id}/`} className={styles.textLink}>
                  {answer ? "Смотреть результаты" : "Перейти к вопросу"} <span aria-hidden="true">↗</span>
                </Link>
              </article>
            );
          })}
        </div>
        {!isSharedVotingEnabled && <p className={styles.overviewNote}>Прототип: голоса и ограничение повторного ответа действуют только в этом браузере.</p>}
      </div>
    </section>
  );
}
