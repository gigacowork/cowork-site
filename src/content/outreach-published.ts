import scenarios from "./outreach-ready-scenarios.json";
import catalog from "./cowork-hub-catalog.json";

export type Scenario = (typeof scenarios)[number];
export type Plugin = (typeof catalog.plugins)[keyof typeof catalog.plugins];

function pluginSlug(item: Scenario) {
  return item.source.match(/^plugins\/([^\s·]+)/)?.[1];
}

function titleHash(title: string) {
  let value = 2166136261;
  for (const character of title) {
    value ^= character.codePointAt(0) || 0;
    value = Math.imul(value, 16777619);
  }
  return (value >>> 0).toString(36);
}

export const publishedScenarios = scenarios.flatMap((item) => {
  const sourceSlug = pluginSlug(item);
  if (item.evidence !== "готово в каталоге" || !sourceSlug || !(sourceSlug in catalog.plugins)) return [];
  return [{
    slug: `${sourceSlug}-${titleHash(item.scenario)}`,
    item,
    plugin: catalog.plugins[sourceSlug as keyof typeof catalog.plugins] as Plugin,
  }];
});

export function findPublishedScenario(slug: string) {
  return publishedScenarios.find((entry) => entry.slug === slug);
}

export function categoryName(industry: string) {
  return industry === "Продажи и девелопмент" ? "Продажи" : industry;
}
