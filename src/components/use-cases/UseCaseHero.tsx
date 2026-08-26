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
  introWidth = "calc(var(--container-page) / 2)",
  image,
  imageMobile,
  textBlur = false,
}: {
  title: string;
  intro: string[];
  /** Ширина колонки подзаголовка от md и выше. */
  introWidth?: string;
  image?: string;
  /** Свой кадр ниже md: у мобильной версии другая пропорция (1170×1680). */
  imageMobile?: string;
  /** Приглушить фон под текстовой колонкой (см. `heroTextBlur` в use-cases). */
  textBlur?: boolean;
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

      {/*
        Размытие фона под текстом.

        Слой лежит на том же `-z-10`, но ниже картинки по разметке — значит,
        рисуется поверх неё, а `backdrop-filter` размывает всё, что под ним, то
        есть саму картинку. Контент секции идёт следующим и остаётся резким.

        Маска очерчивает не прямоугольник, а мягкое пятно: за её пределами
        кадр не тронут. От md полоса идёт слева, под текстовой колонкой (она
        занимает половину контейнера), и сходит на нет к середине. Ниже md
        текст во всю ширину, поэтому там маска вертикальная: гасится к верхнему
        и нижнему краям экрана.

        Радиус 14: грань стекла под строками уходит совсем, но кадр не
        превращается в ровное пятно — фактура и общий рисунок ещё читаются.
      */}
      {image && textBlur ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 backdrop-blur-[14px] [mask-image:linear-gradient(to_bottom,transparent_6%,black_20%,black_76%,transparent_94%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_6%,black_20%,black_76%,transparent_94%)] md:[mask-image:linear-gradient(to_right,black_0%,black_38%,transparent_68%)] md:[-webkit-mask-image:linear-gradient(to_right,black_0%,black_38%,transparent_68%)]"
        />
      ) : null}

      {/*
        В макете ниже md hero стоял по центру — по просьбе выключка левая на
        всех ширинах, как и у остального текста вне карточек на страницах
        «Для кого». Кнопка едет вместе с текстом.
      */}
      <div className="container-page flex flex-col items-start gap-32 text-left md:gap-40">
        <div className="flex flex-col gap-48 md:gap-24">
          <h1 className="text-h2 font-medium text-text-primary md:max-w-[720px] md:text-h1">
            <Lines text={title} />
          </h1>
          {/*
            Ширина колонки — половина контейнера, 600 при 1200. В макете
            было 491, но на этой ширине подзаголовки почти у всех ролей
            заканчивались короткими огрызками строк. Роль может задать свою
            ширину полем `introWidth`.
            Через переменную, а не инлайновым `max-width`: ограничение нужно
            только от md, ниже колонка всегда во всю ширину, а инлайновый
            стиль медиазапросу не подчинить.

            `text-wrap: pretty` — против висячих строк: браузер сам не даёт
            последней строке абзаца остаться в одно слово, перекидывая на неё
            слово из предыдущей. Правило поддерживают не все браузеры, в
            остальных текст просто верстается как раньше.

            У переменной есть запасное значение: если она почему-то не
            доедет, колонка встанет на 600, а не растянется во всю ширину.
          */}
          <p
            style={{ "--intro-w": introWidth } as React.CSSProperties}
            className="text-body-l text-text-secondary [text-wrap:pretty] md:max-w-[var(--intro-w,600px)]"
          >
            <Paragraphs items={intro} />
          </p>
        </div>

        <div className="flex">
          <Button
            href="/lead"
            variant="primary"
            size="lg"
            className="text-body-m!"
          >
            Попробовать бесплатно
          </Button>
        </div>
      </div>
    </section>
  );
}

export default UseCaseHero;
