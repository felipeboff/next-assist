# PageLoading

Full-screen loading state: a spinner and a visible label, centered, announced as `role="status"`.
Use it as the `<Suspense>` fallback of a whole page or route group; inside a page section use
[spinner](spinner.md) or a skeleton instead. Atomic level: molecule.

```tsx
import { PageLoading } from '@/shared/presentation/ui';
```

| Prop | Values | Default | Effect |
| --- | --- | --- | --- |
| `label` | string | required | What is loading, in pt-BR ("Carregando sua sessão…") |

```tsx
<Suspense fallback={<PageLoading label="Carregando sua sessão…" />}>…</Suspense>
```
