import type { Metadata } from "next";
import Image from "@/components/ui/Image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import LeadForm from "@/components/sections/LeadForm";

/**
 * «Оставить заявку» — /lead
 * Figma desktop: 2397:43434 (Registration / Desktop — фон 27.277°, header 81,
 *   CTA pt-151 / pb-80 / px-120, gutter 24, форма 588, footer pt-48 / pb-40)
 * Figma mobile:  2397:43447 (Registration / Mobile 390 — фон 67.445°, header 62,
 *   контент px-20 / py-40 / gap-40, footer pt-24 / pb-32)
 *
 * Страница лежит в группе маршрутов (lead) — без общей шапки и подвала сайта:
 * по макету здесь только логотип и «Войти» сверху и копирайт снизу. Логотип
 * ведёт на главную.
 */

export const metadata: Metadata = {
  title: "Оставить заявку — GigaCowork",
  description:
    "Оставьте заявку, чтобы получить пробный доступ к GigaCowork: 3 месяца от демо до первого ROI, безлимитные токены, готовое решение без изменения ИТ-систем.",
};

/** Фон страницы: угол на мобильном другой (67.445° против 27.277°). */
const PAGE_GRADIENT =
  "bg-[linear-gradient(67.445deg,#f0f8ff_7.1429%,#f7f7f8_78.571%)] " +
  "md:bg-[linear-gradient(27.277deg,#f0f8ff_7.1429%,#f7f7f8_78.571%)]";

/** CTA / Copy — I2397:43441…43443 / 2397:43455…43459 */
const BENEFITS = [
  "3 месяца от демо до первого ROI",
  "Безлимитное количество токенов",
  "Готовое решение без изменения ИТ-систем",
];

export default function LeadPage() {
  return (
    <div className={`flex min-h-screen w-full flex-col ${PAGE_GRADIENT}`}>
      {/* Header 2397:43445 / 2397:43448 — только логотип и «Войти» */}
      <header className="container-page flex h-[62px] shrink-0 items-center justify-between py-16 md:h-[81px]">
        <Link href="/" aria-label="GigaCowork, на главную" className="shrink-0">
          <Image
            src="/img/logo-gigacowork.svg"
            alt="GigaCowork"
            width={155}
            height={33}
            priority
            className="h-[25px] w-[117px] md:h-[33px] md:w-[155px]"
          />
        </Link>

        {/*
          Размер кнопки разный: Small 12px на мобильном (I2397:43448;792:6318)
          и Medium 14px на десктопе (I2397:43445;324:998). Переключение висит на
          обёртках, а не на самой кнопке: у Button в базовых классах есть
          `inline-flex`, и он перебивает `hidden`, добавленный через className.
        */}
        <span className="md:hidden">
          <Button href="#login" variant="secondary" size="sm">
            Войти
          </Button>
        </span>
        <span className="hidden md:block">
          <Button href="#login" variant="secondary" size="md">
            Войти
          </Button>
        </span>
      </header>

      {/* CTA 2397:43435 / Content 2397:43449 */}
      {/*
        Сетка общая с остальным сайтом: `container-page` — контент до 1200 по
        центру, поля 16 / 40 / 120 по брейкпоинтам. В макете страницы заявки
        стояли свои фиксированные поля (20 и 120), из-за чего на широких экранах
        контент растягивался шире, чем на всех прочих страницах.
      */}
      <main className="container-page flex flex-1 flex-col items-center gap-40 py-40 md:flex-row md:items-start md:gap-24 md:pt-[70px] md:pb-80">
        {/* CTA / Left Column 2397:43436 — Hero / Intro 2397:43450 на мобильном */}
        <div className="flex w-full flex-col items-center gap-24 text-text-primary md:min-w-0 md:flex-1 md:items-start md:gap-64">
          <div className="flex w-full flex-col items-center gap-24 md:items-start md:gap-32">
            <h1 className="w-full text-center text-h2 font-medium md:w-[522px] md:text-left">
              Готовы делегировать работу ИИ-агентам?
            </h1>
            <p className="w-full text-center text-body-l md:w-[304px] md:text-left">
              Оставьте заявку, чтобы получить{" "}
              <br className="md:hidden" />
              пробный доступ к GigaCowork
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

      {/* Footer 2397:43446 / 2397:43461 — только копирайт */}
      <footer className="container-page shrink-0 pt-24 pb-32 md:pt-48 md:pb-40">
        <p className="text-center text-caption text-text-primary md:text-left">
          © 2026 ГигаЧат Бизнес · ООО «Салют для Бизнеса»
          <br className="hidden md:inline" /> 121170, г. Москва,
          Садовая-Самотёчная ул., 24/27 · ИНН 7804568396
        </p>
      </footer>
    </div>
  );
}
