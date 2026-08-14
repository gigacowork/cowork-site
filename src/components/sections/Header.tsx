"use client";

import Image from "@/components/ui/Image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

/**
 * Header
 * Figma desktop: 1927:15642 (1440×81, px 120 / py 16)
 * Figma mobile:  1927:17444 (px 16 / py 16, logo 117×25, CTA + burger)
 */

/*
  Ссылки абсолютные, а не «#anchor»: шапка общая для всех страниц, и с
  «Обучающих видео» якорь без слэша вёл бы в никуда.
*/
const NAV_ITEMS = [
  { label: "О платформе", href: "/#platform" },
  { label: "Для кого", href: "/#audience" },
  { label: "Обучающие видео", href: "/video" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  /*
    The header sits ON TOP of the hero, so while it is still over the hero it
    stays fully transparent and the hero background shows through behind the
    navigation. It only picks up a surface once the hero has scrolled past —
    note the hero grows when the chat opens, so this tracks the live edge
    rather than a fixed scroll offset.
  */
  useEffect(() => {
    let frame = 0;

    const check = () => {
      frame = 0;
      const hero = document.getElementById("hero");
      const headerH =
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--header-h"
          )
        ) || 0;
      /*
        Прозрачной шапка бывает только над hero главной. На страницах без hero
        (например «Обучающие видео») фон светлый и однотонный — там шапка
        сплошная с самого верха, иначе пункты меню висят в воздухе.
      */
      setScrolled(hero ? hero.getBoundingClientRect().bottom <= headerH : true);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(check);
    };

    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const solid = scrolled || menuOpen;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 w-full transition-colors duration-300 ${
        solid ? "bg-bg-page/85" : "bg-transparent"
      }`}
    >
      {/*
        Подложка навигации. Над hero шапка остаётся прозрачной, но контент под
        ней размывается — иначе сообщения чата, проезжающие снизу, перебивают
        пункты меню. Маска гасит размытие к низу, чтобы не было видно линии
        среза; после hero шапка получает заливку и размывает всю свою высоту.
      */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 -z-10 backdrop-blur-[14px] transition-[mask-image] duration-300 ${
          solid
            ? ""
            : "[mask-image:linear-gradient(to_bottom,black_0%,black_62%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_62%,transparent_100%)]"
        }`}
      />

      <div className="container-page flex items-center justify-between py-16">
        {/* Logo — desktop 155×33, mobile 117×25 */}
        <Link href="/" aria-label="GigaCowork" className="shrink-0">
          <Image
            src="/img/logo-gigacowork.svg"
            alt="GigaCowork"
            width={155}
            height={33}
            priority
            className="h-[25px] w-[117px] md:h-[33px] md:w-[155px]"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center md:flex">
          <ul className="flex items-center gap-8 p-8">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center justify-center gap-8 rounded-full px-12 py-8 text-body-m text-text-primary transition-colors hover:bg-neutral-100"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-16">
            <Button href="#login" variant="secondary" size="md">
              Войти
            </Button>
            <Button href="/lead" variant="primary" size="md">
              Попробовать
            </Button>
          </div>
        </nav>

        {/* Mobile actions */}
        <div className="flex items-center gap-8 md:hidden">
          <Button href="/lead" variant="primary" size="sm">
            Попробовать
          </Button>
          <button
            type="button"
            aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="relative size-[24px] cursor-pointer"
          >
            <span
              className={`absolute left-[3px] h-[2px] w-[18px] rounded-[1px] bg-icon-primary transition-all duration-300 ${
                menuOpen ? "top-[11px] rotate-45" : "top-[5px]"
              }`}
            />
            <span
              className={`absolute left-[3px] top-[11px] h-[2px] w-[18px] rounded-[1px] bg-icon-primary transition-opacity duration-200 ${
                menuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-[3px] h-[2px] w-[18px] rounded-[1px] bg-icon-primary transition-all duration-300 ${
                menuOpen ? "top-[11px] -rotate-45" : "top-[17px]"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`overflow-hidden border-border-subtle bg-bg-page transition-[max-height,opacity] duration-300 md:hidden ${
          menuOpen ? "max-h-[320px] border-t opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="container-page flex flex-col gap-4 py-16">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="rounded-full px-12 py-12 text-body-l text-text-primary"
            >
              {item.label}
            </Link>
          ))}
          <Button href="#login" variant="secondary" size="lg" className="mt-8">
            Войти
          </Button>
        </nav>
      </div>
    </header>
  );
}

export default Header;
