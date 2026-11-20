import type { ReactNode } from "react";

const toneClass = {
  "on-primary": "bg-on-ink/20 text-on-ink",
  default: "border border-line bg-surface-subtle text-text-muted",
} as const;

export type KbdProps = {
  tone?: keyof typeof toneClass;
  /** How the shortcut is read out, when the glyphs say it poorly ("Ctrl+Enter"). */
  label?: string;
  children: ReactNode;
};

/** A keyboard shortcut shown inside or beside a control. */
export function Kbd({ tone = "default", label, children }: KbdProps) {
  return (
    <kbd
      aria-label={label}
      className={`inline-flex h-4.5 items-center rounded-xs px-1.5 font-sans text-[0.6875rem] font-medium ${toneClass[tone]}`}
    >
      {children}
    </kbd>
  );
}
