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
/**
 * `blank` — пункт открывается в новой вкладке, как и в шапке. Нужен
 * документации: она лежит отдельной статикой в `public/docs`, а не страницей
 * сайта.
 */
type NavLink = {
  label: string;
  href: string;
  hidden?: boolean;
  blank?: boolean;
};

type NavGroup = {
  title: string;
  width: string;
  links: NavLink[];
};

/**
 * Подписи сценариев, которые в подвале называются не так, как в справочнике.
 *
 * Обычно подпись одна на оба меню — она лежит в `navLabel` справочника ролей.
 * «Управленческие решения» в меню называются «Для руководителей»;
 * в хлебных крошках остаётся название страницы, поэтому справочник не меняем.
 */
const FOOTER_LABELS: Record<string, string> = {
  ceo: "Для\u00A0руководителей",
};

const NAV_GROUPS: NavGroup[] = [
  {
    title: "ПЛАТФОРМА",
    width: "xl:w-[178px]",
    links: [
      /*
        Адреса — из структуры проекта (ПРОЕКТ_COWORK_RU.md) и совпадают с
        раскрывашкой «О платформе» в шапке. Раньше здесь стояли «#platform» и
        «#whats-new» — якоря, которых на сайте нет ни на одной странице: обе
        ссылки просто дописывали решётку к текущему адресу и никуда не вели.
      */
      { label: "Обзор платформы", href: "/ai-platform" },
      { label: "Рабочие пространства", href: "/ai-platform/workspace" },
      { label: "ИИ-агенты", href: "/ai-platform/agents" },
      { label: "Навыки", href: "/ai-platform/skill" },
      { label: "Интеграции", href: "/ai-platform/connectors" },
      { label: "Быстрые команды", href: "/ai-platform/quick-commands" },
      { label: "Задачи по\u00A0расписанию", href: "/ai-platform/schedule" },
      { label: "Что\u00A0нового", href: "/ai-platform/new-features" },
      /*
        Адрес со слэшем на конце — как в шапке: документация лежит статикой в
        public, и без слэша сервер отдаёт редирект вместо самой страницы.
      */
      { label: "Документация", href: "/docs/", blank: true },
      { label: "Безопасность", href: "/trust-and-safety" },
      { label: "Помощь и\u00A0поддержка", href: "/support" },
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
      label: FOOTER_LABELS[item.slug] ?? item.navLabel,
      href: `/use_cases/${item.slug}`,
    })),
  },
  {
    title: "ПОСТАВКИ",
    width: "xl:w-[142px]",
    links: [
      /*
        Отдельных страниц под варианты поставки нет — все три живут секциями
        на /pricing, поэтому ссылки якорные. Раньше здесь стояли голые «#cloud»
        и прочие, которые дописывали решётку к текущему адресу и никуда не вели.
      */
      { label: "Облако", href: "/pricing#cloud" },
      { label: "Гибрид", href: "/pricing#hybrid" },
      { label: "ПАК", href: "/pricing#pak" },
      { label: "Сравнить варианты", href: "/pricing#compare" },
    ],
  },
  {
    title: "КОМПАНИЯ",
    width: "xl:w-[101px]",
    links: [
      { label: "О\u00A0компании", href: "/company/about" },
      { label: "Кейсы", href: "/special-project/" },
      { label: "Блог", href: "#blog", hidden: true },
      { label: "Партнёрам", href: "/company/partners" },
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

const TELEGRAM_LINKS = [
  {
    label: "Канал про ИИ",
    href: "https://t.me/GenAIeffect",
    image: "/img/footer/telegram-channel.svg",
  },
  {
    label: "Сообщество",
    href: "https://t.me/+r9RKQYQnJ7JlMTli",
    image: "/img/footer/telegram-community.svg",
  },
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
                        {...(link.blank
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : null)}
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
              <ul className="flex flex-col items-start gap-[16px]">
                {TELEGRAM_LINKS.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-[18px] rounded-full bg-white p-[8px] text-caption tracking-[-0.02em] text-text-secondary transition-colors hover:bg-white/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary"
                    >
                      <Image src={item.image} alt="" width={27} height={27} className="block size-[27px] shrink-0" />
                      <span className="whitespace-nowrap">{item.label}</span>
                      <Image src="/img/footer/telegram-link.svg" alt="" width={27} height={27} className="block size-[27px] shrink-0" />
                    </a>
                  </li>
                ))}
              </ul>
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
            Ссылка на ИТ-аккредитацию и документы. Страница открывается
            внутри сайта, PDF — в новой вкладке.
          */}
          <ul className="flex flex-col gap-12 md:flex-row md:flex-wrap md:justify-end md:gap-x-32 md:gap-y-12">
            <li>
              <Link href="/it_accreditation/" className="text-link whitespace-nowrap">
                ИТ-аккредитация
              </Link>
            </li>
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
