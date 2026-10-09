import type { Metadata } from "next";

import AcademyLessons from "@/components/academy/AcademyLessons";
import SmbLessonCard from "@/components/academy/SmbLessonCard";
import {
  CourseModules,
  GlassPanel,
  ScenarioList,
  TutorialSteps,
  WebinarList,
} from "@/components/academy/Illustrations";
import Button from "@/components/ui/Button";
import { CarouselNavigation } from "@/components/ui/CarouselControl";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CTA_FALLBACK, CtaBackground } from "@/components/ui/CtaBackground";
import { HeroImage } from "@/components/ui/HeroImage";
import { Icon } from "@/components/ui/Icon";
import { JsonLd } from "@/components/seo/JsonLd";
import { Kicker } from "@/components/ui/Kicker";
import { PAGE_SEO } from "@/content/seo";
import { SMB_COURSE_TITLE, SMB_LESSONS } from "@/content/ai-for-smb";
import { NativeScrollCards } from "@/components/interactive/NativeScrollCards";
import { seoMetadata } from "@/lib/site";
import { asset } from "@/lib/asset";

/**
 * «Академия GigaCowork» — /ai-academy
 *
 * Figma: десктоп 5196:54152 (1440×6200), мобильный 5340:37529 (390×9940).
 *
 * Первый блок «Начните работать с GigaCowork» показывает актуальные ролики
 * из «Исходники Академия/Onboarding»; те же записи доступны на /guides, но
 * здесь они переключаются кнопками тем,
 * а не идут лентой. Список роликов вынесен в общий справочник
 * `src/content/guides.ts`, поэтому обе страницы правятся в одном месте.
 * Сама /guides остаётся доступной; в шапке на эту страницу ведёт пункт
 * «Академия» в разделе «Центр знаний».
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
};

/** «Туториалы» — 5272:83062. */
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
  },
  {
    title: "Анализ клиентской базы",
    text: "Как сегментировать клиентскую базу, выявлять перспективных клиентов и вовремя возвращать неактивных",
  },
  {
    title: "Автоматизация процесса закупок",
    text: "Как оценивать потребности, сравнивать предложения поставщиков и вовремя планировать закупки",
  },
];

type Scenario = {
  title: string;
  text: string;
  preview?: string;
};

/** «Сценарии» — 5196:54344. */
const SCENARIOS: Scenario[] = [
  {
    title: "Юристы",
    text: "Как агент проверяет договор, находит рисковые условия и готовит правки",
  },
  {
    title: "Продажи",
    text: "Как агент ведет сделки по стадиям и подсказывает следующий шаг после звонка",
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

/** Обложка видео сценария. Портрет спикера добавляется через `preview`. */
function ScenarioPreview({ src, title }: { src?: string; title: string }) {
  return (
    <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-16 bg-[#d9e9f2] lg:w-[260px] lg:shrink-0">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={asset(src)}
          alt={`Спикер видео «${title}»`}
          className="absolute inset-0 size-full object-cover"
        />
      ) : (
        <span className="px-16 text-center text-body-m text-text-secondary">
          Превью видео со спикером
        </span>
      )}
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
        центрировано по вертикали.
      */}
      <section className="relative isolate flex min-h-[594px] w-full flex-col justify-center overflow-hidden bg-bg-page pt-[152px] pb-80 md:min-h-[760px] md:pt-[272px] md:pb-96">
        <Breadcrumbs items={[{ label: "Академия" }]} />
        <HeroImage
          desktop="/img/academy/hero.webp"
          mobile="/img/academy/hero-mob.webp"
          className="pointer-events-none absolute inset-0 -z-10 size-full object-cover"
        />
        <div className="container-page flex flex-col items-center text-center md:items-start md:text-left">
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

      {/* ── Курс для малого бизнеса: горизонтальная лента уроков ── */}
      <NativeScrollCards>
        <section
          id="smb-lessons"
          className={`w-full scroll-mt-[calc(var(--header-h)+24px)] py-64 md:py-120 ${COURSES_GRADIENT}`}
        >
          <div className="container-page flex flex-col items-start gap-16">
            <Kicker>Курс</Kicker>
            <h2 className="max-w-[900px] text-h3 font-medium text-text-primary md:text-h2">
              {SMB_COURSE_TITLE}
            </h2>
            <p className="max-w-[740px] text-body-l text-text-secondary">
              Идите по порядку или начните с темы, которая сейчас важнее для
              вашего бизнеса. В каждом уроке есть рабочий пример и задание для
              практики.
            </p>
          </div>
          <ol
            data-cards-track
            aria-label={`Уроки курса «${SMB_COURSE_TITLE}»`}
            className="academy-smb-track no-scrollbar mt-32 flex snap-x snap-mandatory gap-24 overflow-x-auto scroll-smooth py-12 md:mt-48"
          >
            {SMB_LESSONS.map((lesson, index) => (
              <li
                key={lesson.slug}
                className="w-[calc(100vw-72px)] max-w-[320px] shrink-0 snap-start md:w-[380px] md:max-w-none"
              >
                <SmbLessonCard lesson={lesson} index={index} className="min-h-[360px]" />
              </li>
            ))}
          </ol>
          <div className="container-page mt-32 flex items-center justify-center">
            <CarouselNavigation />
          </div>
        </section>
      </NativeScrollCards>

      {/* Временно скрыто до публикации материалов: Форматы обучения (5196:54302). */}
      <section hidden className={`w-full py-64 md:py-96 ${SECTION_GRADIENT}`}>
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
            Панель-иллюстрация стоит между заголовком и описанием и обрезается
            по правому краю карточки. Описание всегда остается под ней.
          */}
          <ul className="grid gap-24 lg:grid-cols-4">
            {FORMATS.map((format) => (
              <li
                key={format.title}
                className={`flex h-[391px] flex-col overflow-hidden rounded-24 p-40 shadow-drop-md ${PROCESS_CARD_GRADIENT}`}
              >
                <h3 className="text-h4 font-medium text-text-primary">
                  {format.title}
                </h3>
                <div className="relative min-h-0 flex-1" aria-hidden>
                  <GlassPanel className="absolute top-24 left-24 w-[446px]">
                    {format.illustration}
                  </GlassPanel>
                </div>
                <p className="relative z-10 text-body-m text-text-secondary">
                  {format.text}
                </p>
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
                className={`flex min-h-[324px] flex-col overflow-hidden rounded-24 px-40 pt-40 pb-24 ${WORKSPACE_CARD_GRADIENT}`}
              >
                <div className="flex flex-col gap-16">
                  <h3 className="text-h3 font-medium text-text-primary">
                    {item.title}
                  </h3>
                  <p className="text-body-l text-text-secondary">{item.text}</p>
                </div>
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
                className={`flex min-h-[400px] flex-col justify-between gap-24 overflow-hidden rounded-24 p-24 lg:min-h-[269px] lg:flex-row lg:items-center lg:px-40 ${SCENARIO_CARD_GRADIENT}`}
              >
                <div className="flex flex-col gap-12 lg:max-w-[216px]">
                  <h3 className="text-h3 font-medium text-text-primary">
                    {scenario.title}
                  </h3>
                  <p className="text-body-l text-text-secondary">
                    {scenario.text}
                  </p>
                </div>
                <ScenarioPreview src={scenario.preview} title={scenario.title} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Временно скрыто до публикации материалов: Вебинары (5272:83179). */}
      <section hidden className="w-full bg-bg-page py-64 md:pt-96 md:pb-120">
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

      {/* Временно скрыто до публикации материалов: Курсы (5284:86310). */}
      <section hidden className={`w-full py-64 md:py-120 ${COURSES_GRADIENT}`}>
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
            <Button href="/ai-academy/ai-for-smb" variant="primary" size="lg">
              Открыть курс для малого бизнеса
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
          {/* Сообщество GigaCowork. */}
          <Button
            href="https://t.me/+r9RKQYQnJ7JlMTli"
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
