"use client";

import type { LucideIcon } from "lucide-react";
import { useId, type ChangeEventHandler, type ReactNode } from "react";
import { FieldIcon, FieldShell, describedBy, fieldInputClass } from "./field";

export type TextFieldProps = {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "search" | "url";
  icon?: LucideIcon;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel" | "search" | "url" | "numeric";
  defaultValue?: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  labelAction?: ReactNode;
  hint?: ReactNode;
  error?: string;
  required?: boolean;
  autoFocus?: boolean;
  disabled?: boolean;
};

export function TextField({
  name,
  label,
  type = "text",
  icon,
  labelAction,
  hint,
  error,
  ...input
}: TextFieldProps) {
  const id = useId();
  const inputId = `${id}-input`;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;

  return (
    <FieldShell
      inputId={inputId}
      label={label}
      labelAction={labelAction}
      hint={hint}
      hintId={hintId}
      error={error}
      errorId={errorId}
    >
      <div className="relative">
        {icon ? <FieldIcon icon={icon} /> : null}
        <input
          id={inputId}
          name={name}
          type={type}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy([
            [hintId, Boolean(hint)],
            [errorId, Boolean(error)],
          ])}
          className={`${fieldInputClass} ${icon ? "pl-10" : "pl-3.5"} pr-3.5`}
          {...input}
        />
      </div>
    </FieldShell>
  );
}
