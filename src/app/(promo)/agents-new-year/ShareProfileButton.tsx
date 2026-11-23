"use client";

import { useState } from "react";
import { asset } from "@/lib/asset";
import styles from "./page.module.css";

export default function ShareProfileButton({ file, name }: { file: string; name: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = new URL(file, window.location.origin).href;
    try {
      if (navigator.share) {
        await navigator.share({ title: `Профиль агента: ${name}`, url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2500);
      }
    } catch (error) {
      if ((error as DOMException).name !== "AbortError") {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2500);
      }
    }
  }

  return (
    <button type="button" className={styles.shareButton} onClick={share}>
      <img src={asset("/agents-new-year/figma/mobile/imgIconShare.svg")} width="18" height="18" alt="" />
      {copied ? "Ссылка скопирована" : "Отправить себе"}
    </button>
  );
}

