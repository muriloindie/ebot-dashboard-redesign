import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/login");
  await page.evaluate(() => {
    ["ebot-crm-leads", "ebot-crm"].forEach((key) => window.localStorage.removeItem(key));
  });
});

test.describe("Redesign Ê-Bot — navegação e CRM", () => {
  test("menu exibe Clientes, CRM e Kanban no acesso rápido e não exibe mais o bloco Clínica", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("aside").getByRole("button", { name: /Clientes/ }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: "Clínica", exact: true })).toHaveCount(0);

    await page.locator("aside").getByRole("button", { name: /^CRM/ }).first().click();
    await expect(page).toHaveURL(/\/crm$/);
    await expect(page.getByRole("heading", { name: "CRM" })).toBeVisible();

    await page.goto("/");
    await page.locator("aside").getByRole("button", { name: "Kanban", exact: true }).click();
    await expect(page).toHaveURL(/\/kanban$/);
    await expect(page.getByRole("heading", { name: "Kanban" })).toBeVisible();
  });

  test("CRM mostra insights do funil e permite criar lead", async ({ page }) => {
    await page.goto("/crm");
    await expect(page.getByRole("heading", { name: "CRM" })).toBeVisible();
    await expect(page.getByText("Valor em pipeline").first()).toBeVisible();
    await expect(page.getByText("Qualificação pela IA").first()).toBeVisible();
    await expect(page.locator("[data-crm-col]")).toHaveCount(6);
    await expect(page.locator("[data-crm-card]").first()).toBeVisible();

    await page.getByRole("button", { name: "Novo lead" }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await dialog.getByLabel("Nome").fill("Lead de teste");
    await dialog.getByPlaceholder("+55 46 99999-0000").fill("+55 46 90000-0000");
    await dialog.getByLabel("Valor estimado (R$)").fill("2500");
    await dialog.getByRole("button", { name: "Adicionar lead" }).click();
    await expect(page.getByText("Lead Lead de teste adicionado ao funil.")).toBeVisible();
    await expect(page.locator('[data-lead-id^="LEAD-"]').filter({ hasText: "Lead de teste" }).first()).toBeVisible();
  });

  test("CRM abre o drawer do lead com histórico", async ({ page }) => {
    await page.goto("/crm");
    await page.locator("[data-crm-card]").first().click();
    await expect(page.getByText("Histórico do lead")).toBeVisible();
    await expect(page.getByText("Mover etapa")).toBeVisible();
    await expect(page.getByRole("button", { name: /Marcar como ganho/ })).toBeVisible();
  });

  test("dashboard CRM exibe KPIs, funil e menus de gráfico/painel unificados", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Pipeline aberto").first()).toBeVisible();
    await expect(page.getByText("Ganhos no mês").first()).toBeVisible();
    await expect(page.getByText("Leads qualificados").first()).toBeVisible();
    await expect(page.getByText("Conversão do funil").first()).toBeVisible();
    await expect(page.getByText("CRM · Funil comercial")).toBeVisible();

    await expect(page.getByRole("heading", { name: "Ganhos e pipeline por mês" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Próximas ações do funil" })).toBeVisible();

    await page.getByRole("tab", { name: "Fluxo por hora" }).click();
    await expect(page.getByRole("heading", { name: "Fluxo por hora" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Resolvidos por IA" })).toBeVisible();

    await page.getByRole("tab", { name: "Leads por origem" }).click();
    await expect(page.getByRole("heading", { name: "Leads por origem" })).toBeVisible();
    await expect(page.getByText("WhatsApp", { exact: true }).first()).toBeVisible();

    await page.getByRole("button", { name: /Ver CRM/ }).click();
    await expect(page).toHaveURL(/\/crm$/);
  });

  test("fila de atendimentos tem só a busca e seções com cores próprias", async ({ page }) => {
    await page.goto("/atendimentos");
    await expect(page.getByPlaceholder("Nome ou texto da conversa")).toBeVisible();
    await expect(page.getByLabel("Filtrar fila por status")).toHaveCount(0);
    await expect(page.getByLabel("Ordenar fila")).toHaveCount(0);
    await expect(page.locator("[data-queue-panel]")).toHaveClass(/border-t-ebot-slate/);
    await expect(page.locator("[data-chat-panel]")).toHaveClass(/border-t-ebot-primary/);
    const rows = page.locator("[data-attendance-item]");
    await expect(rows.first()).toBeVisible();
    expect(await rows.count()).toBeGreaterThan(0);
  });

  test("botão da data abre tarefas do dia com link para a agenda", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Ver tarefas de hoje" }).click();
    await expect(page.getByText("Tarefas de hoje")).toBeVisible();
    await expect(page.getByText("Confirmar primeira avaliação").first()).toBeVisible();
    await page.getByRole("button", { name: "Ver agenda completa" }).click();
    await expect(page).toHaveURL(/\/agenda$/);
  });

  test("aparência aplica mudanças em tempo real e persiste ao salvar", async ({ page }) => {
    await page.goto("/retaguarda/aparencia");
    await page.evaluate(() => window.localStorage.setItem("ebot-theme", "light"));
    await page.reload();
    await expect(page.getByRole("heading", { name: "Aparência" })).toBeVisible();

    await page.getByRole("button", { name: "Grafite" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-accent", "grafite");
    const primary = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--ebot-primary").trim());
    expect(primary).toBe("93 115 126");

    await page.getByRole("button", { name: "escuro", exact: true }).click();
    await expect(page.locator("html")).toHaveAttribute("data-sidebar", "escuro");

    await page.getByRole("button", { name: "Compacta" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-density", "compacta");

    await page.getByRole("switch", { name: /Animações de entrada/ }).click();
    await expect(page.locator("html")).toHaveAttribute("data-motion", "off");

    const logoInput = page.getByLabel("Nome exibido no logo");
    await logoInput.fill("Ê-Bot Operações");
    await expect(page.locator("aside").getByText("Ê-Bot Operações").first()).toBeVisible();

    await page.getByRole("button", { name: "Salvar aparência" }).first().click();
    await expect(page.getByText("Aparência aplicada e salva em todo o painel.")).toBeVisible();
    await expect.poll(async () => page.evaluate(() => JSON.parse(window.localStorage.getItem("ebot-system-appearance") ?? "{}").accent)).toBe("Grafite");
  });

  test("terminologia de pacientes não aparece nas telas principais", async ({ page }) => {
    for (const route of ["/", "/contatos", "/atendimentos", "/crm", "/agenda"]) {
      await page.goto(route);
      await expect(page.locator("body")).not.toContainText(/paciente/i);
    }
  });

  test("rota /clientes redireciona para a base de contatos", async ({ page }) => {
    await page.goto("/clientes");
    await expect(page).toHaveURL(/\/contatos$/);
  });

  test("rotas do bloco Clínica não existem mais", async ({ page }) => {
    for (const route of ["/profissionais", "/convenios", "/exames", "/agenda-google"]) {
      await page.goto(route);
      await expect(page.getByRole("heading", { name: "Módulo não encontrado" })).toBeVisible();
    }
  });

  test("paleta nova aplicada no tema claro e escuro", async ({ page }) => {
    await page.goto("/login");
    await page.evaluate(() => window.localStorage.setItem("ebot-theme", "light"));
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await expect.poll(() => page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe("rgb(225, 229, 238)");

    await page.evaluate(() => window.localStorage.setItem("ebot-theme", "dark"));
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect.poll(() => page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe("rgb(13, 14, 16)");
  });
});
