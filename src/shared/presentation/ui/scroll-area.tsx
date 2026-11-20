"use client";

import { useEffect, useRef, type ReactNode } from "react";

export type ScrollAreaProps = {
  children: ReactNode;
  /** Any value that changes when content is added at the end: the area then scrolls to the bottom. */
  followEnd?: unknown;
  label?: string;
};

/** The part of a full-height screen that scrolls (a thread, a list). */
export function ScrollArea({ children, followEnd, label }: ScrollAreaProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (element && followEnd !== undefined) {
      element.scrollTop = element.scrollHeight;
    }
  }, [followEnd]);

  return (
    <div
      ref={ref}
      role={label ? "region" : undefined}
      aria-label={label}
      className="min-h-0 flex-1 overflow-y-auto"
    >
      {children}
    </div>
  );
}
