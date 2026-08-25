"use client";

import { useEffect, useState, type ReactNode } from "react";
import styles from "./landing-events.module.css";

/**
 * Сцена киоска: макет всегда 1920×1080, а под окно он подгоняется целиком —
 * одним `transform: scale`. Так пропорции макета не плывут ни на каком экране.
 *
 * Перенесено из `Stage.tsx` + `useViewportScale.ts` киоск-приложения.
 */

const STAGE_WIDTH = 1920;
const STAGE_HEIGHT = 1080;

export function Stage({ children }: { children: ReactNode }) {
  /*
    Стартуем с нуля, а не с единицы: при статическом экспорте разметка
    приезжает готовой, и до первого замера сцена 1920×1080 успевала мигнуть
    в натуральную величину. Прозрачность снимается тем же первым замером.
  */
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const update = () =>
      setScale(
        Math.min(
          window.innerWidth / STAGE_WIDTH,
          window.innerHeight / STAGE_HEIGHT,
        ),
      );

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div className={styles.viewport}>
      <div
        className={styles.stage}
        style={{
          transform: `scale(${scale})`,
          opacity: scale ? 1 : 0,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default Stage;
