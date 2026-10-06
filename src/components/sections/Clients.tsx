import Image from "@/components/ui/Image";

/**
 * Clients — полоса логотипов клиентов
 * Figma desktop: 1927:15582 (All_clients — px 80 / py 64, ряд 1203×84, justify-between)
 * Figma mobile:  1927:17385 (All_clients — px 16 / py 64, два ряда: gap 12 и gap 24,
 *                            размеры логотипов = desktop × 0.625)
 *
 * Ниже md вместо двух рядов уменьшенных логотипов идёт бегущая строка: ряд
 * такой же, как на десктопе, и логотипы в полный размер — в две строки по 390
 * они помещались только уменьшенными до 62%, и мелкие начертания («Sber Auto»,
 * «Directum») читались с трудом. Прокрутка бесконечная, поэтому список не
 * упирается в край экрана.
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

/** Порядок — как в десктопном ряду (1927:15582), слева направо. */
const LOGOS: ClientLogo[] = [
  {
    name: "PhosAgro",
    src: "/img/clients/phosagro.svg",
    width: 132,
    height: 32,
    sizeClassName: "h-[32px] w-[132px]",
  },
  {
    name: "Frank Auto",
    src: "/img/clients/frank-auto.svg",
    width: 111,
    height: 29,
    sizeClassName: "h-[29px] w-[110.941px]",
  },
  {
    name: "Sber Auto",
    src: "/img/clients/sber-auto.svg",
    width: 134,
    height: 22,
    sizeClassName: "h-[21.203px] w-[134px]",
  },
  {
    name: "Directum",
    src: "/img/clients/directum.svg",
    width: 116,
    height: 30,
    sizeClassName: "h-[30px] w-[116px]",
  },
  {
    name: "BI Group",
    src: "/img/clients/bi-group.svg",
    width: 134,
    height: 26,
    sizeClassName: "h-[26px] w-[134px]",
  },
];

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
}: {
  logo: ClientLogo;
  className?: string;
}) {
  return (
    <li className={`flex shrink-0 items-center justify-center ${className}`}>
      <Image
        src={logo.src}
        alt={logo.name}
        width={logo.width}
        height={logo.height}
        className={logo.sizeClassName}
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
        <LogoItem key={logo.src} logo={logo} />
      ))}
    </ul>
  );
}

/**
 * По умолчанию — ряд логотипов клиентов. На странице «Партнёрам» тот же набор
 * элементов выводится неподвижной плиткой.
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
   * Вертикальные отступы секции. По умолчанию 64 сверху и снизу; на главной
   * снизу больше — там выше стоит блок с прокруткой, он оставляет за собой
   * свой хвост, и при равных отступах воздух над логотипами читался вдвое
   * шире, чем под ними.
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
      {/*
        Бегущая строка — ниже md. Она идёт во всю ширину экрана, без
        container-page: полоса, обрезанная по колонке, читалась бы как
        сломанная вёрстка, а не как прокрутка. Края растворяются маской,
        поэтому логотипы не обрубаются на границе.
      */}
      <div
        className="overflow-hidden md:hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, #000 32px, #000 calc(100% - 32px), transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, #000 32px, #000 calc(100% - 32px), transparent)",
        }}
      >
        <div className="marquee flex w-max items-center">
          <MarqueeGroup logos={logos} />
          <MarqueeGroup logos={logos} clone />
        </div>
      </div>

      {/* md и выше — статичный ряд 84px из макета */}
      <div className="container-page hidden md:block">
        <ul className="flex h-[84px] items-center justify-between gap-24">
          {logos.map((logo) => (
            <LogoItem key={logo.src} logo={logo} />
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Clients;
