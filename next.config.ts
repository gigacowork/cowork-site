import type { NextConfig } from "next";

/**
 * basePath берётся из NEXT_PUBLIC_BASE_PATH.
 *
 * Локально переменной нет → префикс пустой, сайт живёт на http://localhost:3000/.
 * В GitHub Actions она выставлена в "/cowork-site" (имя репозитория), потому что
 * Pages отдаёт проект по адресу https://gigacowork.github.io/cowork-site/.
 * Если появится свой домен — уберите переменную из workflow, остальное само.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Статический экспорт в out/ — на Pages нет Node-сервера.
  output: "export",

  /*
    /page → /page/index.html, иначе Pages отдаёт 404 на вложенных маршрутах.

    Заодно это закрывает вопрос с документацией: Antora выгружена в public/ai-platform/docs,
    и раньше на неё стоял redirects() из этого файла. В статическом экспорте
    redirects() не работает — он требует сервер. Но и не нужен: Pages сам
    resolve'ит каталог, /ai-platform/docs/ отдаёт public/ai-platform/docs/index.html, а тот уже
    переадресует на актуальную версию. Адрес без слэша Pages redirect'ит на
    вариант со слэшем самостоятельно.
  */
  trailingSlash: true,

  // Оптимизатор картинок Next требует сервер, на Pages его нет.
  images: { unoptimized: true },

  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
};

export default nextConfig;
