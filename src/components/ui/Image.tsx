import NextImage, { type ImageProps } from "next/image";

import { asset } from "@/lib/asset";

/**
 * Обёртка над next/image, подставляющая basePath в путь картинки.
 *
 * Зачем: при `images.unoptimized` (обязательном для статического экспорта)
 * next/image отдаёт src как есть, без basePath. На GitHub Pages, где сайт лежит
 * в подпапке /cowork-site, из-за этого все картинки отдавали бы 404.
 *
 * Во всех секциях импортируйте Image отсюда, а не из "next/image".
 */
export function Image({ src, ...props }: ImageProps) {
  return <NextImage src={typeof src === "string" ? asset(src) : src} {...props} />;
}

export default Image;
