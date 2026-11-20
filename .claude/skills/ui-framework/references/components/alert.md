# Alert

An inline message for a whole form or section (field errors go on the field). `danger` is
`role="alert"` (announced at once); `info` is `role="status"`. Atomic level: molecule.

```tsx
import { Alert } from '@/shared/presentation/ui';
```

| Prop | Values | Default | Effect |
| --- | --- | --- | --- |
| `tone` | `danger`, `info` | `danger` | Color, icon and role |
| `children` | ReactNode | required | Message: what happened and what to do |

```tsx
{formError ? <Alert tone="danger">{formError}</Alert> : null}
```
