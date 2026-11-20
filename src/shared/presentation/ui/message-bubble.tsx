import type { ReactNode } from "react";
import { tv } from "tailwind-variants/lite";

const bubble = tv({
  base: "whitespace-pre-line",
  variants: {
    from: { user: "", assistant: "" },
    align: { auto: "", start: "self-start", end: "self-end" },
    inverse: { true: "", false: "" },
    tone: {
      auto: "",
      ink: "bg-ink text-on-ink",
      canvas: "bg-canvas text-text shadow-field",
      primary: "bg-primary-muted text-text",
      success: "bg-success-muted text-text",
    },
    size: {
      sm: "rounded-md px-3.5 py-2 text-xs",
      md: "rounded-lg px-4 py-2.5 text-md",
    },
    measure: { auto: "", wide: "max-w-[75%]", md: "max-w-[32.5rem]" },
  },
  compoundVariants: [
    { from: "user", align: "auto", class: "self-end" },
    { from: "assistant", align: "auto", class: "self-start" },
    { size: "sm", measure: "auto", class: "max-w-[85%]" },
    { size: "md", measure: "auto", class: "max-w-[75%]" },
    { from: "user", inverse: false, tone: "auto", class: "bg-ink text-on-ink" },
    { from: "assistant", inverse: false, tone: "auto", class: "border border-line bg-canvas text-text" },
    { from: "user", inverse: true, tone: "auto", class: "bg-canvas text-text" },
    { from: "assistant", inverse: true, tone: "auto", class: "bg-ink-bubble text-on-ink" },
  ],
  defaultVariants: { inverse: false, tone: "auto", align: "auto", size: "sm", measure: "auto" },
});

export type MessageBubbleProps = {
  from: "user" | "assistant";
  inverse?: boolean;
  /** Colors by role in a thread; `auto` follows `from`. */
  tone?: "auto" | "ink" | "canvas" | "primary" | "success";
  /** Overrides the side `from` gives. */
  align?: "auto" | "start" | "end";
  size?: "sm" | "md";
  /** Longest line: `wide` is 75% of the thread, `md` about 520px; `auto` follows the size. */
  measure?: "auto" | "wide" | "md";
  /** Time and delivery marks, at the end of the text. */
  meta?: ReactNode;
  children: ReactNode;
};

export function MessageBubble({
  from,
  inverse,
  tone,
  align,
  size,
  measure,
  meta,
  children,
}: MessageBubbleProps) {
  return (
    <div className={bubble({ from, inverse, tone, align, size, measure })}>
      {children}
      {meta ? (
        <span className="float-right mt-1.5 ml-3 inline-flex translate-y-0.5 items-center gap-1 text-2xs text-text-muted">
          {meta}
        </span>
      ) : null}
    </div>
  );
}
