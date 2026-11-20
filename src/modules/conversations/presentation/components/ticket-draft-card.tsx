"use client";

import { useState } from "react";
import {
  validateDraftEdit,
  type DraftEdit,
  type DraftEditProblems,
  type TicketDraft,
  type TicketUpdateDraft,
} from "@/modules/conversations/domain/ticket-draft";
import { affectedText, draftTexts } from "@/modules/conversations/presentation/conversation-texts";
import { categoryText, priorityText, priorityTone } from "@/modules/tickets/client";
import { formatMoment } from "@/shared/presentation/format-date";
import {
  Box,
  Button,
  DescriptionList,
  Divider,
  Kbd,
  Stack,
  StatusLabel,
  Text,
  TextAreaField,
  TextField,
} from "@/shared/presentation/ui";

type Actions = {
  busy: boolean;
  shortcut: { glyphs: string; spoken: string };
  onConfirm: () => void;
  onCancel: () => void;
};

function DraftFooter({ busy, shortcut, onConfirm, onCancel, onEdit }: Actions & { onEdit?: () => void }) {
  return (
    <Box surface="subtle" paddingX="sm" paddingY="sm">
      <Stack direction="row" gap="xs" align="center">
        <Button variant="primary" onClick={onConfirm} disabled={busy} aria-keyshortcuts={shortcut.spoken}>
          {draftTexts.confirm}
          <Kbd tone="on-primary" label={shortcut.spoken}>
            {shortcut.glyphs}
          </Kbd>
        </Button>
        {onEdit ? (
          <Button variant="secondary" onClick={onEdit} disabled={busy}>
            {draftTexts.edit}
          </Button>
        ) : null}
        <Button variant="ghost" onClick={onCancel} disabled={busy}>
          {draftTexts.cancel}
        </Button>
      </Stack>
    </Box>
  );
}

function DraftStatus({ status, createdLabel }: { status: TicketDraft["status"]; createdLabel: string }) {
  if (status === "awaiting-confirmation") {
    return (
      <StatusLabel tone="warning" size="sm">
        {draftTexts.awaiting}
      </StatusLabel>
    );
  }
  if (status === "cancelled") {
    return (
      <StatusLabel tone="muted" size="sm">
        {draftTexts.cancelled}
      </StatusLabel>
    );
  }
  return (
    <StatusLabel tone="warning" size="sm">
      {createdLabel}
    </StatusLabel>
  );
}

export type TicketDraftCardProps = Actions & {
  draft: TicketDraft;
  now: Date;
  onEdit: (edit: DraftEdit) => Promise<boolean>;
};

/** The ticket the agent proposes, to confirm, edit or cancel (Annex A: nothing is created before). */
export function TicketDraftCard({ draft, now, onEdit, ...actions }: TicketDraftCardProps) {
  const [editing, setEditing] = useState(false);
  const [edit, setEdit] = useState<DraftEdit>({ title: draft.title, description: draft.description });
  const [problems, setProblems] = useState<DraftEditProblems>({});
  const awaiting = draft.status === "awaiting-confirmation";

  function startEditing() {
    setEdit({ title: draft.title, description: draft.description });
    setProblems({});
    setEditing(true);
  }

  async function save() {
    const check = validateDraftEdit(edit);
    if (!check.ok) {
      setProblems(check.problems);
      return;
    }
    if (await onEdit(check.edit)) {
      setEditing(false);
    }
  }

  return (
    <Box surface="canvas" border="line-soft" radius="xl" shadow="card" clip>
      <Box paddingX="lg" paddingY="lg">
        <Stack gap="md">
          <Stack gap="xs">
            <Stack direction="row" justify="between" align="center" gap="md">
              <Text as="span" size="sm" tone="muted">
                {draft.ticketCode
                  ? `${draftTexts.createdTicket} · ${draft.ticketCode}`
                  : `${draftTexts.newTicket} · ${draftTexts.draft(draft.id)}`}
              </Text>
              <DraftStatus status={draft.status} createdLabel="Aguardando analista" />
            </Stack>
            {editing ? (
              <Stack gap="md" paddingTop="xs">
                <TextField
                  name="title"
                  label={draftTexts.title}
                  value={edit.title}
                  onChange={(event) => setEdit({ ...edit, title: event.target.value })}
                  error={problems.title ? draftTexts.titleRequired : undefined}
                  disabled={actions.busy}
                />
                <TextAreaField
                  name="description"
                  label={draftTexts.description}
                  value={edit.description}
                  onChange={(description) => setEdit({ ...edit, description })}
                  error={problems.description ? draftTexts.descriptionRequired : undefined}
                  disabled={actions.busy}
                />
              </Stack>
            ) : (
              <>
                <Text size="xl" weight="semibold">
                  {draft.title}
                </Text>
                <Text size="sm" tone="secondary">
                  {draft.description}
                </Text>
              </>
            )}
          </Stack>
          <Divider tone="line-subtle" />
          <DescriptionList
            columns={3}
            items={[
              { label: draftTexts.category, value: categoryText[draft.category] },
              {
                label: draftTexts.priority,
                value: (
                  <Stack direction="row" align="center" gap="xs" wrap>
                    <StatusLabel tone={priorityTone[draft.priority]} size="md" text="plain">
                      {priorityText[draft.priority]}
                    </StatusLabel>
                    <Text as="span" size="sm" tone="muted">
                      · {draftTexts.respondBy(formatMoment(draft.respondBy, now))}
                    </Text>
                  </Stack>
                ),
              },
              { label: draftTexts.affected, value: affectedText[draft.affected] },
            ]}
          />
        </Stack>
      </Box>
      {awaiting && editing ? (
        <Box surface="subtle" paddingX="sm" paddingY="sm">
          <Stack direction="row" gap="xs">
            <Button variant="primary" onClick={save} disabled={actions.busy}>
              {draftTexts.save}
            </Button>
            <Button variant="ghost" onClick={() => setEditing(false)} disabled={actions.busy}>
              {draftTexts.discard}
            </Button>
          </Stack>
        </Box>
      ) : null}
      {awaiting && !editing ? <DraftFooter {...actions} onEdit={startEditing} /> : null}
    </Box>
  );
}

export type TicketUpdateCardProps = Actions & { draft: TicketUpdateDraft };

/** New information for an open ticket, to confirm or cancel. */
export function TicketUpdateCard({ draft, ...actions }: TicketUpdateCardProps) {
  const awaiting = draft.status === "awaiting-confirmation";
  return (
    <Box surface="canvas" border="line-soft" radius="xl" shadow="card" clip>
      <Box paddingX="lg" paddingY="lg">
        <Stack gap="xs">
          <Stack direction="row" justify="between" align="center" gap="md">
            <Text as="span" size="sm" tone="muted">
              {draftTexts.updateTicket} · {draft.ticketCode}
            </Text>
            <DraftStatus status={draft.status} createdLabel={draftTexts.updated} />
          </Stack>
          <Text size="xs" tone="muted">
            {draftTexts.information}
          </Text>
          <Text size="md">{draft.note}</Text>
        </Stack>
      </Box>
      {awaiting ? <DraftFooter {...actions} /> : null}
    </Box>
  );
}
