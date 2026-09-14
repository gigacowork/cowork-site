import type { Metadata } from "next";

import {
  StickyScenarios,
  type StickyScenario,
} from "@/components/interactive/StickyScenarios";
import Button from "@/components/ui/Button";
import { CTA_FALLBACK, CtaBackground } from "@/components/ui/CtaBackground";
import { HeroImage } from "@/components/ui/HeroImage";
import { Kicker } from "@/components/ui/Kicker";
import { pageMetadata } from "@/lib/site";

/**
 * «Быстрые команды» — /ai-platform/quick-commands
 *
 * Макеты: desktop 4530:93092 (Commands / Desktop 1440), mobile 4530:93052.
 * Секции сверху вниз:
 *   Hero          4530:93093 / 4530:93053
 *   How It Works  4530:93106 / 4530:93062   — липкая стопка, как на /agents
 *   How To Add    4530:93163 / 4530:93082
 *   CTA           4530:93171 / 4530:93090
 * Шапка и подвал — общие из src/app/(site)/layout.tsx.
 */

export const metadata: Metadata = pageMetadata({
  title: "Быстрые команды — GigaCowork",
  description:
    "Быстрые команды GigaCowork — часто используемые промпты, сохранённые один раз: весь контекст задачи в инструкции команды, единый сценарий для всех сотрудников и запуск в одну кнопку.",
  path: "/ai-platform/quick-commands/",
});

/* ──────────────────────────── градиенты из макета ──────────────────────── */

/**
 * Слот превью (4530:93114, 4530:93120, 4530:93125). Заливка у всех трёх
 * блоков одинаковая — в макете разных градиентов тут нет.
 */
const SLOT_GRADIENT =
  "bg-[linear-gradient(48.74deg,#c5f8e5_0.952%,#caf5ff_50.802%,#cfedff_101.64%)]";
/** Заливка номера шага (2925:14881). */
const STEP_NUMBER_GRADIENT =
  "bg-[linear-gradient(90deg,#00b8ca_0%,#1cbbf3_53.96%,#9fb6f8_102.04%)]";

/* ──────────────────────────────── данные ───────────────────────────────── */

/** Блоки «Как это работает» (4530:93110, 4530:93115, 4530:93121). */
const SCENARIOS: StickyScenario[] = [
  {
    image: "/img/quick-commands/scenario-repeat.webp",
    title: (
      <>
        Не объясняйте одну <br className="hidden lg:inline" />и ту&nbsp;же
        задачу ИИ
      </>
    ),
    body: (
      <p>
        Сохраните запрос как быструю команду и&nbsp;используйте ее
        для&nbsp;быстрого старта.
      </p>
    ),
    gradient: SLOT_GRADIENT,
  },
  {
    image: "/img/quick-commands/scenario-context.webp",
    title: <>Весь контекст в&nbsp;одной команде</>,
    body: (
      <p>
        Какие данные запросить, из&nbsp;каких систем и&nbsp;по&nbsp;какому
        шаблону&nbsp;– все задается в&nbsp;инструкции команды. Одна быстрая
        настройка&nbsp;– и&nbsp;она готова к&nbsp;работе.
      </p>
    ),
    gradient: SLOT_GRADIENT,
  },
  {
    image: "/img/quick-commands/scenario-shared.webp",
    title: (
      <>
        Единый сценарий <br className="hidden lg:inline" />
        для&nbsp;всех сотрудников
      </>
    ),
    body: (
      <p>
        Команды помогают выполнять регулярные задачи единообразно&nbsp;– без
        различий в&nbsp;формулировках и&nbsp;качестве результата.
      </p>
    ),
    gradient: SLOT_GRADIENT,
  },
];

/** Шаги «Настройка команды» (4530:93167). */
const STEPS: {
  number: string;
  title: React.ReactNode;
  text: React.ReactNode;
}[] = [
  {
    number: "01",
    title: (
      <>
        Поставьте задачу <br className="hidden md:inline" />в чате
      </>
    ),
    text: (
      <>
        Пропишите запрос и&nbsp;оцените выполнение задачи ИИ.
        При&nbsp;необходимости скорректируйте промпт.
      </>
    ),
  },
  {
    number: "02",
    title: <>Сохраните команду</>,
    text: (
      <>
        В&nbsp;разделе «Команды» выберите «Создать команду»&nbsp;– напишите
        название, описание и&nbsp;инструкцию-промпт для&nbsp;её активации.
      </>
    ),
  },
  {
    number: "03",
    title: <>Используйте в&nbsp;типовых сценариях</>,
    text: (
      <>
        Введите в&nbsp;чате «/» или&nbsp;выберите команду из&nbsp;списка. Агент
        мгновенно приступит к&nbsp;выполнению запроса.
      </>
    ),
  },
];

/* ─────────────────────────────── страница ──────────────────────────────── */

export default function QuickCommandsPage() {
  return (
    <>
      {/*
        ── Hero (4530:93093 / 4530:93053) ──

        Фон — растр на всю секцию, два кадра: 2880×1520 (2× фрейма 1440×760)
        и 780×928 (2× фрейма 390×464).
      */}
      <section className="relative isolate flex min-h-[464px] w-full flex-col justify-center overflow-hidden bg-bg-page pt-[152px] pb-[80px] md:min-h-[760px] md:pt-[180px] md:pb-120">
        <HeroImage
          desktop="/img/quick-commands/hero.webp"
          mobile="/img/quick-commands/hero-mob.webp"
          className="pointer-events-none absolute inset-0 -z-10 size-full object-cover"
        />
        <div className="container-page flex flex-col items-center gap-32 text-center md:items-start md:gap-40 md:text-left">
          <div className="flex flex-col gap-16 md:max-w-[720px] md:gap-24">
            <h1 className="text-h2 font-medium text-text-primary md:text-h1">
              Запускайте задачи <br className="hidden md:inline" />
              одной кнопкой
            </h1>
            <p className="text-body-l text-text-secondary">
              Создавайте команды&nbsp;– часто используемые промпты
              для&nbsp;старта <br className="hidden md:inline" />
              выполнения задач. Экономьте время на&nbsp;типовых сценариях.
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

      {/*
        ── How It Works (4530:93106 / 4530:93062) ──

        В макете у секции только кикер — заголовка H2 нет (4530:93107).
      */}
      <section className="w-full bg-bg-page py-120">
        <div className="container-page flex flex-col gap-48 md:gap-80">
          <Kicker>Как это работает</Kicker>
          <StickyScenarios items={SCENARIOS} />
        </div>
      </section>

      {/* ── How To Add (4530:93163 / 4530:93082) ── */}
      <section className="w-full bg-bg-page py-64 md:py-96">
        <div className="container-page flex flex-col gap-16">
          <Kicker>Настройка команды</Kicker>
          <h2 className="text-h3 font-medium text-text-primary md:text-h2">
            Как создать первую команду
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

      {/* ── CTA (4530:93171 / 4530:93090) ── */}
      <section
        className={`relative isolate w-full overflow-hidden py-64 md:py-160 ${CTA_FALLBACK}`}
      >
        <CtaBackground variant="slab" />
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
