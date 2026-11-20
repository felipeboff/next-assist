# DescriptionList

Label and value pairs (`<dl>`): ticket fields, profile data, the agent's decision. For big
numbers use [stat](stat.md). Atomic level: molecule.

```tsx
import { DescriptionList } from '@/shared/presentation/ui';
```

## Variations

| Prop | Values | Default | Effect |
| --- | --- | --- | --- |
| `items` | `readonly { label: string; value: ReactNode; aside?: ReactNode }[]` | required | One pair each; `label` is also the React key |
| `layout` | `columns`, `rows` | `columns` | `columns`: label (xs muted) over value, side by side in a grid (cards). `rows`: label beside value, one row each with dividers (profile) |
| `columns` | `2`, `3`, `4` | `3` | Grid columns of the `columns` layout |

`aside` is shown only in the `rows` layout, at the end of the row (xs muted), as a second `<dd>`.

## States

None; pass a placeholder value ("—") for a missing field.

## Accessibility

Real `<dl>`, `<dt>`, `<dd>`: the pairs are read as term and definition.

## Examples

### Ticket card
```tsx
<DescriptionList
  columns={4}
  items={[
    { label: "Categoria", value: "Rede e VPN" },
    { label: "Prioridade", value: <StatusLabel tone="danger" size="md" text="plain">Alta</StatusLabel> },
  ]}
/>
```

### Profile, inside a card
```tsx
<Box surface="canvas" border="line-soft" radius="xl" shadow="card" clip>
  <DescriptionList layout="rows" items={[{ label: "E-mail", value: user.email, aside: "Gerenciado pela TI" }]} />
</Box>
```

## Extending

Labels must be unique in a list (they are keys). A new layout is a new branch of `layout`.
