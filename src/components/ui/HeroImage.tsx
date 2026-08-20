import { asset } from "@/lib/asset";

/**
 * Фоновая картинка hero в двух версиях — десктопной и мобильной.
 *
 * Это <picture> с `media`, а не два next/image с `hidden` / `md:hidden`:
 * скрытая классом картинка всё равно скачивается, и телефон получал бы оба
 * файла — в том числе десктопный 2880px. С <picture> браузер выбирает
 * источник до загрузки и качает ровно один.
 *
 * Кадры у версий разные (2880×1520 против 1170×1680) — это художественная
 * обрезка под пропорции экрана, а не тот же файл в двух размерах, поэтому
 * srcset по плотности здесь не подошёл бы.
 *
 * Путь идёт через `asset()`: при `images.unoptimized` basePath не
 * подставляется автоматически, а на GitHub Pages сайт лежит в подпапке.
 */

/** Граница переключения — та же, что у Tailwind `md` (768px). */
const MOBILE_MEDIA = "(max-width: 767.98px)";

export function HeroImage({
  desktop,
  mobile,
  className = "",
}: {
  desktop: string;
  /** Нет — на мобильном показывается десктопный кадр. */
  mobile?: string;
  className?: string;
}) {
  return (
    <picture>
      {mobile ? <source media={MOBILE_MEDIA} srcSet={asset(mobile)} /> : null}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset(desktop)}
        alt=""
        aria-hidden
        decoding="async"
        fetchPriority="high"
        className={className}
      />
    </picture>
  );
}

export default HeroImage;
