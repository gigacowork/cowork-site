import type { Metadata } from "next";

/**
 * Каркас технической страницы /landing-events.
 *
 * Общих шапки и подвала здесь нет намеренно: это не страница сайта, а
 * киоск-экран для выставочной тач-панели. В навигации сайта на неё тоже
 * нет ссылок — попасть можно только по прямому адресу.
 *
 * `robots: noindex, nofollow` объявлен на уровне группы, поэтому действует
 * на все три экрана сразу. Дополнительно адрес закрыт в public/robots.txt:
 * meta-тег запрещает индексировать, robots.txt — заходить.
 */

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  /*
    Корневой макет объявляет canonical на главную; без этой строки он бы
    достался и киоск-экранам — «канонический адрес этой страницы: главная».
    `null` убирает тег, а не подменяет его.
  */
  alternates: { canonical: null },
};

export default function LandingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
