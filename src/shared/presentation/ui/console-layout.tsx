import type { ReactNode } from "react";

export type ConsoleLayoutProps = {
  /** The narrow icon rail on the far left. */
  rail: ReactNode;
  list: ReactNode;
  listLabel: string;
  /** The open item; fills the space between the list and the panel. */
  children: ReactNode;
  panel?: ReactNode;
  panelLabel?: string;
};

/** Work console: icon rail, list column, main area and an optional side panel, all full height. */
export function ConsoleLayout({ rail, list, listLabel, children, panel, panelLabel }: ConsoleLayoutProps) {
  return (
    <div className="flex h-dvh bg-canvas">
      <div className="flex w-16 shrink-0 flex-col items-center gap-3 border-r border-line-soft bg-surface-subtle pt-4 pb-5">
        {rail}
      </div>
      <section aria-label={listLabel} className="flex w-95 shrink-0 flex-col border-r border-surface-muted">
        {list}
      </section>
      <main className="flex min-w-0 flex-1 flex-col bg-surface-muted">{children}</main>
      {panel ? (
        <aside
          aria-label={panelLabel}
          className="flex w-85 shrink-0 flex-col border-l border-line-soft bg-canvas"
        >
          {panel}
        </aside>
      ) : null}
    </div>
  );
}
