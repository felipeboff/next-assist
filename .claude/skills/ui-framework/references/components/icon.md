# Icon

A Lucide glyph sized and colored by tokens. Decorative by default (`aria-hidden`); pass `label`
when the icon alone carries meaning. Atomic level: atom.

```tsx
import { Icon } from '@/shared/presentation/ui';
import { Mail } from 'lucide-react';
```

| Prop | Values | Default | Effect |
| --- | --- | --- | --- |
| `icon` | Lucide glyph | required | The glyph |
| `size` | `xs` 14, `sm` 16, `md` 18, `lg` 20 | `sm` | Size in px |
| `tone` | `TextTone` | `inherit` | Color |
| `label` | string | none | Makes it `role="img"` with that name |

Other components take glyphs directly (`icon`, `iconStart`, `iconEnd`) and render `Icon` themselves.
