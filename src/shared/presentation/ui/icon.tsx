import type { LucideIcon } from "lucide-react";
import { textToneClass, type TextTone } from "./tokens";

export type { LucideIcon as IconGlyph } from "lucide-react";

const sizeClass = {
  xs: "size-3.5",
  sm: "size-4",
  md: "size-[1.125rem]",
  lg: "size-5",
} as const;

export type IconProps = {
  icon: LucideIcon;
  size?: keyof typeof sizeClass;
  tone?: TextTone;
  label?: string;
};

export function Icon({ icon: Glyph, size = "sm", tone = "inherit", label }: IconProps) {
  const className = `${sizeClass[size]} ${textToneClass[tone]} shrink-0`;
  if (label) {
    return <Glyph role="img" aria-label={label} className={className} strokeWidth={1.75} />;
  }
  return <Glyph aria-hidden focusable={false} className={className} strokeWidth={1.75} />;
}
