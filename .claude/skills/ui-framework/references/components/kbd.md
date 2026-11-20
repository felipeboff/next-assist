# Kbd

A keyboard shortcut shown inside or beside a control ("Ctrl ↵", "Esc"). Atomic level: atom.

```tsx
import { Kbd } from '@/shared/presentation/ui';
```

## Variations

| Prop | Values | Default | Effect |
| --- | --- | --- | --- |
| `tone` | `default`, `on-primary` | `default` | `default`: bordered subtle key. `on-primary`: translucent white, inside a primary button |
| `label` | string | none | How the shortcut is read out when the glyphs say it poorly ("Control+Enter") |
| `children` | ReactNode | required | The glyphs |

## States

None.

## Accessibility

Renders `<kbd>`. Pair it with `aria-keyshortcuts` on the control it triggers, so the shortcut
is announced with the control.

## Examples

```tsx
<Button aria-keyshortcuts="Control+Enter" onClick={confirm}>
  Confirmar
  <Kbd tone="on-primary" label="Control+Enter">Ctrl ↵</Kbd>
</Button>
```

## Extending

A new tone is one entry in `toneClass`.
