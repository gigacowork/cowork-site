"use client";

import { startTransition, useEffect, useOptimistic, useState, type FormEvent } from "react";
import { VOTING_QUESTIONS, type VoteAnswer } from "@/content/voting";
import { getBrowserVoteAnswer, isQueuedVotingEnabled, loadVoteSnapshot, queueQuestionVote, submitQuestionVote, VOTING_RELOAD_MESSAGE, type VoteSnapshot } from "@/lib/voting";
import styles from "../voting.module.css";

type Question = (typeof VOTING_QUESTIONS)[number];

export function QuestionVote({ question, index }: { question: Question; index: number }) {
  const [snapshot, setSnapshot] = useState<VoteSnapshot | null>(null);
  const [selected, setSelected] = useState<VoteAnswer | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [browserAnswer, setBrowserAnswer] = useState<VoteAnswer | null>(null);
  const ownAnswer = isQueuedVotingEnabled ? browserAnswer : snapshot?.ownAnswers[question.id];
  const [visibleAnswer, showOptimisticAnswer] = useOptimistic<VoteAnswer | null>(ownAnswer ?? null);

  useEffect(() => {
    if (isQueuedVotingEnabled) setBrowserAnswer(getBrowserVoteAnswer(question.id));
  }, [question.id]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting || visibleAnswer) return;
    if (!selected) {
      setError("Выберите ответ «Да» или «Нет».");
      return;
    }

    if (isQueuedVotingEnabled) {
      setBrowserAnswer(queueQuestionVote(question.id, selected));
      setError("");
      return;
    }

    setSubmitting(true);
    setError("");
    startTransition(async () => {
      showOptimisticAnswer(selected);
      try {
        setSnapshot(await submitQuestionVote(question.id, selected));
      } catch (cause) {
        let latest: VoteSnapshot | null = null;
        try {
          latest = await loadVoteSnapshot();
          setSnapshot(latest);
        } catch {
          // Если проверка недоступна, показываем ошибку отправки.
        }
        const savedAnswer = latest?.ownAnswers[question.id];
        setError(savedAnswer
          ? savedAnswer === selected ? "" : "Вы уже голосовали по этому вопросу. Изменить ответ нельзя."
          : cause instanceof Error ? cause.message : VOTING_RELOAD_MESSAGE);
      } finally {
        setSubmitting(false);
      }
    });
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
          {!visibleAnswer && (
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
              <button className={`${styles.primaryButton} ${submitting ? styles.savingButton : ""}`} type="submit" disabled={submitting}>
                {submitting ? (
                  <><span className={styles.buttonSpinner} aria-hidden="true" />Сохраняем…</>
                ) : (
                  <>Проголосовать <span aria-hidden="true">↗</span></>
                )}
              </button>
            </form>
          )}

          {visibleAnswer && (
            <div className={styles.singleResultCard} role="status">
              <h2 className={styles.thanksTitle}>Спасибо, ваш голос учтён</h2>
              {submitting && <p className={styles.pendingConfirmation}><span className={styles.pendingSpinner} aria-hidden="true" />Подтверждаем запись…</p>}
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
