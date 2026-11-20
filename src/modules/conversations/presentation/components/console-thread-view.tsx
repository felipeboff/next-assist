import { ArrowRightLeft, Bot, CheckCheck, CircleCheckBig, Headset } from "lucide-react";
import { Fragment } from "react";
import type { ConsoleEntry, ConsoleEventKind } from "@/modules/conversations/domain/console-thread";
import { DecisionDetail } from "@/modules/conversations/presentation/components/decision-detail";
import {
  AGENT_NAME,
  consoleTexts,
  decisionTexts,
  eventText,
} from "@/modules/conversations/presentation/conversation-texts";
import { formatDayMonth, formatTime } from "@/shared/presentation/format-date";
import { localDayIndex } from "@/shared/domain/local-time";
import {
  Disclosure,
  EventDivider,
  Icon,
  MessageBubble,
  Stack,
  Tag,
  Text,
  type IconGlyph,
} from "@/shared/presentation/ui";

export const eventIcon: Record<ConsoleEventKind, IconGlyph> = {
  transferred: ArrowRightLeft,
  "taken-over": Headset,
  "handed-back": Bot,
  closed: CircleCheckBig,
};

function dayLabel(at: Date, now: Date): string {
  const days = localDayIndex(now) - localDayIndex(at);
  if (days === 0) {
    return consoleTexts.today;
  }
  return days === 1 ? consoleTexts.yesterday : formatDayMonth(at);
}

function Delivered({ at }: { at: Date }) {
  return (
    <>
      {formatTime(at)}
      <Icon icon={CheckCheck} size="xs" tone="primary" />
    </>
  );
}

function EntryView({ entry }: { entry: ConsoleEntry }) {
  switch (entry.kind) {
    case "employee":
      return (
        <MessageBubble from="assistant" tone="canvas" size="md" measure="wide" meta={formatTime(entry.at)}>
          {entry.text}
        </MessageBubble>
      );
    case "agent":
      return (
        <Disclosure
          align="end"
          hint={decisionTexts.showDetail}
          summary={
            <Stack direction="row" align="center" gap="sm">
              <Text as="span" size="xs" weight="medium" tone="secondary">
                {AGENT_NAME}
              </Text>
              <Tag tone="primary" size="xs" shape="rounded">
                {consoleTexts.aiBadge}
              </Tag>
            </Stack>
          }
          preview={
            <Stack align="end" paddingTop="xs">
              <MessageBubble
                from="user"
                tone="primary"
                size="md"
                measure="wide"
                meta={<Delivered at={entry.at} />}
              >
                {entry.text}
              </MessageBubble>
            </Stack>
          }
        >
          <Stack align="end" paddingTop="sm">
            <DecisionDetail decision={entry.decision} />
          </Stack>
        </Disclosure>
      );
    case "analyst":
      return (
        <Stack align="end" gap="xs">
          <Stack direction="row" align="center" gap="sm">
            <Text as="span" size="xs" weight="medium" tone="secondary">
              {entry.analyst.name}
            </Text>
            <Tag tone="success-tint" size="xs" shape="rounded">
              {entry.analyst.team}
            </Tag>
          </Stack>
          <MessageBubble
            from="user"
            tone="success"
            size="md"
            measure="wide"
            meta={<Delivered at={entry.at} />}
          >
            {entry.text}
          </MessageBubble>
        </Stack>
      );
    case "event":
      return (
        <EventDivider icon={eventIcon[entry.event]}>
          {eventText(entry.event, entry.actor, formatTime(entry.at))}
        </EventDivider>
      );
  }
}

/** The conversation's history, with a date marker where the day changes. */
export function ConsoleThreadView({ entries, now }: { entries: readonly ConsoleEntry[]; now: Date }) {
  return (
    <Stack gap="md">
      {entries.map((entry, index) => {
        const previous = entries[index - 1];
        const newDay = !previous || localDayIndex(previous.at) !== localDayIndex(entry.at);
        return (
          <Fragment key={entry.id}>
            {newDay ? (
              <Stack paddingTop={index === 0 ? "none" : "md"}>
                <EventDivider variant="pill">{dayLabel(entry.at, now)}</EventDivider>
              </Stack>
            ) : null}
            <EntryView entry={entry} />
          </Fragment>
        );
      })}
    </Stack>
  );
}
