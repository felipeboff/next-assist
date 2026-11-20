import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Icon } from "./icon";

export const fieldInputClass =
  "h-11 w-full min-w-0 rounded-md border border-line bg-canvas text-sm text-text shadow-field outline-none transition-[border-color,box-shadow] duration-150 ease-out-quart placeholder:text-text-placeholder focus:border-primary focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:bg-surface-subtle disabled:text-text-muted aria-invalid:border-danger aria-invalid:focus:ring-danger";

export type FieldShellProps = {
  inputId: string;
  label: string;
  labelAction?: ReactNode;
  hint?: ReactNode;
  hintId: string;
  error?: string;
  errorId: string;
  children: ReactNode;
};

export function FieldShell({
  inputId,
  label,
  labelAction,
  hint,
  hintId,
  error,
  errorId,
  children,
}: FieldShellProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={inputId} className="text-xs font-medium text-text">
          {label}
        </label>
        {labelAction}
      </div>
      {children}
      {hint ? (
        <p id={hintId} className="text-xs text-text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-xs text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function FieldIcon({ icon }: { icon: LucideIcon }) {
  return (
    <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-text-muted">
      <Icon icon={icon} size="sm" />
    </span>
  );
}

export function describedBy(ids: Array<[string, boolean]>): string | undefined {
  const value = ids
    .filter(([, present]) => present)
    .map(([id]) => id)
    .join(" ");
  return value || undefined;
}
