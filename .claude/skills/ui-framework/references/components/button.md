# Button

Actions. `primary` for the one main action of a screen; `secondary` or `ghost` for the rest;
`link` for a text-like action inside a line (it does not navigate: use [link](link.md) for that).
Atomic level: atom.

```tsx
import { Button } from '@/shared/presentation/ui';
```

## Variations

| Prop | Values | Default | Effect |
| --- | --- | --- | --- |
| `variant` | `primary`, `secondary`, `ghost`, `link` | `primary` | Look |
| `size` | `sm` (32px), `md` (36px), `lg` (44px) | `md` | Height and text size (`link` only takes the text size) |
| `block` | boolean | `false` | Full width |
| `type` | `button`, `submit`, `reset` | `button` | Native type |
| `iconStart` / `iconEnd` | Lucide glyph | none | Icon before / after the label |
| `loading` | boolean | `false` | Spinner in place of `iconStart`, `aria-busy`, disabled |
| `loadingLabel` | string | none | Replaces the label while loading ("Entrando…") |
| `disabled` | boolean | `false` | Disabled look and behavior |
| `onClick`, `aria-label`, `aria-expanded`, `aria-controls`, `aria-pressed`, `data-testid` | | | Passed to `<button>` |

## States

Hover and active darken the fill; `disabled` and `loading` block clicks. An icon-only button
needs `aria-label`.

## Examples

```tsx
<Button type="submit" size="lg" block iconEnd={ArrowRight} loading={pending} loadingLabel="Entrando…">Entrar</Button>
<Button variant="link" size="sm" aria-expanded={open} onClick={toggle}>Esqueci minha senha</Button>
<Button variant="secondary" iconStart={LogOut}>Sair</Button>
```

## Extending

Height and padding live in compound variants that exclude `link`, so a new variant must say
whether it takes them. The framework does not merge classes (`tailwind-variants/lite`): never set
the same CSS property in the base and in a variant.
