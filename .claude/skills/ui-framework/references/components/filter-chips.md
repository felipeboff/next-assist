# FilterChips

One of a few filters over a list, each with its count ("Todas", "Para você 3"). For a one-time
answer use [choice-chips](choice-chips.md). Client component. Atomic level: molecule.

```tsx
import { FilterChips, type FilterChip } from '@/shared/presentation/ui';
```

## Variations

| Prop | Values | Default | Effect |
| --- | --- | --- | --- |
| `label` | string | required | Names the group |
| `options` | `readonly { value: T; label: string; count?: number }[]` | required | One chip each; `count` shown after the label when defined (also `0`) |
| `value` | `T` (string union) | required | The active filter (primary soft, pressed) |
| `onChange` | `(value: T) => void` | required | Called with the chip clicked |

Generic over `T`, so `value` and `onChange` keep the screen's filter union.

## States

Exactly one chip is pressed. There is no disabled look; filter while the list loads is fine.

## Accessibility

A `role="group"` named by `label`; each chip is a `button` with `aria-pressed`. The count is
part of the chip's name.

## Examples

```tsx
<FilterChips
  label="Filtros"
  value={filter}
  onChange={setFilter}
  options={[
    { value: "all", label: "Todas" },
    { value: "for-you", label: "Para você", count: counts["for-you"] },
  ]}
/>
```

## Extending

Chips wrap. Many filters (more than four or five) call for a select, not more chips.
