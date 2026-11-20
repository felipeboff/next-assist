"use client";

import { ArrowUp, SendHorizontal } from "lucide-react";
import { useId, type FormEvent, type ReactNode, type RefObject } from "react";
import { Button } from "./button";
import { IconButton } from "./icon-button";

export type ComposerProps = {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  submitLabel: string;
  /** `inline`: bordered box with the labeled button inside (chat). `round`: filled field and a round button (console). */
  variant?: "inline" | "round";
  disabled?: boolean;
  /** Shown instead of the placeholder while disabled. */
  disabledPlaceholder?: string;
  /** Keeps typing allowed while the send button waits (an answer is on its way). */
  submitBlocked?: boolean;
  footnote?: ReactNode;
  inputRef?: RefObject<HTMLInputElement | null>;
};

/** Where a message is written and sent. Enter sends; a blank message cannot be sent. */
export function Composer({
  label,
  placeholder,
  value,
  onChange,
  onSubmit,
  submitLabel,
  variant = "inline",
  disabled = false,
  disabledPlaceholder,
  submitBlocked = false,
  footnote,
  inputRef,
}: ComposerProps) {
  const id = useId();
  const canSubmit = !disabled && !submitBlocked && value.trim().length > 0;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (canSubmit) {
      onSubmit();
    }
  }

  const input = (
    <>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        ref={inputRef}
        value={value}
        disabled={disabled}
        autoComplete="off"
        placeholder={disabled && disabledPlaceholder ? disabledPlaceholder : placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={
          variant === "inline"
            ? "h-9 min-w-0 flex-1 bg-transparent text-md text-text outline-none placeholder:text-text-placeholder disabled:cursor-not-allowed"
            : "h-11 min-w-0 flex-1 rounded-lg bg-surface-subtle px-4 text-md text-text outline-none placeholder:text-text-placeholder focus:ring-1 focus:ring-line disabled:cursor-not-allowed"
        }
      />
    </>
  );

  return (
    <div className="flex flex-col gap-1.5">
      {variant === "inline" ? (
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 rounded-lg border border-line bg-canvas py-1.5 pr-1.5 pl-4 shadow-field transition-[border-color,box-shadow] duration-150 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary has-[input:disabled]:bg-surface-subtle"
        >
          {input}
          <Button type="submit" size="md" iconStart={ArrowUp} disabled={!canSubmit}>
            {submitLabel}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          {input}
          {disabled ? null : (
            <IconButton
              type="submit"
              icon={SendHorizontal}
              label={submitLabel}
              variant="primary"
              size="lg"
              shape="round"
              disabled={!canSubmit}
            />
          )}
        </form>
      )}
      {footnote ? <p className="text-right text-2xs text-text-muted">{footnote}</p> : null}
    </div>
  );
}
