window.FMT_CONFIG = {
  app: {
    name: "FMT Command Cockpit",
    fullName: "Walter FMT | Plant Manager Command Cockpit",
    version: "V1.0 iOS GitHub PWA",
    motto: "Número → Desvio → Ação → Dono → Prazo → Fecho",
    identity: "Agenda. Guia. Cobrador. Facilitador. Guardião cultural da Walter FMT.",
    leader: "Fábio Brito",
    plant: "Walter FMT"
  },
  lazaroRules: [
    "Números antes de histórias",
    "Desvio sempre com ação",
    "Problema sempre com dono",
    "Ação sempre com prazo",
    "Reuniões curtas, objetivas e decisivas",
    "KPI vermelho sem plano não entra na sala",
    "Um líder é responsável por mover gente acima de tudo"
  ],
  validationMessages: {
    redKpiNoPlan: "KPI vermelho sem ação, dono e prazo não pode ser fechado.",
    actionNoOwner: "Ação sem dono não existe.",
    actionNoDue: "Ação sem prazo é intenção, não compromisso.",
    noDecision: "Checkpoint sem decisão não fecha cultura nem execução.",
    noClosureMetric: "Sem indicador de fecho, não sabemos se a ação foi fechada.",
    noNextReview: "Sem próxima revisão, o compromisso perde tração.",
    escalationNoRecommendation: "Escalar sem recomendação é transferência de responsabilidade."
  },
  areas: [
    { id: "engineering", name: "Engenharia", focus: "Validação técnica, industrialização, orçamentação técnica, standards e desbloqueio do fluxo.", kpi: "Lead time, pedidos bloqueados, loops técnicos, devoluções por falta de informação.", ritual: "1:1 semanal + reunião semanal com dono de processo de Engenharia." },
    { id: "design", name: "Desenho", focus: "Qualidade do desenho, velocidade, repetibilidade, biblioteca técnica e passagem limpa para produção.", kpi: "Desenhos concluídos, retrabalho, desenhos devolvidos, tempo por pedido.", ritual: "1:1 conjunto com Engenharia/Desenho." },
    { id: "customer_service", name: "Customer Service", focus: "Backlog, prioridades cliente, comunicação preventiva, promessas realistas e urgências.", kpi: "OTD prometido, pedidos críticos, respostas pendentes, escaladas.", ritual: "1:1 semanal + presença no alinhamento semanal." },
    { id: "pmo", name: "PMO / Planeamento", focus: "Planeamento, capacidade, compromissos, riscos e carteira de projetos.", kpi: "Plano vs real, aderência ao plano, riscos abertos, ações PMO.", ritual: "1:1 semanal PMO/Planeamento." },
    { id: "logistics", name: "Tool Services and Logistics", focus: "Fluxo de serviços, expedição, logística, prioridades, disponibilidade e interface cliente.", kpi: "OTD logística, backlog, tempo de ciclo, falhas de expedição.", ritual: "1:1 semanal." },
    { id: "soft", name: "Soft Tools", focus: "Output, qualidade, produtividade, capacidade e problemas de processo da área.", kpi: "Output, OEE, retrabalho, atrasos, qualidade.", ritual: "1:1 semanal ou bloco operações." },
    { id: "hard", name: "Hard Tools", focus: "Output, qualidade, produtividade, capacidade e estabilidade operacional da área.", kpi: "Output, OEE, retrabalho, atrasos, qualidade.", ritual: "1:1 semanal ou bloco operações." },
    { id: "pcd", name: "PCD", focus: "Performance técnica/produtiva, lead time, qualidade e controlo de gargalos específicos.", kpi: "Output, OEE, NC, retrabalho, lead time.", ritual: "1:1 semanal ou bloco operações." },
    { id: "maintenance", name: "Manutenção", focus: "Disponibilidade, preventivas, tempos de paragem, fiabilidade e suporte à industrialização.", kpi: "Disponibilidade, MTTR, preventivas cumpridas, paragens críticas.", ritual: "1:1 quinzenal; semanal quando crítico." },
    { id: "tool_management", name: "Tool Management", focus: "Disponibilidade e gestão de ferramentas, afiações, consumíveis, stock, rastreabilidade e suporte à produção.", kpi: "Disponibilidade, ruturas, custo, tempos de reposição.", ritual: "1:1 semanal/quinzenal com operações." }
  ],
  culturalSignals: [
    { id: "ownership", label: "Ownership visível", type: "positive", prompt: "Quem assumiu responsabilidade antes de ser cobrado?" },
    { id: "data_first", label: "Dados antes de opiniões", type: "positive", prompt: "Que líder trouxe número, impacto e proposta?" },
    { id: "direction", label: "Direção única", type: "positive", prompt: "A equipa saiu alinhada com uma decisão única?" },
    { id: "learning", label: "Aprendizagem da urgência", type: "positive", prompt: "Que urgência gerou ação preventiva?" },
    { id: "not_me", label: "Não é comigo", type: "risk", prompt: "Onde apareceu fuga de responsabilidade?" },
    { id: "story_no_number", label: "Histórias sem números", type: "risk", prompt: "Que tema foi explicado sem dados?" },
    { id: "red_no_plan", label: "Vermelho sem plano", type: "risk", prompt: "Que KPI vermelho apareceu sem ação, dono e prazo?" },
    { id: "late_action", label: "Ação atrasada sem recuperação", type: "risk", prompt: "Que compromisso falhou sem plano de recuperação?" },
    { id: "conflict", label: "Conflito entre áreas", type: "risk", prompt: "Que bloqueio precisa de decisão do Plant Manager?" },
    { id: "hero_dependency", label: "Dependência de heróis", type: "risk", prompt: "Que resultado depende de pessoas e não de sistema?" }
  ],
  checkpoints: {
    checkin_morning: {
      id: "checkin_morning",
      type: "checkpoint",
      title: "Check-in da manhã",
      day: "Todos",
      time: "07:45",
      category: "command",
      objective: "Transformar o dia em prioridades, decisões, riscos e cobranças.",
      output: "Agenda do dia, prioridades, riscos, decisões e frase cultural.",
      topics: ["Top 5 prioridades críticas", "Reuniões do dia", "Decisões que não podem passar de hoje", "Riscos a controlar", "Ações atrasadas", "Pessoas ou áreas a mover", "KPIs que exigem atenção", "Mensagem cultural do dia"],
      questions: [
        "O que pode impedir a fábrica de entregar hoje?",
        "Que tema precisa da minha decisão hoje?",
        "Que pessoa ou área precisa de ser movida hoje?",
        "Que comportamento não posso tolerar hoje?",
        "Que KPI vermelho exige plano antes de entrar na sala?"
      ],
      closeLabel: "Primeira ação de comando do dia"
    },
    daily_kpi: {
      id: "daily_kpi",
      type: "checkpoint",
      title: "Daily KPI Walter FMT",
      day: "Todos",
      time: "08:15",
      category: "kpi",
      objective: "Garantir estado do dia, desvios, dono, prazo e decisão.",
      output: "Estado do dia, desvios, dono, prazo e decisão.",
      topics: ["Estado geral do dia", "Top KPIs", "Desvios", "Dono", "Prazo", "Decisão", "Comunicação necessária"],
      questions: [
        "Qual é o estado real do dia: verde, amarelo ou vermelho?",
        "Que KPI está fora do plano?",
        "Que desvio precisa de dono e prazo hoje?",
        "Que decisão desbloqueia fluxo?",
        "Quem precisa de ser chamado antes que o problema cresça?"
      ],
      closeLabel: "Decisão principal do Daily KPI"
    },
    recalibration: {
      id: "recalibration",
      type: "checkpoint",
      title: "Recalibração do dia",
      day: "Todos",
      time: "Meio do dia",
      category: "command",
      objective: "Separar ruído de decisão quando o dia começa a fugir ao plano.",
      output: "Próximos 60 minutos, quem contactar, decisão a fechar e risco a proteger.",
      topics: ["O que continua crítico", "O que pode esperar", "Decisão imediata", "Escalada", "Cobrança antes do fim do dia", "Risco aumentado"],
      questions: [
        "O que mudou desde a manhã?",
        "Que urgência é real e que urgência é falta de planeamento?",
        "Que trade-off exige decisão?",
        "O que tem de ser fechado nos próximos 60 minutos?",
        "Que risco deve ser comunicado antes de sermos cobrados?"
      ],
      closeLabel: "Próxima ação dos 60 minutos"
    },
    close_day: {
      id: "close_day",
      type: "checkpoint",
      title: "Fecho do dia",
      day: "Todos",
      time: "16:30",
      category: "close",
      objective: "Fechar o dia com verdade, aprendizagem, donos e primeira ação de amanhã.",
      output: "Balanço, riscos para amanhã, ações pendentes e frase de liderança.",
      topics: ["O que foi entregue", "O que ficou por fechar", "Risco aumentado", "Decisão tomada", "Ação para amanhã", "Comportamento cultural", "Aprendizagem"],
      questions: [
        "A fábrica ficou mais forte hoje?",
        "O que se repetiu e não devia repetir?",
        "Quem assumiu responsabilidade?",
        "Quem evitou responsabilidade?",
        "Que mensagem devo reforçar amanhã?"
      ],
      closeLabel: "Primeira ação de amanhã"
    },
    pmo_planning: {
      id: "pmo_planning",
      type: "meeting",
      title: "PMO / Planeamento",
      day: "Segunda",
      time: "10:00",
      category: "planning",
      participants: "PMO/Planeamento + Customer Service quando necessário",
      objective: "Plano semanal, capacidade, datas realistas, riscos e prioridades.",
      output: "Plano semanal, capacidade, datas realistas, riscos e prioridades.",
      topics: ["Plano semanal", "Carga vs capacidade", "Datas prometidas", "Riscos", "Prioridades", "Ações PMO"],
      questions: [
        "O plano da semana é realista?",
        "Qual é a carga vs capacidade por área?",
        "Que data prometida está em risco?",
        "Que trade-off precisa da minha decisão?",
        "Que ação atrasada está a bloquear outro departamento?"
      ],
      closeLabel: "Decisão sobre plano/capacidade"
    },
    customer_service: {
      id: "customer_service",
      type: "meeting",
      title: "Customer Service",
      day: "Segunda",
      time: "11:30",
      category: "customer",
      participants: "Customer Service + PMO/Planeamento quando necessário",
      objective: "Backlog, urgências, comunicação cliente e promessas realistas.",
      output: "Pedidos críticos, respostas pendentes, comunicações preventivas e ações.",
      topics: ["Backlog cliente", "Pedidos críticos", "Promessas realistas", "Respostas pendentes", "Escaladas", "Comunicação preventiva"],
      questions: [
        "Que cliente/pedido está em risco?",
        "Que promessa foi feita sem validação de capacidade?",
        "Que comunicação preventiva deve sair hoje?",
        "Que urgência é real e qual é apenas falta de planeamento?",
        "Que informação falta para Engenharia/Produção avançarem?"
      ],
      closeLabel: "Comunicação preventiva/decisão de cliente"
    },
    engineering_process_owner: {
      id: "engineering_process_owner",
      type: "meeting",
      title: "Dono processo Engenharia",
      day: "Terça",
      time: "10:00",
      category: "engineering",
      participants: "Plant Manager + process owner Engenharia + Eng/Desenho se necessário",
      objective: "Alinhar standards funcionais, desvios de processo, lead time técnico e melhorias.",
      output: "Dados técnicos, desvios, proposta local, decisão funcional, prazo.",
      topics: ["Standards funcionais", "Desvios de processo", "Lead time técnico", "Melhorias Engenharia/Desenho", "Decisão funcional", "Exceções locais"],
      questions: [
        "Que desvio local mostra fragilidade do processo global?",
        "Que standard deve ser clarificado?",
        "Que exceção local deve ser permitida, bloqueada ou escalada?",
        "Que decisão funcional precisamos hoje?",
        "Que melhoria fica com dono e prazo?"
      ],
      closeLabel: "Decisão funcional de Engenharia"
    },
    engineering_design: {
      id: "engineering_design",
      type: "meeting",
      title: "Engenharia + Desenho",
      day: "Terça",
      time: "11:30",
      category: "engineering",
      participants: "Responsáveis de Engenharia e Desenho",
      objective: "Backlog técnico, loops, Fast Track, validações e ações.",
      output: "Backlog técnico, loops, Fast Track, validações e ações.",
      topics: ["Pedidos bloqueados", "Desenhos devolvidos", "Loops técnicos", "Fast Track", "Biblioteca técnica", "Passagem limpa para produção"],
      questions: [
        "Que pedidos estão bloqueados e porquê?",
        "Que desenhos foram devolvidos ou geraram dúvidas na produção?",
        "Que Fast Track está mal classificado?",
        "Que standard ou biblioteca técnica reduziria repetição?",
        "Que decisão funcional precisa de alinhamento com o dono de processo?"
      ],
      closeLabel: "Decisão técnica / validação desbloqueada"
    },
    operations_process_owner: {
      id: "operations_process_owner",
      type: "meeting",
      title: "Dono processo Operações",
      day: "Quarta",
      time: "10:00",
      category: "operations",
      participants: "Plant Manager + process owner Operações + áreas produtivas se necessário",
      objective: "Plano vs real, OEE, gargalos, perdas e produtividade.",
      output: "Plano vs real, perdas, gargalos, decisões e ações de produtividade.",
      topics: ["Plano vs real", "OEE", "Perdas", "Gargalos", "Capacidade", "Produtividade", "Standards produtivos"],
      questions: [
        "Que standard produtivo não está a ser cumprido?",
        "Que perda operacional tem maior impacto em EBITDA?",
        "Que centro limita a fábrica?",
        "Que ação funcional melhora a performance local?",
        "Que decisão fica registada?"
      ],
      closeLabel: "Decisão de produtividade/operação"
    },
    soft_hard_pcd: {
      id: "soft_hard_pcd",
      type: "meeting",
      title: "Soft / Hard / PCD",
      day: "Quarta",
      time: "11:30",
      category: "operations",
      participants: "Responsáveis dos centros produtivos",
      objective: "Output por área, perdas, capacidade e recuperação.",
      output: "Output por área, perdas, capacidade e recuperação.",
      topics: ["Output por centro", "OEE", "Retrabalho", "Atrasos", "Qualidade", "Capacidade", "Plano de recuperação"],
      questions: [
        "Qual é o plano vs real por centro?",
        "Onde está o gargalo da semana?",
        "Que perda está normalizada: setup, paragem, retrabalho, espera?",
        "Que ação melhora produtividade já esta semana?",
        "Que apoio técnico ou manutenção é necessário?"
      ],
      closeLabel: "Ação de recuperação dos centros"
    },
    maintenance_tool_management: {
      id: "maintenance_tool_management",
      type: "meeting",
      title: "Manutenção + Tool Management",
      day: "Quarta",
      time: "15:30",
      category: "support",
      participants: "Manutenção, Tool Management, Operações",
      objective: "Disponibilidade, preventivas, ferramentas críticas e riscos.",
      output: "Disponibilidade, preventivas, ferramentas críticas e riscos.",
      topics: ["Disponibilidade", "MTTR", "Preventivas", "Paragens críticas", "Ferramentas críticas", "Ruturas", "Custo escondido"],
      questions: [
        "Que paragem crítica ameaça output?",
        "Preventivas estão a ser cumpridas ou sacrificadas?",
        "Qual é a causa das paragens repetidas?",
        "Que máquina precisa decisão de investimento ou intervenção?",
        "Que ferramenta crítica pode parar produção?",
        "Há ruturas ou stocks mal dimensionados?",
        "Que indicador semanal deve ficar visível?"
      ],
      closeLabel: "Intervenção/preventiva/stock crítico decidido"
    },
    tool_services_logistics: {
      id: "tool_services_logistics",
      type: "meeting",
      title: "Tool Services & Logistics",
      day: "Quinta",
      time: "10:00",
      category: "logistics",
      participants: "Responsável da área + PMO/CS quando necessário",
      objective: "OTD, expedições, prioridades, falhas logísticas e ações.",
      output: "OTD, expedições, prioridades, falhas logísticas e ações.",
      topics: ["OTD logística", "Backlog", "Expedições", "Prioridades", "Falhas logísticas", "Comunicação preventiva"],
      questions: [
        "Que encomendas estão prontas mas não fluem?",
        "Que falha logística pode afetar OTD?",
        "Que stock, transporte ou prioridade precisa decisão?",
        "Que exceção se está a repetir?",
        "Como comunicamos risco antes de sermos cobrados?"
      ],
      closeLabel: "Decisão logística / comunicação preventiva"
    },
    vp_review: {
      id: "vp_review",
      type: "meeting",
      title: "VP quinzenal",
      day: "Quinta",
      time: "15:30",
      category: "vp",
      participants: "VP + Plant Manager",
      objective: "Performance, riscos, decisões, suporte necessário e mensagem executiva.",
      output: "Síntese executiva, top riscos, decisões necessárias e recomendação.",
      topics: ["Estado geral", "Top 5 KPIs", "Top 3 riscos", "Decisões necessárias", "Pedido ao VP", "Recomendação do Plant Manager"],
      questions: [
        "Qual é o estado geral da fábrica?",
        "Quais são os top 3 riscos?",
        "Que decisão preciso que o VP tome ou desbloqueie?",
        "Que apoio preciso para proteger prazo, cliente ou EBITDA?",
        "Qual é a minha recomendação?"
      ],
      closeLabel: "Decisão ou pedido ao VP"
    },
    weekly_alignment: {
      id: "weekly_alignment",
      type: "meeting",
      title: "Reunião de Alinhamento Walter FMT",
      day: "Sexta",
      time: "10:00",
      category: "alignment",
      participants: "Todos os responsáveis das áreas",
      objective: "Direção única, compromissos, prioridades e cultura.",
      output: "Scorecard semanal, prometido vs entregue, top desvios, ações e mensagem cultural.",
      topics: ["Página KPI única", "Prometido vs entregue", "Top desvios", "Ações abertas", "Ações atrasadas", "Decisões", "Mensagem cultural"],
      questions: [
        "O que foi prometido e não foi entregue?",
        "Que desvio precisa de decisão e não de explicação?",
        "Que ação atrasada bloqueia outra área?",
        "Que comportamento deve ser reconhecido?",
        "Que comportamento deve ser corrigido?",
        "Que direção única sai da sala?"
      ],
      closeLabel: "Direção única da semana seguinte"
    },
    close_week: {
      id: "close_week",
      type: "checkpoint",
      title: "Fecho semanal executivo",
      day: "Sexta",
      time: "14:00",
      category: "close",
      objective: "Fechar a semana com scorecard, aprendizagem e prioridades da semana seguinte.",
      output: "Scorecard, ações fechadas, ações atrasadas, riscos e mensagem cultural.",
      topics: ["Scorecard semanal", "Prometido vs entregue", "Ações fechadas", "Ações atrasadas", "Decisões abertas", "Riscos próxima semana", "Comportamentos positivos", "Comportamentos a corrigir"],
      questions: [
        "Que problema estrutural ficou mais pequeno esta semana?",
        "Qual foi a principal vitória?",
        "Qual foi a principal falha?",
        "Que risco não pode entrar na próxima semana sem dono?",
        "Que mensagem cultural deve abrir a próxima semana?"
      ],
      closeLabel: "Prioridade principal da próxima semana"
    }
  },
  agenda: [
    { day: "Segunda", items: [
      { time: "07:45", checkpointId: "checkin_morning", title: "Preparação semanal", subtitle: "Top 5 prioridades | Top 5 riscos" },
      { time: "08:15", checkpointId: "daily_kpi", title: "Daily KPI", subtitle: "Números, desvios, dono + prazo" },
      { time: "09:00", checkpointId: "recalibration", title: "Gemba fluxo total", subtitle: "Engenharia > Produção > Logística" },
      { time: "10:00", checkpointId: "pmo_planning", title: "Reunião PMO + Planeamento", subtitle: "Plano semanal, capacidade, promessas" },
      { time: "11:30", checkpointId: "customer_service", title: "Customer Service", subtitle: "Backlog, urgências, comunicação cliente" },
      { time: "14:00", checkpointId: "recalibration", title: "Bloco decisões críticas", subtitle: "Trade-offs, prioridades, recursos" },
      { time: "16:30", checkpointId: "close_day", title: "Fecho do dia", subtitle: "O que fica bloqueado?" }
    ]},
    { day: "Terça", items: [
      { time: "07:45", checkpointId: "checkin_morning", title: "Preparação técnica", subtitle: "Bloqueios, desenhos, CATDesign" },
      { time: "08:15", checkpointId: "daily_kpi", title: "Daily KPI", subtitle: "Foco: engenharia, desenho, CS" },
      { time: "09:00", checkpointId: "engineering_design", title: "Gemba engenharia/desenho", subtitle: "Pedidos incompletos, loops, standards" },
      { time: "10:00", checkpointId: "engineering_process_owner", title: "Dono processo Engenharia", subtitle: "Reunião semanal funcional - 45 min" },
      { time: "11:30", checkpointId: "engineering_design", title: "1:1 Engenharia + Desenho", subtitle: "Lead time, Fast Track, retrabalho" },
      { time: "14:00", checkpointId: "engineering_process_owner", title: "Projeto estrutural técnico", subtitle: "Standardização, biblioteca, fluxo" },
      { time: "16:30", checkpointId: "close_day", title: "Fecho técnico", subtitle: "Desenhos/validações desbloqueados" }
    ]},
    { day: "Quarta", items: [
      { time: "07:45", checkpointId: "checkin_morning", title: "Preparação operações", subtitle: "Output, OEE, perdas, gargalos" },
      { time: "08:15", checkpointId: "daily_kpi", title: "Daily KPI", subtitle: "Foco: operações e produtividade" },
      { time: "09:00", checkpointId: "soft_hard_pcd", title: "Gemba centros produtivos", subtitle: "Soft, Hard, PCD, Tool Management" },
      { time: "10:00", checkpointId: "operations_process_owner", title: "Dono processo Operações", subtitle: "Reunião semanal funcional - 45 min" },
      { time: "11:30", checkpointId: "soft_hard_pcd", title: "1:1 Soft + Hard + PCD", subtitle: "Capacidade, qualidade, output" },
      { time: "14:00", checkpointId: "operations_process_owner", title: "Review EBITDA operacional", subtitle: "Horas, materiais, retrabalho, perdas" },
      { time: "15:30", checkpointId: "maintenance_tool_management", title: "Manutenção + Tool Management", subtitle: "Disponibilidade, preventivas, ferramentas" },
      { time: "16:30", checkpointId: "close_day", title: "Fecho operações", subtitle: "Ações de recuperação e donos" }
    ]},
    { day: "Quinta", items: [
      { time: "07:45", checkpointId: "checkin_morning", title: "Preparação cliente/logística", subtitle: "Riscos cliente, entregas, backlog" },
      { time: "08:15", checkpointId: "daily_kpi", title: "Daily KPI", subtitle: "Foco: cliente, logística, OTD" },
      { time: "09:00", checkpointId: "tool_services_logistics", title: "Gemba Tool Services & Logistics", subtitle: "Fluxo, expedição, prioridades, falhas" },
      { time: "10:00", checkpointId: "tool_services_logistics", title: "1:1 Tool Services & Logistics", subtitle: "OTD, stocks, prioridades, fluxo" },
      { time: "11:30", checkpointId: "pmo_planning", title: "1:1 PMO / Planeamento", subtitle: "Datas realistas, capacidade, riscos" },
      { time: "14:00", checkpointId: "vp_review", title: "Preparação VP / B.Review", subtitle: "Síntese, decisões, riscos, escaladas" },
      { time: "15:30", checkpointId: "vp_review", title: "VP quinzenal", subtitle: "Performance, riscos, decisões" },
      { time: "16:30", checkpointId: "close_day", title: "Fecho governance", subtitle: "Ações para VP/process owners" }
    ]},
    { day: "Sexta", items: [
      { time: "07:45", checkpointId: "close_week", title: "Prometido vs entregue", subtitle: "Scorecard, ações, lições" },
      { time: "08:15", checkpointId: "daily_kpi", title: "Daily KPI", subtitle: "Último push da semana" },
      { time: "09:00", checkpointId: "recalibration", title: "Gemba final", subtitle: "Confirmar fechos e pendentes" },
      { time: "10:00", checkpointId: "weekly_alignment", title: "Reunião de Alinhamento Walter FMT", subtitle: "Página KPI única | 30 min | Lázaro" },
      { time: "11:30", checkpointId: "weekly_alignment", title: "1:1 cultura/líderes", subtitle: "Reconhecer, corrigir, desenvolver" },
      { time: "14:00", checkpointId: "close_week", title: "Fecho semanal executivo", subtitle: "Scorecard + prioridades semana seguinte" },
      { time: "15:30", checkpointId: "weekly_alignment", title: "Mensagem de alinhamento", subtitle: "Equipa, VP e donos funcionais" },
      { time: "16:30", checkpointId: "close_day", title: "Fecho pessoal", subtitle: "Aprendizagem, energia, foco" }
    ]}
  ]
};
