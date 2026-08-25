import type { Metadata } from "next";
import { PAGE_SEO } from "@/content/seo";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import Image from "@/components/ui/Image";
import { Button } from "@/components/ui/Button";

/**
 * 404 — страница не найдена.
 * Figma desktop: 3512:27223 (1440×760 + подвал, контент по центру, gap 48)
 * Figma mobile:  3512:27279 (390×560 + подвал, gap 40)
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
  /* Тексты — из SEO-документа страницы (src/content/seo.ts). */
  title: PAGE_SEO.notFound.title,
  description: PAGE_SEO.notFound.description,
  /* Битые адреса в поиске не нужны. */
  robots: { index: false, follow: false },
  /* И canonical на главную, унаследованный от корневого макета, тоже. */
  alternates: { canonical: null },
  /*
    Карточка для соцсетей здесь тоже лишняя: унаследованная от корневого
    макета, она выдавала 404 за главную страницу.
  */
  openGraph: null,
  twitter: null,
};

/** Заливка экрана из макета (3512:27224). */
const HERO_GRADIENT =
  "bg-[linear-gradient(239.46deg,#f0f8ff_20.71%,#f7f7f8_94.87%)]";

export default function NotFound() {
  return (
    <>
      <Header />

      {/*
        Высота фиксирована по макету — 560 на 390 и 760 на 1440, — а контент
        стоит по центру этой высоты. Отступа под шапку нет намеренно: в макете
        она лежит поверх экрана, а до картинки остаётся 123 пункта.

        `id="hero"` — рабочий, а не декоративный: по нему шапка понимает, что
        стоит над первым экраном, и остаётся прозрачной (см. Header).
      */}
      <main
        id="hero"
        className={`relative isolate flex min-h-[560px] w-full flex-col items-center justify-center overflow-hidden py-24 md:min-h-[760px] md:py-40 ${HERO_GRADIENT}`}
      >
        <div className="container-page flex flex-col items-center gap-40 md:gap-48">
          {/*
            Картинка 320×180 и 553×311 — ровно из макета. Файл один на обе
            ширины: пропорция совпадает (16:9), а исходник вдвое крупнее
            десктопного кадра, так что на плотных экранах не мылится.
          */}
          <Image
            src="/img/404.webp"
            alt="404"
            width={1106}
            height={622}
            priority
            className="h-[180px] w-[320px] md:h-[311px] md:w-[553px]"
          />

          <div className="flex flex-col items-center gap-24 md:gap-32">
            <div className="flex flex-col items-center gap-8 text-center md:gap-12">
              {/*
                Переносы ниже md — из мобильного макета: «Страница / не найдена»
                и «Возможно, страница переехала / или в адресе допущена ошибка».
                На десктопе обе строки идут в одну.
              */}
              <h1 className="text-h2 font-medium text-text-primary md:text-h1">
                Страница <br className="md:hidden" />
                не&nbsp;найдена
              </h1>

              <p className="text-body-l text-text-secondary">
                Возможно, страница переехала <br className="md:hidden" />
                или&nbsp;в&nbsp;адресе допущена ошибка
              </p>
            </div>

            <Button href="/" variant="primary" size="md">
              На главную
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
