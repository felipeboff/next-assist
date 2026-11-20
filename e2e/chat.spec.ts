import { expect, test, type Page } from "@playwright/test";
import { people, signIn } from "./support/session";

const VPN = "Meu notebook não conecta na VPN desde ontem. Aparece o erro 809.";

const field = (page: Page) => page.getByLabel("Mensagem para o Nexo Assist");

async function send(page: Page, text: string) {
  await field(page).fill(text);
  await field(page).press("Enter");
}

async function openDraft(page: Page) {
  await send(page, VPN);
  await page.getByRole("button", { name: "Só eu" }).click();
  await expect(page.getByText("Novo chamado · Rascunho D-381")).toBeVisible();
}

async function pickOverdueTicket(page: Page) {
  await page.getByRole("button", { name: "Qual o status do meu chamado?" }).click();
  await page.getByRole("radio", { name: /INC-20311/ }).check();
  await expect(page.getByText("Chamado · INC-20311")).toBeVisible();
}

test.describe("employee chat (Screens 2 and 3)", () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page, people.ana.email);
  });

  test("lands on the chat with the sidebar", async ({ page }) => {
    await expect(page).toHaveURL(/\/$/);
    await expect(page).toHaveTitle("Atendimento · Nexo Assist");
    const nav = page.getByRole("navigation", { name: "Navegação principal" });
    await expect(nav.getByRole("link", { name: "Atendimento" })).toHaveAttribute("aria-current", "page");
    await expect(nav.getByRole("link", { name: "Meu perfil" })).toBeVisible();
    await expect(page.getByText(people.ana.name, { exact: true })).toBeVisible();
    await expect(page.getByText(people.ana.email)).toBeVisible();
    await expect(page.getByRole("button", { name: "Sair" })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Caminho" })).toHaveText(
      /Service desk de TI\s*Atendimento/,
    );
    await expect(page.getByText("Assistente online")).toBeVisible();
  });

  test("greets and sends a suggestion", async ({ page }) => {
    await expect(page.getByText("Olá, Ana. Como posso ajudar?")).toBeVisible();
    await page.getByRole("button", { name: "Meu notebook não conecta na VPN. Erro 809." }).click();

    await expect(page.getByText("Meu notebook não conecta na VPN. Erro 809.")).toBeVisible();
    await expect(page.getByText("Quem está sendo afetado?")).toBeVisible();
  });

  test("shows the bubble, the typing state and the counter", async ({ page }) => {
    await expect(page.getByText("0/30 mensagens nesta sessão")).toBeVisible();
    await send(page, VPN);

    await expect(page.getByText(VPN)).toBeVisible();
    await expect(field(page)).toHaveValue("");
    await expect(page.getByRole("status").filter({ hasText: "Nexo Assist está digitando…" })).toBeVisible();
    await expect(page.getByText("Quem está sendo afetado?")).toBeVisible();
    await expect(page.getByText("Nexo Assist está digitando…")).toBeHidden();
    await expect(page.getByText("1/30 mensagens nesta sessão")).toBeVisible();
  });

  test("blank message keeps Enviar disabled", async ({ page }) => {
    await field(page).fill("   ");
    await expect(page.getByRole("button", { name: "Enviar" })).toBeDisabled();
    await field(page).fill("Oi");
    await expect(page.getByRole("button", { name: "Enviar" })).toBeEnabled();
  });

  test("quick option is sent, marked and the others disabled", async ({ page }) => {
    await send(page, VPN);
    await page.getByRole("button", { name: "Só eu" }).click();

    await expect(page.getByRole("button", { name: "Só eu" })).toHaveAttribute("aria-pressed", "true");
    for (const other of ["Minha equipe", "Toda a empresa", "Não sei"]) {
      await expect(page.getByRole("button", { name: other })).toBeDisabled();
    }
    await expect(page.getByText("Só eu", { exact: true }).last()).toBeVisible();
    await expect(page.getByText("2/30 mensagens nesta sessão")).toBeVisible();
  });

  test("Confirmar creates the ticket", async ({ page }) => {
    await openDraft(page);
    await expect(page.getByText("Aguardando confirmação")).toBeVisible();
    await expect(page.getByText(/resposta até/)).toBeVisible();
    await expect(page.getByText("Somente você")).toBeVisible();

    await page.getByRole("button", { name: /^Confirmar/ }).click();

    await expect(page.getByText("Chamado criado · INC-20520")).toBeVisible();
    await expect(page.getByText("Aguardando analista")).toBeVisible();
    await expect(page.getByRole("button", { name: /^Confirmar/ })).toHaveCount(0);
    await expect(page.getByRole("button", { name: /criou o chamado/ })).toBeVisible();
    await expect(
      page.getByText(
        "Pronto: abri o chamado INC-20520 com prioridade alta. Um analista fala com você em até 4 h úteis.",
      ),
    ).toBeVisible();
  });

  test("Ctrl+Enter confirms the pending draft", async ({ page }) => {
    await openDraft(page);
    await page.keyboard.press("Control+Enter");
    await expect(page.getByText("Chamado criado · INC-20520")).toBeVisible();
  });

  test("Editar changes the title and the description", async ({ page }) => {
    await openDraft(page);
    await page.getByRole("button", { name: "Editar" }).click();
    await page.getByLabel("Título").fill("VPN fora do ar no notebook");
    await page.getByLabel("Descrição").fill("Erro 809 desde ontem, Windows 11.");
    await page.getByRole("button", { name: "Salvar" }).click();

    await expect(page.getByText("VPN fora do ar no notebook")).toBeVisible();
    await expect(page.getByText("Erro 809 desde ontem, Windows 11.")).toBeVisible();
    await expect(page.getByText("Aguardando confirmação")).toBeVisible();

    await page.getByRole("button", { name: "Editar" }).click();
    await page.getByLabel("Título").fill("Outro título");
    await page.getByRole("button", { name: "Descartar alterações" }).click();
    await expect(page.getByText("VPN fora do ar no notebook")).toBeVisible();
    await expect(page.getByText("Outro título")).toHaveCount(0);
  });

  test("blank edited title says what is missing and keeps the edition", async ({ page }) => {
    await openDraft(page);
    await page.getByRole("button", { name: "Editar" }).click();
    await page.getByLabel("Título").fill("   ");
    await page.getByRole("button", { name: "Salvar" }).click();

    await expect(page.getByText("Informe um título.")).toBeVisible();
    await expect(page.getByLabel("Título")).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByRole("button", { name: "Salvar" })).toBeVisible();
  });

  test("Cancelar drops the draft", async ({ page }) => {
    await openDraft(page);
    await page.getByRole("button", { name: "Cancelar" }).click();

    await expect(page.getByText("Cancelado")).toBeVisible();
    await expect(page.getByRole("button", { name: /^Confirmar/ })).toHaveCount(0);
    await expect(page.getByText("Tudo bem, não abri o chamado. Se precisar, é só me chamar.")).toBeVisible();
  });

  test("picking a ticket locks the list and shows its card", async ({ page }) => {
    await page.getByRole("button", { name: "Qual o status do meu chamado?" }).click();
    await expect(page.getByText("Você tem 3 chamados abertos. Sobre qual deles quer saber?")).toBeVisible();
    await expect(page.getByRole("radio")).toHaveCount(3);

    await page.getByRole("radio", { name: /INC-20311/ }).check();

    await expect(page.getByText("INC-20311 · Notebook lento após atualização do Windows")).toBeVisible();
    await expect(page.getByRole("radio", { name: /INC-20311/ })).toBeChecked();
    await expect(page.getByRole("radio", { name: /INC-20298/ })).toBeDisabled();
    await expect(page.getByRole("button", { name: /consultou o INC-20311.*calculou o prazo/ })).toBeVisible();
    await expect(page.getByText("Chamado · INC-20311")).toBeVisible();
    await expect(page.getByText("Hardware › Notebook")).toBeVisible();
    await expect(page.getByText("· prazo vencido")).toBeVisible();
    await expect(
      page.getByText(/Está sem atualização há \d+ dias, acima do prazo de 3 dias úteis/),
    ).toBeVisible();
    for (const option of ["Falar com um analista", "Adicionar informação", "Não, obrigado"]) {
      await expect(page.getByRole("button", { name: option })).toBeEnabled();
    }
  });

  test("Falar com um analista transfers the conversation", async ({ page }) => {
    await pickOverdueTicket(page);
    await page.getByRole("button", { name: "Falar com um analista" }).click();

    await expect(
      page.getByText("Encaminhei para o Suporte N2. Um analista vai falar com você em até 2 h úteis."),
    ).toBeVisible();
    await expect(page.getByText(/Transferida para Suporte N2 · \d\d:\d\d/)).toBeVisible();
    await expect(page.getByText("Aguardando atendente")).toBeVisible();
    await expect(
      page.getByText("Um analista vai continuar este atendimento. Suas mensagens chegam para ele."),
    ).toBeVisible();

    const replies = await page.getByRole("button", { name: /^Nexo Assist/ }).count();
    await send(page, "Alguma novidade?");
    await expect(page.getByText("Alguma novidade?")).toBeVisible();
    await expect(page.getByText("4/30 mensagens nesta sessão")).toBeVisible();
    await page.waitForTimeout(1500);
    await expect(page.getByRole("button", { name: /^Nexo Assist/ })).toHaveCount(replies);
  });

  test("Adicionar informação updates the ticket", async ({ page }) => {
    await pickOverdueTicket(page);
    await page.getByRole("button", { name: "Adicionar informação" }).click();
    await expect(page.getByText("O que você quer acrescentar ao INC-20311?")).toBeVisible();

    await send(page, "Aconteceu de novo hoje de manhã.");
    await expect(page.getByText("Atualizar chamado · INC-20311")).toBeVisible();
    await page.getByRole("button", { name: /^Confirmar/ }).click();

    await expect(page.getByText("Pronto: acrescentei a informação ao INC-20311.")).toBeVisible();
    await expect(page.getByText("Informação acrescentada")).toBeVisible();
  });

  test("Não, obrigado closes the topic", async ({ page }) => {
    await pickOverdueTicket(page);
    await page.getByRole("button", { name: "Não, obrigado" }).click();
    await expect(page.getByText("Combinado. Se precisar de algo, é só escrever.")).toBeVisible();
  });

  test("actions row expands the decision detail", async ({ page }) => {
    await send(page, VPN);
    const toggle = page.getByRole("button", { name: /^Nexo Assist consultou seus chamados/ });
    await expect(toggle).toHaveAttribute("aria-expanded", "false");

    await toggle.click();

    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByText("O que entendi")).toBeVisible();
    await expect(
      page.getByText("Seu notebook não conecta na VPN e mostra o erro 809 desde ontem."),
    ).toBeVisible();
    await expect(page.getByText("O que fiz")).toBeVisible();
    await expect(page.getByText(/— Artigo “VPN com erro 809”: vale apenas para Windows 10/)).toBeVisible();
    await expect(page.getByText("86% · alta")).toBeVisible();
    await expect(page.getByText("Por quê")).toBeVisible();

    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(page.getByText("O que entendi")).toBeHidden();
  });

  test("reload starts again from the sample data", async ({ page }) => {
    await send(page, VPN);
    await expect(page.getByText("1/30 mensagens nesta sessão")).toBeVisible();
    await page.reload();
    await expect(page.getByText("Olá, Ana. Como posso ajudar?")).toBeVisible();
    await expect(page.getByText("0/30 mensagens nesta sessão")).toBeVisible();
  });
});
