import type { AriaAttributes, ReactNode } from "react";
import { tv } from "tailwind-variants/lite";
import { gapClass, paddingTopClass, type Space } from "./tokens";

const stack = tv({
  base: "flex min-w-0",
  variants: {
    direction: {
      column: "flex-col",
      row: "flex-row",
    },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
      baseline: "items-baseline",
    },
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
    },
    wrap: { true: "flex-wrap", false: "" },
    grow: { true: "flex-1", false: "" },
    fillHeight: { true: "h-full", false: "" },
    width: { auto: "", full: "w-full" },
  },
  defaultVariants: {
    direction: "column",
    align: "stretch",
    justify: "start",
    wrap: false,
    grow: false,
    fillHeight: false,
    width: "auto",
  },
});

type StackElement =
  "div" | "section" | "article" | "aside" | "header" | "footer" | "main" | "nav" | "ul" | "ol" | "li";

export type StackProps = AriaAttributes & {
  as?: StackElement;
  id?: string;
  direction?: "column" | "row";
  gap?: Space;
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  justify?: "start" | "center" | "end" | "between";
  wrap?: boolean;
  grow?: boolean;
  fillHeight?: boolean;
  width?: "auto" | "full";
  paddingTop?: Space;
  "data-testid"?: string;
  children?: ReactNode;
};

export function Stack({
  as: Element = "div",
  direction,
  gap = "none",
  align,
  justify,
  wrap,
  grow,
  fillHeight,
  width,
  paddingTop,
  children,
  ...rest
}: StackProps) {
  const extra = `${gapClass[gap]} ${paddingTop ? paddingTopClass[paddingTop] : ""}`;
  return (
    <Element
      className={`${stack({ direction, align, justify, wrap, grow, fillHeight, width })} ${extra}`}
      {...rest}
    >
      {children}
    </Element>
  );
}
