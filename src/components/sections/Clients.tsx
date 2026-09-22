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
 * на десктопном холсте «Partners / Desktop 1440» (4905:26854), исходники —
 * «Исходники партнеры/Partners logo».
 *
 * Порядок и высоты — из макета, слева направо. Высота у каждого своя, и это
 * не произвол: у логотипов разное устройство — чистая надпись (Profit,
 * Napoleon IT, АБАК) занимает высотой всю себя, а надпись со знаком
 * (Astraway, «Простор», «Открытые Решения») отдаёт часть высоты знаку, и при
 * равной высоте её буквы вышли бы мельче соседних.
 *
 * Ряд пересобрали: добавились N3.Tech и «Открытые Решения», а SMART
 * technologies, Nicotech и true.code, которых раньше не хватало файлами,
 * из ряда убрали — так что незакрытых пропусков в списке больше нет.
 *
 * Высоты переписаны целиком и сверены с макетом заново: 22 / 15 / 15 / 30 /
 * 13 / 30 / 17 / 30 / 13. Ряд в макете ещё правят, так что при следующем
 * заходе числа стоит перечитать, а не считать эти окончательными.
 *
 * Ширину считает браузер по пропорции: у всех девяти файлов пропорция
 * сходится с макетом (например, napoleon-it 371×30 при высоте 13 даёт 160.8
 * против 161 в макете).
 *
 * Два новых файла выгружены из Figma через плагинный экспорт (домен ассетов
 * закрыт политикой сети). В «Открытых Решениях» белым залита мелкая подпись
 * под основным начертанием — это вторая, выворотная строка внутри того же
 * файла; в макете она так же не видна на светлом фоне, поэтому файл оставлен
 * как есть. Сам знак — чёрный: если он вдруг рассыпался на отдельные
 * чёрточки, значит подтянулась старая выгрузка, где три дуги были белыми.
 */
export const PARTNER_LOGOS: ClientLogo[] = [
  {
    name: "ТехноЯрд",
    src: "/img/partners/logos/technoyard.svg",
    width: 114,
    height: 30,
    sizeClassName: "h-[22px] w-auto",
  },
  {
    name: "N3.Tech",
    src: "/img/partners/logos/n3tech.svg",
    width: 73,
    height: 15,
    sizeClassName: "h-[15px] w-auto",
  },
  {
    name: "Profit",
    src: "/img/partners/logos/profit.svg",
    width: 95,
    height: 22,
    sizeClassName: "h-[15px] w-auto",
  },
  {
    name: "Открытые Решения",
    src: "/img/partners/logos/open-solutions.svg",
    width: 69,
    height: 24,
    sizeClassName: "h-[30px] w-auto",
  },
  {
    name: "Napoleon IT",
    src: "/img/partners/logos/napoleon-it.svg",
    width: 371,
    height: 30,
    sizeClassName: "h-[13px] w-auto",
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
    width: 101,
    height: 30,
    sizeClassName: "h-[17px] w-auto",
  },
  {
    name: "Astraway",
    src: "/img/partners/logos/astraway.svg",
    width: 168,
    height: 50,
    sizeClassName: "h-[30px] w-auto",
  },
  {
    name: "АБАК",
    src: "/img/partners/logos/abak.svg",
    width: 333,
    height: 30,
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
    её задаёт `marquee-wide`) плюс отступы внутри элемента. Менять только
    зазор нельзя — на стыке копий он не удвоится, и шаг «поплывёт».

    Ниже md шаг вдвое меньше: 24 + 40 вместо 48 + 80. На узком экране
    десктопная отбивка растаскивала ряд так, что в кадр попадали один-два
    логотипа. Вторая половина шага — в globals.css, у `.marquee-wide`.
  */
  const itemClassName = alwaysMarquee ? "px-24 md:px-48" : "";
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
