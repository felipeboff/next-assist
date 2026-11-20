import { Check } from "lucide-react";
import type { ChangeEventHandler, ReactNode } from "react";

export type CheckboxProps = {
  name: string;
  label: ReactNode;
  id?: string;
  defaultChecked?: boolean;
  checked?: boolean;
  disabled?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
};

export function Checkbox({ name, label, id, ...input }: CheckboxProps) {
  const inputId = id ?? `checkbox-${name}`;
  return (
    <label
      htmlFor={inputId}
      className="group inline-flex cursor-pointer items-center gap-2 text-xs text-text-secondary has-disabled:cursor-not-allowed has-disabled:opacity-60"
    >
      <span className="relative inline-flex size-[1.125rem] shrink-0">
        <input
          id={inputId}
          name={name}
          type="checkbox"
          className="peer size-full cursor-pointer appearance-none rounded-xs border border-line bg-canvas shadow-field transition-colors duration-150 checked:border-primary checked:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed"
          {...input}
        />
        <Check
          aria-hidden
          strokeWidth={3}
          className="pointer-events-none absolute inset-0 m-auto size-3 text-on-ink opacity-0 transition-opacity duration-150 peer-checked:opacity-100"
        />
      </span>
      {label}
    </label>
  );
}
