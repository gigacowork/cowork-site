"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Интерактив страницы «Обучающие видео».
 *
 * Как и остальные обёртки проекта, разметку страницы не меняет — работает по
 * хукам `[data-guide-tab]`, `[data-guide-item]`, `[data-guide-video]`:
 *
 *  1. ролик сам стартует, когда виден на 80%+, и встаёт на паузу, когда уходит;
 *  2. на карточке появляются кнопки звука и полного экрана (на hover, на тач —
 *     всегда, потому что hover там не существует);
 *  3. клик по карточке открывает ролик в модальном окне с системными
 *     контролами; Esc и клик по подложке закрывают;
 *  4. таб подсвечивается по тому ролику, который сейчас в зоне чтения.
 *
 * Без JS страница остаётся рабочей: видео отрисованы, табы — обычные якорные
 * ссылки. При `prefers-reduced-motion: reduce` автозапуск отключается —
 * пользователь запускает ролик сам через модалку.
 */

const ICON_MUTED = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73 4.27 3zM12 4 9.91 6.09 12 8.18V4z"/></svg>`;
const ICON_SOUND = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>`;
const ICON_FULLSCREEN = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>`;
const ICON_CLOSE = `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none"><path d="M18 6 6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;

/**
 * Доля видимости, с которой ролик стартует.
 *
 * В исходнике было 0.8, но при ширине 1440 первый ролик виден только на 78% —
 * с порогом 0.8 он не запускался бы никогда, пока страницу не проскроллят.
 */
const PLAY_RATIO = 0.6;

const BTN_CLASS =
  "flex size-[36px] cursor-pointer items-center justify-center rounded-[8px] border-0 bg-[rgba(23,31,45,0.45)] p-0 transition-colors duration-200 hover:bg-[rgba(23,31,45,0.72)] [&>svg]:size-[18px] [&>svg]:fill-white";

export function VideoGuides({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const frames = Array.from(
      root.querySelectorAll<HTMLElement>("[data-guide-video]")
    );
    if (!frames.length) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(hover: none)");
    const cleanups: Array<() => void> = [];

    /* ── Модальное окно ─────────────────────────────────────────────────── */

    const modal = document.createElement("div");
    modal.setAttribute("aria-hidden", "true");
    modal.className =
      "fixed inset-0 z-[100] hidden items-center justify-center p-16 md:p-40";
    modal.innerHTML = `
      <div data-modal-backdrop class="absolute inset-0 bg-[rgba(23,31,45,0.72)] backdrop-blur-[4px]"></div>
      <div class="relative z-10 flex w-full max-w-[1100px] flex-col gap-16">
        <button data-modal-close type="button" aria-label="Закрыть"
          class="${BTN_CLASS} self-end [&>svg]:fill-none [&>svg]:stroke-white">
          ${ICON_CLOSE}
        </button>
        <video data-modal-video controls playsinline
          class="w-full rounded-[24px] bg-black"></video>
      </div>`;
    document.body.appendChild(modal);

    const modalVideo = modal.querySelector<HTMLVideoElement>(
      "[data-modal-video]"
    )!;
    let paused: HTMLVideoElement | null = null;

    const closeModal = () => {
      modal.classList.remove("flex");
      modal.classList.add("hidden");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      modalVideo.pause();
      modalVideo.removeAttribute("src");
      modalVideo.load();
      if (paused && !reduced.matches) {
        paused.play().catch(() => {});
      }
      paused = null;
    };

    const openModal = (src: string, preview: HTMLVideoElement) => {
      paused = preview;
      preview.pause();
      modalVideo.src = src;
      modalVideo.currentTime = 0;
      modal.classList.remove("hidden");
      modal.classList.add("flex");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      modalVideo.play().catch(() => {});
    };

    modal
      .querySelector("[data-modal-close]")
      ?.addEventListener("click", closeModal);
    modal
      .querySelector("[data-modal-backdrop]")
      ?.addEventListener("click", closeModal);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", onKey);
    cleanups.push(() => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      modal.remove();
    });

    /* ── Кнопки и клик по карточке ──────────────────────────────────────── */

    frames.forEach((frame) => {
      const video = frame.querySelector("video");
      if (!video) return;

      const controls = document.createElement("div");
      controls.dataset.videoControls = "";
      // На тач-устройствах hover не наступает никогда — там кнопки видны сразу.
      controls.className = `absolute right-12 bottom-12 z-10 flex gap-8 transition-opacity duration-200 ${
        coarse.matches ? "opacity-100" : "opacity-0 group-hover/video:opacity-100"
      }`;

      const muteBtn = document.createElement("button");
      muteBtn.type = "button";
      muteBtn.className = BTN_CLASS;
      muteBtn.setAttribute("aria-label", "Включить звук");
      muteBtn.innerHTML = ICON_MUTED;
      muteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        video.muted = !video.muted;
        muteBtn.innerHTML = video.muted ? ICON_MUTED : ICON_SOUND;
        muteBtn.setAttribute(
          "aria-label",
          video.muted ? "Включить звук" : "Выключить звук"
        );
      });

      const fsBtn = document.createElement("button");
      fsBtn.type = "button";
      fsBtn.className = BTN_CLASS;
      fsBtn.setAttribute("aria-label", "На\u00A0весь экран");
      fsBtn.innerHTML = ICON_FULLSCREEN;
      fsBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const v = video as HTMLVideoElement & {
          webkitEnterFullscreen?: () => void;
        };
        if (v.webkitEnterFullscreen) v.webkitEnterFullscreen();
        else if (v.requestFullscreen) v.requestFullscreen();
      });

      controls.append(muteBtn, fsBtn);
      frame.classList.add("group/video", "cursor-pointer");
      frame.appendChild(controls);

      const onFrameClick = (e: MouseEvent) => {
        if ((e.target as HTMLElement).closest("[data-video-controls]")) return;
        openModal(video.currentSrc || video.src, video);
      };
      frame.addEventListener("click", onFrameClick);
      cleanups.push(() => {
        frame.removeEventListener("click", onFrameClick);
        controls.remove();
        frame.classList.remove("group/video", "cursor-pointer");
      });
    });

    /* ── Автозапуск по видимости ────────────────────────────────────────── */

    if (!reduced.matches) {
      const play = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const video = entry.target.querySelector("video");
            if (!video || modal.classList.contains("flex")) return;
            if (entry.intersectionRatio >= PLAY_RATIO) video.play().catch(() => {});
            else video.pause();
          });
        },
        { threshold: [0, PLAY_RATIO] }
      );
      frames.forEach((frame) => play.observe(frame));
      cleanups.push(() => play.disconnect());
    }

    /* ── Подсветка активного таба ───────────────────────────────────────── */

    const tabs = Array.from(
      root.querySelectorAll<HTMLAnchorElement>("[data-guide-tab]")
    );
    const items = Array.from(
      root.querySelectorAll<HTMLElement>("[data-guide-item]")
    );

    const setActive = (id: string) => {
      tabs.forEach((tab) =>
        tab.setAttribute(
          "aria-current",
          tab.dataset.guideTab === id ? "true" : "false"
        )
      );
    };
    setActive(items[0]?.dataset.guideItem ?? "");

    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive((entry.target as HTMLElement).dataset.guideItem ?? "");
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );
    items.forEach((item) => spy.observe(item));
    cleanups.push(() => spy.disconnect());

    tabs.forEach((tab) => {
      const onClick = (e: MouseEvent) => {
        const id = tab.dataset.guideTab;
        const target = id
          ? root.querySelector<HTMLElement>(`[data-guide-item="${id}"]`)
          : null;
        if (!target) return;
        e.preventDefault();
        setActive(id!);
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      };
      tab.addEventListener("click", onClick);
      cleanups.push(() => tab.removeEventListener("click", onClick));
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return <div ref={rootRef}>{children}</div>;
}

export default VideoGuides;
