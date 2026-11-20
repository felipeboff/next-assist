# ConsoleLayout

Page shell of the analyst console: an icon rail, a list column, the open item in the middle and
an optional side panel, all at full screen height. For employee pages use
[sidebar-layout](sidebar-layout.md). Atomic level: template.

```tsx
import { ConsoleLayout } from '@/shared/presentation/ui';
```

## Variations

| Prop | Values | Default | Effect |
| --- | --- | --- | --- |
| `rail` | ReactNode | required | 64px column on the far left (logo, rail `IconButton`s, account `Menu`), subtle surface |
| `list` | ReactNode | required | 380px column, rendered in a `<section>` |
| `listLabel` | string | required | Accessible name of the list section |
| `children` | ReactNode | required | The open item, in `<main>` (muted surface), filling the space left |
| `panel` | ReactNode | none | 340px `<aside>` on the right; left out when absent |
| `panelLabel` | string | none | Accessible name of the panel |

## States

Owns no state. Each column brings its own loading, empty and error looks (see
[patterns](../patterns.md#work-console)).

## Accessibility

Landmarks: a named region for the list, `main` for the item, a named `complementary` for the
panel. Columns scroll on their own through [scroll-area](scroll-area.md).

## Examples

```tsx
<ConsoleLayout rail={rail} list={list} listLabel="Conversas" panel={panel} panelLabel="Chamados do colaborador">
  {thread}
</ConsoleLayout>
```

## Extending

Widths are fixed to the prototype (desktop only). A responsive version would hide the panel and
the list below a breakpoint; add it as a prop, not per screen.
