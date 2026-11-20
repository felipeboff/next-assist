# Box

A surface: background, border, radius, padding and width. Use [stack](stack.md) to lay children out.
Atomic level: layout.

```tsx
import { Box } from '@/shared/presentation/ui';
```

## Variations

| Prop | Values | Default | Effect |
| --- | --- | --- | --- |
| `as` | `div`, `section`, `article`, `aside`, `header`, `footer`, `main`, `nav` | `div` | Element rendered (semantics) |
| `surface` | `none`, `canvas`, `subtle`, `ink`, `ink-raised` | `none` | Background token |
| `border` | `none`, `line`, `ink-line` | `none` | 1px border token |
| `radius` | `none`, `sm`, `md`, `lg`, `xl`, `full` | `none` | Corner radius |
| `padding` / `paddingX` / `paddingY` | `Space` | none | Inner spacing |
| `width` | `auto`, `full`, `form` (380px max), `card` (500px max) | `auto` | Width limit |
| `centered` | boolean | `false` | Centers horizontally (`mx-auto`) |
| `grow` / `fillHeight` | boolean | `false` | `flex: 1` / `height: 100%` |

Also takes `id`, ARIA attributes and `data-testid`.

## Examples

```tsx
<Box surface="ink-raised" border="ink-line" radius="xl" padding="lg" width="card" centered>
  …
</Box>
<Box width="form"><LoginForm /></Box>
```
