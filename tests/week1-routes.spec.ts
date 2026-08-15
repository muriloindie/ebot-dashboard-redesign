import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const routes = ["/atendimentos", "/agenda", "/pacientes", "/contatos", "/protocolos", "/relacionamentos", "/chat-interno", "/tarefas", "/kanban"];
const secondaryRoutes = ["/canais", "/tags", "/arquivos", "/templates", "/respostas-rapidas", "/openai", "/fluxos-atendimento", "/base-conhecimento", "/campanhas", "/campanhas/listas", "/campanhas/configuracoes", "/setores", "/filas", "/usuarios", "/permissoes", "/integracoes", "/api", "/financeiro", "/configuracoes", "/ajuda", "/perfil"];

test.describe("Semana 3", () => {
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
    await expect(page).toHaveURL(/\/atendimentos$/);
    await expect(page.getByRole("heading", { name: "Atendimentos" })).toBeVisible();
  });

  test("rotas antigas redirecionam para as novas", async ({ page }) => {
    const redirects: Record<string, string> = {
      "/tickets": "/atendimentos",
      "/contacts": "/contatos",
      "/protocols": "/protocolos",
      "/ticket-contact-origins": "/relacionamentos",
      "/chats": "/chat-interno",
      "/todolist": "/tarefas"
    };
    for (const [from, to] of Object.entries(redirects)) {
      await page.goto(from);
      await expect(page).toHaveURL(new RegExp(to.replace("/", "\\/") + "$"));
    }
  });

  test("login mantém estrutura acessível", async ({ page }) => {
    await page.goto("/login");
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  for (const route of routes) {
    test(`${route} renderiza com título e heading principal`, async ({ page }) => {
      await page.goto(route);
      await expect(page.locator("main.clinical-canvas")).toBeVisible();
      await expect(page.locator("h1")).toHaveCount(1);
    });
  }

  test("Dashboard renderiza e aceita troca de tema", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /Bom dia/ })).toBeVisible();
    await page.getByRole("button", { name: /Ativar tema escuro|Ativar tema claro/ }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", /dark|light/);
  });

  for (const route of secondaryRoutes) {
    test(`${route} renderiza com título e heading principal`, async ({ page }) => {
      await page.goto(route);
      await expect(page.locator("main.clinical-canvas")).toBeVisible();
      await expect(page.locator("h1")).toHaveCount(1);
    });
  }

  test("canais permite adicionar uma conexão local", async ({ page }) => {
    await page.goto("/canais");
    await page.getByRole("button", { name: "Conectar canal" }).click();
    await page.getByLabel("Nome do canal").fill("WhatsApp Unidade Leste");
    await page.getByLabel("Número").fill("+55 11 99999-1111");
    await page.getByRole("button", { name: "Adicionar canal" }).click();
    await expect(page.getByText("Canal adicionado à fila de conexão.")).toBeVisible();
  });
});
