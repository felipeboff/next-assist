# Technical Challenge: Nexo Assist, the IT service desk agent

PRD for the hands-on challenge of the hiring process.

## Context and goal

**Nexo** is a company with about 2,000 employees. When something IT-related goes wrong, or when someone needs access or equipment, the employee opens a ticket at the service desk. Today this is done through a form, and the outcome is well known: tickets opened for questions the help center already answers, duplicate tickets, wrong priority, missing information, and analysts spending a good part of the day on triage.

Nexo wants **Nexo Assist**: a support agent in a chat. The employee describes what is happening in their own words, and the agent looks up their tickets, searches the help center, opens or updates tickets, and calls an analyst when needed.

Success will be measured by:

- **Resolution without a queue:** questions and lookups resolved in the chat itself.
- **Well-opened tickets:** complete, with the correct type, category and priority, and no duplicates.
- **Right routing:** whatever needs a person reaches the analyst at the right time and with enough context.
- **Transparency:** it is possible to understand what the agent did and why in every reply.

## Users and stories

The main user is the **Nexo employee**, who signs in with their corporate email. As an employee, I want to:

1. Get an answer to a question without having to open a ticket.
2. Know the status of one of my tickets, even without remembering its number, and know whether it is overdue.
3. Add new information to an open ticket.
4. Open a ticket just by chatting, reviewing its details before it is created.
5. Talk to an analyst when I prefer to or when the problem is serious.
6. Come back another day and pick up where I left off.

On the other side is the **service desk analyst** (Tier 1 and Tier 2 support). They receive the tickets created by the agent and the transferred conversations. As an analyst, I want to:

1. Receive tickets with the correct type, category and priority, and a description that does not require asking everything again.
2. See the conversations that need me, including the cases where the agent was not confident enough to decide.
3. Take over a conversation, with the agent paused while I handle it, and hand it back to the agent or close it when I am done.

Analyst stories 2 and 3 are covered by the analyst console.

The agent must follow the service desk rules ([Annex A](#annex-a-service-desk-rules)) and use the help center and the existing tickets. The ticket system is legacy and, every now and then, becomes unavailable for a few seconds.

## What to build

The prototype ([Annex C](#annex-c-prototype)) shows the screens and the expected behavior. It is the visual reference: follow the layout and style, with freedom in the details.

1. **Login** (Screen 1): corporate email and password, accepting the employees from your sample data with any password.
2. **Employee chat** (Screens 2 and 3): conversation with Nexo Assist, real-time replies, ticket cards, ticket selection, draft for confirmation, questions with quick-reply options, and a limit of 30 messages per session.
3. **The agent:** decides what to do on every message, using the help center and the ticket service, and following the rules in [Annex A](#annex-a-service-desk-rules).
4. **Simulated ticket service:** with sample data created by you (see [Annex B](#annex-b-sample-data)), separate from the agent, allowing tickets to be looked up, created, updated and transferred.
5. **Transfer to an analyst:** the conversation is marked as waiting for an analyst, and the agent stops replying until it is released.
6. **Analyst console** (Screens 4 and 5): list of conversations with filters and status, conversation history, take over the conversation (with the agent paused), hand it back to the agent and close it, and the panel with the employee's tickets.
7. **Decision visibility:** above each reply, the prototype shows the agent's actions ("looked up your tickets", "classified the priority"). Beyond that, it must be possible to see in detail what the agent understood, which action it took, how confident it was, and why. The format of this detail is up to you (expanding the actions, a side panel, or a structured log), as long as it is easy to read. **This is the most important part of the challenge.**

## Technical requirements

| Topic       | Requirement                                                                                                                       |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Language    | TypeScript, with strict typing                                                                                                    |
| Agent       | Mastra (preferred) or LangGraph.js                                                                                                |
| Model       | Any LLM provider; explain the choice in the README                                                                                |
| Interface   | Follow the prototype in Annex C (suggestion: Next.js or React)                                                                    |
| Data        | Simulated ticket service, separate from the agent                                                                                 |
| Persistence | Conversations, tickets and the state of each conversation (with the agent or with an analyst) must survive an application restart |
| Execution   | Run locally with a few commands, documented in the README, plus a `.env.example`                                                  |

We also expect:

- **Clear architecture:** separation between interface, agent and services, with justified decisions.
- **Good practices:** organized code, tests where they make a difference, error handling, and commits that tell the story of the development.
- **Efficiency:** fast replies and mindful use of the model, keeping cost per conversation in mind.
- **Security and privacy:** keys kept out of the code, and one employee's tickets never exposed to another.

## Bonus

- **Deploy:** publish the application and send the link, so we can test it without running the project locally. It can be on any platform (Vercel, Railway, Fly.io, Render or another). If you do it, protect the keys and limit usage to prevent abuse and unexpected cost, and explain in the README how you deployed it.

## Deliverables and evaluation

### What to deliver

1. Link to the GitHub repository (public or with access granted to us).
2. A README with: how to run it, an overview of the architecture, how the agent decides what to do, how you ensured the quality of those decisions, the main trade-offs, and what you would do with more time.
3. Link to the deploy, if you did one.

**Use of AI:** you can and should use AI tools to code. In the interview, we will talk about the code and ask for small live changes.

### How we will evaluate

| Criterion                  | What we look at                                                                                            |
| -------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Decision quality           | The agent understands what the employee wants and picks the right action, following the service desk rules |
| Conversation handling      | Asks when information is missing, confirms before acting, keeps the context and replies clearly            |
| Transparency               | It is easy to see and understand what the agent did and why in every reply                                 |
| Interface                  | Fidelity to the prototype and care with loading and error states                                           |
| Architecture and practices | Separation of concerns, typing, error handling, organization and commits                                   |
| Communication              | Clarity of the README                                                                                      |
| Bonus                      | Deploy. Earns extra points; not doing it is not penalized                                                  |

## Annex A: service desk rules

- **Ticket types:** incident (INC), when something stopped or does not work; request (REQ), when it is a request for access, equipment or software.
- **Categories:** Access, Network and VPN, Hardware, Software, Email and Other.
- **Opening:** every ticket needs a title, description, type, category, priority, and who is affected. The agent shows a draft and only creates or updates the ticket after the employee confirms.
- **No duplicates:** if there is already an open ticket about the same problem, it is updated, not duplicated. Tickets resolved up to 7 days ago can be reopened.
- **Transfer:** happens when the employee asks for it, in critical cases, for overdue tickets, or when the agent is not confident about what to do. It carries a summary of the case, and the agent does not reply while the conversation is with an analyst.
- **Privacy:** a ticket's information can only be shared with whoever opened it.
- **Scope:** IT matters only. Other matters (HR, finance, facilities) are redirected.

**Priority and deadlines.** Priority combines impact (how many people are affected) and urgency (whether a commitment is at risk). The deadline applies to the first response and to each update; once the deadline passes, the ticket is overdue.

| Priority | When to use                                                         | Deadline         |
| -------- | ------------------------------------------------------------------- | ---------------- |
| Critical | Something is down for a team or for the company                     | 1 hour           |
| High     | Keeps one person from working, or a same-day commitment is at stake | 4 business hours |
| Medium   | Gets in the way, but there is a workaround                          | 3 business days  |
| Low      | Requests and improvements with no urgency                           | 5 business days  |

## Annex B: sample data

Create your own data: a few employees, 5 to 10 short help center articles, and tickets in varied situations (open, overdue, recently resolved, belonging to other employees). Some examples:

- **Article:** "VPN error 809: reinstall the VPN client from the software portal and restart the computer. Applies only to Windows 10; on Windows 11, open a ticket."
- **Article:** "Service desk hours: Monday to Friday, 8 a.m. to 6 p.m. Critical tickets have 24-hour on-call coverage."

| Ticket    | Title                            | Category | Priority | Status              | Last update |
| --------- | -------------------------------- | -------- | -------- | ------------------- | ----------- |
| INC-20311 | Slow laptop after Windows update | Hardware | Medium   | Waiting for analyst | 6 days ago  |
| REQ-10442 | Second monitor for home office   | Hardware | Low      | Approved            | 1 week ago  |
| INC-20150 | SAP password locked              | Access   | Medium   | Resolved            | 4 days ago  |

## Annex C: prototype

Prototype in Pencil: [open the prototype](https://app.pen.dev/s/swhm7Xfy1krKDIc-QyqE9J8ZI2xFB0qbNvHIncCXcLg). The data shown in it is illustrative.

| Screen                               | What it shows                                                                                                |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| 1. Login                             | Corporate email and password, with the Nexo Assist introduction                                              |
| 2. Ticket opening                    | Questions to complete the ticket, priority with deadline, and draft for confirmation                         |
| 3. Ticket lookup                     | Selection among the open tickets, status with overdue deadline, and an offer to call an analyst              |
| 4. Console: transferred conversation | List of conversations, conversation waiting for an analyst with the agent paused, and the employee's tickets |
| 5. Console: analyst handling         | The analyst took over the conversation and can hand it back to the agent or close it                         |

---

_Beyond the Bytes · Hiring process_
