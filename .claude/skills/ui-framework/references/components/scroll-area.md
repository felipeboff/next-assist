# ScrollArea

The part of a full-height screen that scrolls: a thread, a list. It fills the height left in a
flex column and scrolls vertically. Client component. Atomic level: layout.

```tsx
import { ScrollArea } from '@/shared/presentation/ui';
```

## Variations

| Prop | Values | Default | Effect |
| --- | --- | --- | --- |
| `children` | ReactNode | required | The scrolling content |
| `label` | string | none | Makes it a named `region` landmark |
| `followEnd` | any value | none | When defined, scrolls to the bottom on mount and every time this value changes |

## States

None of its own. Pass to `followEnd` something that changes when content is added at the end
(`` `${entries.length}-${busy}` ``), so a new message or the typing indicator comes into view.

## Accessibility

With `label`, a `role="region"` the user can jump to. Without it, a plain wrapper.

## Examples

```tsx
<ScrollArea label="Conversa" followEnd={`${entries.length}-${busy}`}>
  <Box width="thread" centered paddingY="5xl">…</Box>
</ScrollArea>
```

## Extending

It always jumps to the end; keeping the reader's place when they scrolled up would be a
`followEnd` mode, not a second component.
