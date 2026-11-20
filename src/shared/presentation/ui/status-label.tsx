import type { ReactNode } from "react";
import { StatusDot } from "./status-dot";
import { textSizeClass, type StatusTone, type TextSize } from "./tokens";

const toneText: Record<StatusTone, string> = {
  success: "text-success-text",
  warning: "text-warning-text",
  danger: "text-danger",
  primary: "text-primary",
  muted: "text-text-muted",
};

export type StatusLabelProps = {
  tone: StatusTone;
  size?: TextSize;
  /** `colored` paints the text in the tone; `plain` keeps it in the body color. */
  text?: "colored" | "plain";
  children: ReactNode;
};

/** A status in words with its colored dot: "● Aguardando analista". */
export function StatusLabel({ tone, size = "xs", text = "colored", children }: StatusLabelProps) {
  return (
    <span
      className={`inline-flex min-w-0 items-center gap-1.5 ${textSizeClass[size]} ${text === "colored" ? toneText[tone] : "text-text"}`}
    >
      <StatusDot tone={tone} size="sm" />
      <span className="truncate">{children}</span>
    </span>
  );
}
