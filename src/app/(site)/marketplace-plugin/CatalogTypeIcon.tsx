import { asset } from "@/lib/asset";

export type CatalogIconKind = "plugin" | "agent" | "integration" | "skill" | "command";

export default function CatalogTypeIcon({ kind, className = "" }: { kind: CatalogIconKind; className?: string }) {
  return <img className={className} src={asset(`/img/catalog/${kind}.svg`)} width={24} height={24} alt="" aria-hidden="true" />;
}
