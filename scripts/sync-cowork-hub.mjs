import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import YAML from "yaml";

const repository = "https://gitverse.ru/gigab2b/cowork_hub.git";
const output = resolve("src/content/cowork-hub-catalog.json");
const sourceOption = process.argv.indexOf("--source");
const suppliedSource = sourceOption >= 0 ? process.argv[sourceOption + 1] : null;
if (sourceOption >= 0 && !suppliedSource) throw new Error("Expected a path after --source");

const temporary = suppliedSource ? null : mkdtempSync(join(tmpdir(), "cowork-hub-"));
const source = suppliedSource ? resolve(suppliedSource) : join(temporary, "repo");
const skillDocuments = new Map();

function readYaml(path) {
  return YAML.parse(readFileSync(path, "utf8"));
}

function readMarkdownMeta(path) {
  const markdown = readFileSync(path, "utf8");
  const frontmatter = markdown.match(/^---\s*\n([\s\S]*?)\n---(?:\s*\n|$)/);
  return frontmatter ? YAML.parse(frontmatter[1]) : {};
}

function skillSections(markdown) {
  const body = markdown.replace(/^---\s*\n[\s\S]*?\n---(?:\s*\n|$)/, "");
  const sections = [];
  let inCode = false;
  for (const line of body.split(/\r?\n/)) {
    if (/^\s*(```|~~~)/.test(line)) {
      inCode = !inCode;
      continue;
    }
    const heading = !inCode && line.match(/^##\s+(.+)$/);
    if (heading) sections.push(heading[1].trim());
  }
  return sections;
}

function entries(directory, fileForDirectory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name, ...(fileForDirectory ? [fileForDirectory] : []));
    if (fileForDirectory ? !entry.isDirectory() || !existsSync(path) : !entry.isFile() || !entry.name.endsWith(".md")) return [];
    const meta = readMarkdownMeta(path);
    return [{ slug: fileForDirectory ? entry.name : entry.name.replace(/\.md$/, ""), name: meta.name || entry.name, description: meta.description || "" }];
  }).sort((a, b) => a.slug.localeCompare(b.slug));
}

function standaloneSkills(source) {
  const directory = join(source, "skills");
  return Object.fromEntries(readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name, "SKILL.md");
    if (!entry.isDirectory() || !existsSync(path)) return [];
    const markdown = readFileSync(path, "utf8");
    const meta = readMarkdownMeta(path);
    if (!meta?.name || !meta?.description || !meta?.category) throw new Error(`Invalid standalone skill: ${path}`);
    skillDocuments.set(entry.name, markdown);
    return [[entry.name, {
      name: meta.name,
      description: meta.description,
      category: meta.category,
      version: meta.version || 1,
      tags: meta.tags || [],
      sections: skillSections(markdown),
    }]];
  }));
}

function integrations(source) {
  const directory = join(source, "integrations");
  if (!existsSync(directory)) return {};
  return Object.fromEntries(readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name, "integration.yaml");
    if (!entry.isDirectory() || !existsSync(path)) return [];
    const meta = readYaml(path);
    if (!meta?.name || !meta?.description || !meta?.category) throw new Error(`Invalid integration: ${path}`);
    return [[entry.name, {
      name: meta.name,
      description: meta.description,
      category: meta.category,
      version: meta.version || 1,
    }]];
  }));
}

try {
  if (!suppliedSource) execFileSync("git", ["clone", "--depth", "1", repository, source], { stdio: "inherit" });
  const sha = execFileSync("git", ["-C", source, "rev-parse", "HEAD"], { encoding: "utf8" }).trim();
  const categories = readYaml(join(source, "categories.yaml"));
  const pluginRoot = join(source, "plugins");
  const plugins = Object.fromEntries(readdirSync(pluginRoot, { withFileTypes: true }).flatMap((entry) => {
    const directory = join(pluginRoot, entry.name);
    const manifestPath = join(directory, "plugin.yaml");
    if (!entry.isDirectory() || !existsSync(manifestPath)) return [];
    const manifest = readYaml(manifestPath);
    if (!manifest?.name || !manifest?.description || !manifest?.category) throw new Error(`Invalid manifest: ${manifestPath}`);
    return [[entry.name, {
      name: manifest.name,
      description: manifest.description,
      category: manifest.category,
      version: manifest.version,
      tags: manifest.tags || [],
      skills: entries(join(directory, "skills"), "SKILL.md"),
      commands: entries(join(directory, "commands")),
      agents: entries(join(directory, "agents")),
    }]];
  }));
  if (Object.keys(plugins).length < 10) throw new Error("Unexpectedly small plugin catalogue");
  const skills = standaloneSkills(source);
  const integrationCards = integrations(source);
  const downloadDir = resolve("public/catalog/skills");
  mkdirSync(downloadDir, { recursive: true });
  for (const file of readdirSync(downloadDir)) {
    if (file.endsWith(".md") && !skillDocuments.has(file.slice(0, -3))) rmSync(join(downloadDir, file));
  }
  for (const [slug, markdown] of skillDocuments) writeFileSync(join(downloadDir, `${slug}.md`), markdown);
  writeFileSync(output, `${JSON.stringify({ repository, sha, categories, plugins, skills, integrations: integrationCards }, null, 2)}\n`);
  console.log(`Synced ${Object.keys(plugins).length} plugins, ${Object.keys(skills).length} skills, ${Object.keys(integrationCards).length} integrations from ${sha.slice(0, 12)}`);
} finally {
  if (temporary) rmSync(temporary, { recursive: true, force: true });
}
