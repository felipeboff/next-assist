"use client";

import type { LucideIcon } from "lucide-react";
import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { tv } from "tailwind-variants/lite";
import { Icon } from "./icon";

export type MenuItem = {
  label: string;
  onSelect: () => void;
  icon?: LucideIcon;
  tone?: "default" | "danger";
  disabled?: boolean;
};

const popover = tv({
  base: "absolute z-20 min-w-56 rounded-lg border border-line-soft bg-canvas p-1.5 shadow-popover",
  variants: {
    placement: {
      "bottom-end": "top-full right-0 mt-1.5",
      "right-end": "bottom-0 left-full ml-2",
    },
  },
});

export type MenuProps = {
  /** Names the trigger. */
  label: string;
  /** An icon trigger... */
  icon?: LucideIcon;
  /** ...or custom content inside the trigger (an avatar). */
  trigger?: ReactNode;
  /** Non-interactive content on top of the items: who is signed in. */
  header?: ReactNode;
  items: readonly MenuItem[];
  placement?: "bottom-end" | "right-end";
};

/** A button that opens a short list of actions. Escape or a click outside closes it. */
export function Menu({ label, icon, trigger, header, items, placement = "bottom-end" }: MenuProps) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemsRef = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    if (!open) {
      return;
    }
    itemsRef.current.find((item) => item && !item.disabled)?.focus();
    function closeOnOutside(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", closeOnOutside);
    return () => document.removeEventListener("mousedown", closeOnOutside);
  }, [open]);

  function close() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const enabled = itemsRef.current.filter((item): item is HTMLButtonElement =>
      Boolean(item && !item.disabled),
    );
    const index = enabled.indexOf(document.activeElement as HTMLButtonElement);
    if (event.key === "Escape") {
      event.preventDefault();
      close();
    } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const step = event.key === "ArrowDown" ? 1 : -1;
      enabled.at((index + step) % enabled.length)?.focus();
    }
  }

  return (
    <div ref={rootRef} className="relative" onKeyDown={open ? handleKeyDown : undefined}>
      <button
        ref={triggerRef}
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((current) => !current)}
        className={`inline-flex cursor-pointer items-center justify-center transition-colors duration-150 ${
          icon
            ? "size-9 rounded-md text-text-secondary hover:bg-surface-subtle hover:text-text"
            : "rounded-full"
        }`}
      >
        {icon ? <Icon icon={icon} size="md" /> : trigger}
      </button>
      {open ? (
        <div id={menuId} role="menu" aria-label={label} className={popover({ placement })}>
          {header ? (
            <div className="mb-1 border-b border-line-soft px-2.5 pt-1.5 pb-2.5">{header}</div>
          ) : null}
          {items.map((item, index) => (
            <button
              key={item.label}
              ref={(element) => {
                itemsRef.current[index] = element;
              }}
              type="button"
              role="menuitem"
              disabled={item.disabled}
              onClick={() => {
                close();
                item.onSelect();
              }}
              className={`flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm transition-colors duration-150 hover:bg-surface-subtle focus:bg-surface-subtle focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
                item.tone === "danger" ? "text-danger" : "text-text"
              }`}
            >
              {item.icon ? <Icon icon={item.icon} size="sm" /> : null}
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
