import type { Metadata } from "next";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import { Button } from "@/components/ui/Button";
import { CTA_FALLBACK, CtaBackground } from "@/components/ui/CtaBackground";

/**
 * 404 — страница не найдена.
 *
 * Тексты перенесены из прежней версии сайта («404 — Страница не найдена»,
 * «Возможно, страница переехала или в адресе допущена ошибка», кнопка «На
 * главную»), оформление — на токенах и компонентах этого сайта.
 *
 * Файл лежит в корне `app`, а не в группе `(site)`: Next отдаёт эту страницу на
 * любой неизвестный адрес, в том числе вне групп маршрутов, и макеты групп к
 * ней не применяются. Поэтому шапка и подвал подключены здесь напрямую — те же
 * компоненты, что и в `(site)/layout.tsx`.
 *
 * При статическом экспорте отсюда собирается `out/404.html` — файл, который
 * GitHub Pages отдаёт на несуществующие адреса.
 */

export const metadata: Metadata = {
  title: "Страница не найдена — GigaCowork",
  description: "Возможно, страница переехала или в адресе допущена ошибка.",
  /* Битые адреса в поиске не нужны. */
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <>
      <Header />

      {/*
        Экран держится во всю высоту окна за вычетом подвала: короткая страница
        не должна оставлять подвал висеть посреди экрана. Отступ сверху — под
        шапку, она лежит поверх секции.

        `id="hero"` — рабочий, а не декоративный: по нему шапка понимает, что
        стоит над первым экраном, и остаётся прозрачной, пропуская фон секции
        сквозь навигацию. Без него шапка считает, что hero на странице нет, и
        включает сплошную заливку с самого верха.
      */}
      <main
        id="hero"
        className={`relative isolate flex min-h-[calc(100svh-var(--header-h))] w-full flex-col items-center justify-center overflow-hidden py-64 pt-[calc(64px+var(--header-h))] md:py-96 md:pt-[calc(96px+var(--header-h))] ${CTA_FALLBACK}`}
      >
        <CtaBackground />

        <div className="container-page flex flex-col items-center gap-32 text-center">
          <div className="flex flex-col items-center gap-16">
            {/*
              Число набрано Display/L — самой крупной ступенью шкалы после
              Display/XL, который на мобильном не помещается. Цвет — Status/
              Accent, как у нажатой текстовой ссылки: другого акцентного цвета
              в системе нет.
            */}
            <p className="text-display-l font-normal text-status-accent">404</p>

            <h1 className="text-h3 font-medium text-text-primary md:text-h2">
              Страница не найдена
            </h1>

            <p className="max-w-[520px] text-body-l text-text-secondary">
              Возможно, страница переехала или в адресе допущена ошибка
            </p>
          </div>

          <Button href="/" variant="primary" size="lg" className="text-body-m!">
            На главную
          </Button>
        </div>
      </main>

      <Footer />
    </>
  );
}
