import Image from "next/image";

/**
 * Clients — полоса логотипов клиентов
 * Figma desktop: 1927:15582 (All_clients — px 80 / py 64, ряд 1203×84, justify-between)
 * Figma mobile:  1927:17385 (All_clients — px 16 / py 64, два ряда: gap 12 и gap 24,
 *                            между рядами 16; размеры логотипов = desktop × 0.625)
 */

type ClientLogo = {
  /** имя слоя Figma: "Logo / <name>" */
  name: string;
  src: string;
  /** собственный размер SVG (desktop) */
  width: number;
  height: number;
  /** mobile size / md: desktop size */
  sizeClassName: string;
};

/** Мобильный «Logos / Row 1» */
const ROW_1: ClientLogo[] = [
  {
    name: "PhosAgro",
    src: "/img/clients/phosagro.svg",
    width: 132,
    height: 32,
    sizeClassName: "h-[20px] w-[82.5px] md:h-[32px] md:w-[132px]",
  },
  {
    name: "Frank Auto",
    src: "/img/clients/frank-auto.svg",
    width: 111,
    height: 29,
    sizeClassName: "h-[18.125px] w-[69.338px] md:h-[29px] md:w-[110.941px]",
  },
  {
    name: "Sber Auto",
    src: "/img/clients/sber-auto.svg",
    width: 134,
    height: 22,
    sizeClassName: "h-[13.252px] w-[83.75px] md:h-[21.203px] md:w-[134px]",
  },
];

/** Мобильный «Logos / Row 2» */
const ROW_2: ClientLogo[] = [
  {
    name: "Directum",
    src: "/img/clients/directum.svg",
    width: 116,
    height: 30,
    sizeClassName: "h-[18.75px] w-[72.5px] md:h-[30px] md:w-[116px]",
  },
  {
    name: "BI Group",
    src: "/img/clients/bi-group.svg",
    width: 134,
    height: 26,
    sizeClassName: "h-[16.25px] w-[83.75px] md:h-[26px] md:w-[134px]",
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

export function Clients() {
  return (
    <section id="clients" className="bg-bg-page py-64">
      <div className="container-page">
        {/* mobile: две центрированные строки; md: одна строка 84px c justify-between */}
        <div className="flex flex-col items-center gap-16 md:h-[84px] md:flex-row md:justify-between md:gap-0">
          <ul className="flex w-full items-center justify-center gap-12 overflow-clip md:contents">
            {ROW_1.map((logo) => (
              <LogoItem key={logo.src} logo={logo} />
            ))}
          </ul>
          <ul className="flex w-full items-center justify-center gap-24 overflow-clip md:contents">
            {ROW_2.map((logo) => (
              <LogoItem key={logo.src} logo={logo} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default Clients;
