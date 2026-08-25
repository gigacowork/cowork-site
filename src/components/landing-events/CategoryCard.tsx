import Link from "next/link";
import { asset } from "@/lib/asset";
import type { LandingCategory } from "@/lib/landing-events";
import styles from "./landing-events.module.css";

/**
 * Карточка категории на экране выбора. Перенесено из `CategoryCard.tsx`.
 *
 * В исходнике это была <button> с `navigate()`; здесь — ссылка на страницу
 * категории, см. пояснение в Controls.tsx.
 */
export function CategoryCard({
  category,
  className,
}: {
  category: LandingCategory;
  className?: string;
}) {
  const { decor } = category;

  return (
    <Link
      href={`/landing-events/categories/${category.id}`}
      className={`${styles.categoryCard} ${className ?? ""}`}
    >
      <h2 className={styles.categoryTitle}>{category.title}</h2>
      <p className={styles.categoryDescription}>
        {category.description.map((line, index) => (
          <span key={line}>
            {line}
            {index < category.description.length - 1 ? <br /> : null}
          </span>
        ))}
      </p>
      <div className={styles.decorBox} style={decor.box}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset(decor.image)}
          alt=""
          className={styles.decorImage}
          style={decor.img}
        />
      </div>
    </Link>
  );
}

export default CategoryCard;
