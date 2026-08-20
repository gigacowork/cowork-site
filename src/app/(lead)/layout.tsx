/**
 * Каркас страницы заявки: без общей шапки и подвала — по макету
 * (Registration / Desktop 2397:43434, Registration / Mobile 2397:43447) у неё
 * своя минимальная навигация (только логотип) и свой подвал
 * (только копирайт). Страница объявляет их сама.
 */
export default function LeadLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
