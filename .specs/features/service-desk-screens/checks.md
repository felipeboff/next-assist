# Service desk screens with mocks - checks

Mutations: 3
Build: `pnpm typecheck`; `pnpm lint`
Plan: `.specs/features/service-desk-screens/plan.md`

75 checks in 7 slices · 3 one-way doors · 0 open

## Checks

### S1 - An employee opens a ticket by talking

**C1** - After signing in, an employee sees `/` with the sidebar ("Atendimento" active, "Meu perfil", initials, name, e-mail, "Sair"), "Service desk de TI > Atendimento" and "Assistente online" (AC 1)
Proof: `pnpm exec playwright test e2e/chat.spec.ts -g "lands on the chat with the sidebar"`

**C2** - An empty conversation greets the employee by first name with the two suggestions, and using one sends its text (AC 2)
Proof: `pnpm exec playwright test e2e/chat.spec.ts -g "greets and sends a suggestion"`

**C3** - Sending shows the dark bubble, clears the field, shows "Nexo Assist está digitando…" until the reply and raises the counter by 1 (AC 3)
Proof: `pnpm exec playwright test e2e/chat.spec.ts -g "shows the bubble, the typing state and the counter"`

**C4** - A field holding only blanks keeps "Enviar" disabled (AC 4)
Proof: `pnpm exec playwright test e2e/chat.spec.ts -g "blank message keeps Enviar disabled"`

**C5** - A first message about VPN or error 809 gets the two actions, the help-center text and "Quem está sendo afetado?" with its 4 options (AC 5)
Proof: `pnpm exec vitest run src/modules/conversations/infrastructure/scripted-agent.integration.spec.ts -t "VPN message gets the help-center reply and the affected question"`

**C6** - Using a quick option sends its label, marks it chosen and disables the other options (AC 6)
Proof: `pnpm exec playwright test e2e/chat.spec.ts -g "quick option is sent, marked and the others disabled"`

**C7** - A typed answer counts as the option whose label starts it, ignoring case and accents, else "Não sei", for the 5 examples (AC 7)
Proof: `pnpm exec vitest run src/modules/conversations/domain/quick-answer.spec.ts -t "matchOption"`

**C8** - The draft state matches `.specs/features/service-desk-screens/captures/chat-new-ticket.png` (AC 8)
Proof: browser - reach the state, save `captures/chat-new-ticket.running.png`

**C9** - Answering who is affected gets the actions "classificou a prioridade", "consultou o SLA", "montou o rascunho" and a draft "Rascunho D-NNN" in "Rede e VPN" awaiting confirmation with its deadline (AC 8)
Proof: `pnpm exec vitest run src/modules/conversations/infrastructure/scripted-agent.integration.spec.ts -t "answer about who is affected gets the draft"`

**C10** - The draft's priority and affected people follow the answer, for all 4 options (AC 9)
Proof: `pnpm exec vitest run src/modules/conversations/infrastructure/scripted-agent.integration.spec.ts -t "draft priority and affected people follow the answer"`

**C11** - The response deadline follows Annex A on the business calendar, for the 6 examples (AC 10)
Proof: `pnpm exec vitest run src/modules/tickets/domain/sla.spec.ts -t "responseDeadline"`

**C12** - "Confirmar" creates an INC ticket in the simulated service, shows the card as created with its code and "Aguardando analista", removes the buttons and replies with "criou o chamado" (AC 11)
Proof: `pnpm exec playwright test e2e/chat.spec.ts -g "Confirmar creates the ticket"`
Proof: `pnpm exec vitest run src/modules/conversations/infrastructure/scripted-agent.integration.spec.ts -t "confirming a draft creates an INC ticket"`

**C13** - Ctrl+Enter confirms a draft awaiting confirmation (AC 11)
Proof: `pnpm exec playwright test e2e/chat.spec.ts -g "Ctrl\+Enter confirms the pending draft"`

**C14** - "Editar" turns title and description into fields; "Salvar" keeps the edited text, "Descartar alterações" restores it (AC 12)
Proof: `pnpm exec playwright test e2e/chat.spec.ts -g "Editar changes the title and the description"`

**C15** - A blank edited title shows "Informe um título." and keeps the draft in edition (AC 13)
Proof: `pnpm exec vitest run src/modules/conversations/domain/ticket-draft.spec.ts -t "validateDraftEdit"`
Proof: `pnpm exec playwright test e2e/chat.spec.ts -g "blank edited title"`

**C16** - "Cancelar" shows the draft as "Cancelado" without buttons, creates no ticket and replies "Tudo bem, não abri o chamado. Se precisar, é só me chamar." (AC 14)
Proof: `pnpm exec playwright test e2e/chat.spec.ts -g "Cancelar drops the draft"`
Proof: `pnpm exec vitest run src/modules/conversations/infrastructure/scripted-agent.integration.spec.ts -t "cancelling a draft creates no ticket"`

**C17** - An unscripted first message gets the demo reply with the two suggestions as quick options (AC 15)
Proof: `pnpm exec vitest run src/modules/conversations/infrastructure/scripted-agent.integration.spec.ts -t "unscripted first message gets the demo reply"`

**C18** - Confirming the same draft twice creates one ticket; a created or cancelled draft cannot be confirmed, cancelled or edited again (AC 11, AC 14)
Proof: `pnpm exec vitest run src/modules/conversations/infrastructure/scripted-agent.integration.spec.ts -t "settled draft rejects a second decision"`

### S2 - An employee looks a ticket up and asks for an analyst

**C19** - A status question replies "consultou seus chamados", "Você tem 3 chamados abertos. Sobre qual deles quer saber?" and lists each open ticket's code, title, status and opening date (AC 16)
Proof: `pnpm exec vitest run src/modules/conversations/infrastructure/scripted-agent.integration.spec.ts -t "status question lists the employee's open tickets"`

**C20** - The lookup lists only the asker's tickets: Ana gets her 3, Bruno gets none of Ana's, Bruno with no open ticket gets "Você não tem chamados abertos agora." (AC 17)
Proof: `pnpm exec vitest run src/modules/conversations/infrastructure/scripted-agent.integration.spec.ts -t "lookup lists only the asker's tickets"`
Proof: `pnpm exec vitest run src/modules/tickets/infrastructure/in-memory-ticket-service.integration.spec.ts -t "only the requester's tickets"`

**C21** - The ticket state matches `.specs/features/service-desk-screens/captures/chat-status-transfer.png` (AC 18)
Proof: browser - reach the state, save `captures/chat-status-transfer.running.png`

**C22** - Picking a ticket marks its row, locks the list, sends "<code> · <title>" and replies "consultou o <code>", "calculou o prazo" and the ticket card (AC 18)
Proof: `pnpm exec playwright test e2e/chat.spec.ts -g "picking a ticket locks the list and shows its card"`

**C23** - A ticket is overdue when open and its last update plus its deadline is before now, for the 3 examples (AC 19)
Proof: `pnpm exec vitest run src/modules/tickets/domain/sla.spec.ts -t "isOverdue"`

**C24** - An overdue ticket shows "· prazo vencido" and the three options with the overdue text; one in time shows "· no prazo" and only two options (AC 20)
Proof: `pnpm exec vitest run src/modules/conversations/infrastructure/scripted-agent.integration.spec.ts -t "overdue ticket gets the analyst offer"`
Proof: `pnpm exec playwright test e2e/chat.spec.ts -g "picking a ticket locks the list and shows its card"`

**C25** - "Falar com um analista" replies with "transferiu para um analista" and the hand-over text, shows "Transferida para Suporte N2 · HH:MM" and changes the tag to "Aguardando atendente" (AC 21)
Proof: `pnpm exec playwright test e2e/chat.spec.ts -g "Falar com um analista transfers the conversation"`

**C26** - While waiting for an analyst, new messages show and count, no agent reply comes, and the notice shows above the field (AC 22)
Proof: `pnpm exec vitest run src/modules/conversations/infrastructure/scripted-agent.integration.spec.ts -t "agent stays silent while waiting for an analyst"`
Proof: `pnpm exec playwright test e2e/chat.spec.ts -g "Falar com um analista transfers the conversation"`

**C27** - "Adicionar informação" asks what to add, drafts "Atualizar chamado · <code>", and confirming adds the text to the ticket and replies "Pronto: acrescentei a informação ao <code>." (AC 23)
Proof: `pnpm exec vitest run src/modules/conversations/infrastructure/scripted-agent.integration.spec.ts -t "adding information drafts an update"`
Proof: `pnpm exec playwright test e2e/chat.spec.ts -g "Adicionar informação updates the ticket"`

**C28** - "Não, obrigado" replies "Combinado. Se precisar de algo, é só escrever." (AC 24)
Proof: `pnpm exec playwright test e2e/chat.spec.ts -g "Não, obrigado closes the topic"`

### S3 - Anyone can see why the agent did what it did

**C29** - The actions row expands "O que entendi", each action with its outcome, "Confiança" with its level and "Por quê", with `aria-expanded` true, and collapses on a second use (AC 25)
Proof: `pnpm exec playwright test e2e/chat.spec.ts -g "actions row expands the decision detail"`

**C30** - The confidence level is named from the rounded percentage: "alta" from 80%, "média" from 50%, "baixa" below, for the 7 examples (AC 26)
Proof: `pnpm exec vitest run src/modules/conversations/domain/agent-decision.spec.ts -t "confidenceLevel"`

**C31** - The "Nexo Assist IA" label of an agent message in the console expands the same detail (AC 27)
Proof: `pnpm exec playwright test e2e/console.spec.ts -g "Nexo Assist label expands the decision detail"`

### S4 - An analyst sees the conversations that need them

**C32** - The console matches `.specs/features/service-desk-screens/captures/console-transferred.png` (AC 28)
Proof: browser - reach the state, save `captures/console-transferred.running.png`

**C33** - An analyst lands on `/console` with "Todas" selected, the first conversation open and its employee's tickets panel (AC 28)
Proof: `pnpm exec playwright test e2e/console.spec.ts -g "lands on the console with Todas selected"`

**C34** - The list is ordered by group (needs a human, with the agent, resolved or closed) and by most recent activity inside a group (AC 29)
Proof: `pnpm exec vitest run src/modules/conversations/domain/console-list.spec.ts -t "orderConversations"`

**C35** - Each filter lists only its conversations: "Para você", "Com o agent", "Minhas", "Todas"; every filter but "Todas" shows its count (AC 30)
Proof: `pnpm exec vitest run src/modules/conversations/domain/console-list.spec.ts -t "filterConversations"`
Proof: `pnpm exec playwright test e2e/console.spec.ts -g "a filter lists its conversations"`

**C36** - The search lists, inside the active filter, conversations whose employee name or ticket code contains the text, ignoring case and accents, for the 5 examples (AC 31)
Proof: `pnpm exec vitest run src/modules/conversations/domain/console-list.spec.ts -t "searchConversations"`
Proof: `pnpm exec playwright test e2e/console.spec.ts -g "search narrows the list"`

**C37** - The list item's status line is derived for every status: transferred with code, transferred with contact time, agent asked for help, agent attending, you attending, another analyst attending, resolved, closed (AC 32)
Proof: `pnpm exec vitest run src/modules/conversations/domain/console-list.spec.ts -t "statusLineOf"`

**C38** - The activity time reads "agora", "HH:MM", "ontem" or "DD mmm" (AC 32)
Proof: `pnpm exec vitest run src/modules/conversations/domain/activity-time.spec.ts -t "activityTime"`

**C39** - Using a conversation in the list opens its header, history and the panel with that employee's tickets (AC 33)
Proof: `pnpm exec playwright test e2e/console.spec.ts -g "opening a conversation shows its history and the employee's tickets"`

**C40** - A waiting conversation's footer shows who waits, "Agent pausado · até HH:MM", "Devolver ao agent", "Assumir atendimento" and the disabled field (AC 34)
Proof: `pnpm exec playwright test e2e/console.spec.ts -g "lands on the console with Todas selected"`

**C41** - The panel shows the counts, "Desta conversa" and "Outros chamados" with open tickets first and closed ones newest first (AC 35)
Proof: `pnpm exec vitest run src/modules/tickets/domain/ticket.spec.ts -t "orderForPanel"`

**C42** - Using a ticket under "Outros chamados" expands its description, priority and deadline status in place (AC 35)
Proof: `pnpm exec playwright test e2e/console.spec.ts -g "a ticket under Outros chamados expands"`

**C43** - An employee with no ticket shows "<first name> não tem chamados." and no "Desta conversa" (AC 36)
Proof: `pnpm exec playwright test e2e/console.spec.ts -g "employee without tickets"`

**C44** - The panel's close button hides it and "Mostrar chamados de <first name>" in the ⋮ menu shows it again (AC 37)
Proof: `pnpm exec playwright test e2e/console.spec.ts -g "panel closes and the menu shows it again"`

**C45** - The conversation search lists only matching messages with "N mensagens", and Escape restores the history (AC 38)
Proof: `pnpm exec playwright test e2e/console.spec.ts -g "conversation search shows only matching messages"`

### S5 - An analyst takes over, replies, hands back and closes

**C46** - The attended conversation matches `.specs/features/service-desk-screens/captures/console-assumed.png` (AC 39)
Proof: browser - reach the state, save `captures/console-assumed.running.png`

**C47** - "Assumir atendimento" adds the take-over event, shows "Devolver ao agent" and "Encerrar atendimento", enables the field, shows "Você está atendendo" with no unread, shows the ticket "Em atendimento" with "Assumido por" and moves the conversation from "Para você" to "Minhas" (AC 39)
Proof: `pnpm exec playwright test e2e/console.spec.ts -g "taking over pauses the agent"`

**C48** - The analyst's message shows as their bubble with "Suporte N2", Enter sends and a blank message is not sent (AC 40)
Proof: `pnpm exec playwright test e2e/console.spec.ts -g "analyst reply shows as their bubble"`

**C49** - A sample conversation's scripted employee answer arrives 2 seconds after the analyst's first message, and only once (AC 41)
Proof: `pnpm exec vitest run src/modules/conversations/infrastructure/in-memory-analyst-console.integration.spec.ts -t "scripted employee answer"`

**C50** - "Devolver ao agent" adds the hand-back event (with or without a take-over), sets "Agent atendendo" and shows the agent footer with "Assumir atendimento" and the field disabled (AC 42)
Proof: `pnpm exec playwright test e2e/console.spec.ts -g "handing back returns the conversation to the agent"`
Proof: `pnpm exec vitest run src/modules/conversations/infrastructure/in-memory-analyst-console.integration.spec.ts -t "hand back"`

**C51** - "Encerrar atendimento" asks for confirmation; "Cancelar" changes nothing; "Encerrar" adds the close event, sets "Encerrada" and shows "Atendimento encerrado." (AC 43)
Proof: `pnpm exec playwright test e2e/console.spec.ts -g "closing asks for confirmation"`

**C52** - A resolved or closed conversation shows "Atendimento encerrado." with no action (AC 44)
Proof: `pnpm exec playwright test e2e/console.spec.ts -g "resolved conversation shows no action"`

**C53** - Only the valid hand-over transitions happen: take over from waiting or with the agent, hand back from waiting or with an analyst, close only by the attending analyst; anything else is rejected (AC 39, AC 42, AC 43)
Proof: `pnpm exec vitest run src/modules/conversations/domain/handoff.spec.ts -t "handoff transitions"`

**C54** - The rail shows the brand, "Conversas" with the waiting count and the initials; the initials open name, e-mail and "Sair", and "Sair" goes to `/login` (AC 45)
Proof: `pnpm exec playwright test e2e/console.spec.ts -g "rail shows the waiting count and the avatar menu signs out"`

### S6 - An employee sees their profile

**C55** - The profile matches `.specs/features/service-desk-screens/captures/profile.png` (AC 46)
Proof: browser - reach the state, save `captures/profile.running.png`

**C56** - "Meu perfil" shows `/perfil` with the employee's name, e-mail, "Gerenciado pela TI", the password age and the reset notice (AC 46)
Proof: `pnpm exec playwright test e2e/profile.spec.ts -g "Meu perfil shows the employee's data"`

**C57** - The password age reads "Alterada hoje", "Alterada há 1 dia", "Alterada há 42 dias" (AC 47)
Proof: `pnpm exec vitest run src/modules/identity/domain/password-age.spec.ts -t "passwordAge"`

**C58** - The password age comes from the credential's last update (AC 47)
Proof: `pnpm exec vitest run src/modules/identity/infrastructure/drizzle-credential-reader.integration.spec.ts -t "credential's last update"`

**C59** - "Redefinir senha" loads, then reads "Enviamos um link de redefinição para <e-mail>." with "Reenviar link" (AC 48)
Proof: `pnpm exec playwright test e2e/profile.spec.ts -g "Redefinir senha confirms the link was sent"`

**C60** - A failed reset shows "Não foi possível enviar o link agora. Tente de novo em instantes." and enables the button again (AC 49)
Proof: `pnpm exec vitest run src/modules/identity/presentation/components/password-card.spec.tsx -t "failed reset"`

### S7 - Roles, limits and states

**C61** - An analyst opening `/` or `/perfil` goes to `/console`; an employee opening `/console` goes to `/`; without a session `/perfil` and `/console` go to `/login` (AC 50)
Proof: `pnpm exec playwright test e2e/roles.spec.ts -g "each role is sent to its home"`

**C62** - The message limit allows the 30th message and no more: 29 sent leaves the field enabled, 30 disables it (AC 51)
Proof: `pnpm exec vitest run src/modules/conversations/domain/message-limit.spec.ts -t "message limit"`
Proof: `pnpm exec vitest run src/modules/conversations/presentation/screens/chat-screen.spec.tsx -t "limit of 30 messages"`

**C63** - The chat gateway rejects a message past the limit even when the field is bypassed (AC 51)
Proof: `pnpm exec vitest run src/modules/conversations/infrastructure/scripted-agent.integration.spec.ts -t "rejects a message past the limit"`

**C64** - A failed send shows "Não foi possível enviar." with "Tentar de novo", is not counted, and the retry resends without a second bubble (AC 52)
Proof: `pnpm exec vitest run src/modules/conversations/presentation/screens/chat-screen.spec.tsx -t "failed send"`

**C65** - A failed console action shows "Não foi possível <action> agora. Tente de novo." and keeps the conversation as it was (AC 53)
Proof: `pnpm exec vitest run src/modules/conversations/presentation/screens/console-screen.spec.tsx -t "failed take-over"`

**C66** - The chat, the conversation list and the tickets panel show their loading labels while they load (AC 54)
Proof: `pnpm exec vitest run src/modules/conversations/presentation/screens/chat-screen.spec.tsx -t "loading"`
Proof: `pnpm exec vitest run src/modules/conversations/presentation/screens/console-screen.spec.tsx -t "loading"`

**C67** - An empty filter shows "Nenhuma conversa aqui." and no open conversation shows "Selecione uma conversa para ver o histórico." (AC 55)
Proof: `pnpm exec playwright test e2e/console.spec.ts -g "empty filter"`
Proof: `pnpm exec vitest run src/modules/conversations/presentation/screens/console-screen.spec.tsx -t "no conversation"`

**C68** - Reloading starts again from the sample data in the chat and in the console (AC 56)
Proof: `pnpm exec playwright test e2e/chat.spec.ts -g "reload starts again"`
Proof: `pnpm exec playwright test e2e/console.spec.ts -g "reload starts again"`

**C70** - Opening `/` without a session goes to `/login` (existing guard, Surface) (AC 50)
Proof: `pnpm exec playwright test e2e/login.spec.ts -g "redirects to the login page when there is no session"`

**C69** - Signing in as a seeded employee lands on the chat, and "Sair" in the sidebar signs out (changed claim of the login journey) (AC 1)
Proof: `pnpm exec playwright test e2e/login.spec.ts -g "signs a seeded employee in with any password and signs out again"`

### Appended by the Verifier's round 1

**C71** - The chat gateway keeps a message whose reply failed out of the conversation: not counted, and the retry leaves one bubble; a failed quick answer or ticket pick is rolled back too (AC 52)
Proof: `pnpm exec vitest run src/modules/conversations/infrastructure/scripted-agent.integration.spec.ts -t "keeps a message whose reply failed out of the conversation"`
Proof: `pnpm exec vitest run src/modules/conversations/infrastructure/scripted-agent.integration.spec.ts -t "rolls back a quick answer and a ticket pick"`

**C72** - A ticket system failure during a take-over leaves the conversation waiting with its history unchanged, and the retry takes it over (AC 53)
Proof: `pnpm exec vitest run src/modules/conversations/infrastructure/in-memory-analyst-console.integration.spec.ts -t "leaves the conversation waiting when the ticket system fails"`

**C73** - The ticket desk `main/` adapts serves only the requester's open tickets with the SLA deadline and overdue from the ticket rules, gives drafts the Annex A deadline (Alta from Fri 22:00 → Mon 12:00), creates, notes and starts the service (door 1, AC 10, AC 17)
Proof: `pnpm exec vitest run src/main/ticket-desk.integration.spec.ts -t "ticket desk over the tickets module"`

**C74** - The profile reads the password age as "Alterada hoje", "Alterada há 1 dia", "Alterada há 42 dias" (AC 47)
Proof: `pnpm exec vitest run src/modules/identity/presentation/profile-texts.spec.ts -t "passwordAge texts"`

**C75** - Each keyword starts its script: "status", "andamento" and "meu chamado" the lookup, "vpn" and "809" the new ticket (AC 5, AC 16)
Proof: `pnpm exec vitest run src/modules/conversations/infrastructure/scripted-agent.integration.spec.ts -t "routes the keyword"`

## Coverage

| Set (size)                                         | Member -> proof                                                                                                                                                                                                                                                                                          | Unproven |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `GET /` statuses (3)                               | 200 C1 · 307 to `/console` C61 · 307 to `/login` C70                                                                                                                                                                                                                                                     | -        |
| `GET /perfil` statuses (3)                         | 200 C56 · 307 to `/console` C61 · 307 to `/login` C61                                                                                                                                                                                                                                                    | -        |
| `GET /console` statuses (3)                        | 200 C33 · 307 to `/` C61 · 307 to `/login` C61                                                                                                                                                                                                                                                           | -        |
| one-way doors (3)                                  | cross-module port C73 (`main/ticket-desk.ts` over the tickets service) and C22 (e2e through `main/client-providers.tsx`) · agent reply contract C5, C9, C19, `pnpm typecheck` · mocks as adapters C68 and `composition.client.integration.spec.ts` of both modules                                       | -        |
| source controls: `chat-new-ticket` (11)            | sidebar "Atendimento" C1 · "Meu perfil" C56 · "Sair" C69 · actions row C29 · "Só eu" C6 · "Minha equipe" C10 · "Toda a empresa" C10 · "Não sei" C10 · "Confirmar" C12 · shortcut C13 · "Editar" C14 · "Cancelar" C16 · composer "Enviar" C3                                                              | -        |
| source controls: `chat-status-transfer` (5)        | ticket rows C22 · "Falar com um analista" C25 · "Adicionar informação" C27 · "Não, obrigado" C28 · composer C3                                                                                                                                                                                           | -        |
| source controls: `console-transferred` (12)        | search C36 · "Todas" C33 · "Para você" C35 · "Com o agent" C35 · "Minhas" C35 · list item C39 · header search C45 · header ⋮ C44 · panel close C44 · "Outros chamados" rows C42 · "Devolver ao agent" C50 · "Assumir atendimento" C47 · rail initials C54 · "Ver todos" inert (plan Differences, AD-004) | -        |
| source controls: `console-assumed` (5)             | header "Devolver ao agent" C50 · "Encerrar atendimento" C51 · ⋮ C44 · composer send C48 · "Nexo Assist IA" label C31                                                                                                                                                                                     | -        |
| source controls: `profile` (4)                     | "Atendimento" C1 · "Meu perfil" C56 · "Sair" C69 · "Redefinir senha" C59                                                                                                                                                                                                                                 | -        |
| option matching, AC 7 (5 examples)                 | "Só eu. Tenho reunião às 14h" C7 · "so eu" C7 · "minha equipe toda" C7 · "o andar inteiro" C7 · "acho que toda a empresa" C7                                                                                                                                                                             | -        |
| answer -> priority and affected, AC 9 (4)          | "Só eu" C10 · "Não sei" C10 · "Minha equipe" C10 · "Toda a empresa" C10                                                                                                                                                                                                                                  | -        |
| response deadline, AC 10 (6 examples)              | Alta Mon 09:43 C11 · Alta Fri 16:00 C11 · Alta Tue 19:00 C11 · Crítica Sat 23:30 C11 · Média Thu 14:20 C11 · Baixa Mon 08:00 C11                                                                                                                                                                         | -        |
| lookup privacy, AC 17 (3 examples)                 | Ana C20 · Bruno sees none of Ana's C20 · Bruno with none open C20                                                                                                                                                                                                                                        | -        |
| overdue, AC 19 (3 examples)                        | Mon 10:00 C23 · Mon 10:01 C23 · resolved C23                                                                                                                                                                                                                                                             | -        |
| confidence level, AC 26 (7 examples)               | 0.80 C30 · 0.79 C30 · 0.50 C30 · 0.49 C30 · 0.41 C30 · 0.795 C30 · 0.495 C30                                                                                                                                                                                                                             | -        |
| console filters (4)                                | "Todas" C35 · "Para você" C35 · "Com o agent" C35 · "Minhas" C35                                                                                                                                                                                                                                         | -        |
| console search, AC 31 (5 examples)                 | "inc-20311" C36 · "fabio" C36 · "souza" C36 · "20311" C36 · "xyz" C36                                                                                                                                                                                                                                    | -        |
| script routing keywords, AC 5 and AC 16 (5)        | "status" C75 · "andamento" C75 · "meu chamado" C75 · "vpn" C75 · "809" C75                                                                                                                                                                                                                               | -        |
| list status lines (8)                              | transferred with code C37 · transferred with contact time C37 · agent asked for help C37 · agent attending C37 · you attending C37 · another analyst C37 · resolved C37 · closed C37                                                                                                                     | -        |
| activity time (4)                                  | "agora" C38 · "HH:MM" C38 · "ontem" C38 · "DD mmm" C38                                                                                                                                                                                                                                                   | -        |
| hand-over transitions (6)                          | take over from waiting C53 · take over from agent C53 · hand back from waiting C53 · hand back from analyst C53 · close by attending analyst C53 · rejected others C53                                                                                                                                   | -        |
| password age, AC 47 (3 examples)                   | today C57, C74 · 1 day C57, C74 · 42 days C57, C74                                                                                                                                                                                                                                                       | -        |
| loading states, AC 54 (3)                          | chat C66 · list C66 · panel C66                                                                                                                                                                                                                                                                          | -        |
| startup config: module dependencies (2 assemblies) | `main/client-providers.tsx` C19 (e2e through the real providers) · test harness `testing/` providers in the screen specs C64                                                                                                                                                                             | -        |

- Claims naming a route or redirect: C1, C33, C56, C61 - each proof opens the route in a browser
- Rules proven by a table: C7, C10, C11, C23, C30, C35, C36, C37, C38, C53, C57 - each test iterates every member

## Swept

- validation: C4, C15, C62, C63
- failure modes: C60, C64, C65, C71, C72
- idempotency: C18, C64, C71
- authorization: C20, C61
- concurrency: C18
- data lifecycle: C14, C68
- dependency failure: C64, C65, C71, C72
- state transitions: C18, C53, C72
- observability: n/a - every adapter is an in-browser mock; logging arrives with the server-side agent and ticket service

## Handoff

- **Settled mid-build:** user: "pode implementar direto, sem que eu aprove"; user: "suba uma instancia em pm2 do servidor pra mim ir vendo o resultado" (pm2 process `next-assist`, `pnpm dev` on port 3000); user: "use essa mesma instancia para o pm2 se vc precisar"; user: "deixa os testes por ultimo pfvr" / "foca em entregar e depois testes" (domain specs already written stay; the remaining proofs come after the screens); user: "coloca a page primeiro, depois va montando os quebra cabeca com as partes que precisa ter" (routes wired before the remaining pieces); user: "cria dois usuario um employee@example.com e outro analyst@example.com senha 123456" (added to the identity seed; any password works for seeded people, and the example employee gets the same sample ticket situations as Ana)
- **Dispatched:** Verifier round 1 (returned) and screens sub-agent round 1 (returned), over the working tree at `dc03225`; screens sub-agent round 2 (returned) over the fixed working tree at `dc03225`
- **Boundary:** C1-C75 closed at `cc33d87` (9 commits, `3a40357`..`cc33d87`); 90 proofs pass, 3 of 3 mutations killed; 2 picture rows diverge after screens round 2 (C21: first chat bubble 12 px under the top bar; C46: 1 px focus ring on the console composer) and wait for the user
- **Verifier round 1:** 10 findings, all fixed in the working tree (see `verification.md`); AD-007 asked and answered. Screens round 1: 10 rows differ, all fixed; pictures re-saved for round 2.
- **Abandoned:** the AC 10 example "Crítica from Sat 22:30 → Sun 23:30" - a typo (one wall-clock hour ends Sat 23:30); replaced by the midnight-crossing case Sat 23:30 → Sun 00:30. The reply shape `{ decision, text, block? }` (door 2) before any code - capture 3 draws a ticket card and a follow-up question in one reply, so the reply is `{ decision, parts }`
- **Walked:** as Ana (`ana.souza@nexo.com.br`, any password) on `/`: sent the VPN 809 message, chose "Só eu", got draft D-381 (Screen 2, `chat-new-ticket.running.png`); expanded the actions row; confirmed, edited and cancelled drafts. New session: "Qual o status do meu chamado?", picked INC-20311, got the overdue card and the analyst offer (Screen 3, `chat-status-transfer.running.png`); "Falar com um analista" turned the tag to "Aguardando atendente". "Meu perfil" in the sidebar opens `/perfil` (`profile.running.png`), "Redefinir senha" confirms the link. As Rafael (`rafael.nunes@nexo.com.br`) the login lands on `/console` with Ana's transferred conversation open (Screen 4, `console-transferred.running.png`); "Assumir atendimento", a reply, and Ana's scripted answer 2 s later (Screen 5, `console-assumed.running.png`, window 1567x900); hand back, close with confirmation, filters, search, panel close and reopen through ⋮. `employee@example.com` and `analyst@example.com` (password 123456) reach the same homes. Pictures taken with headless Chromium at the captures' sizes, `--font-render-hinting=none`, the Next.js dev indicator hidden.
