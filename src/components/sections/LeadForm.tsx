"use client";

import { useState, type FormEvent } from "react";
import Button from "@/components/ui/Button";
import { LegalLink } from "@/components/ui/LegalLink";
import { LEGAL_PDF } from "@/lib/legal";

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
 * Отправка НЕ подключена: бэкенда для заявок в проекте нет. Сабмит
 * перехватывается и показывает состояние «принято», чтобы форма не уводила
 * пользователя на пустой URL. Как появится ручка — поменять `handleSubmit`.
 */

const FORM_GRADIENT =
  "bg-[linear-gradient(61.375deg,#c5f8e5_0.952%,#dcf9ff_50.802%,#e4f5ff_101.64%)]";

const FIELD_CLASS =
  "h-[56px] w-full rounded-[16px] border border-border-default bg-bg-input p-16 " +
  "text-body-m text-text-primary placeholder:text-text-secondary " +
  "transition-colors duration-200 outline-none " +
  "hover:border-border-strong focus:border-border-strong " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary";

const FIELDS = [
  { name: "name", label: "Имя", type: "text", autoComplete: "name" },
  { name: "email", label: "Рабочая почта", type: "email", autoComplete: "email" },
  { name: "phone", label: "Телефон", type: "tel", autoComplete: "tel" },
  {
    name: "company",
    label: "Название организации",
    type: "text",
    autoComplete: "organization",
  },
  { name: "inn", label: "ИНН", type: "text", autoComplete: "off" },
] as const;

export function LeadForm() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Заявка на\u00A0пробный доступ"
      /*
        Внутренние поля и шаг на десктопе берутся из переменных страницы
        (`lead-fit` в globals.css): на невысоких экранах они ужимаются, чтобы
        форма помещалась целиком. Значения по умолчанию — из макета, поэтому
        вне страницы заявки компонент выглядит как прежде.
      */
      className={`flex w-full max-w-[840px] flex-col items-center gap-24 rounded-[16px] border border-[#e6e6e6] py-24 md:w-[588px] md:gap-[var(--lead-form-gap,24px)] md:px-12 md:py-[var(--lead-form-py,48px)] ${FORM_GRADIENT}`}
    >
      {sent ? (
        <div className="flex flex-col items-center gap-12 px-16 py-40 text-center md:px-48">
          <p className="text-h4 font-medium text-text-primary">
            Заявка отправлена
          </p>
          <p className="text-body-m text-text-secondary">
            Мы свяжемся с&nbsp;вами по&nbsp;указанной почте и&nbsp;откроем пробный доступ.
          </p>
        </div>
      ) : (
        <>
          {FIELDS.map((field) => (
            <div key={field.name} className="w-full px-16 md:px-48">
              <label className="sr-only" htmlFor={`lead-${field.name}`}>
                {field.label}
              </label>
              <input
                id={`lead-${field.name}`}
                name={field.name}
                type={field.type}
                autoComplete={field.autoComplete}
                placeholder={field.label}
                required={field.name === "name" || field.name === "email"}
                className={FIELD_CLASS}
              />
            </div>
          ))}

          {/* Consent — I2397:43444;1866:16715 */}
          <div className="flex w-full items-start gap-12 px-16 md:px-48">
            <span className="flex size-[24px] shrink-0 items-center justify-center">
              <input
                id="lead-consent"
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
              htmlFor="lead-consent"
              className="flex-1 cursor-pointer text-left text-caption text-text-secondary"
            >
              Даю <LegalLink href={LEGAL_PDF.materials}>согласие</LegalLink> на&nbsp;получение
              материалов о&nbsp;сервисе, приглашений на&nbsp;мероприятия и&nbsp;рекламных
              сообщений в&nbsp;соответствии{" "}
              <LegalLink href={LEGAL_PDF.privacy}>
                с&nbsp;Политикой конфиденциальности
              </LegalLink>
              .
            </label>
          </div>

          <Button type="submit" variant="primary" size="lg">
            Попробовать бесплатно
          </Button>

          {/*
            Жёсткого переноса больше нет: он был рассчитан на выключку по
            центру, где делил строку пополам. При выключке влево тот же перенос
            обрывал первую строку на середине ширины и оставлял справа дыру.
          */}
          <p className="w-full px-16 text-left text-caption text-text-secondary md:px-48">
            Нажимая на&nbsp;кнопку,{" "}
            <LegalLink href={LEGAL_PDF.personal}>я соглашаюсь</LegalLink> на&nbsp;обработку
            моих персональных данных в&nbsp;соответствии с{" "}
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
