import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";

/**
 * Каркас обычных страниц сайта: полная навигация (1927:15642 / 1927:17444) и
 * полный подвал (1927:15641 / 1927:17443). Любая правка в них применяется сразу
 * ко всем страницам этой группы — сейчас это главная и «Обучающие видео».
 *
 * Страница заявки в группу не входит: у неё свои шапка и подвал по макету.
 */
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
