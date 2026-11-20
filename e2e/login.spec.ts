import { expect, test, type Page } from "@playwright/test";

const seededEmployee = { email: "ana.souza@nexo.com.br", firstName: "Ana" };

async function fillAndSubmit(page: Page, email: string, password: string) {
  await page.getByLabel("E-mail corporativo").fill(email);
  await page.getByLabel("Senha", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Entrar" }).click();
}

test.describe("login (Screen 1)", () => {
  test("shows the login form and the Nexo Assist presentation", async ({ page }) => {
    await page.goto("/login");

    await expect(page).toHaveTitle("Entrar · Nexo Assist");
    await expect(page.getByRole("heading", { level: 1, name: "Entrar" })).toBeVisible();
    await expect(page.getByLabel("E-mail corporativo")).toBeFocused();
    await expect(page.getByRole("checkbox", { name: "Manter conectado neste computador" })).toBeChecked();
    await expect(page.getByLabel("E-mail corporativo")).toHaveAttribute("placeholder", "nome@nexo.com.br");
    await expect(page.getByLabel("Senha", { exact: true })).toHaveAttribute(
      "placeholder",
      "Digite sua senha",
    );
    await expect(
      page.getByRole("heading", { level: 2, name: "Seu problema de TI, resolvido em uma conversa." }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Ligue no ramal 4000" })).toHaveAttribute("href", "tel:4000");
  });

  test("redirects to the login page when there is no session", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveURL(/\/login$/);
  });

  test("sends a stale session cookie to the login page instead of the protected area", async ({
    page,
    context,
    baseURL,
  }) => {
    await context.addCookies([
      { name: "better-auth.session_token", value: "stale-token.signature", url: baseURL ?? "" },
    ]);

    await page.goto("/");

    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole("heading", { level: 1, name: "Entrar" })).toBeVisible();
  });

  test("asks for the e-mail and the password before calling the server", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: "Entrar" }).click();

    await expect(page.getByText("Informe seu e-mail corporativo.")).toBeVisible();
    await expect(page.getByText("Informe sua senha.")).toBeVisible();
    await expect(page.getByLabel("E-mail corporativo")).toHaveAttribute("aria-invalid", "true");
  });

  test("rejects an e-mail that is not an employee of the seed data", async ({ page }) => {
    await page.goto("/login");
    await fillAndSubmit(page, "visitante@nexo.com.br", "qualquer-senha");

    await expect(page.getByRole("form", { name: "Entrar" }).getByRole("alert")).toHaveText(
      "Não encontramos um funcionário com esse e-mail. Confira o endereço ou ligue no ramal 4000.",
    );
    await expect(page).toHaveURL(/\/login$/);
  });

  test("signs a seeded employee in with any password and signs out again", async ({ page }) => {
    await page.goto("/login");
    await fillAndSubmit(page, seededEmployee.email, `any-${Date.now()}`);

    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByText(`Olá, ${seededEmployee.firstName}. Como posso ajudar?`)).toBeVisible();

    await page.goto("/login");
    await expect(page).toHaveURL(/\/$/);

    // By keyboard: in development the Next.js indicator may float over the sidebar's corner.
    await page.getByRole("button", { name: "Sair" }).press("Enter");
    await expect(page).toHaveURL(/\/login$/);
    await page.goto("/");
    await expect(page).toHaveURL(/\/login$/);
  });

  test("toggles the password visibility", async ({ page }) => {
    await page.goto("/login");
    const password = page.getByLabel("Senha", { exact: true });
    await password.fill("segredo");

    await expect(password).toHaveAttribute("type", "password");
    await page.getByRole("button", { name: "Mostrar senha" }).click();
    await expect(password).toHaveAttribute("type", "text");
    await page.getByRole("button", { name: "Ocultar senha" }).click();
    await expect(password).toHaveAttribute("type", "password");
  });

  test("explains how to reset the password", async ({ page }) => {
    await page.goto("/login");
    const forgot = page.getByRole("button", { name: "Esqueci minha senha" });

    await forgot.click();

    await expect(forgot).toHaveAttribute("aria-expanded", "true");
    await expect(
      page.getByText("A senha é a mesma da rede Nexo. Para redefinir, ligue no ramal 4000."),
    ).toBeVisible();
  });
});
