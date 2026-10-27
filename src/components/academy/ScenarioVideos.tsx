"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";

type Scenario = {
  role: string;
  videoId: string;
};

const SCENARIOS: Scenario[] = [
  { role: "Юристы", videoId: "d5fa0401-e8bf-4835-a33f-33f61898213c" },
  { role: "Руководитель проектов", videoId: "d1b41721-b91f-4bd9-8a3b-78266afe70b1" },
  { role: "Консультанты", videoId: "56501710-d312-4c35-8c08-b408bc0aa8cb" },
];

const CARD_GRADIENT =
  "bg-[linear-gradient(199.59deg,#edf6ff_10.474%,#d4eeef_94.872%)]";

export default function ScenarioVideos() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);
  const [active, setActive] = useState<Scenario | null>(null);

  useEffect(() => {
    if (!active) return;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = previousOverflow;
    };
  }, [active]);

  const open = (scenario: Scenario, button: HTMLButtonElement) => {
    openerRef.current = button;
    setActive(scenario);
    dialogRef.current?.showModal();
  };

  const close = () => dialogRef.current?.close();

  return (
    <>
      <ul className="grid gap-24 lg:grid-cols-3">
        {SCENARIOS.map((scenario) => (
          <li
            key={scenario.videoId}
            className={`group relative flex h-full flex-col gap-24 overflow-hidden rounded-24 p-24 shadow-drop-sm transition-[transform,box-shadow] duration-300 hover:-translate-y-4 hover:shadow-drop-lg focus-within:shadow-drop-lg motion-reduce:transition-none lg:p-32 ${CARD_GRADIENT}`}
          >
            <div className="relative aspect-video w-full overflow-hidden rounded-16 bg-[#d9e9f2]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://kinescope.io/${scenario.videoId}/poster/lg.jpg`}
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
            <h3 className="text-h4 font-medium text-text-primary">
              {scenario.role}
            </h3>
            <button
              type="button"
              aria-haspopup="dialog"
              aria-label={`Смотреть видео «${scenario.role}»`}
              onClick={(event) => open(scenario, event.currentTarget)}
              className="absolute inset-0 z-10 cursor-pointer rounded-24 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-text-primary"
            />
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        aria-labelledby="scenario-video-title"
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
            <h2 id="scenario-video-title" className="text-h4 font-medium">
              {active?.role ?? "Видео"}
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
                title={`Сценарий GigaCowork — ${active.role}`}
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
