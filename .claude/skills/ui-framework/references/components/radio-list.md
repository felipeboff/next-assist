# RadioList

A card of rows to pick one from, each row a radio with free content (which ticket a message is
about). For short text answers use [choice-chips](choice-chips.md). Client component.
Atomic level: molecule.

```tsx
import { RadioList, type RadioListItem } from '@/shared/presentation/ui';
```

## Variations

| Prop | Values | Default | Effect |
| --- | --- | --- | --- |
| `label` | string | required | Legend of the fieldset (visually hidden) |
| `items` | `readonly { value: string; content: ReactNode }[]` | required | One row each; the whole row is the radio's label |
| `value` | `string \| null` | required | The checked row (primary wash fill); `null` checks none |
| `disabled` | boolean | `false` | Locks every row, keeping the checked one visible |
| `onChange` | `(value) => void` | required | Called with the row picked |

## States

Unchecked, checked (wash fill, thick primary ring), hover (subtle fill) and disabled (no hover,
default cursor).

## Accessibility

A `<fieldset>` with a hidden `<legend>`; real radio inputs sharing one generated `name`, so
the arrow keys move between rows natively.

## Examples

```tsx
<RadioList
  label="Sobre qual chamado é a mensagem?"
  value={picked ?? choice}
  disabled={disabled || picked !== null}
  onChange={setChoice}
  items={tickets.map((ticket) => ({ value: ticket.code, content: <TicketRow ticket={ticket} /> }))}
/>
```

## Extending

Rows hold any content; keep interactive elements out of `content` (the row is a label).
