import { asset } from "@/lib/asset";

/**
 * Icon — renders an exported Figma SVG as a CSS mask so its colour comes from
 * the current text colour (design tokens), not from the file itself.
 *
 * The SVGs in `public/img/icons` were exported from Figma with the Plugin API
 * (`node.exportAsync({ format: "SVG_STRING" })`) — they are the real vector
 * data from the file, not redrawn.
 *
 * A mask is used instead of <img> because several icons have to change colour
 * with component state (e.g. the carousel arrow goes from icon-primary to
 * icon-secondary when the control is disabled), which an <img> cannot do.
 *
 * The path goes through `asset()` because an inline `url()` does not get the
 * basePath that next/image applies on its own (see src/lib/asset.ts).
 */
export function Icon({
  src,
  className = "",
}: {
  /** Path under /public, e.g. "/img/icons/arrow-next.svg" */
  src: string;
  /** Size + colour utilities, e.g. "size-[24px] text-icon-primary" */
  className?: string;
}) {
  const mask = `url("${asset(src)}")`;

  return (
    <span
      aria-hidden
      style={{ maskImage: mask, WebkitMaskImage: mask }}
      className={
        "inline-block shrink-0 bg-current [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain] " +
        "[-webkit-mask-position:center] [-webkit-mask-repeat:no-repeat] [-webkit-mask-size:contain] " +
        className
      }
    />
  );
}

export default Icon;
