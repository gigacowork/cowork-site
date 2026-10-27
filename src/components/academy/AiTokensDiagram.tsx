import styles from "./ai-tokens-diagram.module.css";

const tokenGroups = [
  ["Больш", "ие"],
  ["язы", "ковые"],
  ["мо", "дели"],
] as const;
const tokenCount = tokenGroups.reduce((count, group) => count + group.length, 0);

export default function AiTokensDiagram() {
  return (
    <figure className={styles.diagram} aria-label="Пример разбиения слов на токены">
      <div className={styles.row}>
        <span className={styles.label}>Исходная фраза</span>
        <strong className={styles.phrase}>Большие языковые модели</strong>
      </div>
      <span className={styles.arrow} aria-hidden="true">↓</span>
      <div className={styles.row}>
        <span className={styles.label}>Части текста — токены</span>
        <div className={styles.tokenGroups} role="img" aria-label="Большие: Больш и ие. Языковые: язы и ковые. Модели: мо и дели.">
          {tokenGroups.map((group) => (
            <span key={group.join("")} className={styles.tokenGroup} aria-hidden="true">
              {group.map((token) => <span key={token} className={styles.token}>{token}</span>)}
            </span>
          ))}
        </div>
      </div>
      <div className={styles.result}>
        <span>В этом примере</span>
        <strong>{tokenCount} токенов</strong>
      </div>
      <figcaption className={styles.note}>Разбиение показано для объяснения принципа. Другая модель может разделить эту фразу иначе.</figcaption>
    </figure>
  );
}
