import { expect, test } from "@playwright/test";
import { people, signIn } from "./support/session";

test.describe("roles", () => {
  test("each role is sent to its home: analyst to /console, employee to /", async ({ page }) => {
    await signIn(page, people.rafael.email);
    await page.goto("/");
    await expect(page).toHaveURL(/\/console$/);
    await page.goto("/perfil");
    await expect(page).toHaveURL(/\/console$/);
  });

  test("each role is sent to its home: employee away from /console", async ({ page }) => {
    await signIn(page, people.bruno.email);
    await page.goto("/console");
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByText("Olá, Bruno. Como posso ajudar?")).toBeVisible();
  });

  test("each role is sent to its home: no session goes to /login", async ({ page }) => {
    for (const path of ["/perfil", "/console"]) {
      await page.goto(path);
      await expect(page).toHaveURL(/\/login$/);
    }
  });
});
