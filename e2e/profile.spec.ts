import { expect, test } from "@playwright/test";
import { people, signIn } from "./support/session";

test.describe("employee profile", () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page, people.ana.email);
  });

  test("Meu perfil shows the employee's data", async ({ page }) => {
    await page
      .getByRole("navigation", { name: "Navegação principal" })
      .getByRole("link", { name: "Meu perfil" })
      .click();

    await expect(page).toHaveURL(/\/perfil$/);
    await expect(page).toHaveTitle("Meu perfil · Nexo Assist");
    await expect(page.getByRole("heading", { level: 1, name: "Meu perfil" })).toBeVisible();
    await expect(page.getByText("Seus dados de acesso ao service desk de TI.")).toBeVisible();
    const data = page.getByRole("definition");
    await expect(data.filter({ hasText: people.ana.name })).toBeVisible();
    await expect(data.filter({ hasText: people.ana.email })).toBeVisible();
    await expect(page.getByText("Gerenciado pela TI")).toBeVisible();
    await expect(page.getByText("Senha", { exact: true })).toBeVisible();
    await expect(page.getByText(/^Alterada (hoje|há 1 dia|há ([2-9]|\d{2,}) dias)$/)).toBeVisible();
    await expect(page.getByText(`Enviaremos um link de redefinição para ${people.ana.email}.`)).toBeVisible();
  });

  test("Redefinir senha confirms the link was sent", async ({ page }) => {
    await page.goto("/perfil");
    await page.getByRole("button", { name: "Redefinir senha" }).click();

    await expect(page.getByText(`Enviamos um link de redefinição para ${people.ana.email}.`)).toBeVisible();
    await expect(page.getByRole("button", { name: "Reenviar link" })).toBeEnabled();
  });
});
