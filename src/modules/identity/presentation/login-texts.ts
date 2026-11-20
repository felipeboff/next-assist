import type { CredentialsProblem } from "@/modules/identity/domain/credentials";
import type { SignInFailure } from "@/modules/identity/domain/sign-in-failure";

export const SERVICE_DESK_EXTENSION = "4000";

export const credentialsProblemText: Record<CredentialsProblem, string> = {
  "email.required": "Informe seu e-mail corporativo.",
  "email.invalid": "Informe um e-mail válido, como nome@nexo.com.br.",
  "password.required": "Informe sua senha.",
};

export const signInFailureText: Record<SignInFailure, string> = {
  "unknown-employee": `Não encontramos um funcionário com esse e-mail. Confira o endereço ou ligue no ramal ${SERVICE_DESK_EXTENSION}.`,
  "rate-limited": "Muitas tentativas seguidas. Aguarde um minuto e tente de novo.",
  unavailable: "Não foi possível entrar agora. Verifique sua conexão e tente de novo.",
};

export const passwordHelpText = `A senha é a mesma da rede Nexo. Para redefinir, ligue no ramal ${SERVICE_DESK_EXTENSION}.`;
