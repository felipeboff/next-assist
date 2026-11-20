import type { EmployeeChat } from "@/modules/conversations/application/ports/employee-chat";
import type { TicketDesk } from "@/modules/conversations/application/ports/ticket-desk";
import type {
  AgentDecision,
  AgentPart,
  AgentReply,
  QuestionPart,
} from "@/modules/conversations/domain/agent-reply";
import {
  StaleChatActionError,
  type ChatConversation,
  type ChatEmployee,
  type ChatEntry,
} from "@/modules/conversations/domain/chat";
import { MessageLimitReachedError, canSendMessage } from "@/modules/conversations/domain/message-limit";
import { matchOption } from "@/modules/conversations/domain/quick-answer";
import { normalizeForMatch } from "@/modules/conversations/domain/text-match";
import {
  assertAwaitingConfirmation,
  validateDraftEdit,
  type AffectedScope,
  type DraftEditProblems,
  type TicketDraft,
} from "@/modules/conversations/domain/ticket-draft";
import type {
  TicketPriority,
  TicketSnapshot,
  TicketStatus,
} from "@/modules/conversations/domain/ticket-snapshot";
import { DAY_MS, localDayIndex, toLocalParts } from "@/shared/domain/local-time";

/*
 * A stand-in for the Nexo Assist agent (AD-003) until the Mastra agent exists: it follows fixed
 * scripts instead of a language model, but uses the real ticket desk and the real service desk
 * rules (deadlines, duplicates, privacy, hand-over), and explains every reply like the real one must.
 */

export const SUGGESTIONS = [
  "Meu notebook não conecta na VPN. Erro 809.",
  "Qual o status do meu chamado?",
] as const;

export const AFFECTED_OPTIONS: Record<string, AffectedScope> = {
  "Só eu": "only-me",
  "Minha equipe": "my-team",
  "Toda a empresa": "whole-company",
  "Não sei": "unknown",
};

const TALK_TO_ANALYST = "Falar com um analista";
const ADD_INFORMATION = "Adicionar informação";
const NO_THANKS = "Não, obrigado";
const SUPPORT_TEAM = "Suporte N2";

const priorityWord: Record<TicketPriority, string> = {
  critical: "crítica",
  high: "alta",
  medium: "média",
  low: "baixa",
};
const deadlineLong: Record<TicketPriority, string> = {
  critical: "1 hora",
  high: "4 horas úteis",
  medium: "3 dias úteis",
  low: "5 dias úteis",
};
const deadlineShort: Record<TicketPriority, string> = {
  critical: "1 h",
  high: "4 h úteis",
  medium: "3 dias úteis",
  low: "5 dias úteis",
};
const statusWords: Record<TicketStatus, string> = {
  "waiting-analyst": "Aguardando analista",
  "in-progress": "Em andamento",
  "in-service": "Em atendimento",
  approved: "Aprovado",
  resolved: "Resolvido",
};
const priorityReason: Record<AffectedScope, string> = {
  "only-me": "a VPN fora impede você de trabalhar",
  unknown: "a VPN fora impede pelo menos você de trabalhar",
  "my-team": "o problema para uma equipe inteira",
  "whole-company": "o problema afeta a empresa toda",
};
const affectedSentence: Record<AffectedScope, string> = {
  "only-me": "Só você está sem VPN",
  unknown: "Não se sabe quem mais está sem VPN",
  "my-team": "A sua equipe está sem VPN",
  "whole-company": "A empresa toda está sem VPN",
};

type Awaiting =
  | Readonly<{ kind: "nothing" }>
  | Readonly<{ kind: "affected"; entryId: string }>
  | Readonly<{ kind: "ticket-pick"; entryId: string }>
  | Readonly<{ kind: "follow-up"; entryId: string; code: string }>
  | Readonly<{ kind: "update-note"; code: string }>
  | Readonly<{ kind: "demo"; entryId: string }>;

type Session = { conversation: ChatConversation; awaiting: Awaiting };

export class InvalidDraftEditError extends Error {
  constructor(readonly problems: DraftEditProblems) {
    super("The draft edit is invalid");
    this.name = "InvalidDraftEditError";
  }
}

type Options = Readonly<{
  ticketDesk: TicketDesk;
  clock: () => Date;
  /** How long the agent takes to answer, like a model would. */
  delayMs: number;
  firstDraftNumber?: number;
}>;

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

/** "13:43" today, else "23/11 às 10:00". */
function formatWhen(at: Date, now: Date): string {
  const parts = toLocalParts(at);
  const time = `${pad(parts.hours)}:${pad(parts.minutes)}`;
  return localDayIndex(at) === localDayIndex(now)
    ? time
    : `${pad(parts.day)}/${pad(parts.month + 1)} às ${time}`;
}

function daysWord(days: number): string {
  return days === 1 ? "1 dia" : `${days} dias`;
}

function decision(
  understood: string,
  actions: AgentDecision["actions"],
  confidence: number,
  reason: string,
): AgentDecision {
  return { understood, actions, confidence, reason };
}

export function createScriptedAgent({
  ticketDesk,
  clock,
  delayMs,
  firstDraftNumber = 381,
}: Options): EmployeeChat {
  const sessions = new Map<string, Session>();
  let sequence = 0;
  let draftNumber = firstDraftNumber;

  const nextId = () => `entry-${++sequence}`;
  const think = () => new Promise<void>((resolve) => setTimeout(resolve, delayMs));

  function sessionOf(employee: ChatEmployee): Session {
    const existing = sessions.get(employee.email);
    if (existing) {
      return existing;
    }
    const created: Session = {
      conversation: {
        state: "with-agent",
        entries: [],
        sentCount: 0,
        awaitingReplyId: null,
        suggestions: SUGGESTIONS,
      },
      awaiting: { kind: "nothing" },
    };
    sessions.set(employee.email, created);
    return created;
  }

  function setAwaiting(session: Session, awaiting: Awaiting): void {
    session.awaiting = awaiting;
    const awaitingReplyId = "entryId" in awaiting ? awaiting.entryId : null;
    session.conversation = { ...session.conversation, awaitingReplyId };
  }

  function push(session: Session, entry: ChatEntry): void {
    session.conversation = { ...session.conversation, entries: [...session.conversation.entries, entry] };
  }

  /**
   * Runs a message and the reply it gets as one step: when the reply fails (the ticket system is
   * down), the message is neither kept nor counted, so a retry sends it once (AC 52).
   */
  async function atomically(session: Session, step: () => Promise<void>): Promise<ChatConversation> {
    const before = { conversation: session.conversation, awaiting: session.awaiting };
    try {
      await step();
      return session.conversation;
    } catch (error) {
      session.conversation = before.conversation;
      session.awaiting = before.awaiting;
      throw error;
    }
  }

  function employeeSays(session: Session, text: string): void {
    if (!canSendMessage(session.conversation.sentCount)) {
      throw new MessageLimitReachedError();
    }
    push(session, { kind: "employee", id: nextId(), text, at: clock() });
    session.conversation = { ...session.conversation, sentCount: session.conversation.sentCount + 1 };
  }

  function agentSays(session: Session, reply: AgentReply): string {
    const id = nextId();
    push(session, { kind: "agent", id, reply, at: clock() });
    return id;
  }

  function partOf<K extends AgentPart["kind"]>(
    session: Session,
    entryId: string,
    kind: K,
  ): Extract<AgentPart, { kind: K }> {
    const entry = session.conversation.entries.find((candidate) => candidate.id === entryId);
    const part =
      entry?.kind === "agent" ? entry.reply.parts.find((candidate) => candidate.kind === kind) : undefined;
    if (!part) {
      throw new StaleChatActionError(entryId);
    }
    return part as Extract<AgentPart, { kind: K }>;
  }

  function updatePart<K extends AgentPart["kind"]>(
    session: Session,
    entryId: string,
    kind: K,
    update: (part: Extract<AgentPart, { kind: K }>) => Extract<AgentPart, { kind: K }>,
  ): void {
    session.conversation = {
      ...session.conversation,
      entries: session.conversation.entries.map((entry) =>
        entry.id === entryId && entry.kind === "agent"
          ? {
              ...entry,
              reply: {
                ...entry.reply,
                parts: entry.reply.parts.map((part) =>
                  part.kind === kind ? update(part as Extract<AgentPart, { kind: K }>) : part,
                ),
              },
            }
          : entry,
      ),
    };
  }

  function choose(session: Session, entryId: string, option: string): void {
    updatePart(session, entryId, "question", (part) => ({ ...part, chosen: option }));
    setAwaiting(session, { kind: "nothing" });
  }

  function question(text: string, options: readonly string[], prompt: string | null = null): QuestionPart {
    return { kind: "question", text, prompt, options, chosen: null };
  }

  // --- scripts -------------------------------------------------------------------------------

  async function startScript(employee: ChatEmployee, session: Session, text: string): Promise<void> {
    const words = normalizeForMatch(text);
    if (/status|andamento|meu chamado/.test(words)) {
      return lookUpTickets(employee, session);
    }
    if (/vpn|809/.test(words)) {
      return triageVpn(employee, session);
    }
    const id = agentSays(session, {
      decision: decision(
        "Não reconheci o pedido entre os roteiros desta demonstração.",
        [],
        0.3,
        "Esta versão usa respostas roteirizadas no lugar de um modelo de linguagem; fora dos roteiros, ofereço as conversas disponíveis.",
      ),
      parts: [
        question(
          "Esta é uma demonstração com respostas roteirizadas. Experimente uma destas conversas:",
          SUGGESTIONS,
        ),
      ],
    });
    setAwaiting(session, { kind: "demo", entryId: id });
  }

  async function triageVpn(employee: ChatEmployee, session: Session): Promise<void> {
    const open = await ticketDesk.listOpen(employee.email);
    const existing = open.find((ticket) => ticket.category === "network");
    if (existing) {
      const id = agentSays(session, {
        decision: decision(
          "Seu notebook não conecta na VPN, e já existe um chamado aberto sobre isso.",
          [{ label: "consultou seus chamados", outcome: `${existing.code} aberto sobre VPN` }],
          0.9,
          "Regra do service desk: um problema com chamado aberto é atualizado, não duplicado.",
        ),
        parts: [
          { kind: "ticket", ticket: existing },
          question(
            `Você já tem o ${existing.code} aberto sobre isso. Para não duplicar, posso acrescentar informações a ele.`,
            [ADD_INFORMATION, NO_THANKS],
          ),
        ],
      });
      setAwaiting(session, { kind: "follow-up", entryId: id, code: existing.code });
      return;
    }
    const id = agentSays(session, {
      decision: decision(
        "Seu notebook não conecta na VPN e mostra o erro 809 desde ontem.",
        [
          {
            label: "consultou seus chamados",
            outcome: `Nenhum chamado aberto sobre VPN (${open.length} abertos sobre outros assuntos)`,
          },
          {
            label: "buscou na central de ajuda",
            outcome: "Artigo “VPN com erro 809”: vale apenas para Windows 10",
          },
        ],
        0.86,
        "O artigo do erro 809 só resolve no Windows 10 e o seu notebook usa Windows 11; sem chamado aberto sobre isso, o caminho é abrir um incidente. Falta saber quem é afetado para definir a prioridade.",
      ),
      parts: [
        question(
          "Não há chamado aberto sobre VPN, e o artigo do erro 809 vale só para Windows 10 — o seu é Windows 11. Vou abrir um chamado.",
          Object.keys(AFFECTED_OPTIONS),
          "Quem está sendo afetado?",
        ),
      ],
    });
    setAwaiting(session, { kind: "affected", entryId: id });
  }

  function draftTicket(session: Session, option: string): void {
    const affected = AFFECTED_OPTIONS[option];
    const priority: TicketPriority =
      affected === "my-team" || affected === "whole-company" ? "critical" : "high";
    const now = clock();
    const respondBy = ticketDesk.deadlineFor(priority, now);
    const when = formatWhen(respondBy, now);
    const draft: TicketDraft = {
      id: `D-${draftNumber++}`,
      status: "awaiting-confirmation",
      kind: "INC",
      title: "VPN não conecta no notebook — erro 809",
      description: "Desde ontem o notebook (Windows 11) não conecta na VPN e mostra o erro 809.",
      category: "network",
      priority,
      affected,
      respondBy,
      ticketCode: null,
    };
    agentSays(session, {
      decision: decision(
        `${affectedSentence[affected]}; algo parou de funcionar, então é um incidente.`,
        [
          {
            label: "classificou a prioridade",
            outcome: `Prioridade ${priorityWord[priority]}: ${priorityReason[affected]}`,
          },
          { label: "consultou o SLA", outcome: `Resposta em até ${deadlineLong[priority]}: até ${when}` },
          { label: "montou o rascunho", outcome: "Incidente em Rede e VPN, aguardando sua confirmação" },
        ],
        affected === "unknown" ? 0.64 : 0.82,
        priority === "critical"
          ? "Regra do service desk: algo parado para uma equipe ou para a empresa é prioridade crítica, com resposta em 1 hora."
          : "Regra do service desk: algo que impede uma pessoa de trabalhar é prioridade alta, com resposta em 4 horas úteis.",
      ),
      parts: [
        {
          kind: "text",
          text: `Coloquei prioridade ${priorityWord[priority]} porque ${priorityReason[affected]} — a resposta chega até ${when}. Confira antes de eu criar:`,
        },
        { kind: "ticket-draft", draft },
      ],
    });
  }

  async function lookUpTickets(employee: ChatEmployee, session: Session): Promise<void> {
    const open = await ticketDesk.listOpen(employee.email);
    const consulted = {
      label: "consultou seus chamados",
      outcome:
        open.length === 0
          ? "Nenhum chamado aberto"
          : `${open.length} abertos: ${open.map((t) => t.code).join(", ")}`,
    };
    const understood = "Quer saber como está um chamado seu, sem dizer qual.";
    if (open.length === 0) {
      agentSays(session, {
        decision: decision(
          understood,
          [consulted],
          0.93,
          "Só mostro chamados abertos por você; não há nenhum aberto agora.",
        ),
        parts: [{ kind: "text", text: "Você não tem chamados abertos agora." }],
      });
      return;
    }
    const id = agentSays(session, {
      decision: decision(
        understood,
        [consulted],
        0.9,
        "Há mais de um chamado aberto e a mensagem não diz qual; pergunto em vez de adivinhar.",
      ),
      parts: [
        {
          kind: "text",
          text:
            open.length === 1
              ? "Você tem 1 chamado aberto. É sobre ele?"
              : `Você tem ${open.length} chamados abertos. Sobre qual deles quer saber?`,
        },
        { kind: "ticket-picker", tickets: open, picked: null },
      ],
    });
    setAwaiting(session, { kind: "ticket-pick", entryId: id });
  }

  async function showTicket(employee: ChatEmployee, session: Session, code: string): Promise<void> {
    const ticket = await ticketDesk.find(employee.email, code);
    if (!ticket) {
      agentSays(session, {
        decision: decision(
          `Quer saber do ${code}.`,
          [{ label: `consultou o ${code}`, outcome: "Não está entre os seus" }],
          0.9,
          "Regra do service desk: informações de um chamado só vão para quem o abriu.",
        ),
        parts: [{ kind: "text", text: "Não encontrei esse chamado entre os seus." }],
      });
      return;
    }
    const now = clock();
    const days = Math.floor((now.getTime() - ticket.updatedAt.getTime()) / DAY_MS);
    const when = formatWhen(ticket.respondBy, now);
    const id = agentSays(session, {
      decision: decision(
        `Quer saber como está o ${ticket.code}.`,
        [
          {
            label: `consultou o ${ticket.code}`,
            outcome: `${statusWords[ticket.status]}; última atualização há ${daysWord(days)}`,
          },
          {
            label: "calculou o prazo",
            outcome: ticket.overdue
              ? `Prazo de ${deadlineLong[ticket.priority]} vencido em ${when}`
              : `Próxima resposta até ${when}`,
          },
        ],
        0.95,
        ticket.overdue
          ? "Regra do service desk: chamado vencido é motivo para chamar um analista; ofereço antes de transferir."
          : "O chamado está dentro do prazo; não há motivo para transferir.",
      ),
      parts: [
        { kind: "ticket", ticket },
        ticket.overdue
          ? question(
              `Está sem atualização há ${daysWord(days)}, acima do prazo de ${deadlineLong[ticket.priority]} para prioridade ${priorityWord[ticket.priority]}. Quer que eu chame um analista?`,
              [TALK_TO_ANALYST, ADD_INFORMATION, NO_THANKS],
            )
          : question(
              `Está dentro do prazo: a próxima resposta vence até ${when}. Quer acrescentar alguma informação?`,
              [ADD_INFORMATION, NO_THANKS],
            ),
      ],
    });
    setAwaiting(session, { kind: "follow-up", entryId: id, code: ticket.code });
  }

  function followUp(session: Session, option: string, code: string): void {
    if (option === TALK_TO_ANALYST) {
      agentSays(session, {
        decision: decision(
          `Quer falar com um analista sobre o ${code}.`,
          [{ label: "transferiu para um analista", outcome: `${SUPPORT_TEAM} recebeu o resumo do caso` }],
          0.97,
          "Regra do service desk: transfiro quando o funcionário pede e quando o chamado está vencido. Enquanto o analista atende, eu não respondo.",
        ),
        parts: [
          {
            kind: "text",
            text: `Encaminhei para o ${SUPPORT_TEAM}. Um analista vai falar com você em até 2 h úteis.`,
          },
        ],
      });
      push(session, { kind: "event", id: nextId(), event: "transferred", team: SUPPORT_TEAM, at: clock() });
      session.conversation = { ...session.conversation, state: "waiting-analyst" };
      return;
    }
    if (option === ADD_INFORMATION) {
      agentSays(session, {
        decision: decision(
          `Quer complementar o ${code}.`,
          [],
          0.92,
          "Pergunto o que acrescentar antes de montar a atualização.",
        ),
        parts: [{ kind: "text", text: `O que você quer acrescentar ao ${code}?` }],
      });
      setAwaiting(session, { kind: "update-note", code });
      return;
    }
    agentSays(session, {
      decision: decision(
        "Não precisa de mais nada agora.",
        [],
        0.95,
        "O funcionário recusou as opções; encerro o assunto.",
      ),
      parts: [{ kind: "text", text: "Combinado. Se precisar de algo, é só escrever." }],
    });
  }

  function proposeUpdate(session: Session, code: string, note: string): void {
    agentSays(session, {
      decision: decision(
        `Informação nova para o ${code}.`,
        [{ label: "montou a atualização", outcome: "Aguardando sua confirmação" }],
        0.88,
        "Regra do service desk: só atualizo um chamado depois da sua confirmação.",
      ),
      parts: [
        { kind: "text", text: "Confira antes de eu atualizar:" },
        { kind: "ticket-update", draft: { status: "awaiting-confirmation", ticketCode: code, note } },
      ],
    });
  }

  async function reactToAnswer(
    employee: ChatEmployee,
    session: Session,
    awaiting: Awaiting,
    option: string,
  ): Promise<void> {
    await think();
    if (awaiting.kind === "affected") {
      return draftTicket(session, option);
    }
    if (awaiting.kind === "follow-up") {
      return followUp(session, option, awaiting.code);
    }
    return startScript(employee, session, option);
  }

  // --- commands ------------------------------------------------------------------------------

  return {
    async open(employee) {
      return sessionOf(employee).conversation;
    },

    async send(employee, text) {
      const session = sessionOf(employee);
      const message = text.trim();
      if (!message) {
        return session.conversation;
      }
      return atomically(session, async () => {
        employeeSays(session, message);
        if (session.conversation.state === "waiting-analyst") {
          return;
        }

        const awaiting = session.awaiting;
        if (awaiting.kind === "affected") {
          const option = matchOption(message, Object.keys(AFFECTED_OPTIONS), "Não sei");
          choose(session, awaiting.entryId, option);
          await reactToAnswer(employee, session, awaiting, option);
          return;
        }
        if (awaiting.kind === "follow-up") {
          const { options } = partOf(session, awaiting.entryId, "question");
          const option = matchOption(message, options, "");
          if (option) {
            choose(session, awaiting.entryId, option);
            await reactToAnswer(employee, session, awaiting, option);
            return;
          }
        }
        if (awaiting.kind === "ticket-pick") {
          const { tickets } = partOf(session, awaiting.entryId, "ticket-picker");
          const ticket = tickets.find((candidate) =>
            normalizeForMatch(message).includes(normalizeForMatch(candidate.code)),
          );
          if (ticket) {
            updatePart(session, awaiting.entryId, "ticket-picker", (part) => ({
              ...part,
              picked: ticket.code,
            }));
            setAwaiting(session, { kind: "nothing" });
            await think();
            await showTicket(employee, session, ticket.code);
            return;
          }
        }

        setAwaiting(session, { kind: "nothing" });
        await think();
        if (awaiting.kind === "update-note") {
          proposeUpdate(session, awaiting.code, message);
        } else {
          await startScript(employee, session, message);
        }
        return;
      });
    },

    async answer(employee, entryId, option) {
      const session = sessionOf(employee);
      const awaiting = session.awaiting;
      const part = partOf(session, entryId, "question");
      if (
        session.conversation.awaitingReplyId !== entryId ||
        part.chosen !== null ||
        !part.options.includes(option)
      ) {
        throw new StaleChatActionError(entryId);
      }
      return atomically(session, async () => {
        employeeSays(session, option);
        choose(session, entryId, option);
        await reactToAnswer(employee, session, awaiting, option);
      });
    },

    async pickTicket(employee, entryId, code) {
      const session = sessionOf(employee);
      const part = partOf(session, entryId, "ticket-picker");
      const ticket = part.tickets.find((candidate) => candidate.code === code);
      if (session.conversation.awaitingReplyId !== entryId || part.picked !== null || !ticket) {
        throw new StaleChatActionError(entryId);
      }
      return atomically(session, async () => {
        employeeSays(session, `${ticket.code} · ${ticket.title}`);
        updatePart(session, entryId, "ticket-picker", (current) => ({ ...current, picked: code }));
        setAwaiting(session, { kind: "nothing" });
        await think();
        await showTicket(employee, session, code);
      });
    },

    async confirmDraft(employee, entryId) {
      const session = sessionOf(employee);
      const entry = session.conversation.entries.find((candidate) => candidate.id === entryId);
      const isUpdate =
        entry?.kind === "agent" && entry.reply.parts.some((part) => part.kind === "ticket-update");

      if (isUpdate) {
        const { draft } = partOf(session, entryId, "ticket-update");
        assertAwaitingConfirmation(draft);
        // Settled before the first await, so a second confirmation finds it taken.
        updatePart(session, entryId, "ticket-update", (part) => ({
          ...part,
          draft: { ...part.draft, status: "created" },
        }));
        try {
          await ticketDesk.addNote(employee.email, draft.ticketCode, draft.note);
        } catch (error) {
          updatePart(session, entryId, "ticket-update", (part) => ({ ...part, draft }));
          throw error;
        }
        await think();
        agentSays(session, {
          decision: decision(
            `Confirmou a atualização do ${draft.ticketCode}.`,
            [{ label: `atualizou o ${draft.ticketCode}`, outcome: "Informação acrescentada ao chamado" }],
            0.98,
            "A atualização foi confirmada; o chamado recebe a informação e o prazo continua contando.",
          ),
          parts: [{ kind: "text", text: `Pronto: acrescentei a informação ao ${draft.ticketCode}.` }],
        });
        return session.conversation;
      }

      const { draft } = partOf(session, entryId, "ticket-draft");
      assertAwaitingConfirmation(draft);
      updatePart(session, entryId, "ticket-draft", (part) => ({
        ...part,
        draft: { ...part.draft, status: "created" },
      }));
      let ticket: TicketSnapshot;
      try {
        ticket = await ticketDesk.create(employee.email, {
          kind: draft.kind,
          title: draft.title,
          description: draft.description,
          category: draft.category,
          priority: draft.priority,
        });
      } catch (error) {
        updatePart(session, entryId, "ticket-draft", (part) => ({ ...part, draft }));
        throw error;
      }
      updatePart(session, entryId, "ticket-draft", (part) => ({
        ...part,
        draft: { ...part.draft, ticketCode: ticket.code },
      }));
      await think();
      agentSays(session, {
        decision: decision(
          "Confirmou o rascunho do chamado.",
          [{ label: "criou o chamado", outcome: `${ticket.code} aberto no serviço de chamados` }],
          0.98,
          "Regra do service desk: o chamado só é criado depois da confirmação, que veio agora.",
        ),
        parts: [
          {
            kind: "text",
            text: `Pronto: abri o chamado ${ticket.code} com prioridade ${priorityWord[ticket.priority]}. Um analista fala com você em até ${deadlineShort[ticket.priority]}.`,
          },
        ],
      });
      return session.conversation;
    },

    async cancelDraft(employee, entryId) {
      const session = sessionOf(employee);
      const entry = session.conversation.entries.find((candidate) => candidate.id === entryId);
      const isUpdate =
        entry?.kind === "agent" && entry.reply.parts.some((part) => part.kind === "ticket-update");
      const draft = isUpdate
        ? partOf(session, entryId, "ticket-update").draft
        : partOf(session, entryId, "ticket-draft").draft;
      assertAwaitingConfirmation(draft);

      if (isUpdate) {
        updatePart(session, entryId, "ticket-update", (part) => ({
          ...part,
          draft: { ...part.draft, status: "cancelled" },
        }));
      } else {
        updatePart(session, entryId, "ticket-draft", (part) => ({
          ...part,
          draft: { ...part.draft, status: "cancelled" },
        }));
      }
      await think();
      const code = draft.ticketCode;
      agentSays(session, {
        decision: decision(
          "Não quer seguir com o rascunho.",
          [
            {
              label: "descartou o rascunho",
              outcome: isUpdate ? "Nenhuma informação acrescentada" : "Nenhum chamado criado",
            },
          ],
          0.97,
          "Sem confirmação, nada é criado nem alterado.",
        ),
        parts: [
          {
            kind: "text",
            text: isUpdate
              ? `Tudo bem, não alterei o ${code}.`
              : "Tudo bem, não abri o chamado. Se precisar, é só me chamar.",
          },
        ],
      });
      return session.conversation;
    },

    async editDraft(employee, entryId, edit) {
      const session = sessionOf(employee);
      const { draft } = partOf(session, entryId, "ticket-draft");
      assertAwaitingConfirmation(draft);
      const check = validateDraftEdit(edit);
      if (!check.ok) {
        throw new InvalidDraftEditError(check.problems);
      }
      updatePart(session, entryId, "ticket-draft", (part) => ({
        ...part,
        draft: { ...part.draft, ...check.edit },
      }));
      return session.conversation;
    },
  };
}
