# SplitLayout

Page shell with a dark brand aside (55% of the width) and a white main column with header,
centered content and footer. Used by the login screen.
Atomic level: template.

```tsx
import { SplitLayout } from '@/shared/presentation/ui';
```

## Variations

| Prop | Values | Default | Effect |
| --- | --- | --- | --- |
| `aside` | ReactNode | required | Content of the ink aside (hidden below `lg`) |
| `asideLabel` | string | required | Accessible name of the aside |
| `brand` | ReactNode | none | Shown at the start of the header only below `lg`, where the aside is hidden |
| `header` | ReactNode | none | Top of the main column, right-aligned on desktop |
| `footer` | ReactNode | none | Bottom of the main column |
| `children` | ReactNode | required | Rendered in `<main>`, centered slightly above the middle (optical center) |

## States

Owns no state. The aside disappears below `lg`; pass `brand` so small screens still show the logo.

## Examples

```tsx
<SplitLayout aside={<LoginShowcase />} asideLabel="Sobre o Nexo Assist" brand={<Brand />} header={…} footer={…}>
  <Box width="form"><LoginForm /></Box>
</SplitLayout>
```
