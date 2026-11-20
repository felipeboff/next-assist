# service-desk-screens proofs

**HEAD**: cc33d87
**Tree**: dirty - .claude/skills/spec-lean/scripts/**pycache**/
**Result**: 90 pass, 2 fail; mutations 3 killed, 0 not

| Check | Proof                                                                                                            | Ran | Passed | Result                    |
| ----- | ---------------------------------------------------------------------------------------------------------------- | --- | ------ | ------------------------- |
| C1    | `pnpm exec playwright test e2e/chat.spec.ts -g "lands on the chat with the sidebar"`                             | 1   | -      | pass                      |
| C2    | `pnpm exec playwright test e2e/chat.spec.ts -g "greets and sends a suggestion"`                                  | 1   | -      | pass                      |
| C3    | `pnpm exec playwright test e2e/chat.spec.ts -g "shows the bubble, the typing state and the counter"`             | 1   | -      | pass                      |
| C4    | `pnpm exec playwright test e2e/chat.spec.ts -g "blank message keeps Enviar disabled"`                            | 1   | -      | pass                      |
| C5    | `pnpm exec vitest run src/modules/conversations/infrastructure/scripted-agent.integration.spec.ts -t "VPN messa` | 1   | 1      | pass                      |
| C6    | `pnpm exec playwright test e2e/chat.spec.ts -g "quick option is sent, marked and the others disabled"`           | 1   | -      | pass                      |
| C7    | `pnpm exec vitest run src/modules/conversations/domain/quick-answer.spec.ts -t "matchOption"`                    | 6   | 6      | pass                      |
| C8    | `browser - reach the state, save captures/chat-new-ticket.running.png`                                           | -   | -      | pass                      |
| C9    | `pnpm exec vitest run src/modules/conversations/infrastructure/scripted-agent.integration.spec.ts -t "answer ab` | 1   | 1      | pass                      |
| C10   | `pnpm exec vitest run src/modules/conversations/infrastructure/scripted-agent.integration.spec.ts -t "draft pri` | 4   | 4      | pass                      |
| C11   | `pnpm exec vitest run src/modules/tickets/domain/sla.spec.ts -t "responseDeadline"`                              | 7   | 7      | pass                      |
| C12   | `pnpm exec playwright test e2e/chat.spec.ts -g "Confirmar creates the ticket"`                                   | 1   | -      | pass                      |
| C12   | `pnpm exec vitest run src/modules/conversations/infrastructure/scripted-agent.integration.spec.ts -t "confirmin` | 1   | 1      | pass                      |
| C13   | `pnpm exec playwright test e2e/chat.spec.ts -g "Ctrl\+Enter confirms the pending draft"`                         | 1   | -      | pass                      |
| C14   | `pnpm exec playwright test e2e/chat.spec.ts -g "Editar changes the title and the description"`                   | 1   | -      | pass                      |
| C15   | `pnpm exec vitest run src/modules/conversations/domain/ticket-draft.spec.ts -t "validateDraftEdit"`              | 3   | 3      | pass                      |
| C15   | `pnpm exec playwright test e2e/chat.spec.ts -g "blank edited title"`                                             | 1   | -      | pass                      |
| C16   | `pnpm exec playwright test e2e/chat.spec.ts -g "Cancelar drops the draft"`                                       | 1   | -      | pass                      |
| C16   | `pnpm exec vitest run src/modules/conversations/infrastructure/scripted-agent.integration.spec.ts -t "cancellin` | 1   | 1      | pass                      |
| C17   | `pnpm exec vitest run src/modules/conversations/infrastructure/scripted-agent.integration.spec.ts -t "unscripte` | 1   | 1      | pass                      |
| C18   | `pnpm exec vitest run src/modules/conversations/infrastructure/scripted-agent.integration.spec.ts -t "settled d` | 1   | 1      | pass                      |
| C19   | `pnpm exec vitest run src/modules/conversations/infrastructure/scripted-agent.integration.spec.ts -t "status qu` | 1   | 1      | pass                      |
| C20   | `pnpm exec vitest run src/modules/conversations/infrastructure/scripted-agent.integration.spec.ts -t "lookup li` | 1   | 1      | pass                      |
| C20   | `pnpm exec vitest run src/modules/tickets/infrastructure/in-memory-ticket-service.integration.spec.ts -t "only ` | 1   | 1      | pass                      |
| C21   | `browser - reach the state, save captures/chat-status-transfer.running.png`                                      | -   | -      | **diverges** (screens.md) |
| C22   | `pnpm exec playwright test e2e/chat.spec.ts -g "picking a ticket locks the list and shows its card"`             | 1   | -      | pass                      |
| C23   | `pnpm exec vitest run src/modules/tickets/domain/sla.spec.ts -t "isOverdue"`                                     | 3   | 3      | pass                      |
| C24   | `pnpm exec vitest run src/modules/conversations/infrastructure/scripted-agent.integration.spec.ts -t "overdue t` | 1   | 1      | pass                      |
| C24   | `pnpm exec playwright test e2e/chat.spec.ts -g "picking a ticket locks the list and shows its card"`             | 1   | -      | pass                      |
| C25   | `pnpm exec playwright test e2e/chat.spec.ts -g "Falar com um analista transfers the conversation"`               | 1   | -      | pass                      |
| C26   | `pnpm exec vitest run src/modules/conversations/infrastructure/scripted-agent.integration.spec.ts -t "agent sta` | 1   | 1      | pass                      |
| C26   | `pnpm exec playwright test e2e/chat.spec.ts -g "Falar com um analista transfers the conversation"`               | 1   | -      | pass                      |
| C27   | `pnpm exec vitest run src/modules/conversations/infrastructure/scripted-agent.integration.spec.ts -t "adding in` | 1   | 1      | pass                      |
| C27   | `pnpm exec playwright test e2e/chat.spec.ts -g "Adicionar informação updates the ticket"`                        | 1   | -      | pass                      |
| C28   | `pnpm exec playwright test e2e/chat.spec.ts -g "Não, obrigado closes the topic"`                                 | 1   | -      | pass                      |
| C29   | `pnpm exec playwright test e2e/chat.spec.ts -g "actions row expands the decision detail"`                        | 1   | -      | pass                      |
| C30   | `pnpm exec vitest run src/modules/conversations/domain/agent-decision.spec.ts -t "confidenceLevel"`              | 8   | 8      | pass                      |
| C31   | `pnpm exec playwright test e2e/console.spec.ts -g "Nexo Assist label expands the decision detail"`               | 1   | -      | pass                      |
| C32   | `browser - reach the state, save captures/console-transferred.running.png`                                       | -   | -      | pass                      |
| C33   | `pnpm exec playwright test e2e/console.spec.ts -g "lands on the console with Todas selected"`                    | 1   | -      | pass                      |
| C34   | `pnpm exec vitest run src/modules/conversations/domain/console-list.spec.ts -t "orderConversations"`             | 2   | 2      | pass                      |
| C35   | `pnpm exec vitest run src/modules/conversations/domain/console-list.spec.ts -t "filterConversations"`            | 5   | 5      | pass                      |
| C35   | `pnpm exec playwright test e2e/console.spec.ts -g "a filter lists its conversations"`                            | 1   | -      | pass                      |
| C36   | `pnpm exec vitest run src/modules/conversations/domain/console-list.spec.ts -t "searchConversations"`            | 6   | 6      | pass                      |
| C36   | `pnpm exec playwright test e2e/console.spec.ts -g "search narrows the list"`                                     | 1   | -      | pass                      |
| C37   | `pnpm exec vitest run src/modules/conversations/domain/console-list.spec.ts -t "statusLineOf"`                   | 10  | 10     | pass                      |
| C38   | `pnpm exec vitest run src/modules/conversations/domain/activity-time.spec.ts -t "activityTime"`                  | 4   | 4      | pass                      |
| C39   | `pnpm exec playwright test e2e/console.spec.ts -g "opening a conversation shows its history and the employee's ` | 1   | -      | pass                      |
| C40   | `pnpm exec playwright test e2e/console.spec.ts -g "lands on the console with Todas selected"`                    | 1   | -      | pass                      |
| C41   | `pnpm exec vitest run src/modules/tickets/domain/ticket.spec.ts -t "orderForPanel"`                              | 1   | 1      | pass                      |
| C42   | `pnpm exec playwright test e2e/console.spec.ts -g "a ticket under Outros chamados expands"`                      | 1   | -      | pass                      |
| C43   | `pnpm exec playwright test e2e/console.spec.ts -g "employee without tickets"`                                    | 1   | -      | pass                      |
| C44   | `pnpm exec playwright test e2e/console.spec.ts -g "panel closes and the menu shows it again"`                    | 1   | -      | pass                      |
| C45   | `pnpm exec playwright test e2e/console.spec.ts -g "conversation search shows only matching messages"`            | 1   | -      | pass                      |
| C46   | `browser - reach the state, save captures/console-assumed.running.png`                                           | -   | -      | **diverges** (screens.md) |
| C47   | `pnpm exec playwright test e2e/console.spec.ts -g "taking over pauses the agent"`                                | 1   | -      | pass                      |
| C48   | `pnpm exec playwright test e2e/console.spec.ts -g "analyst reply shows as their bubble"`                         | 1   | -      | pass                      |
| C49   | `pnpm exec vitest run src/modules/conversations/infrastructure/in-memory-analyst-console.integration.spec.ts -t` | 1   | 1      | pass                      |
| C50   | `pnpm exec playwright test e2e/console.spec.ts -g "handing back returns the conversation to the agent"`          | 1   | -      | pass                      |
| C50   | `pnpm exec vitest run src/modules/conversations/infrastructure/in-memory-analyst-console.integration.spec.ts -t` | 1   | 1      | pass                      |
| C51   | `pnpm exec playwright test e2e/console.spec.ts -g "closing asks for confirmation"`                               | 1   | -      | pass                      |
| C52   | `pnpm exec playwright test e2e/console.spec.ts -g "resolved conversation shows no action"`                       | 1   | -      | pass                      |
| C53   | `pnpm exec vitest run src/modules/conversations/domain/handoff.spec.ts -t "handoff transitions"`                 | 22  | 22     | pass                      |
| C54   | `pnpm exec playwright test e2e/console.spec.ts -g "rail shows the waiting count and the avatar menu signs out"`  | 1   | -      | pass                      |
| C55   | `browser - reach the state, save captures/profile.running.png`                                                   | -   | -      | pass                      |
| C56   | `pnpm exec playwright test e2e/profile.spec.ts -g "Meu perfil shows the employee's data"`                        | 1   | -      | pass                      |
| C57   | `pnpm exec vitest run src/modules/identity/domain/password-age.spec.ts -t "passwordAge"`                         | 4   | 4      | pass                      |
| C58   | `pnpm exec vitest run src/modules/identity/infrastructure/drizzle-credential-reader.integration.spec.ts -t "cre` | 1   | 1      | pass                      |
| C59   | `pnpm exec playwright test e2e/profile.spec.ts -g "Redefinir senha confirms the link was sent"`                  | 1   | -      | pass                      |
| C60   | `pnpm exec vitest run src/modules/identity/presentation/components/password-card.spec.tsx -t "failed reset"`     | 1   | 1      | pass                      |
| C61   | `pnpm exec playwright test e2e/roles.spec.ts -g "each role is sent to its home"`                                 | 3   | -      | pass                      |
| C62   | `pnpm exec vitest run src/modules/conversations/domain/message-limit.spec.ts -t "message limit"`                 | 4   | 4      | pass                      |
| C62   | `pnpm exec vitest run src/modules/conversations/presentation/screens/chat-screen.spec.tsx -t "limit of 30 messa` | 2   | 2      | pass                      |
| C63   | `pnpm exec vitest run src/modules/conversations/infrastructure/scripted-agent.integration.spec.ts -t "rejects a` | 1   | 1      | pass                      |
| C64   | `pnpm exec vitest run src/modules/conversations/presentation/screens/chat-screen.spec.tsx -t "failed send"`      | 1   | 1      | pass                      |
| C65   | `pnpm exec vitest run src/modules/conversations/presentation/screens/console-screen.spec.tsx -t "failed take-ov` | 1   | 1      | pass                      |
| C66   | `pnpm exec vitest run src/modules/conversations/presentation/screens/chat-screen.spec.tsx -t "loading"`          | 1   | 1      | pass                      |
| C66   | `pnpm exec vitest run src/modules/conversations/presentation/screens/console-screen.spec.tsx -t "loading"`       | 2   | 2      | pass                      |
| C67   | `pnpm exec playwright test e2e/console.spec.ts -g "empty filter"`                                                | 1   | -      | pass                      |
| C67   | `pnpm exec vitest run src/modules/conversations/presentation/screens/console-screen.spec.tsx -t "no conversatio` | 1   | 1      | pass                      |
| C68   | `pnpm exec playwright test e2e/chat.spec.ts -g "reload starts again"`                                            | 1   | -      | pass                      |
| C68   | `pnpm exec playwright test e2e/console.spec.ts -g "reload starts again"`                                         | 1   | -      | pass                      |
| C70   | `pnpm exec playwright test e2e/login.spec.ts -g "redirects to the login page when there is no session"`          | 1   | -      | pass                      |
| C69   | `pnpm exec playwright test e2e/login.spec.ts -g "signs a seeded employee in with any password and signs out aga` | 1   | -      | pass                      |
| C71   | `pnpm exec vitest run src/modules/conversations/infrastructure/scripted-agent.integration.spec.ts -t "keeps a m` | 1   | 1      | pass                      |
| C71   | `pnpm exec vitest run src/modules/conversations/infrastructure/scripted-agent.integration.spec.ts -t "rolls bac` | 1   | 1      | pass                      |
| C72   | `pnpm exec vitest run src/modules/conversations/infrastructure/in-memory-analyst-console.integration.spec.ts -t` | 1   | 1      | pass                      |
| C73   | `pnpm exec vitest run src/main/ticket-desk.integration.spec.ts -t "ticket desk over the tickets module"`         | 5   | 5      | pass                      |
| C74   | `pnpm exec vitest run src/modules/identity/presentation/profile-texts.spec.ts -t "passwordAge texts"`            | 3   | 3      | pass                      |
| C75   | `pnpm exec vitest run src/modules/conversations/infrastructure/scripted-agent.integration.spec.ts -t "routes th` | 5   | 5      | pass                      |
| Build | `pnpm typecheck`                                                                                                 | -   | -      | pass                      |
| Build | `pnpm lint`                                                                                                      | -   | -      | pass                      |

## Mutations

| Mutation                                                                                  | Location                                              | Killed |
| ----------------------------------------------------------------------------------------- | ----------------------------------------------------- | ------ |
| C36 console search: contains -> starts with                                               | `src/modules/conversations/domain/console-list.ts:81` | yes    |
| C73 door 1: draft deadline always uses the Critica SLA (found against C12, closed by C73) | `src/main/ticket-desk.ts:47`                          | yes    |
| C7 typed answer: label starts the text -> label anywhere in it                            | `src/modules/conversations/domain/quick-answer.ts:10` | yes    |
