# Tag

A pill with optional status dot, for compact labels like a ticket reference. Its children are
[text](text.md) runs. Atomic level: atom.

```tsx
import { Tag } from '@/shared/presentation/ui';
```

| Prop | Values | Default | Effect |
| --- | --- | --- | --- |
| `surface` | `canvas`, `soft` (primary tint), `subtle` | `canvas` | Background |
| `dot` | `StatusTone` | none | Leading status dot |
| `children` | ReactNode | required | Content (runs are laid out inline with a gap) |

```tsx
<Tag dot="warning">
  <Text as="span" size="2xs" weight="semibold">INC-20517</Text>
  <Text as="span" size="2xs" tone="muted">Rede e VPN · Alta · em até 4 h</Text>
</Tag>
```
