export interface CredentialReader {
  /** When the user's password credential last changed, or null when they have none. */
  passwordChangedAt(userId: string): Promise<Date | null>;
}
