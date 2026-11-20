"use client";

import { useId } from "react";
import { FieldShell, describedBy } from "./field";

export type TextAreaFieldProps = {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  error?: string;
  hint?: string;
  disabled?: boolean;
};

/** A labeled multi-line text field, with the same states as `TextField`. */
export function TextAreaField({
  name,
  label,
  value,
  onChange,
  rows = 3,
  error,
  hint,
  disabled,
}: TextAreaFieldProps) {
  const id = useId();
  const inputId = `${id}-input`;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  return (
    <FieldShell inputId={inputId} label={label} hint={hint} hintId={hintId} error={error} errorId={errorId}>
      <textarea
        id={inputId}
        name={name}
        rows={rows}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy([
          [hintId, Boolean(hint)],
          [errorId, Boolean(error)],
        ])}
        className="w-full min-w-0 resize-y rounded-md border border-line bg-canvas px-3.5 py-2.5 text-sm text-text shadow-field transition-[border-color,box-shadow] duration-150 ease-out-quart outline-none placeholder:text-text-placeholder focus:border-primary focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:bg-surface-subtle aria-invalid:border-danger aria-invalid:focus:ring-danger"
      />
    </FieldShell>
  );
}
