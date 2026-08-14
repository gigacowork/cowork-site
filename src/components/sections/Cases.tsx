import Image from "next/image";
import { Icon } from "@/components/ui/Icon";

/**
 * Cases — «Опыт клиентов»
 * Figma desktop: 1927:15614 (Clients — p 80, gap 48, header row 1196, case row 1198 / gap 24,
 *                            карточки 486 + 332 + 332, высота 504)
 * Figma mobile:  1927:17417 (Clients — px 16 / py 64, gap 32, header row в колонку,
 *                            карточки 358 в столбик, gap 16)
 */

type CaseTag = {
  label: string;
  /** имя иконки в Figma (Icon=<name>) — ассет ещё не выгружен */
  icon: string;
};

type CaseStudy = {
  /** имя слоя Figma: "Card / Case Study · <company>" */
  company: string;
  metric: string;
  metricCaption: string;
  description: string;
  logo: { src: string; width: number; height: number; className: string };
  tags: [CaseTag, CaseTag];
  /** mobile — общий градиент; md: собственный угол из Figma */
  gradientClassName: string;
};

const CASES: CaseStudy[] = [
  {
    company: "ФосАгро",
    metric: "-93%",
    metricCaption: "сокращение времени на поиск кандидата",
    description:
      "ИИ-агент для анализа резюме и первичной оценки кандидатов – подключается к корпоративным системам вакансий и автоматически готовит заключение по каждому соискателю.",
    logo: {
      src: "/img/cases/phosagro.svg",
      width: 132,
      height: 32,
      className: "h-[32px] w-[132px]",
    },
    tags: [
      { label: "Промышленность", icon: "factory" },
      { label: "HR", icon: "users-round" },
    ],
    gradientClassName:
      "md:bg-[image:linear-gradient(60.08deg,#C5F8E5_0.95%,#DCF9FF_50.8%,#E4F5FF_101.64%)]",
  },
  {
    company: "Frank Auto",
    metric: "200+",
    metricCaption: "часов экономии в месяц",
    description:
      "Встроили ГигаЧат в сервис речевой аналитики. Прослушивание звонков стало автоматическим. Аналитики перестали тратить время на рутинную оценку коммуникаций.",
    logo: {
      src: "/img/cases/frank-auto.svg",
      width: 111,
      height: 29,
      className: "h-[29px] w-[110.941px]",
    },
    tags: [
      { label: "Автодилер", icon: "car-front" },
      { label: "Аналитика звонков", icon: "chart-no-axes-combined" },
    ],
    gradientClassName:
      "md:bg-[image:linear-gradient(68.54deg,#C5F8E5_0.95%,#DCF9FF_50.8%,#E4F5FF_101.64%)]",
  },
  {
    company: "BI Group",
    metric: "90%",
    metricCaption: "консультаций автоматизировано",
    description:
      "ИИ-помощник на базе ГигаЧат консультирует клиентов по объектам и условиям покупки, отвечает на типовые вопросы и записывает на встречу.",
    logo: {
      src: "/img/cases/bi-group.svg",
      width: 134,
      height: 26,
      className: "h-[26px] w-[134px]",
    },
    tags: [
      { label: "Финансы", icon: "Money" },
      { label: "Клиентский сервис", icon: "thumbs-up" },
    ],
    gradientClassName:
      "md:bg-[image:linear-gradient(68.54deg,#C5F8E5_0.95%,#DCF9FF_50.8%,#E4F5FF_101.64%)]",
  },
];

function Tag({ tag }: { tag: CaseTag }) {
  return (
    <li className="flex shrink-0 items-center justify-center gap-4 rounded-full bg-bg-tag p-8">
      {/* Icon frame 354:151 — exported per tag, 24×24 */}
      <Icon
        src={`/img/icons/${tag.icon.toLowerCase()}.svg`}
        className="size-[24px] text-icon-primary"
      />
      <span className="text-caption whitespace-nowrap text-text-primary">{tag.label}</span>
    </li>
  );
}

function CaseCard({ study, lead = false }: { study: CaseStudy; lead?: boolean }) {
  return (
    <li
      data-case-card
      data-case-company={study.company}
      className={
        lead
          ? "min-w-0 md:flex-[486_1_0%]"
          : "min-w-0 md:flex-[332_1_0%]"
      }
    >
      <article
        aria-label={`Кейс — ${study.company}`}
        className={[
          "card-interactive relative flex h-full flex-col items-start overflow-hidden rounded-[24px] p-40",
          "bg-[image:linear-gradient(67deg,#DAFDE4_0.95%,#E4FAFF_50.8%,#F4FBFF_101.64%)]",
          study.gradientClassName,
          "md:h-[504px]",
        ].join(" ")}
      >
        {/*
          Fixed vertical rhythm instead of `justify-between`, so the logo row and
          the description start at the SAME y in every card. Figma distributes the
          slack evenly (I1927:15620 vs I1927:15622), which leaves the logos ~1px
          apart in the mock and drifts much further once real logo heights differ.

          Result 40..185 · logo slot 215..247 · description 277..379 · tags 408..464.
        */}

        {/* Result — I1927:15620;536:2353, 145 tall (96×1.21 + 12 + 14×1.2) */}
        <div className="flex w-full shrink-0 flex-col items-start gap-12 overflow-hidden md:h-[145px]">
          <p className="text-display-l w-full font-normal text-text-primary">{study.metric}</p>
          <p className="text-body-m w-full text-text-secondary">{study.metricCaption}</p>
        </div>

        {/*
          Logo — I1927:15620;516:222. The slot is a fixed 32px (the tallest logo)
          with the mark centred, so ФосАгро 32, Frank Auto 29 and BI Group 26 all
          share one centre line.
        */}
        <div className="mt-24 flex h-[32px] shrink-0 items-center md:mt-[30px]">
          <Image
            src={study.logo.src}
            alt={study.company}
            width={study.logo.width}
            height={study.logo.height}
            className={`${study.logo.className} max-h-[32px] w-auto object-contain object-left`}
          />
        </div>

        {/* Description — I1927:15620;515:1150, starts at y 277 in every card */}
        <p className="mt-16 w-full shrink-0 text-body-l text-text-primary md:mt-[30px] md:h-[102px] md:text-body-m">
          {study.description}
        </p>

        {/*
          Карточка кликабельна целиком (Card / Info 1312:4755). В макете у кейса
          нет видимой ссылки, поэтому зона клика — невидимая растянутая ссылка.
        */}
        <a
          href="#case"
          aria-label={`Открыть кейс — ${study.company}`}
          className="absolute inset-0 z-10 focus-visible:outline-none"
        />

        {/* Tags — I1927:15620;515:1152, pinned to the bottom padding edge */}
        <ul className="mt-auto flex shrink-0 flex-wrap items-center gap-8 pt-16 md:flex-nowrap">
          {study.tags.map((tag) => (
            <Tag key={tag.label} tag={tag} />
          ))}
        </ul>
      </article>
    </li>
  );
}

export function Cases() {
  return (
    <section id="cases" className="bg-bg-page py-64 md:py-80">
      <div className="container-page flex flex-col items-center gap-32 md:gap-48">
        {/* Clients / Header Row — 1927:15615 / 1927:17418 */}
        <div className="flex w-full flex-col items-center md:flex-row md:items-start md:justify-between">
          <h2 className="text-h3 font-medium text-text-primary md:text-h2">Опыт клиентов</h2>
          <div className="flex pt-8 md:pt-0">
            <a
              href="#cases-all"
              className="flex items-center justify-center gap-8 rounded-full py-12 text-body-m text-text-primary transition-colors hover:bg-neutral-100 md:px-24"
            >
              <span className="whitespace-nowrap">Все кейсы</span>
              {/* Icon / arrow up-right 418:4735, 9×9 */}
              <Icon src="/img/icons/arrow-up-right.svg" className="size-[9px] text-icon-primary" />
            </a>
          </div>
        </div>

        {/* Clients / Case Study Row — 1927:15618 / 1927:17422 */}
        <ul className="flex w-full flex-col gap-16 md:flex-row md:items-start md:gap-24">
          {CASES.map((study, index) => (
            <CaseCard key={study.company} study={study} lead={index === 0} />
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Cases;
