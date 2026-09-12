import { expect, test } from "@playwright/test";

const storageKeys = [
  "ebot-contacts",
  "ebot-week2-contacts",
  "ebot-week2-clients",
  "ebot-kanban-columns",
  "ebot-week2-kanban-tasks",
  "ebot-tags"
];

test.beforeEach(async ({ page }) => {
  await page.goto("/login");
  await page.evaluate((keys) => {
    keys.forEach((key) => window.localStorage.removeItem(key));
  }, storageKeys);
});

test.describe("Alterações de 02/09/2026", () => {
  test("mantém a configuração do Kanban dentro de Configurações", async ({ page }) => {
    await page.goto("/configuracoes?secao=kanban");

    await expect(page.getByRole("heading", { name: "Configurações" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Kanban" })).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("heading", { name: "Colunas do quadro" })).toBeVisible();
    await expect(page.locator("[data-column-row]")).toHaveCount(6);

    await page.locator("[data-column-row]").first().getByLabel("Nome da coluna").fill("Entrada empresa");
    await page.locator("[data-column-row]").first().getByLabel("Limite de cartões (WIP)").fill("3");
    await page.getByRole("button", { name: "Salvar configuração" }).first().click();
    await expect(page.getByText("Configuração do Kanban salva.")).toBeVisible();

    await expect.poll(async () => page.evaluate(() => JSON.parse(window.localStorage.getItem("ebot-kanban-columns") ?? "[]")[0]?.label)).toBe("Entrada empresa");
    await page.goto("/kanban");
    await expect(page.getByRole("heading", { name: "Entrada empresa" })).toBeVisible();
    await expect(page.locator('[data-column-id="Novo"]')).toContainText("3");
  });

  test("impede sobreposição das colunas do Kanban em viewport estreita", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/kanban");

    const board = page.locator("[data-kanban-board]");
    await expect(board).toBeVisible();
    await expect(page.locator("[data-kanban-col]")).toHaveCount(6);
    const geometry = await board.evaluate((element) => {
      const columns = Array.from(element.querySelectorAll<HTMLElement>("[data-kanban-col]"));
      const rects = columns.map((column) => column.getBoundingClientRect());
      return {
        bodyOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        columnsOverlap: rects.some((rect, index) => index > 0 && rect.left < rects[index - 1].right - 1),
        hasInternalScroll: element.scrollWidth > element.clientWidth,
        minimumWidth: Math.min(...rects.map((rect) => rect.width))
      };
    });

    expect(geometry.bodyOverflow).toBe(false);
    expect(geometry.columnsOverlap).toBe(false);
    expect(geometry.hasInternalScroll).toBe(true);
    expect(geometry.minimumWidth).toBeGreaterThanOrEqual(280);
  });

  test("unifica Clientes e Contatos em uma lista e uma visualização de cards", async ({ page }) => {
    await page.goto("/contatos");

    await expect(page.getByRole("heading", { name: "Contatos" })).toBeVisible();
    await expect(page.getByText("Clientes ativos", { exact: true })).toHaveCount(0);
    await expect(page.getByRole("tab", { name: "Lista" })).toHaveAttribute("aria-selected", "true");
    await expect(page.locator("[data-contact-item]").first()).toBeVisible();
    const listCount = await page.locator("[data-contact-item]").count();
    expect(listCount).toBeGreaterThan(10);

    await page.getByRole("tab", { name: "Cards" }).click();
    await expect(page.getByRole("tab", { name: "Cards" })).toHaveAttribute("aria-selected", "true");
    await expect(page.locator("[data-contact-list]")).toBeVisible();
    await expect(page.locator("[data-contact-item]")).toHaveCount(listCount);
    await expect(page.locator("[data-contact-item]").first()).toContainText(/WhatsApp|Instagram|E-mail|Telefone|Site/);
  });

  test("persiste um novo contato na base unificada", async ({ page }) => {
    await page.goto("/contatos");
    await page.getByRole("button", { name: "Adicionar contato" }).click();
    const dialog = page.getByRole("dialog", { name: "Adicionar contato" });
    await expect(dialog).toBeVisible();
    await dialog.getByLabel("Nome completo").fill("Contato de teste");
    await dialog.getByLabel("Telefone / WhatsApp").fill("+55 11 90000-0000");
    await dialog.getByRole("textbox", { name: "E-mail" }).fill("teste@exemplo.com");
    await dialog.getByRole("button", { name: "Salvar contato" }).click();

    await expect(page.getByText("Contato adicionado à base unificada.")).toBeVisible();
    await expect(page.getByText("Contato de teste", { exact: true }).first()).toBeVisible();
    await expect.poll(async () => page.evaluate(() => JSON.parse(window.localStorage.getItem("ebot-contacts") ?? "[]").some((row: { name: string }) => row.name === "Contato de teste"))).toBe(true);
  });

  test("alterna Tags entre cards e lista sem perder registros", async ({ page }) => {
    await page.goto("/tags");
    await expect(page.getByRole("tab", { name: "Cards" })).toHaveAttribute("aria-selected", "true");
    const cardCount = await page.locator("[data-tag-item]").count();
    expect(cardCount).toBeGreaterThan(0);

    await page.getByRole("tab", { name: "Lista" }).click();
    await expect(page.getByRole("tab", { name: "Lista" })).toHaveAttribute("aria-selected", "true");
    await expect(page.locator("[data-tag-item]")).toHaveCount(cardCount);
    await expect(page.getByRole("list", { name: "Lista de tags" })).toBeVisible();
  });

  test("abre o relatório e as mensagens pela subpágina", async ({ page }) => {
    await page.goto("/protocolos");
    const protocol = page.locator('[data-protocol-id="PR-2026-0112"]');
    await expect(protocol).toBeVisible();
    await protocol.getByRole("button", { name: "Ver relatório do protocolo #46-20260812083959" }).click();

    await expect(page).toHaveURL(/\/protocolos\/PR-2026-0112/);
    await expect(page.getByRole("heading", { name: "Relatório #46-20260812083959" })).toBeVisible();
    await expect(page.getByText("Logs da conversa")).toBeVisible();
    await expect(page.getByText("Amanda Souza", { exact: true }).first()).toBeVisible();
    await expect(page.locator("[data-protocol-message]")).toHaveCount(4);
    await expect(page.getByText("somente leitura", { exact: false }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: /editar|excluir|enviar/i })).toHaveCount(0);
  });

  test("renderiza Canais em cards compactos com marcas identificáveis", async ({ page }) => {
    await page.goto("/canais");
    await expect(page.locator("[data-channel-card]")).toHaveCount(4);
    await expect(page.locator('[data-brand="whatsapp"]')).toHaveCount(2);
    await expect(page.locator('[data-brand="instagram"]')).toHaveCount(1);
    await expect(page.locator('[data-brand="email"]')).toHaveCount(1);

    const width = await page.locator('[data-channel-card]').first().evaluate((element) => element.getBoundingClientRect().width);
    expect(width).toBeLessThanOrEqual(420);
  });
});
