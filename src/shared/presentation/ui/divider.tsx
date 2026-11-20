import { marginStartClass, type Space } from "./tokens";

const toneClass = {
  line: "border-line",
  "line-subtle": "border-line-subtle",
  ink: "border-ink-divider",
} as const;

export type DividerProps = {
  tone?: keyof typeof toneClass;
  orientation?: "horizontal" | "vertical";
  /** Starts a horizontal line after this space, to align it with a column of text. */
  insetStart?: Space;
};

export function Divider({ tone = "line-subtle", orientation = "horizontal", insetStart }: DividerProps) {
  if (orientation === "vertical") {
    return (
      <span
        role="separator"
        aria-orientation="vertical"
        className={`w-0 self-stretch border-l ${toneClass[tone]}`}
      />
    );
  }
  const inset = insetStart ? `${marginStartClass[insetStart]} w-auto` : "w-full";
  return <hr className={`${inset} border-0 border-t ${toneClass[tone]}`} />;
}
