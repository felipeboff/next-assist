# PasswordField

[TextField](text-field.md) for passwords, with a show/hide toggle (`aria-pressed`). Client
component. Atomic level: molecule.

```tsx
import { PasswordField } from '@/shared/presentation/ui';
```

| Prop | Values | Default | Effect |
| --- | --- | --- | --- |
| `name` / `label` | string | required | Field name / label |
| `icon`, `placeholder`, `labelAction`, `hint`, `error`, `required`, `disabled` | | | As in TextField |
| `autoComplete` | `current-password`, `new-password` | `current-password` | Password manager hint |
| `showLabel` / `hideLabel` | string | `Mostrar senha` / `Ocultar senha` | Toggle's accessible names |

```tsx
<PasswordField name="password" label="Senha" icon={Lock} placeholder="Digite sua senha" labelAction={…} hint={…} />
```
