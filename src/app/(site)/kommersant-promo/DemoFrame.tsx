"use client";

import { useSyncExternalStore } from "react";

import styles from "./promo.module.css";

const MOBILE_PORTRAIT = "(max-width: 767px) and (orientation: portrait)";

function subscribeToOrientation(onChange: () => void) {
  const query = window.matchMedia(MOBILE_PORTRAIT);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function isMobilePortrait() {
  return window.matchMedia(MOBILE_PORTRAIT).matches;
}

export function DemoFrame({ src }: { src: string }) {
  const portrait = useSyncExternalStore(
    subscribeToOrientation,
    isMobilePortrait,
    () => true,
  );

  // Do not even mount the external frame in mobile portrait orientation.
  if (portrait) return null;

  return (
    <iframe
      className={styles.demoFrame}
      src={src}
      title="Интерактивное демо GigaCowork для Коммерсанта"
      loading="lazy"
      referrerPolicy="strict-origin-when-cross-origin"
      allow="clipboard-read; clipboard-write"
    />
  );
}
