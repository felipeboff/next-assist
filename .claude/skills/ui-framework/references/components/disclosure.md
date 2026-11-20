# Disclosure

Shows or hides more detail in place: the agent's actions under a reply, a ticket's history in a
list. For a list of actions use [menu](menu.md). Client component. Atomic level: molecule.

```tsx
import { Disclosure } from '@/shared/presentation/ui';
```

## Variations

| Prop | Values | Default | Effect |
| --- | --- | --- | --- |
| `summary` | ReactNode | required | Content of the toggle; a chevron is added after it |
| `children` | ReactNode | required | The detail; mounted only while open |
| `variant` | `inline`, `row` | `inline` | `inline`: compact toggle that keeps its content's width, chevron down that flips up. `row`: full-width list row, chevron right that turns down |
| `preview` | ReactNode | none | Always shown between the toggle and the detail |
| `hint` | string | none | Tooltip (`title`) saying what opens, when the summary does not |
| `align` | `start`, `end` | `start` | Side of the `inline` toggle |
| `defaultOpen` | boolean | `false` | Starts open |

## States

Closed and open; the state is internal (uncontrolled).

## Accessibility

The toggle is a `button` with `aria-expanded` and `aria-controls` pointing at the detail
container, which is `hidden` while closed.

## Examples

### The agent's actions above a reply
```tsx
<Disclosure summary={<ActionsRow reply={reply} />} hint="Ver o que o agente considerou">
  <DecisionDetail decision={reply.decision} />
</Disclosure>
```

### A ticket row in the side panel
```tsx
<Disclosure variant="row" summary={<TicketSummary ticket={ticket} />}>
  <TicketHistory ticket={ticket} />
</Disclosure>
```

## Extending

Make it controlled (`open` / `onOpenChange`) only when a screen must open it from outside; keep
`defaultOpen` for the rest.
