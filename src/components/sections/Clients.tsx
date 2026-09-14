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
 * Логотипы партнёров (страница «Партнёрам»).
 *
 * Высота подобрана оптически, а не одним числом. У Astraway и «Простора»
 * в исходник входит знак, из-за него при общей высоте их надписи выходили
 * заметно мельче соседних. У АБАК, Napoleon IT и SWC высота на 20% ниже
 * базовых 28 — это чистые надписи, и при равной высоте они перевешивали ряд.
 * Ширину считает браузер по пропорции.
 */
export const PARTNER_LOGOS: ClientLogo[] = [
  {
    name: "Astraway",
    src: "/img/partners/logos/astraway.svg",
    width: 168,
    height: 50,
    sizeClassName: "h-[40px] w-auto",
  },
  {
    name: "Abak",
    src: "/img/partners/logos/abak.svg",
    width: 333,
    height: 30,
    sizeClassName: "h-[22px] w-auto",
  },
  {
    name: "Napoleon IT",
    src: "/img/partners/logos/napoleon-it.svg",
    width: 371,
    height: 30,
    sizeClassName: "h-[22px] w-auto",
  },
  {
    name: "SWC",
    src: "/img/partners/logos/swc.svg",
    width: 101,
    height: 30,
    sizeClassName: "h-[22px] w-auto",
  },
  {
    name: "Простор",
    src: "/img/partners/logos/prostor.svg",
    width: 242,
    height: 50,
    sizeClassName: "h-[36px] w-auto",
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
  itemClassName = "",
}: {
  logos: ClientLogo[];
  clone?: boolean;
  itemClassName?: string;
}) {
  return (
    <ul
      aria-hidden={clone || undefined}
      className="marquee-group flex shrink-0 items-center"
    >
      {logos.map((logo) => (
        <LogoItem key={logo.src} logo={logo} className={itemClassName} />
      ))}
    </ul>
  );
}

/**
 * По умолчанию — клиенты (главная и остальные страницы). На «Партнёрам» тот же
 * ряд показывает логотипы партнёров, поэтому список приходит снаружи, а `id`
 * меняется, чтобы якорь `#clients` не оказался на странице дважды.
 */
export function Clients({
  logos = LOGOS,
  id = "clients",
  alwaysMarquee = false,
  paddingClassName = "py-64",
}: {
  logos?: ClientLogo[];
  id?: string;
  /** Бегущая строка на всех ширинах, а не только ниже md (для «Партнёрам»). */
  alwaysMarquee?: boolean;
  /**
   * Вертикальные отступы секции. По умолчанию 64 сверху и снизу; на главной
   * снизу больше — там выше стоит блок с прокруткой, он оставляет за собой
   * свой хвост, и при равных отступах воздух над логотипами читался вдвое
   * шире, чем под ними.
   */
  paddingClassName?: string;
} = {}) {
  /*
    У партнёрских логотипов нет полей внутри файлов, и ряд читался слитно.
    Отбивка набирается двумя частями: зазор дорожки (переменная в globals,
    её удваивает `marquee-wide`) плюс отступы внутри элемента. Менять только
    зазор нельзя — на стыке копий он не удвоится, и шаг «поплывёт».
  */
  const itemClassName = alwaysMarquee ? "px-48" : "";
  const marqueeClassName = alwaysMarquee ? "marquee-wide" : "";
  return (
    <section id={id} className={`bg-bg-page ${paddingClassName}`}>
      {/*
        Бегущая строка — ниже md. Она идёт во всю ширину экрана, без
        container-page: полоса, обрезанная по колонке, читалась бы как
        сломанная вёрстка, а не как прокрутка. Края растворяются маской,
        поэтому логотипы не обрубаются на границе.
      */}
      <div
        className={`overflow-hidden ${alwaysMarquee ? "" : "md:hidden"}`}
        style={{
          maskImage:
            "linear-gradient(to right, transparent, #000 32px, #000 calc(100% - 32px), transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, #000 32px, #000 calc(100% - 32px), transparent)",
        }}
      >
        <div className={`marquee flex w-max items-center ${marqueeClassName}`}>
          <MarqueeGroup logos={logos} itemClassName={itemClassName} />
          <MarqueeGroup logos={logos} clone itemClassName={itemClassName} />
        </div>
      </div>

      {/* md и выше — статичный ряд 84px из макета (если лента не бежит всегда) */}
      <div
        className={`container-page hidden ${alwaysMarquee ? "" : "md:block"}`}
      >
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
