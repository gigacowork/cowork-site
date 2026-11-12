"use client";

import { useEffect, useState } from "react";
import { VOTING_QUESTIONS, type VoteResults } from "@/content/voting";
import { loadVoteResults } from "@/lib/voting";
import styles from "../../voting.module.css";

type Question = (typeof VOTING_QUESTIONS)[number];

function percent(count: number, total: number) {
  return total ? Math.round((count / total) * 100) : 0;
}

function voteWord(count: number) {
  const lastTwo = count % 100;
  if (lastTwo >= 11 && lastTwo <= 14) return "голосов";
  const last = count % 10;
  if (last === 1) return "голос";
  if (last >= 2 && last <= 4) return "голоса";
  return "голосов";
}

export function StageResults({ question, index }: { question: Question; index: number }) {
  const [results, setResults] = useState<VoteResults | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    let inFlight = false;
    async function refresh() {
      if (inFlight) return;
      inFlight = true;
      try {
        const next = await loadVoteResults();
        if (active) {
          setResults(next);
          setError("");
        }
      } catch (cause) {
        if (active) setError(cause instanceof Error ? cause.message : "Не удалось загрузить результаты.");
      } finally {
        inFlight = false;
      }
    }

    const onStorage = () => { void refresh(); };
    void refresh();
    window.addEventListener("storage", onStorage);
    const interval = window.setInterval(() => { void refresh(); }, 5000);
    return () => {
      active = false;
      window.removeEventListener("storage", onStorage);
      window.clearInterval(interval);
    };
  }, []);

  const tally = results?.questions[question.id];
  const total = tally ? tally.yes + tally.no : 0;

  return (
    <section className={styles.stagePage}>
      <div className={styles.stageShell}>
        <span className={styles.stageKicker}>Итоги голосования · Вопрос {String(index + 1).padStart(2, "0")}</span>
        <h1 className={styles.stageTitle}>{question.text}</h1>

        {error && <p className={styles.stageError} role="alert">{error}</p>}
        {!results && !error && <p className={styles.stageLoading}>Загружаем результаты…</p>}

        {results && tally && (
          <>
            <div className={styles.stageGrid}>
              <div className={styles.stageAnswer}>
                <div className={styles.stageAnswerHeader}><span>Да</span><strong>{percent(tally.yes, total)}%</strong></div>
                <div className={styles.stageTrack} aria-hidden="true"><div className={styles.stageBarYes} style={{ width: `${percent(tally.yes, total)}%` }} /></div>
                <p>{tally.yes} {voteWord(tally.yes)}</p>
              </div>
              <div className={styles.stageAnswer}>
                <div className={styles.stageAnswerHeader}><span>Нет</span><strong>{percent(tally.no, total)}%</strong></div>
                <div className={styles.stageTrack} aria-hidden="true"><div className={styles.stageBarNo} style={{ width: `${percent(tally.no, total)}%` }} /></div>
                <p>{tally.no} {voteWord(tally.no)}</p>
              </div>
            </div>
            <p className={styles.stageTotal}>Всего ответов: <strong>{total}</strong></p>
          </>
        )}
      </div>
    </section>
  );
}
