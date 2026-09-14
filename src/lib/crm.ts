/**
 * Отправка заявок в SberCRM.
 *
 * Вебхук принимает готовую запись лида: контакт (`kontakt$c`), компанию
 * (`kompaniya$c`), метку источника (`istochnik_lida$c`) и идентификатор формы
 * (`id`). Структура задана на стороне CRM — переименовывать поля нельзя,
 * суффикс `$c` означает пользовательский атрибут.
 *
 * Идентификатор контакта из примера интеграции (`kontakt$c.id`) сюда намеренно
 * не попал: это ключ конкретной тестовой карточки, и если слать его с каждой
 * заявкой, все лиды будут переписывать один и тот же контакт.
 */

export const CRM_WEBHOOK =
  "https://app.sbercrm.com/react-gateway/api/webhook/22f4c432-27f6-4862-bae2-d1298f3bd468";

/** Значения полей формы — ровно то, что ввёл пользователь. */
export type LeadFields = {
  name: string;
  email: string;
  phone: string;
  company: string;
  inn: string;
  /** Галочка согласия на маркетинговые коммуникации. */
  consent: boolean;
};

/** Куда и под какой меткой уходит заявка с конкретной страницы. */
export type LeadTarget = {
  /** Заголовок лида в CRM — поле `name`. */
  title: string;
  /** Идентификатор формы в CRM — верхнеуровневое `id`. */
  formId: string;
  /** Метка источника — `istochnik_lida$c`. */
  source: string;
  /** Тип связи компании — `kompaniya$c.relationType`. */
  relationType: string;
};

/** Партнёрская форма — /company/partners/ */
export const PARTNER_LEAD: LeadTarget = {
  title: "Новый лид - партнер",
  formId: "17c9a78f-ce39-4b49-baae-6e63a439f63d",
  source: "enterprisegigachatpartners",
  relationType: "Partner",
};

/**
 * Телефон к виду +79167091956: CRM ждёт цифры со знаком плюс, а в поле его
 * набирают как угодно — со скобками, пробелами и через восьмёрку.
 */
export function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.length === 11 && digits.startsWith("8"))
    return `+7${digits.slice(1)}`;
  if (digits.length === 10) return `+7${digits}`;
  return `+${digits}`;
}

/** Дата согласия — `YYYY-MM-DD` по местному времени пользователя. */
function consentDate(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export function buildLeadPayload(fields: LeadFields, target: LeadTarget) {
  const name = fields.name.trim();
  return {
    name: target.title,
    kontakt$c: {
      mobilePhone: normalizePhone(fields.phone),
      firstName: name,
      email: fields.email.trim(),
      marketing_consent_date$c: consentDate(),
      marketing_consent$c: fields.consent,
      name,
    },
    kompaniya$c: {
      inn: fields.inn.trim(),
      relationType: target.relationType,
      shortName: fields.company.trim(),
    },
    istochnik_lida$c: target.source,
    id: target.formId,
  };
}

/**
 * Отправка заявки.
 *
 * Сайт статический, серверной ручки-посредника нет, поэтому запрос идёт из
 * браузера прямо в CRM. Основной путь — обычный `application/json`: он даёт
 * читаемый статус, но требует, чтобы вебхук отвечал на предзапрос CORS.
 * Если предзапрос не проходит, повторяем «простым» запросом (`text/plain`,
 * `no-cors`) — тело то же самое, ответ непрозрачный, зато заявка доходит.
 */
export async function sendLead(
  fields: LeadFields,
  target: LeadTarget,
  endpoint: string = CRM_WEBHOOK,
): Promise<void> {
  const body = JSON.stringify(buildLeadPayload(fields, target));

  let reachedServer = false;
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
    reachedServer = true;
    if (!response.ok) {
      throw new Error(`CRM ответила ${response.status}`);
    }
    return;
  } catch (error) {
    // Ответ пришёл, но с ошибкой — запасной путь не поможет, отдаём наверх.
    if (reachedServer) throw error;
  }

  await fetch(endpoint, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=UTF-8" },
    body,
  });
}
