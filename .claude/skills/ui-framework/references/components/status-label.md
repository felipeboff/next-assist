# StatusLabel

A status in words with its colored dot: "● Aguardando analista". For the dot alone use
[status-dot](status-dot.md); for a tinted pill use [tag](tag.md). Atomic level: atom.

```tsx
import { StatusLabel } from '@/shared/presentation/ui';
```

## Variations

| Prop | Values | Default | Effect |
| --- | --- | --- | --- |
| `tone` | `success`, `warning`, `danger`, `primary`, `muted` | required | Dot color and, when `colored`, text color |
| `size` | `TextSize` | `xs` | Text size |
| `text` | `colored`, `plain` | `colored` | `plain` keeps the text in the body color |
| `children` | ReactNode | required | The words; truncated on one line |

## States

None of its own; it is how states are shown.

## Accessibility

The dot is hidden; the words carry the meaning, so never pass only a color.

## Examples

```tsx
<StatusLabel tone="warning" size="sm">Aguardando confirmação</StatusLabel>
<StatusLabel tone="danger" size="md" text="plain">Alta</StatusLabel>
```

## Extending

Tones are the `StatusTone` tokens; a new tone is added there and in `status-dot` together.
