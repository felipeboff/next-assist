# NavList

The app's main navigation, in the sidebar: a column of links with icons; the link of the current
route is marked. Server-safe: only its internal `NavLink` items are client components (they read
`usePathname` from `next/navigation`). Atomic level: molecule.

```tsx
import { NavList, type NavItem } from '@/shared/presentation/ui';
```

## Variations

| Prop | Values | Default | Effect |
| --- | --- | --- | --- |
| `label` | string | required | Names the `<nav>` |
| `items` | `readonly { href: string; label: string; icon: LucideIcon }[]` | required | One link each, in order; `href` is also the key |

## States

The item whose `href` equals the current pathname gets the primary soft fill and
`aria-current="page"`; the others are secondary text with a subtle hover.

## Accessibility

`<nav aria-label>` with a `<ul>` of Next.js links; the current one carries `aria-current`.
Matching is exact (`/perfil` does not mark `/`).

## Examples

```tsx
<NavList
  label="Navegação principal"
  items={[
    { href: "/", label: "Atendimento", icon: MessageSquare },
    { href: "/perfil", label: "Meu perfil", icon: UserRound },
  ]}
/>
```

## Extending

`NavLink` is internal (not exported). Prefix matching for nested routes would be a per-item
option (`match: "exact" | "prefix"`). Specs mock `next/navigation`.
