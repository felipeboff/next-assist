# Text

Body text: paragraphs, labels, captions, inline runs. For titles use [heading](heading.md).
Atomic level: atom.

```tsx
import { Text } from '@/shared/presentation/ui';
```

## Variations

| Prop | Values | Default | Effect |
| --- | --- | --- | --- |
| `as` | `p`, `span`, `strong`, `small`, `time` | `p` | Element rendered |
| `size` | `2xs`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl` | `md` | Type scale token ([foundations](../foundations.md#typography)) |
| `tone` | `default`, `secondary`, `muted`, `primary`, `danger`, `success`, `warning`, `on-ink`, `on-ink-soft`, `on-ink-muted`, `on-ink-subtle`, `on-ink-faint`, `inherit` | `default` | Color; `on-ink-*` for the dark surface |
| `weight` | `regular`, `medium`, `semibold` | `regular` | Font weight |
| `align` | `start`, `center`, `end` | `start` | Alignment |
| `measure` | `none`, `sm` (24rem), `md` (31.5rem), `lg` (40rem) | `none` | Max line length |
| `truncate` / `nowrap` / `tabular` / `italic` | boolean | `false` | Ellipsis / no wrap / tabular numbers / italic (a live status such as "digitando…") |
| `role`, `aria-live` | `status`/`alert`, `polite`/`assertive` | none | Live text |

## Examples

```tsx
<Text size="xs" tone="on-ink-subtle">Service desk de TI da Nexo</Text>
<Text as="span" size="2xs" weight="semibold">INC-20517</Text>
<Text as="span" size="sm" tone="success" italic>digitando…</Text>
```
