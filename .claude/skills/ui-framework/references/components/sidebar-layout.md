# SidebarLayout

App shell with a fixed left sidebar (brand, navigation, signed-in footer); the page fills the
rest of the screen and scrolls itself. Used by the employee pages. For the analyst console use
[console-layout](console-layout.md). Atomic level: template.

```tsx
import { SidebarLayout } from '@/shared/presentation/ui';
```

## Variations

| Prop | Values | Default | Effect |
| --- | --- | --- | --- |
| `brand` | ReactNode | required | Top of the sidebar |
| `nav` | ReactNode | required | Middle of the sidebar, grows (a [nav-list](nav-list.md)) |
| `footer` | ReactNode | none | Bottom of the sidebar above a divider: who is signed in, sign out |
| `children` | ReactNode | required | The page: a flex column at full height ([top-bar](top-bar.md) + [scroll-area](scroll-area.md)) |

## States

Owns no state. A footer that waits for the session can be wrapped in `Suspense` so the shell
renders at once.

## Accessibility

The sidebar is an `<aside>`; the page brings its own `header` and content. Render it from a
route group `layout.tsx` so it survives navigation between its pages.

## Examples

```tsx
<SidebarLayout
  brand={<Brand />}
  nav={<NavList label="Navegação principal" items={employeeNav} />}
  footer={<Suspense fallback={null}><SignedInEmployee /></Suspense>}
>
  {children}
</SidebarLayout>
```

## Extending

The sidebar is 232px and always visible (desktop). Collapsing it on small screens would be a
prop of this template.
