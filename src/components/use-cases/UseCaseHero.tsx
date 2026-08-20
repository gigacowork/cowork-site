import { HeroImage } from "@/components/ui/HeroImage";
import { Button } from "@/components/ui/Button";
import { Lines, Paragraphs } from "@/components/use-cases/Lines";

/**
 * Hero страниц «Для кого».
 * Figma desktop: 2616:11204 (1440×760, контент pt 180 / pb 120 / px 120, gap 40,
 *   текстовый блок 720 с внутренним gap 24, подзаголовок 491, H1 48)
 * Figma mobile:  2656:11527 (390×720, контент pt 150 / pb 72 / px 16, gap 32,
 *   всё по центру, внутренний gap 48, H2 36)
 *
 * `id="hero"` — рабочий, а не декоративный: по нему шапка понимает, что стоит
 * над hero, и остаётся прозрачной, пропуская фон под навигацию (см. Header).
 *
 * `isolate` обязателен: фоновая картинка лежит на `-z-10`, и без изоляции этот
 * слой всплывает к корневому контексту наложения — картинку перекрывает белая
 * заливка body. На «О платформе» на эти же грабли уже наступали.
 */

/** Заливка hero из макета (2616:11205) — на случай, если растра для роли нет. */
const HERO_GRADIENT =
  "bg-[linear-gradient(205.02deg,#d4e2ff_10.99%,#b3ebf6_79.92%,#b3f6e1_101.64%)]";

export function UseCaseHero({
  title,
  intro,
  image,
  imageMobile,
}: {
  title: string;
  intro: string[];
  image?: string;
  /** Свой кадр ниже md: у мобильной версии другая пропорция (1170×1680). */
  imageMobile?: string;
}) {
  return (
    <section
      id="hero"
      /*
        Высота фиксирована в обоих макетах — 720 на 390 и 760 на 1440. Это не
        «по содержимому»: фон здесь полноэкранный растр, и при короткой роли
        («ИИ-агенты для финансов» в одну строку) блок схлопывался до 544 и
        срезал картинку почти вдвое.
      */
      className={`relative isolate flex min-h-[720px] w-full flex-col justify-center overflow-hidden pt-[150px] pb-[72px] md:min-h-[760px] md:pt-[180px] md:pb-120 ${
        image ? "bg-bg-page" : HERO_GRADIENT
      }`}
    >
      {image ? (
        <HeroImage
          desktop={image}
          mobile={imageMobile}
          className="pointer-events-none absolute inset-0 -z-10 size-full object-cover"
        />
      ) : null}

      <div className="container-page flex flex-col items-center gap-32 text-center md:items-start md:gap-40 md:text-left">
        <div className="flex flex-col gap-48 md:gap-24">
          <h1 className="text-h2 font-medium text-text-primary md:max-w-[720px] md:text-h1">
            <Lines text={title} />
          </h1>
          <p className="text-body-l text-text-secondary md:max-w-[491px]">
            <Paragraphs items={intro} />
          </p>
        </div>

        <div className="flex">
          <Button href="/lead" variant="primary" size="lg" className="text-body-m!">
            Попробовать бесплатно
          </Button>
        </div>
      </div>
    </section>
  );
}

export default UseCaseHero;
