"use client";

import Image from "@/components/ui/Image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { USE_CASES } from "@/lib/use-cases";

/**
 * Header
 * Figma desktop: 1927:15642 (1440×81, px 120 / py 16)
 * Figma mobile:  1927:17444 (px 16 / py 16, logo 117×25, CTA + burger)
 *
 * Пункт «О платформе» — раскрывашка. Шеврон взят из компонента Navigation Item
 * (319:930, состояние Disclosure=Closed) — это тот же вектор, что в макете, а не
 * нарисованный заново: Disclosure управляет направлением шеврона, поэтому в
 * открытом состоянии он просто поворачивается на 180°.
 */

type NavLeaf = { label: string; href: string };
type NavItem = { label: string; href?: string; children?: NavLeaf[] };

/*
  Ссылки абсолютные, а не «#anchor»: шапка общая для всех страниц, и с
  «Обучающих видео» якорь без слэша вёл бы в никуда.
*/
const NAV_ITEMS: NavItem[] = [
  {
    label: "О\u00A0платформе",
    children: [
      { label: "Обзор платформы", href: "/ai-platform" },
      { label: "Что\u00A0нового", href: "/ai-platform/new-features" },
      { label: "Документация", href: "/ai-platform/docs/" },
    ],
  },
  {
    label: "Для\u00A0кого",
    /*
      Пункты собираются из того же списка, что и сами страницы (src/lib/
      use-cases.ts) и что кнопки «Подробнее» в блоке «Не тратьте часы…».
      Руками их не дублируем: иначе меню и маршруты разъедутся при первой же
      правке адреса.
    */
    children: USE_CASES.map((item) => ({
      label: item.navLabel,
      href: `/use_cases/${item.slug}`,
    })),
  },
  { label: "Обучающие видео", href: "/guides" },
];

/** Подсветка активного пункта: точное совпадение или вложенный маршрут. */
function isActive(pathname: string, href: string) {
  if (!href.startsWith("/") || href.startsWith("/#")) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  /** label раскрытого пункта на десктопе (одновременно открыт только один) */
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  /** label раскрытого пункта в мобильной шторке */
  const [openMobile, setOpenMobile] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  /* Смена маршрута закрывает и шторку, и раскрывашки. */
  useEffect(() => {
    setMenuOpen(false);
    setOpenMenu(null);
    setOpenMobile(null);
  }, [pathname]);

  /* Escape и клик мимо закрывают выпадающее меню. */
  useEffect(() => {
    if (!openMenu) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenu(null);
    };
    const onPointerDown = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpenMenu(null);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [openMenu]);

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
            "--header-h",
          ),
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

        Радиус размытия — 6: этого хватает, чтобы пункты меню читались поверх
        проезжающего контента, но фон hero под шапкой остаётся узнаваемым. На 14
        картинка под навигацией превращалась в ровное пятно.
      */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 -z-10 backdrop-blur-[6px] transition-[mask-image] duration-300 ${
          solid
            ? ""
            : "[mask-image:linear-gradient(to_bottom,black_0%,black_62%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_62%,transparent_100%)]"
        }`}
      />

      {/*
        Высота полосы прибита к --header-h (62 на телефоне, 81 на десктопе): в
        открытом меню кнопка «Попробовать» из полосы уходит вниз, в блок
        действий, и без фиксированной высоты полоса схлопывалась бы под
        крестик, а логотип прыгал вверх.
      */}
      <div className="container-page flex min-h-[var(--header-h)] items-center justify-between py-16">
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
        <nav ref={navRef} className="hidden items-center md:flex">
          <ul className="flex items-center gap-8 p-8">
            {NAV_ITEMS.map((item) => {
              if (!item.children) {
                return (
                  <li key={item.label}>
                    <Link
                      href={item.href!}
                      aria-current={
                        isActive(pathname, item.href!) ? "page" : undefined
                      }
                      className="flex items-center justify-center gap-8 rounded-full px-12 py-8 text-body-m text-text-primary transition-colors hover:bg-neutral-100 aria-[current=page]:bg-neutral-100"
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              }

              const open = openMenu === item.label;
              const groupActive = item.children.some((leaf) =>
                isActive(pathname, leaf.href),
              );

              return (
                <li
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setOpenMenu(item.label)}
                  onMouseLeave={() => setOpenMenu(null)}
                >
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-haspopup="true"
                    onClick={() => setOpenMenu(open ? null : item.label)}
                    /*
                      Navigation Item, State=Hover (3435:15130): подложка
                      Action/Secondary/Hover, текст Text/Strong. Раньше здесь
                      была neutral-100 — на ступень темнее.
                    */
                    className={`flex cursor-pointer items-center justify-center gap-8 rounded-full px-12 py-8 text-body-m transition-colors hover:bg-action-secondary-hover hover:text-text-strong ${
                      open || groupActive
                        ? "bg-action-secondary-hover text-text-strong"
                        : "text-text-primary"
                    }`}
                  >
                    {item.label}
                    <Icon
                      src="/img/icons/chevron-down.svg"
                      className={`h-[5px] w-[9px] text-icon-primary transition-transform duration-200 ${
                        open ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/*
                    Панель начинается вплотную к кнопке (top-full), без зазора —
                    иначе указатель по дороге к ссылке выходит за пределы <li>
                    и меню схлопывается.
                  */}
                  <div
                    className={`absolute top-full left-0 pt-8 transition-[opacity,transform] duration-200 ${
                      open
                        ? "pointer-events-auto translate-y-0 opacity-100"
                        : "pointer-events-none -translate-y-4 opacity-0"
                    }`}
                  >
                    {/*
                      Dropdown Panel (3435:15092): ширина 304, скругление 24,
                      внутренний отступ 12, шаг между пунктами 4, обводка
                      Border/Subtle и тень Elevation/Drop/Sm.
                    */}
                    <ul className="flex w-[304px] flex-col gap-4 overflow-hidden rounded-[24px] border border-border-subtle bg-bg-page p-12 shadow-drop-sm">
                      {item.children.map((leaf) => (
                        <li key={leaf.href}>
                          {/*
                            Dropdown Item (3432:15088): высота 41, отступы по 12,
                            скругление полное, Body/M. В ховере — подложка
                            Action/Secondary/Hover и текст Text/Strong.
                          */}
                          <Link
                            href={leaf.href}
                            tabIndex={open ? undefined : -1}
                            aria-current={
                              isActive(pathname, leaf.href) ? "page" : undefined
                            }
                            onClick={() => setOpenMenu(null)}
                            className="flex h-[41px] items-center rounded-full px-12 text-body-m whitespace-nowrap text-text-primary transition-colors hover:bg-action-secondary-hover hover:text-text-strong aria-[current=page]:bg-action-secondary-hover aria-[current=page]:text-text-strong"
                          >
                            {leaf.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="flex items-center gap-16">
            <Button href="/lead" variant="primary" size="md">
              Попробовать
            </Button>
          </div>
        </nav>

        {/* Mobile actions */}
        <div className="flex items-center gap-8 md:hidden">
          {/*
            Header/Mobile/Open (2567:9427): в открытом меню в полосе остаются
            только логотип и крестик — кнопка действия уезжает в блок под
            навигацией, чтобы не дублироваться.
          */}
          {!menuOpen && (
            <Button href="/lead" variant="primary" size="sm">
              Попробовать
            </Button>
          )}
          <button
            type="button"
            aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="relative size-[24px] cursor-pointer"
          >
            {/*
              Открытое состояние — Icon/Close (2563:9429): крестик вписан в
              квадрат 14×14 внутри иконки 24×24. Поэтому в этом состоянии
              полоски удлиняются с 18 до 20: повёрнутая на 45° полоска даёт
              габарит 20 / √2 ≈ 14.
            */}
            <span
              className={`absolute h-[2px] rounded-[1px] bg-icon-primary transition-all duration-300 ${
                menuOpen
                  ? "top-[11px] left-[2px] w-[20px] rotate-45"
                  : "top-[5px] left-[3px] w-[18px]"
              }`}
            />
            <span
              className={`absolute top-[11px] left-[3px] h-[2px] w-[18px] rounded-[1px] bg-icon-primary transition-opacity duration-200 ${
                menuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute h-[2px] rounded-[1px] bg-icon-primary transition-all duration-300 ${
                menuOpen
                  ? "top-[11px] left-[2px] w-[20px] -rotate-45"
                  : "top-[17px] left-[3px] w-[18px]"
              }`}
            />
          </button>
        </div>
      </div>

      {/*
        Mobile drawer — Menu/Content (2567:9445): белая подложка, отступы 40
        сверху и 64 снизу, шаг 24 между навигацией и блоком действий.
      */}
      <div
        className={`overflow-hidden bg-bg-page transition-[max-height,opacity] duration-300 md:hidden ${
          menuOpen
            ? "max-h-[calc(100dvh-var(--header-h))] overflow-y-auto opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        <div className="container-page flex flex-col gap-24 pt-40 pb-64">
          <nav className="flex flex-col gap-8">
            {NAV_ITEMS.map((item) => {
              if (!item.children) {
                return (
                  <Link
                    key={item.label}
                    href={item.href!}
                    onClick={() => setMenuOpen(false)}
                    /*
                    Navigation Item (320:31) как есть: отступы 12/8, Body/L,
                    содержимое по центру строки — так пункты стоят в макете.
                  */
                    className="flex items-center justify-center rounded-full px-12 py-8 text-body-l text-text-primary"
                  >
                    {item.label}
                  </Link>
                );
              }

              const open = openMobile === item.label;

              return (
                <div key={item.label} className="flex flex-col gap-8">
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => setOpenMobile(open ? null : item.label)}
                    /*
                    Шеврон в макете этого экрана не нарисован, но оставлен
                    намеренно: за «О платформе» и «Для кого» стоят вложенные
                    страницы, и с телефона они открываются только отсюда — без
                    шеврона пункт выглядит обычной ссылкой. Это штатное
                    состояние Navigation Item (Show Chevron), а не отсебятина.
                    Раскрытый пункт подсвечивается как в ховере.
                  */
                    className={`flex cursor-pointer items-center justify-center gap-8 rounded-full px-12 py-8 text-body-l transition-colors ${
                      open
                        ? "bg-action-secondary-hover text-text-strong"
                        : "text-text-primary"
                    }`}
                  >
                    {item.label}
                    <Icon
                      src="/img/icons/chevron-down.svg"
                      className={`h-[6px] w-[11px] text-icon-primary transition-transform duration-200 ${
                        open ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    /*
                    Потолок раскрывашки считается от самого длинного списка —
                    «Для кого» с восемью ролями (8 × 41 + 7 × 4 + 8 снизу).
                    С прежними 240 половина пунктов оказывалась срезанной.
                  */
                    className={`overflow-hidden transition-[max-height,opacity] duration-300 ${
                      open ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <ul className="flex flex-col gap-4 pb-8">
                      {item.children.map((leaf) => (
                        <li key={leaf.href}>
                          {/* Тот же Dropdown Item (3432:15088), что и на десктопе. */}
                          <Link
                            href={leaf.href}
                            tabIndex={open ? undefined : -1}
                            aria-current={
                              isActive(pathname, leaf.href) ? "page" : undefined
                            }
                            onClick={() => setMenuOpen(false)}
                            className="flex h-[41px] items-center justify-center rounded-full px-12 text-body-m text-text-primary transition-colors active:bg-action-secondary-hover active:text-text-strong aria-[current=page]:bg-action-secondary-hover aria-[current=page]:text-text-strong"
                          >
                            {leaf.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </nav>

          {/*
          Menu/Actions (2567:41846): кнопки шириной 212 по центру, шаг 12.
          «Войти» из макета не переносим — на сайте её нет.
        */}
          <div className="flex flex-col items-center gap-12">
            <Button
              href="/lead"
              variant="primary"
              size="lg"
              className="w-[212px]"
              onClick={() => setMenuOpen(false)}
            >
              Попробовать
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
