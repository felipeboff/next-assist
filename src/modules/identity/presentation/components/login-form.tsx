"use client";

import { ArrowRight, Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import type { CredentialsProblems } from "@/modules/identity/domain/credentials";
import { useIdentityDependencies } from "@/modules/identity/presentation/identity-dependencies";
import {
  credentialsProblemText,
  passwordHelpText,
  signInFailureText,
} from "@/modules/identity/presentation/login-texts";
import {
  Alert,
  Button,
  Checkbox,
  Divider,
  Form,
  Heading,
  PasswordField,
  Stack,
  Text,
  TextField,
} from "@/shared/presentation/ui";

function fieldValue(data: FormData, name: string): string {
  const value = data.get(name);
  return typeof value === "string" ? value : "";
}

export function LoginForm() {
  const { signIn } = useIdentityDependencies();
  const router = useRouter();
  const [problems, setProblems] = useState<CredentialsProblems>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [showPasswordHelp, setShowPasswordHelp] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const input = {
      email: fieldValue(data, "email"),
      password: fieldValue(data, "password"),
      rememberMe: data.get("rememberMe") === "on",
    };

    setFormError(null);
    startTransition(async () => {
      const result = await signIn(input);
      if (result.status === "invalid") {
        setProblems(result.problems);
        return;
      }
      setProblems({});
      if (result.status === "failed") {
        setFormError(signInFailureText[result.failure]);
        return;
      }
      router.replace("/");
      router.refresh();
    });
  }

  return (
    <Stack gap="2xl" width="full">
      <Stack gap="sm">
        <Heading level={1} size="display-md" id="login-title">
          Entrar
        </Heading>
        <Text size="md" tone="muted">
          Use seu e-mail corporativo e a senha da rede Nexo.
        </Text>
      </Stack>

      <Form onSubmit={handleSubmit} busy={isPending} gap="lg" aria-labelledby="login-title">
        {formError ? <Alert tone="danger">{formError}</Alert> : null}

        <TextField
          name="email"
          type="email"
          label="E-mail corporativo"
          icon={Mail}
          placeholder="nome@nexo.com.br"
          autoComplete="username"
          inputMode="email"
          autoFocus
          required
          disabled={isPending}
          error={problems.email ? credentialsProblemText[problems.email] : undefined}
        />

        <PasswordField
          name="password"
          label="Senha"
          icon={Lock}
          placeholder="Digite sua senha"
          autoComplete="current-password"
          required
          disabled={isPending}
          error={problems.password ? credentialsProblemText[problems.password] : undefined}
          labelAction={
            <Button
              variant="link"
              size="sm"
              aria-expanded={showPasswordHelp}
              onClick={() => setShowPasswordHelp((current) => !current)}
            >
              Esqueci minha senha
            </Button>
          }
          hint={showPasswordHelp ? passwordHelpText : undefined}
        />

        <Stack paddingTop="xs">
          <Checkbox
            name="rememberMe"
            label="Manter conectado neste computador"
            defaultChecked
            disabled={isPending}
          />
        </Stack>

        <Stack paddingTop="md" gap="2xl">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            block
            iconEnd={ArrowRight}
            loading={isPending}
            loadingLabel="Entrando…"
          >
            Entrar
          </Button>
          <Divider tone="line-subtle" />
        </Stack>
      </Form>
    </Stack>
  );
}
