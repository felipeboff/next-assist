# Composer

Where a message is written and sent: a single-line input and its send button. Enter sends; a
blank message cannot be sent. For a free multi-line field in a form use
[text-area-field](text-area-field.md). Client component. Atomic level: organism.

```tsx
import { Composer } from '@/shared/presentation/ui';
```

## Variations

| Prop | Values | Default | Effect |
| --- | --- | --- | --- |
| `variant` | `inline`, `round` | `inline` | `inline`: bordered box with the labelled primary `Button` inside (employee chat). `round`: filled field and a round primary `IconButton` beside it (analyst console) |
| `label` | string | required | Accessible name of the input (visually hidden) |
| `placeholder` | string | required | Shown while empty |
| `value` / `onChange` | string / `(value) => void` | required | Controlled text |
| `onSubmit` | `() => void` | required | Called on Enter or the button when the text is not blank |
| `submitLabel` | string | required | Button text (`inline`) or its accessible name (`round`) |
| `disabled` | boolean | `false` | Input and send off; `round` drops the button |
| `disabledPlaceholder` | string | none | Replaces the placeholder while disabled (why it is off) |
| `submitBlocked` | boolean | `false` | Typing stays allowed but sending waits (an answer is on its way) |
| `footnote` | ReactNode | none | Small muted line under the box, right-aligned (a counter) |
| `inputRef` | `RefObject<HTMLInputElement>` | none | To focus the input from the screen |

## States

Empty or blank: send disabled. `submitBlocked`: send disabled, input enabled. `disabled`:
subtle fill (`inline`) and the `disabledPlaceholder`. Sending errors are the screen's job (an
[alert](alert.md) above the composer).

## Accessibility

A `<form>` with a visually hidden `<label>` bound to the input; the send control is a submit
button, so Enter works with no key handler. `autocomplete="off"`.

## Examples

### Employee chat
```tsx
<Composer
  label="Mensagem"
  placeholder="Descreva o que está acontecendo"
  value={message}
  onChange={setMessage}
  submitLabel="Enviar"
  disabled={limitReached}
  disabledPlaceholder="Você atingiu o limite de 20 mensagens"
  submitBlocked={busy}
  onSubmit={send}
  footnote={`${sentCount}/20 mensagens`}
/>
```

### Analyst console
```tsx
<Composer variant="round" label="Resposta" placeholder="Responder a Ana…" value={reply} onChange={setReply} submitLabel="Enviar" onSubmit={sendReply} />
```

## Extending

The two variants share the input; a new look adds a variant branch for the form and the input
class, keeping the hidden label and the submit button.
