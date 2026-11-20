import type { LucideIcon } from "lucide-react";
import type { MouseEventHandler } from "react";
import { tv } from "tailwind-variants/lite";
import { Icon } from "./icon";

const iconButton = tv({
  base: "relative inline-flex shrink-0 cursor-pointer items-center justify-center transition-[background-color,box-shadow,color] duration-150 ease-out-quart disabled:cursor-not-allowed disabled:opacity-50",
  variants: {
    variant: {
      ghost: "text-text-secondary hover:bg-surface-subtle hover:text-text",
      secondary: "border border-line bg-canvas text-text shadow-field hover:bg-surface-subtle",
      primary: "bg-primary text-on-ink shadow-primary hover:bg-primary-hover active:bg-primary-active",
      tile: "text-text-secondary hover:bg-canvas aria-[current=page]:bg-canvas aria-[current=page]:text-text aria-[current=page]:shadow-card",
    },
    size: { sm: "size-8", md: "size-9", lg: "size-11" },
    shape: { square: "", round: "rounded-full" },
  },
  // A square tile is rounder than a square button; one radius class per combination.
  compoundVariants: [
    { variant: ["ghost", "secondary", "primary"], shape: "square", class: "rounded-md" },
    { variant: "tile", shape: "square", class: "rounded-lg" },
  ],
  defaultVariants: { variant: "ghost", size: "md", shape: "square" },
});

export type IconButtonProps = {
  icon: LucideIcon;
  /** Required: an icon-only action needs a name. */
  label: string;
  variant?: "ghost" | "secondary" | "primary" | "tile";
  size?: "sm" | "md" | "lg";
  shape?: "square" | "round";
  type?: "button" | "submit";
  /** A count shown on the corner (rail items). */
  badge?: number;
  badgeLabel?: string;
  current?: boolean;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  "aria-expanded"?: boolean;
  "aria-controls"?: string;
  "aria-haspopup"?: "menu" | "dialog";
};

export function IconButton({
  icon,
  label,
  variant,
  size,
  shape,
  type = "button",
  badge,
  badgeLabel = "",
  current = false,
  ...rest
}: IconButtonProps) {
  const name = badge ? `${label}, ${badge} ${badgeLabel}`.trim() : label;
  return (
    <button
      type={type}
      aria-label={name}
      aria-current={current ? "page" : undefined}
      className={iconButton({ variant, size, shape })}
      {...rest}
    >
      <Icon icon={icon} size={size === "lg" ? "lg" : "md"} />
      {badge ? (
        <span
          aria-hidden
          className="absolute -top-1 -right-1 inline-flex h-4.5 min-w-4.5 items-center justify-center rounded-full border-2 border-surface-subtle bg-primary px-1 text-[0.625rem] font-semibold text-on-ink tabular-nums"
        >
          {badge}
        </span>
      ) : null}
    </button>
  );
}
