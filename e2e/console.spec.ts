import { expect, test, type Page } from "@playwright/test";
import { people, signIn } from "./support/session";

const list = (page: Page) => page.getByRole("region", { name: "Lista de conversas" });
const panel = (page: Page) => page.getByRole("complementary", { name: "Chamados do funcionário" });
const thread = (page: Page) => page.getByRole("region", { name: "Histórico da conversa" });
const replyField = (page: Page) => page.getByLabel("Mensagem para o funcionário");
const filter = (page: Page, name: string) =>
  page
    .getByRole("group", { name: "Filtrar conversas" })
    .getByRole("button", { name: new RegExp(`^${name}`) });

async function open(page: Page, name: string) {
  await list(page)
    .getByRole("button", { name: new RegExp(name) })
    .click();
  await expect(page.getByRole("heading", { level: 2, name })).toBeVisible();
}

async function takeOverAna(page: Page) {
  await page.getByRole("button", { name: "Assumir atendimento" }).click();
  await expect(page.getByRole("button", { name: "Encerrar atendimento" })).toBeVisible();
}

test.describe("analyst console (Screens 4 and 5)", () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page, people.rafael.email);
  });

  test("lands on the console with Todas selected and the first conversation open", async ({ page }) => {
    await expect(page).toHaveURL(/\/console$/);
    await expect(page).toHaveTitle("Conversas · Nexo Assist");
    await expect(page.getByRole("heading", { level: 1, name: "Conversas" })).toBeVisible();
    await expect(filter(page, "Todas")).toHaveAttribute("aria-pressed", "true");
    await expect(list(page).getByRole("listitem")).toHaveCount(7);
    await expect(page.getByRole("heading", { level: 2, name: "Ana Souza" })).toBeVisible();
    await expect(page.getByText("online · Financeiro · INC-20311")).toBeVisible();
    await expect(page.getByText("Ana espera um atendente")).toBeVisible();
    await expect(page.getByText(/^Agent pausado · até \d\d:\d\d$/)).toBeVisible();
    await expect(page.getByRole("button", { name: "Devolver ao agent" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Assumir atendimento" })).toBeVisible();
    await expect(replyField(page)).toBeDisabled();
    await expect(replyField(page)).toHaveAttribute("placeholder", "Assuma o atendimento para responder");
    await expect(panel(page).getByText("Chamados de Ana", { exact: true })).toBeVisible();
    await expect(panel(page).getByText("3 abertos · 2 encerrados")).toBeVisible();
    await expect(panel(page).getByText("Desta conversa")).toBeVisible();
    await expect(panel(page).getByText("Transferido para um analista")).toBeVisible();
  });

  test("a filter lists its conversations", async ({ page }) => {
    await expect(filter(page, "Para você")).toHaveText("Para você3");
    await filter(page, "Para você").click();
    await expect(list(page).getByRole("listitem")).toHaveCount(3);
    await expect(list(page)).toContainText("Ana Souza");
    await expect(list(page)).toContainText("Carla Mendes");
    await expect(list(page)).toContainText("Bruno Carvalho");

    await filter(page, "Com o agent").click();
    await expect(list(page).getByRole("listitem")).toHaveCount(2);
    await expect(list(page)).toContainText("Diego Rocha");
    await expect(list(page)).toContainText("Elisa Prado");

    await filter(page, "Todas").click();
    await expect(list(page).getByRole("listitem")).toHaveCount(7);
  });

  test("empty filter says there is nothing there", async ({ page }) => {
    await expect(filter(page, "Minhas")).toHaveText("Minhas0");
    await filter(page, "Minhas").click();
    await expect(page.getByText("Nenhuma conversa aqui.")).toBeVisible();
  });

  test("search narrows the list by name or ticket code", async ({ page }) => {
    const search = page.getByRole("searchbox", { name: "Pesquisar conversa ou chamado" });

    await search.fill("inc-20311");
    await expect(list(page).getByRole("listitem")).toHaveCount(1);
    await expect(list(page)).toContainText("Ana Souza");

    await search.fill("fabio");
    await expect(list(page).getByRole("listitem")).toHaveCount(1);
    await expect(list(page)).toContainText("Fábio Nunes");

    await search.fill("xyz");
    await expect(page.getByText("Nenhuma conversa encontrada para “xyz”.")).toBeVisible();
  });

  test("opening a conversation shows its history and the employee's tickets", async ({ page }) => {
    await open(page, "Bruno Carvalho");

    await expect(page.getByText("offline · Logística")).toBeVisible();
    await expect(thread(page).getByText("Hoje", { exact: true })).toBeVisible();
    await expect(
      thread(page).getByText("O leitor de código de barras do armazém parou de ler as etiquetas novas."),
    ).toBeVisible();
    await expect(thread(page).getByRole("button", { name: "Nexo Assist IA" })).toBeVisible();
    await expect(thread(page).getByText(/^Transferida para Suporte N2 · \d\d:\d\d$/)).toBeVisible();
    await expect(list(page).getByText("Agent pediu ajuda · confiança 41%")).toBeVisible();
    await expect(panel(page).getByText("Chamados de Bruno", { exact: true })).toBeVisible();
    await expect(panel(page).getByText("Senha do SAP bloqueada")).toBeVisible();
  });

  test("Nexo Assist label expands the decision detail", async ({ page }) => {
    const toggle = thread(page).getByRole("button", { name: "Nexo Assist IA" }).last();
    await toggle.click();

    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(thread(page).getByText("O que entendi")).toBeVisible();
    await expect(thread(page).getByText("97% · alta")).toBeVisible();
    await expect(thread(page).getByText(/transfiro quando o funcionário pede/)).toBeVisible();
  });

  test("a ticket under Outros chamados expands in place", async ({ page }) => {
    const row = panel(page).getByRole("button", { name: /Acesso à pasta Financeiro no SharePoint/ });
    await row.click();

    await expect(row).toHaveAttribute("aria-expanded", "true");
    await expect(
      panel(page).getByText("Sem permissão para abrir a pasta Financeiro desde a migração do SharePoint."),
    ).toBeVisible();
    await expect(panel(page).getByText(/Prioridade média · No prazo: próxima resposta até/)).toBeVisible();
  });

  test("employee without tickets shows the empty panel and no action on a resolved conversation", async ({
    page,
  }) => {
    await open(page, "Fábio Nunes");

    await expect(panel(page).getByText("Fábio não tem chamados.")).toBeVisible();
    await expect(panel(page).getByText("Desta conversa")).toHaveCount(0);
  });

  test("resolved conversation shows no action", async ({ page }) => {
    await open(page, "Gabriela Rocha");

    await expect(page.getByText("Atendimento encerrado.")).toBeVisible();
    await expect(page.getByRole("button", { name: "Assumir atendimento" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Devolver ao agent" })).toHaveCount(0);
    await expect(replyField(page)).toBeDisabled();
  });

  test("panel closes and the menu shows it again", async ({ page }) => {
    await page.getByRole("button", { name: "Fechar chamados de Ana" }).click();
    await expect(panel(page)).toHaveCount(0);

    await page.getByRole("button", { name: "Mais ações" }).click();
    await page.getByRole("menuitem", { name: "Mostrar chamados de Ana" }).click();
    await expect(panel(page).getByText("Chamados de Ana", { exact: true })).toBeVisible();
  });

  test("conversation search shows only matching messages and Escape restores them", async ({ page }) => {
    await page.getByRole("button", { name: "Buscar na conversa" }).click();
    const search = page.getByRole("searchbox", { name: "Buscar na conversa" });
    await search.fill("analista");

    await expect(page.getByText("3 mensagens")).toBeVisible();
    await expect(thread(page).getByText("Qual o status do meu chamado?")).toHaveCount(0);
    await expect(thread(page).getByText("Quero falar com um analista.")).toBeVisible();

    await search.press("Escape");
    await expect(search).toHaveCount(0);
    await expect(thread(page).getByText("Qual o status do meu chamado?")).toBeVisible();
  });

  test("taking over pauses the agent and moves the conversation to Minhas", async ({ page }) => {
    await takeOverAna(page);

    await expect(thread(page).getByText(/^Rafael Nunes assumiu · agent pausado · \d\d:\d\d$/)).toBeVisible();
    await expect(page.getByRole("button", { name: "Devolver ao agent" })).toBeVisible();
    await expect(replyField(page)).toBeEnabled();
    await expect(page.getByText("online · Financeiro")).toBeVisible();
    await expect(list(page).getByText("Você está atendendo")).toBeVisible();
    await expect(list(page).getByRole("img", { name: /mensagens não lidas/ })).toHaveCount(1);
    await expect(panel(page).getByText("Em atendimento")).toBeVisible();
    await expect(panel(page).getByText("Assumido por Rafael Nunes")).toBeVisible();
    await expect(filter(page, "Para você")).toHaveText("Para você2");
    await expect(filter(page, "Minhas")).toHaveText("Minhas1");
  });

  test("analyst reply shows as their bubble and the employee answers", async ({ page }) => {
    await takeOverAna(page);
    await replyField(page).fill("Oi, Ana! Pode deixar o notebook ligado agora?");
    await replyField(page).press("Enter");

    await expect(thread(page).getByText("Oi, Ana! Pode deixar o notebook ligado agora?")).toBeVisible();
    await expect(thread(page).getByText("Suporte N2", { exact: true })).toBeVisible();
    await expect(replyField(page)).toHaveValue("");

    await replyField(page).fill("   ");
    await expect(page.getByRole("button", { name: "Enviar mensagem" })).toBeDisabled();

    await expect(thread(page).getByText("Posso sim, está ligado.")).toBeVisible({ timeout: 5000 });
  });

  test("handing back returns the conversation to the agent", async ({ page }) => {
    await open(page, "Carla Mendes");
    await page.getByRole("button", { name: "Devolver ao agent" }).click();

    await expect(thread(page).getByText(/^Devolvida ao agent · \d\d:\d\d$/)).toBeVisible();
    await expect(page.getByText("Nexo Assist está atendendo esta conversa.")).toBeVisible();
    await expect(page.getByRole("button", { name: "Assumir atendimento" })).toBeVisible();
    await expect(replyField(page)).toBeDisabled();

    await open(page, "Ana Souza");
    await takeOverAna(page);
    await page.getByRole("button", { name: "Devolver ao agent" }).click();
    await expect(thread(page).getByText(/^Rafael Nunes devolveu ao agent · \d\d:\d\d$/)).toBeVisible();
  });

  test("closing asks for confirmation", async ({ page }) => {
    await takeOverAna(page);

    await page.getByRole("button", { name: "Encerrar atendimento" }).click();
    const dialog = page.getByRole("dialog", { name: "Encerrar o atendimento de Ana Souza?" });
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: "Cancelar" }).click();
    await expect(dialog).toBeHidden();
    await expect(replyField(page)).toBeEnabled();

    await page.getByRole("button", { name: "Encerrar atendimento" }).click();
    await dialog.getByRole("button", { name: "Encerrar" }).click();

    await expect(thread(page).getByText(/^Rafael Nunes encerrou o atendimento · \d\d:\d\d$/)).toBeVisible();
    await expect(page.getByText("Atendimento encerrado.")).toBeVisible();
    await expect(list(page).getByText("Encerrada")).toBeVisible();
    await expect(replyField(page)).toBeDisabled();
  });

  test("rail shows the waiting count and the avatar menu signs out", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Conversas, 3 aguardando" })).toBeVisible();

    // By keyboard: the menu opens on Enter and focuses its first item.
    await page.getByRole("button", { name: "Conta de Rafael Nunes" }).focus();
    await page.keyboard.press("Enter");
    const menu = page.getByRole("menu", { name: "Conta de Rafael Nunes" });
    await expect(menu.getByText(people.rafael.email)).toBeVisible();
    await expect(menu.getByRole("menuitem", { name: "Sair" })).toBeFocused();
    await page.keyboard.press("Enter");

    await expect(page).toHaveURL(/\/login$/);
  });

  test("reload starts again from the sample data", async ({ page }) => {
    await takeOverAna(page);
    await page.reload();
    await expect(page.getByText("Ana espera um atendente")).toBeVisible();
    await expect(filter(page, "Minhas")).toHaveText("Minhas0");
  });
});
