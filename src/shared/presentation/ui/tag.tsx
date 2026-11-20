import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { tv } from "tailwind-variants/lite";
import { Icon } from "./icon";
import { StatusDot } from "./status-dot";
import type { StatusTone } from "./tokens";

const tag = tv({
  base: "inline-flex max-w-full shrink-0 items-center",
  variants: {
    color: {
      canvas: "bg-canvas text-text",
      soft: "bg-primary-soft text-primary",
      subtle: "bg-surface-subtle text-text",
      neutral: "bg-surface-subtle text-text-secondary",
      primary: "bg-primary-tint text-primary",
      success: "bg-success-soft text-success-text",
      "success-tint": "bg-success-tint text-success-text",
      warning: "bg-warning-soft text-warning-text",
      danger: "bg-danger-soft text-danger",
    },
    size: {
      xs: "gap-1 px-1.5 text-[0.6875rem] leading-4 font-semibold",
      sm: "gap-2 px-2.5 py-1 text-2xs",
      md: "gap-1.5 px-3 py-1 text-xs font-medium",
    },
    shape: { pill: "rounded-full", rounded: "rounded-xs" },
  },
  defaultVariants: { color: "canvas", size: "sm", shape: "pill" },
});

export type TagProps = {
  /** Background of the neutral tags (login showcase). */
  surface?: "canvas" | "soft" | "subtle";
  /** A tinted tag whose text takes the tone: online, waiting, AI, team. Wins over `surface`. */
  tone?: "neutral" | "primary" | "success" | "success-tint" | "warning" | "danger";
  size?: "xs" | "sm" | "md";
  shape?: "pill" | "rounded";
  dot?: StatusTone;
  icon?: LucideIcon;
  children: ReactNode;
};

export function Tag({ surface = "canvas", tone, size, shape, dot, icon, children }: TagProps) {
  return (
    <span className={tag({ color: tone ?? surface, size, shape })}>
      {dot ? <StatusDot tone={dot} size="sm" /> : null}
      {icon ? <Icon icon={icon} size="xs" /> : null}
      <span className="inline-flex min-w-0 items-baseline gap-2 truncate">{children}</span>
    </span>
  );
}
