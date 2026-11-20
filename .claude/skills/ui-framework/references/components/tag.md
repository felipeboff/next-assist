# Tag

A compact pill with an optional status dot or icon: a ticket reference, an online status, a team.
Its children are [text](text.md) runs. For a status in words without a fill use
[status-label](status-label.md). Atomic level: atom.

```tsx
import { Tag } from '@/shared/presentation/ui';
```

## Variations

| Prop | Values | Default | Effect |
| --- | --- | --- | --- |
| `surface` | `canvas`, `soft` (primary tint), `subtle` | `canvas` | Background of the neutral tags (login showcase) |
| `tone` | `neutral`, `primary`, `success`, `success-tint`, `warning`, `danger` | none | A tinted tag whose text takes the tone ("Online", "Aguardando analista", "IA"); wins over `surface` |
| `size` | `xs`, `sm`, `md` | `sm` | `xs`: 11px semibold, tight (inline labels). `sm`: 2xs text. `md`: xs medium (top bar status) |
| `shape` | `pill`, `rounded` | `pill` | Full or 4px radius |
| `dot` | `StatusTone` | none | Leading status dot |
| `icon` | Lucide glyph | none | Leading icon (after the dot) |
| `children` | ReactNode | required | Content (runs are laid out inline with a gap, truncated) |

## Accessibility

Plain text; the dot and the icon are decorative, so the words must carry the status.

## Examples

```tsx
<Tag dot="warning">
  <Text as="span" size="2xs" weight="semibold">INC-20517</Text>
  <Text as="span" size="2xs" tone="muted">Rede e VPN · Alta · em até 4 h</Text>
</Tag>
<Tag tone="success" size="md" dot="success">Assistente online</Tag>
<Tag tone="warning" size="md" icon={Bot}>Aguardando analista</Tag>
<Tag tone="primary" size="xs" shape="rounded">IA</Tag>
```

## Extending

`surface` and `tone` feed the same `color` variant; a new tint is a `tone` value (and its token
in [foundations](../foundations.md#colors)).
