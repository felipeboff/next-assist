# Spinner

An indeterminate loading indicator in the current text color. Atomic level: atom.

```tsx
import { Spinner } from '@/shared/presentation/ui';
```

| Prop | Values | Default | Effect |
| --- | --- | --- | --- |
| `size` | `sm` 16, `md` 20 | `sm` | Size |
| `label` | string | none | With a label it is a `role="status"` region; without, decorative |

```tsx
<Suspense fallback={<Spinner size="md" label="Carregando sua sessão" />}>…</Suspense>
```
