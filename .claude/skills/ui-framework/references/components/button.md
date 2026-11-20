# Button

Actions. `primary` for the one main action of a screen; `secondary` or `ghost` for the rest;
`link` for a text-like action inside a line (it does not navigate: use [link](link.md) for that);
`danger` / `danger-soft` for destructive actions. Icon-only actions use
[icon-button](icon-button.md).
Atomic level: atom.

```tsx
import { Button } from '@/shared/presentation/ui';
```

## Variations

| Prop | Values | Default | Effect |
| --- | --- | --- | --- |
| `variant` | `primary`, `secondary`, `ghost`, `link`, `danger`, `danger-soft` | `primary` | Look; `danger` is the solid red confirm of a [confirm-dialog](confirm-dialog.md), `danger-soft` a red-on-pink action in a toolbar (close a conversation) |
| `size` | `sm` (32px), `md` (36px), `lg` (44px) | `md` | Height and text size (`link` only takes the text size) |
| `block` | boolean | `false` | Full width |
| `type` | `button`, `submit`, `reset` | `button` | Native type |
| `iconStart` / `iconEnd` | Lucide glyph | none | Icon before / after the label |
| `loading` | boolean | `false` | Spinner in place of `iconStart`, `aria-busy`, disabled |
| `loadingLabel` | string | none | Replaces the label while loading ("Entrando…") |
| `disabled` | boolean | `false` | Disabled look and behavior |
| `aria-disabled` | boolean | none | Looks enabled and keeps focus, but announces it is unavailable (the click handler decides) |
| `aria-keyshortcuts` | string | none | Announces a shortcut ("Control+Enter"); show it with [kbd](kbd.md) |
| `title` | string | none | Tooltip, e.g. why an `aria-disabled` button does nothing yet |
| `onClick`, `aria-label`, `aria-expanded`, `aria-controls`, `aria-pressed`, `data-testid` | | | Passed to `<button>` |

## States

Hover and active darken the fill; `disabled` and `loading` block clicks. An icon-only button
needs `aria-label`.

## Examples

```tsx
<Button type="submit" size="lg" block iconEnd={ArrowRight} loading={pending} loadingLabel="Entrando…">Entrar</Button>
<Button variant="link" size="sm" aria-expanded={open} onClick={toggle}>Esqueci minha senha</Button>
<Button variant="secondary" iconStart={LogOut}>Sair</Button>
<Button variant="danger-soft" iconStart={CircleCheck} onClick={askToClose}>Encerrar</Button>
<Button aria-keyshortcuts="Control+Enter" onClick={confirm}>Confirmar <Kbd tone="on-primary" label="Control+Enter">Ctrl ↵</Kbd></Button>
```

## Extending

Height and padding live in compound variants that exclude `link`, so a new variant must say
whether it takes them. The framework does not merge classes (`tailwind-variants/lite`): never set
the same CSS property in the base and in a variant.
