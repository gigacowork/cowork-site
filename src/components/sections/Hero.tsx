import { HeroImage } from "@/components/ui/HeroImage";
/* Icon вернётся вместе с кнопкой «Войти» — см. закомментированный блок ниже. */
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

/**
 * Полоса подложки.
 *
 * Мобильный: слой равен секции, работает обычный cover. Отдельный кадр
 * pic_home_mob.webp (1170×1680) уже обрезан под вертикальный экран, поэтому
 * сдвигать и растягивать слой, как раньше, не нужно.
 * Десктоп: слой во всю ширину и высотой под hero с раскрытым чатом (≈1183px).
 */
const BKG_BAND = "inset-0 md:top-0 md:bottom-auto md:h-[1200px] md:w-full";

/**
 * Страховка на случай, если секция окажется выше полосы: цвет нижнего ряда
 * пикселей подложки, стык в стык.
 *
 * У прежней bkg.png низ был голубым и переливался по горизонтали, поэтому здесь
 * стоял градиент из двенадцати замеров. У pic_home.webp весь нижний ряд —
 * чистый #ffffff, так что достаточно ровной заливки.
 */
const BKG_EDGE = "linear-gradient(to right, #ffffff 0%, #ffffff 100%)";

/**
 * Прогрессивное размытие подложки под контентом.
 *
 * `backdrop-filter` нельзя задать градиентом, поэтому размытие набирается
 * стопкой слоёв: каждый следующий размывает сильнее, но его маска уже —
 * к центральной вертикали радиусы складываются, а к краям сходят в ноль.
 * Слои лежат МЕЖДУ картинкой (-z-10) и контентом, поэтому размывают только фон.
 */
const BLUR_LAYERS = [
  { blur: 1.5, mask: "transparent 0%, black 18%, black 82%, transparent 100%" },
  { blur: 3, mask: "transparent 8%, black 28%, black 72%, transparent 92%" },
  { blur: 5, mask: "transparent 18%, black 36%, black 64%, transparent 82%" },
  { blur: 8, mask: "transparent 28%, black 44%, black 56%, transparent 72%" },
];

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
        <div className={`absolute ${BKG_BAND}`}>
          <HeroImage
            desktop="/img/pic_home.webp"
            mobile="/img/pic_home_mob.webp"
            className="absolute inset-0 size-full object-cover [object-position:center_top]"
          />
        </div>
      </div>

      {/* Размытие фона: сильнее к центральной вертикали, слабее к краям */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-[5]">
        {BLUR_LAYERS.map((layer) => (
          <div
            key={layer.blur}
            className="absolute inset-0"
            style={{
              backdropFilter: `blur(${layer.blur}px)`,
              WebkitBackdropFilter: `blur(${layer.blur}px)`,
              maskImage: `linear-gradient(to right, ${layer.mask})`,
              WebkitMaskImage: `linear-gradient(to right, ${layer.mask})`,
            }}
          />
        ))}
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
              для&nbsp;всей компании
            </span>
            <span className="hidden md:inline">
              Делегируйте работу <br />
              ИИ-агентам
            </span>
          </h1>

          <p className="max-w-[358px] text-body-l md:max-w-none">
            <span className="md:hidden">
              Делегируйте работу ИИ&nbsp;— повышайте продуктивность сотрудников и
              ускоряйте процессы компании без&nbsp;изменения ИТ-систем
            </span>
            <span className="hidden md:inline">
              Повышайте продуктивность сотрудников <br />и&nbsp;ускоряйте процессы
              компании без&nbsp;изменения ИТ-систем
            </span>
          </p>
        </div>

        {/* Hero / CTA — только мобильный макет (1927:17366) */}
        <div className="flex w-full max-w-[358px] flex-col items-center gap-16 md:hidden">
          <Button
            href="/lead"
            variant="primary"
            size="lg"
            className="text-body-m!"
          >
            Попробовать платформу
          </Button>
          {/*
            «Войти» временно убрана — как и в шапке, и на странице лид-формы:
            входить пока некуда. Вернуть — раскомментировать.

            <Button href="#login" variant="ghost" size="lg">
              Войти
              <Icon src="/img/icons/arrow-up-right.svg" className="size-[9px] text-icon-primary" />
            </Button>
          */}
        </div>

        {/* PROTO / Hero Chat · Embedded 1933:85345 — только десктопный макет */}
        {chat}
      </div>
    </section>
  );
}

export default Hero;
