# StatusDot

A small colored dot for state (online, pending, priority). Decorative unless `label` is given.
Atomic level: atom.

```tsx
import { StatusDot } from '@/shared/presentation/ui';
```

| Prop | Values | Default | Effect |
| --- | --- | --- | --- |
| `tone` | `success`, `warning`, `danger`, `primary`, `muted` | required | Color |
| `size` | `sm` 6, `md` 8 | `md` | Diameter in px |
| `label` | string | none | Accessible name (`role="img"`) |

Pair it with text that says the same thing; color alone is not the message.
