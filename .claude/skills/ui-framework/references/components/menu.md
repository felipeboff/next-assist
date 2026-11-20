# Menu

A button that opens a short list of actions (more actions, the account menu). Escape or a click
outside closes it. For in-place detail use [disclosure](disclosure.md). Client component.
Atomic level: organism.

```tsx
import { Menu, type MenuItem } from '@/shared/presentation/ui';
```

## Variations

| Prop | Values | Default | Effect |
| --- | --- | --- | --- |
| `label` | string | required | Names the trigger and the menu |
| `icon` | Lucide glyph | none | A 36px ghost icon trigger... |
| `trigger` | ReactNode | none | ...or custom content inside a round trigger (an `Avatar`) |
| `header` | ReactNode | none | Non-interactive block on top of the items (who is signed in), with a divider |
| `items` | `readonly MenuItem[]` | required | `{ label, onSelect, icon?, tone?: "default" \| "danger", disabled? }` |
| `placement` | `bottom-end`, `right-end` | `bottom-end` | Popover below the trigger, right-aligned; or to its right, bottom-aligned (rail) |

## States

Closed and open (internal). Disabled items are faded and skipped by focus and the arrow keys.
Picking an item closes the menu before running `onSelect`.

## Accessibility

Trigger: `aria-haspopup="menu"`, `aria-expanded`, `aria-controls` while open. The popover is a
`role="menu"` of `menuitem` buttons; opening focuses the first enabled item, ArrowDown/ArrowUp
move between enabled items and wrap, Escape closes and returns focus to the trigger.

## Examples

### More actions
```tsx
<Menu label="Mais ações" icon={EllipsisVertical} items={[{ label: "Encerrar conversa", icon: CircleCheck, tone: "danger", onSelect: askToClose }]} />
```

### Account, from the rail
```tsx
<Menu
  label="Conta de Ana Souza"
  trigger={<Avatar name="Ana Souza" size="sm" tone="blue" online />}
  placement="right-end"
  header={<Text size="sm" weight="semibold">Ana Souza</Text>}
  items={[{ label: "Sair", icon: LogOut, onSelect: signOut }]}
/>
```

## Extending

Item labels are React keys, so they must be unique. Groups or checkable items would be new item
kinds, not new props on `Menu`.
