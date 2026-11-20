import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Icon } from "./icon";

export type EventDividerProps = {
  /** `line`: an event across the thread. `pill`: a date marker. */
  variant?: "line" | "pill";
  icon?: LucideIcon;
  children: ReactNode;
};

/** Something that happened in a conversation, between its messages. */
export function EventDivider({ variant = "line", icon, children }: EventDividerProps) {
  if (variant === "pill") {
    return (
      <p className="flex justify-center">
        <span className="rounded-md bg-canvas px-2 py-0.5 text-2xs text-text-secondary shadow-field">
          {children}
        </span>
      </p>
    );
  }
  return (
    <p className="flex items-center gap-3 text-xs text-text-muted">
      <span aria-hidden className="h-px flex-1 bg-line" />
      <span className="inline-flex items-center gap-1.5">
        {icon ? <Icon icon={icon} size="sm" /> : null}
        {children}
      </span>
      <span aria-hidden className="h-px flex-1 bg-line" />
    </p>
  );
}
