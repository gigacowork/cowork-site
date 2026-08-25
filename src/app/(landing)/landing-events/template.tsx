import Stage from "@/components/landing-events/Stage";
import styles from "@/components/landing-events/landing-events.module.css";

/**
 * Обёртка всех экранов киоска.
 *
 * Именно `template`, а не `layout`: Next пересоздаёт его на каждом переходе,
 * поэтому анимация появления экрана проигрывается заново — как переходы
 * framer-motion в исходном приложении.
 */
export default function LandingEventsTemplate({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Stage>
      <div className={styles.screen}>{children}</div>
    </Stage>
  );
}
