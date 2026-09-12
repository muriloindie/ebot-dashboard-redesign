import { expect, test } from "@playwright/test";

const storageKeys = [
  "ebot-tags",
  "ebot-protocols",
  "ebot-aut-prompts",
  "ebot-com-typebot",
  "ebot-com-queues",
  "ebot-com-contact-lists",
  "ebot-com-contact-entries",
  "ebot-com-help",
  "ebot-com-help-videos"
];

test.beforeEach(async ({ page }) => {
  await page.goto("/login");
  await page.evaluate((keys) => {
    keys.forEach((key) => window.localStorage.removeItem(key));
  }, storageKeys);
});

test.describe("Alterações de 03/09/2026", () => {
  test("tags têm toggle de uso no Kanban que alimenta o filtro de tarefas", async ({ page }) => {
    await page.goto("/tags");
    const first = page.locator("[data-tag-item]").first();
    await expect(first.getByRole("switch")).toBeVisible();
    await page.goto("/tarefas");
    await expect(page.getByLabel("Tag do Kanban")).toBeVisible();
  });

  test("seletor de cores avançado abre HEX/RGB no modal de tag", async ({ page }) => {
    await page.goto("/tags");
    await page.getByRole("button", { name: "Nova tag" }).click();
    await page.getByRole("button", { name: "Seletor avançado" }).click();
    await expect(page.getByLabel("Código HEX")).toBeVisible();
    await expect(page.getByLabel("Canal R")).toBeVisible();
  });

  test("protocolos exibem número único e relatório em subpágina com download", async ({ page }) => {
    await page.goto("/protocolos");
    await expect(page.locator("[data-protocol-row]").first()).toContainText("#");
    await page.locator("[data-protocol-row]").first().getByRole("button", { name: /Ver relatório/ }).click();
    await expect(page).toHaveURL(/\/protocolos\/PR-/);
    await expect(page.getByText("Primeira mensagem")).toBeVisible();
    await expect(page.getByText("Atendimento iniciado")).toBeVisible();
    await expect(page.locator("[data-protocol-message]").first()).toBeVisible();
    await page.getByRole("button", { name: "Baixar" }).click();
    await expect(page.getByText("Informações anexadas", { exact: true })).toBeVisible();
    await expect(page.getByRole("checkbox", { name: /Mensagens/ })).toBeVisible();
    await expect(page.getByRole("radio", { name: /Excel/ })).toBeVisible();
  });

  test("openai virou prompts com adicionar, fila única e voz", async ({ page }) => {
    await page.goto("/openai");
    await expect(page.getByRole("button", { name: "Adicionar Prompt" }).first()).toBeVisible();
    await expect(page.locator("[data-prompt-card]").first()).toBeVisible();
    await expect(page.locator("[data-stat-card]")).toHaveCount(0);
    await page.getByRole("button", { name: "Adicionar Prompt" }).first().click();
    await page.getByLabel("Voz").selectOption("voz");
    await expect(page.getByLabel("Voz (OpenAI)")).toBeVisible();
    await expect(page.getByLabel("API da voz")).toBeVisible();
  });

  test("integrações são typebot com configurar agente", async ({ page }) => {
    await page.goto("/integracoes");
    await expect(page.getByRole("button", { name: "Adicionar Integração" })).toBeVisible();
    await expect(page.locator("[data-stat-card]")).toHaveCount(0);
    await expect(page.locator("[data-integration-card]").first()).toContainText("Typebot");
    await page.locator("[data-integration-card]").first().getByRole("button", { name: "Configurar agente" }).click();
    await expect(page.getByText("Opções de agente")).toBeVisible();
    await expect(page.getByLabel("Integração de Fila")).toBeVisible();
  });

  test("canais sem cards de cima e com 3 tons de status", async ({ page }) => {
    await page.goto("/canais");
    await expect(page.locator("[data-stat-card]")).toHaveCount(0);
    const tones = await page.locator("[data-channel-card]").evaluateAll((cards) =>
      cards.map((card) => card.getAttribute("data-channel-tone"))
    );
    expect(new Set(tones).size).toBeLessThanOrEqual(3);
    await expect(page.locator("[data-channel-card]").first().getByRole("switch")).toBeVisible();
  });

  test("listas têm visão cards e baixar com formatos", async ({ page }) => {
    await page.goto("/campanhas/listas");
    await expect(page.locator("[data-stat-card]")).toHaveCount(0);
    await page.getByRole("tab", { name: "Cards" }).click();
    await expect(page.locator("[data-contact-list-card]").first()).toBeVisible();
    await page.locator("[data-contact-list-card]").first().getByRole("button", { name: "Baixar" }).click();
    await expect(page.getByRole("radio", { name: /Excel/ })).toBeVisible();
    await expect(page.getByRole("radio", { name: /CSV/ })).toBeVisible();
  });

  test("detalhe da lista tem inválidos, importar com formato e novo", async ({ page }) => {
    await page.goto("/campanhas/listas");
    await page.locator("li").first().getByRole("button", { name: "Abrir lista" }).click();
    await expect(page.getByRole("tab", { name: /Inválidos/ })).toBeVisible();
    await expect(page.getByRole("button", { name: "Importar" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Novo" })).toBeVisible();
    await page.getByRole("button", { name: "Importar" }).click();
    await expect(page.getByText(/nome;telefone;canal;consentimento/)).toBeVisible();
  });

  test("filas têm tabela com ID/nome/cor/ordem/saudação e wizard em 2 etapas", async ({ page }) => {
    await page.goto("/filas");
    await expect(page.locator("[data-stat-card]")).toHaveCount(0);
    await expect(page.locator("[data-queue-row]").first()).toBeVisible();
    await page.getByRole("button", { name: "Adicionar fila" }).click();
    await page.getByText("Vendas, triagem e fila principal").first().click();
    await page.getByLabel("Nome").fill("Fila de teste");
    await expect(page.getByText("Dados da fila")).toBeVisible();
    await expect(page.getByRole("button", { name: "Adicionar opção" })).toBeVisible();
    await page.getByRole("button", { name: "Continuar" }).click();
    await expect(page.getByText(/Etapa 2/)).toBeVisible();
  });

  test("ajuda estilo youtube com player, recomendados e config", async ({ page }) => {
    await page.goto("/ajuda");
    await expect(page.locator("[data-help-video]").first()).toBeVisible();
    await page.locator("[data-help-video]").first().click();
    await expect(page.getByRole("heading", { name: "Recomendados" })).toBeVisible();
    await expect(page.getByText("Resposta em texto")).toBeVisible();
    await page.goto("/configuracoes?secao=ajuda");
    await expect(page.getByRole("tab", { name: "Ajuda" })).toHaveAttribute("aria-selected", "true");
    await expect(page.getByText("Conteúdo da ajuda")).toBeVisible();
    await expect(page.getByText("Sugestões da IA")).toBeVisible();
  });

  test("templates exibem balão de whatsapp e rápidas/setores sem stats", async ({ page }) => {
    await page.goto("/templates");
    await expect(page.getByText("pré-visualização · WhatsApp").first()).toBeVisible();
    await page.goto("/respostas-rapidas");
    await expect(page.locator("[data-stat-card]")).toHaveCount(0);
    await page.goto("/setores");
    await expect(page.locator("[data-stat-card]")).toHaveCount(0);
  });

  test("tarefas em lista têm estilo caderno com checkpoint", async ({ page }) => {
    await page.goto("/tarefas");
    await page.getByRole("button", { name: "Ver tarefas em lista" }).click();
    await expect(page.getByText("Novas").first()).toBeVisible();
    await expect(page.locator('[role="checkbox"]').first()).toBeVisible();
  });
});

test.describe("Ajustes finos pós-03/09", () => {
  test("kanban permite navegar arrastando o quadro", async ({ page }) => {
    await page.goto("/kanban");
    const board = page.locator("[data-kanban-board]");
    await expect(board).toBeVisible();
    await expect(board).toHaveAttribute("aria-label", /arraste/i);
  });

  test("protocolos abrem em lista justa por padrão", async ({ page }) => {
    await page.goto("/protocolos");
    await expect(page.getByRole("tab", { name: "Lista" })).toHaveAttribute("aria-selected", "true");
    await expect(page.locator("[data-protocol-row]").first()).toBeVisible();
    await page.getByRole("tab", { name: "Cards" }).click();
    await expect(page.locator("[data-protocol-card]").first()).toBeVisible();
  });

  test("usuarios sem cards de resumo", async ({ page }) => {
    await page.goto("/usuarios");
    await expect(page.locator("[data-stat-card]")).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Convidar usuário" })).toBeVisible();
  });
});
