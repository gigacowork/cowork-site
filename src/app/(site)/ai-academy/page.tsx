import type { Metadata } from "next";

import AcademyLessons from "@/components/academy/AcademyLessons";
import {
  ContractReview,
  CourseModules,
  DealStages,
  GlassPanel,
  ScenarioList,
  TutorialSteps,
  WebinarList,
} from "@/components/academy/Illustrations";
import Button from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CTA_FALLBACK, CtaBackground } from "@/components/ui/CtaBackground";
import { HeroImage } from "@/components/ui/HeroImage";
import { Icon } from "@/components/ui/Icon";
import { JsonLd } from "@/components/seo/JsonLd";
import { Kicker } from "@/components/ui/Kicker";
import { PAGE_SEO } from "@/content/seo";
import { seoMetadata } from "@/lib/site";

/**
 * «Академия GigaCowork» — /ai-academy
 *
 * Figma: десктоп 5196:54152 (1440×6200), мобильный 5340:37529 (390×9940).
 *
 * Страница собрана из «Обучающих видео» (/guides): первый блок «Начните
 * работать с GigaCowork» — те же ролики, только переключаются кнопками тем,
 * а не идут лентой. Список роликов вынесен в общий справочник
 * `src/content/guides.ts`, поэтому обе страницы правятся в одном месте.
 * Сама /guides остаётся как была — навигацию на «Академию» переключаем
 * отдельно, когда раздел будет наполнен.
 *
 * Иллюстрации в карточках — не картинки, а разметка: см.
 * `src/components/academy/Illustrations.tsx`.
 *
 * Крошек в макете нет, но они есть на всех остальных страницах сайта и в
 * микроразметке — поэтому стоят и здесь, абсолютом под шапкой, как на
 * «Безопасности».
 */

export const metadata: Metadata = seoMetadata(PAGE_SEO.aiAcademy);

/* ──────────────────────────────── градиенты ────────────────────────────── */

/** Фон секций «Форматы обучения» и «Курсы» — Gradient/Omni/Neuton 2. */
const SECTION_GRADIENT =
  "bg-[linear-gradient(206.5deg,#d4e2ff_10.994%,#b3ebf6_79.923%,#b3f6e1_101.64%)]";
const COURSES_GRADIENT =
  "bg-[linear-gradient(198.41deg,#d4e2ff_10.994%,#b3ebf6_79.923%,#b3f6e1_101.64%)]";

/** Карточка формата обучения — Gradient/Omni/Blue_light (5265:82951). */
const PROCESS_CARD_GRADIENT =
  "bg-[linear-gradient(227.17deg,#edf6ff_10.474%,#d4eeef_94.872%)]";
/** Карточка туториала — Gradient/Omni/Neuton_Light_3 (5272:83063). */
const WORKSPACE_CARD_GRADIENT =
  "bg-[linear-gradient(54.73deg,#c5f8e5_0.952%,#dcf9ff_50.802%,#e4f5ff_101.64%)]";
/** Карточка сценария — тот же Blue_light под другим углом (5196:54345). */
const SCENARIO_CARD_GRADIENT =
  "bg-[linear-gradient(199.59deg,#edf6ff_10.474%,#d4eeef_94.872%)]";

/* ──────────────────────────────── данные ───────────────────────────────── */

type Format = {
  title: string;
  text: string;
  illustration: React.ReactNode;
};

/** «Форматы обучения» — 5196:54308. */
const FORMATS: Format[] = [
  {
    title: "Туториалы",
    text: "Повторяйте простые действия шаг за шагом и знакомьтесь с широкими возможностями GigaCowork",
    illustration: <TutorialSteps />,
  },
  {
    title: "Сценарии",
    text: "Смотрите, как сотрудники разных отделов решают свои повседневные задачи с помощью GigaCowork",
    illustration: <ScenarioList />,
  },
  {
    title: "Вебинары",
    text: "Разбирайте отдельные темы и возможности продукта, задавайте вопросы экспертам",
    illustration: <WebinarList />,
  },
  {
    title: "Курсы",
    text: "Последовательно осваивайте GigaCowork: от базовых возможностей до комплексных рабочих процессов",
    illustration: <CourseModules modules={2} />,
  },
];

type Tutorial = {
  title: React.ReactNode;
  text: string;
  tags: { label: string; icon: string }[];
};

/**
 * «Туториалы» — 5272:83062.
 *
 * Иконки на тегах взяты ближайшие из набора проекта: в макете стоят
 * user-check, mail, sliders и Return, а выгрузить их из Figma нечем —
 * доступа к файлу у сборки нет. Когда иконки появятся в public/img/icons,
 * поменять нужно будет только строки ниже.
 */
const TUTORIALS: Tutorial[] = [
  {
    title: (
      <>
        Скоринг
        <br />
        кандидатов
      </>
    ),
    text: "Как автоматически определить наиболее подходящего кандидата и направить приглашение на интервью",
    tags: [
      { label: "Оценка кандидатов", icon: "user" },
      { label: "Приглашение на интервью", icon: "messages-square" },
    ],
  },
  {
    title: "Анализ клиентской базы",
    text: "Как сегментировать клиентскую базу, выявлять перспективных клиентов и вовремя возвращать неактивных",
    tags: [
      { label: "Сегментация клиентов", icon: "sliders" },
      { label: "Возврат клиентов", icon: "history" },
    ],
  },
  {
    title: "Автоматизация процесса закупок",
    text: "Как оценивать потребности, сравнивать предложения поставщиков и вовремя планировать закупки",
    tags: [
      { label: "Анализ потребностей", icon: "analitics" },
      { label: "Выбор поставщика", icon: "supplier" },
    ],
  },
];

type Scenario = {
  title: string;
  text: string;
  illustration: React.ReactNode;
};

/** «Сценарии» — 5196:54344. */
const SCENARIOS: Scenario[] = [
  {
    title: "Юристы",
    text: "Как агент проверяет договор, находит рисковые условия и готовит правки",
    illustration: <ContractReview />,
  },
  {
    title: "Продажи",
    text: "Как агент ведет сделки по стадиям и подсказывает следующий шаг после звонка",
    illustration: <DealStages />,
  },
];

/** «Вебинары» — 5272:83185. У каждой карточки свой градиент из макета. */
const WEBINARS: { title: React.ReactNode; gradient: string }[] = [
  {
    title: (
      <>
        ИИ-агенты для&nbsp;бизнеса: <br className="hidden md:block" />
        теория и&nbsp;практика
      </>
    ),
    gradient:
      "bg-[linear-gradient(57.37deg,#a6fddc_0.952%,#b1f1ff_50.802%,#cfe7ff_101.64%)]",
  },
  {
    title: (
      <>
        Будущее автономных <br className="hidden md:block" />
        ИИ-агентов в&nbsp;бизнесе
      </>
    ),
    gradient:
      "bg-[linear-gradient(57.37deg,#c5f8e5_0.952%,#caf5ff_50.802%,#cfedff_101.64%)]",
  },
  {
    title: (
      <>
        ИИ в&nbsp;кибербезопасности: <br className="hidden md:block" />
        как технологии меняют работу SOC
      </>
    ),
    gradient:
      "bg-[linear-gradient(57.37deg,#c5f8e5_0.952%,#dcf9ff_50.802%,#e4f5ff_101.64%)]",
  },
];

/* ─────────────────────────────── кусочки ───────────────────────────────── */

/** Заголовок секции: H3 → H2 и подпись Body/L, как на остальных страницах. */
function SectionHeader({
  kicker,
  title,
  text,
}: {
  kicker?: string;
  title: React.ReactNode;
  text: React.ReactNode;
}) {
  return (
    <header className="flex flex-col gap-16">
      {kicker ? <Kicker>{kicker}</Kicker> : null}
      <h2 className="text-h3 font-medium text-text-primary md:text-h2">
        {title}
      </h2>
      <p className="text-body-l text-text-primary">{text}</p>
    </header>
  );
}

/** Тег с иконкой — Tag 1388:5966, тот же, что на карточках кейсов. */
function Tag({ label, icon }: { label: string; icon: string }) {
  return (
    <li className="flex shrink-0 items-center justify-center gap-4 rounded-full bg-bg-tag p-8">
      <Icon
        src={`/img/icons/${icon}.svg`}
        className="size-[24px] text-icon-primary"
      />
      <span className="text-caption text-text-primary">{label}</span>
    </li>
  );
}

/**
 * Превью записи вебинара — Media / Video (5272:86262).
 *
 * Записей пока нет, поэтому в карточке стоит та же заглушка, что в макете:
 * белое поле с кнопкой воспроизведения. Кнопка белая на белом и держится
 * только на тени.
 */
function VideoPlaceholder() {
  return (
    <div className="flex h-[180px] w-full items-center justify-center overflow-hidden rounded-12 bg-bg-page px-32 py-16 shadow-drop-lg">
      <span className="flex size-[64px] items-center justify-center rounded-full border border-bg-card bg-neutral-0 shadow-drop-sm backdrop-blur-[6px]">
        <Icon
          src="/img/icons/play.svg"
          className="size-[48px] text-icon-primary"
        />
      </span>
    </div>
  );
}

/* ─────────────────────────────── страница ──────────────────────────────── */

export default function AiAcademyPage() {
  return (
    <>
      <JsonLd data={PAGE_SEO.aiAcademy.jsonLd!} />

      {/* ── Hero (5196:54153 / 5340:37530) ── */}
      {/*
        Высоты из макета: 594 на телефоне и 760 на десктопе. Содержимое
        центрировано по вертикали — запас высоты иначе собрался бы пустотой
        под кнопками.
      */}
      <section className="relative isolate flex min-h-[594px] w-full flex-col justify-center overflow-hidden bg-bg-page pt-[152px] pb-80 md:min-h-[760px] md:pt-[272px] md:pb-96">
        <Breadcrumbs items={[{ label: "Академия" }]} />
        <HeroImage
          desktop="/img/academy/hero.webp"
          mobile="/img/academy/hero-mob.webp"
          className="pointer-events-none absolute inset-0 -z-10 size-full object-cover"
        />
        <div className="container-page flex flex-col items-center gap-32 text-center md:items-start md:text-left">
          <div className="flex flex-col gap-16 md:gap-24">
            {/*
              Кегль H1 (48) и на телефоне: в мобильном макете заголовок такой
              же, как на десктопе, — 116 против 224 высоты всего блока. Ниже md
              на остальных страницах сайта H1 обычно падает до H2, здесь нет.
            */}
            <h1 className="text-h1 font-medium text-text-primary">
              Академия GigaCowork
            </h1>
            <div className="flex flex-col gap-16 text-body-l text-text-secondary">
              <p>От&nbsp;первых шагов к&nbsp;уверенной работе с&nbsp;ИИ</p>
              <p>
                Короткие инструкции, практические видео и&nbsp;реальные сценарии
                использования <br className="hidden md:block" />
                GigaCowork сотрудниками разных отделов
              </p>
            </div>
          </div>
          {/*
            Обе кнопки ведут внутрь страницы: продукт показывают ролики в
            блоке ниже, а задачи разобраны в «Туториалах». Внешних адресов
            для них в макете не задано.
          */}
          <div className="flex w-full flex-col items-center gap-24 md:w-auto md:flex-row md:items-start md:gap-16">
            <Button
              href="#start"
              variant="primary"
              size="lg"
              className="w-[230px] md:w-auto"
            >
              Познакомиться с&nbsp;продуктом
            </Button>
            <Button
              href="#tutorials"
              variant="secondary"
              size="lg"
              className="w-[230px] md:w-auto"
            >
              Выбрать задачу
            </Button>
          </div>
        </div>
      </section>

      {/* ── Начните работать с GigaCowork (5196:54292) ── */}
      <section
        id="start"
        className="w-full scroll-mt-[calc(var(--header-h)+24px)] bg-bg-page py-64 md:py-120"
      >
        <div className="container-page">
          <SectionHeader
            kicker="Обучение"
            title={<>Начните работать с&nbsp;GigaCowork</>}
            text={
              <>
                Короткие видео помогут разобраться в&nbsp;основных возможностях
                платформы <br className="hidden md:block" />и&nbsp;покажут, как
                делегировать задачи ИИ-агентам
              </>
            }
          />
        </div>
        <div className="mt-32 md:mt-64">
          <AcademyLessons />
        </div>
      </section>

      {/* ── Форматы обучения (5196:54302) ── */}
      <section className={`w-full py-64 md:py-96 ${SECTION_GRADIENT}`}>
        <div className="container-page flex flex-col gap-32 md:gap-48">
          <SectionHeader
            kicker="Форматы обучения"
            title={
              <>
                Изучайте возможности GigaCowork{" "}
                <br className="hidden md:block" />
                на&nbsp;практических примерах
              </>
            }
            text={
              <>
                Короткие пошаговые видео, вебинары и&nbsp;целые курсы помогут
                разобраться <br className="hidden md:block" />в&nbsp;продукте
                и&nbsp;использовать его в&nbsp;повседневных рабочих задачах
              </>
            }
          />
          {/*
            Высота карточки фиксирована (391 в макете), а панель-иллюстрация
            стоит абсолютом и уезжает за правый край — обрезает её карточка.
            Позиция у панели одна на оба размера экрана: в макете она тоже не
            меняется, меняется только ширина карточки.
          */}
          <ul className="grid gap-24 lg:grid-cols-4">
            {FORMATS.map((format) => (
              <li
                key={format.title}
                className={`relative flex h-[391px] flex-col gap-24 overflow-hidden rounded-24 p-40 shadow-drop-md ${PROCESS_CARD_GRADIENT}`}
              >
                <div className="flex flex-col gap-16">
                  <h3 className="text-h4 font-medium text-text-primary">
                    {format.title}
                  </h3>
                  <p className="text-body-m text-text-secondary">
                    {format.text}
                  </p>
                </div>
                <GlassPanel className="absolute top-[199px] left-[62px] w-[446px]">
                  {format.illustration}
                </GlassPanel>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Туториалы (5196:54326) ── */}
      <section
        id="tutorials"
        className="w-full scroll-mt-[calc(var(--header-h)+24px)] bg-bg-page py-64 md:py-96"
      >
        <div className="container-page flex flex-col gap-32 md:gap-48">
          <SectionHeader
            title="Туториалы"
            text={
              <>
                Разбирайтесь в&nbsp;широких возможностях продукта{" "}
                <br className="hidden md:block" />
                с&nbsp;помощью коротких видео и&nbsp;понятных пошаговых
                инструкций
              </>
            }
          />
          <ul className="grid gap-24 lg:grid-cols-3">
            {TUTORIALS.map((item) => (
              <li
                key={item.text}
                className={`flex min-h-[324px] flex-col justify-between gap-24 overflow-hidden rounded-24 px-40 pt-40 pb-24 ${WORKSPACE_CARD_GRADIENT}`}
              >
                <div className="flex flex-col gap-16">
                  <h3 className="text-h3 font-medium text-text-primary">
                    {item.title}
                  </h3>
                  <p className="text-body-l text-text-secondary">{item.text}</p>
                </div>
                <ul className="flex flex-wrap gap-8">
                  {item.tags.map((tag) => (
                    <Tag key={tag.label} label={tag.label} icon={tag.icon} />
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Сценарии (5196:54338) ── */}
      <section className="w-full bg-bg-page py-64 md:py-96">
        <div className="container-page flex flex-col gap-32 md:gap-48">
          <SectionHeader
            title="Сценарии"
            text={
              <>
                Разбирайте реальные рабочие ситуации{" "}
                <br className="hidden md:block" />
                и&nbsp;применяйте готовые подходы в&nbsp;повседневных задачах
              </>
            }
          />
          <ul className="grid gap-24 lg:grid-cols-2">
            {SCENARIOS.map((scenario) => (
              <li
                key={scenario.title}
                className={`relative flex h-[400px] flex-col gap-16 overflow-hidden rounded-24 p-24 lg:h-[269px] lg:px-40 ${SCENARIO_CARD_GRADIENT}`}
              >
                <div className="flex flex-col gap-12 lg:max-w-[216px]">
                  <h3 className="text-h3 font-medium text-text-primary">
                    {scenario.title}
                  </h3>
                  <p className="text-body-l text-text-secondary">
                    {scenario.text}
                  </p>
                </div>
                {/*
                  Панель увеличена ровно в 1.3 раза (15.6 = 12 × 1.3) — так в
                  макете: в карточке сценария интерфейс крупнее, чем в
                  карточках форматов.
                */}
                {/*
                  Панель стоит от левого края на телефоне (48 в макете) и от
                  правого на десктопе (−48): карточка на телефоне у́же самой
                  панели, и от правого края она уехала бы за экран целиком.
                */}
                <GlassPanel
                  size={15.6}
                  className="absolute bottom-[23px] left-48 w-[364px] lg:right-[-48px] lg:bottom-[14px] lg:left-auto"
                >
                  {scenario.illustration}
                </GlassPanel>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Вебинары (5272:83179) ── */}
      <section className="w-full bg-bg-page py-64 md:pt-96 md:pb-120">
        <div className="container-page flex flex-col gap-32 md:gap-48">
          <SectionHeader
            title="Вебинары"
            text={
              <>
                Разбирайтесь в&nbsp;тонкостях работы, обсуждайте реальные кейсы{" "}
                <br className="hidden md:block" />
                и&nbsp;находите решения вместе с&nbsp;экспертами
              </>
            }
          />
          <ul className="grid gap-24 lg:grid-cols-3">
            {WEBINARS.map((webinar, index) => (
              <li
                key={index}
                className={`flex min-h-[358px] flex-col gap-24 rounded-24 border border-border-subtle p-32 shadow-elevation-xs ${webinar.gradient}`}
              >
                <VideoPlaceholder />
                <h3 className="text-h4 font-medium text-text-primary">
                  {webinar.title}
                </h3>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Курсы (5284:86310) ── */}
      <section className={`w-full py-64 md:py-120 ${COURSES_GRADIENT}`}>
        <div className="container-page flex flex-col gap-40 lg:flex-row lg:items-start lg:justify-between lg:gap-80">
          {/*
            Колонка текста сжимается: 480 из макета плюс панель 425 и зазор 80
            не помещаются в контейнер до 1440, и строка выезжала за экран.
            Сверху ширина по-прежнему ограничена макетом.
          */}
          <div className="flex flex-col items-start gap-24 lg:max-w-[480px] lg:flex-1">
            <h2 className="text-h3 font-medium text-text-primary md:text-h2">
              Курсы
            </h2>
            <p className="text-body-l text-text-secondary">
              Изучайте материалы, собранные экспертами, поэтапно, практикуйтесь
              и&nbsp;развивайте навыки работы с&nbsp;продуктом.
            </p>
            {/*
              Отдельной страницы у курсов пока нет — кнопка ведёт на форму
              заявки, там и оставляют контакт, чтобы узнать о запуске.
            */}
            <Button href="/lead" variant="primary" size="lg">
              Узнать о&nbsp;запуске
            </Button>
          </div>
          <GlassPanel className="w-full shadow-[0_52px_45px_-8px_#60738f33] lg:w-[425px] lg:shrink-0">
            <CourseModules wide />
          </GlassPanel>
        </div>
      </section>

      {/* ── CTA (5412:38152) ── */}
      <section
        className={`relative isolate w-full overflow-hidden py-64 md:py-160 ${CTA_FALLBACK}`}
      >
        <CtaBackground variant="slab" />
        <div className="container-page flex flex-col items-center gap-40">
          <div className="flex max-w-[588px] flex-col items-center gap-32 text-center">
            <h2 className="text-h3 font-medium text-text-primary md:text-h2">
              Не&nbsp;нашли нужный материал?
            </h2>
            <p className="text-body-l text-text-primary">
              Вступайте в&nbsp;сообщество GigaCowork. Делитесь опытом,
              общайтесь <br className="hidden md:block" />с&nbsp;экспертами
              и&nbsp;находите новые идеи для&nbsp;работы с&nbsp;GigaCowork.
            </p>
          </div>
          {/* Сообщество — тот же телеграм-канал, что в подвале сайта. */}
          <Button
            href="https://t.me/GenAIeffect"
            variant="primary"
            size="lg"
            target="_blank"
            rel="noopener noreferrer"
          >
            Вступить в&nbsp;сообщество
          </Button>
        </div>
      </section>
    </>
  );
}
