const sizeClass = { sm: "size-4 border-2", md: "size-5 border-2" } as const;

export type SpinnerProps = {
  size?: keyof typeof sizeClass;
  label?: string;
};

export function Spinner({ size = "sm", label }: SpinnerProps) {
  return (
    <span
      role={label ? "status" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={`${sizeClass[size]} inline-block shrink-0 animate-spin rounded-full border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]`}
    />
  );
}
