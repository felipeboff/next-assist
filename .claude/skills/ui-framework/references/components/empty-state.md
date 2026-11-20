# EmptyState

Nothing to show in a region yet, and what to do about it: an empty chat, a filter with no
results, no conversation open. For loading use [loading-state](loading-state.md); for a failure
use [alert](alert.md). Atomic level: molecule.

```tsx
import { EmptyState } from '@/shared/presentation/ui';
```

## Variations

| Prop | Values | Default | Effect |
| --- | --- | --- | --- |
| `title` | string | required | Medium text, body color |
| `icon` | Lucide glyph | none | In a 44px subtle circle above the title |
| `description` | ReactNode | none | Muted text under the title |
| `children` | ReactNode | none | A way forward under the text: suggestions, a button |

## States

It is itself a state. It grows (`flex: 1`) and centers its content in the space it gets.

## Accessibility

Plain text; give the title the words a screen reader user needs ("Nenhuma conversa neste
filtro"), the icon is decorative.

## Examples

### An empty chat with suggestions
```tsx
<EmptyState icon={MessageSquareText} title="Olá, Ana!" description="Conte o que está acontecendo.">
  <Stack direction="row" gap="sm" wrap justify="center">
    <Button variant="secondary" onClick={() => send("Minha VPN não conecta")}>Minha VPN não conecta</Button>
  </Stack>
</EmptyState>
```

### No results
```tsx
<EmptyState title={`Nada encontrado para "${search}"`} />
```

## Extending

The title is a paragraph, not a heading; if an empty state ever needs to sit in the outline,
add a `titleLevel` prop that renders [heading](heading.md).
