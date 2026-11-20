export type Space = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl";

export const gapClass: Record<Space, string> = {
  none: "gap-0",
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-3",
  lg: "gap-4",
  xl: "gap-5",
  "2xl": "gap-6",
  "3xl": "gap-8",
  "4xl": "gap-10",
  "5xl": "gap-12",
  "6xl": "gap-14",
  "7xl": "gap-16",
};

export const paddingClass: Record<Space, string> = {
  none: "p-0",
  xs: "p-1",
  sm: "p-2",
  md: "p-3",
  lg: "p-4",
  xl: "p-5",
  "2xl": "p-6",
  "3xl": "p-8",
  "4xl": "p-10",
  "5xl": "p-12",
  "6xl": "p-14",
  "7xl": "p-16",
};

export const paddingXClass: Record<Space, string> = {
  none: "px-0",
  xs: "px-1",
  sm: "px-2",
  md: "px-3",
  lg: "px-4",
  xl: "px-5",
  "2xl": "px-6",
  "3xl": "px-8",
  "4xl": "px-10",
  "5xl": "px-12",
  "6xl": "px-14",
  "7xl": "px-16",
};

export const paddingYClass: Record<Space, string> = {
  none: "py-0",
  xs: "py-1",
  sm: "py-2",
  md: "py-3",
  lg: "py-4",
  xl: "py-5",
  "2xl": "py-6",
  "3xl": "py-8",
  "4xl": "py-10",
  "5xl": "py-12",
  "6xl": "py-14",
  "7xl": "py-16",
};

export const paddingTopClass: Record<Space, string> = {
  none: "pt-0",
  xs: "pt-1",
  sm: "pt-2",
  md: "pt-3",
  lg: "pt-4",
  xl: "pt-5",
  "2xl": "pt-6",
  "3xl": "pt-8",
  "4xl": "pt-10",
  "5xl": "pt-12",
  "6xl": "pt-14",
  "7xl": "pt-16",
};

export const paddingBottomClass: Record<Space, string> = {
  none: "pb-0",
  xs: "pb-1",
  sm: "pb-2",
  md: "pb-3",
  lg: "pb-4",
  xl: "pb-5",
  "2xl": "pb-6",
  "3xl": "pb-8",
  "4xl": "pb-10",
  "5xl": "pb-12",
  "6xl": "pb-14",
  "7xl": "pb-16",
};

export const marginStartClass: Record<Space, string> = {
  none: "ms-0",
  xs: "ms-1",
  sm: "ms-2",
  md: "ms-3",
  lg: "ms-4",
  xl: "ms-5",
  "2xl": "ms-6",
  "3xl": "ms-8",
  "4xl": "ms-10",
  "5xl": "ms-12",
  "6xl": "ms-14",
  "7xl": "ms-16",
};

export type TextTone =
  | "default"
  | "secondary"
  | "muted"
  | "primary"
  | "danger"
  | "success"
  | "warning"
  | "on-ink"
  | "on-ink-soft"
  | "on-ink-muted"
  | "on-ink-subtle"
  | "on-ink-faint"
  | "inherit";

export const textToneClass: Record<TextTone, string> = {
  default: "text-text",
  secondary: "text-text-secondary",
  muted: "text-text-muted",
  primary: "text-primary",
  danger: "text-danger",
  success: "text-success-text",
  warning: "text-warning-text",
  "on-ink": "text-on-ink",
  "on-ink-soft": "text-on-ink-soft",
  "on-ink-muted": "text-on-ink-muted",
  "on-ink-subtle": "text-on-ink-subtle",
  "on-ink-faint": "text-on-ink-faint",
  inherit: "text-inherit",
};

export type TextSize = "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";

export const textSizeClass: Record<TextSize, string> = {
  "2xs": "text-2xs",
  xs: "text-xs",
  sm: "text-sm",
  md: "text-md",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
};

export type FontWeight = "regular" | "medium" | "semibold";

export const fontWeightClass: Record<FontWeight, string> = {
  regular: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
};

export type StatusTone = "success" | "warning" | "danger" | "primary" | "muted";
