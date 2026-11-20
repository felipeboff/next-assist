import type { LucideIcon } from "lucide-react";
import type { MouseEventHandler, ReactNode } from "react";
import { tv } from "tailwind-variants/lite";
import { Icon } from "./icon";
import { Spinner } from "./spinner";

const button = tv({
  base: "relative inline-flex cursor-pointer items-center justify-center gap-2 rounded-sm font-medium transition-[background-color,box-shadow,color] duration-150 ease-out-quart select-none disabled:cursor-not-allowed",
  variants: {
    variant: {
      primary:
        "bg-primary text-on-ink shadow-primary hover:bg-primary-hover active:bg-primary-active disabled:bg-primary/60 disabled:shadow-none",
      secondary:
        "border border-line bg-canvas text-text shadow-field hover:bg-surface-subtle disabled:text-text-muted",
      ghost: "bg-transparent text-text hover:bg-surface-subtle disabled:text-text-muted",
      link: "rounded-xs bg-transparent font-medium text-primary underline-offset-2 hover:underline disabled:text-text-muted",
      danger: "bg-danger text-on-ink hover:bg-danger/90 active:bg-danger/80 disabled:bg-danger/60",
      "danger-soft": "bg-danger-soft text-danger hover:bg-danger/10 disabled:text-danger/60",
    },
    size: {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-md",
    },
    block: { true: "w-full", false: "" },
  },
  compoundVariants: [
    { variant: ["primary", "secondary", "ghost", "danger", "danger-soft"], size: "sm", class: "h-8 px-3" },
    { variant: ["primary", "secondary", "ghost", "danger", "danger-soft"], size: "md", class: "h-9 px-3.5" },
    { variant: ["primary", "secondary", "ghost", "danger", "danger-soft"], size: "lg", class: "h-11 px-5" },
  ],
  defaultVariants: { variant: "primary", size: "md", block: false },
});

export type ButtonProps = {
  children?: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "link" | "danger" | "danger-soft";
  size?: "sm" | "md" | "lg";
  block?: boolean;
  type?: "button" | "submit" | "reset";
  iconStart?: LucideIcon;
  iconEnd?: LucideIcon;
  loading?: boolean;
  loadingLabel?: string;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  "aria-label"?: string;
  "aria-expanded"?: boolean;
  "aria-controls"?: string;
  "aria-pressed"?: boolean;
  "aria-disabled"?: boolean;
  "aria-keyshortcuts"?: string;
  title?: string;
  "data-testid"?: string;
};

export function Button({
  children,
  variant,
  size,
  block,
  type = "button",
  iconStart,
  iconEnd,
  loading = false,
  loadingLabel,
  disabled = false,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={button({ variant, size, block })}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <Spinner size="sm" /> : iconStart ? <Icon icon={iconStart} size="sm" /> : null}
      {loading && loadingLabel ? loadingLabel : children}
      {!loading && iconEnd ? <Icon icon={iconEnd} size="sm" /> : null}
    </button>
  );
}
