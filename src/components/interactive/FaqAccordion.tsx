"use client";

import { useId, useState } from "react";
import type { ReactNode } from "react";

import { Icon } from "@/components/ui/Icon";

/**
 * Аккордеон «Частые вопросы» — /pricing (4135:23607 / 4188:3007).
 *
 * В макете первый пункт раскрыт, остальные свёрнуты — здесь так же: открыт
 * ровно один пункт, и по клику открывается новый вместо старого.
 *
 * Пункт без ответа рисуется как обычный текст, а не как кнопка: раскрывать
 * нечего, и кликабельная заглушка только сбивала бы с толку.
 */

export type FaqItem = {
  question: string;
  /**
   * Ответ. Узел, а не строка: у части вопросов внутри подзаголовки и списки,
   * и собирать их из строки пришлось бы разметкой в компоненте.
   * Нет ответа — пункт не раскрывается.
   */
  answer?: ReactNode;
};

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState(0);
  const id = useId();

  return (
    <div className="flex flex-col gap-16">
      {items.map((item, i) => {
        const expanded = i === open && Boolean(item.answer);
        return (
          <div
            key={item.question}
            className={`rounded-24 border border-border-subtle px-24 py-24 shadow-[0_2px_4px_#60738f14] md:px-32 ${
              expanded
                ? "bg-bg-page"
                : "bg-[linear-gradient(160deg,#f0f8ff_0%,#f7f7f8_100%)]"
            }`}
          >
            {item.answer ? (
              <button
                type="button"
                onClick={() => setOpen(expanded ? -1 : i)}
                aria-expanded={expanded}
                aria-controls={`${id}-${i}`}
                className="flex w-full items-start justify-between gap-16 text-left"
              >
                <span className="text-body-l font-medium text-text-primary md:text-h4">
                  {item.question}
                </span>
                <Icon
                  src="/img/icons/chevron-down.svg"
                  className={`mt-[2px] size-[24px] shrink-0 text-icon-primary transition-transform duration-300 ${
                    expanded ? "rotate-180" : ""
                  }`}
                />
              </button>
            ) : (
              <p className="text-body-l font-medium text-text-primary md:text-h4">
                {item.question}
              </p>
            )}

            {item.answer ? (
              <div
                id={`${id}-${i}`}
                hidden={!expanded}
                className="flex flex-col gap-16 pt-24 text-body-m text-text-secondary md:text-body-l"
              >
                {item.answer}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export default FaqAccordion;
