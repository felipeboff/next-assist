"use client";

import { useId, type ReactNode } from "react";

export type RadioListItem = { value: string; content: ReactNode };

export type RadioListProps = {
  label: string;
  items: readonly RadioListItem[];
  value: string | null;
  disabled?: boolean;
  onChange: (value: string) => void;
};

/** A card of rows to pick one from, each row a radio with free content. */
export function RadioList({ label, items, value, disabled = false, onChange }: RadioListProps) {
  const name = useId();
  return (
    <fieldset className="min-w-0">
      <legend className="sr-only">{label}</legend>
      <div className="divide-y divide-line-soft overflow-hidden rounded-xl border border-line-soft bg-canvas shadow-card">
        {items.map((item) => (
          <label
            key={item.value}
            className="flex cursor-pointer items-center gap-3.5 px-4 py-3 transition-colors duration-150 hover:bg-surface-subtle has-checked:bg-primary-wash has-disabled:cursor-default has-disabled:hover:bg-transparent has-disabled:has-checked:bg-primary-wash"
          >
            <input
              type="radio"
              name={name}
              value={item.value}
              checked={item.value === value}
              disabled={disabled}
              onChange={() => onChange(item.value)}
              className="size-4 shrink-0 cursor-pointer appearance-none rounded-full border border-line bg-canvas transition-[border] duration-150 checked:border-[5px] checked:border-primary disabled:cursor-default"
            />
            <span className="min-w-0 flex-1">{item.content}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
