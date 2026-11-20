# TextField

A labeled single-line input with optional leading icon, label action, hint and error.
Client component. Atomic level: molecule.

```tsx
import { TextField } from '@/shared/presentation/ui';
```

## Variations

| Prop | Values | Default | Effect |
| --- | --- | --- | --- |
| `name` / `label` | string | required | Field name / visible label |
| `type` | `text`, `email`, `tel`, `search`, `url` | `text` | Input type |
| `icon` | Lucide glyph | none | Leading icon |
| `labelAction` | ReactNode | none | Right side of the label row (e.g. a `link` button) |
| `hint` | ReactNode | none | Help under the field, linked by `aria-describedby` |
| `error` | string | none | Error under the field; sets `aria-invalid` and the danger border |
| `placeholder`, `autoComplete`, `inputMode`, `defaultValue`, `value`, `onChange`, `required`, `autoFocus`, `disabled` | | | Passed to `<input>` |

## States

Focus: primary border + ring. Error: danger border and message. Disabled: subtle fill.
Always give a `placeholder` that shows the expected format.

```tsx
<TextField name="email" type="email" label="E-mail corporativo" icon={Mail} placeholder="nome@nexo.com.br" error={errors.email} />
```
