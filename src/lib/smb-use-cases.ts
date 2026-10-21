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
      "GigaCowork готовит КП и письма клиентам, учитывает историю переписки и фиксирует договорённости в ваших системах.",
    ],
    heroImage: "/img/use-cases/smb-proposals-hero.webp",
    heroImageMobile: "/img/use-cases/smb-proposals-hero.webp",
    scenariosTitle: "Какие задачи можно\nделегировать уже сейчас",
    scenarios: [
      {
        title: "Соберите коммерческое предложение",
        paragraphs: [
          "Агент рассчитывает стоимость и подготовит КП по шаблону.",
          "Через интеграции с системами агент сверяет историю клиента и проверяет, связан ли запрос с действующей сделкой. Сотрудник подтверждает цену и условия перед отправкой.",
        ],
        effects: [
          "Расчёт стоимости по позициям",
          "Вопросы по условиям заказа",
          "Черновик КП для проверки",
        ],
      },
      {
        title: "Готовьте ответы и шаблоны с учётом переписки",
        paragraphs: [
          "По материалам компании агент готовит черновики писем подрядчикам и партнёрам. Если для ответа не хватает данных о цене, объёме или сроке, он предложит вопросы для уточнения.",
        ],
        effects: [
          "Черновик письма в деловом тоне",
          "Вопросы по цене, объёму и срокам",
          "Условия, требующие подтверждения",
        ],
      },
    ],
    stepsTitle: "",
    step: {
      title: "Получите PDF и зафиксируйте результат",
      paragraphs: [
        "Агент оформит КП в PDF по загруженному образцу, зафиксирует результат в карточке CRM и приложит файл в чат. Затем подготовит письмо клиенту и предложит отправить его после проверки менеджера.",
      ],
      image: "/img/small-business/commercial-offer-pdf.webp",
      imageAlt: "Оформленное коммерческое предложение в PDF: клиент, состав заказа и стоимость",
    },
  },
  {
    slug: "financial_analysis",
    navLabel: "Расходы и аналитика",
    navOrder: 3,
    title: "Замечайте важное в финансах,\nне проводя часы за таблицами",
    intro: [
      "ИИ-агенты сверяют расходы с планом, проверяют ближайшие платежи и собирают наглядный отчёт по вашим файлам.",
    ],
    heroTitleWidth: "780px",
    heroImage: "/img/use-cases/smb-analytics-hero.webp",
    heroImageMobile: "/img/use-cases/smb-analytics-hero.webp",
    scenariosTitle: "От плана и факта\nк понятным решениям",
    scenarios: [
      {
        title: "Сведите план и факт расходов",
        paragraphs: [
          "Агент возьмёт план из пространства и загруженный в чат файл операций. Сверит расходы по категориям с планом, а платежи без ясного назначения покажет отдельно, не теряя их из общего оттока по файлу.",
        ],
        effects: [
          "Сводная таблица план-факт",
          "Отклонения по категориям и общий итог",
          "Отток по файлу, исходные строки и спорные операции",
        ],
      },
      {
        title: "Хватит ли денег на ближайшие платежи?",
        paragraphs: [
          "Агент сопоставит остаток денег с календарём выплат и ожидаемых поступлений. Покажет, когда средств может не хватить, на какую сумму и от каких поступлений зависит прогноз.",
        ],
        effects: [
          "Прогноз остатка по датам",
          "Первая дата и размер возможной нехватки",
          "Платежи и поступления для проверки",
        ],
      },
    ],
    stepsTitle: "",
    step: {
      title: "Соберите дашборд для решения",
      paragraphs: [
        "По таблице план-факт и платёжному календарю агент соберёт наглядный дашборд: расходы по категориям, прогноз остатка и даты, когда денег может не хватить. Каждый вывод можно сверить с исходными строками.",
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
