import Image from "@/components/ui/Image";
import Link from "next/link";
import { USE_CASES } from "@/lib/use-cases";
import { LEGAL_LINES, LEGAL_PDF } from "@/lib/legal";

/**
 * Footer
 * Figma desktop: 1927:15641 (px 120 / pt 48 / pb 40, gap 64, top row gap 160,
 *   brand column 240, nav offset 791, groups gap 64, gradient 32.43deg)
 * Figma mobile:  1927:17443 (px 16 / pt 40 / pb 32, gap 64, single column,
 *   nav groups gap 40, gradient 80.72deg)
 */

/**
 * `hidden` — пункт временно не показывается.
 *
 * Скрытые пункты оставлены в данных, а не удалены: это разделы будущих
 * релизов (см. ПРОЕКТ_COWORK_RU.md), и вернуть их нужно будет ровно в этом
 * составе и порядке. Группа, у которой не осталось видимых пунктов, целиком
 * выпадает из разметки — пустых заголовков в подвале не появляется.
 */
type NavLink = { label: string; href: string; hidden?: boolean };

type NavGroup = {
  title: string;
  width: string;
  links: NavLink[];
};

const NAV_GROUPS: NavGroup[] = [
  {
    title: "ПЛАТФОРМА",
    width: "xl:w-[178px]",
    links: [
      { label: "Обзор платформы", href: "#platform" },
      { label: "Что\u00A0нового", href: "#whats-new" },
      /*
        Адрес со слэшем на конце — как в шапке: документация лежит статикой в
        public, и без слэша сервер отдаёт редирект вместо самой страницы.
      */
      { label: "Документация", href: "/ai-platform/docs/" },
      { label: "Пространства", href: "#spaces", hidden: true },
      { label: "ИИ-агенты", href: "#agents", hidden: true },
      { label: "Навыки", href: "#skills", hidden: true },
      { label: "Быстрые команды", href: "#commands", hidden: true },
      { label: "Коннекторы", href: "#connectors", hidden: true },
      { label: "Запуск по\u00A0расписанию", href: "#schedule", hidden: true },
      { label: "Безопасность", href: "#security", hidden: true },
      { label: "Помощь и\u00A0поддержка", href: "#support", hidden: true },
    ],
  },
  {
    /*
      Состав повторяет выпадающее меню «Для кого» в шапке и карточки блока
      «Не тратьте часы…»: список строится из того же справочника, что и сами
      страницы, поэтому разъехаться они не могут.
    */
    title: "СЦЕНАРИИ",
    width: "xl:w-[196px]",
    links: USE_CASES.map((item) => ({
      label: item.navLabel,
      href: `/use_cases/${item.slug}`,
    })),
  },
  {
    title: "ПОСТАВКИ",
    width: "xl:w-[142px]",
    links: [
      { label: "Облако", href: "#cloud", hidden: true },
      { label: "Гибрид", href: "#hybrid", hidden: true },
      { label: "ПАК", href: "#pak", hidden: true },
      { label: "Сравнить варианты", href: "#compare", hidden: true },
    ],
  },
  {
    title: "КОМПАНИЯ",
    width: "xl:w-[101px]",
    links: [
      { label: "О\u00A0компании", href: "#about", hidden: true },
      { label: "Кейсы", href: "#cases", hidden: true },
      { label: "Блог", href: "#blog", hidden: true },
      { label: "Партнёрам", href: "#partners", hidden: true },
      { label: "Карьера", href: "#career", hidden: true },
    ],
  },
];

/** Группы с хотя бы одним видимым пунктом — только они попадают в разметку. */
const VISIBLE_GROUPS = NAV_GROUPS.map((group) => ({
  ...group,
  links: group.links.filter((link) => !link.hidden),
})).filter((group) => group.links.length > 0);

const CONTACTS = [
  { title: "Поддержка", email: "support_cowork@gigab2b.ru" },
  { title: "Остались вопросы", email: "info@gigab2b.ru" },
  { title: "Контакты для\u00A0СМИ", email: "press@gigab2b.ru" },
];

/**
 * Оба документа — PDF из public/legal. Раньше здесь стояли якоря #privacy и
 * #data-policy, которые никуда не вели. «Пользовательское соглашение» убрано:
 * такого документа нет.
 */
const POLICY_LINKS = [
  { label: "Политика конфиденциальности", href: LEGAL_PDF.privacy },
  { label: "Политика обработки данных", href: LEGAL_PDF.dataPolicy },
];

export function Footer() {
  return (
    <footer
      id="footer"
      className="w-full bg-bg-page bg-[linear-gradient(80.72deg,#c5f8e5_0.952%,#dcf9ff_50.802%,#e4f5ff_101.64%)] pb-32 pt-40 md:bg-[linear-gradient(32.43deg,#c5f8e5_0.952%,#dcf9ff_50.802%,#e4f5ff_101.64%)] md:pb-40 md:pt-48"
    >
      <div className="container-page flex flex-col gap-64">
        {/* Footer / Top Row — 720:2031 (desktop) / 741:2741 (mobile) */}
        <div className="flex flex-col gap-64 md:flex-row md:gap-64 min-[1440px]:gap-[160px]">
          {/* Footer / Brand Column — 720:2032 */}
          <div className="flex flex-col gap-40 md:w-[240px] md:shrink-0">
            <Link href="/" aria-label="GigaCowork" className="block w-[161px]">
              <Image
                src="/img/footer/logo-gigacowork.svg"
                alt="GigaCowork"
                width={161}
                height={34}
                className="h-[34px] w-[161px]"
              />
            </Link>
          </div>

          {/* Footer / Navigation Offset — 720:2038 */}
          <nav
            aria-label="Разделы сайта и\u00A0контакты"
            className="flex flex-col gap-40 md:grid md:flex-1 md:grid-cols-2 md:gap-x-64 md:gap-y-40 xl:flex xl:flex-row xl:gap-32 xl:gap-y-0 min-[1440px]:gap-64"
          >
            {VISIBLE_GROUPS.map((group) => (
              <div
                key={group.title}
                className={`flex flex-col gap-24 ${group.width}`}
              >
                <h2 className="text-body-l text-text-primary">{group.title}</h2>
                {/* Footer / Link List — 745:2735 */}
                <ul className="flex flex-col gap-8 text-body-m text-text-primary">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-link"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/*
              Footer / Contacts — 720:2034. Раньше стояли в колонке с логотипом;
              теперь это такая же колонка навигации, следом за «Сценариями».

              Типографика взята у соседних колонок: заголовок — Body/L, адреса —
              Body/M со стилями ссылок подвала. Прежний разовый размер 16px у
              почт убран, он не соответствовал ни одной ступени шкалы.
              Подписи над адресами остаются Caption: это метки, а не ссылки.
            */}
            <div className="flex flex-col gap-24 xl:w-[204px]">
              <h2 className="text-body-l text-text-primary">КОНТАКТЫ</h2>
              <ul className="flex flex-col gap-16 text-body-m text-text-primary">
                {CONTACTS.map((contact) => (
                  <li key={contact.email} className="flex flex-col gap-4">
                    <p className="text-caption text-text-secondary">
                      {contact.title}
                    </p>
                    <a href={`mailto:${contact.email}`} className="text-link">
                      {contact.email}
                    </a>
                  </li>
                ))}
              </ul>

              {/*
                Телеграм остаётся под адресами. Отступ у него свой, 16 вместо
                общих 24: иконка мельче строки с почтой, и на общем шаге она
                отрывалась от блока контактов и висела сама по себе.
              */}
              <a
                href="https://t.me/GenAIeffect"
                aria-label="Telegram-канал @GenAIeffect"
                target="_blank"
                rel="noreferrer noopener"
                className="-mt-8 block size-[27px] transition-opacity hover:opacity-70"
              >
                <Image
                  src="/img/footer/telegram.svg"
                  alt="Telegram"
                  width={27}
                  height={27}
                  className="size-[27px]"
                />
              </a>
            </div>
          </nav>
        </div>

        {/* Footer / Bottom Row — 720:2052 (desktop) / 741:2762 (mobile) */}
        <div className="flex flex-col gap-24 text-caption text-text-primary md:flex-row md:items-center md:justify-between md:gap-24">
          {/*
            Реквизиты. Перенос один — там же, где он стоит в присланном тексте;
            прежний дополнительный перенос «только для мобильного» убран: он был
            рассчитан на старую строку и теперь рвал адрес в случайном месте.
          */}
          <p className="md:w-[567px]">
            {LEGAL_LINES[0]}
            <br />
            {LEGAL_LINES[1]}
          </p>

          {/*
            Footer / Policy Links — 746:2735 (desktop) / 748:2735 (mobile).
            Обычные <a>, а не next/link: это PDF из public, маршрутизация
            роутера им не нужна, а открываются они в новой вкладке.
          */}
          <ul className="flex flex-col gap-12 md:flex-row md:gap-32">
            {POLICY_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-link whitespace-nowrap"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
