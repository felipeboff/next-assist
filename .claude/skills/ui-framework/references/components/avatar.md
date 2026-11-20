# Avatar

A round badge with a person's initials, in a tone derived from the name, with an optional
presence dot. For a status without a person use [status-dot](status-dot.md).
Atomic level: atom.

```tsx
import { Avatar, avatarToneOf, initialsOf } from '@/shared/presentation/ui';
```

## Variations

| Prop | Values | Default | Effect |
| --- | --- | --- | --- |
| `name` | string | required | Source of the initials and of the default tone |
| `size` | `sm` (32px), `md` (40px), `lg` (44px) | `md` | Diameter and initials size |
| `tone` | `blue`, `orange`, `violet`, `green`, `rose`, `slate`, `amber` | `avatarToneOf(name)` | Background and initials color (`avatar-*` tokens) |
| `online` | boolean | `false` | Green presence dot on the lower right corner |
| `labelled` | boolean | `false` | Reads the name out (`role="img"`); otherwise hidden from assistive tech |

Helpers, also exported: `initialsOf(name)` ("Ana Souza" → "AS", one name → one letter, blank →
"") and `avatarToneOf(name)` (the same name always gets the same tone).

## States

No loading or error look: the initials need only the name. `online` is the only state.

## Accessibility

Decorative by default (`aria-hidden`), because the name is usually written beside it. Pass
`labelled` when the avatar stands alone (a menu trigger without text, a stack of faces).

## Examples

### Beside the name
```tsx
<Stack direction="row" align="center" gap="sm">
  <Avatar name="Ana Souza" size="sm" tone="blue" />
  <Text size="sm" weight="semibold">Ana Souza</Text>
</Stack>
```

### In a list, with presence
```tsx
<Avatar name={conversation.employee.name} size="lg" online={conversation.employee.online} />
```

## Extending

A new tone needs a `--color-avatar-<tone>` / `-text` pair in `globals.css`
([foundations](../foundations.md#colors)) and an entry in `toneClass`; adding one changes which
tone `avatarToneOf` gives to existing names.
