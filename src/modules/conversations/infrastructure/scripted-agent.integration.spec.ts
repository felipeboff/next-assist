import { describe, expect, it } from "vitest";
import type { AgentPart, AgentReply } from "@/modules/conversations/domain/agent-reply";
import {
  StaleChatActionError,
  type ChatConversation,
  type ChatEntry,
} from "@/modules/conversations/domain/chat";
import { MessageLimitReachedError } from "@/modules/conversations/domain/message-limit";
import { DraftAlreadySettledError } from "@/modules/conversations/domain/ticket-draft";
import {
  InvalidDraftEditError,
  SUGGESTIONS,
  createScriptedAgent,
} from "@/modules/conversations/infrastructure/scripted-agent";
import {
  createFakeTicketDesk,
  ticketSnapshot,
} from "@/modules/conversations/infrastructure/testing/fake-ticket-desk";
import { DAY_MS, HOUR_MS, localDate } from "@/shared/domain/local-time";

const ana = { email: "ana.souza@nexo.com.br", name: "Ana Souza" };
const bruno = { email: "bruno.carvalho@nexo.com.br", name: "Bruno Carvalho" };
const carla = { email: "carla.mendes@nexo.com.br", name: "Carla Mendes" };
const now = localDate(2026, 10, 20, 9, 43);

const VPN = "Meu notebook não conecta na VPN desde ontem. Aparece o erro 809.";
const STATUS = "Qual o status do meu chamado?";
const TALK = "Falar com um analista";
const ADD = "Adicionar informação";
const NO = "Não, obrigado";

type Owned = Parameters<typeof createFakeTicketDesk>[0];

function setup({ extra = [] as NonNullable<Owned>, clock = () => now } = {}) {
  const fake = createFakeTicketDesk([
    {
      ...ticketSnapshot({
        code: "INC-20311",
        title: "Notebook lento após atualização do Windows",
        updatedAt: new Date(now.getTime() - 6 * DAY_MS),
        overdue: true,
      }),
      requesterEmail: ana.email,
    },
    {
      ...ticketSnapshot({
        code: "INC-20298",
        title: "Acesso à pasta Financeiro no SharePoint",
        status: "in-progress",
        category: "access",
        respondBy: localDate(2026, 10, 23, 10, 0),
      }),
      requesterEmail: ana.email,
    },
    {
      ...ticketSnapshot({ code: "REQ-10442", kind: "REQ", status: "approved", priority: "low" }),
      requesterEmail: ana.email,
    },
    { ...ticketSnapshot({ code: "INC-20150", status: "resolved" }), requesterEmail: bruno.email },
    ...extra,
  ]);
  return { ...fake, agent: createScriptedAgent({ ticketDesk: fake.desk, clock, delayMs: 0 }) };
}

function agentEntries(conversation: ChatConversation) {
  return conversation.entries.filter(
    (entry): entry is Extract<ChatEntry, { kind: "agent" }> => entry.kind === "agent",
  );
}

function lastAgent(conversation: ChatConversation) {
  const entry = agentEntries(conversation).at(-1);
  if (!entry) {
    throw new Error("no agent reply");
  }
  return entry;
}

function part<K extends AgentPart["kind"]>(reply: AgentReply, kind: K): Extract<AgentPart, { kind: K }> {
  const found = reply.parts.find((candidate) => candidate.kind === kind);
  if (!found) {
    throw new Error(`no ${kind} part`);
  }
  return found as Extract<AgentPart, { kind: K }>;
}

const actionLabels = (reply: AgentReply) => reply.decision.actions.map((action) => action.label);
const texts = (conversation: ChatConversation) =>
  conversation.entries.flatMap((entry) => (entry.kind === "employee" ? [entry.text] : []));

async function draftFor(option: string) {
  const context = setup();
  const asked = await context.agent.send(ana, VPN);
  const conversation = await context.agent.answer(ana, lastAgent(asked).id, option);
  return { ...context, conversation, draftEntry: lastAgent(conversation) };
}

async function pickedTicket(code: string, context = setup()) {
  const listed = await context.agent.send(ana, STATUS);
  const conversation = await context.agent.pickTicket(ana, lastAgent(listed).id, code);
  return { ...context, conversation, followUp: lastAgent(conversation) };
}

describe("scripted agent", () => {
  it("opens an empty conversation with the suggestions", async () => {
    await expect(setup().agent.open(ana)).resolves.toEqual({
      state: "with-agent",
      entries: [],
      sentCount: 0,
      awaitingReplyId: null,
      suggestions: SUGGESTIONS,
    });
  });

  it("ignores a blank message", async () => {
    const { agent } = setup();
    await expect(agent.send(ana, "   ")).resolves.toMatchObject({ entries: [], sentCount: 0 });
  });

  it("VPN message gets the help-center reply and the affected question", async () => {
    const conversation = await setup().agent.send(ana, VPN);
    const reply = lastAgent(conversation);

    expect(texts(conversation)).toEqual([VPN]);
    expect(conversation.sentCount).toBe(1);
    expect(actionLabels(reply.reply)).toEqual(["consultou seus chamados", "buscou na central de ajuda"]);
    expect(part(reply.reply, "question")).toEqual({
      kind: "question",
      text: "Não há chamado aberto sobre VPN, e o artigo do erro 809 vale só para Windows 10 — o seu é Windows 11. Vou abrir um chamado.",
      prompt: "Quem está sendo afetado?",
      options: ["Só eu", "Minha equipe", "Toda a empresa", "Não sei"],
      chosen: null,
    });
    expect(conversation.awaitingReplyId).toBe(reply.id);
  });

  it("answer about who is affected gets the draft", async () => {
    const { conversation, draftEntry } = await draftFor("Só eu");

    expect(texts(conversation)).toEqual([VPN, "Só eu"]);
    expect(part(agentEntries(conversation)[0].reply, "question").chosen).toBe("Só eu");
    expect(actionLabels(draftEntry.reply)).toEqual([
      "classificou a prioridade",
      "consultou o SLA",
      "montou o rascunho",
    ]);
    expect(part(draftEntry.reply, "text").text).toBe(
      "Coloquei prioridade alta porque a VPN fora impede você de trabalhar — a resposta chega até 13:43. Confira antes de eu criar:",
    );
    expect(part(draftEntry.reply, "ticket-draft").draft).toEqual({
      id: "D-381",
      status: "awaiting-confirmation",
      kind: "INC",
      title: "VPN não conecta no notebook — erro 809",
      description: "Desde ontem o notebook (Windows 11) não conecta na VPN e mostra o erro 809.",
      category: "network",
      priority: "high",
      affected: "only-me",
      respondBy: new Date(now.getTime() + 4 * HOUR_MS),
      ticketCode: null,
    });
    expect(conversation.awaitingReplyId).toBeNull();
  });

  it.each([
    ["Só eu", "high", "only-me", 0.82],
    ["Não sei", "high", "unknown", 0.64],
    ["Minha equipe", "critical", "my-team", 0.82],
    ["Toda a empresa", "critical", "whole-company", 0.82],
  ] as const)(
    "draft priority and affected people follow the answer: %s",
    async (option, priority, affected, confidence) => {
      const { draftEntry } = await draftFor(option);
      expect(part(draftEntry.reply, "ticket-draft").draft).toMatchObject({ priority, affected });
      expect(draftEntry.reply.decision.confidence).toBe(confidence);
    },
  );

  it.each([
    ["Só eu. Tenho reunião com um cliente às 14h", "Só eu"],
    ["o andar inteiro", "Não sei"],
  ])("reads the typed answer %j as %j", async (typed, option) => {
    const { agent } = setup();
    const asked = await agent.send(ana, VPN);
    const conversation = await agent.send(ana, typed);

    expect(texts(conversation)).toEqual([VPN, typed]);
    expect(part(agentEntries(conversation)[0].reply, "question").chosen).toBe(option);
    expect(lastAgent(conversation).id).not.toBe(lastAgent(asked).id);
  });

  it("writes a deadline on another day with its date", async () => {
    const late = localDate(2026, 10, 20, 22, 0);
    const { agent } = setup({ clock: () => late });
    const asked = await agent.send(ana, VPN);
    const conversation = await agent.answer(ana, lastAgent(asked).id, "Só eu");
    expect(part(lastAgent(conversation).reply, "text").text).toContain("a resposta chega até 21/11 às 02:00");
  });

  it("confirming a draft creates an INC ticket and says so", async () => {
    const { agent, created, draftEntry } = await draftFor("Só eu");
    const conversation = await agent.confirmDraft(ana, draftEntry.id);

    expect(created).toEqual([
      {
        email: ana.email,
        kind: "INC",
        title: "VPN não conecta no notebook — erro 809",
        description: "Desde ontem o notebook (Windows 11) não conecta na VPN e mostra o erro 809.",
        category: "network",
        priority: "high",
      },
    ]);
    const draft = part(
      agentEntries(conversation).find((entry) => entry.id === draftEntry.id)!.reply,
      "ticket-draft",
    ).draft;
    expect(draft).toMatchObject({ status: "created", ticketCode: "INC-20601" });
    expect(actionLabels(lastAgent(conversation).reply)).toEqual(["criou o chamado"]);
    expect(part(lastAgent(conversation).reply, "text").text).toBe(
      "Pronto: abri o chamado INC-20601 com prioridade alta. Um analista fala com você em até 4 h úteis.",
    );
  });

  it("cancelling a draft creates no ticket", async () => {
    const { agent, created, draftEntry } = await draftFor("Só eu");
    const conversation = await agent.cancelDraft(ana, draftEntry.id);

    expect(created).toEqual([]);
    expect(part(agentEntries(conversation)[1].reply, "ticket-draft").draft.status).toBe("cancelled");
    expect(part(lastAgent(conversation).reply, "text").text).toBe(
      "Tudo bem, não abri o chamado. Se precisar, é só me chamar.",
    );
  });

  it("settled draft rejects a second decision", async () => {
    const { agent, created, draftEntry } = await draftFor("Só eu");
    const both = await Promise.allSettled([
      agent.confirmDraft(ana, draftEntry.id),
      agent.confirmDraft(ana, draftEntry.id),
    ]);

    expect(both.map((result) => result.status).sort()).toEqual(["fulfilled", "rejected"]);
    expect(created).toHaveLength(1);
    await expect(agent.cancelDraft(ana, draftEntry.id)).rejects.toThrow(DraftAlreadySettledError);
    await expect(agent.editDraft(ana, draftEntry.id, { title: "x", description: "y" })).rejects.toThrow(
      DraftAlreadySettledError,
    );

    const cancelled = await draftFor("Só eu");
    await cancelled.agent.cancelDraft(ana, cancelled.draftEntry.id);
    await expect(cancelled.agent.confirmDraft(ana, cancelled.draftEntry.id)).rejects.toThrow(
      DraftAlreadySettledError,
    );
  });

  it("puts the draft back when the ticket system fails, so it can be confirmed again", async () => {
    const { agent, created, draftEntry, failNext } = await draftFor("Só eu");
    failNext("create");

    await expect(agent.confirmDraft(ana, draftEntry.id)).rejects.toThrow("create is unavailable");
    const retried = await agent.confirmDraft(ana, draftEntry.id);
    expect(created).toHaveLength(1);
    expect(part(agentEntries(retried)[1].reply, "ticket-draft").draft.status).toBe("created");
  });

  it("edits the draft's title and description, and refuses a blank title", async () => {
    const { agent, draftEntry } = await draftFor("Só eu");
    const edited = await agent.editDraft(ana, draftEntry.id, {
      title: " VPN fora ",
      description: " Erro 809 ",
    });

    expect(part(agentEntries(edited)[1].reply, "ticket-draft").draft).toMatchObject({
      title: "VPN fora",
      description: "Erro 809",
      status: "awaiting-confirmation",
    });
    await expect(agent.editDraft(ana, draftEntry.id, { title: "  ", description: "Erro" })).rejects.toEqual(
      new InvalidDraftEditError({ title: "title.required" }),
    );
  });

  it("unscripted first message gets the demo reply", async () => {
    const { agent } = setup();
    const conversation = await agent.send(ana, "Bom dia");
    const reply = lastAgent(conversation).reply;

    expect(part(reply, "question")).toMatchObject({
      text: "Esta é uma demonstração com respostas roteirizadas. Experimente uma destas conversas:",
      options: SUGGESTIONS,
    });
    expect(reply.decision.confidence).toBe(0.3);

    const started = await agent.answer(ana, lastAgent(conversation).id, SUGGESTIONS[1]);
    expect(part(lastAgent(started).reply, "ticket-picker").tickets).toHaveLength(3);
  });

  it("status question lists the employee's open tickets", async () => {
    const conversation = await setup().agent.send(ana, STATUS);
    const reply = lastAgent(conversation).reply;

    expect(actionLabels(reply)).toEqual(["consultou seus chamados"]);
    expect(part(reply, "text").text).toBe("Você tem 3 chamados abertos. Sobre qual deles quer saber?");
    expect(part(reply, "ticket-picker").tickets.map((ticket) => ticket.code)).toEqual([
      "INC-20311",
      "INC-20298",
      "REQ-10442",
    ]);
  });

  it("lookup lists only the asker's tickets", async () => {
    const { agent } = setup({
      extra: [{ ...ticketSnapshot({ code: "INC-20777" }), requesterEmail: carla.email }],
    });

    const forAna = await agent.send(ana, STATUS);
    expect(part(lastAgent(forAna).reply, "ticket-picker").tickets.map((ticket) => ticket.code)).not.toContain(
      "INC-20150",
    );

    const forBruno = await agent.send(bruno, STATUS);
    expect(lastAgent(forBruno).reply.parts).toEqual([
      { kind: "text", text: "Você não tem chamados abertos agora." },
    ]);

    const forCarla = await agent.send(carla, STATUS);
    expect(part(lastAgent(forCarla).reply, "text").text).toBe("Você tem 1 chamado aberto. É sobre ele?");
    expect(part(lastAgent(forCarla).reply, "ticket-picker").tickets.map((ticket) => ticket.code)).toEqual([
      "INC-20777",
    ]);
  });

  it("overdue ticket gets the analyst offer; one in time does not", async () => {
    const { conversation, followUp } = await pickedTicket("INC-20311");

    expect(texts(conversation).at(-1)).toBe("INC-20311 · Notebook lento após atualização do Windows");
    expect(part(agentEntries(conversation)[0].reply, "ticket-picker").picked).toBe("INC-20311");
    expect(actionLabels(followUp.reply)).toEqual(["consultou o INC-20311", "calculou o prazo"]);
    expect(part(followUp.reply, "ticket").ticket.code).toBe("INC-20311");
    expect(part(followUp.reply, "question")).toMatchObject({
      text: "Está sem atualização há 6 dias, acima do prazo de 3 dias úteis para prioridade média. Quer que eu chame um analista?",
      options: [TALK, ADD, NO],
    });

    const onTime = await pickedTicket("INC-20298");
    expect(part(onTime.followUp.reply, "question")).toMatchObject({
      text: "Está dentro do prazo: a próxima resposta vence até 23/11 às 10:00. Quer acrescentar alguma informação?",
      options: [ADD, NO],
    });
  });

  it("says one day in the singular", async () => {
    const context = setup({
      extra: [
        {
          ...ticketSnapshot({
            code: "INC-20500",
            updatedAt: new Date(now.getTime() - DAY_MS - HOUR_MS),
            overdue: true,
          }),
          requesterEmail: carla.email,
        },
      ],
    });
    const listed = await context.agent.send(carla, STATUS);
    const conversation = await context.agent.pickTicket(carla, lastAgent(listed).id, "INC-20500");
    expect(part(lastAgent(conversation).reply, "question").text).toContain("há 1 dia,");
  });

  it("never shows a ticket that is not the asker's any more", async () => {
    const context = setup();
    const listed = await context.agent.send(ana, STATUS);
    context.forget("INC-20311");
    const conversation = await context.agent.pickTicket(ana, lastAgent(listed).id, "INC-20311");
    expect(lastAgent(conversation).reply.parts).toEqual([
      { kind: "text", text: "Não encontrei esse chamado entre os seus." },
    ]);
  });

  it("agent stays silent while waiting for an analyst", async () => {
    const { agent, followUp } = await pickedTicket("INC-20311");
    const transferred = await agent.answer(ana, followUp.id, TALK);

    expect(actionLabels(lastAgent(transferred).reply)).toEqual(["transferiu para um analista"]);
    expect(part(lastAgent(transferred).reply, "text").text).toBe(
      "Encaminhei para o Suporte N2. Um analista vai falar com você em até 2 h úteis.",
    );
    expect(transferred.entries.at(-1)).toMatchObject({
      kind: "event",
      event: "transferred",
      team: "Suporte N2",
    });
    expect(transferred.state).toBe("waiting-analyst");

    const later = await agent.send(ana, "Alguma novidade?");
    expect(later.entries).toHaveLength(transferred.entries.length + 1);
    expect(later.entries.at(-1)).toMatchObject({ kind: "employee", text: "Alguma novidade?" });
    expect(later.sentCount).toBe(transferred.sentCount + 1);
  });

  it("adding information drafts an update and confirming adds the note", async () => {
    const { agent, notes, followUp } = await pickedTicket("INC-20311");
    const asked = await agent.answer(ana, followUp.id, ADD);
    expect(part(lastAgent(asked).reply, "text").text).toBe("O que você quer acrescentar ao INC-20311?");

    const proposed = await agent.send(ana, "Aconteceu de novo hoje.");
    const update = lastAgent(proposed);
    expect(part(update.reply, "text").text).toBe("Confira antes de eu atualizar:");
    expect(part(update.reply, "ticket-update").draft).toEqual({
      status: "awaiting-confirmation",
      ticketCode: "INC-20311",
      note: "Aconteceu de novo hoje.",
    });

    const confirmed = await agent.confirmDraft(ana, update.id);
    expect(notes).toEqual([{ email: ana.email, code: "INC-20311", note: "Aconteceu de novo hoje." }]);
    expect(part(lastAgent(confirmed).reply, "text").text).toBe(
      "Pronto: acrescentei a informação ao INC-20311.",
    );
    await expect(agent.confirmDraft(ana, update.id)).rejects.toThrow(DraftAlreadySettledError);
  });

  it("cancels an update without touching the ticket, and retries one the ticket system refused", async () => {
    const first = await pickedTicket("INC-20311");
    await first.agent.answer(ana, first.followUp.id, ADD);
    const proposed = await first.agent.send(ana, "Nota");
    const cancelled = await first.agent.cancelDraft(ana, lastAgent(proposed).id);
    expect(first.notes).toEqual([]);
    expect(part(lastAgent(cancelled).reply, "text").text).toBe("Tudo bem, não alterei o INC-20311.");

    const second = await pickedTicket("INC-20311");
    await second.agent.answer(ana, second.followUp.id, ADD);
    const again = await second.agent.send(ana, "Nota");
    second.failNext("addNote");
    await expect(second.agent.confirmDraft(ana, lastAgent(again).id)).rejects.toThrow(
      "addNote is unavailable",
    );
    await second.agent.confirmDraft(ana, lastAgent(again).id);
    expect(second.notes).toHaveLength(1);
  });

  it("Não, obrigado closes the topic", async () => {
    const { agent, followUp } = await pickedTicket("INC-20311");
    const conversation = await agent.answer(ana, followUp.id, NO);
    expect(part(lastAgent(conversation).reply, "text").text).toBe(
      "Combinado. Se precisar de algo, é só escrever.",
    );
  });

  it("understands typed follow-ups and typed ticket choices", async () => {
    const typedFollowUp = await pickedTicket("INC-20311");
    const talked = await typedFollowUp.agent.send(ana, "falar com um analista, por favor");
    expect(talked.state).toBe("waiting-analyst");

    const unrelated = await pickedTicket("INC-20311");
    const restarted = await unrelated.agent.send(ana, "Bom dia");
    expect(part(lastAgent(restarted).reply, "question").options).toEqual(SUGGESTIONS);

    const context = setup();
    await context.agent.send(ana, STATUS);
    const picked = await context.agent.send(ana, "quero saber do inc-20298");
    expect(part(lastAgent(picked).reply, "ticket").ticket.code).toBe("INC-20298");

    const other = setup();
    await other.agent.send(ana, STATUS);
    const vpn = await other.agent.send(ana, VPN);
    expect(part(lastAgent(vpn).reply, "question").prompt).toBe("Quem está sendo afetado?");
  });

  it("updates an open VPN ticket instead of opening a duplicate", async () => {
    const { agent } = setup({
      extra: [{ ...ticketSnapshot({ code: "INC-20400", category: "network" }), requesterEmail: ana.email }],
    });
    const conversation = await agent.send(ana, VPN);
    const reply = lastAgent(conversation);

    expect(part(reply.reply, "ticket").ticket.code).toBe("INC-20400");
    expect(part(reply.reply, "question")).toMatchObject({
      text: "Você já tem o INC-20400 aberto sobre isso. Para não duplicar, posso acrescentar informações a ele.",
      options: [ADD, NO],
    });
    expect(conversation.awaitingReplyId).toBe(reply.id);
  });

  it("rejects a message past the limit", async () => {
    const { agent } = setup();
    let conversation = await agent.open(ana);
    for (let index = 0; index < 30; index += 1) {
      conversation = await agent.send(ana, `Mensagem ${index + 1}`);
    }
    expect(conversation.sentCount).toBe(30);

    await expect(agent.send(ana, "A 31ª")).rejects.toThrow(MessageLimitReachedError);
    await expect(agent.answer(ana, lastAgent(conversation).id, SUGGESTIONS[0])).rejects.toThrow(
      MessageLimitReachedError,
    );
    await expect(agent.open(ana)).resolves.toMatchObject({ sentCount: 30 });
  });

  it("keeps a message whose reply failed out of the conversation, so the retry sends it once", async () => {
    const { agent, failNext } = setup();
    failNext("listOpen");

    await expect(agent.send(ana, VPN)).rejects.toThrow("listOpen is unavailable");
    await expect(agent.open(ana)).resolves.toMatchObject({ entries: [], sentCount: 0 });

    const retried = await agent.send(ana, VPN);
    expect(texts(retried)).toEqual([VPN]);
    expect(retried.sentCount).toBe(1);
  });

  it("rolls back a quick answer and a ticket pick whose reply failed", async () => {
    const answered = setup();
    const asked = await answered.agent.send(ana, STATUS);
    answered.failNext("find");
    await expect(answered.agent.pickTicket(ana, lastAgent(asked).id, "INC-20311")).rejects.toThrow();
    const afterPick = await answered.agent.open(ana);
    expect(afterPick.sentCount).toBe(1);
    expect(part(lastAgent(afterPick).reply, "ticket-picker").picked).toBeNull();
    expect(afterPick.awaitingReplyId).toBe(lastAgent(asked).id);

    const demo = setup();
    const offered = await demo.agent.send(ana, "Bom dia");
    demo.failNext("listOpen");
    await expect(demo.agent.answer(ana, lastAgent(offered).id, SUGGESTIONS[1])).rejects.toThrow();
    const afterAnswer = await demo.agent.open(ana);
    expect(afterAnswer.sentCount).toBe(1);
    expect(part(lastAgent(afterAnswer).reply, "question").chosen).toBeNull();
  });

  it.each([
    ["Como está o andamento?", "ticket-picker"],
    ["Quero ver o status", "ticket-picker"],
    ["E o meu chamado?", "ticket-picker"],
    ["A vpn caiu", "question"],
    ["Erro 809 de novo", "question"],
  ] as const)("routes the keyword in %j to its script", async (message, kind) => {
    const conversation = await setup().agent.send(ana, message);
    const reply = lastAgent(conversation).reply;
    expect(reply.parts.some((candidate) => candidate.kind === kind)).toBe(true);
    if (kind === "question") {
      expect(part(reply, "question").prompt).toBe("Quem está sendo afetado?");
    }
  });

  it("rejects actions on replies that no longer accept them", async () => {
    const { agent } = setup();
    const asked = await agent.send(ana, VPN);
    const questionId = lastAgent(asked).id;
    const employeeId = asked.entries[0].id;

    await expect(agent.answer(ana, questionId, "Talvez")).rejects.toThrow(StaleChatActionError);
    await expect(agent.answer(ana, employeeId, "Só eu")).rejects.toThrow(StaleChatActionError);
    await agent.answer(ana, questionId, "Só eu");
    await expect(agent.answer(ana, questionId, "Só eu")).rejects.toThrow(StaleChatActionError);

    const listed = await agent.send(ana, STATUS);
    const pickerId = lastAgent(listed).id;
    await expect(agent.pickTicket(ana, pickerId, "INC-99999")).rejects.toThrow(StaleChatActionError);
    await agent.pickTicket(ana, pickerId, "INC-20298");
    await expect(agent.pickTicket(ana, pickerId, "INC-20311")).rejects.toThrow(StaleChatActionError);
    await expect(agent.confirmDraft(ana, "entry-unknown")).rejects.toThrow(StaleChatActionError);
  });
});
