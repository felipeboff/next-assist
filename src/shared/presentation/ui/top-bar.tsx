import type { ReactNode } from "react";

export type TopBarProps = {
  start: ReactNode;
  end?: ReactNode;
};

/** The bar on top of a page in the sidebar layout: where you are, and the page's status. */
export function TopBar({ start, end }: TopBarProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-line-soft px-8">
      {start}
      {end ? <div className="flex items-center gap-3">{end}</div> : null}
    </header>
  );
}
