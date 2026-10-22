import type { UseCaseScenario, UseCaseStep } from "@/lib/use-cases";

/** Короткие сценарии для меню «Малому бизнесу». */
export function smbUseCasePath(slug: string) {
  return `/ai-for-smb/${slug}`;
}

export type SmbUseCase = {
  slug: string;
  navLabel: string;
  navOrder: number;
  title: string;
  intro: string[];
  heroTitleWidth?: string;
  heroImage: string;
  heroImageMobile: string;
  scenariosTitle: string;
  scenarios: UseCaseScenario[];
  stepsTitle: string;
  step: UseCaseStep;
};

export const SMB_USE_CASES: SmbUseCase[] = [
  {
    slug: "customer-requests",
    navLabel: "Заявки и клиенты",
    navOrder: 1,
    title: "Не теряйте клиентов –\nавтоматизируйте обработку заявок",
    intro: [
      "ИИ-агенты GigaCowork разберут заявки с учётом истории клиента и помогут увеличить продажи.",
    ],
    heroImage: "/img/use-cases/smb-customer-hero.webp",
    heroImageMobile: "/img/use-cases/smb-customer-hero.webp",
    scenariosTitle: "Быстрее обрабатывайте и забирайте в работу входящие заказы",
    scenarios: [
      {
        title: "Передайте агенту работу с заявками",
        paragraphs: [
          "Цифровой помощник проанализирует обращения, сверит новые заявки с текущими сделками в базе и внесёт согласованные данные в CRM.",
        ],
        effects: [
          "Краткая сводка по обращению",
          "Проверка истории клиента",
          "Создание сделок в CRM",
        ],
        video: "/video/smb-customer-request.mp4",
        // В исходном кадре 16:9 по краям есть чёрные поля; 5:3 скрывает их без потери интерфейса.
        videoRatio: "5/3",
      },
      {
        title: "Не теряйте информацию о клиентах",
        paragraphs: [
          "Агент проверит полную историю клиента: сделки, текущие статусы, историю обращений. Подскажет, кто ждёт ответа, где задержался платёж и на каком этапе находится выполнение заказа.",
        ],
        effects: [
          "Подсветит зависшие сделки",
          "Предложит план действий",
          "Учтёт историю клиента и договорённости",
        ],
        video: "/video/smb-customer-followup.mp4",
        videoRatio: "5/3",
      },
    ],
    stepsTitle: "",
    step: {
      title: "Делегируйте ИИ расчёт проектов",
      paragraphs: [
        "Цифровой помощник подготовит смету проекта по запросу: покажет цену позиций, условия и недостающую информацию, которую нужно уточнить. Сформирует документ и отправит финальный вариант на согласование клиенту.",
      ],
      image: "/img/small-business/project-estimate.webp",
      imageAlt: "Расчёт проекта в GigaCowork: стоимость позиций, общий итог и условия",
    },
  },
  {
    slug: "commercial-offers",
    navLabel: "КП и деловые письма",
    navOrder: 2,
    title: "Создавайте коммерческие\nпредложения за пару минут",
    intro: [
      "Агенты GigaCowork учтут историю переписок, найдут информацию и статус по клиенту, подготовят КП и отправят письма клиентам.",
    ],
    heroImage: "/img/use-cases/smb-proposals-hero.webp",
    heroImageMobile: "/img/use-cases/smb-proposals-hero.webp",
    scenariosTitle: "Какие задачи бизнес\nделегирует ИИ",
    scenarios: [
      {
        title: "Расчёт проекта",
        paragraphs: [
          "Агент интегрируется с CRM-системой, сводит информацию по клиенту, рассчитывает стоимость и собирает смету проекта. Если клиента нет в базе, агент подготовит предложение, учитывая запрос и текущие договорённости.",
        ],
        effects: [
          "Расчёт стоимости позиций",
          "Вопросы по условиям заказа",
          "Черновик КП",
        ],
      },
      {
        title: "Создание шаблонов для писем контрагентам",
        paragraphs: [
          "Делегируйте агенту подготовку писем подрядчикам и партнёрам — цифровой помощник учтёт регламенты компании, а если для ответа будет недостаточно информации о цене, объёме или сроке, задаст вопросы для уточнения.",
        ],
        effects: [
          "Черновик письма",
          "Анализ регламентов",
        ],
      },
    ],
    stepsTitle: "",
    step: {
      title: "Подготовка коммерческого предложения",
      paragraphs: [
        "Агент оформит КП по шаблону и зафиксирует результат в карточке CRM. Затем подготовит письмо клиенту и отправит его после согласования менеджера.",
      ],
      image: "/img/small-business/commercial-offer-pdf.webp",
      imageAlt: "Оформленное коммерческое предложение в PDF: клиент, состав заказа и стоимость",
    },
  },
  {
    slug: "financial_analysis",
    navLabel: "Расходы и аналитика",
    navOrder: 3,
    title: "Не тратьте часы на таблицы –\nделегируйте финансовый анализ агентам",
    intro: [
      "ИИ-агенты подготовят план-факт, проанализируют ближайшие платежи\nи соберут наглядный отчёт по всем статьям расходов.",
    ],
    heroTitleWidth: "780px",
    heroImage: "/img/use-cases/smb-analytics-hero.webp",
    heroImageMobile: "/img/use-cases/smb-analytics-hero.webp",
    scenariosTitle: "Какие задачи бизнес\nделегирует ИИ",
    scenarios: [
      {
        title: "План-факт расходов",
        paragraphs: [
          "Агент проанализирует план и текущее состояние по финансовым операциям, сверит все статьи расходов по категориям и подсветит отклонения.",
        ],
        effects: [
          "Сводная таблица с план-фактом",
          "Отклонения по категориям и спорные операции",
          "Общая статистика",
        ],
      },
      {
        title: "Анализ кассового разрыва",
        paragraphs: [
          "Агент сопоставит остаток денег с календарём выплат и ожидаемых поступлений. Покажет, когда средств может не хватить, на какую сумму и от каких поступлений зависит прогноз.",
        ],
        effects: [
          "Прогноз остатка на балансе по датам",
          "Даты и размеры возможного долга",
          "Платежи и поступления для анализа",
        ],
      },
    ],
    stepsTitle: "",
    step: {
      title: "ИИ-агент соберет отчет по всем расходам",
      paragraphs: [
        "Цифровой сотрудник подготовит наглядный дашборд по план-факту и платежному календарю: расходы по категориям, прогноз остатка и даты, когда баланс может уйти в минус.",
      ],
      video: "/video/smb-analytics-dashboard.mp4",
      videoRatio: "97/54",
      videoLabel: "Видео: агент собирает дашборд расходов и платежей",
    },
  },
];

/** Привязывает короткие предлоги и союзы к следующему слову без изменения текста. */
export function keepSmbShortWords(text: string) {
  return text.replace(
    /(?<![\p{L}\p{N}])(?:а|без|в|во|для|до|за|и|из|или|к|ко|на|не|но|о|об|от|по|под|при|про|с|со|у)[ \t]+/giu,
    (match) => `${match.trimEnd()}\u00a0`,
  );
}

/** Тот же контент с корректными переносами только для отображения страницы. */
export function formatSmbUseCase(item: SmbUseCase): SmbUseCase {
  const fix = keepSmbShortWords;
  return {
    ...item,
    title: fix(item.title),
    intro: item.intro.map(fix),
    scenariosTitle: fix(item.scenariosTitle),
    scenarios: item.scenarios.map((scenario) => ({
      ...scenario,
      title: fix(scenario.title),
      paragraphs: scenario.paragraphs.map(fix),
      effects: scenario.effects?.map(fix),
    })),
    stepsTitle: fix(item.stepsTitle),
    step: {
      ...item.step,
      title: fix(item.step.title),
      paragraphs: item.step.paragraphs.map(fix),
      bullets: item.step.bullets?.map(fix),
    },
  };
}

export function getSmbUseCase(slug: string) {
  return SMB_USE_CASES.find((item) => item.slug === slug);
}
