"use client";

import { useState } from "react";

type Props = { href: string; className?: string };

export default function CopySkillButton({ href, className }: Props) {
  const [state, setState] = useState<"idle" | "copied" | "error">("idle");

  async function copy() {
    try {
      const response = await fetch(href);
      if (!response.ok) throw new Error(`SKILL.md: ${response.status}`);
      await navigator.clipboard.writeText(await response.text());
      setState("copied");
    } catch {
      setState("error");
    }
    window.setTimeout(() => setState("idle"), 2200);
  }

  return (
    <button className={className} type="button" onClick={copy} aria-label="Скопировать содержимое SKILL.md">
      {state === "copied" ? "Скопировано" : state === "error" ? "Ошибка копирования" : "Копировать"}
    </button>
  );
}
