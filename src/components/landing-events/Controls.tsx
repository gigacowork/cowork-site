import Link from "next/link";
import type { ReactNode } from "react";
import { asset } from "@/lib/asset";
import styles from "./landing-events.module.css";

/**
 * Кнопки киоска. Перенесено из `PillButton.tsx` и `IconButton.tsx`.
 *
 * Отличие от исходника одно: переходы между экранами там делал
 * `navigate()` от React Router, здесь это обычные ссылки Next. Так экраны
 * открываются по прямому адресу, работают «назад» в браузере и средняя
 * кнопка мыши — а на статическом экспорте это ещё и единственный способ
 * получить настоящие страницы вместо клиентского роутера.
 */

function PillContent({
  icon,
  children,
}: {
  icon?: string;
  children: ReactNode;
}) {
  return (
    <>
      {icon ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={asset(icon)} alt="" className={styles.pillIcon} />
      ) : null}
      <span>{children}</span>
    </>
  );
}

export function PillButton({
  variant = "dark",
  icon,
  href,
  external,
  style,
  children,
}: {
  variant?: "dark" | "light";
  icon?: string;
  href: string;
  /** Внешний адрес — открывается в новой вкладке. */
  external?: boolean;
  style?: React.CSSProperties;
  children: ReactNode;
}) {
  const className = `${styles.pill} ${
    variant === "dark" ? styles.pillDark : styles.pillLight
  }`;

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        style={style}
      >
        <PillContent icon={icon}>{children}</PillContent>
      </a>
    );
  }

  return (
    <Link href={href} className={className} style={style}>
      <PillContent icon={icon}>{children}</PillContent>
    </Link>
  );
}

export function IconLink({
  icon,
  alt,
  href,
}: {
  icon: string;
  alt: string;
  href: string;
}) {
  return (
    <Link href={href} aria-label={alt} className={styles.iconButton}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={asset(icon)} alt="" className={styles.iconButtonIcon} />
    </Link>
  );
}
