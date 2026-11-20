# ConfirmDialog

A modal that asks before an action that is hard to undo (close a conversation, cancel a
ticket). For a message that needs no decision use [alert](alert.md). Client component.
Atomic level: organism.

```tsx
import { ConfirmDialog } from '@/shared/presentation/ui';
```

## Variations

| Prop | Values | Default | Effect |
| --- | --- | --- | --- |
| `open` | boolean | required | Opens (`showModal`) and closes the native `<dialog>` |
| `title` | string | required | Heading (`h2`) and accessible name |
| `description` | ReactNode | required | Muted text under the title; accessible description |
| `confirmLabel` | string | required | Confirm button text |
| `cancelLabel` | string | `"Cancelar"` | Cancel button text |
| `tone` | `danger`, `primary` | `danger` | Confirm button variant |
| `busy` | boolean | `false` | Confirm shows its spinner; both buttons are blocked |
| `onConfirm` / `onCancel` | `() => void` | required | Clicks; Escape calls `onCancel` |

## States

Closed, open and busy. The caller owns `open`: Escape and Cancel only call `onCancel`, so the
dialog closes when the caller sets `open={false}` (after the action, or at once on cancel).

## Accessibility

Native modal `<dialog>`: focus is trapped inside and the page behind is inert; it is named by
the title (`aria-labelledby`) and described by the text (`aria-describedby`). The backdrop is
ink at 40%.

## Examples

### Close a conversation
```tsx
<ConfirmDialog
  open={confirmingClose}
  title="Encerrar a conversa com Ana Souza?"
  description="Ana verá que o atendimento foi encerrado."
  confirmLabel="Encerrar"
  busy={busy === "close"}
  onCancel={() => setConfirmingClose(false)}
  onConfirm={closeConversation}
/>
```

## Extending

jsdom lacks `showModal`/`close`; specs stub them on `HTMLDialogElement.prototype`. A dialog
with a form or more than two actions is a different component, not a prop here.
