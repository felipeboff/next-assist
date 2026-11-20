"use client";

import { AlertCircle, ArrowRightLeft, Bot, MessageSquareText } from "lucide-react";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import type { ChatConversation, ChatEmployee, ChatEntry } from "@/modules/conversations/domain/chat";
import { MESSAGE_LIMIT, canSendMessage } from "@/modules/conversations/domain/message-limit";
import type { DraftEdit } from "@/modules/conversations/domain/ticket-draft";
import { AgentReplyView } from "@/modules/conversations/presentation/components/agent-reply-view";
import { chatTexts, firstNameOf } from "@/modules/conversations/presentation/conversation-texts";
import { useConversationsDependencies } from "@/modules/conversations/presentation/conversations-dependencies";
import { formatTime } from "@/shared/presentation/format-date";
import {
  Alert,
  Box,
  Breadcrumb,
  Button,
  Composer,
  EmptyState,
  EventDivider,
  Icon,
  LoadingState,
  MessageBubble,
  ScrollArea,
  Stack,
  Tag,
  Text,
  TopBar,
  TypingIndicator,
} from "@/shared/presentation/ui";

type Pending = { text: string | null };

function subscribeNothing() {
  return () => {};
}

/** ⌘↵ on a Mac, Ctrl ↵ elsewhere; the server renders the generic one. */
function useConfirmShortcut() {
  const isMac = useSyncExternalStore(
    subscribeNothing,
    () => /Mac|iPhone|iPad/.test(navigator.userAgent),
    () => false,
  );
  return isMac ? { glyphs: "⌘↵", spoken: "Meta+Enter" } : { glyphs: "Ctrl ↵", spoken: "Control+Enter" };
}

/** The reply holding a draft that still waits for confirmation, if any. */
function pendingDraftEntryId(conversation: ChatConversation | null): string | null {
  const entry = [...(conversation?.entries ?? [])]
    .reverse()
    .find(
      (candidate) =>
        candidate.kind === "agent" &&
        candidate.reply.parts.some(
          (part) =>
            (part.kind === "ticket-draft" || part.kind === "ticket-update") &&
            part.draft.status === "awaiting-confirmation",
        ),
    );
  return entry?.id ?? null;
}

export function ChatScreen({ employee }: { employee: ChatEmployee }) {
  const { employeeChat } = useConversationsDependencies();
  const [conversation, setConversation] = useState<ChatConversation | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [pending, setPending] = useState<Pending | null>(null);
  const [failedText, setFailedText] = useState<string | null>(null);
  const [actionFailed, setActionFailed] = useState(false);
  const [message, setMessage] = useState("");
  const shortcut = useConfirmShortcut();
  const firstName = firstNameOf(employee.name);

  useEffect(() => {
    let current = true;
    employeeChat
      .open(employee)
      .then((opened) => current && setConversation(opened))
      .catch(() => current && setLoadFailed(true));
    return () => {
      current = false;
    };
  }, [employeeChat, employee]);

  const run = useCallback(
    async (command: () => Promise<ChatConversation>, text: string | null = null): Promise<boolean> => {
      setPending({ text });
      setFailedText(null);
      setActionFailed(false);
      try {
        setConversation(await command());
        return true;
      } catch {
        if (text === null) {
          setActionFailed(true);
        } else {
          setFailedText(text);
        }
        return false;
      } finally {
        setPending(null);
      }
    },
    [],
  );

  const send = (text: string) => run(() => employeeChat.send(employee, text), text);

  const draftEntryId = pendingDraftEntryId(conversation);
  const busy = pending !== null;
  useEffect(() => {
    if (!draftEntryId || busy) {
      return;
    }
    const entryId = draftEntryId;
    function confirmOnShortcut(event: KeyboardEvent) {
      if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        void run(() => employeeChat.confirmDraft(employee, entryId));
      }
    }
    window.addEventListener("keydown", confirmOnShortcut);
    return () => window.removeEventListener("keydown", confirmOnShortcut);
  }, [draftEntryId, busy, run, employeeChat, employee]);

  const waiting = conversation?.state === "waiting-analyst";
  const sentCount = conversation?.sentCount ?? 0;
  const limitReached = !canSendMessage(sentCount);
  const now = new Date();

  function renderEntry(entry: ChatEntry) {
    switch (entry.kind) {
      case "employee":
        return (
          <MessageBubble key={entry.id} from="user" size="md" measure="md">
            {entry.text}
          </MessageBubble>
        );
      case "event":
        return (
          <EventDivider key={entry.id} icon={ArrowRightLeft}>
            {chatTexts.transferred(entry.team, formatTime(entry.at))}
          </EventDivider>
        );
      case "agent":
        return (
          <AgentReplyView
            key={entry.id}
            reply={entry.reply}
            now={now}
            handlers={{
              interactive: entry.id === conversation?.awaitingReplyId && !limitReached,
              busy,
              shortcut,
              onAnswer: (option) => run(() => employeeChat.answer(employee, entry.id, option), option),
              onPick: (code) => run(() => employeeChat.pickTicket(employee, entry.id, code), code),
              onConfirm: () => run(() => employeeChat.confirmDraft(employee, entry.id)),
              onCancel: () => run(() => employeeChat.cancelDraft(employee, entry.id)),
              onEdit: (edit: DraftEdit) => run(() => employeeChat.editDraft(employee, entry.id, edit)),
            }}
          />
        );
    }
  }

  const entries = conversation?.entries ?? [];

  return (
    <>
      <TopBar
        start={<Breadcrumb items={chatTexts.breadcrumb} />}
        end={
          waiting ? (
            <Tag tone="warning" size="md" icon={Bot}>
              {chatTexts.waiting}
            </Tag>
          ) : (
            <Tag tone="success" size="md" dot="success">
              {chatTexts.online}
            </Tag>
          )
        }
      />

      {loadFailed ? (
        <Box width="thread" centered paddingY="5xl">
          <Alert>{chatTexts.loadFailed}</Alert>
        </Box>
      ) : null}
      {!conversation && !loadFailed ? <LoadingState label={chatTexts.loading} /> : null}

      {conversation ? (
        <>
          <ScrollArea label={chatTexts.threadLabel} followEnd={`${entries.length}-${busy}-${failedText}`}>
            <Box width="thread" centered paddingTop="5xl" paddingBottom="lg">
              {entries.length === 0 && !pending && !failedText ? (
                <EmptyState
                  icon={MessageSquareText}
                  title={chatTexts.greeting(firstName)}
                  description={chatTexts.greetingHint}
                >
                  <Stack direction="row" gap="sm" wrap justify="center">
                    {conversation.suggestions.map((suggestion) => (
                      <Button key={suggestion} variant="secondary" onClick={() => send(suggestion)}>
                        {suggestion}
                      </Button>
                    ))}
                  </Stack>
                </EmptyState>
              ) : (
                <Stack gap="xl">
                  {entries.map(renderEntry)}
                  {pending?.text ? (
                    <MessageBubble from="user" size="md" measure="md">
                      {pending.text}
                    </MessageBubble>
                  ) : null}
                  {failedText ? (
                    <Stack gap="xs" align="end">
                      <MessageBubble from="user" size="md" measure="md">
                        {failedText}
                      </MessageBubble>
                      <Stack direction="row" gap="sm" align="center">
                        <Icon icon={AlertCircle} size="sm" tone="danger" />
                        <Text as="span" size="xs" tone="danger">
                          {chatTexts.sendFailed}
                        </Text>
                        <Button variant="link" size="sm" onClick={() => send(failedText)}>
                          {chatTexts.retry}
                        </Button>
                      </Stack>
                    </Stack>
                  ) : null}
                  {busy && !waiting ? <TypingIndicator label={chatTexts.typing} /> : null}
                </Stack>
              )}
            </Box>
          </ScrollArea>

          <Box width="thread" centered paddingY="lg">
            <Stack gap="sm">
              {waiting ? <Alert tone="info">{chatTexts.waitingNotice}</Alert> : null}
              {actionFailed ? <Alert>{chatTexts.actionFailed}</Alert> : null}
              <Composer
                label={chatTexts.composerLabel}
                placeholder={chatTexts.placeholder}
                value={message}
                onChange={setMessage}
                submitLabel={chatTexts.send}
                disabled={limitReached}
                disabledPlaceholder={chatTexts.limitReached(MESSAGE_LIMIT)}
                submitBlocked={busy}
                onSubmit={() => {
                  const text = message.trim();
                  setMessage("");
                  void send(text);
                }}
                footnote={chatTexts.counter(sentCount, MESSAGE_LIMIT)}
              />
            </Stack>
          </Box>
        </>
      ) : null}
    </>
  );
}
