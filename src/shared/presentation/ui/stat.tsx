import type { ReactNode } from "react";

export type StatProps = {
  value: ReactNode;
  label: string;
  indicator?: ReactNode;
};

export function Stat({ value, label, indicator }: StatProps) {
  return (
    <div className="flex flex-col-reverse gap-1.5 border-ink-divider pl-6 not-first:border-l first:pl-0">
      <dt className="text-xs text-on-ink-subtle">{label}</dt>
      <dd className="flex items-center gap-2.5 font-display text-display-sm tracking-normal text-on-ink">
        {value}
        {indicator}
      </dd>
    </div>
  );
}

export type StatGroupProps = {
  label: string;
  children: ReactNode;
};

export function StatGroup({ label, children }: StatGroupProps) {
  return (
    <dl aria-label={label} className="grid auto-cols-fr grid-flow-col border-t border-ink-divider pt-6">
      {children}
    </dl>
  );
}
