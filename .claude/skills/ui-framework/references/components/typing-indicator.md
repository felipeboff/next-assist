# TypingIndicator

Someone is writing: three pulsing dots in a small bubble and who it is. Use it at the end of a
thread while an answer is on its way. Atomic level: molecule.

```tsx
import { TypingIndicator } from '@/shared/presentation/ui';
```

## Variations

| Prop | Values | Default | Effect |
| --- | --- | --- | --- |
| `label` | string | required | Who is writing ("Nexo Assist está digitando…"), xs muted |

## States

It is itself a state. The dots use `animate-typing`, 150ms apart, and stop under
`prefers-reduced-motion`.

## Accessibility

A `role="status"` paragraph: the label is announced; the dots are hidden.

## Examples

```tsx
{busy && !waiting ? <TypingIndicator label="Nexo Assist está digitando…" /> : null}
```

## Extending

The animation is a token (`--animate-typing` in `globals.css`); tune it there.
