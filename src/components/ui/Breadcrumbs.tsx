import Link from "next/link";

import { Icon } from "@/components/ui/Icon";

/**
 * Breadcrumbs — Figma 4939:94996 (пример на странице «Партнёрам»:
 * desktop 4939:94997, mobile 4939:95002).
 *
 * Два разных вида, а не один в двух размерах — так в макете:
 *   • от md: «Главная › Текущая страница». Первые звенья — Body/M
 *     text-secondary, последнее — text-primary, шаг 8, шеврон 12;
 *   • ниже md: одна ссылка «‹ На главную». Цепочку на 390 не показываем:
 *     названия внутренних страниц длинные, и она переносилась бы в две
 *     строки поверх заголовка.
 *
 * Расположение по умолчанию (`variant="hero"`) — абсолютом под шапкой, как
 * в макете: у hero с растровым фоном высота фиксирована, и лишний блок в
 * потоке сдвинул бы заголовок с рассчитанной по макету позиции. Отступ от
 * шапки берётся от её реальной высоты (`--header-h`: 62 / 81), поэтому
 * крошки не разъедутся, если высота шапки поменяется.
 *
 * На hero без картинки (например «Обучающие видео») позиционировать нечего —
 * там `variant="inline"`: голая строка, которую страница ставит в свой
 * контейнер сама.
 */

export type Crumb = {
  label: string;
  /** Ссылка у промежуточного звена. У последнего игнорируется. */
  href?: string;
};

const LINK_CLASS =
  "text-body-m text-text-secondary transition-colors hover:text-text-primary";

function Row({ items }: { items: Crumb[] }) {
  const last = items.length - 1;

  return (
    <>
      {/* Ниже md — только возврат на главную (4939:95002) */}
      <Link
        href="/"
        className={`flex w-fit items-center gap-8 md:hidden ${LINK_CLASS}`}
      >
        <Icon
          src="/img/icons/chevron-down.svg"
          className="size-[12px] rotate-90"
        />
        На&nbsp;главную
      </Link>

      {/* От md — цепочка (4939:94997) */}
      <ol className="hidden items-center gap-8 md:flex">
        {/*
          `flex items-center` — как у остальных звеньев. Без него ссылка
          остаётся строчной, её бокс считается по метрикам шрифта (18), а не
          по интерлиньяжу (16.8), строка получается на 24 — и «Главная» стоит
          на 1,4 пикселя ниже соседей. С флексом высота всей строки 16.8, как
          в макете (4939:15243 — 17).
        */}
        <li className="flex items-center">
          <Link href="/" className={LINK_CLASS}>
            Главная
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={item.label} className="flex items-center gap-8">
            <Icon
              src="/img/icons/chevron-down.svg"
              className="size-[12px] -rotate-90 text-text-secondary"
            />
            {item.href && index !== last ? (
              <Link href={item.href} className={LINK_CLASS}>
                {item.label}
              </Link>
            ) : (
              <span
                className="text-body-m text-text-primary"
                aria-current={index === last ? "page" : undefined}
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </>
  );
}

export function Breadcrumbs({
  items,
  variant = "hero",
  className = "",
}: {
  /** Звенья после «Главной». Последнее — текущая страница, без ссылки. */
  items: Crumb[];
  variant?: "hero" | "inline";
  className?: string;
}) {
  if (variant === "inline") {
    return (
      <nav
        aria-label="Хлебные крошки"
        /*
          Своё поле снизу: у hero с картинкой крошки стоят абсолютом и до
          заголовка остаётся полторы сотни пикселей, а в потоке между ними
          был только зазор контейнера (16) — строка липла к H1. Вместе с
          зазором выходит 24 на телефоне и 32 на десктопе, то есть тот же
          шаг, что и от шапки до крошек в макете.
        */
        className={`mb-8 md:mb-16 ${className}`}
      >
        <Row items={items} />
      </nav>
    );
  }

  return (
    <nav
      aria-label="Хлебные крошки"
      /*
        z-10: у hero фоновая картинка лежит на -z-10, но поверх неё у части
        страниц идут ещё и декоративные слои — без явного уровня крошки
        оказывались под ними и не кликались.
      */
      className={`absolute inset-x-0 top-[calc(var(--header-h)+24px)] z-10 md:top-[calc(var(--header-h)+32px)] ${className}`}
    >
      <div className="container-page">
        <Row items={items} />
      </div>
    </nav>
  );
}

export default Breadcrumbs;
