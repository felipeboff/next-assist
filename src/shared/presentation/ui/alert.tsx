import { CircleAlert, Info } from "lucide-react";
import type { ReactNode } from "react";
import { Icon } from "./icon";

const toneStyle = {
  danger: { className: "border-danger/25 bg-danger-soft text-danger", icon: CircleAlert },
  info: { className: "border-primary/20 bg-primary-soft text-primary", icon: Info },
} as const;

export type AlertProps = {
  tone?: keyof typeof toneStyle;
  children: ReactNode;
};

export function Alert({ tone = "danger", children }: AlertProps) {
  const style = toneStyle[tone];
  return (
    <div
      role={tone === "danger" ? "alert" : "status"}
      className={`flex items-start gap-2.5 rounded-md border px-3.5 py-3 text-xs ${style.className}`}
    >
      <span className="flex h-5 items-center">
        <Icon icon={style.icon} size="sm" />
      </span>
      <span className="text-text-secondary">{children}</span>
    </div>
  );
}
