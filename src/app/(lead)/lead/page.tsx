import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import Image from "@/components/ui/Image";
import Link from "next/link";
import LeadForm from "@/components/sections/LeadForm";
import Icon from "@/components/ui/Icon";
import { LEGAL_LINES } from "@/lib/legal";
import { LEAD_COPY } from "@/content/lead-copy";

/**
 * «Оставить заявку» — /lead
 * Figma desktop: 2397:43434 (Registration / Desktop — фон 27.277°, header 81,
 *   CTA pt-151 / pb-80 / px-120, gutter 24, форма 588, footer pt-48 / pb-40)
 * Figma mobile:  2397:43447 (Registration / Mobile 390 — фон 67.445°, header 62,
 *   контент px-20 / py-40 / gap-40, footer pt-24 / pb-32)
 *
 * Страница лежит в группе маршрутов (lead) — без общей шапки и подвала сайта:
 * сверху только логотип, снизу копирайт. Логотип ведёт на главную.
 * В макете рядом с логотипом стоит «Войти» — кнопку убрали по всему сайту.
 */

export const metadata: Metadata = pageMetadata({
  title: "Оставить заявку\u00A0— GigaCowork",
  description: LEAD_COPY.description,
  path: "/lead/",
});

/** Фон страницы: угол на мобильном другой (67.445° против 27.277°). */
const PAGE_GRADIENT =
  "bg-[linear-gradient(67.445deg,#f0f8ff_7.1429%,#f7f7f8_78.571%)] " +
  "md:bg-[linear-gradient(27.277deg,#f0f8ff_7.1429%,#f7f7f8_78.571%)]";

export default function LeadPage() {
  return (
    /*
      `lead-fit` — вертикальный ритм страницы, который ужимается на невысоких
      экранах, чтобы форма целиком помещалась в видимую область без прокрутки.
      Величины и пороги — в globals.css.
    */
    <div
      className={`lead-fit flex min-h-screen w-full flex-col ${PAGE_GRADIENT}`}
    >
      {/* Header 2397:43445 / 2397:43448 — только логотип */}
      <header className="container-page flex h-[62px] shrink-0 items-center justify-between py-16 md:h-[81px]">
        <Link
          href="/"
          aria-label="GigaCowork, на\u00A0главную"
          className="shrink-0"
        >
          <Image
            src="/img/logo-gigacowork.svg"
            alt="GigaCowork"
            width={155}
            height={33}
            priority
            className="h-[25px] w-[117px] md:h-[33px] md:w-[155px]"
          />
        </Link>
      </header>

      {/* CTA 2397:43435 / Content 2397:43449 */}
      {/*
        Сетка общая с остальным сайтом: `container-page` — контент до 1200 по
        центру, поля 16 / 40 / 120 по брейкпоинтам. В макете страницы заявки
        стояли свои фиксированные поля (20 и 120), из-за чего на широких экранах
        контент растягивался шире, чем на всех прочих страницах.
      */}
      <main className="container-page flex flex-1 flex-col items-center gap-40 py-40 md:pt-[var(--lead-main-pt,70px)] md:pb-[var(--lead-main-pb,80px)] lg:flex-row lg:items-start lg:gap-24">
        {/* CTA / Left Column 2397:43436 — Hero / Intro 2397:43450 на мобильном */}
        <div className="flex w-full flex-col items-center gap-24 text-text-primary lg:min-w-0 lg:flex-1 lg:items-start lg:gap-64">
          <div className="flex w-full flex-col items-center gap-24 lg:items-start lg:gap-32">
            <h1 className="w-full max-w-[522px] text-center text-[26px] leading-[1.2] font-medium tracking-[-0.02em] md:text-h2 lg:text-left">
              {LEAD_COPY.titleStart}<br />{LEAD_COPY.titleEnd}
            </h1>
            {/*
              Текст занимает доступную ширину левой колонки до 522 px.
              На узких экранах форма переходит под текст, чтобы обе колонки
              не сжимались до нескольких слов в строке.
            */}
            <p className="w-full max-w-[522px] whitespace-pre-line text-center text-body-m min-[360px]:text-body-l lg:text-left lg:text-pretty">
              {LEAD_COPY.intro}
            </p>
          </div>

          <ul className="flex w-full flex-col gap-16 md:gap-24">
            {LEAD_COPY.benefits.map((item) => (
              <li key={item} className="flex items-start gap-12 text-body-l">
                <span
                  aria-hidden="true"
                  className="flex size-[20px] shrink-0 items-center justify-center rounded-full bg-[image:var(--gradient-omni-neuton-2)] shadow-[inset_0_0_0_1px_rgba(23,31,45,0.12)]"
                >
                  <Icon src="/img/icons/check.svg" className="size-[18px] text-text-primary" />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Form / Lead CTA 2397:43444 / 2397:43460 */}
        <LeadForm />
      </main>

      {/*
        Footer 2397:43446 / 2397:43461 — только копирайт.
        Текст берётся из общего справочника, что и подвал сайта: раньше он был
        написан здесь руками и отстал от обновлённых реквизитов.
      */}
      <footer className="container-page shrink-0 pt-24 pb-32 md:pt-[var(--lead-footer-pt,48px)] md:pb-[var(--lead-footer-pb,40px)]">
        <p className="text-center text-caption text-text-primary md:text-left">
          {LEGAL_LINES[0]}
          <br className="hidden md:inline" /> {LEGAL_LINES[1]}
        </p>
      </footer>
    </div>
  );
}
