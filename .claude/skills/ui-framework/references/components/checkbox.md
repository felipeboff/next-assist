# Checkbox

A labeled on/off choice. Native input, styled; works uncontrolled (`defaultChecked`, read from
`FormData` as `"on"`) or controlled (`checked` + `onChange`). Atomic level: atom.

```tsx
import { Checkbox } from '@/shared/presentation/ui';
```

| Prop | Values | Default | Effect |
| --- | --- | --- | --- |
| `name` | string | required | Form field name |
| `label` | ReactNode | required | Clickable label |
| `defaultChecked` / `checked` / `onChange` | | | Uncontrolled or controlled value |
| `disabled` | boolean | `false` | Dims and blocks |
| `id` | string | `checkbox-<name>` | Input id |

```tsx
<Checkbox name="rememberMe" label="Manter conectado neste computador" defaultChecked />
```
