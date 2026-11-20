import type { ReactNode } from "react";
import { tv } from "tailwind-variants/lite";
import {
  fontWeightClass,
  textSizeClass,
  textToneClass,
  type FontWeight,
  type TextSize,
  type TextTone,
} from "./tokens";

const text = tv({
  base: "",
  variants: {
    align: { start: "text-left", center: "text-center", end: "text-right" },
    measure: {
      none: "",
      sm: "max-w-[24rem]",
      md: "max-w-[31.5rem]",
      lg: "max-w-[40rem]",
    },
    truncate: { true: "truncate", false: "" },
    nowrap: { true: "whitespace-nowrap", false: "" },
    tabular: { true: "tabular-nums", false: "" },
  },
  defaultVariants: { align: "start", measure: "none", truncate: false, nowrap: false, tabular: false },
});

export type TextProps = {
  as?: "p" | "span" | "strong" | "small" | "time";
  id?: string;
  size?: TextSize;
  tone?: TextTone;
  weight?: FontWeight;
  align?: "start" | "center" | "end";
  measure?: "none" | "sm" | "md" | "lg";
  truncate?: boolean;
  nowrap?: boolean;
  tabular?: boolean;
  role?: "status" | "alert";
  "aria-live"?: "polite" | "assertive";
  children: ReactNode;
};

export function Text({
  as: Element = "p",
  size = "md",
  tone = "default",
  weight = "regular",
  align,
  measure,
  truncate,
  nowrap,
  tabular,
  children,
  ...rest
}: TextProps) {
  const className = [
    textSizeClass[size],
    textToneClass[tone],
    fontWeightClass[weight],
    text({ align, measure, truncate, nowrap, tabular }),
  ].join(" ");

  return (
    <Element className={className} {...rest}>
      {children}
    </Element>
  );
}
