import { HTMLAttributes } from "react";

type TextVariant = "body" | "label" | "caption" | "muted";
type TextAs = "p" | "span" | "div" | "label";

interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: TextAs;
  variant?: TextVariant;
}

const VARIANTS: Record<TextVariant, string> = {
  body: "text-sm text-zinc-700 dark:text-zinc-300",
  label: "text-sm font-medium text-zinc-700 dark:text-zinc-300",
  caption: "text-xs text-zinc-500 dark:text-zinc-400",
  muted: "text-xs text-zinc-400 dark:text-zinc-500",
};

/**
 * Variants: body | label | caption | muted
 * as:       p | span | div | label  (default p)
 */
export default function Text({
  as: Tag = "p",
  variant = "body",
  className = "",
  children,
  ...props
}: TextProps) {
  return (
    <Tag
      className={[VARIANTS[variant], className].filter(Boolean).join(" ")}
      {...props}
    >
      {children}
    </Tag>
  );
}
