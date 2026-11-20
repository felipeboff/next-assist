"use client";

import {
  Bot,
  CircleCheckBig,
  EllipsisVertical,
  Hand,
  Headset,
  LogOut,
  MessageCircle,
  Search,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  countByFilter,
  filterConversations,
  orderConversations,
  searchConversations,
  type ConsoleAnalyst,
  type ConsoleConversation,
  type ConsoleFilter,
} from "@/modules/conversations/domain/console-list";
import { lastEventOf, type ConsoleThread } from "@/modules/conversations/domain/console-thread";
import { normalizeForMatch } from "@/modules/conversations/domain/text-match";
import {
  ConsoleThreadView,
  eventIcon,
} from "@/modules/conversations/presentation/components/console-thread-view";
import { ConversationListItem } from "@/modules/conversations/presentation/components/conversation-list-item";
import {
  consoleTexts,
  firstNameOf,
  panelEventText,
} from "@/modules/conversations/presentation/conversation-texts";
import { useConversationsDependencies } from "@/modules/conversations/presentation/conversations-dependencies";
import { useSignOut } from "@/modules/identity/client";
import { EmployeeTicketsPanel } from "@/modules/tickets/client";
import { formatTime } from "@/shared/presentation/format-date";
import {
  Alert,
  Avatar,
  Box,
  Brand,
  Button,
  Composer,
  ConfirmDialog,
  ConsoleLayout,
  Divider,
  EmptyState,
  FilterChips,
  Heading,
  Icon,
  IconButton,
  Link,
  LoadingState,
  Menu,
  ScrollArea,
  SearchField,
  SelectableRow,
  Stack,
  Tag,
  Text,
  type MenuItem,
} from "@/shared/presentation/ui";

export type ConsoleAnalystUser = Readonly<{ id: string; name: string; email: string }>;

type Action = "take-over" | "hand-back" | "close" | "reply";

const ANALYST_TEAM = "Suporte N2";

function FooterNotice({
  icon,
  title,
  detail,
  tone,
}: {
  icon: typeof Hand;
  title: string;
  detail?: string;
  tone: "warning" | "neutral";
}) {
  return (
    <Stack direction="row" align="center" gap="md" grow>
      <Box surface={tone === "warning" ? "warning-soft" : "subtle"} radius="full" padding="sm">
        <Icon icon={icon} size="md" tone={tone === "warning" ? "warning" : "secondary"} />
      </Box>
      <Stack gap="none">
        <Text size="sm" weight="semibold" truncate>
          {title}
        </Text>
        {detail ? (
          <Text size="xs" tone="muted">
            {detail}
          </Text>
        ) : null}
      </Stack>
    </Stack>
  );
}

export function ConsoleScreen({ analyst }: { analyst: ConsoleAnalystUser }) {
  const { analystConsole } = useConversationsDependencies();
  const { signOut } = useSignOut();
  const me: ConsoleAnalyst = { id: analyst.id, name: analyst.name, team: ANALYST_TEAM };

  const [conversations, setConversations] = useState<readonly ConsoleConversation[] | null>(null);
  const [listFailed, setListFailed] = useState(false);
  const [filter, setFilter] = useState<ConsoleFilter>("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [thread, setThread] = useState<ConsoleThread | null>(null);
  const [panelOpen, setPanelOpen] = useState(true);
  const [busy, setBusy] = useState<Action | null>(null);
  const [failure, setFailure] = useState<Action | null>(null);
  const [confirmingClose, setConfirmingClose] = useState(false);
  const [reply, setReply] = useState("");
  const [threadSearch, setThreadSearch] = useState<string | null>(null);
  const selectedRef = useRef<string | null>(null);

  const openConversation = useCallback(
    (conversationId: string) => {
      selectedRef.current = conversationId;
      setSelectedId(conversationId);
      setThread(null);
      setFailure(null);
      setReply("");
      setThreadSearch(null);
      analystConsole
        .thread(conversationId)
        .then((loaded) => selectedRef.current === conversationId && setThread(loaded))
        .catch(() => setFailure("reply"));
    },
    [analystConsole],
  );

  useEffect(() => {
    let current = true;
    analystConsole
      .list()
      .then((list) => {
        if (!current) {
          return;
        }
        setConversations(list);
        const first = orderConversations(list).at(0);
        if (first) {
          openConversation(first.id);
        }
      })
      .catch(() => current && setListFailed(true));
    return () => {
      current = false;
    };
  }, [analystConsole, openConversation]);

  useEffect(
    () =>
      analystConsole.subscribe(() => {
        void analystConsole.list().then(setConversations);
        const open = selectedRef.current;
        if (open) {
          void analystConsole
            .thread(open)
            .then((loaded) => selectedRef.current === open && setThread(loaded));
        }
      }),
    [analystConsole],
  );

  async function act(action: Action, command: () => Promise<ConsoleThread>): Promise<boolean> {
    setBusy(action);
    setFailure(null);
    try {
      setThread(await command());
      setConversations(await analystConsole.list());
      return true;
    } catch {
      setFailure(action);
      return false;
    } finally {
      setBusy(null);
    }
  }

  const now = new Date();
  const all = conversations ?? [];
  const counts = countByFilter(all, me.id);
  const visible = orderConversations(searchConversations(filterConversations(all, filter, me.id), search));
  const waitingCount = counts["for-you"];

  const conversation = thread?.conversation ?? null;
  const firstName = conversation ? firstNameOf(conversation.employee.name) : "";
  const attendedByMe = conversation?.status === "with-analyst" && conversation.attendant?.id === me.id;
  const waiting = conversation?.status === "waiting-analyst";
  const lastEvent = thread ? lastEventOf(thread) : null;

  const term = threadSearch === null ? "" : normalizeForMatch(threadSearch);
  const shownEntries =
    thread && term
      ? thread.entries.filter(
          (entry) => entry.kind !== "event" && normalizeForMatch(entry.text).includes(term),
        )
      : (thread?.entries ?? []);

  const menuItems: MenuItem[] = conversation
    ? [
        {
          label: panelOpen ? consoleTexts.hideTickets(firstName) : consoleTexts.showTickets(firstName),
          onSelect: () => setPanelOpen((open) => !open),
        },
        ...(attendedByMe
          ? [
              { label: consoleTexts.searchConversation, icon: Search, onSelect: () => setThreadSearch("") },
              {
                label: consoleTexts.close,
                icon: CircleCheckBig,
                tone: "danger" as const,
                onSelect: () => setConfirmingClose(true),
              },
            ]
          : []),
      ]
    : [];

  const rail = (
    <>
      <Link href="/console">
        <Brand variant="mark" />
      </Link>
      <IconButton
        icon={MessageCircle}
        label={consoleTexts.railConversations}
        variant="tile"
        size="lg"
        current
        badge={waitingCount}
        badgeLabel={consoleTexts.railWaiting}
      />
      <Stack grow />
      <Menu
        label={consoleTexts.account(analyst.name)}
        trigger={<Avatar name={analyst.name} size="sm" tone="blue" online />}
        placement="right-end"
        header={
          <Stack gap="none">
            <Text size="sm" weight="semibold">
              {analyst.name}
            </Text>
            <Text size="xs" tone="muted">
              {analyst.email}
            </Text>
          </Stack>
        }
        items={[{ label: consoleTexts.signOut, icon: LogOut, onSelect: signOut }]}
      />
    </>
  );

  const list = (
    <>
      <Box paddingX="lg" paddingY="lg">
        <Stack gap="md">
          <Stack direction="row" justify="between" align="center">
            <Heading level={1} size="section">
              {consoleTexts.title}
            </Heading>
            <Tag tone="success" size="md" dot="success">
              {consoleTexts.available}
            </Tag>
          </Stack>
          <SearchField
            label={consoleTexts.searchLabel}
            placeholder={consoleTexts.searchLabel}
            value={search}
            onChange={setSearch}
          />
          <FilterChips
            label={consoleTexts.filtersLabel}
            value={filter}
            onChange={setFilter}
            options={(["all", "for-you", "with-agent", "mine"] as const).map((value) => ({
              value,
              label: consoleTexts.filters[value],
              count: value === "all" ? undefined : counts[value],
            }))}
          />
        </Stack>
      </Box>
      {listFailed ? (
        <Box paddingX="lg">
          <Alert>{consoleTexts.loadFailed}</Alert>
        </Box>
      ) : null}
      {!conversations && !listFailed ? <LoadingState label={consoleTexts.loadingList} /> : null}
      {conversations && visible.length === 0 ? (
        <EmptyState
          title={search.trim() ? consoleTexts.noResults(search.trim()) : consoleTexts.emptyFilter}
        />
      ) : null}
      {conversations && visible.length > 0 ? (
        <ScrollArea>
          <Stack as="ul" gap="none">
            {visible.map((item, index) => (
              <Stack as="li" key={item.id} gap="none">
                <Box paddingX="sm">
                  <SelectableRow selected={item.id === selectedId} onSelect={() => openConversation(item.id)}>
                    <Box paddingX="sm" paddingY="sm">
                      <ConversationListItem conversation={item} analystId={me.id} now={now} />
                    </Box>
                  </SelectableRow>
                  {/* A line under each item from the text column, but none touching the open one. */}
                  {item.id !== selectedId && visible[index + 1]?.id !== selectedId ? (
                    <Box paddingX="lg">
                      <Divider tone="line-subtle" insetStart="7xl" />
                    </Box>
                  ) : null}
                </Box>
              </Stack>
            ))}
          </Stack>
        </ScrollArea>
      ) : null}
    </>
  );

  function footer() {
    if (!conversation) {
      return null;
    }
    const locked = (
      <Composer
        variant="round"
        label={consoleTexts.composerLabel}
        placeholder={consoleTexts.composerLocked}
        value=""
        onChange={() => {}}
        onSubmit={() => {}}
        submitLabel={consoleTexts.send}
        disabled
        disabledPlaceholder={
          conversation.status === "closed" || conversation.status === "resolved-by-agent"
            ? consoleTexts.finished
            : consoleTexts.composerLocked
        }
      />
    );
    if (attendedByMe) {
      return (
        <Composer
          variant="round"
          label={consoleTexts.composerLabel}
          placeholder={consoleTexts.replyPlaceholder(firstName)}
          value={reply}
          onChange={setReply}
          submitLabel={consoleTexts.send}
          submitBlocked={busy !== null}
          onSubmit={() => {
            const text = reply;
            setReply("");
            void act("reply", () => analystConsole.reply(me, conversation.id, text)).then(
              (sent) => !sent && setReply(text),
            );
          }}
        />
      );
    }
    if (waiting) {
      return (
        <Stack gap="md">
          <Stack direction="row" align="center" gap="md">
            <FooterNotice
              icon={Hand}
              tone="warning"
              title={consoleTexts.waitsForAnalyst(firstName)}
              detail={
                conversation.transfer
                  ? consoleTexts.agentPaused(formatTime(conversation.transfer.respondBy))
                  : undefined
              }
            />
            <Button
              variant="secondary"
              iconStart={Bot}
              loading={busy === "hand-back"}
              disabled={busy !== null}
              onClick={() => act("hand-back", () => analystConsole.handBack(me, conversation.id))}
            >
              {consoleTexts.handBack}
            </Button>
            <Button
              variant="primary"
              iconStart={Headset}
              loading={busy === "take-over"}
              disabled={busy !== null}
              onClick={() => act("take-over", () => analystConsole.takeOver(me, conversation.id))}
            >
              {consoleTexts.takeOver}
            </Button>
          </Stack>
          {locked}
        </Stack>
      );
    }
    if (conversation.status === "with-agent") {
      return (
        <Stack gap="md">
          <Stack direction="row" align="center" gap="md">
            <FooterNotice icon={Bot} tone="neutral" title={consoleTexts.agentAttending} />
            <Button
              variant="primary"
              iconStart={Headset}
              loading={busy === "take-over"}
              disabled={busy !== null}
              onClick={() => act("take-over", () => analystConsole.takeOver(me, conversation.id))}
            >
              {consoleTexts.takeOver}
            </Button>
          </Stack>
          {locked}
        </Stack>
      );
    }
    if (conversation.status === "with-analyst") {
      return (
        <Stack gap="md">
          <FooterNotice
            icon={Headset}
            tone="neutral"
            title={consoleTexts.otherAttending(conversation.attendant?.name ?? "")}
          />
          {locked}
        </Stack>
      );
    }
    return (
      <Stack gap="md">
        <FooterNotice icon={CircleCheckBig} tone="neutral" title={consoleTexts.finished} />
        {locked}
      </Stack>
    );
  }

  const main = !selectedId ? (
    <EmptyState icon={MessageCircle} title={consoleTexts.noConversation} />
  ) : !thread || !conversation ? (
    failure ? (
      <Box padding="2xl">
        <Alert>{consoleTexts.actionFailed(consoleTexts.actionWords.reply)}</Alert>
      </Box>
    ) : (
      <LoadingState label={consoleTexts.loadingThread} />
    )
  ) : (
    <>
      <Box surface="canvas" paddingX="xl" paddingY="md">
        <Stack direction="row" align="center" gap="md">
          <Avatar name={conversation.employee.name} size="lg" tone="blue" />
          <Stack gap="none" grow>
            <Heading level={2} size="subtitle">
              {conversation.employee.name}
            </Heading>
            <Text size="xs" tone="muted">
              {[
                conversation.employee.online ? consoleTexts.online : consoleTexts.offline,
                conversation.employee.department,
                ...(waiting && conversation.ticketCode ? [conversation.ticketCode] : []),
              ].join(" · ")}
            </Text>
          </Stack>
          {waiting ? (
            <Tag tone="warning" size="md" icon={Bot}>
              {consoleTexts.waitingTag}
            </Tag>
          ) : null}
          {attendedByMe ? (
            <>
              <Button
                variant="secondary"
                iconStart={Bot}
                loading={busy === "hand-back"}
                disabled={busy !== null}
                onClick={() => act("hand-back", () => analystConsole.handBack(me, conversation.id))}
              >
                {consoleTexts.handBack}
              </Button>
              <Button
                variant="danger-soft"
                iconStart={CircleCheckBig}
                disabled={busy !== null}
                onClick={() => setConfirmingClose(true)}
              >
                {consoleTexts.close}
              </Button>
            </>
          ) : (
            <IconButton
              icon={Search}
              label={consoleTexts.searchConversation}
              onClick={() => setThreadSearch("")}
            />
          )}
          <Menu label={consoleTexts.moreActions} icon={EllipsisVertical} items={menuItems} />
        </Stack>
      </Box>
      <Divider tone="line-subtle" />
      {threadSearch !== null ? (
        <Box surface="canvas" paddingX="xl" paddingY="sm">
          <Stack direction="row" align="center" gap="md">
            <SearchField
              label={consoleTexts.searchConversation}
              placeholder={consoleTexts.searchConversation}
              value={threadSearch}
              onChange={setThreadSearch}
              size="sm"
              autoFocus
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  setThreadSearch(null);
                }
              }}
            />
            {term ? (
              <Text as="span" size="xs" tone="muted" nowrap role="status">
                {consoleTexts.matches(shownEntries.length)}
              </Text>
            ) : null}
            <IconButton
              icon={X}
              label={consoleTexts.closeSearch}
              size="sm"
              onClick={() => setThreadSearch(null)}
            />
          </Stack>
        </Box>
      ) : null}
      <ScrollArea label={consoleTexts.threadLabel} followEnd={`${conversation.id}-${thread.entries.length}`}>
        <Box paddingX="3xl" paddingY="3xl">
          <ConsoleThreadView entries={shownEntries} now={now} />
        </Box>
      </ScrollArea>
      <Box surface="canvas" paddingX="xl" paddingY="lg">
        <Stack gap="md">
          {failure ? <Alert>{consoleTexts.actionFailed(consoleTexts.actionWords[failure])}</Alert> : null}
          {footer()}
        </Stack>
      </Box>
      <ConfirmDialog
        open={confirmingClose}
        title={consoleTexts.closeDialogTitle(conversation.employee.name)}
        description={consoleTexts.closeDialogBody(firstName)}
        confirmLabel={consoleTexts.closeConfirm}
        busy={busy === "close"}
        onCancel={() => setConfirmingClose(false)}
        onConfirm={() => {
          void act("close", () => analystConsole.close(me, conversation.id)).then(() =>
            setConfirmingClose(false),
          );
        }}
      />
    </>
  );

  return (
    <ConsoleLayout
      rail={rail}
      list={list}
      listLabel={consoleTexts.listLabel}
      panel={
        conversation && panelOpen ? (
          <EmployeeTicketsPanel
            employeeEmail={conversation.employee.email}
            employeeFirstName={firstName}
            conversationTicketCode={conversation.ticketCode}
            conversationEvent={
              lastEvent
                ? {
                    icon: eventIcon[lastEvent.event],
                    text: panelEventText(lastEvent.event, lastEvent.actor),
                    at: lastEvent.at,
                  }
                : null
            }
            refreshKey={`${conversation.id}-${conversation.status}`}
            onClose={() => setPanelOpen(false)}
          />
        ) : null
      }
      panelLabel={consoleTexts.panelLabel}
    >
      {main}
    </ConsoleLayout>
  );
}
