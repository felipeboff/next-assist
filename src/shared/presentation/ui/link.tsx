import NextLink from "next/link";
import type { ReactNode } from "react";
import { tv } from "tailwind-variants/lite";
import { fontWeightClass, textSizeClass, type FontWeight, type TextSize } from "./tokens";

const link = tv({
  base: "rounded-xs underline-offset-2 transition-colors duration-150 hover:underline",
  variants: {
    tone: {
      primary: "text-primary hover:text-primary-hover",
      muted: "text-text-muted hover:text-text",
      "on-ink-muted": "text-on-ink-muted hover:text-on-ink",
    },
  },
  defaultVariants: { tone: "primary" },
});

export type LinkProps = {
  href: string;
  tone?: "primary" | "muted" | "on-ink-muted";
  size?: TextSize;
  weight?: FontWeight;
  external?: boolean;
  children: ReactNode;
};

export function Link({ href, tone, size = "xs", weight = "regular", external = false, children }: LinkProps) {
  const className = `${link({ tone })} ${textSizeClass[size]} ${fontWeightClass[weight]}`;
  const isAppRoute = href.startsWith("/") && !external;

  if (isAppRoute) {
    return (
      <NextLink href={href} className={className}>
        {children}
      </NextLink>
    );
  }

  return (
    <a
      href={href}
      className={className}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}
