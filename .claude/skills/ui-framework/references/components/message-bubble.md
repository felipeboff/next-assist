# MessageBubble

One chat message. User messages align right, assistant messages left; `inverse` swaps the colors
for the ink surface, and `tone` colors a bubble by who speaks in a thread (in the console: agent `primary`, analyst
`success`).
Place bubbles in a column [stack](stack.md). Atomic level: molecule.

```tsx
import { MessageBubble } from '@/shared/presentation/ui';
```

## Variations

| Prop | Values | Default | Effect |
| --- | --- | --- | --- |
| `from` | `user`, `assistant` | required | Side and, with `tone="auto"`, colors |
| `inverse` | boolean | `false` | On light: user = ink, assistant = white with border. Inverse: user = white, assistant = `ink-bubble` |
| `tone` | `auto`, `ink`, `canvas`, `primary`, `success` | `auto` | `auto` follows `from`/`inverse`; the others set the colors (`canvas` white with field shadow, `primary` = `primary-muted`, `success` = `success-muted`) |
| `align` | `auto`, `start`, `end` | `auto` | `auto` follows `from`; `start`/`end` override the side (an analyst's reply on the employee's side) |
| `size` | `sm`, `md` | `sm` | `sm`: xs text, compact padding (login showcase). `md`: md text, roomier, larger radius (chat, console) |
| `measure` | `auto`, `wide`, `md` | `auto` | Longest line: `auto` follows the size (85% for `sm`, 75% for `md`), `wide` 75% of the thread, `md` about 520px |
| `meta` | ReactNode | none | Time and delivery marks, floated at the end of the text (2xs muted) |
| `children` | ReactNode | required | Message text (line breaks kept) |

Side and width come from compound variants: they apply only while `align` / `measure` are
`auto`, so an explicit value replaces them instead of stacking classes.

## Accessibility

A plain `<div>`; the thread gives the context (who said it). Put the author's name in a
visually present label when a thread mixes more than two voices.

## Examples

```tsx
<MessageBubble from="user" inverse>Meu notebook não conecta na VPN. Erro 809.</MessageBubble>
<MessageBubble from="user" size="md" measure="md">{entry.text}</MessageBubble>
<MessageBubble from="user" tone="primary" size="md" measure="wide" meta={<Delivered at={entry.at} />}>{agentText}</MessageBubble>
<MessageBubble from="user" tone="success" size="md" measure="wide">Assumi a conversa, Ana.</MessageBubble>
```

## Extending

A new color is a `tone` value; it must not be added to the `from` compounds, which apply only to
`tone="auto"`.
