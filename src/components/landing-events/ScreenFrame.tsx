import type { ReactNode } from "react";
import { asset } from "@/lib/asset";
import styles from "./landing-events.module.css";

/**
 * Общий каркас экрана киоска: логотип сверху, содержимое в середине,
 * панель кнопок снизу. Перенесено из `ScreenFrame.tsx`.
 *
 * Картинки здесь — обычные <img> с `asset()`, а не next/image: это
 * попиксельный макет с фиксированными размерами, оптимизатор ему ничего не
 * добавит, а при статическом экспорте он всё равно отключён.
 */
export function ScreenFrame({
  headerExtra,
  children,
  footer,
}: {
  headerExtra?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className={styles.frame}>
      <div className={styles.card}>
        <div className={styles.header}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset("/landing-events/decor/logo.svg")}
            alt="GigaCowork"
            width={241}
            height={51}
          />
          {headerExtra}
        </div>
        <div className={styles.content}>{children}</div>
        {footer ? <div className={styles.footer}>{footer}</div> : null}
      </div>
    </div>
  );
}

export default ScreenFrame;
