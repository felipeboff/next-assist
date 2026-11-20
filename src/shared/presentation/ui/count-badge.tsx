export type CountBadgeProps = {
  count: number;
  /** What is counted, read after the number: "mensagens não lidas". */
  label: string;
};

/** A small primary bubble with a number; nothing at zero. */
export function CountBadge({ count, label }: CountBadgeProps) {
  if (count <= 0) {
    return null;
  }
  return (
    <span
      role="img"
      aria-label={`${count} ${label}`}
      className="inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary px-1.5 text-2xs font-semibold text-on-ink tabular-nums"
    >
      {count}
    </span>
  );
}
