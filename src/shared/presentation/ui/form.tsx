import type { FormEventHandler, ReactNode } from "react";
import { gapClass, type Space } from "./tokens";

export type FormProps = {
  onSubmit: FormEventHandler<HTMLFormElement>;
  busy?: boolean;
  gap?: Space;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  children: ReactNode;
};

export function Form({ onSubmit, busy = false, gap = "xl", children, ...aria }: FormProps) {
  return (
    <form
      noValidate
      onSubmit={onSubmit}
      aria-busy={busy || undefined}
      className={`flex flex-col ${gapClass[gap]}`}
      {...aria}
    >
      {children}
    </form>
  );
}
