"use client";

import { useRef, useState, type FormEvent } from "react";
import Button from "@/components/ui/Button";
import { LegalLink } from "@/components/ui/LegalLink";
import { LEGAL_PDF } from "@/lib/legal";
import { sendLead, type LeadFields, type LeadTarget } from "@/lib/crm";

/**
 * Form / Lead CTA — I2397:43444 (desktop) / I2397:43460 (mobile)
 *
 * Значения из макета:
 *   карточка   rounded 16, border #e6e6e6, заливка Gradient/Omni/Neuton_Light_3
 *              linear-gradient(61.375deg, #c5f8e5 0.95%, #dcf9ff 50.8%, #e4f5ff 101.64%)
 *   отступы    desktop py-48 px-12, поля px-48 · mobile py-24, поля px-16
 *   поле       h-56, rounded 16, border border-default, bg bg-input, p-16,
 *              подпись Body/M 14px text-secondary (547:222)
 *   чекбокс    контрол 20×20 в боксе 24, rounded 4, border icon-secondary (843:4074)
 *   ссылки     status-accent #8c8fe4 (549:222)
 *
 * Отправка включается пропом `target`: с ним форма уходит в SberCRM
 * (`src/lib/crm.ts`), без него — прежнее поведение-заглушка, потому что для
 * остальных страниц ручка пока не заведена.
 *
 * Проверка полей своя, а не браузерная. У `required` и `type="email"` разметка
 * системная: серое всплывающее облачко у поля, шрифт и скругления от ОС, текст
 * («Заполните это поле») на языке браузера, а не сайта. К стилю страницы это
 * не привести никак — облачко рисует сам браузер. Поэтому на форме стоит
 * `noValidate`, а ошибки считаются здесь и выводятся подписью под полем.
 */

/*
  Заливка карточки — Gradient/Omni/Neuton 2, углы из макетов: 236.719° на
  мобильном (I2397:43460;1866:16434) и 224.038° на десктопе
  (I2397:43444;1866:16434). Прежде здесь стоял Neuton_Light_3 под 61.375° —
  другой набор цветов и другое направление.
*/
const FORM_GRADIENT =
  "bg-[linear-gradient(236.719deg,#d4e2ff_10.994%,#b3ebf6_79.923%,#b3f6e1_101.64%)] " +
  "md:bg-[linear-gradient(224.038deg,#d4e2ff_10.994%,#b3ebf6_79.923%,#b3f6e1_101.64%)]";

const FIELD_CLASS =
  "h-[56px] w-full rounded-[16px] border bg-bg-input p-16 " +
  "text-body-m text-text-primary placeholder:text-text-secondary " +
  "transition-colors duration-200 outline-none " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary";

/**
 * Рамка поля. В ошибке — status-error и вторым пикселем внутрь (`inset`), а не
 * `border-2`: толщина рамки не меняет высоту и ширину поля, и строка не
 * дёргается в момент подсветки. Тень вместо outline — outline занят фокусом.
 */
const FIELD_OK =
  "border-border-default hover:border-border-strong focus:border-border-strong";
const FIELD_BAD =
  "border-status-error shadow-[inset_0_0_0_1px_var(--color-status-error)]";

/**
 * Поля и их проверки. `error` возвращает текст ошибки или пустую строку.
 * Пустое значение проверяется отдельно (обязательность зависит от `requireAll`),
 * здесь — только разбор того, что человек уже ввёл.
 */
const FIELDS = [
  {
    name: "name",
    label: "Имя",
    type: "text",
    autoComplete: "name",
    empty: "Укажите имя",
    error: (v: string) => (v.trim().length < 2 ? "Имя слишком короткое" : ""),
  },
  {
    name: "email",
    label: "Рабочая почта",
    /*
      Тип `text`, а не `email`: при `type="email"` браузер и с `noValidate`
      подставляет свою проверку в `checkValidity`, а Safari вдобавок сам чистит
      значение. Проверяем регуляркой ниже — сообщение тогда наше.
      `inputMode="email"` оставляет мобильную клавиатуру с «@».
    */
    type: "text",
    inputMode: "email" as const,
    autoComplete: "email",
    empty: "Укажите рабочую почту",
    error: (v: string) =>
      /^[^\s@]+@[^\s@]+\.[a-zA-Zа-яА-Я]{2,}$/.test(v.trim())
        ? ""
        : "Проверьте адрес — он должен быть вида name@company.ru",
  },
  {
    name: "phone",
    label: "Телефон",
    type: "tel",
    inputMode: "tel" as const,
    autoComplete: "tel",
    empty: "Укажите телефон",
    /* Считаем только цифры: +7, скобки, пробелы и дефисы человек ставит как хочет. */
    error: (v: string) => {
      const digits = v.replace(/\D/g, "").length;
      return digits >= 10 && digits <= 15
        ? ""
        : "Телефон должен содержать от 10 до 15 цифр";
    },
  },
  {
    name: "company",
    label: "Название организации",
    type: "text",
    autoComplete: "organization",
    empty: "Укажите название организации",
    error: (v: string) =>
      v.trim().length < 2 ? "Название слишком короткое" : "",
  },
  {
    name: "inn",
    label: "ИНН",
    type: "text",
    inputMode: "numeric" as const,
    autoComplete: "off",
    empty: "Укажите ИНН",
    /* 10 цифр у организации, 12 у ИП. Контрольную сумму не считаем — её проверит CRM. */
    error: (v: string) =>
      /^\d{10}$|^\d{12}$/.test(v.trim())
        ? ""
        : "ИНН — это 10 цифр у организации или 12 у ИП",
  },
] as const;

/** Без `target` обязательны только имя и почта — как было до подключения CRM. */
const BASE_REQUIRED = new Set<string>(["name", "email"]);

/**
 * Галочка в круге на экране «Заявка отправлена».
 *
 * Рисуется по правилам остальных иконок сайта: сетка 24, `fill: none`, обводка
 * со скруглёнными концами, толщина 1.6 — как у `check.svg`. Размер 48: это не
 * иконка в строке, а знак состояния, и она масштабируется вместе с сеткой,
 * сохраняя оптический вес.
 *
 * Цвет — градиент страницы. Стопы читают переменные темы через `style`, а не
 * через атрибут: в атрибуте `var()` не разбирается. Запасное значение —
 * основной цвет текста, поэтому на светлых страницах заявки иконка выйдет
 * обычной тёмной, а не пропадёт.
 *
 * Идентификатор градиента берёт префикс формы: двух одинаковых `id` на
 * странице с двумя формами быть не должно.
 */
function SuccessIcon({ idPrefix }: { idPrefix: string }) {
  const gradientId = `${idPrefix}-success-gradient`;
  const stroke = `url(#${gradientId})`;

  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="shrink-0"
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="3"
          y1="3"
          x2="21"
          y2="21"
          gradientUnits="userSpaceOnUse"
        >
          <stop style={{ stopColor: "var(--gc-accent-from, currentColor)" }} />
          <stop
            offset="1"
            style={{ stopColor: "var(--gc-accent-to, currentColor)" }}
          />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="9.2" stroke={stroke} strokeWidth="1.6" />
      <path
        d="M7.9 12.3 10.8 15.2 16.1 9.3"
        stroke={stroke}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type FieldName = (typeof FIELDS)[number]["name"];

type LeadFormProps = {
  /** Куда уходит заявка. Не передан — форма не отправляется никуда. */
  target?: LeadTarget;
  /**
   * Какие поля показывать и в каком порядке. Не передан — все пять.
   *
   * Урезанный набор нужен формам мероприятий: там спрашивают минимум, а
   * компанию и ИНН менеджер уточняет при созвоне. Проверка и отправка
   * работают только по показанным полям, остальные уходят в CRM пустыми.
   */
  fields?: readonly FieldName[];
  /**
   * Другие подписи полей. `label` — плейсхолдер и подпись для скринридера,
   * `empty` — текст ошибки у пустого поля.
   *
   * Пара, а не одна строка: вывести «Укажите почту» из «Почта» нельзя, в
   * ошибке слово стоит в винительном падеже.
   */
  labels?: Partial<Record<FieldName, { label: string; empty: string }>>;
  /** Требовать заполнения всех полей (нужно CRM, чтобы завести компанию). */
  requireAll?: boolean;
  /** Подпись кнопки. */
  submitLabel?: string;
  /** Текст под заголовком экрана «Заявка отправлена». */
  successText?: string;
  /**
   * Показывать галочку над заголовком «Заявка отправлена». По умолчанию нет —
   * экраны светлых страниц заявки остаются такими, какими были.
   */
  successIcon?: boolean;
  /** Префикс id полей — на случай двух форм на одной странице. */
  idPrefix?: string;
  className?: string;
};

export function LeadForm({
  target,
  fields,
  labels,
  requireAll = false,
  submitLabel = "Попробовать бесплатно",
  successText,
  successIcon = false,
  idPrefix = "lead",
  className = "",
}: LeadFormProps = {}) {
  /*
    Показанные поля в заданном порядке, с подменёнными подписями. Неизвестные
    имена молча отбрасываем.
  */
  const shown = (
    fields
      ? fields
          .map((name) => FIELDS.find((field) => field.name === name))
          .filter((field) => field !== undefined)
      : FIELDS
  ).map((field) => {
    const custom = labels?.[field.name];
    return custom ? { ...field, ...custom } : field;
  });

  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  /** Тексты ошибок по имени поля. Пусто — поле в порядке. */
  const [errors, setErrors] = useState<Record<string, string>>({});
  /*
    До первой отправки ошибки не показываем: подсвечивать «Укажите ИНН», пока
    человек печатает имя, — это ругань на незаполненную форму. После неё
    проверяем на каждый ввод, чтобы подпись уходила сразу, как поле починили.
  */
  const submitted = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);

  const isRequired = (name: string) => requireAll || BASE_REQUIRED.has(name);

  /** Ошибка одного поля: сначала обязательность, потом разбор значения. */
  /*
    Тип структурный, а не `(typeof FIELDS)[number]`: с подменёнными подписями
    `label` и `empty` становятся обычными строками, а не литералами из FIELDS.
  */
  const checkField = (
    field: { name: string; empty: string; error: (value: string) => string },
    raw: string,
  ) => {
    const value = raw.trim();
    if (!value) return isRequired(field.name) ? field.empty : "";
    return field.error(value);
  };

  /** Ошибки всей формы по текущим значениям полей. Скрытые не проверяем. */
  const checkAll = (form: HTMLFormElement) => {
    const data = new FormData(form);
    const next: Record<string, string> = {};
    shown.forEach((field) => {
      const message = checkField(field, String(data.get(field.name) ?? ""));
      if (message) next[field.name] = message;
    });
    return next;
  };

  /* Пересчёт по ходу ввода — только после первой попытки отправить. */
  const handleInput = () => {
    if (!submitted.current || !formRef.current) return;
    setErrors(checkAll(formRef.current));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;

    const form = event.currentTarget;
    submitted.current = true;

    const found = checkAll(form);
    setErrors(found);
    if (Object.keys(found).length) {
      /*
        Уводим курсор в первое незаполненное поле — иначе на мобильном
        подпись об ошибке может оказаться за пределами экрана, и нажатие на
        кнопку выглядит как «ничего не произошло». Порядок берём из списка
        полей, а не из объекта ошибок: у объекта он не гарантирован.
      */
      const first = shown.find((field) => found[field.name]);
      if (first) {
        form
          .querySelector<HTMLInputElement>(`[name="${first.name}"]`)
          ?.focus({ preventScroll: false });
      }
      return;
    }

    // Ручки нет — прежнее поведение: показываем «принято», никуда не идём.
    if (!target) {
      setStatus("sent");
      return;
    }

    const data = new FormData(form);
    const value = (key: string) => String(data.get(key) ?? "");
    const fields: LeadFields = {
      name: value("name"),
      email: value("email"),
      phone: value("phone"),
      company: value("company"),
      inn: value("inn"),
      consent: data.get("consent") === "on",
    };

    setStatus("sending");
    try {
      await sendLead(fields, target);
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      onInput={handleInput}
      /*
        Своя проверка вместо браузерной — см. шапку файла. `required` на полях
        остаётся: он ничего не рисует при `noValidate`, но экранный диктор по
        нему сообщает, что поле обязательное.
      */
      noValidate
      aria-label={"Заявка на\u00A0пробный доступ"}
      /*
        Внутренние поля и шаг на десктопе берутся из переменных страницы
        (`lead-fit` в globals.css): на невысоких экранах они ужимаются, чтобы
        форма помещалась целиком. Значения по умолчанию — из макета, поэтому
        вне страницы заявки компонент выглядит как прежде.
      */
      /*
        Ниже md отступы и шаг тоже берутся из переменных `.lead-fit`, а не
        числами: по умолчанию там прежние 24/24, так что /lead не меняется,
        а страница GigaConf ужимает их, чтобы поместиться в один экран.
      */
      className={`flex w-full max-w-[840px] flex-col items-center gap-[var(--lead-m-form-gap,24px)] rounded-[16px] border border-[#e6e6e6] py-[var(--lead-m-form-py,24px)] md:w-[588px] md:gap-[var(--lead-form-gap,24px)] md:px-12 md:py-[var(--lead-form-py,48px)] ${FORM_GRADIENT} ${className}`}
    >
      {status === "sent" ? (
        <div className="flex flex-col items-center gap-12 px-16 py-40 text-center md:px-48">
          {successIcon ? <SuccessIcon idPrefix={idPrefix} /> : null}
          <p className="text-h4 font-medium text-text-primary">
            Заявка отправлена
          </p>
          <p className="text-body-m text-text-secondary">
            {successText ?? (
              <>
                Мы свяжемся с&nbsp;вами по&nbsp;указанной почте и&nbsp;откроем
                пробный доступ.
              </>
            )}
          </p>
        </div>
      ) : (
        <>
          {shown.map((field) => {
            const message = errors[field.name];
            const errorId = `${idPrefix}-${field.name}-error`;
            return (
              /*
                Подпись ошибки лежит в потоке под полем, а не поверх него: шаг
                между полями задан gap у формы, и всплывающая подпись
                перекрыла бы следующее поле. Из-за этого форма при ошибке
                становится выше — но она и так не привязана к высоте экрана.
              */
              <div
                key={field.name}
                className="flex w-full flex-col gap-8 px-16 md:px-48"
              >
                <label
                  className="sr-only"
                  htmlFor={`${idPrefix}-${field.name}`}
                >
                  {field.label}
                </label>
                <input
                  id={`${idPrefix}-${field.name}`}
                  name={field.name}
                  type={field.type}
                  inputMode={"inputMode" in field ? field.inputMode : undefined}
                  autoComplete={field.autoComplete}
                  placeholder={field.label}
                  required={isRequired(field.name)}
                  aria-invalid={message ? true : undefined}
                  aria-describedby={message ? errorId : undefined}
                  className={`${FIELD_CLASS} ${message ? FIELD_BAD : FIELD_OK}`}
                />
                {message ? (
                  /*
                    `role="alert"` на самой подписи, а не общий live-region
                    внизу формы: так диктор читает ошибку рядом с полем, в
                    которое только что увели курсор.
                  */
                  <p
                    id={errorId}
                    role="alert"
                    className="text-left text-caption text-status-error"
                  >
                    {message}
                  </p>
                ) : null}
              </div>
            );
          })}

          {/* Consent — I2397:43444;1866:16715 */}
          <div className="flex w-full items-start gap-12 px-16 md:px-48">
            <span className="flex size-[24px] shrink-0 items-center justify-center">
              <input
                id={`${idPrefix}-consent`}
                name="consent"
                type="checkbox"
                /*
                  `checkbox-tick` рисует саму галочку: вместе с appearance-none
                  пропадает и системная, и отмеченный чекбокс без неё выглядел
                  просто тёмным квадратом. Стили — в globals.css.
                */
                className="checkbox-tick size-[20px] cursor-pointer appearance-none rounded-[4px] border border-icon-secondary bg-action-secondary-default transition-colors duration-200 checked:border-action-primary-default checked:bg-action-primary-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary"
              />
            </span>
            <label
              htmlFor={`${idPrefix}-consent`}
              className="flex-1 cursor-pointer text-left text-caption text-text-secondary"
            >
              Даю <LegalLink href={LEGAL_PDF.materials}>согласие</LegalLink>{" "}
              на&nbsp;получение материалов о&nbsp;сервисе, приглашений
              на&nbsp;мероприятия и&nbsp;рекламных сообщений в&nbsp;соответствии{" "}
              <LegalLink href={LEGAL_PDF.privacy}>
                с&nbsp;Политикой конфиденциальности
              </LegalLink>
              .
            </label>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={status === "sending"}
          >
            {status === "sending" ? "Отправляем…" : submitLabel}
          </Button>

          {status === "error" ? (
            <p
              role="alert"
              className="w-full px-16 text-left text-caption text-status-error md:px-48"
            >
              Не&nbsp;удалось отправить заявку. Попробуйте ещё раз или напишите
              нам на&nbsp;почту.
            </p>
          ) : null}

          {/*
            Жёсткого переноса больше нет: он был рассчитан на выключку по
            центру, где делил строку пополам. При выключке влево тот же перенос
            обрывал первую строку на середине ширины и оставлял справа дыру.
          */}
          <p className="w-full px-16 text-left text-caption text-text-secondary md:px-48">
            Нажимая на&nbsp;кнопку,{" "}
            <LegalLink href={LEGAL_PDF.personal}>я соглашаюсь</LegalLink>{" "}
            на&nbsp;обработку моих персональных данных в&nbsp;соответствии с{" "}
            <LegalLink href={LEGAL_PDF.privacy}>
              Политикой конфиденциальности
            </LegalLink>
            .
          </p>
        </>
      )}
    </form>
  );
}

export default LeadForm;
