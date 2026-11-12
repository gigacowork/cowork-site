"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { VOTING_QUESTIONS, type VoteResults } from "@/content/voting";
import { loadVoteResults } from "@/lib/voting";
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
      setError(cause instanceof Error ? cause.message : "Не удалось загрузить результаты.");
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

  function downloadCsv() {
    if (!results || results.total === 0) return;
    const quote = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;
    const rows = [
      ["Вопрос", "Да", "Да, %", "Нет", "Нет, %", "Всего ответов"],
      ...VOTING_QUESTIONS.map(({ id, text }) => {
        const { yes, no } = results.questions[id];
        const total = yes + no;
        return [text, yes, percent(yes, total), no, percent(no, total), total];
      }),
    ];
    const csv = `\uFEFF${rows.map((row) => row.map(quote).join(";")).join("\r\n")}`;
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "voting-results.csv";
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  return (
    <section className={`${styles.page} ${styles.reportPage}`}>
      <div className="container-page">
        <div className={styles.reportHeader}>
          <div className={styles.heading}>
            <span className={styles.eyebrow}>Отчёт о голосовании</span>
            <h1 className={styles.title}>Результаты</h1>
          </div>
          <div className={styles.reportHeaderActions}>
            <Link href="/vote/" className={styles.secondaryButton}>К вопросам <span aria-hidden="true">↗</span></Link>
            <button type="button" className={styles.secondaryButton} onClick={downloadCsv} disabled={!results || results.total === 0}>Скачать CSV</button>
          </div>
        </div>

        {error && <div className={styles.errorBox} role="alert">{error}</div>}
        {!results && !error && <p className={styles.loading}>Загружаем результаты…</p>}

        {results && (
          <>
            {results.total === 0 ? (
              <div className={styles.empty}>
                <h2>Ответов пока нет</h2>
                <p>Проголосуйте по одному из вопросов, чтобы увидеть результаты.</p>
                <Link href="/vote/" className={styles.primaryButton}>Перейти к вопросам <span aria-hidden="true">↗</span></Link>
              </div>
            ) : (
              <div className={styles.resultsList}>
                {VOTING_QUESTIONS.map(({ id, text }, index) => {
                  const { yes, no } = results.questions[id];
                  const total = yes + no;
                  return (
                    <article className={styles.resultCard} key={id}>
                      <div className={styles.resultTop}>
                        <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
                        <h2><Link href={`/vote/${id}/`}>{text}</Link></h2>
                      </div>
                      <div className={styles.resultRows}>
                        <div className={styles.resultRow}>
                          <span className={styles.answerName}>Да</span>
                          <div className={styles.barTrack} aria-hidden="true"><div className={styles.barYes} style={{ width: `${percent(yes, total)}%` }} /></div>
                          <strong>{percent(yes, total)}%</strong>
                          <span className={styles.count}>{yes}</span>
                        </div>
                        <div className={styles.resultRow}>
                          <span className={styles.answerName}>Нет</span>
                          <div className={styles.barTrack} aria-hidden="true"><div className={styles.barNo} style={{ width: `${percent(no, total)}%` }} /></div>
                          <strong>{percent(no, total)}%</strong>
                          <span className={styles.count}>{no}</span>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

          </>
        )}
      </div>
    </section>
  );
}
