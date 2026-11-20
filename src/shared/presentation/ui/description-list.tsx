import type { ReactNode } from "react";

export type DescriptionItem = { label: string; value: ReactNode; aside?: ReactNode };

const columnsClass = { 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-4" } as const;

export type DescriptionListProps = {
  items: readonly DescriptionItem[];
  /** `columns`: label over value, side by side (ticket cards). `rows`: label beside value, one per row (profile). */
  layout?: "columns" | "rows";
  columns?: keyof typeof columnsClass;
};

export function DescriptionList({ items, layout = "columns", columns = 3 }: DescriptionListProps) {
  if (layout === "rows") {
    return (
      <dl className="divide-y divide-line-soft">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-4 px-6 py-4">
            <dt className="w-38 shrink-0 text-sm text-text-muted">{item.label}</dt>
            <dd className="min-w-0 flex-1 text-md text-text">{item.value}</dd>
            {item.aside ? <dd className="shrink-0 text-xs text-text-muted">{item.aside}</dd> : null}
          </div>
        ))}
      </dl>
    );
  }
  return (
    <dl className={`grid gap-x-6 gap-y-3 ${columnsClass[columns]}`}>
      {items.map((item) => (
        <div key={item.label} className="flex min-w-0 flex-col gap-1">
          <dt className="text-xs text-text-muted">{item.label}</dt>
          <dd className="text-md text-text">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
