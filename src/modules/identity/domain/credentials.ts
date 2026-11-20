export type Credentials = Readonly<{
  email: string;
  password: string;
  rememberMe: boolean;
}>;

export type CredentialsField = "email" | "password";

export type CredentialsProblem = "email.required" | "email.invalid" | "password.required";

export type CredentialsProblems = Partial<Record<CredentialsField, CredentialsProblem>>;

export type CredentialsCheck =
  { ok: true; credentials: Credentials } | { ok: false; problems: CredentialsProblems };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function checkCredentials(input: Credentials): CredentialsCheck {
  const email = input.email.trim().toLowerCase();
  const problems: CredentialsProblems = {};

  if (!email) {
    problems.email = "email.required";
  } else if (!EMAIL_PATTERN.test(email)) {
    problems.email = "email.invalid";
  }
  if (!input.password) {
    problems.password = "password.required";
  }

  if (problems.email || problems.password) {
    return { ok: false, problems };
  }
  return { ok: true, credentials: { email, password: input.password, rememberMe: input.rememberMe } };
}
