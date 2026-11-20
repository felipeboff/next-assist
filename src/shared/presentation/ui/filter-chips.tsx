"use client";

export type FilterChip<T extends string> = { value: T; label: string; count?: number };

export type FilterChipsProps<T extends string> = {
  label: string;
  options: readonly FilterChip<T>[];
  value: T;
  onChange: (value: T) => void;
};

/** One of a few filters over a list, each with its count. */
export function FilterChips<T extends string>({ label, options, value, onChange }: FilterChipsProps<T>) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-1">
      {options.map((option) => {
        const pressed = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={pressed}
            onClick={() => onChange(option.value)}
            className={`inline-flex h-6.5 cursor-pointer items-center gap-1.5 rounded-full px-2 text-xs transition-colors duration-150 ${
              pressed
                ? "bg-primary-soft text-primary"
                : "bg-surface-subtle text-text-secondary hover:bg-line-subtle"
            }`}
          >
            {option.label}
            {option.count === undefined ? null : (
              <span className={`text-2xs tabular-nums ${pressed ? "text-primary" : "text-text-muted"}`}>
                {option.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
