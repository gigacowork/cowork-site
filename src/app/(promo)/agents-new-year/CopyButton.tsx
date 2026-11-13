"use client";

import { useState } from "react";
import styles from "./page.module.css";

export default function CopyButton({ file, label = "Скопировать" }: { file: string; label?: string }) {
  const [state, setState] = useState<"idle" | "done" | "error">("idle");

  async function copy() {
    try {
      const response = await fetch(file);
      if (!response.ok) throw new Error(String(response.status));
      await navigator.clipboard.writeText(await response.text());
      setState("done");
    } catch {
      setState("error");
    }
    window.setTimeout(() => setState("idle"), 2500);
  }

  return (
    <button type="button" className={styles.copyButton} onClick={copy} aria-label={`${label}: ${file.split("/").pop()}`}>
      {state === "done" ? "Скопировано ✓" : state === "error" ? "Не удалось скопировать" : label}
    </button>
  );
}
