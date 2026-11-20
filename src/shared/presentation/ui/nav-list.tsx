import type { LucideIcon } from "lucide-react";
import { Icon } from "./icon";
import { NavLink } from "./nav-link";

export type NavItem = { href: string; label: string; icon: LucideIcon };

export type NavListProps = {
  label: string;
  items: readonly NavItem[];
};

/** The app's main navigation; the item of the current route is marked. Server-safe. */
export function NavList({ label, items }: NavListProps) {
  return (
    <nav aria-label={label}>
      <ul className="flex flex-col gap-1">
        {items.map((item) => (
          <li key={item.href}>
            <NavLink href={item.href} icon={<Icon icon={item.icon} size="md" />}>
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
