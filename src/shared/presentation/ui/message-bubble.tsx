import type { ReactNode } from "react";
import { tv } from "tailwind-variants/lite";

const bubble = tv({
  base: "max-w-[85%] rounded-md px-3.5 py-2 text-xs whitespace-pre-line",
  variants: {
    from: {
      user: "self-end",
      assistant: "self-start",
    },
    inverse: { true: "", false: "" },
  },
  compoundVariants: [
    { from: "user", inverse: false, class: "bg-ink text-on-ink" },
    { from: "assistant", inverse: false, class: "border border-line bg-canvas text-text" },
    { from: "user", inverse: true, class: "bg-canvas text-text" },
    { from: "assistant", inverse: true, class: "bg-ink-bubble text-on-ink" },
  ],
  defaultVariants: { inverse: false },
});

export type MessageBubbleProps = {
  from: "user" | "assistant";
  inverse?: boolean;
  children: ReactNode;
};

export function MessageBubble({ from, inverse, children }: MessageBubbleProps) {
  return <div className={bubble({ from, inverse })}>{children}</div>;
}
