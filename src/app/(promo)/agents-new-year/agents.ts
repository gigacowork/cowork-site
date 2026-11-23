export type Agent = {
  id: string; short: string; name: string; summary: string; input: string; result: string;
  icon: string; image: string;
  skills: { name: string; description: string; file: string }[];
};

export const agents: Agent[] = [
  {
    id: "finance", short: "Финансы", name: "Финансовый директор", icon: "Finance", image: "FinanceDirectorDarkChocolate",
    summary: "Проанализирует P&L и юнит-экономику, оценит маржинальность, ликвидность и долговую нагрузку",
    input: "P&L, баланс, ОДДС или таблица с финансовыми показателями",
    result: "Оценка состояния, ключевые отклонения и первоочередные действия",
    skills: [
      { name: "Финансовая диагностика", description: "Проверить P&L, маржу, ликвидность и долговую нагрузку.", file: "financial-diagnostics" },
      { name: "План-фактный анализ", description: "Найти отклонения от бюджета и их причины.", file: "plan-variance-analysis" },
    ],
  },
  {
    id: "hr", short: "HR", name: "HR-директор", icon: "Hr", image: "HrDirectorMilkChocolate",
    summary: "Оценит резюме кандидатов и эффективность HR-процессов",
    input: "Резюме, профиль вакансии и критерии отбора",
    result: "Короткий список кандидатов с аргументами и вопросами для интервью",
    skills: [
      { name: "Анализ резюме", description: "Сравнить кандидатов с требованиями и подготовить вопросы.", file: "resume-screening" },
      { name: "Описание вакансии", description: "Собрать ясное и полное описание новой роли.", file: "job-description" },
    ],
  },
  {
    id: "marketing", short: "Маркетинг", name: "Директор по маркетингу", icon: "Marketing", image: "MarketingDirectorDarkChocolate",
    summary: "Проведет конкурентный анализ и составит маркетинговый бюджет",
    input: "Ссылки на конкурентов, показатели каналов и бюджет",
    result: "Карта конкурентов, выводы по каналам и план действий",
    skills: [
      { name: "Анализ конкурентов", description: "Сравнить предложения и найти точки отличия.", file: "competitor-analysis" },
      { name: "Аналитика каналов", description: "Понять, какие каналы дают результат.", file: "channel-analytics" },
      { name: "Распределение бюджета", description: "Разложить маркетинговый бюджет по каналам.", file: "traffic-planning" },
    ],
  },
  {
    id: "sales", short: "Продажи", name: "Коммерческий директор", icon: "Sales", image: "CommercialDirectorMilkChocolate",
    summary: "Проанализирует воронку продаж, подготовит коммерческие предложения и отчет по сделкам",
    input: "Выгрузка CRM, этапы сделок и план продаж",
    result: "Слабые места воронки, прогноз и действия для команды",
    skills: [
      { name: "Анализ воронки", description: "Найти этапы, на которых теряются сделки.", file: "funnel-analysis" },
      { name: "Прогноз продаж", description: "Оценить будущую выручку по текущим сделкам.", file: "sales-forecasting" },
      { name: "Отчет по продажам", description: "Собрать наглядную сводку для руководителя.", file: "interactive-sales-report" },
    ],
  },
  {
    id: "legal", short: "Юрист", name: "Главный юрист", icon: "Legal", image: "GeneralCounselDarkChocolate",
    summary: "Сравнит версии договоров и документов, оценит NDA",
    input: "Две версии договора или текст NDA",
    result: "Список изменений и рисков с привязкой к пунктам",
    skills: [
      { name: "Сравнение версий договора", description: "Увидеть смысловые изменения между редакциями.", file: "contract-version-diff" },
      { name: "Экспресс-оценка NDA", description: "Быстро отметить типичные риски соглашения.", file: "nda-express-review" },
    ],
  },
  {
    id: "procurement", short: "Закупки", name: "Руководитель отдела закупок", icon: "Procurement", image: "HeadOfProcurementMilkChocolate",
    summary: "Найдет поставщиков, проверит комплектность ТКП и подготовит пояснительную записку",
    input: "Техническое задание, предложения и критерии закупки",
    result: "Сравнение вариантов, пробелы в ТКП и обоснование",
    skills: [
      { name: "Поиск поставщиков", description: "Составить список потенциальных партнеров.", file: "supplier-search" },
      { name: "Проверка ТКП", description: "Найти недостающие сведения в предложениях.", file: "tkp-completeness-check" },
      { name: "Пояснительная записка", description: "Подготовить аргументы для выбора поставщика.", file: "explanatory-note" },
    ],
  },
];
