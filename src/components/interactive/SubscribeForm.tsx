"use client";

import { useState, type FormEvent } from "react";

import { LegalLink } from "@/components/ui/LegalLink";
import { LEGAL_PDF } from "@/lib/legal";

/**
 * «Подписка на новые материалы» — Modal / Lead CTA на «Медиа» (4579:97991).
 *
 * Внешняя карточка в макете без заливки: цветная только рамка формы
 * (chatInput) — белая подложка плюс мятно-голубой градиент, кромка #e6e6e6
 * и скругление 16. Фон под блоком даёт сама секция.
 *
 * Отправки нет: как и у формы заявки на /lead, submit перехватывается и
 * показывается подтверждение. Появится эндпоинт — сюда добавляется запрос,
 * разметка не меняется.
 */

/** Заливка рамки формы (chatInput) — белая подложка под градиентом. */
const FORM_GRADIENT =
  "bg-white bg-[linear-gradient(55deg,#c5f8e5_0%,#caf5ff_50%,#cfedff_100%)]";

export function SubscribeForm() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <div className="mx-auto flex max-w-[684px] flex-col gap-32 py-24 md:p-48">
      <div className="flex flex-col gap-16 text-center">
        <h2 className="text-h3 font-medium text-text-primary md:text-h2">
          Подписка на&nbsp;новые материалы
        </h2>
        <p className="text-body-l text-text-primary">
          Раз в&nbsp;две недели&nbsp;— кейсы и&nbsp;руководства.
          Без&nbsp;рекламы.
        </p>
      </div>

      {sent ? (
        <p
          className={`rounded-[16px] border border-[#e6e6e6] px-12 py-48 text-center text-body-l text-text-primary ${FORM_GRADIENT}`}
        >
          Готово&nbsp;— письмо с&nbsp;подтверждением придёт на&nbsp;указанную
          почту.
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className={`flex flex-col items-center gap-24 rounded-[16px] border border-[#e6e6e6] px-12 py-32 md:py-48 ${FORM_GRADIENT}`}
        >
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            aria-label="Рабочая почта"
            placeholder="Рабочая почта"
            /* Поле в макете уже рамки: 468 из 588, по центру. */
            className="h-[56px] w-full max-w-[468px] rounded-[16px] border border-[#d4d9e0] bg-bg-page p-16 text-body-m text-text-primary outline-none transition-colors duration-200 placeholder:text-text-secondary hover:border-border-strong focus:border-border-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary"
          />

          {/* Кнопка в макете короткая, по содержимому, а не во всю ширину. */}
          <button
            type="submit"
            className="cursor-pointer rounded-full bg-action-primary-default px-24 py-12 text-body-m text-text-inverse transition-colors duration-200 hover:bg-action-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary"
          >
            Подписаться
          </button>

          <p className="max-w-[564px] text-center text-caption text-text-secondary">
            Нажимая на&nbsp;кнопку, я&nbsp;соглашаюсь на&nbsp;обработку моих
            персональных данных в&nbsp;соответствии{" "}
            <LegalLink href={LEGAL_PDF.privacy}>
              с&nbsp;Политикой конфиденциальности
            </LegalLink>
            .
          </p>
        </form>
      )}
    </div>
  );
}

export default SubscribeForm;
