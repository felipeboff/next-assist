import { expect, type Page } from "@playwright/test";

export const people = {
  ana: { email: "ana.souza@nexo.com.br", name: "Ana Souza" },
  bruno: { email: "bruno.carvalho@nexo.com.br", name: "Bruno Carvalho" },
  rafael: { email: "rafael.nunes@nexo.com.br", name: "Rafael Nunes" },
} as const;

/** Signs a seeded person in through the login screen (any password is accepted). */
export async function signIn(page: Page, email: string): Promise<void> {
  await page.goto("/login");
  await page.getByLabel("E-mail corporativo").fill(email);
  await page.getByLabel("Senha", { exact: true }).fill("123456");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).not.toHaveURL(/\/login$/);
  // Next.js keeps the previous route hidden in the DOM (React Activity); start each test clean.
  await page.reload();
}
