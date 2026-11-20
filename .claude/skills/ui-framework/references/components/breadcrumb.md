# Breadcrumb

Where the page sits, from the root to the current page, for the [top-bar](top-bar.md) of the
sidebar layout. It shows the path, it does not navigate (items are plain text).
Atomic level: molecule.

```tsx
import { Breadcrumb } from '@/shared/presentation/ui';
```

## Variations

| Prop | Values | Default | Effect |
| --- | --- | --- | --- |
| `items` | `readonly string[]` | required | Root first; the last item is the current page (medium, body color), the others muted |

## States

None. A single item renders without separators.

## Accessibility

Renders `<nav aria-label="Caminho">` with an `<ol>`; the last item carries
`aria-current="page"`. The chevrons between items are hidden list items.

## Examples

### Page header
```tsx
<TopBar start={<Breadcrumb items={["Nexo Assist", "Meu perfil"]} />} />
```

## Extending

Items are strings because nothing links yet. When a level needs to link, accept
`{ label, href }` items and render [link](link.md) for all but the last one.
