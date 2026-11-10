"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Пиксели аудита размещения из файлов «Пиксель ERID».
 * Вместо document.write из исходного фрагмента создаём тот же img при показе
 * баннера: так пиксель работает и при переходах без перезагрузки страницы.
 */
export type AdAuditPixelId = "15187247" | "15187251";

const PIXEL_ENDPOINT = "https://ad.adriver.ru/cgi-bin/rle.cgi";
const STATIC_RANDOM = "1978153820";

function pixelUrl(id: AdAuditPixelId, random: string, tail?: string) {
  return `${PIXEL_ENDPOINT}?sid=1&bt=21&ad=846213&pid=5004610&bid=${id}&bn=${id}&exss=&rnd=${random}${tail === undefined ? "" : `&tail256=${tail}`}`;
}

export function AdAuditPixel({ id }: { id: AdAuditPixelId }) {
  const [src, setSrc] = useState<string | null>(null);
  const loadedId = useRef<AdAuditPixelId | null>(null);

  useEffect(() => {
    if (loadedId.current === id) return;
    loadedId.current = id;
    const random = String(Math.round(Math.random() * 1_000_000_000));
    const tail = document.referrer
      ? encodeURIComponent(document.referrer)
      : "unknown";
    setSrc(pixelUrl(id, random, tail));
  }, [id]);

  return (
    <>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          data-ad-audit-pixel={id}
          src={src}
          alt=""
          width={1}
          height={1}
          referrerPolicy="no-referrer-when-downgrade"
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 border-0"
        />
      ) : null}
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={pixelUrl(id, STATIC_RANDOM)}
          alt=""
          width={1}
          height={1}
          aria-hidden="true"
          className="border-0"
        />
      </noscript>
    </>
  );
}
