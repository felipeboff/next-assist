# Brand

The Nexo Assist logo (mark + wordmark) or the mark alone, drawn from the official paths.
Atomic level: atom.

```tsx
import { Brand } from '@/shared/presentation/ui';
```

| Prop | Values | Default | Effect |
| --- | --- | --- | --- |
| `tone` | `default` (blue mark, ink wordmark), `on-ink` (all white) | `default` | Colors for light or ink surfaces |
| `variant` | `full` (130×24), `mark` (20px tall) | `full` | Logo or mark only |
| `label` | string | `Nexo Assist` | Accessible name |

```tsx
<Brand tone="on-ink" />
<Brand variant="mark" />
```

The favicon (`src/app/icon.svg`) uses the same mark.
