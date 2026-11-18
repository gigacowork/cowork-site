"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { VOTING_QUESTIONS, type VoteResults } from "@/content/voting";
import { loadVoteResults, VOTING_RELOAD_MESSAGE } from "@/lib/voting";
import styles from "../voting.module.css";

const percent = (count: number, total: number) => total ? Math.round((count / total) * 100) : 0;

export function VoteReport() {
  const [results, setResults] = useState<VoteResults | null>(null);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    try {
      setResults(await loadVoteResults());
      setError("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : VOTING_RELOAD_MESSAGE);
    }
  }, []);

  useEffect(() => {
    const onStorage = () => { void refresh(); };
    void refresh();
    window.addEventListener("storage", onStorage);
    const interval = window.setInterval(() => { void refresh(); }, 10000);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.clearInterval(interval);
    };
  }, [refresh]);

  return (
    <section className={styles.stagePage}>
      <div className={styles.stageOverviewShell}>
        <div className={styles.stageReportHeader}>
          <h1 className={styles.stageOverviewTitle}>Сводные результаты голосования</h1>
          <div className={styles.stageReportActions}>
            <Link href="/vote/" className={styles.stageReportButton}>К вопросам <span aria-hidden="true">↗</span></Link>
          </div>
        </div>

        {error && <p className={styles.stageError} role="alert">{error}</p>}
        {!results && !error && <p className={styles.stageLoading}>Загружаем результаты…</p>}

        {results && (
          <div className={styles.stageOverviewGrid}>
            {VOTING_QUESTIONS.map(({ id, text }, index) => {
              const tally = results.questions[id];
              const total = tally.yes + tally.no;
              return (
                <article className={styles.stageOverviewCard} key={id}>
                  <div className={styles.stageOverviewQuestion}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <h2><Link href={`/vote/${id}/results/`} className={styles.stageReportQuestionLink}>{text}</Link></h2>
                  </div>
                  <div className={styles.stageOverviewStats}>
                    {(["yes", "no"] as const).map((answer) => (
                      <div className={styles.stageOverviewRow} key={answer}>
                        <span>{answer === "yes" ? "Да" : "Нет"}</span>
                        <div className={styles.stageOverviewTrack} aria-hidden="true">
                          <div className={answer === "yes" ? styles.stageBarYes : styles.stageBarNo} style={{ width: `${percent(tally[answer], total)}%` }} />
                        </div>
                        <strong>{percent(tally[answer], total)}%</strong>
                        <span className={styles.stageOverviewCount}>{tally[answer]}</span>
                      </div>
                    ))}
                    <p className={styles.stageOverviewTotal}>Всего ответов: {total}</p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
