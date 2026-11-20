# CountBadge

A small primary bubble with a number (unread messages); renders nothing at zero. For a count on
an icon-only button use the `badge` prop of [icon-button](icon-button.md). Atomic level: atom.

```tsx
import { CountBadge } from '@/shared/presentation/ui';
```

## Variations

| Prop | Values | Default | Effect |
| --- | --- | --- | --- |
| `count` | number | required | The number; `0` or less renders nothing |
| `label` | string | required | What is counted, read after the number ("mensagens não lidas") |

## States

Hidden at zero; no other state.

## Accessibility

`role="img"` named `"{count} {label}"`, so it reads "3 mensagens não lidas" and not just "3".

## Examples

```tsx
<CountBadge count={conversation.unread} label="mensagens não lidas" />
```

## Extending

One tone today (primary). A muted count would be a `tone` prop.
