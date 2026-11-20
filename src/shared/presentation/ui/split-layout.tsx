import type { ReactNode } from "react";

export type SplitLayoutProps = {
  aside: ReactNode;
  asideLabel: string;
  brand?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
};

export function SplitLayout({ aside, asideLabel, brand, header, footer, children }: SplitLayoutProps) {
  return (
    <div className="grid min-h-dvh grid-cols-1 lg:grid-cols-[1.25fr_1fr]">
      <aside aria-label={asideLabel} className="hidden min-h-dvh flex-col bg-ink px-16 pt-10 pb-12 lg:flex">
        {aside}
      </aside>
      <div className="flex min-h-dvh flex-col bg-canvas px-6 pt-8 pb-8 sm:px-14 sm:pt-10 sm:pb-10">
        {brand || header ? (
          <header className="flex flex-wrap items-center justify-between gap-4 lg:justify-end">
            {brand ? <div className="lg:hidden">{brand}</div> : null}
            {header}
          </header>
        ) : null}
        <main className="flex flex-1 items-center justify-center pt-4 pb-14">{children}</main>
        {footer ? <footer>{footer}</footer> : null}
      </div>
    </div>
  );
}
