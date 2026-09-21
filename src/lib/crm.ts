/**
 * Отправка заявок в SberCRM.
 *
 * Вебхук принимает готовую запись лида: заголовок (`name`), контакт
 * (`kontakt$c`), компанию (`kompaniya$c`) и метку источника
 * (`istochnik_lida$c`). Структура задана на стороне CRM — переименовывать поля
 * нельзя, суффикс `$c` означает пользовательский атрибут.
 *
 * Никаких `id` в теле быть не должно — ни своего, ни контакта. Верхнеуровневый
 * `id` для вебхука означает «это существующая запись, обнови её», поэтому
 * заявки не заводились новыми лидами, а уходили в одну и ту же карточку; форма
 * при этом отвечала «отправлено». Ровно такое же тело, но без `id`, шлёт
 * работающая форма на gigaenterprise.ai/partners — сверено по её `js/main.js`
 * (ветка `company`), вебхук тот же.
 *
 * Вебхук у каждой формы может быть свой: он указывается в `LeadTarget`.
 */

import { absoluteUrl } from "@/lib/site";

export const CRM_WEBHOOK =
  "https://app.sbercrm.com/react-gateway/api/webhook/22f4c432-27f6-4862-bae2-d1298f3bd468";

/** Отдельный вебхук мероприятия — заявки со стенда GigaConf. */
export const GIGACONF_WEBHOOK =
  "https://app.sbercrm.com/react-gateway/api/webhook/baf83ad4-8876-4515-8a35-e87122a115dd";

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
  /** Метка источника — `istochnik_lida$c`. */
  source: string;
  /**
   * Тип связи компании — `kompaniya$c.relationType`. Не задан — блок компании
   * не уходит вовсе: на форме без полей «Компания» и «ИНН» он был бы пустым.
   */
  relationType?: string;
  /** Вебхук страницы. По умолчанию общий `CRM_WEBHOOK`. */
  endpoint?: string;
  /** Путь страницы заявки — уходит в `url_lead$c` абсолютным адресом. */
  page?: string;
  /** Идентификатор мероприятия в CRM — `event$c.id`. */
  event?: string;
};

/** Партнёрская форма — /company/partners/ */
export const PARTNER_LEAD: LeadTarget = {
  title: "Новый лид - партнер",
  source: "enterprisegigachatpartners",
  relationType: "Partner",
};

/**
 * Форма мероприятия — /lead-gigaconf/
 *
 * Свой вебхук: заявки со стенда не смешиваются с партнёрскими. Полей всего
 * три, поэтому ни компании, ни ИНН в теле нет — менеджер уточняет их при
 * созвоне.
 *
 * `source` — значение из справочника `istochnik_lida` на стороне CRM. Список
 * закрытый: на любое слово не из справочника вебхук отвечает 400 и «Не найдено
 * значение … в справочнике istochnik_lida», заявка при этом не создаётся.
 * Поэтому произвольную метку сюда писать нельзя.
 *
 * `event` — карточка мероприятия в CRM, к которой подшиваются заявки.
 */
export const GIGACONF_LEAD: LeadTarget = {
  title: "Новый лид - GigaConf",
  source: "event_konferencziya",
  event: "acb5b017-400e-42f1-a13c-c8136a36e75b",
  endpoint: GIGACONF_WEBHOOK,
  page: "/lead-gigaconf/",
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
      /* Галочки нет — даты согласия тоже нет, а не сегодняшнее число. */
      marketing_consent_date$c: fields.consent ? consentDate() : null,
      marketing_consent$c: fields.consent,
      name,
    },
    /*
      Блок компании уходит только там, где эти поля есть на форме: пустые
      `inn` и `shortName` завели бы в CRM компанию без названия.
    */
    ...(target.relationType
      ? {
          kompaniya$c: {
            inn: fields.inn.trim(),
            relationType: target.relationType,
            shortName: fields.company.trim(),
          },
        }
      : {}),
    ...(target.page ? { url_lead$c: absoluteUrl(target.page) } : {}),
    /* Только `id`: название мероприятия хранится в самой карточке CRM. */
    ...(target.event ? { event$c: { id: target.event } } : {}),
    istochnik_lida$c: target.source,
  };
}

/**
 * Отправка заявки.
 *
 * Сайт статический, серверной ручки-посредника нет, поэтому запрос идёт из
 * браузера прямо в CRM. Основной путь — обычный `application/json`: он даёт
 * читаемый статус, но требует, чтобы вебхук отвечал на предзапрос CORS.
 * Вебхук отвечает: с test.cowork.ru ответ читается так же, как с
 * gigaenterprise.ai, — источник он не ограничивает.
 *
 * Запасной путь (`text/plain`, `no-cors`) остаётся на случай, когда предзапрос
 * всё-таки не прошёл — например, его срезал корпоративный прокси. Ответ там
 * непрозрачный, и форма отрапортует «отправлено», ничего не зная о судьбе
 * заявки; полагаться на него как на обычный режим нельзя.
 */
export async function sendLead(
  fields: LeadFields,
  target: LeadTarget,
  endpoint: string = target.endpoint ?? CRM_WEBHOOK,
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
