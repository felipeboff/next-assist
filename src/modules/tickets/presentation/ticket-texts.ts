import type { TicketCategory, TicketPriority, TicketStatus } from "@/modules/tickets/domain/ticket";
import type { StatusTone } from "@/shared/presentation/ui";

export const categoryText: Record<TicketCategory, string> = {
  access: "Acesso",
  network: "Rede e VPN",
  hardware: "Hardware",
  software: "Software",
  email: "E-mail",
  other: "Outros",
};

export const priorityText: Record<TicketPriority, string> = {
  critical: "Crítica",
  high: "Alta",
  medium: "Média",
  low: "Baixa",
};

export const priorityTone: Record<TicketPriority, StatusTone> = {
  critical: "danger",
  high: "warning",
  medium: "muted",
  low: "muted",
};

export const statusText: Record<TicketStatus, string> = {
  "waiting-analyst": "Aguardando analista",
  "in-progress": "Em andamento",
  "in-service": "Em atendimento",
  approved: "Aprovado",
  resolved: "Resolvido",
};

export const statusTone: Record<TicketStatus, StatusTone> = {
  "waiting-analyst": "warning",
  "in-progress": "primary",
  "in-service": "primary",
  approved: "success",
  resolved: "muted",
};

/** Annex A deadline of each priority, in words. */
export const deadlineText: Record<TicketPriority, string> = {
  critical: "1 hora",
  high: "4 horas úteis",
  medium: "3 dias úteis",
  low: "5 dias úteis",
};

/** "Hardware › Notebook", or the category alone. */
export function categoryPath(category: TicketCategory, subcategory: string | null): string {
  return subcategory ? `${categoryText[category]} › ${subcategory}` : categoryText[category];
}
