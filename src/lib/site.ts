import type { Metadata } from "next";
import { BASE_PATH } from "@/lib/asset";
import type { PageSeo } from "@/content/seo";

/**
 * Адрес сайта и карточка для соцсетей (Open Graph / Twitter).
 *
 * Соцсети и мессенджеры не понимают относительных путей: og:image должен быть
 * абсолютным адресом, иначе превью просто не соберётся. Домен задаётся один раз
 * здесь (переопределяется переменной NEXT_PUBLIC_SITE_URL) — по страницам он
 * не размазан.
 *
 * BASE_PATH приклеивается отдельно: на GitHub Pages сайт лежит в подпапке
 * /cowork-site, и без него ссылка на картинку ведёт в корень домена.
 */

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://cowork.ru"
).replace(/\/$/, "");

/** Абсолютный адрес файла из public. */
export function absoluteUrl(path: string): string {
  return `${SITE_URL}${BASE_PATH}${path}`;
}

/**
 * Карточка 1200×630 — размер, который ждут и Telegram, и VK, и остальные.
 * Собрана из фирменных ассетов: фон hero главной, логотип и заголовок
 * набором сайта (SB Sans Text Medium). Заменить — положить другой файл под
 * тем же именем.
 */
export const OG_IMAGE = {
  url: absoluteUrl("/og-cover.png"),
  width: 1200,
  height: 630,
  alt: "GigaCowork — делегируйте работу ИИ-агентам",
};

const SITE_NAME = "GigaCowork";

/**
 * Метаданные страницы вместе с превью для соцсетей.
 *
 * Нужна именно функция, а не наследование от корневого макета: Next
 * подставляет родительский `openGraph` целиком, поэтому у страницы, которая
 * задала только `title`, в превью оставался бы заголовок главной.
 *
 * `path` — адрес страницы от корня сайта, с завершающим слэшем (у проекта
 * `trailingSlash: true`). Из него собирается og:url и canonical.
 */
export function pageMetadata({
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
  path,
}: {
  title: string;
  description: string;
  /** Строка ключевых слов из SEO-документа страницы. */
  keywords?: string;
  /** Заголовок карточки в соцсетях, если он отличается от <title>. */
  ogTitle?: string;
  ogDescription?: string;
  /** Например "/ai-platform/". Для главной — "/". */
  path: string;
}): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "ru_RU",
      url,
      title: ogTitle ?? title,
      description: ogDescription ?? description,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle ?? title,
      description: ogDescription ?? description,
      images: [OG_IMAGE.url],
    },
  };
}

/**
 * То же самое, но из готовой записи в src/content/seo.ts — чтобы страницы не
 * перечисляли поля руками.
 */
export function seoMetadata(page: PageSeo): Metadata {
  return pageMetadata(page);
}
