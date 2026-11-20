# Heading

Titles. The level sets the element (`h1`–`h6`), the size sets the look; they are independent.
Atomic level: atom.

```tsx
import { Heading } from '@/shared/presentation/ui';
```

| Prop | Values | Default | Effect |
| --- | --- | --- | --- |
| `level` | `1`–`6` | required | Element rendered |
| `size` | `display-lg` (48), `display-md` (36), `display-sm` (32), `title` (16 sans semibold), `subtitle` (15.5 sans semibold) | `display-md` | Look; `display-*` use Newsreader |
| `tone` | `default`, `on-ink`, `muted` | `default` | Color |
| `measure` | `none`, `md`, `lg` | `none` | Max line length |
| `id` | string | none | For `aria-labelledby` |

Wrapping uses `text-wrap: pretty` (not `balance`, which moves words off the first line the
prototype keeps).

```tsx
<Heading level={1} size="display-md" id="login-title">Entrar</Heading>
<Heading level={2} size="display-lg" tone="on-ink" measure="lg">Seu problema de TI, resolvido em uma conversa.</Heading>
```
