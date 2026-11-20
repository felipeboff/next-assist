/** PRD: an employee sends at most 30 messages per session. */
export const MESSAGE_LIMIT = 30;

export function canSendMessage(sentCount: number): boolean {
  return sentCount < MESSAGE_LIMIT;
}

export class MessageLimitReachedError extends Error {
  constructor() {
    super(`The session reached its limit of ${MESSAGE_LIMIT} messages`);
    this.name = "MessageLimitReachedError";
  }
}
