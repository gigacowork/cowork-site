"use client";

import { useState } from "react";
import styles from "./outreach.module.css";

export default function SourceTextBlock({
  text,
  label,
  downloadHref,
}: {
  text: string;
  label: string;
  downloadHref?: string;
}) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");

  async function copyAll() {
    try {
      await navigator.clipboard.writeText(text);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
  }

  return (
    <div className={styles.sourceTextBlock}>
      <div className={styles.sourceTextHead}>
        <span>{label}</span>
        <div className={styles.sourceTextActions}>
          <button type="button" onClick={copyAll} aria-label={`Скопировать ${label.toLowerCase()} целиком`}>
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="5" y="5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M10.5 5V4.5A1.5 1.5 0 0 0 9 3H4.5A1.5 1.5 0 0 0 3 4.5V9a1.5 1.5 0 0 0 1.5 1.5H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {copyState === "copied" ? "Скопировано" : copyState === "error" ? "Не удалось скопировать" : "Копировать всё"}
          </button>
          {downloadHref && (
            <a className={styles.sourceDownload} href={downloadHref} download="SKILL.md">
              Скачать .md <span aria-hidden="true">↓</span>
            </a>
          )}
        </div>
      </div>
      <pre className={styles.sourceTextContent}>{text}</pre>
    </div>
  );
}
