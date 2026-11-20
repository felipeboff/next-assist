# Box

A surface: background, border, radius, shadow, padding and width. Use [stack](stack.md) to lay
children out. Atomic level: layout.

```tsx
import { Box } from '@/shared/presentation/ui';
```

## Variations

| Prop | Values | Default | Effect |
| --- | --- | --- | --- |
| `as` | `div`, `section`, `article`, `aside`, `header`, `footer`, `main`, `nav` | `div` | Element rendered (semantics) |
| `surface` | `none`, `canvas`, `subtle`, `muted`, `primary-soft`, `warning-soft`, `ink`, `ink-raised` | `none` | Background token |
| `border` | `none`, `line`, `line-soft`, `ink-line` | `none` | 1px border token (`line-soft` for cards on white) |
| `radius` | `none`, `sm`, `md`, `lg`, `xl`, `full` | `none` | Corner radius |
| `shadow` | `none`, `card` | `none` | Elevation (`shadow-card`) |
| `clip` | boolean | `false` | Clips children to the radius (a card with a tinted footer or row dividers) |
| `padding` / `paddingX` / `paddingY` | `Space` | none | Inner spacing |
| `paddingTop` / `paddingBottom` | `Space` | none | Top and bottom spacing when they differ (use instead of `paddingY`) |
| `width` | `auto`, `full`, `form` (380px max), `card` (500px max), `reply` (600px max), `page` (600px max), `thread` (808px max) | `auto` | Width limit |
| `centered` | boolean | `false` | Centers horizontally (`mx-auto`) |
| `grow` / `fillHeight` | boolean | `false` | `flex: 1` / `height: 100%` |

Also takes `id`, ARIA attributes and `data-testid`.

`page` is the column of a form-like app page (profile); `thread` the column of a chat thread and
its composer; `reply` an assistant reply with cards inside.

## Examples

```tsx
<Box surface="ink-raised" border="ink-line" radius="xl" padding="lg" width="card" centered>
  …
</Box>
<Box width="form"><LoginForm /></Box>
<Box surface="canvas" border="line-soft" radius="xl" shadow="card" clip>
  <DescriptionList layout="rows" items={items} />
</Box>
<Box width="thread" centered paddingTop="5xl" paddingBottom="lg">{messages}</Box>
```

## Extending

`reply` and `page` share a value today but mean different things; change one without the other
when the prototype says so.
