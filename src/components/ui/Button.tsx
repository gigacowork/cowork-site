import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

/**
 * Button — Figma 316:985 (27 variants: Type × Size × State).
 *
 * Sizes — note that Large and Medium BOTH use Body/M 14px; only Small drops to
 * Caption 12px. Rendered heights match Figma exactly: 41 / 33 / 30.
 *   Large   px-24 py-12  14px   → 24 + 16.8 = 40.8 ≈ 41  (316:986)
 *   Medium  px-24 py-8   14px   → 16 + 16.8 = 32.8 ≈ 33  (320:914)
 *   Small   px-16 py-8   12px   → 16 + 14.4 = 30.4 ≈ 30  (319:55)
 *
 * States — the component has Default / Hover / Disabled (no Pressed).
 * Hover-варианты помечены `not-disabled:`, а НЕ `enabled:` — псевдокласс
 * `:enabled` существует только у элементов формы, поэтому на `<a>` (кнопка со
 * ссылкой) он не срабатывает и ховер молча пропадал.
 *   Primary    default action-primary-default · hover action-primary-hover
 *              disabled action-primary-disabled, label text-tertiary
 *   Secondary  bg stays white, hover action-secondary-hover
 *              border border-strong, disabled border-subtle + label text-tertiary
 *   Ghost      bg action-secondary-default (white, NOT transparent)
 *              hover action-secondary-hover, disabled label text-tertiary
 */

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-action-primary-default text-text-inverse " +
    "not-disabled:hover:bg-action-primary-hover " +
    "disabled:bg-action-primary-disabled disabled:text-text-tertiary",
  secondary:
    "bg-action-secondary-default text-text-primary border border-border-strong " +
    "not-disabled:hover:bg-action-secondary-hover " +
    "disabled:border-border-subtle disabled:text-text-tertiary",
  ghost:
    "bg-action-secondary-default text-text-primary " +
    "not-disabled:hover:bg-action-secondary-hover " +
    "disabled:text-text-tertiary",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-16 py-8 text-caption",
  md: "px-24 py-8 text-body-m",
  lg: "px-24 py-12 text-body-m",
};

type BaseProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type ButtonProps = BaseProps &
  Omit<ComponentPropsWithoutRef<"button">, "className" | "children"> & {
    href?: undefined;
  };

type AnchorProps = BaseProps & {
  href: string;
} & Omit<ComponentPropsWithoutRef<"a">, "className" | "children" | "href">;

const base =
  "inline-flex items-center justify-center gap-8 rounded-full whitespace-nowrap " +
  "transition-colors duration-200 cursor-pointer select-none " +
  "disabled:cursor-default " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary";

export function Button(props: ButtonProps | AnchorProps) {
  const {
    variant = "primary",
    size = "md",
    className = "",
    children,
    ...rest
  } = props as BaseProps & Record<string, unknown>;

  const classes = `${base} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if (typeof (rest as { href?: string }).href === "string") {
    const { href, ...anchorRest } = rest as { href: string };
    return (
      <Link href={href} className={classes} {...anchorRest}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  );
}

export default Button;
