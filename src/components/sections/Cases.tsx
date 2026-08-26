import Image from "@/components/ui/Image";
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
    metricCaption: "сокращение времени на\u00A0поиск кандидата",
    description:
      "ИИ-агент для\u00A0анализа резюме и\u00A0первичной оценки кандидатов\u00A0– подключается к\u00A0корпоративным системам вакансий и\u00A0автоматически готовит заключение по\u00A0каждому соискателю",
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
    metricCaption: "часов экономии в\u00A0месяц",
    description:
      "Встроили ГигаЧат в\u00A0сервис речевой аналитики. Прослушивание звонков стало автоматическим. Аналитики перестали тратить время на\u00A0рутинную оценку коммуникаций",
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
      "ИИ-помощник на\u00A0базе ГигаЧат консультирует клиентов по\u00A0объектам и\u00A0условиям покупки, отвечает на\u00A0типовые вопросы и\u00A0записывает на\u00A0встречу",
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

/*
  Tag кейса — I1927:15622;816:3940: иконка 24 в боксе с полями по 8, подпись
  через 4. Раньше здесь стояли поля 12 и 14, как у тега блока «Сделайте
  ИИ-агентов частью команды» (1388:5966), — а это другой компонент. Лишние 10px
  на чип давали 20px на пару, и в узкой карточке 332 второй чип упирался в край:
  «Аналитика звонков» и «Клиентский сервис» обрезались подложкой карточки.
*/
function Tag({ tag }: { tag: CaseTag }) {
  return (
    <li className="flex shrink-0 items-center justify-center gap-4 rounded-full bg-bg-tag px-8 py-8">
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
          /*
            min-h, а не h: внутренние высоты по-прежнему фиксированы, поэтому
            логотипы и описания стоят на одной линии во всех карточках, но
            перенос чипов на вторую строку не обрезается подложкой.
          */
          "md:min-h-[504px]",
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

        {/*
          Description — I1927:15620;515:1150, начинается на y 277 во всех
          карточках. Высота min, а не фиксированная: на макетных 332 текст
          укладывается в 102, но между 768 и 1280 карточка ужимается, строк
          становится больше, и жёсткая высота отправляла хвост описания прямо
          на чипы.
        */}
        <p className="mt-16 w-full shrink-0 text-body-l text-text-primary md:mt-[30px] md:min-h-[102px] md:text-body-m">
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

        {/*
          Tags — I1927:15620;515:1152, прижаты к нижнему полю карточки.

          Ряд шире текстовой колонки на 20px: в макете рамка тегов — 272 при
          колонке 252 и карточке 332, то есть чипы заходят в правое поле, но до
          края не достают. Без этого запаса пара чипов не помещалась в 252 и
          переносилась на вторую строку уже на макетной ширине.

          Перенос при этом разрешён: ниже 1280 карточка ужимается до 259, и там
          второй чип честно уходит на вторую строку, а карточка на неё подрастает
          (min-h вместо h) — вместо того чтобы обрезаться подложкой.
        */}
        <ul className="mt-auto flex shrink-0 flex-wrap items-center gap-8 pt-16 md:-mr-[20px]">
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
        {/*
          На десктопе заголовок стоит по центру всей ширины секции, поэтому
          ссылка «Все кейсы» вынута из потока и прижата к правому краю: останься
          она обычной колонкой ряда, её ширина сместила бы заголовок влево от
          настоящего центра. Ниже md порядок обычный — заголовок, под ним ссылка.
          Сейчас ссылка скрыта (см. ниже), но обвязка оставлена под возврат.
        */}
        <div className="flex w-full flex-col items-start md:relative">
          <h2 className="text-h3 font-medium text-text-primary md:w-full md:text-center md:text-h2">
            Опыт клиентов
          </h2>
          {/*
            ВРЕМЕННО СКРЫТО: страницы со списком кейсов ещё нет, ссылка вела в
            несуществующий якорь #cases-all. Вернуть — раскомментировать блок
            ниже (иконка — Icon / arrow up-right 418:4735, 9×9).

            <div className="flex pt-8 md:absolute md:top-0 md:right-0 md:pt-0">
              <a
                href="#cases-all"
                className="flex items-center justify-center gap-8 rounded-full py-12 text-body-m text-text-primary transition-colors hover:bg-neutral-100 md:px-24"
              >
                <span className="whitespace-nowrap">Все кейсы</span>
                <Icon src="/img/icons/arrow-up-right.svg" className="size-[9px] text-icon-primary" />
              </a>
            </div>
          */}
        </div>

        {/*
          Clients / Case Study Row — 1927:15618 / 1927:17422.

          `items-stretch` (по умолчанию), а не `items-start`: высота карточки
          теперь минимальная, а не фиксированная, и без растягивания карточки
          разъезжались бы по высоте, как только одно описание окажется длиннее
          других. С фиксированными 504 это было незаметно.
        */}
        <ul className="flex w-full flex-col gap-16 md:flex-row md:gap-24">
          {CASES.map((study, index) => (
            <CaseCard key={study.company} study={study} lead={index === 0} />
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Cases;
