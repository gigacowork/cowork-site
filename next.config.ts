import type { NextConfig } from "next";

/**
 * basePath берётся из NEXT_PUBLIC_BASE_PATH.
 *
 * Локально переменной нет → префикс пустой, сайт живёт на http://localhost:3000/.
 * В GitHub Actions она выставлена в "/cowork-site" (имя репозитория), потому что
 * Pages отдаёт проект по адресу https://<логин>.github.io/cowork-site/.
 * Если позже прикрутите свой домен — просто уберите переменную из workflow.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Статический экспорт в out/ — на Pages нет Node-сервера.
  output: "export",

  // /page → /page/index.html, иначе Pages отдаёт 404 на вложенных маршрутах.
  trailingSlash: true,

  // Оптимизатор картинок Next требует сервер, на Pages его нет.
  images: { unoptimized: true },

  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
};

export default nextConfig;
