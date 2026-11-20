# Stack

Rows and columns with gap, alignment and wrap. The default layout primitive.
Atomic level: layout.

```tsx
import { Stack } from '@/shared/presentation/ui';
```

## Variations

| Prop | Values | Default | Effect |
| --- | --- | --- | --- |
| `direction` | `column`, `row` | `column` | Main axis |
| `gap` | `Space` | `none` | Space between children |
| `align` | `start`, `center`, `end`, `stretch`, `baseline` | `stretch` | Cross-axis alignment |
| `justify` | `start`, `center`, `end`, `between` | `start` | Main-axis distribution |
| `wrap` | boolean | `false` | Lets a row wrap on narrow screens |
| `grow` / `fillHeight` | boolean | `false` | `flex: 1` / `height: 100%` |
| `width` | `auto`, `full` | `auto` | Full width |
| `paddingTop` | `Space` | none | Extra space above, for one-off rhythm (e.g. before a primary action) |
| `as` | `div`, `section`, `article`, `aside`, `header`, `footer`, `main`, `nav`, `ul`, `ol`, `li` | `div` | Element rendered |

## Examples

```tsx
<Stack direction="row" gap="sm" align="baseline" wrap justify="end">…</Stack>
<Stack fillHeight justify="between" gap="5xl">{top}{middle}{bottom}</Stack>
```
