import type { ReactNode } from "react";

export type SidebarLayoutProps = {
  brand: ReactNode;
  nav: ReactNode;
  /** Bottom of the sidebar: who is signed in, and sign out. */
  footer?: ReactNode;
  children: ReactNode;
};

/** App shell with a fixed left sidebar; the page fills the rest of the screen and scrolls itself. */
export function SidebarLayout({ brand, nav, footer, children }: SidebarLayoutProps) {
  return (
    <div className="flex h-dvh bg-canvas">
      <aside className="flex w-58 shrink-0 flex-col border-r border-line-soft px-3.5 pt-5 pb-4">
        <div className="px-2.5 pb-6">{brand}</div>
        <div className="flex-1">{nav}</div>
        {footer ? <div className="border-t border-line-soft px-1 pt-3.5">{footer}</div> : null}
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
