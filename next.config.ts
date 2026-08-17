import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  /*
    Документация — статическая выгрузка Antora в public/docs, а не маршрут
    Next. Файлы из public отдаются по точному пути, каталог сам по себе не
    открывается, поэтому «/docs» уводим на корневой index.html выгрузки: он, в
    свою очередь, переадресует на актуальную версию документации.
  */
  async redirects() {
    return [
      { source: "/docs", destination: "/docs/index.html", permanent: false },
    ];
  },
};

export default nextConfig;
