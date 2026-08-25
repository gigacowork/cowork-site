import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import Image from "@/components/ui/Image";
import Link from "next/link";
import LeadForm from "@/components/sections/LeadForm";
import { LEGAL_LINES } from "@/lib/legal";

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
  description:
    "Оставьте заявку, чтобы получить пробный доступ к\u00A0GigaCowork: 3\u00A0месяца от\u00A0демо до\u00A0первого ROI, безлимитные токены, готовое решение без\u00A0изменения ИТ-систем.",
  path: "/lead/",
});

/** Фон страницы: угол на мобильном другой (67.445° против 27.277°). */
const PAGE_GRADIENT =
  "bg-[linear-gradient(67.445deg,#f0f8ff_7.1429%,#f7f7f8_78.571%)] " +
  "md:bg-[linear-gradient(27.277deg,#f0f8ff_7.1429%,#f7f7f8_78.571%)]";

/** CTA / Copy — I2397:43441…43443 / 2397:43455…43459 */
const BENEFITS = [
  "3\u00A0месяца от\u00A0демо до\u00A0первого ROI",
  "Безлимитное количество токенов",
  "Готовое решение без\u00A0изменения ИТ-систем",
];

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
      <main className="container-page flex flex-1 flex-col items-center gap-40 py-40 md:flex-row md:items-start md:gap-24 md:pt-[var(--lead-main-pt,70px)] md:pb-[var(--lead-main-pb,80px)]">
        {/* CTA / Left Column 2397:43436 — Hero / Intro 2397:43450 на мобильном */}
        <div className="flex w-full flex-col items-center gap-24 text-text-primary md:min-w-0 md:flex-1 md:items-start md:gap-64">
          <div className="flex w-full flex-col items-center gap-24 md:items-start md:gap-32">
            <h1 className="w-full text-center text-h2 font-medium md:w-[522px] md:text-left">
              Готовы делегировать работу ИИ-агентам?
            </h1>
            <p className="w-full text-center text-body-l md:w-[304px] md:text-left">
              Оставьте заявку, чтобы получить <br className="md:hidden" />
              пробный доступ к&nbsp;GigaCowork
            </p>
          </div>

          <ul className="flex w-full flex-col gap-16 md:gap-24">
            {BENEFITS.map((item) => (
              <li key={item} className="ms-24 list-disc text-body-l">
                {item}
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
