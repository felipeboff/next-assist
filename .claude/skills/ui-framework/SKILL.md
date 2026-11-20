---
name: ui-framework
description: Living documentation of this app's own UI framework (src/shared/presentation/ui) - which component to pick, its variations and props, how to build screens with it, and how to extend it when something is missing. Use whenever a task builds or changes a screen, page, layout, form, field, list, card, dialog, chat bubble, badge, feedback (toast, confirm, empty, loading, error state) or the theme, or when the user says "which component", "build a screen", "add a form", "new component", "componente", "tela", "formulário", "botão", "variante", "tema", "como uso o". Do NOT use for domain, database, agent or API route code.
metadata:
  author: Felipe Boff
  version: 0.1.0
---

# UI framework

`src/shared/presentation/ui` is the app's own component library, built in the spirit of atomic design:
foundations (tokens) feed atoms, atoms compose into molecules, molecules into organisms, and
templates give pages their shell. Screens are built **only** from what `@/shared/presentation/ui` exports and
are styled **only** through props.

This file is a **living document**. It starts almost empty and grows with the app: every
component that enters the framework enters the index below in the same change. There is no other
documentation site; this skill is it.

## Rules

1. **Import from the barrel.** `import { Button, Stack, Text } from '@/shared/presentation/ui';`. Never deep-import
   a component's internal file.
2. **No styling outside the framework.** In `src/app` and `src/modules` there is no `className`,
   no `style`, and no raw layout or text elements (`div`, `span`, `section`, `p`, `h1`-`h6`, `ul`,
   `button`, `input`...). Only `src/shared/presentation/ui` touches HTML elements and Tailwind classes. The
   one exception is what Next.js requires of the root layout (`<html>`, `<body>`). ESLint
   enforces this (see Enforcement).
3. **Looks come from props.** `variant`, `tone`, `size`, `align`, `gap`, `padding`... Colors and
   spacing are token names (`primary`, `danger`, `muted`; `xs`-`xl`), never hex values, pixel
   values or Tailwind classes passed through.
4. **Semantics come from props too.** The framework renders the right element: `Heading level={2}`,
   `Stack as="nav"`, `Box as="section"`. A screen never writes the element to get the meaning.
5. **Generic in the framework, domain in the module.** `src/shared/presentation/ui` knows nothing about tickets,
   conversations or employees. A component that does (a ticket card, a decision-trace panel) lives
   in its module (`src/modules/<context>/presentation/components/`) and obeys rule 2: it composes framework components
   only.
6. **Reuse first, then extend, then create.** Before writing UI, find the component in the index.
   If one almost fits, add the prop or variant to it. Create a new component only when nothing
   fits, and never build a look-alike inside a screen.
7. **Server-safe by default.** Framework components render on the server unless they need
   interaction; an interactive one carries `'use client'` in its own file, so screens never need
   to think about it.
8. **States are part of the component.** Anything that loads data or acts has its loading,
   empty, disabled and error looks in the framework (`loading`, `disabled`, `status` props;
   `Skeleton`, `Empty`, `ErrorState`-style components), not improvised per screen.
9. **Accessible by construction.** Labels, focus rings, keyboard handling and ARIA live inside the
   component. Icon-only actions require an accessible label prop.

## Living-document protocol

Every change that touches the framework updates this skill in the same change:

1. **New component**: create `references/components/<kebab-name>.md` from
   [the template](references/components/_template.md), and add a row to the right table in the
   Index (component, use it for, doc link).
2. **New or changed prop/variant**: update the component's doc (variations table and an example).
3. **New token or theme change**: update [foundations.md](references/foundations.md).
4. **A recurring screen composition** (used on two or more screens): add a recipe to
   [patterns.md](references/patterns.md).
5. **Promotion**: when a piece of a module's UI turns out to be generic, move it to
   `src/shared/presentation/ui`, strip the domain out of its props, and document it here.

A component without a doc row is not part of the framework yet: finish the doc before using it in
a second place.

Every component ships a colocated `<name>.spec.tsx` (Testing Library: roles, accessible names,
interaction, the element rendered, and the classes a prop promises). `src/shared/presentation` is in
the unit coverage scope with a 100% floor, so a new prop or branch without a test fails
`pnpm test:unit:coverage` and the pre-push hook.

## Procedure

1. Look the component up in the Index and open its doc: variations, main props, examples.
2. For colors, spacing, radius, typography, breakpoints and theme read
   [foundations.md](references/foundations.md).
3. For whole screens (chat, analyst console, forms, lists) read
   [patterns.md](references/patterns.md).
4. Missing something? Rule 6, then the protocol above.

The visual source of truth is the Pencil prototype from the PRD (Annex C). Tokens and component
looks are taken from it; see the project override in `frontend-design`.

## Index

Every exported component of `@/shared/presentation/ui`. Add a row in the same change that adds a component.

### Layout

| Component | Use it for | Doc |
| --- | --- | --- |
| Box | A surface: background, border, radius, padding, width; semantic element via `as` | [box](references/components/box.md) |
| Stack | Rows and columns with gap, alignment and wrap | [stack](references/components/stack.md) |
| Divider | A 1px line between blocks, horizontal or vertical | [divider](references/components/divider.md) |

### Atoms

| Component | Use it for | Doc |
| --- | --- | --- |
| Text | Paragraphs, labels, captions and inline runs | [text](references/components/text.md) |
| Heading | Titles (`h1`-`h6`), display serif or sans | [heading](references/components/heading.md) |
| Link | Navigation (app routes, `tel:`, external) | [link](references/components/link.md) |
| Button | Actions: `primary`, `secondary`, `ghost`, `link`; loading state | [button](references/components/button.md) |
| Icon | A Lucide glyph sized and colored by tokens | [icon](references/components/icon.md) |
| Spinner | Indeterminate loading | [spinner](references/components/spinner.md) |
| PageLoading | Full-screen loading state with a visible label (route fallbacks) | [page-loading](references/components/page-loading.md) |
| Checkbox | A labeled on/off choice | [checkbox](references/components/checkbox.md) |
| StatusDot | A colored dot for state | [status-dot](references/components/status-dot.md) |
| Tag | A pill with optional status dot | [tag](references/components/tag.md) |
| Brand | The Nexo Assist logo or mark | [brand](references/components/brand.md) |

### Molecules

| Component | Use it for | Doc |
| --- | --- | --- |
| TextField | Labeled input with icon, label action, hint and error | [text-field](references/components/text-field.md) |
| PasswordField | TextField for passwords with show/hide | [password-field](references/components/password-field.md) |
| Form | `<form>` with our validation, column layout and busy state | [form](references/components/form.md) |
| Alert | Inline message for a form or section (`danger`, `info`) | [alert](references/components/alert.md) |
| MessageBubble | One chat message, user or assistant, light or inverse | [message-bubble](references/components/message-bubble.md) |
| Stat / StatGroup | Big numbers with labels in separated columns | [stat](references/components/stat.md) |

### Organisms

| Component | Use it for | Doc |
| --- | --- | --- |
| - | - | - |

### Templates (page shells)

| Component | Use it for | Doc |
| --- | --- | --- |
| SplitLayout | Ink brand aside + main column with header, centered content, footer (login) | [split-layout](references/components/split-layout.md) |

## Enforcement

`eslint.config.mjs` turns rules 1 and 2 into errors for `src/app/**/*.tsx` and
`src/modules/**/*.tsx` (except the root layout): no lowercase JSX elements, no `className` or
`style`, no deep imports from `@/shared/presentation/ui/*`. Inside `src/shared/presentation/ui`, variants are built with
`tailwind-variants/lite` (no class merging): a CSS property is set either in the base or in a
variant, never both.
