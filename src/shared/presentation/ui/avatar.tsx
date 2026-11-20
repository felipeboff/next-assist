const toneClass = {
  blue: "bg-avatar-blue text-avatar-blue-text",
  orange: "bg-avatar-orange text-avatar-orange-text",
  violet: "bg-avatar-violet text-avatar-violet-text",
  green: "bg-avatar-green text-avatar-green-text",
  rose: "bg-avatar-rose text-avatar-rose-text",
  slate: "bg-avatar-slate text-avatar-slate-text",
  amber: "bg-avatar-amber text-avatar-amber-text",
} as const;

export type AvatarTone = keyof typeof toneClass;
const tones = Object.keys(toneClass) as AvatarTone[];

const sizeClass = {
  sm: "size-8 text-2xs",
  md: "size-10 text-sm",
  lg: "size-11 text-md",
} as const;

/** "Ana Souza" -> "AS"; one name gives one letter. */
export function initialsOf(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const first = words.at(0)?.[0] ?? "";
  const last = words.length > 1 ? words[words.length - 1].charAt(0) : "";
  return `${first}${last}`.toUpperCase();
}

/** The same name always gets the same tone. */
export function avatarToneOf(name: string): AvatarTone {
  const sum = [...name].reduce((total, char) => total + char.charCodeAt(0), 0);
  return tones[sum % tones.length];
}

export type AvatarProps = {
  name: string;
  size?: keyof typeof sizeClass;
  tone?: AvatarTone;
  /** Shows the green presence dot when online. */
  online?: boolean;
  /** Read the name out; leave it off when the name is written next to the avatar. */
  labelled?: boolean;
};

export function Avatar({ name, size = "md", tone, online = false, labelled = false }: AvatarProps) {
  return (
    <span
      role={labelled ? "img" : undefined}
      aria-label={labelled ? name : undefined}
      aria-hidden={labelled ? undefined : true}
      className={`relative inline-flex shrink-0 items-center justify-center rounded-full font-semibold ${sizeClass[size]} ${toneClass[tone ?? avatarToneOf(name)]}`}
    >
      {initialsOf(name)}
      {online ? (
        <span className="absolute -right-0.5 -bottom-0.5 size-3 rounded-full border-2 border-canvas bg-success" />
      ) : null}
    </span>
  );
}
