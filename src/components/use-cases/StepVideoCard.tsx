"use client";

import { useEffect, useRef, useState } from "react";
import { asset } from "@/lib/asset";

/**
 * Карточка с записью экрана в блоке «Решения».
 *
 * Кадр занимает карточку целиком, без полей: пропорция берётся из самого
 * файла (`ratio`), поэтому вписывать нечего — вписывание и давало прежние
 * поля по краям. Скругление — 12, по просьбе: у записи экрана внутри кадра
 * своя рамка интерфейса, и на 24 углы срезали её заметной дугой.
 *
 * Управление сведено к двум кнопкам, всё остальное убрано:
 *  • воспроизведение — крупная кнопка по центру, пока ролик стоит; во время
 *    игры уезжает в левый нижний угол и прячется до наведения, чтобы не мешать
 *    смотреть;
 *  • развернуть — в правом нижнем углу, открывает ролик в модальном окне на
 *    весь экран, уже с системными контролами и со звуком.
 *
 * Автозапуска нет: карточка ждёт нажатия и до этого показывает первый кадр.
 *
 * Модалка — нативный <dialog> с `showModal()`: Esc, ловушка фокуса и подложка
 * достаются даром. Тот же приём, что в TaskDialog.
 */

/** Ниже этой доли видимости запущенный ролик встаёт на паузу. */
const VISIBLE_RATIO = 0.5;

const ICON = "size-[20px] shrink-0 fill-none stroke-current stroke-[1.8]";

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={ICON}>
      <path d="M8 5.5v13l11-6.5-11-6.5Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={ICON}>
      <path d="M9 5v14M15 5v14" strokeLinecap="round" />
    </svg>
  );
}

function ExpandIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={ICON}>
      <path
        d="M14 4h6v6M20 4l-7 7M10 20H4v-6M4 20l7-7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={ICON}>
      <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
    </svg>
  );
}

/** Кнопка поверх кадра: тёмное стекло, белая иконка. */
const OVERLAY_BUTTON =
  "flex cursor-pointer items-center justify-center rounded-full bg-[rgba(23,31,45,0.55)] text-neutral-0 backdrop-blur-[4px] transition-[background-color,opacity] duration-200 hover:bg-[rgba(23,31,45,0.78)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-0";

export function StepVideoCard({
  src,
  poster,
  label,
  /** Пропорция кадра «ширина/высота» — из самого файла. */
  ratio = "1164/648",
}: {
  src: string;
  poster?: string;
  label?: string;
  ratio?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [open, setOpen] = useState(false);

  /*
    Автозапуска нет — ролик ждёт нажатия. Наблюдатель нужен для обратного:
    если запущенный ролик ушёл из кадра, он встаёт на паузу и не крутится
    вхолостую за пределами экрана.
  */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) video.pause();
      },
      { threshold: VISIBLE_RATIO },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  };

  const openModal = () => {
    videoRef.current?.pause();
    setOpen(true);
    dialogRef.current?.showModal();
  };

  /*
    Запуск в модалке — отдельным эффектом, а не сразу в обработчике: ролик там
    монтируется только после перерисовки, и в момент клика ref ещё пустой.
    Стартуем с той же секунды, на которой стоит карточка.
  */
  useEffect(() => {
    if (!open) return;
    const modalVideo = modalVideoRef.current;
    if (!modalVideo) return;
    modalVideo.currentTime = videoRef.current?.currentTime ?? 0;
    modalVideo.play().catch(() => {});
  }, [open]);

  const closeModal = () => {
    modalVideoRef.current?.pause();
    dialogRef.current?.close();
  };

  return (
    <>
      <div
        className="group relative isolate overflow-hidden rounded-[12px] bg-bg-page shadow-drop-lg"
        style={{ aspectRatio: ratio }}
      >
        <video
          ref={videoRef}
          src={asset(src)}
          poster={poster ? asset(poster) : undefined}
          loop
          muted
          playsInline
          preload="metadata"
          aria-label={label}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onClick={toggle}
          /*
            `object-cover` при совпадающей пропорции ничего не режет — он тут
            страховка на случай, если файл заменят кадром другой формы: лучше
            обрезать пару пикселей, чем вернуть поля.
          */
          className="size-full cursor-pointer object-cover"
        />

        {/* Развернуть — в правом нижнем углу, всегда на виду. */}
        <button
          type="button"
          onClick={openModal}
          aria-haspopup="dialog"
          aria-label={
            label ? `${label} — на весь экран` : "Смотреть на весь экран"
          }
          className={`absolute right-12 bottom-12 size-[40px] ${OVERLAY_BUTTON}`}
        >
          <ExpandIcon />
        </button>

        {/*
          Воспроизведение. На паузе кнопка держится по центру и видна всегда,
          во время игры уезжает в угол и появляется по наведению. На тач-экранах
          наведения нет, поэтому там она видна постоянно.
        */}
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Пауза" : "Смотреть"}
          className={`absolute ${OVERLAY_BUTTON} ${
            playing
              ? "bottom-12 left-12 size-[40px] opacity-0 group-hover:opacity-100 focus-visible:opacity-100 [@media(hover:none)]:opacity-100"
              : "top-1/2 left-1/2 size-[64px] -translate-x-1/2 -translate-y-1/2 [&>svg]:size-[28px]"
          }`}
        >
          {playing ? <PauseIcon /> : <PlayIcon />}
        </button>
      </div>

      <dialog
        ref={dialogRef}
        aria-label={label ?? "Видео"}
        onClose={() => {
          setOpen(false);
          modalVideoRef.current?.pause();
        }}
        onClick={(event) => {
          /* Клик мимо кадра (по самому ::backdrop) закрывает. */
          if (event.target === dialogRef.current) closeModal();
        }}
        className="m-auto max-h-[100dvh] w-[100vw] max-w-[100vw] overflow-visible border-0 bg-transparent p-16 backdrop:bg-[rgba(23,31,45,0.72)] backdrop:backdrop-blur-[4px] md:p-40"
      >
        <div className="relative mx-auto flex w-full max-w-[1400px] flex-col items-end gap-12">
          <button
            type="button"
            onClick={closeModal}
            aria-label="Закрыть"
            className={`size-[40px] ${OVERLAY_BUTTON}`}
          >
            <CloseIcon />
          </button>

          {/*
            Ролик рендерится только при открытой модалке: иначе второй <video>
            на странице тянул бы метаданные того же файла впустую.
          */}
          {open ? (
            <video
              ref={modalVideoRef}
              src={asset(src)}
              poster={poster ? asset(poster) : undefined}
              controls
              loop
              playsInline
              aria-label={label}
              className="max-h-[calc(100dvh-140px)] w-full rounded-[12px] bg-neutral-0 object-contain"
            />
          ) : null}
        </div>
      </dialog>
    </>
  );
}

export default StepVideoCard;
