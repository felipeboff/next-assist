# Link

Navigation in running text. App routes (`/…`) render `next/link`; anything else (`tel:`,
`mailto:`, external) renders `<a>`. For an action that does not navigate, use
[button](button.md) with `variant="link"`. Atomic level: atom.

```tsx
import { Link } from '@/shared/presentation/ui';
```

| Prop | Values | Default | Effect |
| --- | --- | --- | --- |
| `href` | string | required | Destination |
| `tone` | `primary`, `muted`, `on-ink-muted` | `primary` | Color |
| `size` | `TextSize` | `xs` | Type size |
| `weight` | `regular`, `medium`, `semibold` | `regular` | Weight |
| `external` | boolean | `false` | Opens in a new tab with `rel="noopener noreferrer"` |

```tsx
<Link href="tel:4000" weight="semibold">Ligue no ramal 4000</Link>
```
