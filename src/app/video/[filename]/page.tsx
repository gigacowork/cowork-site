import { permanentRedirect } from "next/navigation";

import { academyPath, legacyVideoFiles } from "@/content/legacy-video-redirects.mjs";

export const dynamicParams = false;

export function generateStaticParams() {
  return legacyVideoFiles.map((filename) => ({ filename }));
}

export default function LegacyVideoPage() {
  permanentRedirect(academyPath);
}
