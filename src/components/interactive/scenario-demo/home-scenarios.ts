import { scenarios, type Scenario } from "./ScenarioDemo";

export const homeScenarios: Scenario[] = [
  {
    kind: "customer-request",
    initialLabel: "Разбор заявки",
    label: "Разобрать заявку клиента",
    icon: "/img/icons/accounting-mail.svg",
    prompt: "Найди письмо Анны о печати меню и проверь заявку в amoCRM. Создай сделку и отправь клиенту уточняющее письмо после подтверждения.",
    status: "Подключаюсь к почте и amoCRM",
    files: [],
    connection: {
      label: "Источники данных заявки",
      sources: [
        { name: "Mail Почта", logo: "mail-pochta.webp", readyAt: 2 },
        { name: "amoCRM", logo: "amocrm.webp", readyAt: 3 },
      ],
      progress: [
        "Нашёл письмо «Карточки для меню». Проверяю заявку в amoCRM",
        "Готовлю карточку сделки",
        "Карточка готова к созданию",
        "Создаю сделку в amoCRM",
        "Готовлю письмо клиенту",
        "Письмо готово к отправке",
        "Отправляю письмо через Mail Почту",
      ],
    },
  },
  ...scenarios
    .filter((scenario) => scenario.kind !== "news")
    .map((scenario) => scenario.kind === "offers" ? { ...scenario, files: scenario.files.slice(0, 2) } : scenario),
  {
    kind: "candidate-selection",
    initialLabel: "Подбор кандидата",
    label: "Подобрать кандидата",
    icon: "/img/icons/users-round.svg",
    prompt: "Сравни три резюме с профилем аналитика данных. Покажи, какой опыт указан у каждого, кого пригласить на интервью и что уточнить.",
    status: "Сравниваю резюме с профилем вакансии",
    files: [
      { name: "Профиль аналитика.pdf", size: "28 КБ" },
      { name: "Резюме кандидата А.pdf", size: "86 КБ" },
      { name: "Резюме кандидата Б.pdf", size: "72 КБ" },
      { name: "Резюме кандидата В.pdf", size: "64 КБ" },
    ],
  },
];
