"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export type NavLinkProps = { href: string; icon: ReactNode; children: ReactNode };

/** One item of `NavList`; marks itself when its route is the current one. */
export function NavLink({ href, icon, children }: NavLinkProps) {
  const current = usePathname() === href;
  return (
    <NextLink
      href={href}
      aria-current={current ? "page" : undefined}
      className={`flex h-9 items-center gap-2.5 rounded-md px-2.5 text-md transition-colors duration-150 ${
        current
          ? "bg-primary-soft font-medium text-primary"
          : "text-text-secondary hover:bg-surface-subtle hover:text-text"
      }`}
    >
      {icon}
      {children}
    </NextLink>
  );
}
