# Stat / StatGroup

Big numbers with a label, in equal columns separated by lines, on the ink surface. Renders a
description list (`<dl>`). Atomic level: molecule.

```tsx
import { Stat, StatGroup } from '@/shared/presentation/ui';
```

| Component | Prop | Values | Effect |
| --- | --- | --- | --- |
| `StatGroup` | `label` | string | Accessible name of the list |
| `Stat` | `value` | ReactNode | Number in Newsreader 32px |
| `Stat` | `label` | string | Caption under the number |
| `Stat` | `indicator` | ReactNode | Beside the value (e.g. a `StatusDot`) |

```tsx
<StatGroup label="O service desk em números">
  <Stat value="72%" label="resolvidos sem fila" />
  <Stat value="6" label="analistas online agora" indicator={<StatusDot tone="success" />} />
</StatGroup>
```

Only the ink tone exists today; add a `tone` prop when a light surface needs it.
