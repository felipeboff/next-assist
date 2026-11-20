import type { ReactNode } from "react";
import { StatusDot } from "./status-dot";
import type { StatusTone } from "./tokens";

const surfaceClass = {
  canvas: "bg-canvas text-text",
  soft: "bg-primary-soft text-primary",
  subtle: "bg-surface-subtle text-text",
} as const;

export type TagProps = {
  surface?: keyof typeof surfaceClass;
  dot?: StatusTone;
  children: ReactNode;
};

export function Tag({ surface = "canvas", dot, children }: TagProps) {
  return (
    <span
      className={`inline-flex max-w-full items-center gap-2 rounded-full px-2.5 py-1 text-2xs ${surfaceClass[surface]}`}
    >
      {dot ? <StatusDot tone={dot} size="sm" /> : null}
      <span className="inline-flex min-w-0 items-baseline gap-2 truncate">{children}</span>
    </span>
  );
}
