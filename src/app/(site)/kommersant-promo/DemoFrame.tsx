"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

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
  const [unavailable, setUnavailable] = useState(false);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    if (portrait) return;

    const controller = new AbortController();
    let active = true;
    const timeout = window.setTimeout(() => controller.abort(), 8000);

    // An opaque no-CORS response is enough to confirm that the browser can
    // reach the demo host. iframe load/error events cannot report failures.
    fetch(src, {
      method: "HEAD",
      mode: "no-cors",
      cache: "no-store",
      credentials: "omit",
      signal: controller.signal,
    })
      .then(() => {
        if (active) setUnavailable(false);
      })
      .catch(() => {
        if (active) setUnavailable(true);
      })
      .finally(() => window.clearTimeout(timeout));

    return () => {
      active = false;
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [portrait, retry, src]);

  // Do not even mount the external frame in mobile portrait orientation.
  if (portrait) return null;

  return (
    <div className={styles.framePane}>
      <iframe
        className={styles.demoFrame}
        src={src}
        title="Интерактивное демо GigaCowork для Коммерсанта"
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        allow="clipboard-read; clipboard-write"
      />
      {unavailable ? (
        <div className={styles.demoNotice} role="alert">
          <p>Демо недоступно. Проверьте, что у вас отключён VPN.</p>
          <button
            type="button"
            onClick={() => {
              setUnavailable(false);
              setRetry((current) => current + 1);
            }}
          >
            Проверить снова
          </button>
        </div>
      ) : null}
    </div>
  );
}
