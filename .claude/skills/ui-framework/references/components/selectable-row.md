# SelectableRow

A list row that opens something (a conversation); the open one stays highlighted. For links
between pages use [nav-list](nav-list.md). Client component. Atomic level: molecule.

```tsx
import { SelectableRow } from '@/shared/presentation/ui';
```

## Variations

| Prop | Values | Default | Effect |
| --- | --- | --- | --- |
| `selected` | boolean | required | Subtle fill and `aria-current="true"` |
| `onSelect` | `() => void` | required | Click or Enter/Space |
| `children` | ReactNode | required | The row content (laid out by the caller) |

## States

Default (subtle fill on hover) and selected (subtle fill).

## Accessibility

A full-width `button`; its content is its name, so keep it short and meaningful. The selected
row carries `aria-current="true"`.

## Examples

```tsx
<SelectableRow selected={item.id === selectedId} onSelect={() => open(item.id)}>
  <Box paddingX="sm" paddingY="sm"><ConversationListItem conversation={item} /></Box>
</SelectableRow>
```

## Extending

The content must not hold other interactive elements (it is inside a button).
