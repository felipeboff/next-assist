# TextAreaField

A labeled multi-line text field, with the same label, hint and error as
[text-field](text-field.md). For sending a chat message use [composer](composer.md).
Client component. Atomic level: molecule.

```tsx
import { TextAreaField } from '@/shared/presentation/ui';
```

## Variations

| Prop | Values | Default | Effect |
| --- | --- | --- | --- |
| `name` / `label` | string | required | Field name / visible label |
| `value` / `onChange` | string / `(value) => void` | required | Controlled text |
| `rows` | number | `3` | Initial height; the user can resize vertically |
| `hint` | string | none | Help under the field, linked by `aria-describedby` |
| `error` | string | none | Error under the field; sets `aria-invalid` and the danger border |
| `disabled` | boolean | none | Subtle fill, not editable |

## States

Focus: primary border + ring. Error: danger border and message. Disabled: subtle fill.

## Accessibility

A `<textarea>` bound to its `<label>`; hint and error are its description.

## Examples

```tsx
<TextAreaField name="description" label="Descrição" value={edit.description} onChange={setDescription} rows={4} error={errors.description} />
```

## Extending

Shares `FieldShell` with `TextField`; a counter or a max length belongs there for both.
