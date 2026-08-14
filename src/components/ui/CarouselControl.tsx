import type { ComponentPropsWithoutRef } from "react";
import { Icon } from "@/components/ui/Icon";

/**
 * Carousel Control — Figma 802:3907
 *
 * 56×44, radius-full, border 1.5px. Four states per direction:
 *   Default   802:3895 / 803:2715  bg action-secondary-default  border border-default
 *   Hover     802:3898 / 803:2718  bg action-secondary-hover    border border-strong
 *   Pressed   802:3901 / 803:2721  bg action-secondary-pressed  border border-strong
 *   Disabled  802:3904 / 803:2724  bg action-secondary-disabled border border-subtle
 *
 * Previous is the Next glyph rotated 180° (that is how the component is built
 * in Figma), so a single 20×20 asset covers both directions.
 *
 * Hover/pressed are scoped with `enabled:` so a disabled control stays flat.
 */

type Props = {
  direction: "next" | "previous";
} & Omit<ComponentPropsWithoutRef<"button">, "children" | "type">;

const LABEL: Record<Props["direction"], string> = {
  previous: "Предыдущая карточка",
  next: "Следующая карточка",
};

export function CarouselControl({
  direction,
  className = "",
  ...rest
}: Props) {
  return (
    <button
      type="button"
      aria-label={LABEL[direction]}
      className={
        "group flex h-[44px] w-[56px] shrink-0 cursor-pointer items-center justify-center rounded-full border-[1.5px] " +
        "border-border-default bg-action-secondary-default transition-colors duration-200 " +
        "enabled:hover:border-border-strong enabled:hover:bg-action-secondary-hover " +
        "enabled:active:border-border-strong enabled:active:bg-action-secondary-pressed " +
        "disabled:cursor-default disabled:border-border-subtle disabled:bg-action-secondary-disabled " +
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary " +
        className
      }
      {...rest}
    >
      {/* Arrow / Next 802:3896 — Previous is the same glyph rotated 180°. */}
      <Icon
        src="/img/icons/arrow-next.svg"
        className={`size-[20px] text-icon-primary group-disabled:text-icon-secondary ${
          direction === "previous" ? "rotate-180" : ""
        }`}
      />
    </button>
  );
}

/**
 * Carousel Navigation — Figma 804:3916. Row of both controls, gap-8 (120×44).
 * Position=Start 804:3895 → previous disabled
 * Position=Middle 804:3902 → both enabled
 * Position=End 804:3909 → next disabled
 *
 * The disabled flags are driven at runtime by the scroll controller, which
 * toggles `disabled` on these buttons. The server-rendered default is
 * Position=Start, which is what the carousel actually shows on load.
 */
export function CarouselNavigation({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-8 ${className}`}>
      <CarouselControl direction="previous" data-cards-prev disabled />
      <CarouselControl direction="next" data-cards-next />
    </div>
  );
}

export default CarouselControl;
