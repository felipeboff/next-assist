"use client";

export type ChoiceChipsProps = {
  label: string;
  options: readonly string[];
  /** The option already chosen; the others are then disabled. */
  chosen: string | null;
  disabled?: boolean;
  onChoose: (option: string) => void;
};

/** Quick answers to a question: one choice, made once. */
export function ChoiceChips({ label, options, chosen, disabled = false, onChoose }: ChoiceChipsProps) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-1.5">
      {options.map((option) => {
        const isChosen = option === chosen;
        return (
          <button
            key={option}
            type="button"
            aria-pressed={isChosen}
            disabled={disabled || chosen !== null}
            onClick={() => onChoose(option)}
            className={`inline-flex h-8 items-center rounded-sm border px-3 text-sm transition-colors duration-150 enabled:cursor-pointer ${
              isChosen
                ? "border-primary-line bg-primary-soft text-primary"
                : "border-line bg-canvas text-text enabled:hover:bg-surface-subtle disabled:text-text-muted"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
