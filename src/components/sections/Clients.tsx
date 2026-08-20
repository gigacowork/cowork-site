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

function LogoItem({ logo }: { logo: ClientLogo }) {
  return (
    <li className="flex shrink-0 items-center justify-center">
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
function MarqueeGroup({ clone = false }: { clone?: boolean }) {
  return (
    <ul
      aria-hidden={clone || undefined}
      className="marquee-group flex shrink-0 items-center"
    >
      {LOGOS.map((logo) => (
        <LogoItem key={logo.src} logo={logo} />
      ))}
    </ul>
  );
}

export function Clients() {
  return (
    <section id="clients" className="bg-bg-page py-64">
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
          <MarqueeGroup />
          <MarqueeGroup clone />
        </div>
      </div>

      {/* md и выше — статичный ряд 84px из макета */}
      <div className="container-page hidden md:block">
        <ul className="flex h-[84px] items-center justify-between">
          {LOGOS.map((logo) => (
            <LogoItem key={logo.src} logo={logo} />
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Clients;
