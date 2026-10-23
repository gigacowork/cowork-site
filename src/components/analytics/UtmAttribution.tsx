"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { BASE_PATH } from "@/lib/asset";

const STORAGE_KEY = "gigacowork_utm";
const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "utm_id",
] as const;

type UtmKey = (typeof UTM_KEYS)[number];
type UtmValues = Partial<Record<UtmKey, string>>;

function readUtm(searchParams: URLSearchParams): UtmValues {
  const values: UtmValues = {};

  for (const key of UTM_KEYS) {
    const value = searchParams.get(key)?.trim();
    if (value) values[key] = value;
  }

  return values;
}

function UtmAttributionTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = new URL(window.location.href);
    const currentUtm = readUtm(url.searchParams);

    try {
      // Последний переход с UTM становится источником текущей сессии.
      if (Object.keys(currentUtm).length > 0) {
        window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(currentUtm));
        return;
      }

      // На GitHub Pages фактический URL включает basePath: /cowork-site/lead/.
      const leadPath = `${BASE_PATH}/lead`;
      if (url.pathname !== leadPath && url.pathname !== `${leadPath}/`) return;

      const stored = window.sessionStorage.getItem(STORAGE_KEY);
      if (!stored) return;

      const values = JSON.parse(stored) as UtmValues;
      let changed = false;
      for (const key of UTM_KEYS) {
        const value = values[key];
        if (typeof value === "string" && value && !url.searchParams.has(key)) {
          url.searchParams.set(key, value);
          changed = true;
        }
      }

      // CRM-интеграция при выкатке сможет читать метки из адреса /lead/.
      if (changed) window.history.replaceState(window.history.state, "", url);
    } catch {
      // Запрет sessionStorage не должен мешать работе сайта и формы.
    }
  }, [pathname, searchParams]);

  return null;
}

export function UtmAttribution() {
  return (
    <Suspense fallback={null}>
      <UtmAttributionTracker />
    </Suspense>
  );
}
