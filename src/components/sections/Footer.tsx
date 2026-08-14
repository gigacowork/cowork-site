import Image from "@/components/ui/Image";
import Link from "next/link";

/**
 * Footer
 * Figma desktop: 1927:15641 (px 120 / pt 48 / pb 40, gap 64, top row gap 160,
 *   brand column 240, nav offset 791, groups gap 64, gradient 32.43deg)
 * Figma mobile:  1927:17443 (px 16 / pt 40 / pb 32, gap 64, single column,
 *   nav groups gap 40, gradient 80.72deg)
 */

type NavGroup = {
  title: string;
  width: string;
  links: { label: string; href: string }[];
};

const NAV_GROUPS: NavGroup[] = [
  {
    title: "ПЛАТФОРМА",
    width: "xl:w-[178px]",
    links: [
      { label: "Обзор платформы", href: "#platform" },
      { label: "Что нового", href: "#whats-new" },
      { label: "Пространства", href: "#spaces" },
      { label: "ИИ-агенты", href: "#agents" },
      { label: "Навыки", href: "#skills" },
      { label: "Быстрые команды", href: "#commands" },
      { label: "Коннекторы", href: "#connectors" },
      { label: "Запуск по расписанию", href: "#schedule" },
      { label: "Безопасность", href: "#security" },
      { label: "Помощь и поддержка", href: "#support" },
    ],
  },
  {
    title: "СЦЕНАРИИ",
    width: "xl:w-[163px]",
    links: [
      { label: "Работа с документами", href: "#docs" },
      { label: "Аналитика и отчётность", href: "#analytics" },
      { label: "База знаний", href: "#knowledge" },
      { label: "Клиентский сервис", href: "#service" },
      { label: "HR и кадры", href: "#hr" },
      { label: "Финансы и контроль", href: "#finance" },
      { label: "Юридические задачи", href: "#legal" },
    ],
  },
  {
    title: "ПОСТАВКИ",
    width: "xl:w-[142px]",
    links: [
      { label: "Облако", href: "#cloud" },
      { label: "Гибрид", href: "#hybrid" },
      { label: "ПАК", href: "#pak" },
      { label: "Сравнить варианты", href: "#compare" },
    ],
  },
  {
    title: "КОМПАНИЯ",
    width: "xl:w-[101px]",
    links: [
      { label: "О компании", href: "#about" },
      { label: "Кейсы", href: "#cases" },
      { label: "Блог", href: "#blog" },
      { label: "Партнёрам", href: "#partners" },
      { label: "Карьера", href: "#career" },
    ],
  },
];

const POLICY_LINKS = [
  { label: "Политика конфиденциальности", href: "#privacy" },
  { label: "Политика обработки данных", href: "#data-policy" },
  { label: "Пользовательское соглашение", href: "#terms" },
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

            {/* Footer / Contacts — 720:2034 */}
            <div className="flex flex-col gap-24">
              <a
                href="https://t.me/"
                aria-label="Telegram"
                target="_blank"
                rel="noreferrer noopener"
                className="block size-[27px] transition-opacity hover:opacity-70"
              >
                <Image
                  src="/img/footer/telegram.svg"
                  alt="Telegram"
                  width={27}
                  height={27}
                  className="size-[27px]"
                />
              </a>
              <p className="text-[16px] leading-[1.3] tracking-normal text-text-primary">
                <a
                  href="mailto:info@gigab2b.ru"
                  className="text-link"
                >
                  info@gigab2b.ru
                </a>
              </p>
              <p className="text-[16px] leading-[1.3] tracking-normal text-text-primary">
                <a
                  href="mailto:press@gigab2b.ru"
                  className="text-link"
                >
                  press@gigab2b.ru
                </a>
                {" — для СМИ"}
              </p>
            </div>
          </div>

          {/* Footer / Navigation Offset — 720:2038 */}
          <nav
            aria-label="Разделы сайта"
            className="flex flex-col gap-40 md:grid md:flex-1 md:grid-cols-2 md:gap-x-64 md:gap-y-40 xl:flex xl:flex-row xl:gap-32 xl:gap-y-0 min-[1440px]:gap-64"
          >
            {NAV_GROUPS.map((group) => (
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
          </nav>
        </div>

        {/* Footer / Bottom Row — 720:2052 (desktop) / 741:2762 (mobile) */}
        <div className="flex flex-col gap-24 text-caption text-text-primary md:flex-row md:items-center md:justify-between md:gap-24">
          <p className="md:w-[567px]">
            © 2026 ГигаЧат Бизнес · ООО «Салют для Бизнеса»
            <br />
            {`121170, г. Москва, Садовая-Самотёчная ул., 24/27 · `}
            <br className="md:hidden" />
            ИНН 7804568396
          </p>

          {/* Footer / Policy Links — 746:2735 (desktop) / 748:2735 (mobile) */}
          <ul className="flex flex-col gap-12 md:flex-row md:gap-32">
            {POLICY_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-link whitespace-nowrap"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
