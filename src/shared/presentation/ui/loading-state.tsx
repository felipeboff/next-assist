import { Spinner } from "./spinner";

export type LoadingStateProps = {
  label: string;
};

/** A region that is loading: centered spinner and what is coming. */
export function LoadingState({ label }: LoadingStateProps) {
  return (
    <div className="flex flex-1 items-center justify-center gap-3 px-6 py-10 text-text-muted">
      <Spinner size="sm" />
      <p role="status" className="text-xs">
        {label}
      </p>
    </div>
  );
}
