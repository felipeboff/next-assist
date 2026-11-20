import { ChevronRight } from "lucide-react";
import { Fragment } from "react";
import { Icon } from "./icon";

export type BreadcrumbProps = {
  /** From the root to the current page, which is the last one. */
  items: readonly string[];
};

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Caminho">
      <ol className="flex items-center gap-2 text-sm">
        {items.map((item, index) => {
          const current = index === items.length - 1;
          return (
            <Fragment key={item}>
              {index > 0 ? (
                <li aria-hidden className="flex text-text-muted">
                  <Icon icon={ChevronRight} size="sm" />
                </li>
              ) : null}
              <li
                aria-current={current ? "page" : undefined}
                className={current ? "font-medium text-text" : "text-text-muted"}
              >
                {item}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
