import type { Metadata } from "next";
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
 *   • текст слева — одно обещание вместо общих выгод продукта: на стенде
 *     подробности человек слышит вживую, экран нужен под форму;
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

export default function LeadGigaconfPage() {
  return (
    /*
      `lead-fit` — тот же вертикальный ритм, что и на /lead: на невысоких
      экранах отступы ужимаются, чтобы форма помещалась целиком. `lead-gigaconf`
      поверх него переопределяет палитру и задаёт мобильную лесенку отступов:
      на стенде страница обязана помещаться в экран без прокрутки.

      `min-h-dvh`, а не `min-h-screen`: на телефоне `100vh` — это высота без
      панелей браузера, и страница, сверстанная под неё, в реальном Safari
      всё равно прокручивалась. Динамическая единица считает ровно ту высоту,
      которую человек видит сейчас.
    */
    <div className="lead-fit lead-gigaconf flex min-h-dvh w-full flex-col bg-bg-page">
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
        Одна колонка на всех ширинах: заголовок, обещание, форма — друг под
        другом по центру страницы. Двухколоночной раскладки больше нет, от неё
        остался только `md:`-ритм отступов: на десктопе воздуха больше.

        `justify-center` — остаток высоты раздаётся сверху и снизу, а не
        копится одной дырой перед подвалом. `items-center` ставит блоки по
        центру ширины: и текст, и карточка формы уже контейнера, без него они
        прижимались бы к левому краю.
      */}
      <main className="container-page flex flex-1 flex-col items-center justify-center gap-[var(--lead-m-main-gap,40px)] py-[var(--lead-m-main-py,40px)] md:gap-[var(--lead-main-gap,32px)] md:pt-[var(--lead-main-pt,70px)] md:pb-[var(--lead-main-pb,80px)]">
        {/*
          Мера строки ограничена: выключенный по центру текст читается тем
          хуже, чем длиннее строка, — глаз каждый раз ищет новое начало. 720
          держит обещание в одну строку на десктопе, а заголовок в две.
        */}
        <div className="flex w-full max-w-[720px] flex-col gap-16 text-center text-text-primary md:gap-24">
          {/*
            Заголовок набран жирным начертанием и с градиентом по первым
            двум словам — так же, как заголовки шагов на слайдах. Браузер
            без `background-clip: text` получит обычный белый текст: запасной
            вариант описан в globals.css через `@supports`.
          */}
          <h1 className="text-h3 font-bold md:text-h2">
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
            Обещание одной строкой — оно же единственная подводка к форме,
            поэтому набрано Heading/H4 основным цветом, а не кеглем подписи:
            на 16 вторичным цветом строка терялась между заголовком и
            карточкой.

            `data-lead-sub`: на совсем низких экранах строка скрывается
            совсем, чтобы форма влезла целиком (правило в globals.css).
          */}
          <p data-lead-sub className="text-h4 font-medium text-text-primary">
            {/*
              Неразрывный пробел перед названием: иначе на десктопе строка
              ломается после «демо», и «GigaCowork» остаётся висеть в
              отдельной строке один.
            */}
            Оставьте контакты, и&nbsp;мы проведем персональное
            демо&nbsp;GigaCowork
          </p>
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

      <footer className="container-page shrink-0 pt-[var(--lead-m-footer-pt,24px)] pb-[var(--lead-m-footer-pb,32px)] md:pt-[var(--lead-footer-pt,48px)] md:pb-[var(--lead-footer-pb,40px)]">
        {/* По центру и на десктопе: страница целиком выстроена по оси. */}
        <p className="text-center text-caption text-text-secondary">
          {LEGAL_LINES[0]}
          <br className="hidden md:inline" /> {LEGAL_LINES[1]}
        </p>
      </footer>
    </div>
  );
}
