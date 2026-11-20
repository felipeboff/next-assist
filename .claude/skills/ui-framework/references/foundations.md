# Foundations

The shared vocabulary of every component. All tokens live in `src/app/globals.css` (`@theme`)
and were measured from the Pencil prototype (PRD Annex C, `design/*.png`). The default Tailwind
palette and type scale are removed (`--color-*: initial`, `--text-*: initial`), so a class that
is not a token does not exist.

## Theme

Light only for now. Tokens are Tailwind 4 theme variables, so each one is a utility inside the
framework (`bg-ink`, `text-text-muted`, `border-line`) and a CSS variable (`var(--color-ink)`).
Screens never use them directly: they pick component props that map to them.

## Colors

| Token | Value | Use |
| --- | --- | --- |
| `canvas` | `#ffffff` | Page and field background (the prototype uses pure white) |
| `surface-subtle` | `#f6f7f9` | Hover fills, disabled fields, card footers, the console rail |
| `surface-muted` | `#eef1f5` | Background of the console thread (white bubbles and cards sit on it) |
| `ink` | `#1b2431` | Dark brand surface (login aside); also the default text color |
| `ink-raised` | `#242d39` | Card on the ink surface |
| `ink-bubble` | `#353d49` | Assistant bubble on the ink surface |
| `ink-line` / `ink-divider` | `#2d3541` / `#283040` | Borders and dividers on the ink surface |
| `text` / `text-secondary` / `text-muted` / `text-placeholder` | `#1b2431` / `#3d4656` / `#5b6472` / `#8a919c` | Text on light surfaces |
| `on-ink` / `on-ink-soft` / `on-ink-muted` / `on-ink-subtle` / `on-ink-faint` | `#fff` / `#d3d5d7` / `#afb3b7` / `#989ca2` / `#878c92` | Text on the ink surface, strongest to faintest |
| `line` / `line-subtle` / `line-soft` | `#e3e6e9` / `#eceef1` / `#f2f3f5` | Field borders / dividers / card borders and row dividers on white |
| `brand` | `#037af6` | The logo mark only |
| `primary` (+ `-hover` `#0057ae`, `-active` `#004c99`) | `#0062c4` | Actions, links, focus, checked controls |
| `primary-soft` / `primary-wash` / `primary-muted` / `primary-tint` | `#edf6fe` / `#f5f9fd` / `#e6effa` / `#dde9f5` | Current nav item and pressed chips / checked radio row / the agent's bubble in the console / "IA" tag |
| `primary-line` | `#77bdfa` | Border of a chosen chip |
| `success` / `success-text` | `#00bd6c` / `#00804a` | Online / ok dots / text |
| `success-soft` / `success-muted` / `success-tint` | `#ebfaf3` / `#e3f4ea` / `#dbedea` | Online tag / the analyst's bubble in the console / team tag |
| `warning` / `warning-text` | `#f5a500` / `#946300` | Pending / attention dots / text |
| `warning-soft` | `#fef7e7` | Waiting tag, waiting notice |
| `danger` / `danger-soft` | `#c4161d` / `#fef1f1` | Errors and destructive actions (`danger` and `danger-soft` buttons), measured from the prototype |
| `avatar-<tone>` / `avatar-<tone>-text` | blue `#dce9f7`/`#0062c4`, orange `#f6e3d3`/`#9a4a12`, violet `#e6e1f7`/`#5b3fc4`, green `#ddf0e6`/`#0a7f4b`, rose `#f7e1e6`/`#a3324f`, slate `#e5e8ec`/`#3d4656`, amber `#fbefd0`/`#8a6100` | `Avatar` fill and initials, one pair per tone |

Components take tone names (`muted`, `on-ink-subtle`, `warning`...), never hex values.

## Typography

- **Display**: Newsreader (variable, `opsz` axis), via `next/font` as `--font-newsreader` →
  `font-display`. Titles and big numbers. Tracking normal.
- **Body**: Schibsted Grotesk (variable), `--font-schibsted-grotesk` → `font-sans`. Everything
  else. The body has `letter-spacing: -0.01em`, which is what makes the widths match the
  prototype.

| Token | Size / line height | Use |
| --- | --- | --- |
| `2xs` | 12.5px / 18px | Footer, tag content |
| `xs` | 13.5px / 20px | Labels, captions, bubbles, links in running UI |
| `sm` | 14.5px / 22px | Field values, medium buttons |
| `md` | 15.5px / 24px | Lead text under a title, large buttons |
| `lg` | 16px / 25px | Intro paragraphs |
| `xl` | 17px / 24px | Reserved |
| `2xl` | 20px / 28px | Console column titles (`Heading size="section"`) |
| `3xl` | 24px / 32px | App page titles (`Heading size="page"`) |
| `display-sm` | 32px / 36px | Stat values |
| `display-md` | 36px / 40px | Page titles ("Entrar") |
| `display-lg` | 48px / 56px | Hero titles |

The prototype uses half-pixel sizes on purpose; keep them.

## Spacing

Props named `gap`, `padding`, `paddingX`, `paddingY`, `paddingTop` take `Space`:
`none` 0 · `xs` 4 · `sm` 8 · `md` 12 · `lg` 16 · `xl` 20 · `2xl` 24 · `3xl` 32 · `4xl` 40 ·
`5xl` 48 · `6xl` 56 · `7xl` 64 (px). Maps live in `src/shared/presentation/ui/tokens.ts`.

## Radius and elevation

Radius: `xs` 4 (checkbox, link focus) · `sm` 6 (buttons) · `md` 8 (fields, bubbles) · `lg` 12 ·
`xl` 16 (cards) · `full` (tags, dots).

Shadows: `shadow-field` (fields, secondary buttons, checkbox, white bubbles), `shadow-primary`
(the primary button's blue glow), `shadow-card` (cards on white, the current rail tile) and
`shadow-popover` (menus, dialogs).

## Breakpoints

Tailwind defaults. `lg` (1024px) is where split layouts show their aside; below it the main
column takes the screen.

## Motion

Color and shadow transitions of 150ms with `ease-out-quart`. Spinners keep spinning under
`prefers-reduced-motion`, slower. `animate-typing` (`typing` keyframes, 1.2s, infinite) pulses
the dots of `TypingIndicator`, which stops it under `prefers-reduced-motion`. No layout
animation.

## Focus

A global `:focus-visible` outline (2px `primary`, offset 2px). Fields replace it with a primary
border plus a 1px ring.

## Icons

Lucide (`lucide-react`). Screens import the glyph they need and pass it as a prop
(`icon={Mail}`, `iconEnd={ArrowRight}`); the framework sizes and colors it (`Icon`). Stroke width
1.75.

## Brand

The logo is drawn by `Brand` from the official paths (sources in `design/brand/`). The exported
`Logo.svg` and `Nexo Mark.svg` (and the prototype itself) clip about 2px of the mark's right stem
and carry a stray translucent square; `Brand` draws the full mark.
