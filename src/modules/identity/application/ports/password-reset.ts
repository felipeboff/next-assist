export interface PasswordReset {
  /** Asks for a reset link to be sent to the corporate e-mail. */
  request(email: string): Promise<void>;
}
