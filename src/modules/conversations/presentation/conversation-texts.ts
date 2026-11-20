import type { ConfidenceLevel } from "@/modules/conversations/domain/agent-reply";
import type { StatusLine } from "@/modules/conversations/domain/console-list";
import type { ConsoleEventKind } from "@/modules/conversations/domain/console-thread";
import type { AffectedScope } from "@/modules/conversations/domain/ticket-draft";
import type { StatusTone } from "@/shared/presentation/ui";

export const AGENT_NAME = "Nexo Assist";

export const chatTexts = {
  breadcrumb: ["Service desk de TI", "Atendimento"],
  online: "Assistente online",
  waiting: "Aguardando atendente",
  greeting: (firstName: string) => `Olá, ${firstName}. Como posso ajudar?`,
  greetingHint:
    "Descreva o que está acontecendo com as suas palavras. Eu consulto seus chamados, busco na central de ajuda e chamo um analista quando precisa.",
  composerLabel: "Mensagem para o Nexo Assist",
  placeholder: "Escreva para o Nexo...",
  send: "Enviar",
  typing: "Nexo Assist está digitando…",
  counter: (sent: number, limit: number) => `${sent}/${limit} mensagens nesta sessão`,
  limitReached: (limit: number) => `Você chegou ao limite de ${limit} mensagens nesta sessão.`,
  waitingNotice: "Um analista vai continuar este atendimento. Suas mensagens chegam para ele.",
  sendFailed: "Não foi possível enviar.",
  retry: "Tentar de novo",
  loading: "Carregando sua conversa…",
  loadFailed: "Não foi possível abrir sua conversa agora. Recarregue a página para tentar de novo.",
  actionFailed: "Não foi possível concluir agora. Tente de novo.",
  transferred: (team: string, time: string) => `Transferida para ${team} · ${time}`,
  threadLabel: "Conversa com o Nexo Assist",
};

export const decisionTexts = {
  understood: "O que entendi",
  actions: "O que fiz",
  noActions: "Nenhuma consulta: respondi com o que já estava na conversa.",
  confidence: "Confiança",
  reason: "Por quê",
  showDetail: "Ver por que o Nexo Assist respondeu assim",
};

export const confidenceText: Record<ConfidenceLevel, string> = {
  high: "alta",
  medium: "média",
  low: "baixa",
};
export const confidenceTone: Record<ConfidenceLevel, StatusTone> = {
  high: "success",
  medium: "warning",
  low: "danger",
};

export const draftTexts = {
  newTicket: "Novo chamado",
  draft: (id: string) => `Rascunho ${id}`,
  createdTicket: "Chamado criado",
  updateTicket: "Atualizar chamado",
  awaiting: "Aguardando confirmação",
  cancelled: "Cancelado",
  updated: "Informação acrescentada",
  category: "Categoria",
  priority: "Prioridade",
  affected: "Afetados",
  respondBy: (time: string) => `resposta até ${time}`,
  information: "Informação nova",
  confirm: "Confirmar",
  edit: "Editar",
  cancel: "Cancelar",
  save: "Salvar",
  discard: "Descartar alterações",
  title: "Título",
  description: "Descrição",
  titleRequired: "Informe um título.",
  descriptionRequired: "Informe uma descrição.",
};

export const affectedText: Record<AffectedScope, string> = {
  "only-me": "Somente você",
  "my-team": "Sua equipe",
  "whole-company": "Toda a empresa",
  unknown: "Não informado",
};

export const ticketCardTexts = {
  ticket: "Chamado",
  category: "Categoria",
  priority: "Prioridade",
  openedAt: "Aberto em",
  updatedAt: "Última atualização",
  overdue: "prazo vencido",
  onTime: "no prazo",
  pickerLabel: "Seus chamados abertos",
};

export const consoleTexts = {
  title: "Conversas",
  available: "Disponível",
  railConversations: "Conversas",
  railWaiting: "aguardando",
  searchLabel: "Pesquisar conversa ou chamado",
  filtersLabel: "Filtrar conversas",
  filters: { all: "Todas", "for-you": "Para você", "with-agent": "Com o agent", mine: "Minhas" },
  listLabel: "Lista de conversas",
  threadLabel: "Histórico da conversa",
  panelLabel: "Chamados do funcionário",
  loadingList: "Carregando conversas…",
  loadingThread: "Carregando conversa…",
  emptyFilter: "Nenhuma conversa aqui.",
  noResults: (term: string) => `Nenhuma conversa encontrada para “${term}”.`,
  noConversation: "Selecione uma conversa para ver o histórico.",
  loadFailed: "Não foi possível carregar as conversas agora. Recarregue a página para tentar de novo.",
  unread: "mensagens não lidas",
  agentPrefix: "Nexo: ",
  typing: "digitando…",
  online: "online",
  offline: "offline",
  aiBadge: "IA",
  today: "Hoje",
  yesterday: "Ontem",
  now: "agora",
  waitingTag: "Aguardando atendente",
  waitsForAnalyst: (firstName: string) => `${firstName} espera um atendente`,
  agentPaused: (time: string) => `Agent pausado · até ${time}`,
  agentAttending: "Nexo Assist está atendendo esta conversa.",
  otherAttending: (name: string) => `${name} está atendendo esta conversa.`,
  finished: "Atendimento encerrado.",
  takeOver: "Assumir atendimento",
  handBack: "Devolver ao agent",
  close: "Encerrar atendimento",
  composerLabel: "Mensagem para o funcionário",
  replyPlaceholder: (firstName: string) => `Escreva para ${firstName}…`,
  composerLocked: "Assuma o atendimento para responder",
  send: "Enviar mensagem",
  searchConversation: "Buscar na conversa",
  closeSearch: "Fechar busca",
  matches: (count: number) => (count === 1 ? "1 mensagem" : `${count} mensagens`),
  moreActions: "Mais ações",
  showTickets: (firstName: string) => `Mostrar chamados de ${firstName}`,
  hideTickets: (firstName: string) => `Ocultar chamados de ${firstName}`,
  closeDialogTitle: (name: string) => `Encerrar o atendimento de ${name}?`,
  closeDialogBody: (firstName: string) =>
    `A conversa sai da fila. Se ${firstName} escrever de novo, o Nexo Assist volta a atender.`,
  closeConfirm: "Encerrar",
  actionFailed: (action: string) => `Não foi possível ${action} agora. Tente de novo.`,
  actionWords: {
    "take-over": "assumir o atendimento",
    "hand-back": "devolver ao agent",
    close: "encerrar o atendimento",
    reply: "enviar a mensagem",
  },
  account: (name: string) => `Conta de ${name}`,
  signOut: "Sair",
};

export function eventText(event: ConsoleEventKind, actor: string | null, time: string): string {
  switch (event) {
    case "transferred":
      return `Transferida para ${actor ?? "um analista"} · ${time}`;
    case "taken-over":
      return `${actor} assumiu · agent pausado · ${time}`;
    case "handed-back":
      return actor ? `${actor} devolveu ao agent · ${time}` : `Devolvida ao agent · ${time}`;
    case "closed":
      return `${actor} encerrou o atendimento · ${time}`;
  }
}

/** The ticket panel's line under the conversation's ticket. */
export function panelEventText(event: ConsoleEventKind, actor: string | null): string {
  switch (event) {
    case "transferred":
      return "Transferido para um analista";
    case "taken-over":
      return `Assumido por ${actor}`;
    case "handed-back":
      return "Devolvido ao agent";
    case "closed":
      return "Atendimento encerrado";
  }
}

export function statusLineText(line: StatusLine): { text: string; tone: StatusTone } {
  switch (line.kind) {
    case "transferred-ticket":
      return { text: `Transferida · ${line.code}`, tone: "danger" };
    case "transferred-contact":
      return { text: `Transferida · contato em ${line.minutes} min`, tone: "danger" };
    case "agent-asked-help":
      return { text: `Agent pediu ajuda · confiança ${line.confidencePercent}%`, tone: "warning" };
    case "agent-attending":
      return { text: "Agent atendendo", tone: "success" };
    case "you-attending":
      return { text: "Você está atendendo", tone: "primary" };
    case "analyst-attending":
      return { text: `Com ${line.name}`, tone: "primary" };
    case "resolved":
      return { text: "Resolvida pelo agent", tone: "muted" };
    case "closed":
      return { text: "Encerrada", tone: "muted" };
  }
}

export function firstNameOf(name: string): string {
  return name.trim().split(/\s+/, 1)[0];
}
