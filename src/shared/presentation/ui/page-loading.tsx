import { Spinner } from "./spinner";

export type PageLoadingProps = {
  label: string;
};

export function PageLoading({ label }: PageLoadingProps) {
  return (
    <div className="flex min-h-dvh items-center justify-center gap-3 text-text-muted">
      <Spinner size="md" />
      <p role="status" className="text-xs">
        {label}
      </p>
    </div>
  );
}
