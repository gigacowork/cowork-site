"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { asset } from "@/lib/asset";

const STORAGE_KEY = "cowork-special-project-notice-dismissed";
const SHOW_DELAY_MS = 6_000;

export function SpecialProjectNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "1") return;
    } catch {
      // Уведомление работает и при недоступном sessionStorage.
    }

    let observer: MutationObserver | null = null;

    const showAfterCookieNotice = () => {
      if (document.querySelector('aside[aria-label="Уведомление о cookie"]')) return;
      observer?.disconnect();
      setVisible(true);
    };

    const timer = window.setTimeout(() => {
      showAfterCookieNotice();
      if (document.querySelector('aside[aria-label="Уведомление о cookie"]')) {
        observer = new MutationObserver(showAfterCookieNotice);
        observer.observe(document.body, { childList: true, subtree: true });
      }
    }, SHOW_DELAY_MS);

    return () => {
      window.clearTimeout(timer);
      observer?.disconnect();
    };
  }, []);

  const dismiss = () => {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Закрытие работает и при недоступном sessionStorage.
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      aria-label="Спецпроект GigaCowork"
      className="fixed bottom-16 left-16 right-16 z-[60] mx-auto max-w-[390px] rounded-24 border border-[#dfe5f2] bg-white p-12 shadow-[0_16px_48px_rgba(24,35,79,0.18)] md:bottom-24 md:left-auto md:right-24 md:mx-0"
    >
      <Link
        href="/special-project/"
        onClick={dismiss}
        className="group flex min-h-[124px] items-stretch gap-16 rounded-16 pr-[20px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-text-primary"
      >
        <span className="relative w-[88px] shrink-0 overflow-hidden rounded-16 bg-[#203588] sm:w-[104px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset("/img/special-project/hero-orbit-journey-v5.webp")}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        </span>

        <span className="flex min-w-0 flex-col justify-center py-8">
          <span className="mb-[6px] text-[11px] font-semibold uppercase leading-none tracking-[0.1em] text-[#6862bb]">
            Спецпроект
          </span>
          <span className="text-[17px] font-semibold leading-[1.18] tracking-[-0.02em] text-text-primary">
            От Калининграда до Владивостока
          </span>
          <span className="mt-[5px] text-[12px] leading-[1.3] text-text-secondary">
            Как ИИ-агенты меняют бизнес
          </span>
          <span className="mt-[10px] inline-flex items-center gap-[5px] text-[13px] font-semibold leading-none text-[#5759b8] group-hover:underline">
            Смотреть истории
            <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" className="size-16">
              <path d="M3 8h9m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </span>
      </Link>

      <button
        type="button"
        aria-label="Закрыть уведомление о спецпроекте"
        onClick={dismiss}
        className="absolute right-12 top-12 flex size-24 items-center justify-center rounded-full text-[#6f7890] transition-colors hover:bg-[#eef1f8] hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary"
      >
        <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" className="size-16">
          <path d="m4 4 8 8m0-8-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </aside>
  );
}
