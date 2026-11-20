import type { AriaAttributes, ReactNode } from "react";
import { tv } from "tailwind-variants/lite";
import {
  paddingBottomClass,
  paddingClass,
  paddingTopClass,
  paddingXClass,
  paddingYClass,
  type Space,
} from "./tokens";

const box = tv({
  base: "min-w-0",
  variants: {
    surface: {
      none: "",
      canvas: "bg-canvas",
      subtle: "bg-surface-subtle",
      muted: "bg-surface-muted",
      "primary-soft": "bg-primary-soft",
      "warning-soft": "bg-warning-soft",
      ink: "bg-ink",
      "ink-raised": "bg-ink-raised",
    },
    border: {
      none: "",
      line: "border border-line",
      "line-soft": "border border-line-soft",
      "ink-line": "border border-ink-line",
    },
    radius: {
      none: "",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      xl: "rounded-xl",
      full: "rounded-full",
    },
    width: {
      auto: "",
      full: "w-full",
      form: "w-full max-w-[23.75rem]",
      card: "w-full max-w-[31.25rem]",
      reply: "w-full max-w-[37.5rem]",
      page: "w-full max-w-[37.5rem]",
      thread: "w-full max-w-[50.5rem]",
    },
    shadow: { none: "", card: "shadow-card" },
    clip: { true: "overflow-hidden", false: "" },
    grow: { true: "flex-1", false: "" },
    fillHeight: { true: "h-full", false: "" },
    centered: { true: "mx-auto", false: "" },
  },
  defaultVariants: {
    surface: "none",
    border: "none",
    radius: "none",
    width: "auto",
    shadow: "none",
    clip: false,
    grow: false,
    fillHeight: false,
    centered: false,
  },
});

type BoxElement = "div" | "section" | "article" | "aside" | "header" | "footer" | "main" | "nav";

export type BoxProps = AriaAttributes & {
  as?: BoxElement;
  id?: string;
  padding?: Space;
  paddingX?: Space;
  paddingY?: Space;
  /** Use instead of `paddingY` when top and bottom differ. */
  paddingTop?: Space;
  paddingBottom?: Space;
  surface?: "none" | "canvas" | "subtle" | "muted" | "primary-soft" | "warning-soft" | "ink" | "ink-raised";
  border?: "none" | "line" | "line-soft" | "ink-line";
  radius?: "none" | "sm" | "md" | "lg" | "xl" | "full";
  width?: "auto" | "full" | "form" | "card" | "reply" | "page" | "thread";
  shadow?: "none" | "card";
  /** Clips children to the radius (cards with a tinted footer). */
  clip?: boolean;
  grow?: boolean;
  fillHeight?: boolean;
  centered?: boolean;
  "data-testid"?: string;
  children?: ReactNode;
};

export function Box({
  as: Element = "div",
  padding,
  paddingX,
  paddingY,
  paddingTop,
  paddingBottom,
  surface,
  border,
  radius,
  width,
  shadow,
  clip,
  grow,
  fillHeight,
  centered,
  children,
  ...rest
}: BoxProps) {
  const spacing = [
    padding ? paddingClass[padding] : "",
    paddingX ? paddingXClass[paddingX] : "",
    paddingY ? paddingYClass[paddingY] : "",
    paddingTop ? paddingTopClass[paddingTop] : "",
    paddingBottom ? paddingBottomClass[paddingBottom] : "",
  ].join(" ");

  return (
    <Element
      className={`${box({ surface, border, radius, width, shadow, clip, grow, fillHeight, centered })} ${spacing}`}
      {...rest}
    >
      {children}
    </Element>
  );
}
