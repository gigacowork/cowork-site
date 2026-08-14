import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";

/**
 * Hero
 * Figma desktop: 1927:15554 (1440×685, pt-160 / pb-80, gap-40)
 *   – Hero / Content 1927:15558, PROTO / Hero Chat · Embedded 1933:85345
 * Figma mobile:  1927:17359 (390×533, pt-120 / pb-64, gap-32)
 *   – Hero / Content 1927:17363, Hero / CTA 1927:17366 (no composer, no scenario chips)
 *
 * The embedded chat (composer + scenario chips + message list) lives entirely in
 * `@/components/interactive/HeroChat` and is injected through the `chat` slot —
 * the hero must contain exactly one composer and one set of chips.
 */

/**
 * Подложка hero.
 *
 * Картинка масштабируется под ВЫСОТУ РАСКРЫТОГО ЧАТА сразу и дальше не
 * пересчитывается. Слой имеет фиксированную высоту `BKG_BAND` и прижат к верху,
 * `object-cover` считается от него, а не от самой секции — поэтому рост hero
 * (чат раскрывается на ~470px) ничего не меняет в масштабе, а просто открывает
 * нижнюю часть уже отрисованной подложки.
 *
 * Мобильный: у картинки другая пропорция, чем у узкого высокого экрана, и hero
 * там не растёт (чата нет) — поэтому слой равен секции и работает обычный cover.
 */

/** Высота полосы подложки на десктопе: hero с раскрытым чатом ≈ 1183px. */
const BKG_BAND = "md:h-[1200px] md:bottom-auto";

/**
 * Страховка на случай, если секция окажется выше полосы: горизонтальный
 * градиент по нижнему ряду пикселей bkg.png, стык в стык по цвету.
 */
const BKG_EDGE =
  "linear-gradient(to right, rgb(194,204,214) 0%, rgb(190,208,216) 9.1%, rgb(156,211,230) 18.2%, rgb(167,198,226) 27.3%, rgb(157,188,223) 36.4%, rgb(144,176,219) 45.5%, rgb(146,176,217) 54.5%, rgb(183,208,228) 63.6%, rgb(182,208,229) 72.7%, rgb(191,210,230) 81.8%, rgb(195,214,231) 90.9%, rgb(193,213,231) 100%)";

export type HeroProps = {
  /** Слот для встроенного чата (PROTO / Hero Chat · Embedded), только desktop. */
  chat?: ReactNode;
};

export function Hero({ chat }: HeroProps) {
  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden"
    >
      {/* bkg — Figma 1927:15555 / 1927:17360 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        style={{ backgroundImage: BKG_EDGE }}
      >
        <div className={`absolute inset-0 ${BKG_BAND}`}>
          <Image
            src="/img/bkg.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover [object-position:left_top] md:[object-position:center_top]"
          />
        </div>
      </div>

      {/*
        The header is fixed on top of this section so that the background image
        runs behind the navigation. Figma's pt-120 / pt-160 is measured from the
        hero frame, which starts below the header — hence the offset.
      */}
      <div className="container-page flex flex-col items-center gap-32 pb-64 pt-[calc(120px+var(--header-h))] md:gap-40 md:pb-80 md:pt-[calc(160px+var(--header-h))]">
        {/* Hero / Content */}
        <div className="flex flex-col items-center gap-16 text-center text-text-primary md:gap-24">
          <h1
            id="hero-title"
            className="max-w-[358px] text-h2 font-medium md:max-w-none md:text-h1"
          >
            <span className="md:hidden">
              Платформа <br />
              ИИ-агентов <br />
              для всей компании
            </span>
            <span className="hidden md:inline">
              Делегируйте работу <br />
              ИИ-агентам
            </span>
          </h1>

          <p className="max-w-[358px] text-body-l md:max-w-none">
            <span className="md:hidden">
              Делегируйте работу ИИ — повышайте продуктивность сотрудников и
              ускоряйте процессы компании без изменения ИТ-систем
            </span>
            <span className="hidden md:inline">
              Повышайте продуктивность сотрудников <br />и ускоряйте процессы
              компании без изменения ИТ-систем
            </span>
          </p>
        </div>

        {/* Hero / CTA — только мобильный макет (1927:17366) */}
        <div className="flex w-full max-w-[358px] flex-col items-center gap-16 md:hidden">
          <Button
            href="#lead"
            variant="primary"
            size="lg"
            className="text-body-m!"
          >
            Попробовать платформу
          </Button>
          <Button
            href="#login"
            variant="ghost"
            size="lg"
          >
            Войти
            {/* Icon / arrow up-right 418:4735, 9×9 */}
            <Icon src="/img/icons/arrow-up-right.svg" className="size-[9px] text-icon-primary" />
          </Button>
        </div>

        {/* PROTO / Hero Chat · Embedded 1933:85345 — только десктопный макет */}
        {chat}
      </div>
    </section>
  );
}

export default Hero;
