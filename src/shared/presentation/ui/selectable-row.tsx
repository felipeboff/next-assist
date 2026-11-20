"use client";

import type { ReactNode } from "react";

export type SelectableRowProps = {
  selected: boolean;
  onSelect: () => void;
  children: ReactNode;
};

/** A list row that opens something; the open one stays highlighted. */
export function SelectableRow({ selected, onSelect, children }: SelectableRowProps) {
  return (
    <button
      type="button"
      aria-current={selected ? "true" : undefined}
      onClick={onSelect}
      className={`w-full cursor-pointer rounded-xl px-2 py-1 text-left transition-colors duration-150 ${
        selected ? "bg-surface-subtle" : "hover:bg-surface-subtle"
      }`}
    >
      {children}
    </button>
  );
}
