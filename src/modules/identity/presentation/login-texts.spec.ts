import { describe, expect, it } from "vitest";
import { credentialsProblemText, signInFailureText } from "@/modules/identity/presentation/login-texts";

describe("login texts", () => {
  it("tells an unknown employee to check the address or call the service desk", () => {
    expect(signInFailureText["unknown-employee"]).toBe(
      "Não encontramos um funcionário com esse e-mail. Confira o endereço ou ligue no ramal 4000.",
    );
  });

  it("asks to wait when the login is rate limited", () => {
    expect(signInFailureText["rate-limited"]).toBe(
      "Muitas tentativas seguidas. Aguarde um minuto e tente de novo.",
    );
  });

  it("explains each field problem in Portuguese", () => {
    expect(credentialsProblemText).toEqual({
      "email.required": "Informe seu e-mail corporativo.",
      "email.invalid": "Informe um e-mail válido, como nome@nexo.com.br.",
      "password.required": "Informe sua senha.",
    });
  });
});
