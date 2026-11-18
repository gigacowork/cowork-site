"use client";

import { useEffect } from "react";

import { asset } from "@/lib/asset";

export function GuidesRedirect() {
  useEffect(() => {
    const destination = new URL(asset("/ai-academy/"), window.location.origin);
    destination.search = window.location.search;
    destination.hash = window.location.hash;
    window.location.replace(destination.href);
  }, []);

  return null;
}
