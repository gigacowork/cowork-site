/**
 * Kicker (2972:16059) — подпись-пилюля над заголовком секции.
 *
 * Вынесена из страницы «О платформе», где такой же компонент был локальным:
 * страницы «Для кого» используют её в трёх блоках, дублировать разметку смысла
 * нет. Регистр поднимается стилем, а не в тексте, — так подпись остаётся
 * читаемой для скринридера и в поиске.
 */
export function Kicker({
  children,
  className = "",
}: {
  children: React.ReactNode;
  /**
   * Выключка внутри своей колонки. На страницах «Для кого» заголовки и текст
   * ниже md стоят по левому краю, а сама пилюля остаётся по центру — там ей
   * передаётся `self-center md:self-start`.
   */
  className?: string;
}) {
  return (
    <span
      className={`w-fit rounded-full bg-bg-glass py-4 pl-12 pr-[14px] text-caption text-text-secondary uppercase ${className}`}
    >
      {children}
    </span>
  );
}

export default Kicker;
