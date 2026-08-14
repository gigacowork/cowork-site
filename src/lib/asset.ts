/**
 * Префикс для файлов из /public.
 *
 * На GitHub Pages сайт лежит в подпапке (/cowork-site), поэтому абсолютные пути
 * вида "/img/icons/bot.svg" сами по себе ведут в корень домена и ломаются.
 * next/image подставляет basePath самостоятельно, а вот ручные url() в inline-стилях
 * (CSS-маски иконок) — нет, для них и нужна эта функция.
 *
 * Локально NEXT_PUBLIC_BASE_PATH пуст и asset() возвращает путь без изменений.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string): string {
  if (!BASE_PATH || !path.startsWith("/")) return path;
  return `${BASE_PATH}${path}`;
}
