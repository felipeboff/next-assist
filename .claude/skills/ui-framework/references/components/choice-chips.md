# ChoiceChips

Quick answers to a question the assistant asks: one choice, made once. For filters that change
back and forth use [filter-chips](filter-chips.md); for a choice among rich rows use
[radio-list](radio-list.md). Client component. Atomic level: molecule.

```tsx
import { ChoiceChips } from '@/shared/presentation/ui';
```

## Variations

| Prop | Values | Default | Effect |
| --- | --- | --- | --- |
| `label` | string | required | Names the group (the question) |
| `options` | `readonly string[]` | required | One chip per option, in order |
| `chosen` | `string \| null` | required | The option already picked: it is marked (primary soft) and every chip is disabled |
| `disabled` | boolean | `false` | Disables every chip before a choice (busy, no longer the last question) |
| `onChoose` | `(option) => void` | required | Called with the option clicked |

## States

Open (`chosen={null}`), chosen (marked chip, all locked) and disabled (all locked, none marked).

## Accessibility

A `role="group"` named by `label`; each chip is a `button` with `aria-pressed`.

## Examples

### A question in the chat
```tsx
<ChoiceChips
  label="Qual sistema você usa?"
  options={["Windows", "macOS", "Linux"]}
  chosen={part.chosen}
  disabled={!interactive || busy}
  onChoose={onAnswer}
/>
```

## Extending

Options are strings, used both as label and value. If a label must differ from what is sent,
move to `{ value, label }` options like `FilterChips`.
