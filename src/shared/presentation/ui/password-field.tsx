"use client";

import { Eye, EyeOff, type LucideIcon } from "lucide-react";
import { useId, useState, type ReactNode } from "react";
import { FieldIcon, FieldShell, describedBy, fieldInputClass } from "./field";
import { Icon } from "./icon";

export type PasswordFieldProps = {
  name: string;
  label: string;
  icon?: LucideIcon;
  placeholder?: string;
  autoComplete?: "current-password" | "new-password";
  labelAction?: ReactNode;
  hint?: ReactNode;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  showLabel?: string;
  hideLabel?: string;
};

export function PasswordField({
  name,
  label,
  icon,
  labelAction,
  hint,
  error,
  showLabel = "Mostrar senha",
  hideLabel = "Ocultar senha",
  autoComplete = "current-password",
  ...input
}: PasswordFieldProps) {
  const id = useId();
  const inputId = `${id}-input`;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const [visible, setVisible] = useState(false);

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
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy([
            [hintId, Boolean(hint)],
            [errorId, Boolean(error)],
          ])}
          className={`${fieldInputClass} ${icon ? "pl-10" : "pl-3.5"} pr-11`}
          {...input}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? hideLabel : showLabel}
          aria-pressed={visible}
          aria-controls={inputId}
          disabled={input.disabled}
          className="absolute inset-y-0 right-1.5 my-auto flex size-8 cursor-pointer items-center justify-center rounded-sm text-text-muted transition-colors duration-150 hover:bg-surface-subtle hover:text-text disabled:cursor-not-allowed"
        >
          <Icon icon={visible ? EyeOff : Eye} size="sm" />
        </button>
      </div>
    </FieldShell>
  );
}
