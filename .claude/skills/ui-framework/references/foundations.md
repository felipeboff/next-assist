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
| `surface-subtle` | `#f6f7f9` | Hover fills, disabled fields, card footers |
| `ink` | `#1b2431` | Dark brand surface (login aside); also the default text color |
| `ink-raised` | `#242d39` | Card on the ink surface |
| `ink-bubble` | `#353d49` | Assistant bubble on the ink surface |
| `ink-line` / `ink-divider` | `#2d3541` / `#283040` | Borders and dividers on the ink surface |
| `text` / `text-secondary` / `text-muted` / `text-placeholder` | `#1b2431` / `#3d4656` / `#5b6472` / `#8a919c` | Text on light surfaces |
| `on-ink` / `on-ink-soft` / `on-ink-muted` / `on-ink-subtle` / `on-ink-faint` | `#fff` / `#d3d5d7` / `#afb3b7` / `#989ca2` / `#878c92` | Text on the ink surface, strongest to faintest |
| `line` / `line-subtle` | `#e3e6e9` / `#eceef1` | Field borders / dividers |
| `brand` | `#037af6` | The logo mark only |
| `primary` (+ `-hover`, `-active`, `-soft`) | `#0062c4` | Actions, links, focus, checked controls |
| `success` (+ `-text`) | `#00bd6c` | Online / ok dots and text |
| `warning` (+ `-text`) | `#f5a500` | Pending / attention dots and text |
| `danger` (+ `-soft`) | `#c8352b` | Errors (not in the prototype yet; chosen to sit with the palette) |

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

Shadows: `shadow-field` (fields, secondary buttons, checkbox) and `shadow-primary` (the
primary button's blue glow).

## Breakpoints

Tailwind defaults. `lg` (1024px) is where split layouts show their aside; below it the main
column takes the screen.

## Motion

Color and shadow transitions of 150ms with `ease-out-quart`. Spinners keep spinning under
`prefers-reduced-motion`, slower. No layout animation.

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
