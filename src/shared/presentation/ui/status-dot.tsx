import type { StatusTone } from "./tokens";

const toneClass: Record<StatusTone, string> = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  primary: "bg-primary",
  muted: "bg-text-placeholder",
};

const sizeClass = { sm: "size-1.5", md: "size-2" } as const;

export type StatusDotProps = {
  tone: StatusTone;
  size?: keyof typeof sizeClass;
  label?: string;
};

export function StatusDot({ tone, size = "md", label }: StatusDotProps) {
  return (
    <span
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={`inline-block shrink-0 rounded-full ${sizeClass[size]} ${toneClass[tone]}`}
    />
  );
}
