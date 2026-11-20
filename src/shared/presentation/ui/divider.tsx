const toneClass = {
  line: "border-line",
  "line-subtle": "border-line-subtle",
  ink: "border-ink-divider",
} as const;

export type DividerProps = {
  tone?: keyof typeof toneClass;
  orientation?: "horizontal" | "vertical";
};

export function Divider({ tone = "line-subtle", orientation = "horizontal" }: DividerProps) {
  if (orientation === "vertical") {
    return (
      <span
        role="separator"
        aria-orientation="vertical"
        className={`w-0 self-stretch border-l ${toneClass[tone]}`}
      />
    );
  }
  return <hr className={`w-full border-0 border-t ${toneClass[tone]}`} />;
}
