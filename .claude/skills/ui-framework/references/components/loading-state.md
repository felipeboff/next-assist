# LoadingState

A region that is loading: a small spinner and what is coming, centered in the space it gets.
For a full-screen route fallback use [page-loading](page-loading.md); for a button use its
`loading` prop. Atomic level: molecule.

```tsx
import { LoadingState } from '@/shared/presentation/ui';
```

## Variations

| Prop | Values | Default | Effect |
| --- | --- | --- | --- |
| `label` | string | required | What is loading ("Carregando conversas…"), xs muted |

## States

It is itself a state; it grows (`flex: 1`) like [empty-state](empty-state.md), so the two swap in
the same slot.

## Accessibility

The label is a `role="status"` paragraph, announced politely when it appears.

## Examples

```tsx
{!conversations && !failed ? <LoadingState label="Carregando conversas…" /> : null}
```

## Extending

Keep it text plus spinner. A skeleton of the content is a different component.
