import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Icon } from "./icon";

export type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  description?: ReactNode;
  /** Suggestions or a way forward. */
  children?: ReactNode;
};

/** Nothing to show here yet, and what to do about it. */
export function EmptyState({ icon, title, description, children }: EmptyStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-10 text-center">
      {icon ? (
        <span className="flex size-11 items-center justify-center rounded-full bg-surface-subtle text-text-muted">
          <Icon icon={icon} size="lg" />
        </span>
      ) : null}
      <div className="flex flex-col gap-1">
        <p className="text-md font-medium text-text">{title}</p>
        {description ? <p className="text-sm text-text-muted">{description}</p> : null}
      </div>
      {children}
    </div>
  );
}
