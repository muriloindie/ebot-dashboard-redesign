import { expect, test } from "@playwright/test";

const moduleRoutes: Record<string, string> = {
  "/campanhas": "Campanhas",
  "/campanhas/listas": "Listas de contatos",
  "/campanhas/configuracoes": "Configurações de campanha",
  "/setores": "Setores",
  "/filas": "Filas",
  "/usuarios": "Usuários",
  "/permissoes": "Permissões",
  "/integracoes": "Integrações",
  "/api": "API",
  "/financeiro": "Financeiro",
  "/configuracoes": "Configurações",
  "/ajuda": "Centro de ajuda"
};

test.describe("Módulos de comunicação, clínica e sistema", () => {
  for (const [route, heading] of Object.entries(moduleRoutes)) {
    test(`${route} renderiza com título e heading principal`, async ({ page }) => {
      await page.goto(route);
      await expect(page.locator("main.clinical-canvas")).toBeVisible();
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.getByRole("heading", { name: heading })).toBeVisible();
    });
  }

  test("campanhas abre o modal de nova campanha", async ({ page }) => {
    await page.goto("/campanhas");
    await expect(page.getByText("Lembrete de retorno pós-consulta")).toBeVisible();
    await page.getByRole("button", { name: "Nova campanha" }).click();
    await expect(page.getByText("Configure público, canal e agendamento.")).toBeVisible();
  });

  test("campanhas/listas abre o modal de nova lista", async ({ page }) => {
    await page.goto("/campanhas/listas");
    await expect(page.getByText("Pacientes atendidos em julho")).toBeVisible();
    await page.getByRole("button", { name: "Nova lista" }).click();
    await expect(page.getByText("Combine filtros para formar o público da campanha.")).toBeVisible();
  });

  test("campanhas/configuracoes salva as regras de envio", async ({ page }) => {
    await page.goto("/campanhas/configuracoes");
    await expect(page.getByLabel("Limite diário de mensagens")).toHaveValue("500");
    await page.getByRole("button", { name: "Salvar configurações" }).first().click();
    await expect(page.getByText("Configurações de campanha salvas.")).toBeVisible();
  });

  test("setores permite criar um novo setor", async ({ page }) => {
    await page.goto("/setores");
    await expect(page.getByText("Cardiologia")).toBeVisible();
    await page.getByRole("button", { name: "Novo setor" }).click();
    await page.getByLabel("Nome do setor").fill("Radiologia");
    await page.getByRole("button", { name: "Criar setor" }).click();
    await expect(page.getByText(/Setor "Radiologia" criado\./)).toBeVisible();
    await expect(page.getByRole("heading", { name: "Radiologia" })).toBeVisible();
  });

  test("filas permite criar fila vinculada a um setor", async ({ page }) => {
    await page.goto("/filas");
    await expect(page.getByText("Recepção geral")).toBeVisible();
    await page.getByRole("button", { name: "Nova fila" }).click();
    await page.getByLabel("Nome da fila").fill("Encaminhamento interno");
    await page.getByLabel("Setor").selectOption({ label: "Atendimento" });
    await page.getByRole("button", { name: "Criar fila" }).click();
    await expect(page.getByText(/Fila "Encaminhamento interno" criada\./)).toBeVisible();
    await expect(page.getByRole("heading", { name: "Encaminhamento interno" })).toBeVisible();
  });

  test("usuarios permite convidar um novo membro", async ({ page }) => {
    await page.goto("/usuarios");
    await expect(page.getByText("Marina Costa")).toBeVisible();
    await page.getByRole("button", { name: "Convidar membro" }).click();
    await page.getByLabel("Nome completo").fill("Ana Souza");
    await page.getByLabel("E-mail").fill("ana@ebotclinical.com.br");
    await page.getByLabel("Papel (define as permissões)").selectOption({ index: 1 });
    await expect(page.getByText(/Este papel libera \d+ módulos?/)).toBeVisible();
    await page.getByRole("button", { name: "Enviar convite" }).click();
    await expect(page.getByText("Convite enviado para ana@ebotclinical.com.br.")).toBeVisible();
    await expect(page.getByText("Ana Souza")).toBeVisible();
  });

  test("permissoes cria um novo papel", async ({ page }) => {
    await page.goto("/permissoes");
    await page.getByRole("button", { name: "Novo papel" }).click();
    await page.getByLabel("Nome do papel").fill("Recepção noturna");
    await page.getByRole("button", { name: "Criar papel" }).click();
    await expect(page.getByText(/Papel "Recepção noturna" criado\./)).toBeVisible();
    await expect(page.getByRole("heading", { name: "Recepção noturna" })).toBeVisible();
    await page.getByRole("button", { name: /Excluir papel/ }).last().click();
    await page.getByText("Excluir papel", { exact: true }).click();
    await expect(page.getByText(/Papel "Recepção noturna" excluído\./)).toBeVisible();
  });

  test("permissoes alterna o nível de acesso ao clicar", async ({ page }) => {
    await page.goto("/permissoes");
    await page.getByTitle(/Dashboard: Total/).first().click();
    await expect(page.getByText(/"Dashboard" para Administrador agora é sem acesso\./)).toBeVisible();
    await page.getByTitle(/Dashboard: Sem acesso/).click();
    await expect(page.getByText(/"Dashboard" para Administrador agora é leitura\./)).toBeVisible();
  });

  test("integracoes conecta um canal desconectado", async ({ page }) => {
    await page.goto("/integracoes");
    await expect(page.getByText("WhatsApp Business API")).toBeVisible();
    await expect(page.getByText("iSIS Agenda")).toBeVisible();
    await page.getByRole("button", { name: "Conectar agora" }).click();
    await expect(page.getByText(/iSIS Agenda" conectada com sucesso\./)).toBeVisible();
  });

  test("integracoes cria uma integração webhook personalizada", async ({ page }) => {
    await page.goto("/integracoes");
    await page.getByRole("button", { name: "Nova integração" }).click();
    await page.getByText("Webhook personalizado").click();
    await page.getByLabel("Nome da integração").fill("Webhook CRM");
    await page.getByLabel("URL do webhook").fill("https://api.crm.com/ebot");
    await page.getByRole("button", { name: "Criar integração" }).click();
    await expect(page.getByText(/Webhook CRM" cadastrada\./)).toBeVisible();
    await expect(page.getByText("Desconectada").first()).toBeVisible();
    await expect(page.getByText("message.received").first()).toBeVisible();
  });

  test("canais conecta o WhatsApp via QR code da Evolution API", async ({ page }) => {
    await page.goto("/canais");
    await page.getByRole("button", { name: "Conectar canal" }).click();
    await page.getByText("WhatsApp — Evolution API").click();
    await page.getByLabel("Nome do canal").fill("WhatsApp Cirurgia");
    await page.getByLabel("Número").fill("+55 11 97777-8888");
    await page.getByRole("button", { name: "Gerar QR Code" }).click();
    await expect(page.getByText("Escaneie com o WhatsApp", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Concluir conexão" }).click();
    await expect(page.getByText(/WhatsApp Cirurgia" conectado com sucesso\./)).toBeVisible();
    await expect(page.getByText("Conectado").first()).toBeVisible();
  });

  test("chats cria um canal de equipe com membros", async ({ page }) => {
    await page.goto("/chats");
    await page.getByRole("button", { name: "Novo chat" }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible({ timeout: 5000 }).catch(async () => {
      await page.getByRole("button", { name: "Novo chat" }).click();
      await expect(dialog).toBeVisible();
    });
    await page.getByRole("button", { name: /Canal da equipe/ }).click();
    await page.getByLabel("Nome da conversa").fill("Plantão de hoje");
    await page.locator('input[name="member"]').first().check();
    await page.getByRole("button", { name: "Criar canal" }).click();
    await expect(page.getByText(/Canal · 1 membros/).first()).toBeVisible();
    await page.getByRole("button", { name: /Membros/ }).click();
    await expect(page.getByText("Membros · 1")).toBeVisible();
  });

  test("api copia o caminho de um endpoint", async ({ page }) => {
    await page.goto("/api");
    await expect(page.getByText("/v1/workflows", { exact: false }).first()).toBeVisible();
    await page.getByTitle("Copiar caminho").first().click();
    await expect(page.getByText(/Caminho \/v1\/workflows copiado\./)).toBeVisible();
  });

  test("financeiro permite alterar o plano", async ({ page }) => {
    await page.goto("/financeiro");
    await expect(page.getByText("Clínica Pro").first()).toBeVisible();
    await page.getByRole("button", { name: "Alterar plano" }).click();
    await page.getByRole("button", { name: /Clínica Enterprise/ }).click();
    await page.getByRole("button", { name: "Confirmar plano" }).click();
    await expect(page.getByText(/Plano atualizado para Clínica Enterprise/)).toBeVisible();
  });

  test("configuracoes alterna entre seções e salva", async ({ page }) => {
    await page.goto("/configuracoes");
    await expect(page.getByLabel("Nome da clínica")).toHaveValue(/Ê-Bot Clinical/);
    await page.getByRole("tab", { name: "Aparência" }).click();
    await expect(page.getByLabel("Tema", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Salvar seção" }).first().click();
    await expect(page.getByText("Configurações de aparência salvas.")).toBeVisible();
  });

  test("ajuda expande artigos e busca por termo", async ({ page }) => {
    await page.goto("/ajuda");
    await page.getByRole("button", { name: "O que acontece se o bot não souber responder?" }).click();
    await expect(page.getByText(/limite em OpenIA/)).toBeVisible();
    await page.getByPlaceholder("Buscar na ajuda…").fill("LGPD");
    await expect(page.getByText("Como a Ê-Bot trata os dados dos pacientes?")).toBeVisible();
    await expect(page.getByRole("button", { name: "Como conectar o WhatsApp da unidade?" })).toHaveCount(0);
  });
});