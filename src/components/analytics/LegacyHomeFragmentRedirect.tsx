"use client";

import { useEffect } from "react";
import { BASE_PATH } from "@/lib/asset";

/** Ссылки на разделы прежней главной gigaenterprise.ai после HTTP-редиректа. */
const LEGACY_FRAGMENTS: Record<string, string> = {
  "#tariffs": "/pricing/",
  "#security": "/trust-and-safety/",
  "#data-security": "/trust-and-safety/",
  "#about-company": "/company/about/",
  "#features": "/ai-platform/",
  "#ai-assistant-features": "/ai-platform/",
  "#scalability": "/ai-platform/",
  "#path": "/ai-platform/",
};

export function LegacyHomeFragmentRedirect() {
  useEffect(() => {
    const target = LEGACY_FRAGMENTS[window.location.hash];
    if (!target) return;

    const url = new URL(`${BASE_PATH}${target}`, window.location.origin);
    url.search = window.location.search;
    window.location.replace(url.toString());
  }, []);

  return null;
}
