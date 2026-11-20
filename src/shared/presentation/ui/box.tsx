import type { AriaAttributes, ReactNode } from "react";
import { tv } from "tailwind-variants/lite";
import { paddingClass, paddingXClass, paddingYClass, type Space } from "./tokens";

const box = tv({
  base: "min-w-0",
  variants: {
    surface: {
      none: "",
      canvas: "bg-canvas",
      subtle: "bg-surface-subtle",
      ink: "bg-ink",
      "ink-raised": "bg-ink-raised",
    },
    border: {
      none: "",
      line: "border border-line",
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
    },
    grow: { true: "flex-1", false: "" },
    fillHeight: { true: "h-full", false: "" },
    centered: { true: "mx-auto", false: "" },
  },
  defaultVariants: {
    surface: "none",
    border: "none",
    radius: "none",
    width: "auto",
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
  surface?: "none" | "canvas" | "subtle" | "ink" | "ink-raised";
  border?: "none" | "line" | "ink-line";
  radius?: "none" | "sm" | "md" | "lg" | "xl" | "full";
  width?: "auto" | "full" | "form" | "card";
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
  surface,
  border,
  radius,
  width,
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
  ].join(" ");

  return (
    <Element
      className={`${box({ surface, border, radius, width, grow, fillHeight, centered })} ${spacing}`}
      {...rest}
    >
      {children}
    </Element>
  );
}
