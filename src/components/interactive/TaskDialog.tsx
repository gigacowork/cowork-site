"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import Button from "@/components/ui/Button";
import { LegalLink } from "@/components/ui/LegalLink";
import { LEGAL_PDF } from "@/lib/legal";

/**
 * Форма «Опишите задачу» для карточки «Не нашли свою задачу?» в блоке
 * «Не тратьте часы…» (1927:15577 / 1927:17384).
 *
 * Своего макета у попапа нет, поэтому оформление собрано из готовых кусков:
 * карточка и поля — как в форме заявки (Form / Lead CTA I2397:43444), кнопка —
 * Button/Primary/Large 316:986, правовой текст под кнопкой — тот же, что на
 * /lead (549:222).
 *
 * Диалог нативный (<dialog showModal>), а не свой оверлей: браузер сам даёт
 * ловушку фокуса, закрытие по Esc, инертный фон и слой поверх всего — включая
 * липкую шапку, из-за которой самодельный оверлей пришлось бы городить с
 * z-index.
 *
 * Отправка НЕ подключена: бэкенда для заявок в проекте нет, как и в LeadForm.
 * Сабмит перехватывается и показывает «принято». Появится ручка — менять
 * `handleSubmit`.
 */

const CARD_GRADIENT =
  "bg-[linear-gradient(61.375deg,#c5f8e5_0.952%,#dcf9ff_50.802%,#e4f5ff_101.64%)]";

const FIELD_CLASS =
  "w-full rounded-[16px] border border-border-default bg-bg-input p-16 " +
  "text-body-m text-text-primary placeholder:text-text-secondary " +
  "transition-colors duration-200 outline-none " +
  "hover:border-border-strong focus:border-border-strong " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary";

export function TaskDialog({
  label,
  cardTitle,
}: {
  /** Подпись ссылки в карточке — «Описать задачу». */
  label: string;
  /** Заголовок карточки, уходит в aria-label триггера. */
  cardTitle: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [sent, setSent] = useState(false);

  const open = useCallback(() => {
    setSent(false);
    dialogRef.current?.showModal();
  }, []);

  const close = useCallback(() => dialogRef.current?.close(), []);

  /*
    Пока диалог открыт, страница под ним не должна прокручиваться: иначе колесо
    над затемнением уводит фон, и попап «уезжает» вместе с ним.
  */
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const lock = () => {
      document.documentElement.style.overflow = "hidden";
    };
    const unlock = () => {
      document.documentElement.style.overflow = "";
    };
    dialog.addEventListener("close", unlock);
    // showModal() не даёт события «открыт», поэтому ловим переход по атрибуту.
    const observer = new MutationObserver(() =>
      dialog.open ? lock() : unlock()
    );
    observer.observe(dialog, { attributes: true, attributeFilter: ["open"] });
    return () => {
      observer.disconnect();
      dialog.removeEventListener("close", unlock);
      unlock();
    };
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <>
      {/*
        Триггер занимает место ссылки «Подробнее» у остальных карточек и так же
        растягивает зону клика на всю карточку (stretched-target), поэтому
        кликабельна карточка целиком.
      */}
      <button
        type="button"
        onClick={open}
        aria-haspopup="dialog"
        aria-label={`${label} — ${cardTitle}`}
        className="text-link stretched-target flex cursor-pointer items-center justify-start self-start py-4 text-left text-[13px] leading-[1.2] tracking-[-0.02em] focus-visible:outline-none"
      >
        {label}
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby="task-dialog-title"
        /*
          Диалог по умолчанию прижат к центру с рамкой и белым фоном — снимаем
          всё это и центрируем сами. `backdrop:` — стилизация ::backdrop.
        */
        onClick={(event) => {
          // Клик мимо карточки (по самому ::backdrop) закрывает попап.
          if (event.target === dialogRef.current) close();
        }}
        className="m-auto max-h-[calc(100dvh-32px)] w-[calc(100vw-32px)] max-w-[520px] overflow-visible rounded-[16px] border border-[#e6e6e6] bg-transparent p-0 backdrop:bg-[rgba(23,31,45,0.45)] backdrop:backdrop-blur-[4px]"
      >
        <div
          className={`relative flex max-h-[calc(100dvh-32px)] w-full flex-col gap-24 overflow-y-auto rounded-[16px] px-16 py-32 md:px-40 md:py-40 ${CARD_GRADIENT}`}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Закрыть"
            className="absolute right-16 top-16 flex size-[32px] cursor-pointer items-center justify-center rounded-full transition-colors duration-200 hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary"
          >
            {/*
              Крестик нарисован двумя полосками, как в кнопке мобильного меню
              (Header.tsx): готового close.svg среди выгруженных иконок нет,
              а ради двух линий заводить ассет незачем.
            */}
            <span aria-hidden className="relative size-[16px]">
              <span className="absolute top-[7px] left-0 h-[2px] w-[16px] rotate-45 rounded-[1px] bg-icon-primary" />
              <span className="absolute top-[7px] left-0 h-[2px] w-[16px] -rotate-45 rounded-[1px] bg-icon-primary" />
            </span>
          </button>

          {sent ? (
            <div className="flex flex-col items-center gap-12 py-40 text-center">
              <p id="task-dialog-title" className="text-h4 font-medium text-text-primary">
                Задача отправлена
              </p>
              <p className="text-body-m text-text-secondary">
                Мы изучим описание и вернёмся к вам по указанной почте.
              </p>
              <Button type="button" variant="secondary" size="lg" onClick={close}>
                Закрыть
              </Button>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-8 pr-40">
                <h2
                  id="task-dialog-title"
                  className="text-h4 font-medium text-text-primary"
                >
                  Опишите задачу
                </h2>
                <p className="text-body-m text-text-secondary">
                  Расскажите, что отнимает время, — мы соберём агента под вас.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-24">
                <div className="flex flex-col gap-16">
                  <div>
                    <label className="sr-only" htmlFor="task-name">
                      Имя
                    </label>
                    <input
                      id="task-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Имя"
                      required
                      className={`h-[56px] ${FIELD_CLASS}`}
                    />
                  </div>

                  <div>
                    <label className="sr-only" htmlFor="task-email">
                      Рабочая почта
                    </label>
                    <input
                      id="task-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="Рабочая почта"
                      required
                      className={`h-[56px] ${FIELD_CLASS}`}
                    />
                  </div>

                  <div>
                    <label className="sr-only" htmlFor="task-description">
                      Опишите задачу
                    </label>
                    {/*
                      Высота задана min/max, а не фиксированная: описание задачи
                      бывает и в одну строку, и в абзац, поле растёт вместе с
                      текстом и упирается в потолок, после которого прокручивается.
                    */}
                    <textarea
                      id="task-description"
                      name="task"
                      rows={4}
                      placeholder="Опишите задачу"
                      required
                      className={`min-h-[120px] resize-y ${FIELD_CLASS}`}
                    />
                  </div>
                </div>

                <div className="flex flex-col items-center gap-24">
                  <Button type="submit" variant="primary" size="lg">
                    Отправить
                  </Button>

                  <p className="w-full text-left text-caption text-text-secondary">
                    Нажимая на кнопку,{" "}
                    <LegalLink href={LEGAL_PDF.personal}>я соглашаюсь</LegalLink>{" "}
                    на обработку моих персональных данных в соответствии с{" "}
                    <LegalLink href={LEGAL_PDF.privacy}>
                      Политикой конфиденциальности
                    </LegalLink>
                    .
                  </p>
                </div>
              </form>
            </>
          )}
        </div>
      </dialog>
    </>
  );
}

export default TaskDialog;
