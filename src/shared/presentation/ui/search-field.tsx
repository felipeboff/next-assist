"use client";

import { Search } from "lucide-react";
import { useId, type KeyboardEventHandler } from "react";
import { Icon } from "./icon";

export type SearchFieldProps = {
  /** Read by assistive tech; the placeholder shows the same idea on screen. */
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
  autoFocus?: boolean;
  size?: "sm" | "md";
};

/** A rounded, filled search input with its magnifier. */
export function SearchField({
  label,
  placeholder,
  value,
  onChange,
  onKeyDown,
  autoFocus,
  size = "md",
}: SearchFieldProps) {
  const id = useId();
  return (
    <div className="relative w-full">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-text-muted">
        <Icon icon={Search} size="sm" />
      </span>
      <input
        id={id}
        type="search"
        value={value}
        placeholder={placeholder}
        autoFocus={autoFocus}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={onKeyDown}
        className={`w-full rounded-full bg-surface-subtle pr-4 pl-10 text-sm text-text transition-shadow duration-150 outline-none placeholder:text-text-muted focus:ring-2 focus:ring-primary/30 [&::-webkit-search-cancel-button]:hidden ${
          size === "sm" ? "h-8" : "h-9"
        }`}
      />
    </div>
  );
}
