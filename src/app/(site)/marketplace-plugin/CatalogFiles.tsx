import { catalogGitUrl, type CatalogKind } from "@/lib/catalog-source";
import styles from "./outreach.module.css";

export default function CatalogFiles({ kind, slug, files, collapsible = false }: { kind: CatalogKind; slug: string; files: readonly string[]; collapsible?: boolean }) {
  const fileList = (
    <ul className={styles.filesList}>
      {files.map((file) => (
        <li key={file}>
          <a href={catalogGitUrl(kind, slug, file)} target="_blank" rel="noopener noreferrer">{file} <span aria-hidden="true">↗</span></a>
        </li>
      ))}
    </ul>
  );

  return (
    <section className={styles.scenarioSection} aria-labelledby="catalog-files-title">
      <h2 id="catalog-files-title">Файлы</h2>
      <div className={styles.filesContent}>
        <a className={styles.gitLink} href={catalogGitUrl(kind, slug)} target="_blank" rel="noopener noreferrer">
          Открыть в GitVerse <span aria-hidden="true">↗</span>
        </a>
        {collapsible ? <details className={styles.fileDisclosure}><summary>Все файлы ({files.length})</summary>{fileList}</details> : fileList}
      </div>
    </section>
  );
}
