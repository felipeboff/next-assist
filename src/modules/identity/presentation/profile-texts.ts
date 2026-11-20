export const profileTexts = {
  breadcrumb: ["Service desk de TI", "Meu perfil"],
  title: "Meu perfil",
  subtitle: "Seus dados de acesso ao service desk de TI.",
  name: "Nome",
  email: "E-mail corporativo",
  managed: "Gerenciado pela TI",
  password: "Senha",
  reset: "Redefinir senha",
  resend: "Reenviar link",
  sending: "Enviando…",
  willSend: (email: string) => `Enviaremos um link de redefinição para ${email}.`,
  sent: (email: string) => `Enviamos um link de redefinição para ${email}.`,
  resetFailed: "Não foi possível enviar o link agora. Tente de novo em instantes.",
  noPassword: "Sem senha cadastrada",
};

/** "Alterada hoje", "Alterada há 1 dia", "Alterada há 42 dias". */
export function passwordAgeText(days: number): string {
  if (days === 0) {
    return "Alterada hoje";
  }
  return days === 1 ? "Alterada há 1 dia" : `Alterada há ${days} dias`;
}
