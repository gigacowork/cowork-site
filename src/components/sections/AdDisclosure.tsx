"use client";

import { useEffect, useId, useRef, useState } from "react";

/** Маркировка рекламного блока с раскрываемыми сведениями о рекламодателе. */
export function AdDisclosure({
  erid,
  className = "",
  alignLeftOnMobile = false,
  subtleOnMobile = false,
}: {
  erid: string;
  className?: string;
  alignLeftOnMobile?: boolean;
  subtleOnMobile?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const detailsId = useId();

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={`absolute z-40 ${className}`} data-ad-erid={erid}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={detailsId}
        onClick={() => setOpen((value) => !value)}
        className={`block cursor-pointer rounded-full bg-[#d8dee1]/40 px-[8px] py-[3px] text-[10px] leading-none transition-colors hover:text-[#58636c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary min-[900px]:px-12 min-[900px]:py-4 min-[900px]:text-caption min-[900px]:text-[#58636c] ${
          subtleOnMobile ? "text-[#9099a2]" : "text-[#68717b]"
        }`}
      >
        Реклама
      </button>
      {open ? (
        <div
          id={detailsId}
          role="region"
          aria-label="Сведения о рекламе"
          className={`absolute top-[calc(100%+8px)] w-[min(360px,calc(100vw-32px))] rounded-16 bg-white p-[20px] pr-[44px] text-left text-body-m leading-[1.4] text-text-primary shadow-drop-lg ${
            alignLeftOnMobile ? "left-0 min-[1200px]:left-auto min-[1200px]:right-0" : "right-0"
          }`}
        >
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute -top-[7px] size-[14px] rotate-45 bg-white ${
              alignLeftOnMobile ? "left-[22px] min-[1200px]:left-auto min-[1200px]:right-[24px]" : "right-[24px]"
            }`}
          />
          <button
            type="button"
            aria-label="Закрыть сведения о рекламе"
            onClick={() => setOpen(false)}
            className="absolute right-12 top-12 flex size-[24px] cursor-pointer items-center justify-center rounded-full text-[24px] leading-none text-[#68717b] hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary"
          >
            ×
          </button>
          <p>
            Реклама. Рекламодатель: ПАО Сбербанк, www.sberbank.ru.
            Генеральная лицензия Банка России №1481 от 11.08.2015 г
          </p>
          <p className="mt-12 text-text-secondary">Erid: {erid}</p>
        </div>
      ) : null}
    </div>
  );
}
