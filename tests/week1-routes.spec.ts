import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const routes = ["/tickets", "/contacts", "/protocols", "/ticket-contact-origins", "/chats", "/todolist", "/kanban"];

test.describe("Semana 1", () => {
  test("login valida campos e encaminha para atendimentos", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: "Entrar na central" })).toBeVisible();
    await page.getByLabel("Usuário").fill("");
    await page.locator('input[autocomplete="current-password"]').fill("");
    await page.getByRole("button", { name: "Entrar na central" }).click();
    await expect(page.getByText("Informe usuário e senha para continuar.")).toBeVisible();
    await page.getByLabel("Usuário").fill("demo");
    await page.locator('input[autocomplete="current-password"]').fill("demo");
    await page.getByRole("button", { name: "Entrar na central" }).click();
    await expect(page).toHaveURL(/\/tickets$/);
    await expect(page.getByRole("heading", { name: "Atendimentos" })).toBeVisible();
  });

  test("login mantém estrutura acessível", async ({ page }) => {
    await page.goto("/login");
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  for (const route of routes) {
    test(`${route} renderiza com título e heading principal`, async ({ page }) => {
      await page.goto(route);
      await expect(page.locator("main")).toBeVisible();
      await expect(page.locator("h1")).toHaveCount(1);
    });
  }
});
