import { expect, test } from "@playwright/test";

test.describe("Módulo de automação", () => {
  test("fluxos-atendimento redireciona para fluxos-automacao", async ({ page }) => {
    await page.goto("/fluxos-atendimento");
    await expect(page).toHaveURL(/\/fluxos-automacao$/);
  });

  test("fluxos-automacao renderiza lista de fluxos", async ({ page }) => {
    await page.goto("/fluxos-automacao");
    await expect(page.locator("main.ebot-canvas")).toBeVisible();
    await expect(page.getByRole("heading", { name: /Fluxos de automa/ })).toBeVisible();
    await expect(page.getByText("Primeiro agendamento").first()).toBeVisible();
    await expect(page.getByRole("button", { name: /Novo fluxo/ }).first()).toBeVisible();
  });

  test("editor de fluxo renderiza canvas e paleta de nós", async ({ page }) => {
    await page.goto("/fluxos-automacao/wf-primeira-agendamento");
    await expect(page.getByLabel("Nome do fluxo")).toHaveValue("Primeiro agendamento");
    await expect(page.locator(".react-flow")).toBeVisible();
    await expect(page.getByText("Primeira mensagem").first()).toBeVisible();
  });

  test("templates renderiza loja com grid", async ({ page }) => {
    await page.goto("/templates");
    await expect(page.getByRole("heading", { name: /Templates/ })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Confirmação de agendamento D-1" })).toBeVisible();
    await page.getByRole("button", { name: /Ver estrutura/ }).first().click();
    await expect(page.getByRole("button", { name: "Editar template" })).toBeVisible();
  });

  test("base-conhecimento renderiza bases e abre detalhes", async ({ page }) => {
    await page.goto("/base-conhecimento");
    await expect(page.getByRole("heading", { name: "Base de conhecimento" })).toBeVisible();
    await expect(page.getByText("Protocolos comerciais e orientações")).toBeVisible();
    await page.getByRole("button", { name: "Gerenciar" }).first().click();
    await expect(page.getByText("Grafo de conhecimento")).toBeVisible();
  });

  test("respostas-rapidas permite criar nova resposta", async ({ page }) => {
    await page.goto("/respostas-rapidas");
    await expect(page.getByRole("heading", { name: "Respostas rápidas" })).toBeVisible();
    await page.getByRole("button", { name: "Nova resposta" }).click();
    await page.getByLabel("Título").fill("Horário de funcionamento");
    const editor = page.getByLabel("Texto da resposta");
    await editor.click();
    await page.keyboard.type("Atendemos de segunda a sexta das 7h às 19h.");
    await page.getByRole("button", { name: "Criar resposta" }).click();
    await expect(page.getByText("Resposta rápida criada.")).toBeVisible();
  });

  test("respostas-rapidas insere variáveis por clique e arrasto", async ({ page }) => {
    await page.goto("/respostas-rapidas");
    await page.getByRole("button", { name: "Nova resposta" }).click();
    const editor = page.getByLabel("Texto da resposta");
    await page.getByTitle("Inserir {{nome_cliente}}").click();
    await expect(editor).toContainText("{{nome_cliente}}");
    await page.getByTitle("Inserir {{horario_atendimento}}").dragTo(editor);
    await expect(editor).toContainText("{{horario_atendimento}}");
    await expect(editor).toContainText("{{nome_cliente}}");
    await expect(page.getByText("Detectadas no texto:")).toBeVisible();
  });

  test("openai gerencia prompts com fila e voz", async ({ page }) => {
    await page.goto("/openai");
    await expect(page.getByRole("heading", { name: "OpenAI — Prompts" })).toBeVisible();
    await expect(page.getByText("Triagem de atendimento")).toBeVisible();
    await page.getByRole("button", { name: "Adicionar Prompt" }).first().click();
    await page.getByLabel("Nome").fill("Prompt de teste");
    await page.getByLabel("API Key").fill("sk-teste");
    await page.getByRole("textbox", { name: "Prompt" }).fill("Responda com objetividade.");
    await expect(page.getByLabel("Voz")).toBeVisible();
    await page.getByLabel("Voz").selectOption("voz");
    await expect(page.getByLabel("Voz (OpenAI)")).toBeVisible();
  });
});
