"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import { useId, useState, type ReactNode } from "react";
import { Icon } from "./icon";

export type DisclosureProps = {
  /** What the toggle shows; the chevron is added after it. */
  summary: ReactNode;
  children: ReactNode;
  /** `inline`: a compact toggle that keeps its content's width. `row`: a full-width list row. */
  variant?: "inline" | "row";
  /** Always shown between the toggle and the detail (a message whose explanation the toggle opens). */
  preview?: ReactNode;
  /** A tooltip saying what opens, when the summary does not. */
  hint?: string;
  /** Side of the inline toggle. */
  align?: "start" | "end";
  defaultOpen?: boolean;
};

/** Shows or hides more detail in place. */
export function Disclosure({
  summary,
  children,
  variant = "inline",
  preview,
  hint,
  align = "start",
  defaultOpen = false,
}: DisclosureProps) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();

  return (
    <div className={variant === "row" ? "w-full" : "flex min-w-0 flex-col"}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        title={hint}
        onClick={() => setOpen((current) => !current)}
        className={
          variant === "row"
            ? "flex w-full cursor-pointer items-center gap-3 py-3 text-left"
            : `group inline-flex max-w-full cursor-pointer items-center gap-1.5 rounded-xs text-left ${align === "end" ? "self-end" : "self-start"}`
        }
      >
        <span className="min-w-0 flex-1">{summary}</span>
        <span
          className={`flex shrink-0 text-text-muted transition-transform duration-150 ${
            open ? (variant === "row" ? "rotate-90" : "rotate-180") : ""
          }`}
        >
          <Icon icon={variant === "row" ? ChevronRight : ChevronDown} size="sm" />
        </span>
      </button>
      {preview}
      <div id={id} hidden={!open}>
        {open ? children : null}
      </div>
    </div>
  );
}
