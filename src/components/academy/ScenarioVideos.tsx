"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";

type AcademyVideo = {
  title: string;
  description?: string;
  videoId: string;
};

const SCENARIOS: AcademyVideo[] = [
  { title: "Юристы", videoId: "d5fa0401-e8bf-4835-a33f-33f61898213c" },
  { title: "Руководитель проектов", videoId: "d1b41721-b91f-4bd9-8a3b-78266afe70b1" },
  { title: "Консультанты", videoId: "56501710-d312-4c35-8c08-b408bc0aa8cb" },
];

const TUTORIALS: AcademyVideo[] = [
  {
    title: "Скоринг кандидатов",
    description: "Как автоматически определить наиболее подходящего кандидата и\u00A0направить приглашение на\u00A0интервью",
    videoId: "1e02392b-9e70-4c18-86b4-2e1409863a45",
  },
  {
    title: "Анализ клиентской базы",
    description: "Как сегментировать клиентскую базу, выявлять перспективных клиентов и\u00A0вовремя возвращать неактивных",
    videoId: "867d1348-0be4-4107-ab14-4a28fe92ca9e",
  },
  {
    title: "Автоматизация процесса закупок",
    description: "Как оценивать потребности, сравнивать предложения поставщиков и\u00A0вовремя планировать закупки",
    videoId: "6e3efbde-896c-4d05-b1b1-1a86ca604785",
  },
];

const SCENARIO_GRADIENT =
  "bg-[linear-gradient(199.59deg,#edf6ff_10.474%,#d4eeef_94.872%)]";
const TUTORIAL_GRADIENT =
  "bg-[linear-gradient(54.73deg,#c5f8e5_0.952%,#dcf9ff_50.802%,#e4f5ff_101.64%)]";

function AcademyVideoCards({
  videos,
  variant,
}: {
  videos: AcademyVideo[];
  variant: "scenarios" | "tutorials";
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const [active, setActive] = useState<AcademyVideo | null>(null);
  const isTutorial = variant === "tutorials";

  useEffect(() => {
    if (!active) return;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = previousOverflow;
    };
  }, [active]);

  const open = (video: AcademyVideo, button: HTMLButtonElement) => {
    openerRef.current = button;
    setActive(video);
    dialogRef.current?.showModal();
  };

  const close = () => dialogRef.current?.close();

  return (
    <>
      <ul className={`grid lg:grid-cols-3 ${isTutorial ? "gap-16 lg:gap-24" : "gap-24"}`}>
        {videos.map((video) => (
          <li
            key={video.videoId}
            className={`group relative flex h-full flex-col gap-24 overflow-hidden rounded-24 shadow-drop-sm transition-shadow duration-300 hover:shadow-drop-lg focus-within:shadow-drop-lg motion-reduce:transition-none ${isTutorial ? `p-40 ${TUTORIAL_GRADIENT}` : `p-24 lg:p-32 ${SCENARIO_GRADIENT}`}`}
          >
            <div className="relative aspect-video w-full overflow-hidden rounded-16 bg-[#d9e9f2]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://kinescope.io/${video.videoId}/poster/lg.jpg`}
                alt=""
                loading="lazy"
                className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none"
              />
              <span
                aria-hidden
                className="absolute inset-0 flex items-center justify-center"
              >
                <span className="flex size-[64px] items-center justify-center rounded-full bg-[#6258f6] text-white shadow-drop-sm transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none">
                  <Icon src="/img/icons/play.svg" className="size-[32px] text-white" />
                </span>
              </span>
            </div>
            <div className={`flex flex-col ${isTutorial ? "gap-16" : ""}`}>
              <h3 className={`${isTutorial ? "text-h3" : "text-h4"} font-medium text-text-primary`}>
                {video.title}
              </h3>
              {video.description ? (
                <p className="text-body-l text-text-secondary">{video.description}</p>
              ) : null}
            </div>
            <button
              type="button"
              aria-haspopup="dialog"
              aria-label={`Смотреть видео «${video.title}»`}
              onClick={(event) => open(video, event.currentTarget)}
              className="absolute inset-0 z-10 cursor-pointer rounded-24 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-text-primary"
            />
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        onClose={() => {
          setActive(null);
          openerRef.current?.focus();
        }}
        onClick={(event) => {
          if (event.target === dialogRef.current) close();
        }}
        className="m-auto max-h-[calc(100dvh-32px)] w-[calc(100vw-32px)] max-w-[1100px] overflow-y-auto rounded-24 border-0 bg-[#171f2d] p-0 text-white shadow-drop-lg backdrop:bg-[rgba(23,31,45,0.72)] backdrop:backdrop-blur-[4px]"
      >
        <div className="flex flex-col gap-16 p-16 md:p-24">
          <div className="flex items-center justify-between gap-24">
            <h2 id={titleId} className="text-h4 font-medium">
              {active?.title ?? "Видео"}
            </h2>
            <button
              type="button"
              onClick={close}
              aria-label="Закрыть видео"
              className="flex size-[40px] shrink-0 cursor-pointer items-center justify-center rounded-full text-white transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <span aria-hidden className="text-[32px] leading-none">×</span>
            </button>
          </div>
          {active && (
            <div className="aspect-video overflow-hidden rounded-16 bg-black">
              <iframe
                src={`https://kinescope.io/embed/${active.videoId}`}
                title={`${isTutorial ? "Туториал" : "Сценарий"} GigaCowork — ${active.title}`}
                allow="autoplay; fullscreen; picture-in-picture; encrypted-media; gyroscope; accelerometer; clipboard-write; screen-wake-lock"
                allowFullScreen
                className="size-full border-0"
              />
            </div>
          )}
        </div>
      </dialog>
    </>
  );
}

export default function ScenarioVideos() {
  return <AcademyVideoCards videos={SCENARIOS} variant="scenarios" />;
}

export function TutorialVideos() {
  return <AcademyVideoCards videos={TUTORIALS} variant="tutorials" />;
}
