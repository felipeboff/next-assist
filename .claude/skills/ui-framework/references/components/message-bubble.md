# MessageBubble

One chat message. User messages align right, assistant messages left; `inverse` swaps the colors
for the ink surface. Place bubbles in a column [stack](stack.md). Atomic level: molecule.

```tsx
import { MessageBubble } from '@/shared/presentation/ui';
```

| Prop | Values | Default | Effect |
| --- | --- | --- | --- |
| `from` | `user`, `assistant` | required | Side and colors |
| `inverse` | boolean | `false` | On light: user = ink, assistant = white with border. Inverse: user = white, assistant = `ink-bubble` |
| `children` | ReactNode | required | Message text (line breaks kept) |

Max width 85% of the column.

```tsx
<MessageBubble from="user" inverse>Meu notebook não conecta na VPN. Erro 809.</MessageBubble>
```
