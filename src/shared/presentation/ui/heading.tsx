import type { ReactNode } from "react";
import { tv } from "tailwind-variants/lite";
import { textToneClass, type TextTone } from "./tokens";

const heading = tv({
  base: "text-pretty",
  variants: {
    size: {
      "display-lg": "font-display text-display-lg font-normal tracking-normal",
      "display-md": "font-display text-display-md font-normal tracking-normal",
      "display-sm": "font-display text-display-sm font-normal tracking-normal",
      page: "font-sans text-3xl font-semibold tracking-tight",
      section: "font-sans text-2xl font-semibold tracking-tight",
      title: "font-sans text-lg font-semibold",
      subtitle: "font-sans text-md font-semibold",
    },
    measure: { none: "", md: "max-w-[31.5rem]", lg: "max-w-[42rem]" },
  },
  defaultVariants: { size: "display-md", measure: "none" },
});

export type HeadingProps = {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  id?: string;
  size?: "display-lg" | "display-md" | "display-sm" | "page" | "section" | "title" | "subtitle";
  tone?: Extract<TextTone, "default" | "on-ink" | "muted">;
  measure?: "none" | "md" | "lg";
  children: ReactNode;
};

export function Heading({ level, size, tone = "default", measure, children, id }: HeadingProps) {
  const Element = `h${level}` as const;
  return (
    <Element id={id} className={`${heading({ size, measure })} ${textToneClass[tone]}`}>
      {children}
    </Element>
  );
}
