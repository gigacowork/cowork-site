/**
 * Ссылка внутри правового текста под кнопкой формы.
 * Figma 549:222 — Text Link на status-accent #8c8fe4, подчёркивание по наведению.
 *
 * Отдельный компонент, потому что таких текстов на сайте два — под формой
 * заявки и под формой «Опишите задачу», — и оформление у ссылок общее.
 * Документы открываются в новой вкладке: это PDF, и уводить с заполненной
 * формы нельзя.
 */
export function LegalLink({
  href,
  children,
}: {
  href: string;
  children: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="cursor-pointer text-status-accent underline-offset-2 hover:underline"
    >
      {children}
    </a>
  );
}

export default LegalLink;
