# Form

A `<form>` with `noValidate` (validation is ours, in pt-BR), column layout and `aria-busy`
while submitting. Atomic level: molecule.

```tsx
import { Form } from '@/shared/presentation/ui';
```

| Prop | Values | Default | Effect |
| --- | --- | --- | --- |
| `onSubmit` | handler | required | Submit handler (call `preventDefault` for client submits) |
| `busy` | boolean | `false` | Sets `aria-busy` |
| `gap` | `Space` | `xl` | Space between fields |
| `aria-label` / `aria-labelledby` / `aria-describedby` | string | none | Accessible name (give one; the form becomes a landmark) |

```tsx
<Form onSubmit={handleSubmit} busy={isPending} gap="lg" aria-labelledby="login-title">…</Form>
```
