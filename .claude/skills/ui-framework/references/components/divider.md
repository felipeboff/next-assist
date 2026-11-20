# Divider

A 1px line between blocks. Atomic level: atom.

```tsx
import { Divider } from '@/shared/presentation/ui';
```

| Prop | Values | Default | Effect |
| --- | --- | --- | --- |
| `tone` | `line`, `line-subtle`, `ink` | `line-subtle` | Line color (use `ink` on the ink surface) |
| `orientation` | `horizontal`, `vertical` | `horizontal` | `<hr>` or a vertical `role="separator"` |
| `insetStart` | `Space` | none | Starts a horizontal line after that space, to line it up with a text column (list items under an avatar) |
