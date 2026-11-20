# EventDivider

Something that happened in a conversation, between its messages: a transfer, a takeover, a date.
For a plain separator use [divider](divider.md). Atomic level: molecule.

```tsx
import { EventDivider } from '@/shared/presentation/ui';
```

## Variations

| Prop | Values | Default | Effect |
| --- | --- | --- | --- |
| `variant` | `line`, `pill` | `line` | `line`: xs muted text between two 1px lines across the thread. `pill`: a date marker on a small white pill, centered |
| `icon` | Lucide glyph | none | Before the text (`line` only) |
| `children` | ReactNode | required | The event text |

## States

None.

## Accessibility

Renders a `<p>`; the lines are `aria-hidden`, so only the text is read.

## Examples

```tsx
<EventDivider icon={ArrowLeftRight}>Transferido para Suporte N2 às 14:20</EventDivider>
<EventDivider variant="pill">Hoje</EventDivider>
```

## Extending

A tone (warning for an SLA breach) would color the text and the icon; keep the lines neutral.
