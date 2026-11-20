import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { PasswordCard } from "@/modules/identity/presentation/components/password-card";
import { IdentityDependenciesProvider } from "@/modules/identity/presentation/identity-dependencies";

function renderCard(requestPasswordReset: (email: string) => Promise<void>) {
  render(
    <IdentityDependenciesProvider value={{ signIn: vi.fn(), signOut: vi.fn(), requestPasswordReset }}>
      <PasswordCard email="ana.souza@nexo.com.br" age="Alterada há 42 dias" />
    </IdentityDependenciesProvider>,
  );
}

describe("PasswordCard", () => {
  it("confirms the link was sent and offers to send it again", async () => {
    const user = userEvent.setup();
    const request = vi.fn(() => Promise.resolve());
    renderCard(request);

    expect(
      screen.getByText("Enviaremos um link de redefinição para ana.souza@nexo.com.br."),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Redefinir senha" }));

    expect(
      await screen.findByText("Enviamos um link de redefinição para ana.souza@nexo.com.br."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reenviar link" })).toBeEnabled();
    expect(request).toHaveBeenCalledWith("ana.souza@nexo.com.br");
  });

  it("explains a failed reset and enables the button again", async () => {
    const user = userEvent.setup();
    renderCard(vi.fn(() => Promise.reject(new Error("down"))));

    await user.click(screen.getByRole("button", { name: "Redefinir senha" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Não foi possível enviar o link agora. Tente de novo em instantes.",
    );
    expect(screen.getByRole("button", { name: "Redefinir senha" })).toBeEnabled();
  });
});
