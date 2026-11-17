"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import Image from "@/components/ui/Image";

const DISMISSED_KEY = "special-project-capsule-dismissed";

/** Капсула спецпроекта появляется после 5% прокрутки главной страницы. */
export function SpecialProjectCapsule() {
  const [pastThreshold, setPastThreshold] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setDismissed(sessionStorage.getItem(DISMISSED_KEY) === "1");

    const update = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      setPastThreshold(scrollableHeight > 0 && window.scrollY / scrollableHeight >= 0.05);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const visible = pastThreshold && !dismissed;

  const close = () => {
    sessionStorage.setItem(DISMISSED_KEY, "1");
    setDismissed(true);
  };

  return (
    <aside
      aria-label="Истории спецпроекта GigaCowork"
      aria-hidden={!visible}
      data-home-route-capsule
      className={`fixed bottom-[54px] left-1/2 z-40 flex w-[299px] max-w-[calc(100vw-24px)] -translate-x-1/2 items-center gap-[10px] rounded-[31px] border border-white/20 bg-[linear-gradient(90deg,#465ed4_0%,#6773e1_50%,#6d61d0_100%)] py-[10px] pr-12 pl-16 shadow-[0_10px_28px_rgba(70,94,212,0.3)] transition-[opacity,translate] duration-300 md:bottom-[62px] md:w-auto md:gap-16 md:rounded-full md:py-8 md:pl-20 motion-reduce:transition-none ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-12 opacity-0"
      }`}
    >
      <p className="min-w-0 flex-1 text-[14px] leading-[1.2] font-medium tracking-[-0.02em] text-white md:flex-none md:whitespace-nowrap">
        <span className="md:hidden">Как ИИ-агенты<br />меняют бизнес</span>
        <span className="hidden md:inline">Как ИИ-агенты меняют бизнес</span>
      </p>

      <Button
        href="/special-project/"
        variant="ghost"
        size="md"
        tabIndex={visible ? 0 : -1}
        className="h-[36px] w-[105px] shrink-0 px-12! font-medium shadow-[0_2px_4px_rgba(13,20,77,0.25)] md:h-40 md:w-[180px] md:px-24!"
      >
        <span className="md:hidden">Смотреть</span>
        <span className="hidden md:inline">Смотреть истории</span>
      </Button>

      <button
        type="button"
        aria-label="Закрыть баннер спецпроекта"
        onClick={close}
        tabIndex={visible ? 0 : -1}
        className="flex size-[20px] shrink-0 cursor-pointer items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <Image src="/img/icons/special-project-capsule-close.svg" alt="" width={20} height={20} className="block size-[20px]" />
      </button>
    </aside>
  );
}

export default SpecialProjectCapsule;
