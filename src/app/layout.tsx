import type { Metadata, Viewport } from "next";
import "./globals.css";
import { YandexMetrika } from "@/components/analytics/YandexMetrika";

/**
 * Корневой каркас — только <html> и <body>.
 *
 * Шапка и подвал живут не здесь, а в layout групп маршрутов, потому что они
 * разные у разных страниц:
 *   (site) — обычная навигация и полный подвал (главная, «Обучающие видео»);
 *   (lead) — упрощённые шапка и подвал из макета формы заявки.
 * Скобки в имени папки — группа маршрутов Next: на URL она не влияет.
 */

export const metadata: Metadata = {
  title: "GigaCowork — ИИ-агенты для вашей команды",
  description:
    "GigaCowork — платформа ИИ-агентов, которые берут на себя рутинные задачи команды. Безопасная российская ИИ-инфраструктура.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>
        {children}
        {/* Счётчик стоит в корневом каркасе — он общий для всех страниц. */}
        <YandexMetrika />
      </body>
    </html>
  );
}
