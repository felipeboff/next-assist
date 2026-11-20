# SearchField

A rounded, filled search input with its magnifier, for filtering a list or a thread. For a form
field use [text-field](text-field.md). Client component. Atomic level: molecule.

```tsx
import { SearchField } from '@/shared/presentation/ui';
```

## Variations

| Prop | Values | Default | Effect |
| --- | --- | --- | --- |
| `label` | string | required | Accessible name (visually hidden; show the same idea in `placeholder`) |
| `placeholder` | string | none | Shown while empty |
| `value` / `onChange` | string / `(value) => void` | required | Controlled text |
| `onKeyDown` | handler | none | E.g. Escape closes an inline search |
| `autoFocus` | boolean | none | Focus on mount (search opened from a button) |
| `size` | `sm` (32px), `md` (36px) | `md` | Height |

## States

Focus: a soft primary ring. No error state (a search has no wrong input); the empty result is
an [empty-state](empty-state.md) in the list.

## Accessibility

`<input type="search">` (role `searchbox`) with a hidden `<label>`; the native clear button is
hidden for a consistent look.

## Examples

```tsx
<SearchField label="Buscar conversas" placeholder="Buscar conversas" value={search} onChange={setSearch} />
<SearchField label="Buscar na conversa" size="sm" autoFocus value={term} onChange={setTerm} onKeyDown={closeOnEscape} />
```

## Extending

Filtering is the caller's job; debounce in the screen if a search ever hits the server.
