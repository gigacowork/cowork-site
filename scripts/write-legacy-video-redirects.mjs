import { existsSync, mkdirSync, statSync, unlinkSync, writeFileSync } from "node:fs";

import { academyPath, legacyVideoFiles } from "../src/content/legacy-video-redirects.mjs";

const output = new URL("../out/", import.meta.url);
if (!existsSync(new URL("ai-academy/index.html", output))) process.exit(0);

// Static hosts serve the directory's index.html in place of the old MP4.
const destination = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${academyPath}`;
const page = `<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="robots" content="noindex,follow">
  <meta http-equiv="refresh" content="0;url=${destination}">
  <title>Академия GigaCowork</title>
</head>
<body>
  <a href="${destination}">Открыть Академию GigaCowork</a>
</body>
</html>
`;

for (const filename of legacyVideoFiles) {
  const route = new URL(`video/${filename}`, output);
  if (statSync(route, { throwIfNoEntry: false })?.isFile()) unlinkSync(route);
  mkdirSync(route, { recursive: true });
  writeFileSync(new URL(`video/${filename}/index.html`, output), page);
}
