"use client";

import { ArrowUpRight, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { isOverdue, responseDeadline } from "@/modules/tickets/domain/sla";
import { isOpen, orderForPanel, type Ticket } from "@/modules/tickets/domain/ticket";
import {
  categoryText,
  deadlineText,
  priorityText,
  statusText,
  statusTone,
} from "@/modules/tickets/presentation/ticket-texts";
import { useTicketsDependencies } from "@/modules/tickets/presentation/tickets-dependencies";
import { formatDayMonth, formatMoment, formatTime } from "@/shared/presentation/format-date";
import {
  Alert,
  Box,
  Button,
  Disclosure,
  Divider,
  EmptyState,
  Heading,
  Icon,
  IconButton,
  LoadingState,
  ScrollArea,
  Stack,
  StatusDot,
  StatusLabel,
  Text,
  type IconGlyph,
} from "@/shared/presentation/ui";

export type ConversationTicketEvent = Readonly<{ icon: IconGlyph; text: string; at: Date }>;

export type EmployeeTicketsPanelProps = {
  employeeEmail: string;
  employeeFirstName: string;
  /** The ticket the open conversation is about, shown first. */
  conversationTicketCode: string | null;
  /** The conversation's last hand-over event, shown under its ticket. */
  conversationEvent: ConversationTicketEvent | null;
  /** Changes when the tickets may have changed (a take-over), to read them again. */
  refreshKey?: unknown;
  onClose: () => void;
};

type Loaded = Readonly<{ email: string; result: "failed" | readonly Ticket[] }>;
type Load = { status: "loading" } | { status: "failed" } | { status: "ready"; tickets: readonly Ticket[] };

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <Text size="sm" weight="medium" tone="muted">
      {children}
    </Text>
  );
}

function deadlineStatus(ticket: Ticket, now: Date): string {
  if (!isOpen(ticket)) {
    return `Encerrado em ${formatDayMonth(ticket.updatedAt)}`;
  }
  const due = responseDeadline(ticket.priority, ticket.updatedAt);
  return isOverdue(ticket, now)
    ? `Prazo de ${deadlineText[ticket.priority]} vencido em ${formatMoment(due, now)}`
    : `No prazo: próxima resposta até ${formatMoment(due, now)}`;
}

export function EmployeeTicketsPanel({
  employeeEmail,
  employeeFirstName,
  conversationTicketCode,
  conversationEvent,
  refreshKey,
  onClose,
}: EmployeeTicketsPanelProps) {
  const { ticketService } = useTicketsDependencies();
  const [loaded, setLoaded] = useState<Loaded | null>(null);

  useEffect(() => {
    let current = true;
    ticketService
      .listByRequester(employeeEmail)
      .then((tickets) => current && setLoaded({ email: employeeEmail, result: tickets }))
      .catch(() => current && setLoaded({ email: employeeEmail, result: "failed" }));
    return () => {
      current = false;
    };
  }, [ticketService, employeeEmail, refreshKey]);

  // Another employee shows the loading state; a refresh of the same one keeps the tickets on screen.
  const load: Load =
    !loaded || loaded.email !== employeeEmail
      ? { status: "loading" }
      : loaded.result === "failed"
        ? { status: "failed" }
        : { status: "ready", tickets: loaded.result };

  const tickets = load.status === "ready" ? load.tickets : [];
  const openCount = tickets.filter(isOpen).length;
  const thisConversation = tickets.find((ticket) => ticket.code === conversationTicketCode) ?? null;
  const others = orderForPanel(tickets.filter((ticket) => ticket !== thisConversation));
  const now = new Date();

  return (
    <Stack fillHeight>
      <Box paddingX="xl" paddingY="lg">
        <Stack direction="row" justify="between" align="start" gap="md">
          <Stack gap="none">
            <Heading level={2} size="subtitle">
              Chamados de {employeeFirstName}
            </Heading>
            {load.status === "ready" ? (
              <Text size="xs" tone="muted">
                {openCount} {openCount === 1 ? "aberto" : "abertos"} · {tickets.length - openCount}{" "}
                {tickets.length - openCount === 1 ? "encerrado" : "encerrados"}
              </Text>
            ) : null}
          </Stack>
          <IconButton
            icon={X}
            label={`Fechar chamados de ${employeeFirstName}`}
            size="sm"
            onClick={onClose}
          />
        </Stack>
      </Box>
      <Divider tone="line-subtle" />

      {load.status === "loading" ? <LoadingState label="Carregando chamados…" /> : null}
      {load.status === "failed" ? (
        <Box padding="xl">
          <Alert>Não foi possível carregar os chamados agora. Tente de novo em instantes.</Alert>
        </Box>
      ) : null}
      {load.status === "ready" && tickets.length === 0 ? (
        <EmptyState title={`${employeeFirstName} não tem chamados.`} />
      ) : null}

      {load.status === "ready" && tickets.length > 0 ? (
        <ScrollArea>
          <Box paddingX="xl" paddingY="xl">
            <Stack gap="3xl">
              {thisConversation ? (
                <Stack gap="md">
                  <SectionTitle>Desta conversa</SectionTitle>
                  <Box surface="subtle" radius="xl" padding="lg">
                    <Stack gap="md">
                      <Stack gap="xs">
                        <Stack direction="row" justify="between" align="center" gap="sm">
                          <Text as="span" size="sm" tone="muted">
                            {thisConversation.code}
                          </Text>
                          <StatusLabel tone={statusTone[thisConversation.status]} size="sm">
                            {statusText[thisConversation.status]}
                          </StatusLabel>
                        </Stack>
                        <Text size="lg" weight="semibold">
                          {thisConversation.title}
                        </Text>
                        <Text size="sm" tone="muted">
                          {categoryText[thisConversation.category]} · prioridade{" "}
                          {priorityText[thisConversation.priority].toLowerCase()}
                        </Text>
                      </Stack>
                      {conversationEvent ? (
                        <>
                          <Divider tone="line" />
                          <Stack direction="row" justify="between" align="center" gap="sm">
                            <Stack direction="row" align="center" gap="sm">
                              <Icon icon={conversationEvent.icon} size="sm" tone="secondary" />
                              <Text as="span" size="xs" tone="secondary">
                                {conversationEvent.text}
                              </Text>
                            </Stack>
                            <Text as="span" size="xs" tone="muted" tabular>
                              {formatTime(conversationEvent.at)}
                            </Text>
                          </Stack>
                        </>
                      ) : null}
                    </Stack>
                  </Box>
                </Stack>
              ) : null}

              {others.length > 0 ? (
                <Stack gap="xs">
                  <SectionTitle>Outros chamados</SectionTitle>
                  <Stack as="ul" gap="none">
                    {others.map((ticket, index) => (
                      <Stack as="li" key={ticket.code} gap="none">
                        {index > 0 ? <Divider tone="line-subtle" /> : null}
                        <Disclosure
                          variant="row"
                          summary={
                            <Stack direction="row" align="start" gap="md">
                              <Box paddingY="sm">
                                <StatusDot tone={statusTone[ticket.status]} size="md" />
                              </Box>
                              <Stack gap="none">
                                <Text as="span" size="md" weight="medium">
                                  {ticket.title}
                                </Text>
                                <Text as="span" size="xs" tone="muted">
                                  {ticket.code} ·{" "}
                                  {isOpen(ticket)
                                    ? statusText[ticket.status]
                                    : `Resolvido em ${formatDayMonth(ticket.updatedAt)}`}
                                </Text>
                              </Stack>
                            </Stack>
                          }
                        >
                          <Box paddingX="xl" paddingY="none">
                            <Stack gap="xs">
                              <Text size="sm" tone="secondary">
                                {ticket.description}
                              </Text>
                              <Text size="xs" tone="muted">
                                Prioridade {priorityText[ticket.priority].toLowerCase()} ·{" "}
                                {deadlineStatus(ticket, now)}
                              </Text>
                              <Box paddingY="xs" />
                            </Stack>
                          </Box>
                        </Disclosure>
                      </Stack>
                    ))}
                  </Stack>
                </Stack>
              ) : null}
            </Stack>
          </Box>
        </ScrollArea>
      ) : null}

      <Box paddingX="lg" paddingY="lg">
        <Button
          variant="secondary"
          block
          iconEnd={ArrowUpRight}
          aria-disabled
          title="Disponível com o sistema de chamados"
        >
          Ver todos os chamados de {employeeFirstName}
        </Button>
      </Box>
    </Stack>
  );
}
