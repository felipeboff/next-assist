# TopBar

The 64px bar on top of a page in the [sidebar-layout](sidebar-layout.md): where you are on the
start, the page's status on the end. Atomic level: organism.

```tsx
import { TopBar } from '@/shared/presentation/ui';
```

## Variations

| Prop | Values | Default | Effect |
| --- | --- | --- | --- |
| `start` | ReactNode | required | Left side (a [breadcrumb](breadcrumb.md)) |
| `end` | ReactNode | none | Right side, in a row with a 12px gap (a [tag](tag.md), actions) |

## States

None; pass the status as `end`.

## Accessibility

Renders `<header>`: the page's `banner` landmark. Keep the page `h1` in the content, not here.

## Examples

```tsx
<TopBar
  start={<Breadcrumb items={["Nexo Assist", "Atendimento"]} />}
  end={<Tag tone="success" size="md" dot="success">Assistente online</Tag>}
/>
```

## Extending

Height and padding match the sidebar brand row; change them together.
