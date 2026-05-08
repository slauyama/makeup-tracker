import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "pill";
type Size = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  active?: boolean;
}

const BASE =
  "inline-flex items-center justify-center font-medium transition disabled:opacity-50 disabled:cursor-not-allowed";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-rose-500 text-white hover:bg-rose-600 rounded-lg shadow-sm",
  secondary:
    "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50 rounded-lg dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-700",
  ghost:
    "text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-700",
  danger: "text-zinc-300 hover:text-red-400",
  pill: "rounded-full border",
};

const SIZES: Record<Size, string> = {
  sm: "px-3 py-1 text-sm",
  md: "px-4 py-2 text-sm",
};

const PILL_COLOR = {
  active: "bg-rose-500 text-white border-rose-500 shadow-sm",
  inactive:
    "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700 dark:hover:bg-zinc-700",
};

/**
 * Variants: primary | secondary | danger | pill
 * Sizes:    sm | md  (default md)
 * active:   boolean — only used with variant="pill"
 */
export default function Button({
  variant = "primary",
  size = "md",
  active,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const pillColor =
    variant === "pill"
      ? active
        ? PILL_COLOR.active
        : PILL_COLOR.inactive
      : "";

  return (
    <button
      className={[BASE, VARIANTS[variant], SIZES[size], pillColor, className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
