import type { Metadata } from "next";

import {
  StickyScenarios,
  type StickyScenario,
} from "@/components/interactive/StickyScenarios";
import Button from "@/components/ui/Button";
import { CTA_FALLBACK, CtaBackground } from "@/components/ui/CtaBackground";
import { HeroImage } from "@/components/ui/HeroImage";
import { Kicker } from "@/components/ui/Kicker";
import { JsonLd } from "@/components/seo/JsonLd";
import { PAGE_SEO } from "@/content/seo";
import { seoMetadata } from "@/lib/site";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

/**
 * «Задачи по расписанию» — /ai-platform/schedule
 *
 * Макеты: desktop 4513:81153 (Schedule / Desktop 1440), mobile 4513:81086.
 * Секции сверху вниз:
 *   Hero          4513:81154 / 4513:81087
 *   How It Works  4515:82799 / 4515:84261   — липкая стопка, как на /agents
 *   How To Add    4513:81217 / 4513:81143
 *   CTA           4513:81225 / 4513:81151
 * Шапка и подвал — общие из src/app/(site)/layout.tsx.
 */

export const metadata: Metadata = seoMetadata(PAGE_SEO.schedule);

/* ──────────────────────────── градиенты из макета ──────────────────────── */

/**
 * Слот превью (4515:84259, 4515:84257, 4515:82843). В макете у всех трёх
 * блоков заливка одна и та же, поэтому массива с разными градиентами тут нет.
 */
const SLOT_GRADIENT =
  "bg-[linear-gradient(48.74deg,#c5f8e5_0.952%,#caf5ff_50.802%,#cfedff_101.64%)]";
/** Заливка номера шага (2925:14881). */
const STEP_NUMBER_GRADIENT =
  "bg-[linear-gradient(90deg,#00b8ca_0%,#1cbbf3_53.96%,#9fb6f8_102.04%)]";

/* ──────────────────────────────── данные ───────────────────────────────── */

/** Блоки «Как это работает» (4515:82803, 4515:82828, 4515:82839). */
const SCENARIOS: StickyScenario[] = [
  {
    image: "/img/schedule/scenario-automate.webp",
    title: <>Задайте периодичность</>,
    body: (
      <p>
        Настройте условия задачи один раз&nbsp;– ИИ выполнит её в&nbsp;указанное
        время и&nbsp;будет повторять до&nbsp;выбранной даты.
      </p>
    ),
    gradient: SLOT_GRADIENT,
  },
  {
    image: "/img/schedule/scenario-routine.webp",
    title: <>Передайте ИИ рутинный процесс</>,
    body: (
      <p>
        Добавляйте к&nbsp;запланированной задаче агента&nbsp;– он использует
        навыки, найдет информацию в&nbsp;корпоративных системах и&nbsp;отправит
        результат в&nbsp;нужный период.
      </p>
    ),
    gradient: SLOT_GRADIENT,
  },
  {
    image: "/img/schedule/scenario-join.webp",
    title: (
      <>
        Подключайтесь, <br className="hidden lg:inline" />
        если это необходимо
      </>
    ),
    body: (
      <p>
        В&nbsp;задачах, где требуется решение сотрудника, агент запросит
        подтверждение и&nbsp;продолжит работу после получения ответа.
      </p>
    ),
    gradient: SLOT_GRADIENT,
  },
];

/** Шаги «Настройка расписания» (4513:81221). */
const STEPS: { number: string; title: string; text: React.ReactNode }[] = [
  {
    number: "01",
    title: "Опишите задачу",
    text: (
      <>
        Перейдите в&nbsp;раздел «Регулярные задачи». Укажите название, например
        «Ежедневный отчёт», и&nbsp;добавьте инструкцию. Подключите агента.
      </>
    ),
  },
  {
    number: "02",
    title: "Настройте расписание",
    text: (
      <>
        Выберите периодичность: каждый день, неделю или&nbsp;месяц. Установите
        время и&nbsp;уточните частоту повторений&nbsp;– всегда
        или&nbsp;до&nbsp;определенной даты.
      </>
    ),
  },
  {
    number: "03",
    title: "Получайте результат",
    text: (
      <>Созданная задача запустится автоматически в&nbsp;указанный период.</>
    ),
  },
];

/* ─────────────────────────────── страница ──────────────────────────────── */

export default function SchedulePage() {
  return (
    <>
      <JsonLd data={PAGE_SEO.schedule.jsonLd!} />

      {/*
        ── Hero (4513:81154 / 4513:81087) ──

        Фон — растр на всю секцию, два кадра: 2880×1520 (2× фрейма 1440×760)
        и 780×928 (2× фрейма 390×464).
      */}
      <section className="relative isolate flex min-h-[464px] w-full flex-col justify-center overflow-hidden bg-bg-page pt-[152px] pb-[80px] md:min-h-[760px] md:pt-[180px] md:pb-120">
        <Breadcrumbs items={[{ label: "Задачи по\u00A0расписанию" }]} />
        {/*
          Кадр показывается как есть, без подгонки композиции: ни приближения,
          ни сдвига точки кадрирования. Прежний кадр приходилось приближать от
          правого верхнего угла — у него по левой части шло вертикальное ребро
          стеклянной формы, и на широких окнах оно попадало прямо на логотип.
          В новом кадре этого ребра нет, подпорка больше не нужна.

          `object-cover` — не масштабирование композиции, а способ растянуть
          фон на всю секцию. На ширине макета он ничего не меняет: файлы
          выгружены ровно в два фрейма (2880×1520 при секции 1440×760 и
          780×928 при 390×464), так что кадр ложится один в один.
        */}
        <HeroImage
          desktop="/img/schedule/hero.webp"
          mobile="/img/schedule/hero-mob.webp"
          className="pointer-events-none absolute inset-0 -z-10 size-full object-cover"
        />
        <div className="container-page flex flex-col items-center gap-32 text-center md:items-start md:gap-40 md:text-left">
          <div className="flex flex-col gap-16 md:max-w-[720px] md:gap-24">
            <h1 className="text-h2 font-medium text-text-primary md:text-h1">
              Создавайте задачи <br className="hidden md:inline" />
              по&nbsp;расписанию
            </h1>
            <p className="text-body-l text-text-secondary">
              Делегируйте ИИ выполнение задач по&nbsp;графику:{" "}
              <br className="hidden md:inline" />
              ежедневно, еженедельно или&nbsp;ежемесячно.
            </p>
          </div>
          <Button
            href="/lead"
            variant="primary"
            size="lg"
            className="w-[230px] text-body-m! md:w-auto"
          >
            Попробовать бесплатно
          </Button>
        </div>
      </section>

      {/* ── How It Works (4515:82799 / 4515:84261) ── */}
      <section className="w-full bg-bg-page py-120">
        <div className="container-page flex flex-col gap-48 md:gap-80">
          <div className="flex flex-col gap-12 md:gap-16">
            <Kicker>Как это работает</Kicker>
            <h2 className="text-h3 font-medium text-text-primary md:text-h2">
              Автоматизируйте <br className="hidden md:inline" />
              типовые сценарии
            </h2>
          </div>
          <StickyScenarios items={SCENARIOS} />
        </div>
      </section>

      {/*
        ── How To Add (4513:81217 / 4513:81143) ──

        Заголовок оставлен ровно как в макете (4513:81220). В самом макете он,
        судя по всему, не переписан после шаблона страницы «Навыки»: кикер
        говорит про расписание, а заголовок — про навык. Меняем только вместе
        с макетом.
      */}
      <section className="w-full bg-bg-page py-64 md:py-96">
        <div className="container-page flex flex-col gap-16">
          <Kicker>Настройка расписания</Kicker>
          <h2 className="text-h3 font-medium text-text-primary md:text-h2">
            Как добавить навык <br className="hidden md:inline" />
            ИИ-агенту
          </h2>
          <div className="mt-24 flex flex-col gap-32 md:grid md:grid-cols-3 md:gap-24">
            {STEPS.map((step) => (
              <div key={step.number} className="flex flex-col gap-16">
                <span
                  aria-hidden
                  className={`w-fit bg-clip-text text-h1 font-medium text-transparent ${STEP_NUMBER_GRADIENT}`}
                >
                  {step.number}
                </span>
                <div className="flex flex-col gap-8">
                  <h3 className="text-h3 font-medium text-text-primary">
                    {step.title}
                  </h3>
                  <p className="text-body-l text-text-secondary">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA (4513:81225 / 4513:81151) ── */}
      <section
        className={`relative isolate w-full overflow-hidden py-64 md:py-160 ${CTA_FALLBACK}`}
      >
        <CtaBackground />
        <div className="container-page flex flex-col items-center gap-40">
          <h2 className="max-w-[522px] text-center text-h3 font-medium text-text-primary md:text-h2">
            Готовы делегировать задачи ИИ-агентам?
          </h2>
          <Button
            href="/lead"
            variant="primary"
            size="lg"
            className="text-body-m!"
          >
            Попробовать бесплатно
          </Button>
        </div>
      </section>
    </>
  );
}
