import type { CSSProperties } from "react";

/**
 * Данные технической страницы /landing-events.
 *
 * Перенесены из отдельного киоск-приложения (Vite + React Router), которое
 * лежало в «Исходниеи landing-events»: `src/data/categories.ts`,
 * `src/data/categoryDecor.ts` и `src/config/media.ts` — сведены в один файл,
 * тексты и числа дословно.
 *
 * Страница рассчитана на тач-панель Full HD: сцена всегда 1920×1080 и
 * масштабируется целиком под окно, поэтому все размеры здесь — в пикселях
 * макета, а не в токенах сайта.
 */

/** Куда ведёт кнопка «Демо». */
export const DEMO_URL =
  "https://demo.cowork.ru/login?redirect=%2Fworkspaces%2F12a34007-bac0-4cf1-b936-5b09ccfa243e";

/** Ролик первого экрана. */
export const HOME_VIDEO =
  "https://66fcdca9-9288-4774-b348-965b20467ba1.selstorage.ru/giga/Main_video.mp4";

export type LandingCategory = {
  id: string;
  title: string;
  /** Строки описания: в макете разбивка жёсткая, поэтому массив, а не текст. */
  description: string[];
  video: string;
  decor: LandingDecor;
};

/** Кадрирование украшения карточки — попиксельно из макета. */
export type LandingDecor = {
  image: string;
  box: CSSProperties;
  img: CSSProperties;
};

export const LANDING_CATEGORIES: LandingCategory[] = [
  {
    id: "strategy",
    title: "Стратегическое планирование",
    description: [
      "Нужна оценка — брать ли срочный заказ, который потребует перестройки",
      "производственного плана.",
    ],
    video:
      "https://66fcdca9-9288-4774-b348-965b20467ba1.selstorage.ru/giga/05_Render_StratPlan_Retime.mp4",
    decor: {
      image: "/landing-events/decor/decor-planning.png",
      box: { bottom: "-1px", left: "551px", width: "311px", height: "348px" },
      img: {
        left: "10.68%",
        top: "17.97%",
        width: "103.83%",
        height: "103.83%",
      },
    },
  },
  {
    id: "logistics",
    title: "Логистика",
    description: [
      "Задерживается поставка",
      "алюминиевого листа",
      "для производства корпусов.",
      "Оцени влияние на текущие заказы",
      "и не допусти остановку линии.",
    ],
    video:
      "https://66fcdca9-9288-4774-b348-965b20467ba1.selstorage.ru/giga/01_Render_Logyst_Retime.mp4",
    decor: {
      image: "/landing-events/decor/decor-logistics.png",
      box: { bottom: "0", left: "493.5px", width: "368px", height: "340px" },
      img: { left: "-3.78%", top: "15.21%", width: "115.12%", height: "96.6%" },
    },
  },
  {
    id: "production",
    title: "Производство",
    description: [
      "Спланируй выполнение заказа — ",
      "500 корпусов (срок — 5 дней). ",
      "Впиши его в существующий ",
      "график, не сорвав ",
      "остальные обязательства.",
    ],
    video:
      "https://66fcdca9-9288-4774-b348-965b20467ba1.selstorage.ru/giga/03_Render_Proizvodstvo_Retime.mp4",
    decor: {
      image: "/landing-events/decor/decor-production.png",
      box: { bottom: "-0.5px", left: "382px", width: "185px", height: "155px" },
      img: {
        left: "-29.79%",
        top: "-8.45%",
        width: "155.07%",
        height: "134.03%",
      },
    },
  },
  {
    id: "commercial",
    title: "Коммерческий блок",
    description: [
      "Подготовь коммерческое",
      "предложение,",
      "персонализированное",
      "под конкретного клиента.",
    ],
    video:
      "https://66fcdca9-9288-4774-b348-965b20467ba1.selstorage.ru/giga/02_Render_CommBlock_Retime.mp4",
    decor: {
      image: "/landing-events/decor/decor-commercial.png",
      box: {
        bottom: "-0.5px",
        left: "382.67px",
        width: "185px",
        height: "162px",
      },
      img: {
        left: "-26.82%",
        top: "3.44%",
        width: "148.41%",
        height: "122.73%",
      },
    },
  },
  {
    id: "backoffice",
    title: "Бэкофис",
    description: [
      "Клиент хочет изменить условия",
      "оплаты в действующем",
      "договоре. Оцени риски",
      "и подготовь допсоглашение.",
    ],
    video:
      "https://66fcdca9-9288-4774-b348-965b20467ba1.selstorage.ru/giga/04_Render_BackOffice_Law.mp4",
    decor: {
      image: "/landing-events/decor/decor-backoffice.png",
      box: {
        bottom: "-0.5px",
        left: "382.33px",
        width: "185px",
        height: "153px",
      },
      img: {
        left: "-5.61%",
        top: "-3.73%",
        width: "106.36%",
        height: "117.25%",
      },
    },
  },
];

export const getLandingCategory = (id: string) =>
  LANDING_CATEGORIES.find((category) => category.id === id);
