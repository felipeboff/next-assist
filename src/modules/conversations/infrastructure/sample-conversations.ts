import type { AgentDecision } from "@/modules/conversations/domain/agent-reply";
import type { ConsoleEntry } from "@/modules/conversations/domain/console-thread";
import type { SampleConversation } from "@/modules/conversations/infrastructure/in-memory-analyst-console";
import { DAY_MS, HOUR_MS, MINUTE_MS } from "@/shared/domain/local-time";

const SUPPORT_TEAM = "Suporte N2";

function decision(
  understood: string,
  actions: AgentDecision["actions"],
  confidence: number,
  reason: string,
): AgentDecision {
  return { understood, actions, confidence, reason };
}

/**
 * The console's sample conversations, dated relative to `now`: three waiting for an analyst
 * (an employee request, a deadline about to expire, a low-confidence hand-over), two with the agent
 * and two the agent resolved. Employees match the identity seed where it has them.
 */
export function sampleConversations(now: Date): SampleConversation[] {
  const minutesAgo = (minutes: number) => new Date(now.getTime() - minutes * MINUTE_MS);
  let sequence = 0;
  const id = () => `sample-${++sequence}`;
  const employee = (text: string, at: Date): ConsoleEntry => ({ kind: "employee", id: id(), text, at });
  const agent = (text: string, at: Date, why: AgentDecision): ConsoleEntry => ({
    kind: "agent",
    id: id(),
    text,
    decision: why,
    at,
  });
  const transferred = (at: Date): ConsoleEntry => ({
    kind: "event",
    id: id(),
    event: "transferred",
    actor: SUPPORT_TEAM,
    at,
  });

  const anaTransfer = minutesAgo(1);
  const carlaTransfer = minutesAgo(8);
  const brunoTransfer = minutesAgo(15);
  const yesterday = new Date(now.getTime() - DAY_MS - 3 * HOUR_MS);

  return [
    {
      conversation: {
        id: "conversation-ana",
        employee: {
          email: "ana.souza@nexo.com.br",
          name: "Ana Souza",
          department: "Financeiro",
          online: true,
        },
        status: "waiting-analyst",
        attendant: null,
        transfer: {
          reason: "overdue",
          confidence: null,
          team: SUPPORT_TEAM,
          at: anaTransfer,
          respondBy: new Date(anaTransfer.getTime() + 2 * HOUR_MS),
        },
        ticketCode: "INC-20311",
        lastActivityAt: anaTransfer,
        preview: { from: "employee", text: "Está parado há quase uma semana. Quero falar com um analista." },
        typing: false,
        unread: 2,
      },
      entries: [
        employee("Qual o status do meu chamado?", minutesAgo(5)),
        agent(
          "Você tem 3 chamados abertos. Sobre qual deles quer saber?",
          minutesAgo(5),
          decision(
            "Quer saber como está um chamado seu, sem dizer qual.",
            [{ label: "consultou seus chamados", outcome: "3 abertos: INC-20311, INC-20298, REQ-10442" }],
            0.9,
            "Há mais de um chamado aberto e a mensagem não diz qual; pergunto em vez de adivinhar.",
          ),
        ),
        employee("INC-20311 · Notebook lento após atualização do Windows", minutesAgo(4)),
        agent(
          "Está sem atualização acima do prazo de 3 dias úteis para prioridade média. Quer que eu chame um analista?",
          minutesAgo(4),
          decision(
            "Quer saber como está o INC-20311.",
            [
              {
                label: "consultou o INC-20311",
                outcome: "Aguardando analista; sem atualização há quase uma semana",
              },
              { label: "calculou o prazo", outcome: "Prazo de 3 dias úteis vencido" },
            ],
            0.95,
            "Regra do service desk: chamado vencido é motivo para chamar um analista; ofereço antes de transferir.",
          ),
        ),
        employee("Está parado há quase uma semana.", minutesAgo(2)),
        employee("Quero falar com um analista.", minutesAgo(2)),
        agent(
          "Encaminhei para o Suporte N2. Um analista vai falar com você em até 2 h úteis.",
          anaTransfer,
          decision(
            "Quer falar com um analista sobre o INC-20311, que está vencido.",
            [{ label: "transferiu para um analista", outcome: "Suporte N2 recebeu o resumo do caso" }],
            0.97,
            "Regra do service desk: transfiro quando o funcionário pede e quando o chamado está vencido. Enquanto o analista atende, eu não respondo.",
          ),
        ),
        transferred(anaTransfer),
      ],
      scriptedAnswer: "Posso sim, está ligado.",
    },
    {
      conversation: {
        id: "conversation-carla",
        employee: {
          email: "carla.mendes@nexo.com.br",
          name: "Carla Mendes",
          department: "Comercial",
          online: true,
        },
        status: "waiting-analyst",
        attendant: null,
        transfer: {
          reason: "employee-request",
          confidence: null,
          team: SUPPORT_TEAM,
          at: carlaTransfer,
          respondBy: new Date(now.getTime() + 25 * MINUTE_MS),
        },
        ticketCode: null,
        lastActivityAt: carlaTransfer,
        preview: { from: "employee", text: "Preciso de acesso ao SAP ainda hoje" },
        typing: false,
        unread: 1,
      },
      entries: [
        employee("Preciso de acesso ao SAP ainda hoje, tenho o fechamento do mês às 17h.", minutesAgo(9)),
        agent(
          "Acesso novo ao SAP precisa de aprovação de um analista. Encaminhei para o Suporte N2 com o seu prazo das 17h.",
          carlaTransfer,
          decision(
            "Pede acesso ao SAP com um compromisso hoje às 17h.",
            [
              { label: "buscou na central de ajuda", outcome: "Acesso ao SAP exige aprovação do Suporte N2" },
              { label: "transferiu para um analista", outcome: "Suporte N2, contato em até 30 min" },
            ],
            0.88,
            "Regra do service desk: compromisso no mesmo dia é prioridade alta, e o acesso depende de um analista.",
          ),
        ),
        transferred(carlaTransfer),
        employee("Preciso de acesso ao SAP ainda hoje", minutesAgo(8)),
      ],
      scriptedAnswer: "Obrigada! Meu usuário é carla.mendes.",
    },
    {
      conversation: {
        id: "conversation-bruno",
        employee: {
          email: "bruno.carvalho@nexo.com.br",
          name: "Bruno Carvalho",
          department: "Logística",
          online: false,
        },
        status: "waiting-analyst",
        attendant: null,
        transfer: {
          reason: "low-confidence",
          confidence: 0.41,
          team: SUPPORT_TEAM,
          at: brunoTransfer,
          respondBy: new Date(brunoTransfer.getTime() + 4 * HOUR_MS),
        },
        ticketCode: null,
        lastActivityAt: brunoTransfer,
        preview: { from: "agent", text: "Vou chamar um analista para isso." },
        typing: false,
        unread: 0,
      },
      entries: [
        employee("O leitor de código de barras do armazém parou de ler as etiquetas novas.", minutesAgo(16)),
        agent(
          "Não encontrei esse caso na central de ajuda e não tenho segurança sobre a causa. Vou chamar um analista para isso.",
          brunoTransfer,
          decision(
            "O leitor de código de barras não lê as etiquetas novas; pode ser o leitor, a etiqueta ou o sistema.",
            [
              {
                label: "buscou na central de ajuda",
                outcome: "Nenhum artigo sobre leitores de código de barras",
              },
              { label: "transferiu para um analista", outcome: "Suporte N2, por baixa confiança" },
            ],
            0.41,
            "Regra do service desk: quando não tenho segurança sobre o que fazer, transfiro para um analista em vez de arriscar.",
          ),
        ),
        transferred(brunoTransfer),
      ],
      scriptedAnswer: "Oi! O leitor é o da doca 3.",
    },
    {
      conversation: {
        id: "conversation-diego",
        employee: {
          email: "diego.rocha@nexo.com.br",
          name: "Diego Rocha",
          department: "Marketing",
          online: true,
        },
        status: "with-agent",
        attendant: null,
        transfer: null,
        ticketCode: "INC-20516",
        lastActivityAt: now,
        preview: { from: "employee", text: "Aconteceu de novo agora há pouco." },
        typing: true,
        unread: 0,
      },
      entries: [
        employee("O Teams trava quando compartilho a tela.", minutesAgo(3)),
        agent(
          "Você já tem o INC-20516 aberto sobre isso, em andamento. Quer acrescentar alguma informação a ele?",
          minutesAgo(3),
          decision(
            "O Teams trava ao compartilhar a tela, e já existe um chamado sobre isso.",
            [{ label: "consultou seus chamados", outcome: "INC-20516 em andamento sobre o mesmo problema" }],
            0.9,
            "Regra do service desk: um problema com chamado aberto é atualizado, não duplicado.",
          ),
        ),
        employee("Aconteceu de novo agora há pouco.", now),
      ],
      scriptedAnswer: null,
    },
    {
      conversation: {
        id: "conversation-elisa",
        employee: {
          email: "elisa.prado@nexo.com.br",
          name: "Elisa Prado",
          department: "Pessoas",
          online: false,
        },
        status: "with-agent",
        attendant: null,
        transfer: null,
        ticketCode: "INC-20519",
        lastActivityAt: minutesAgo(5),
        preview: { from: "agent", text: "Chamado INC-20519 criado." },
        typing: false,
        unread: 0,
      },
      entries: [
        employee("Meu monitor não liga desde a queda de energia de hoje cedo.", minutesAgo(7)),
        agent(
          "Chamado INC-20519 criado. Um analista fala com você em até 4 h úteis.",
          minutesAgo(5),
          decision(
            "O monitor principal não liga depois da queda de energia; impede o trabalho.",
            [
              {
                label: "classificou a prioridade",
                outcome: "Prioridade alta: impede uma pessoa de trabalhar",
              },
              { label: "criou o chamado", outcome: "INC-20519 no serviço de chamados" },
            ],
            0.84,
            "Regra do service desk: algo que impede uma pessoa de trabalhar é prioridade alta; o chamado foi criado depois da confirmação.",
          ),
        ),
      ],
      scriptedAnswer: null,
    },
    {
      conversation: {
        id: "conversation-fabio",
        employee: {
          email: "fabio.nunes@nexo.com.br",
          name: "Fábio Nunes",
          department: "Jurídico",
          online: false,
        },
        status: "resolved-by-agent",
        attendant: null,
        transfer: null,
        ticketCode: null,
        lastActivityAt: minutesAgo(9),
        preview: { from: "employee", text: "Isso resolveu, obrigado!" },
        typing: false,
        unread: 0,
      },
      entries: [
        employee("Como instalo a impressora do 2º andar?", minutesAgo(14)),
        agent(
          "Abra o portal de softwares, procure “Impressoras do 2º andar” e clique em Instalar. Em seguida, escolha a impressora JUR-02 na hora de imprimir.",
          minutesAgo(13),
          decision(
            "Quer instalar a impressora do 2º andar.",
            [
              {
                label: "buscou na central de ajuda",
                outcome: "Artigo “Instalar impressoras pelo portal de softwares”",
              },
            ],
            0.93,
            "A central de ajuda responde; não é preciso abrir chamado.",
          ),
        ),
        employee("Isso resolveu, obrigado!", minutesAgo(9)),
      ],
      scriptedAnswer: null,
    },
    {
      conversation: {
        id: "conversation-gabriela",
        employee: {
          email: "gabriela.rocha@nexo.com.br",
          name: "Gabriela Rocha",
          department: "Recepção",
          online: false,
        },
        status: "resolved-by-agent",
        attendant: null,
        transfer: null,
        ticketCode: null,
        lastActivityAt: yesterday,
        preview: { from: "agent", text: "A senha do Wi-Fi de visitantes foi enviada para o seu e-mail." },
        typing: false,
        unread: 0,
      },
      entries: [
        employee(
          "Qual é a senha do Wi-Fi de visitantes de hoje?",
          new Date(yesterday.getTime() - 2 * MINUTE_MS),
        ),
        agent(
          "A senha do Wi-Fi de visitantes foi enviada para o seu e-mail.",
          yesterday,
          decision(
            "Precisa da senha diária do Wi-Fi de visitantes.",
            [
              {
                label: "buscou na central de ajuda",
                outcome: "A senha diária vai por e-mail para a recepção",
              },
            ],
            0.91,
            "Por segurança, a senha não aparece no chat; vai para o e-mail corporativo.",
          ),
        ),
      ],
      scriptedAnswer: null,
    },
  ];
}
