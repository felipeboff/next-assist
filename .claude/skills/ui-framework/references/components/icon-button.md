# IconButton

An icon-only action: search, close, more actions, send, a rail item. With a text label use
[button](button.md). Atomic level: atom.

```tsx
import { IconButton } from '@/shared/presentation/ui';
```

## Variations

| Prop | Values | Default | Effect |
| --- | --- | --- | --- |
| `icon` | Lucide glyph | required | The glyph (`lg` size on `size="lg"`, else `md`) |
| `label` | string | required | Accessible name |
| `variant` | `ghost`, `secondary`, `primary`, `tile` | `ghost` | Look; `tile` is the console rail item (raised white card when current) |
| `size` | `sm` (32px), `md` (36px), `lg` (44px) | `md` | Square size |
| `shape` | `square`, `round` | `square` | Corner radius (`tile` has its own) |
| `type` | `button`, `submit` | `button` | Native type |
| `badge` / `badgeLabel` | number / string | none / `""` | A count on the corner; read in the name: "Conversas, 3 aguardando" |
| `current` | boolean | `false` | `aria-current="page"` (rail item of the current page) |
| `disabled` | boolean | `false` | 50% opacity, not clickable |
| `onClick`, `aria-expanded`, `aria-controls`, `aria-haspopup` | | | Passed to `<button>` |

## States

Hover fills (`ghost`, `secondary`, `tile`) or darkens (`primary`); `disabled` fades. A badge
of `0` is not shown.

## Accessibility

`label` is required: it is the button's `aria-label`, extended with the badge count. The glyph is
hidden.

## Examples

```tsx
<IconButton icon={Search} label="Buscar na conversa" onClick={openSearch} />
<IconButton icon={MessageCircle} label="Conversas" variant="tile" size="lg" current badge={waiting} badgeLabel="aguardando" />
<IconButton type="submit" icon={SendHorizontal} label="Enviar" variant="primary" size="lg" shape="round" disabled={!canSend} />
```

## Extending

Variants are built with `tailwind-variants/lite`; a variant with its own radius must not also
receive `shape`'s radius (no class merging).
