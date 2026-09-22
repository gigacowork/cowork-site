import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";

import LeadForm from "@/components/sections/LeadForm";
import Image from "@/components/ui/Image";
import { GIGACONF_LEAD } from "@/lib/crm";
import { LEGAL_LINES } from "@/lib/legal";
import { pageMetadata } from "@/lib/site";

/**
 * «Пробный доступ» для GigaConf — /lead-gigaconf
 *
 * Клон страницы заявки (/lead) под мероприятие. Отличий три:
 *   • текст слева — тезисы доклада вместо общих выгод продукта;
 *   • тёмная тема в стиле слайдов (палитра — в globals.css, `.lead-gigaconf`);
 *   • три поля вместо пяти: имя, телефон, почта. Компанию и ИНН менеджер
 *     уточняет при созвоне — на стенде каждое лишнее поле стоит заявок.
 *
 * Заявка уходит на отдельный вебхук мероприятия — `GIGACONF_LEAD` в
 * `src/lib/crm.ts`. Компании и ИНН в теле нет: этих полей на форме нет, а
 * пустой блок завёл бы в CRM компанию без названия.
 *
 * Страница закрыта от индексации: она временная и дублирует смысл /lead, а
 * две одинаковые по смыслу страницы в выдаче конкурируют друг с другом. В
 * карту сайта она тоже не добавлена.
 */

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Демо GigaCowork\u00A0— GigaConf",
    description:
      "Оставьте контакты на\u00A0GigaConf, и\u00A0мы покажем GenAI-команду в\u00A0деле: как GigaCowork узнаёт компанию, выполняет задачи по\u00A0событию или\u00A0расписанию и\u00A0остаётся под вашим контролем.",
    path: "/lead-gigaconf/",
  }),
  robots: { index: false, follow: false },
};

/**
 * Пункты продолжают фразу над списком: «покажем, как GigaCowork…». Отсюда и
 * глаголы в настоящем времени, и двоеточие в конце лида.
 *
 * Сказуемое и обстоятельство разделены не тире в строке, а разметкой: на
 * узкой колонке фраза ломается, и тире оставалось бы висеть в конце строки.
 */
const POINTS: { title: string; text: string }[] = [
  {
    title: "Масштабирует опыт",
    text: "от\u00A0личных задач до\u00A0процессов компании",
  },
  {
    title: "Узнаёт компанию",
    text: "через документы, встречи, подключённые системы",
  },
  {
    title: "Действует",
    text: "выполняя задачи по\u00A0событию или\u00A0расписанию",
  },
];

export default function LeadGigaconfPage() {
  return (
    /*
      `lead-fit` — тот же вертикальный ритм, что и на /lead: на невысоких
      экранах отступы ужимаются, чтобы форма помещалась целиком. `lead-gigaconf`
      поверх него переопределяет палитру.
    */
    <div className="lead-fit lead-gigaconf flex min-h-screen w-full flex-col bg-bg-page">
      {/* Шапка — только логотип, как на /lead. Белый вариант: фон чёрный. */}
      <header className="container-page flex h-[62px] shrink-0 items-center justify-between py-16 md:h-[81px]">
        <Link
          href="/"
          aria-label={"GigaCowork, на главную"}
          className="shrink-0"
        >
          <Image
            src="/img/logo-gigacowork-white.svg"
            alt="GigaCowork"
            width={155}
            height={33}
            priority
            className="h-[25px] w-[117px] md:h-[33px] md:w-[155px]"
          />
        </Link>
      </header>

      {/*
        Две колонки включаются с xl, а не с md. У формы фиксированная ширина
        588 плюс отбивка 24, и колонка набирает свои 588 только когда
        контейнер дорос до 1200, то есть от 1280. На md и lg колонке
        оставалось 76–332 px и заголовок рассыпался в узкий столбец, поэтому
        до xl заголовок, пункты и форма идут друг под другом во всю ширину.
      */}
      <main className="container-page flex flex-1 flex-col items-center gap-40 py-40 xl:flex-row xl:items-start xl:gap-24 md:pt-[var(--lead-main-pt,70px)] md:pb-[var(--lead-main-pb,80px)]">
        <div className="flex w-full flex-col items-start gap-32 text-text-primary xl:min-w-0 xl:flex-1 xl:gap-48">
          <div className="flex w-full flex-col gap-16 xl:max-w-[560px] xl:gap-24">
            {/*
              Заголовок набран жирным начертанием и с градиентом по первым
              двум словам — так же, как заголовки шагов на слайдах. Браузер
              без `background-clip: text` получит обычный белый текст: запасной
              вариант описан в globals.css через `@supports`.
            */}
            <h1 className="text-h3 font-bold md:text-h2 xl:text-h1">
              {/*
                `whitespace-nowrap`: строка ломалась по дефису внутри
                «GenAI-команду», и градиентное слово разрывалось надвое.
              */}
              Готовы увидеть{" "}
              <span className="gc-gradient-text whitespace-nowrap">
                GenAI-команду
              </span>
              &nbsp;в&nbsp;деле?
            </h1>
            {/*
              Подзаголовок идёт основным цветом и на широких экранах кеглем
              Heading/H4: он часть первого экрана вместе с заголовком, а не
              подпись к списку. Вторичным цветом он терялся между крупным
              заголовком и пунктами ниже.
            */}
            <p className="text-body-l text-text-primary md:text-h4">
              Оставьте контакты, и&nbsp;мы проведем персональное демо
              GigaCowork
            </p>
          </div>

          <div className="flex w-full flex-col gap-24 xl:max-w-[560px] xl:gap-32">
            {/*
              Маркер — галочка: то, что платформа уже умеет, читается как
              отмеченный пункт. Рисунок взят у `check.svg` остальных иконок
              сайта один в один, меняется только цвет обводки.

              Градиент объявлен один раз ниже и переиспользуется всеми тремя:
              три одинаковых `id` на странице ломали бы заливку.

              Шаг только из шкалы темы: 20 в ней нет, и Tailwind молча даёт 80.
            */}
            <svg width="0" height="0" aria-hidden className="absolute">
              <defs>
                <linearGradient id="gc-check" x1="0" y1="0" x2="1" y2="1">
                  <stop style={{ stopColor: "var(--gc-accent-from)" }} />
                  <stop
                    offset="1"
                    style={{ stopColor: "var(--gc-accent-to)" }}
                  />
                </linearGradient>
              </defs>
            </svg>

            <ul className="flex w-full flex-col gap-16 md:gap-24">
              {POINTS.map((point, i) => (
                <li
                  key={point.title}
                  data-rise
                  style={{ "--rise": String(i) } as CSSProperties}
                  className="flex gap-12"
                >
                  {/*
                    Галочка выровнена по первой строке заголовка, а не по
                    центру пункта: описание под ним переносится, и по центру
                    маркер уезжал бы вниз.
                  */}
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden
                    className="mt-[1px] shrink-0"
                  >
                    <path
                      d="M4.75 12.75 9.75 17.75 19.25 6.75"
                      stroke="url(#gc-check)"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex flex-col">
                    <p className="text-body-l font-medium text-text-primary">
                      {point.title}
                    </p>
                    <p className="text-body-m text-text-secondary">
                      {point.text}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            {/*
              Про контроль — не четвёртый пункт списка, а оборот на читателя:
              выше перечислено, что делает платформа, здесь — что остаётся за
              человеком. Поэтому и оформлено иначе: вместо вертикальной черты
              слева горизонтальная линия сверху, и строка идёт одной фразой, а
              не парой «сказуемое / обстоятельство».

              Линия того же градиента, но уходит в прозрачность: она отбивает
              строку от списка, не превращаясь во второй такой же маркер.
            */}
            <p
              data-rise
              style={{ "--rise": String(POINTS.length) } as CSSProperties}
              className="flex w-full flex-col gap-12 text-body-l font-medium text-text-primary"
            >
              <span
                aria-hidden
                className="h-[2px] w-[96px] rounded-full bg-[linear-gradient(90deg,var(--gc-accent-from)_0%,var(--gc-accent-to)_70%,transparent_100%)]"
              />
              {/*
                Интерлиньяж плотнее базового (1.2 у Body/L): строка переносится
                на узкой колонке, и две строки одной фразы должны читаться
                единым блоком, а не как два пункта.
              */}
              <span className="leading-[1.1]">
                А&nbsp;вы контролируете{" "}
                <span className="font-normal text-text-secondary">
                  роли, доступы и&nbsp;автономность
                </span>
              </span>
            </p>
          </div>
        </div>

        {/*
          Форма: три поля, свой CTA и метка карточки `gc-card` — по ней
          globals.css красит подложку и кнопку.
        */}
        <LeadForm
          target={GIGACONF_LEAD}
          fields={["name", "phone", "email"]}
          /*
            На стенде «Рабочая почта» звучит как лишнее требование: человек
            оставляет контакт за полминуты. Подпись короче, проверка прежняя —
            адрес по-прежнему разбирается регуляркой.
          */
          labels={{ email: { label: "Почта", empty: "Укажите почту" } }}
          /*
            Обязательны все три: полей и так минимум, а заявка без телефона со
            стенда почти не отрабатывается — звонить некуда.
          */
          requireAll
          /*
            Подпись обычным регистром: капслок наводит `text-transform` в
            globals.css. Так диктор читает слова, а не по буквам, и текст
            остаётся нормальным при копировании.
          */
          submitLabel="Отправить"
          idPrefix="gigaconf"
          className="gc-card"
          successIcon
          successText={
            "Мы свяжемся с вами, чтобы договориться о проведении демо."
          }
        />
      </main>

      <footer className="container-page shrink-0 pt-24 pb-32 md:pt-[var(--lead-footer-pt,48px)] md:pb-[var(--lead-footer-pb,40px)]">
        <p className="text-center text-caption text-text-secondary md:text-left">
          {LEGAL_LINES[0]}
          <br className="hidden md:inline" /> {LEGAL_LINES[1]}
        </p>
      </footer>
    </div>
  );
}
