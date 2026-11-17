import Image from "@/components/ui/Image";
import type { CSSProperties } from "react";

/**
 * Clients — логотипы клиентов после блока «Не тратьте часы…».
 * Исходный ряд Figma 1927:15582 дополнен логотипами из кейсов.
 * Три независимые дорожки показывают весь набор на любой ширине экрана.
 */

type ClientLogo = {
  /** имя слоя Figma: "Logo / <name>" */
  name: string;
  src: string;
  /** собственный размер SVG */
  width: number;
  height: number;
  sizeClassName: string;
};

/** Исходный ряд из макета остаётся первым. */
const FEATURED_LOGOS: ClientLogo[] = [
  {
    name: "PhosAgro",
    src: "/img/clients/phosagro.svg",
    width: 150,
    height: 36,
    sizeClassName: "h-[36px] w-[150px]",
  },
  {
    name: "Frank Auto",
    src: "/img/clients/frank-auto.svg",
    width: 135,
    height: 35,
    sizeClassName: "h-[35px] w-[135px]",
  },
  {
    name: "Sber Auto",
    src: "/img/clients/sber-auto.svg",
    width: 158,
    height: 26,
    sizeClassName: "h-[26px] w-[158px]",
  },
  {
    name: "Directum",
    src: "/img/clients/directum.svg",
    width: 135,
    height: 35,
    sizeClassName: "h-[35px] w-[135px]",
  },
  {
    name: "BI Group",
    src: "/img/clients/bi-group.svg",
    width: 148,
    height: 29,
    sizeClassName: "h-[29px] w-[148px]",
  },
  {
    name: "АПРИ",
    src: "/img/clients/apri.svg",
    width: 112,
    height: 36,
    sizeClassName: "h-[36px] w-[112px]",
  },
];

/** Логотипы из кейсов: те же тёмные одноцветные SVG и прозрачный фон, что у первого ряда. */
const caseLogo = (name: string, slug: string, width: number, height: number): ClientLogo => ({
  name,
  src: `/img/clients/cases/${slug}.svg`,
  width,
  height,
  sizeClassName: "h-auto max-w-full object-contain",
});

const CASE_LOGOS: ClientLogo[] = [
  caseLogo("АСП", "asp", 105, 105),
  caseLogo("Fishstat", "fishstat", 90, 46),
  caseLogo("Победа", "pobeda", 82, 59),
  caseLogo("Телефоника", "telefonika", 150, 33),
  caseLogo("Универсал", "universal", 70, 70),
  caseLogo("Element", "element", 210, 19),
  caseLogo("АКС", "aks", 90, 36),
  caseLogo("Алека", "aleka", 200, 14),
  caseLogo("Альянс", "alliance", 135, 37),
  caseLogo("ВМЕСТЕ", "vmeste", 150, 38),
  caseLogo("ЛогЛаб", "loglab", 117, 46),
  caseLogo("НВМ", "nvm", 185, 22),
  caseLogo("Национальная юридическая коллегия", "nyuk", 105, 53),
  caseLogo("ПЛАТО", "plato", 170, 22),
  caseLogo("РАЗУМ", "razum", 145, 32),
  caseLogo("СМИТ", "smit", 135, 30),
  caseLogo("Терминал Ильинка", "terminal-ilyinka", 135, 45),
  caseLogo("Тренд-Групп", "trend-group", 115, 95),
  caseLogo("УралМетХим", "uralmetkhim", 67, 61),
  caseLogo("Эволента", "evolenta", 160, 54),
  caseLogo("Элси", "elsi", 46, 60),
];

const LOGOS = [...FEATURED_LOGOS, ...CASE_LOGOS];
const logoRows = (logos: ClientLogo[]) =>
  Array.from({ length: 3 }, (_, row) => logos.filter((_, index) => index % 3 === row));

/**
 * Логотипы партнёров (страница «Партнёрам»). Макет — All Partners / Logo
 * All Partners / Logo (5679:29884): 16 логотипов в порядке макета. Размеры
 * заданы по каждому слоту; новые SVG взяты из векторных слоёв этого узла.
 */
export const PARTNER_LOGOS: ClientLogo[] = [
  {
    name: "N3.Tech",
    src: "/img/partners/logos/n3tech.svg",
    width: 73,
    height: 15,
    sizeClassName: "h-[15px] w-auto",
  },
  {
    name: "true.code",
    src: "/img/partners/logos/true-code.svg",
    width: 107,
    height: 26,
    sizeClassName: "h-[26px] w-auto",
  },
  {
    name: "ZeBrains",
    src: "/img/partners/logos/zebrains.svg",
    width: 148,
    height: 15,
    sizeClassName: "h-[15px] w-auto",
  },
  {
    name: "Napoleon IT",
    src: "/img/partners/logos/napoleon-it.svg",
    width: 161,
    height: 13,
    sizeClassName: "h-[13px] w-auto",
  },
  {
    name: "Платформикс",
    src: "/img/partners/logos/platformix.svg",
    width: 109,
    height: 24,
    sizeClassName: "h-[24px] w-auto",
  },
  {
    name: "Nicotech",
    src: "/img/partners/logos/nicotech.svg",
    width: 114,
    height: 22,
    sizeClassName: "h-[22.164px] w-[113.799px] -scale-y-100 translate-y-[4px]",
  },
  {
    name: "Profit",
    src: "/img/partners/logos/profit.svg",
    width: 67,
    height: 15,
    sizeClassName: "h-[15px] w-auto",
  },
  {
    name: "Ametist",
    src: "/img/partners/logos/ametist.svg",
    width: 130,
    height: 30,
    sizeClassName: "h-[30px] w-auto",
  },
  {
    name: "Astraway",
    src: "/img/partners/logos/astraway.svg",
    width: 101,
    height: 30,
    sizeClassName: "h-[30px] w-auto",
  },
  {
    name: "ТехноЯрд",
    src: "/img/partners/logos/technoyard.svg",
    width: 83,
    height: 22,
    sizeClassName: "h-[22px] w-auto",
  },
  {
    name: "Элрос",
    src: "/img/partners/logos/elros.svg",
    width: 65,
    height: 26,
    sizeClassName: "h-[26px] w-auto",
  },
  {
    name: "Открытые Решения",
    src: "/img/partners/logos/open-solutions.svg",
    width: 69,
    height: 24,
    sizeClassName: "h-[30px] w-auto",
  },
  {
    name: "AXBITGROUP",
    src: "/img/partners/logos/axbitgroup.svg",
    width: 152,
    height: 26,
    sizeClassName: "h-[26px] w-auto",
  },
  {
    name: "Простор",
    src: "/img/partners/logos/prostor.svg",
    width: 242,
    height: 50,
    sizeClassName: "h-[30px] w-auto",
  },
  {
    name: "SWC",
    src: "/img/partners/logos/swc.svg",
    width: 56,
    height: 17,
    sizeClassName: "h-[17px] w-auto",
  },
  {
    name: "АБАК",
    src: "/img/partners/logos/abak.svg",
    width: 148,
    height: 13,
    sizeClassName: "h-[13px] w-auto",
  },
];

function LogoItem({
  logo,
  className = "",
  marquee = false,
}: {
  logo: ClientLogo;
  className?: string;
  marquee?: boolean;
}) {
  const marqueeSize = marquee
    ? ({
        "--logo-width": `${logo.width}px`,
        "--logo-height": `${logo.height}px`,
        "--logo-mobile-width": `${Math.round(logo.width * 0.72)}px`,
        "--logo-mobile-height": `${Math.round(logo.height * 0.72)}px`,
      } as CSSProperties)
    : undefined;

  return (
    <li className={`flex shrink-0 items-center justify-center ${className}`}>
      <Image
        src={logo.src}
        alt={logo.name}
        width={logo.width}
        height={logo.height}
        className={marquee ? "clients-logo-image" : logo.sizeClassName}
        style={marqueeSize}
      />
    </li>
  );
}

/** Одна группа дорожки. Копия — только картинка, её скринридер не читает. */
function MarqueeGroup({
  logos,
  clone = false,
}: {
  logos: ClientLogo[];
  clone?: boolean;
}) {
  return (
    <ul
      aria-hidden={clone || undefined}
      className="marquee-group flex shrink-0 items-center"
    >
      {logos.map((logo) => (
        <LogoItem key={logo.src} logo={logo} marquee className="h-[80px] md:h-[108px]" />
      ))}
    </ul>
  );
}

/**
 * По умолчанию — три бегущие строки клиентов. На странице «Партнёрам»
 * переданный набор выводится неподвижной плиткой.
 */
export function Clients({
  logos = LOGOS,
  id = "clients",
  tiled = false,
  paddingClassName = "py-64",
}: {
  logos?: ClientLogo[];
  id?: string;
  /** Неподвижная сетка логотипов на странице партнёров. */
  tiled?: boolean;
  /**
   * Вертикальные отступы секции.
   */
  paddingClassName?: string;
} = {}) {
  if (tiled) {
    return (
      <section id={id} className={`bg-bg-page ${paddingClassName}`}>
        <ul aria-label="Логотипы партнёров" className="container-page grid grid-cols-1 gap-12 min-[360px]:grid-cols-2 md:grid-cols-3 md:gap-16 lg:grid-cols-5">
          {logos.map((logo) => (
            <LogoItem
              key={logo.src}
              logo={logo}
              className="h-[96px] min-w-0 rounded-24 bg-[#f7f8fa] md:h-[112px]"
            />
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section id={id} className={`bg-bg-page ${paddingClassName}`}>
      <div className="flex flex-col gap-6 md:gap-10">
        {logoRows(logos).map((row, index) => (
          <div
            key={index}
            className="overflow-hidden motion-reduce:overflow-x-auto"
            style={{
              maskImage:
                "linear-gradient(to right, transparent, #000 32px, #000 calc(100% - 32px), transparent)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent, #000 32px, #000 calc(100% - 32px), transparent)",
            }}
          >
            <div className={`marquee clients-marquee flex w-max items-center ${index === 1 ? "clients-marquee-reverse" : ""}`}>
              <MarqueeGroup logos={row} />
              <MarqueeGroup logos={row} clone />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Clients;
