"use client";

import { useEffect, useState, type FormEvent } from "react";
import { VOTING_QUESTIONS, type VoteAnswer } from "@/content/voting";
import { loadVoteSnapshot, submitQuestionVote, type VoteSnapshot } from "@/lib/voting";
import styles from "../voting.module.css";

type Question = (typeof VOTING_QUESTIONS)[number];

function percent(count: number, total: number) {
  return total ? Math.round((count / total) * 100) : 0;
}

export function QuestionVote({ question, index }: { question: Question; index: number }) {
  const [snapshot, setSnapshot] = useState<VoteSnapshot | null>(null);
  const [selected, setSelected] = useState<VoteAnswer | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const ownAnswer = snapshot?.ownAnswers[question.id];
  const tally = snapshot?.results.questions[question.id];
  const total = tally ? tally.yes + tally.no : 0;

  useEffect(() => {
    let active = true;
    async function refresh() {
      try {
        const next = await loadVoteSnapshot();
        if (active) {
          setSnapshot(next);
          setError("");
        }
      } catch (cause) {
        if (active) setError(cause instanceof Error ? cause.message : "Не удалось загрузить голосование.");
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting || ownAnswer) return;
    if (!selected) {
      setError("Выберите ответ «Да» или «Нет».");
      return;
    }

    setSubmitting(true);
    try {
      setSnapshot(await submitQuestionVote(question.id, selected));
      setError("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Не удалось сохранить голос.");
      try {
        const latest = await loadVoteSnapshot();
        setSnapshot(latest);
        if (latest.ownAnswers[question.id]) setError("");
      } catch {
        // Сохраняем сообщение об исходной ошибке отправки.
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className={`${styles.page} ${styles.questionPage}`}>
      <div className="container-page">
        <div className={styles.questionShell}>
          <div className={styles.heading}>
            <span className={styles.eyebrow}>Вопрос {String(index + 1).padStart(2, "0")}</span>
            <h1 className={styles.singleQuestionTitle}>{question.text}</h1>
          </div>

          {error && <div className={styles.errorBox} role="alert">{error}</div>}
          {!snapshot && !error && <p className={styles.loading}>Загружаем голосование…</p>}

          {snapshot && !ownAnswer && (
            <form className={styles.singleVoteCard} onSubmit={handleSubmit} noValidate>
              <h2>Согласны с утверждением?</h2>
              <p>Выберите один ответ. После отправки изменить его нельзя.</p>
              <div className={styles.choices}>
                {(["yes", "no"] as const).map((answer) => (
                  <label className={`${styles.choice} ${selected === answer ? styles.choiceSelected : ""}`} key={answer}>
                    <input
                      type="radio"
                      name="answer"
                      value={answer}
                      checked={selected === answer}
                      onChange={() => { setSelected(answer); setError(""); }}
                    />
                    <span className={styles.radioMark} aria-hidden="true" />
                    {answer === "yes" ? "Да" : "Нет"}
                  </label>
                ))}
              </div>
              <button className={styles.primaryButton} type="submit" disabled={submitting}>
                {submitting ? "Сохраняем…" : "Проголосовать"} <span aria-hidden="true">↗</span>
              </button>
            </form>
          )}

          {snapshot && ownAnswer && tally && (
            <div className={styles.singleResultCard}>
              <div className={styles.ownAnswer}>
                <span>Ваш ответ</span>
                <strong>{ownAnswer === "yes" ? "Да" : "Нет"}</strong>
              </div>
              <div className={styles.singleResultHeader}>
                <h2>Текущие результаты</h2>
                <span>Всего ответов: {total}</span>
              </div>
              <div className={styles.resultRows}>
                <div className={styles.resultRow}>
                  <span className={styles.answerName}>Да</span>
                  <div className={styles.barTrack} aria-hidden="true"><div className={styles.barYes} style={{ width: `${percent(tally.yes, total)}%` }} /></div>
                  <strong>{percent(tally.yes, total)}%</strong>
                  <span className={styles.count}>{tally.yes}</span>
                </div>
                <div className={styles.resultRow}>
                  <span className={styles.answerName}>Нет</span>
                  <div className={styles.barTrack} aria-hidden="true"><div className={styles.barNo} style={{ width: `${percent(tally.no, total)}%` }} /></div>
                  <strong>{percent(tally.no, total)}%</strong>
                  <span className={styles.count}>{tally.no}</span>
                </div>
              </div>
              <p className={styles.lockNote}>Ваш голос сохранён. Изменить ответ нельзя.</p>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
