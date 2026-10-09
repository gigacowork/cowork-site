import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { catalogGitUrl } from "@/lib/catalog-source";
import CatalogTypeIcon, { type CatalogIconKind } from "./CatalogTypeIcon";
import SourceTextBlock from "./SourceTextBlock";
import styles from "./outreach.module.css";

type ComponentEntry = { slug: string; name: string; description: string; content?: string };
type ComponentKind = "agents" | "skills" | "commands";

const groups: { kind: ComponentKind; title: string; icon: CatalogIconKind }[] = [
  { kind: "agents", title: "Агенты", icon: "agent" },
  { kind: "skills", title: "Навыки", icon: "skill" },
  { kind: "commands", title: "Команды", icon: "command" },
];

function sourcePath(kind: ComponentKind, slug: string) {
  return kind === "skills" ? `skills/${slug}/SKILL.md` : `${kind}/${slug}.md`;
}

function hideConsultantSections(markdown: string) {
  let hiddenLevel = 0;
  return markdown.split(/\r?\n/).filter((line) => {
    const heading = line.match(/^(#{1,6})\s+(.+?)\s*$/);
    if (heading) {
      const level = heading[1].length;
      if (hiddenLevel && level <= hiddenLevel) hiddenLevel = 0;
      if (heading[2] === "Для консультантов") hiddenLevel = level;
    }
    return hiddenLevel === 0;
  }).join("\n");
}

export default function PluginDetailContent({
  slug,
  readme,
  files,
  agents,
  skills,
  commands,
  standaloneSkills,
}: {
  slug: string;
  readme: string | null;
  files: readonly string[];
  agents: ComponentEntry[];
  skills: ComponentEntry[];
  commands: ComponentEntry[];
  standaloneSkills: readonly string[];
}) {
  const components = { agents, skills, commands };
  const markdown = readme
    ? hideConsultantSections(readme)
    .replace(/^#\s+[^\n]+\r?\n/, "")
    .replace(/^## Как это идёт\s*$/m, "## Как это работает")
    .trim()
    : null;

  return (
    <>
      {markdown && (
        <section className={styles.pluginReadme} aria-label="Описание плагина">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              table: ({ children }) => <div className={styles.markdownTableScroll}><table>{children}</table></div>,
              a: ({ href, children }) => {
                const url = href && !/^(?:[a-z]+:|\/|#)/i.test(href)
                  ? catalogGitUrl("plugins", slug, href.replace(/^\.\//, ""))
                  : href;
                return <a href={url} target={url?.startsWith("http") ? "_blank" : undefined} rel={url?.startsWith("http") ? "noopener noreferrer" : undefined}>{children}</a>;
              },
            }}
          >
            {markdown}
          </ReactMarkdown>
        </section>
      )}

      {groups.some(({ kind }) => components[kind].length > 0) && (
        <section className={styles.pluginParts} aria-labelledby="plugin-parts-title">
          <h2 id="plugin-parts-title">Состав плагина</h2>
          {groups.map(({ kind, title, icon }) => components[kind].length > 0 && (
            <div className={styles.pluginPartGroup} key={kind}>
              <h3>{title}</h3>
              <div className={styles.pluginPartList}>
                {components[kind].map((entry) => {
                  const path = sourcePath(kind, entry.slug);
                  return (
                    <details className={styles.pluginPart} key={entry.slug}>
                      <summary>
                        <span className={styles.pluginPartIcon}><CatalogTypeIcon kind={icon} /></span>
                        <span className={styles.pluginPartHeading}>
                          <strong>{entry.name}</strong>
                          <span>{entry.description}</span>
                        </span>
                        <span className={styles.pluginPartChevron} aria-hidden="true">⌄</span>
                      </summary>
                      <div className={styles.pluginPartBody}>
                        <p>{entry.description}</p>
                        <p className={styles.pluginPartAlias}>Alias: <code>{entry.slug}</code></p>
                        {files.includes(path) && <a href={catalogGitUrl("plugins", slug, path)} target="_blank" rel="noopener noreferrer">Исходный файл в GitVerse ↗</a>}
                        {kind === "skills" && standaloneSkills.includes(entry.slug) && <Link href={`/marketplace-plugin/catalog/skills/${entry.slug}/`}>Страница навыка ↗</Link>}
                        {entry.content && (kind === "skills" || kind === "commands") && (
                          <SourceTextBlock text={entry.content} label={kind === "skills" ? "Текст навыка" : "Текст команды"} />
                        )}
                      </div>
                    </details>
                  );
                })}
              </div>
            </div>
          ))}
        </section>
      )}
    </>
  );
}
