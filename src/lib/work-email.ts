/**
 * Публичные почтовые домены, которые не подходят для B2B-заявки.
 * Корпоративный домен остаётся допустимым, даже если его почта размещена
 * у одного из этих провайдеров.
 */
const PERSONAL_EMAIL_DOMAINS = new Set([
  "gmail.com", "googlemail.com", "mail.ru", "bk.ru", "list.ru", "inbox.ru",
  "internet.ru", "yandex.ru", "yandex.com", "ya.ru", "rambler.ru",
  "yahoo.com", "outlook.com", "hotmail.com", "live.com", "msn.com",
  "icloud.com", "me.com", "proton.me", "protonmail.com", "tuta.com",
  "tutanota.com", "aol.com", "gmx.com", "gmx.de", "web.de", "qq.com",
  "163.com", "126.com",
]);

/** Текст ошибки или пустая строка. Проверка выполняется в браузере. */
export function workEmailError(value: string): string {
  const email = value.trim().toLowerCase();
  const invalid = "Проверьте адрес: например, name@company.ru";

  if (
    email.length > 254 ||
    !/^[^\s@]{1,64}@[a-z0-9а-яё-]+(?:\.[a-z0-9а-яё-]+)+$/i.test(email)
  ) return invalid;

  const domain = email.split("@")[1];
  const labels = domain.split(".");
  if (
    labels.some((label) => label.startsWith("-") || label.endsWith("-")) ||
    labels.at(-1)!.length < 2
  ) return invalid;

  return PERSONAL_EMAIL_DOMAINS.has(domain)
    ? "Укажите почту на домене компании"
    : "";
}
