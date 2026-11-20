import type { Ticket } from "@/modules/tickets/domain/ticket";
import { DAY_MS, HOUR_MS, MINUTE_MS, localDate, toLocalParts } from "@/shared/domain/local-time";

/**
 * Annex B sample tickets, dated relative to `now` so the same situations hold whenever the app
 * runs: an overdue ticket (INC-20311), open ones within their deadline, recently resolved ones and
 * tickets of other employees.
 */
export function sampleTickets(now: Date): Ticket[] {
  const daysAgo = (days: number, hours: number, minutes = 0) => {
    const day = toLocalParts(new Date(now.getTime() - days * DAY_MS));
    return localDate(day.year, day.month, day.day, hours, minutes);
  };
  const hoursAgo = (hours: number) => new Date(now.getTime() - hours * HOUR_MS);
  const minutesAgo = (minutes: number) => new Date(now.getTime() - minutes * MINUTE_MS);

  /** The situations of Screen 3 for one employee: overdue, in progress, approved, two resolved. */
  const situations = (
    requesterEmail: string,
    codes: readonly [string, string, string, string, string],
  ): Ticket[] => [
    {
      code: codes[0],
      kind: "INC",
      title: "Notebook lento após atualização do Windows",
      description:
        "Lentidão geral desde a atualização do Windows. Reiniciar e rodar o diagnóstico da central não resolveu.",
      category: "hardware",
      subcategory: "Notebook",
      priority: "medium",
      status: "waiting-analyst",
      requesterEmail,
      openedAt: daysAgo(9, 14, 20),
      updatedAt: daysAgo(6, 10, 0),
      notes: [],
    },
    {
      code: codes[1],
      kind: "INC",
      title: "Acesso à pasta Financeiro no SharePoint",
      description: "Sem permissão para abrir a pasta Financeiro desde a migração do SharePoint.",
      category: "access",
      subcategory: "SharePoint",
      priority: "medium",
      status: "in-progress",
      requesterEmail,
      openedAt: daysAgo(11, 9, 12),
      updatedAt: hoursAgo(3),
      notes: [],
    },
    {
      code: codes[2],
      kind: "REQ",
      title: "Segundo monitor para home office",
      description: "Pedido de um segundo monitor de 24 polegadas para o home office.",
      category: "hardware",
      subcategory: "Monitor",
      priority: "low",
      status: "approved",
      requesterEmail,
      openedAt: daysAgo(16, 11, 30),
      updatedAt: daysAgo(2, 16, 0),
      notes: [],
    },
    {
      code: codes[3],
      kind: "INC",
      title: "Outlook não sincroniza no celular",
      description: "O Outlook do celular parou de receber e-mails depois da troca de senha.",
      category: "email",
      subcategory: "Outlook",
      priority: "medium",
      status: "resolved",
      requesterEmail,
      openedAt: daysAgo(80, 9, 40),
      updatedAt: daysAgo(79, 15, 10),
      notes: [],
    },
    {
      code: codes[4],
      kind: "INC",
      title: "Troca de senha da rede",
      description: "Senha da rede expirada fora do horário; troca feita pelo plantão.",
      category: "access",
      subcategory: null,
      priority: "low",
      status: "resolved",
      requesterEmail,
      openedAt: daysAgo(133, 8, 15),
      updatedAt: daysAgo(132, 10, 0),
      notes: [],
    },
  ];

  return [
    ...situations("ana.souza@nexo.com.br", ["INC-20311", "INC-20298", "REQ-10442", "INC-19877", "INC-19410"]),
    ...situations("employee@example.com", ["INC-20312", "INC-20299", "REQ-10443", "INC-19878", "INC-19411"]),
    {
      code: "INC-20150",
      kind: "INC",
      title: "Senha do SAP bloqueada",
      description: "Senha do SAP bloqueada depois de três tentativas.",
      category: "access",
      subcategory: "SAP",
      priority: "medium",
      status: "resolved",
      requesterEmail: "bruno.carvalho@nexo.com.br",
      openedAt: daysAgo(6, 9, 5),
      updatedAt: daysAgo(4, 11, 30),
      notes: [],
    },
    {
      code: "REQ-10398",
      kind: "REQ",
      title: "Licença do Power BI",
      description: "Licença Pro do Power BI para os relatórios de vendas.",
      category: "software",
      subcategory: "Power BI",
      priority: "low",
      status: "resolved",
      requesterEmail: "carla.mendes@nexo.com.br",
      openedAt: daysAgo(30, 10, 0),
      updatedAt: daysAgo(27, 17, 0),
      notes: [],
    },
    {
      code: "INC-20516",
      kind: "INC",
      title: "Teams trava ao compartilhar a tela",
      description: "O Teams congela quando a tela é compartilhada em reuniões com mais de dez pessoas.",
      category: "software",
      subcategory: "Teams",
      priority: "medium",
      status: "in-progress",
      requesterEmail: "diego.rocha@nexo.com.br",
      openedAt: daysAgo(1, 9, 30),
      updatedAt: hoursAgo(2),
      notes: [],
    },
    {
      code: "INC-20519",
      kind: "INC",
      title: "Monitor não liga após queda de energia",
      description: "O monitor principal não liga desde a queda de energia de hoje cedo.",
      category: "hardware",
      subcategory: "Monitor",
      priority: "high",
      status: "waiting-analyst",
      requesterEmail: "elisa.prado@nexo.com.br",
      openedAt: minutesAgo(5),
      updatedAt: minutesAgo(5),
      notes: [],
    },
  ];
}
