export type TypingIndicatorProps = {
  label: string;
};

/** Someone is writing: three pulsing dots and who it is. */
export function TypingIndicator({ label }: TypingIndicatorProps) {
  return (
    <p role="status" className="inline-flex items-center gap-2.5 text-xs text-text-muted">
      <span
        aria-hidden
        className="inline-flex items-center gap-1 rounded-lg border border-line-soft bg-canvas px-3 py-2.5"
      >
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            className="size-1.5 animate-typing rounded-full bg-text-placeholder motion-reduce:animate-none"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </span>
      {label}
    </p>
  );
}
