# Screen patterns

Recipes for whole screens, composed only from framework components. A composition earns a recipe
here once it appears on two or more screens.

Each recipe: when to use it, the composition (a short TSX example), and its loading, empty and
error states.

## Sidebar app page

**When:** an employee page inside the app shell: the chat (`chat-screen.tsx`) and the profile
(`profile-screen.tsx`). The shell is [sidebar-layout](components/sidebar-layout.md), rendered
once by the route group layout (`src/app/(protected)/(employee)/layout.tsx`); the screen
renders only what goes in it: a [top-bar](components/top-bar.md) with a
[breadcrumb](components/breadcrumb.md), then a [scroll-area](components/scroll-area.md) that
holds a centered column.

```tsx
// layout.tsx (route group)
<SidebarLayout brand={<Brand />} nav={<NavList label="Navegação principal" items={nav} />} footer={footer}>
  {children}
</SidebarLayout>

// the screen
<>
  <TopBar start={<Breadcrumb items={["Nexo Assist", "Meu perfil"]} />} end={status} />
  <ScrollArea label="Conversa" followEnd={entries.length}>
    <Box width="page" centered paddingY="5xl">   {/* `thread` for a chat */}
      <Stack gap="3xl">
        <Heading level={1} size="page">Meu perfil</Heading>
        <Box surface="canvas" border="line-soft" radius="xl" shadow="card" clip>…</Box>
      </Stack>
    </Box>
  </ScrollArea>
  {/* a chat adds a footer column outside the scroll: */}
  <Box width="thread" centered paddingY="lg"><Composer … /></Box>
</>
```

- **Loading:** `LoadingState` in place of the scroll area (the top bar stays).
- **Empty:** `EmptyState` inside the column (the chat greets with suggestion buttons).
- **Error:** `Alert` in the same centered column; a failed send shows inline under its bubble
  with a retry `Button variant="link"`.

## Work console

**When:** the analyst console (`console-screen.tsx`): pick an item from a filtered list, work on
it in the middle, see its context on the side. The shell is
[console-layout](components/console-layout.md).

```tsx
<ConsoleLayout
  rail={<><Brand variant="mark" /><IconButton variant="tile" size="lg" current … /><Stack grow /><Menu trigger={<Avatar … />} placement="right-end" … /></>}
  list={
    <>
      <Box paddingX="lg" paddingY="lg">
        <Stack gap="md">
          <Heading level={1} size="section">Conversas</Heading>
          <SearchField label="Buscar conversas" value={search} onChange={setSearch} />
          <FilterChips label="Filtros" options={filters} value={filter} onChange={setFilter} />
        </Stack>
      </Box>
      <ScrollArea label="Lista de conversas">
        {items.map((item) => (
          <SelectableRow key={item.id} selected={item.id === selectedId} onSelect={() => open(item.id)}>…</SelectableRow>
        ))}
      </ScrollArea>
    </>
  }
  listLabel="Conversas"
  panel={panelOpen ? <ItemPanel … /> : null}
  panelLabel="Chamados do colaborador"
>
  <Box surface="canvas" paddingX="xl" paddingY="md">{/* header: Avatar, name, Tag, actions, Menu */}</Box>
  <ScrollArea label="Conversa" followEnd={entries.length}>{/* thread: MessageBubble, EventDivider */}</ScrollArea>
  <Box surface="canvas" paddingX="xl" paddingY="lg">{/* footer: notice + Buttons, or Composer variant="round" */}</Box>
  <ConfirmDialog open={confirming} … />
</ConsoleLayout>
```

- **Loading:** `LoadingState` in the list column and, separately, in the main area while the
  thread loads; the search and filters stay usable.
- **Empty:** `EmptyState` in the list (no results for the search, empty filter) and in the main
  area when nothing is selected.
- **Error:** `Alert` above the list when it fails to load; `Alert` above the footer when an
  action (take over, hand back, close, reply) fails, leaving the thread in place. Destructive
  actions go through `ConfirmDialog` with `busy` while they run.

## Candidates

Compositions not yet repeated on a second screen, from the PRD screens:

- Login (Screen 1): `SplitLayout` with the brand showcase and a form column.
- Agent reply in the chat: action chips above the reply with their `Disclosure` detail,
  `ChoiceChips` for questions, ticket cards with `DescriptionList` (Screens 2 and 3).
