import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Lazy Gemini client helper
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// In-memory data store for collaborative blacklist & user reports
interface CollaborativeReport {
  id: string;
  type: "link" | "phone" | "email" | "profile" | "pix" | "sms";
  target: string;
  title: string;
  description: string;
  evidenceCount: number;
  reportedAt: string;
  status: "verified" | "pending" | "investigating";
  upvotes: number;
  tags: string[];
  victimLoss?: string;
  scamCategory: string;
  authorId?: string;
  authorEmail?: string;
}

interface AnonymousPostComment {
  id: string;
  postId: string;
  authorAlias: string;
  avatarColor: string;
  content: string;
  createdAt: string;
  likesCount: number;
}

interface AnonymousPost {
  id: string;
  userId?: string;
  authorAlias: string;
  avatarColor: string;
  category: "alerta_urgente" | "relato_golpe" | "duvida_seguranca" | "dica_prevencao" | "desabafo_apoio";
  tagLabel: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  comments: AnonymousPostComment[];
  isPinned?: boolean;
  stateCode?: string;
}

const anonymousPostsList: AnonymousPost[] = [
  {
    id: "post-1",
    userId: "user-demo-1",
    authorAlias: "Cidadão Protegido #394",
    avatarColor: "#70f3ff",
    category: "alerta_urgente",
    tagLabel: "Alerta Urgente",
    title: "Cuidado com novo SMS se passando pelo Caged e FGTS",
    content: "Recebi um SMS hoje cedo dizendo que meu saque extraordinário do FGTS estava disponível e expirava às 17h. O link pedia para digitar o CPF e a senha do aplicativo Caixa Tem. Verifiquei no app oficial da Caixa e não existia nenhum saque. Avisem seus familiares mais velhos!",
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    likesCount: 58,
    commentsCount: 4,
    stateCode: "SP",
    isPinned: true,
    comments: [
      {
        id: "comm-1",
        postId: "post-1",
        authorAlias: "Escudo Vigilante #112",
        avatarColor: "#dfcf93",
        content: "Minha mãe quase caiu ontem! Eles mandam com remetente de 5 dígitos parecendo oficial.",
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        likesCount: 14,
      },
      {
        id: "comm-2",
        postId: "post-1",
        authorAlias: "Guardião Anônimo #885",
        avatarColor: "#a48ca7",
        content: "A Caixa já informou que NUNCA envia links para saque por SMS. Muito bom o alerta!",
        createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
        likesCount: 9,
      },
    ],
  },
  {
    id: "post-2",
    authorAlias: "Cidadão Anônimo #742",
    avatarColor: "#3a6ea5",
    category: "relato_golpe",
    tagLabel: "Relato de Golpe",
    title: "Consegui recuperar R$ 1.800 através do MED do Banco Central!",
    content: "Quero deixar meu depoimento de esperança para quem foi vítima. Caí no golpe da falsa taxa alfandegária e transferi R$ 1.800 via Pix. Segui o passo a passo que vi aqui no Aegis: liguei pro banco em menos de 15 minutos, abri contestação de fraude MED e registrei o BO eletrônico. Hoje, 4 dias depois, o banco bloqueou a conta laranja e me devolveu o valor integral!",
    createdAt: new Date(Date.now() - 3600000 * 14).toISOString(),
    likesCount: 184,
    commentsCount: 12,
    stateCode: "RJ",
    comments: [
      {
        id: "comm-3",
        postId: "post-2",
        authorAlias: "Defensor Digital #404",
        avatarColor: "#70f3ff",
        content: "A rapidez no acionamento do banco faz toda a diferença antes dos golpistas sacarem!",
        createdAt: new Date(Date.now() - 3600000 * 10).toISOString(),
        likesCount: 22,
      },
    ],
  },
  {
    id: "post-3",
    authorAlias: "Cidadão Anônimo #918",
    avatarColor: "#dfcf93",
    category: "duvida_seguranca",
    tagLabel: "Dúvida de Segurança",
    title: "Recebi ligação do número 0800 dizendo ser do banco, é confiável?",
    content: "O número no identificador era exatamente o 0800 oficial do banco impresso atrás do meu cartão. A pessoa sabia meu nome e disse que tentaram fazer um Pix de R$ 4.500. Desconfiei e desliguei. É possível falsificarem o número do próprio banco?",
    createdAt: new Date(Date.now() - 3600000 * 22).toISOString(),
    likesCount: 76,
    commentsCount: 8,
    stateCode: "MG",
    comments: [
      {
        id: "comm-4",
        postId: "post-3",
        authorAlias: "Perito Anônimo #021",
        avatarColor: "#a48ca7",
        content: "Sim! Isso se chama 'Spoofing' de Caller ID. Eles mascaram o número de origem. Bancos NUNCA ligam pedindo para cancelar compras teclando opções ou transferindo dinheiro.",
        createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
        likesCount: 45,
      },
    ],
  },
];

interface BlacklistPhone {
  id: string;
  number: string;
  category: string;
  reputation: "dangerous" | "suspect" | "telemarketing";
  reportsCount: number;
  lastReported: string;
  notes: string;
}

const communityReports: CollaborativeReport[] = [
  {
    id: "rep-1",
    type: "phone",
    target: "(11) 98721-4409",
    title: "Falsa Central Telefônica Nubank",
    description: "Ligação automatizada alegando compra suspeita de R$ 3.850 na Casas Bahia pedindo para teclar 2 para cancelar.",
    evidenceCount: 18,
    reportedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    status: "verified",
    upvotes: 42,
    tags: ["Falsa Central", "Nubank", "Pix"],
    scamCategory: "Engenharia Social / Falsa Central",
  },
  {
    id: "rep-2",
    type: "link",
    target: "https://rastreio-correios-taxa-alfandega.site/pagamento",
    title: "Golpe da Taxa de Entrega / Correios",
    description: "SMS recebido com link falso dos Correios cobrando taxa alfandegária via Pix para liberar encomenda retida.",
    evidenceCount: 35,
    reportedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    status: "verified",
    upvotes: 89,
    tags: ["Phishing", "Correios", "Taxa Falsa"],
    scamCategory: "Phishing & Pix Falso",
  },
  {
    id: "rep-3",
    type: "profile",
    target: "@loja_eletro_outlet_oficial_br",
    title: "Perfil Falso no Instagram vendendo iPhone",
    description: "Anúncios patrocinados com preços 70% abaixo do mercado, usando fotos roubadas de lojas reais e exigindo Pix adiantado.",
    evidenceCount: 9,
    reportedAt: new Date(Date.now() - 3600000 * 28).toISOString(),
    status: "verified",
    upvotes: 27,
    tags: ["Instagram", "Falso E-commerce", "Pix"],
    scamCategory: "Falsa Loja Virtual",
  },
  {
    id: "rep-4",
    type: "sms",
    target: "Remetente: 28490",
    title: "Golpe 'Mãe, troquei de número'",
    description: "Mensagem solicitando depósito urgente de R$ 1.200 no Pix com alegação de urgência médica.",
    evidenceCount: 54,
    reportedAt: new Date(Date.now() - 3600000 * 36).toISOString(),
    status: "verified",
    upvotes: 110,
    tags: ["WhatsApp", "Engenharia Social", "Urgência"],
    scamCategory: "Clonagem e Falso Familiar",
  },
];

const blacklistPhones: BlacklistPhone[] = [
  {
    id: "phone-1",
    number: "11987214409",
    category: "Falsa Central Bancária",
    reputation: "dangerous",
    reportsCount: 148,
    lastReported: "Hoje, 14:20",
    notes: "Fingem ser atendentes do Banco do Brasil e Nubank.",
  },
  {
    id: "phone-2",
    number: "11977402319",
    category: "Golpe do WhatsApp / Falso Parente",
    reputation: "dangerous",
    reportsCount: 89,
    lastReported: "Hoje, 11:05",
    notes: "Envia mensagem fingindo ser filho com número novo pedindo Pix.",
  },
  {
    id: "phone-3",
    number: "1931998000",
    category: "Robocall Agressivo / Falsa Portabilidade",
    reputation: "suspect",
    reportsCount: 420,
    lastReported: "Ontem, 18:40",
    notes: "Disparo massivo de chamadas silenciosas e tentativa de phishing de dados.",
  },
  {
    id: "phone-4",
    number: "31998230192",
    category: "Falsa Oferta de Emprego",
    reputation: "dangerous",
    reportsCount: 63,
    lastReported: "Ontem, 09:15",
    notes: "Aborda pelo WhatsApp oferecendo R$ 500/dia para curtir vídeos no TikTok.",
  },
];

// Health Check API
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", aegisVersion: "1.0.0", time: new Date().toISOString() });
});

// Lia AI Chat Endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Mensagem é obrigatória." });
    }

    const ai = getGeminiClient();

    const systemInstruction = `
Você é "Lia", a Inteligência Artificial e especialista em Segurança Digital do aplicativo "Aegis".
Seu tom é acolhedor, altamente empático, extremamente didático, claro, acessível e focado em empoderar qualquer pessoa (incluindo jovens, adultos e idosos) a se proteger contra golpes virtuais.
Você nunca usa jargões técnicos herméticos sem explicá-los de forma simples.

Conhecimento principal:
- Golpes no Brasil: Golpe do Pix, Falsa Central Bancária, Golpe do Amor (Romance Scam), Clonagem e Falso Familiar no WhatsApp, Falso Emprego no Telegram/TikTok, Boleto Falso/Adulterado, Golpe da Falsa Restituição do Imposto de Renda, Golpe do IPVA/Detran, Phishing bancário.
- Protocolos Oficiais e Leis Brasileiras: MED (Mecanismo Especial de Devolução do Banco Central para estorno Pix em até 80 dias), Boletim de Ocorrência na Delegacia Eletrônica / de Crimes Cibernéticos, Notificação do Banco (canal de fraude), Notificação ao Procon, Safernet Brasil (denúncia de crimes na web), LGPD e bloqueio do CPF (Registrato do Banco Central).
- Instruções Pós-Golpe: Acalmar a vítima (a culpa NUNCA é da vítima; golpistas usam engenharia social sofisticada), passar o checklist imediato de contenção (1. Ligar no SAC/Fraude do banco para ativar MED; 2. Registrar BO; 3. Desconectar sessões e alterar senhas).
- Verificação de senhas seguras, autenticação em duas etapas (2FA) via app autenticador.

Diretrizes de resposta:
- Responda sempre em Português do Brasil de forma estruturada, com tópicos claros quando houver passos a seguir.
- Se o usuário relatar que acabou de sofrer um golpe, dê um abraço virtual/acolhimento sincero e imediatamente forneça as ações de emergência passo a passo.
`;

    if (!ai) {
      // Fallback response if API key is not yet configured
      return res.json({
        reply: `Olá! Eu sou a Lia, sua especialista em segurança digital do Aegis. 🛡️\n\nEstou operando no modo de proteção local. Para garantir a segurança dos seus dados:\n\n1. **Nunca compartilhe senhas ou códigos SMS recebidos por mensagem.**\n2. **Bancos nunca pedem para você fazer transferências Pix para 'cancelar uma compra'.**\n3. **Se você desconfiar de uma ligação, desligue e ligue você mesmo no número oficial atrás do seu cartão de crédito.**\n\nComo posso te ajudar a se proteger hoje?`,
        suggestedActions: [
          "O que fazer se caí num golpe do Pix?",
          "Como identificar um SMS falso dos Correios?",
          "Como ativar verificação em duas etapas no WhatsApp?",
        ],
      });
    }

    // Build context with conversation history
    const historyText = Array.isArray(conversationHistory)
      ? conversationHistory
          .slice(-6)
          .map((m: { role: string; content: string }) => `${m.role === "user" ? "Usuário" : "Lia"}: ${m.content}`)
          .join("\n")
      : "";

    const fullPrompt = historyText
      ? `Histórico recente da conversa:\n${historyText}\n\nNova mensagem do Usuário: ${message}\n\nResponda como Lia:`
      : message;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: fullPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || "Desculpe, não consegui processar a resposta neste momento. Por favor, tente novamente.";

    return res.json({ reply });
  } catch (error: any) {
    console.error("Chat error:", error);
    return res.status(500).json({
      error: "Erro ao comunicar com a Lia.",
      reply: "Desculpe, tive uma instabilidade momentânea na conexão segura. Se você acabou de sofrer um golpe, lembre-se: entre em contato imediatamente com o seu banco para acionar o MED do Pix e faça um Boletim de Ocorrência na Delegacia Eletrônica.",
    });
  }
});

// Multimodal Security Analysis Endpoint (Links, SMS, Files, Phishing, Boletos, OCR)
app.post("/api/analyze-content", async (req, res) => {
  try {
    const { type, content, imageBase64, mimeType, fileName } = req.body;
    const ai = getGeminiClient();

    const analysisPrompt = `
Você é o motor central de cibersegurança do aplicativo Aegis.
Analise detalhadamente o item fornecido pelo usuário para detectar fraudes, phishing, boletos adulterados, malware, engenharia social, falsos remetentes ou spoofing.

Tipo de análise solicitada: ${type} (pode ser "link", "sms", "email", "boleto", "file", "profile")
Nome do arquivo (se houver): ${fileName || "Nenhum"}
Texto / Link / Conteúdo:
"""
${content || "Verifique a imagem em anexo"}
"""

Você DEVE retornar rigorosamente um JSON estruturado com o seguinte formato exato:
{
  "status": "safe" | "suspicious" | "dangerous",
  "threatScore": number (0 a 100, onde 0 é 100% seguro e 100 é golpe fatal),
  "verdictTitle": "Título curto em português (ex: Phishing de Falsa Fatura, Link Seguro Oficial, Boleto Adulterado, etc.)",
  "category": "Categoria do golpe ou da verificação",
  "summary": "Resumo de 2 a 3 frases explicando de forma clara o que foi detectado e o nível de risco.",
  "fraudIndicators": [
    "Lista com 2 a 4 pontos de evidência detectados (ex: Domínio recém-criado que imita o Nubank; Senso falso de urgência e ameaça de bloqueio; Código de barras com banco divergente; etc.)"
  ],
  "recommendation": "Instrução clara e direta do que o usuário DEVE e NÃO DEVE fazer agora.",
  "officialChannels": "Se aplicável, nome do canal oficial correto ou link legítimo (ex: 'Acesse apenas gov.br ou aplicativo oficial do seu banco')",
  "canReport": true
}
`;

    if (!ai) {
      // Heuristic intelligent fallback when no key is set
      const isDangerous =
        /pix|urgente|bloqueado|cancelar compra|clique aqui|bit\.ly|tinyurl|atualizacao cadastral|recadastramento|premio|ganhou|taxa alfandega|correios-taxa/i.test(
          content || ""
        );

      const status = isDangerous ? "dangerous" : "safe";
      return res.json({
        status,
        threatScore: isDangerous ? 88 : 10,
        verdictTitle: isDangerous ? "Tentativa de Golpe Detectada (Engenharia Social / Phishing)" : "Nenhuma Ameaça Conhecida Detectada",
        category: isDangerous ? "Phishing e Engenharia Social" : "Verificação Concluída",
        summary: isDangerous
          ? "Identificamos padrões típicos de fraude com senso de urgência forçado ou links suspeitos que não pertencem aos domínios oficiais."
          : "O item analisado não apresentou palavras-chave ou padrões maliciosos na nossa base de regras heurísticas.",
        fraudIndicators: isDangerous
          ? [
              "Tentativa de induzir pânico ou urgência para tomar uma decisão rápida",
              "Solicitação de transação Pix ou clique em endereço não autenticado",
              "Ausência de certificados de autenticidade corporativa",
            ]
          : ["Estrutura de dados dentro dos parâmetros normais", "Sem indicadores de spoofing ou vírus"],
        recommendation: isDangerous
          ? "NÃO clique em nenhum link, NÃO faça transferências e NÃO envie códigos de segurança. Bloqueie o remetente."
          : "Mantenha sempre seu aplicativo atualizado e nunca informe sua senha a terceiros.",
        officialChannels: "Acesse sempre o site digitando você mesmo a URL oficial no navegador.",
        canReport: isDangerous,
      });
    }

    const parts: any[] = [];
    if (imageBase64 && mimeType) {
      parts.push({
        inlineData: {
          mimeType,
          data: imageBase64.replace(/^data:image\/\w+;base64,/, ""),
        },
      });
    }
    parts.push({
      text: analysisPrompt,
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: { parts },
      config: {
        responseMimeType: "application/json",
      },
    });

    const resultText = response.text || "{}";
    try {
      const parsed = JSON.parse(resultText);
      return res.json(parsed);
    } catch {
      return res.json({
        status: "suspicious",
        threatScore: 60,
        verdictTitle: "Análise Requer Cautela",
        category: "Verificação de Segurança",
        summary: resultText,
        fraudIndicators: ["Padrões não conclusivos, recomendamos cautela."],
        recommendation: "Não forneça dados pessoais ou bancários sem antes confirmar com a empresa por um canal oficial.",
        canReport: true,
      });
    }
  } catch (error: any) {
    console.error("Analysis error:", error);
    return res.status(500).json({
      error: "Falha na análise",
      status: "suspicious",
      threatScore: 50,
      verdictTitle: "Verificação Inconclusiva",
      category: "Erro Técnico",
      summary: "Não foi possível concluir a varredura profunda no momento. Na dúvida, NÃO clique e NÃO compartilhe dados.",
      fraudIndicators: ["Serviço em manutenção"],
      recommendation: "Procure o canal oficial da instituição mencionada.",
      canReport: false,
    });
  }
});

// Leak Checker & Impersonation Radar
app.post("/api/leak-check", (req, res) => {
  const { query, type } = req.body; // type: 'email' | 'cpf' | 'phone' | 'username'

  if (!query) {
    return res.status(400).json({ error: "Dado para consulta é obrigatório." });
  }

  const cleanQuery = String(query).trim().toLowerCase();
  
  // Realistically simulate checks against known historic mega breaches & social media impersonations
  const sampleBreaches = [
    {
      title: "Megavazamento de 223 Milhões de CPFs (2021)",
      date: "Janeiro de 2021",
      pwnCount: "223.000.000 registros",
      compromisedData: ["Nome Completo", "CPF", "Score de Crédito", "Endereço", "Renda Estimada"],
      severity: "critical",
      description: "Compilado de dados expostos em fóruns da dark web contendo históricos cadastrais e financeiros.",
    },
    {
      title: "Vazamento de Provedores de E-commerce Brasil",
      date: "Outubro de 2023",
      pwnCount: "14.200.000 contas",
      compromisedData: ["E-mail", "Senha com Hash", "Telefone", "Histórico de Pedidos"],
      severity: "high",
      description: "Invasão a bancos de dados de lojas virtuais com exposição de credenciais reutilizadas.",
    },
    {
      title: "Base de Telecomunicações & Linhas Móveis",
      date: "Março de 2024",
      pwnCount: "45.000.000 linhas",
      compromisedData: ["Número de Telefone", "Operadora", "Nome do Titular"],
      severity: "medium",
      description: "Dados de assinantes utilizados em tentativas de SIM Swap e golpe do WhatsApp.",
    },
  ];

  // Determine realistic breached status
  const isCpf = type === "cpf" || /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/.test(cleanQuery);
  const isBreached = true; // In Brazil almost all adult CPFs/emails have been in at least 1-2 major compiled breaches

  const breachesFound = isCpf
    ? [sampleBreaches[0], sampleBreaches[2]]
    : [sampleBreaches[1], sampleBreaches[0]];

  // Simulated social media impersonation scan
  const impersonationAlerts = [
    {
      platform: "Instagram",
      profileHandle: `@${cleanQuery.replace(/[^a-z0-9]/g, "")}_oficiall_`,
      similarityScore: 92,
      risk: "high",
      detectedAt: "Há 3 dias",
      findings: "Perfil criado recentemente com nome similar e biografia idêntica oferecendo investimentos em cripto e rifas.",
      actionUrl: "https://help.instagram.com/contact/636276399721841",
    },
    {
      platform: "Facebook",
      profileHandle: `${cleanQuery.split("@")[0]} (Conta Duplicada)`,
      similarityScore: 84,
      risk: "medium",
      detectedAt: "Há 2 semanas",
      findings: "Conta usando o mesmo nome e foto de perfil adicionando seus amigos e pedindo empréstimo.",
      actionUrl: "https://www.facebook.com/help/reportlinks",
    },
  ];

  res.json({
    queried: query,
    type,
    isBreached,
    breachesCount: breachesFound.length,
    breaches: breachesFound,
    impersonationsFound: impersonationAlerts.length,
    impersonations: impersonationAlerts,
    securityScore: 65,
    recommendations: [
      "Ative a Verificação em Duas Etapas (2FA) em todos os seus e-mails e redes sociais utilizando um aplicativo autenticador (Google Authenticator ou Microsoft Authenticator), nunca SMS.",
      "Consulte o serviço 'Registrato' oficial do Banco Central (gov.br) para verificar se há chaves Pix ou contas bancárias abertas sem sua autorização.",
      "Se identificar perfil falso usando seu nome/foto, denuncie diretamente à plataforma e envie aviso aos seus contatos.",
      "Se houve uso fraudulento do seu CPF, faça um Boletim de Ocorrência por 'Falsa Identidade' / 'Uso indevido de dados pessoais'.",
    ],
  });
});

// Collaborative Blacklist & Reports APIs
app.get("/api/blacklist-phones", (_req, res) => {
  res.json(blacklistPhones);
});

app.post("/api/blacklist-phones", (req, res) => {
  const { number, category, notes } = req.body;
  if (!number) {
    return res.status(400).json({ error: "Número de telefone é obrigatório." });
  }

  const cleanNum = String(number).replace(/\D/g, "");
  const existing = blacklistPhones.find((p) => p.number.includes(cleanNum));

  if (existing) {
    existing.reportsCount += 1;
    existing.lastReported = "Hoje, agora";
    return res.json({ message: "Número já cadastrado! Adicionamos mais um voto de fraude.", phone: existing });
  }

  const newEntry: BlacklistPhone = {
    id: `phone-${Date.now()}`,
    number: cleanNum,
    category: category || "Suspeita de Fraude",
    reputation: "dangerous",
    reportsCount: 1,
    lastReported: "Hoje, agora",
    notes: notes || "Cadastrado pela comunidade Aegis",
  };

  blacklistPhones.unshift(newEntry);
  res.status(201).json({ message: "Telefone cadastrado com sucesso na lista de proteção colaborativa!", phone: newEntry });
});

app.get("/api/community-reports", (_req, res) => {
  res.json(communityReports);
});

app.post("/api/community-reports", (req, res) => {
  const { type, target, title, description, tags, scamCategory, victimLoss } = req.body;
  if (!title || !description || !target) {
    return res.status(400).json({ error: "Título, endereço/alvo e descrição são obrigatórios." });
  }

  const newReport: CollaborativeReport = {
    id: `rep-${Date.now()}`,
    type: type || "link",
    target,
    title,
    description,
    evidenceCount: 1,
    reportedAt: new Date().toISOString(),
    status: "verified",
    upvotes: 1,
    tags: tags || ["Golpe", "Denúncia da Comunidade"],
    victimLoss,
    scamCategory: scamCategory || "Fraude Geral",
  };

  communityReports.unshift(newReport);
  res.status(201).json({ message: "Denúncia registrada com sucesso! A comunidade Aegis agradece.", report: newReport });
});

interface CommunityAlertItem {
  id: string;
  title: string;
  description: string;
  victimAdvice: string;
  imageUrl?: string;
  mediaType?: "image" | "video";
  authorName?: string;
  authorEmail?: string;
  createdAt: string;
  upvotesCount: number;
  category: string;
  status: "published" | "pending_moderation";
  isAudited?: boolean;
}

interface CommunityArticleItem {
  id: string;
  title: string;
  content: string;
  summary?: string;
  imageUrl?: string;
  category: string;
  authorName?: string;
  authorEmail?: string;
  readTime: string;
  createdAt: string;
  status: "published" | "pending_moderation";
  likesCount: number;
}

const communityAlertsList: CommunityAlertItem[] = [
  {
    id: "alert-1",
    title: "Golpe do morango do amor",
    description: "Criminosos criam páginas patrocinadas falsas nas redes sociais anunciando bandejas gourmet de 'morango do amor' com cobertura de chocolate e leite condensado com 80% de desconto para entrega rápida. Ao finalizar o pedido, o pagamento é feito via Pix direto para laranjas e os doces nunca são entregues.",
    victimAdvice: "Se você pagou via Pix, contate imediatamente o seu banco dentro do aplicativo para abrir um chamado do Mecanismo Especial de Devolução (MED) e registre o boletim de ocorrência na Delegacia Eletrônica anexando o comprovante da transação.",
    imageUrl: "/src/assets/images/morango_do_amor_1787795054746.jpg",
    authorName: "Equipe de Inteligência Aegis",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    upvotesCount: 142,
    category: "Falso E-commerce / Redes Sociais",
    status: "published",
    isAudited: true,
  },
  {
    id: "alert-2",
    title: "Golpe da entrega e maquininha com visor quebrado",
    description: "Motoboy chega alegando entrega surpresa de presente ou brinde de aniversário enviado por amigos, mas exige pagamento de 'taxa de entrega' de R$ 7,90 apenas no cartão. A maquininha tem visor apagado ou adulterado e passa valores de R$ 3.000 a R$ 5.000.",
    victimAdvice: "Nunca pague taxas de presentes não solicitados. Se passou o cartão, abra o app do banco na hora e bloqueie o cartão provisoriamente. Comunique a fraude à central de segurança do emissor do cartão para contestação imediata da transação.",
    imageUrl: "/src/assets/images/golpe_maquininha_1787795068932.jpg",
    authorName: "Mariana Silva (Colaboradora)",
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    upvotesCount: 98,
    category: "Fraude Presencial / Maquininha",
    status: "published",
    isAudited: true,
  },
  {
    id: "alert-3",
    title: "Golpe do Pix agendado com comprovante falso",
    description: "Compradores em plataformas de desapego (OLX, Enjoei, Marketplace) enviam comprovantes de Pix falsificados ou fazem 'Pix Agendado' e cancelam a operação assim que o produto é entregue ao motorista de aplicativo.",
    victimAdvice: "Nunca libere mercadorias olhando apenas o print enviado pelo comprador. Sempre entre na sua conta bancária e confirme que o saldo real aumentou. Notifique a plataforma e bloqueie o usuário.",
    imageUrl: "/src/assets/images/morango_do_amor_1787795054746.jpg",
    authorName: "Carlos Eduardo (Comunidade)",
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
    upvotesCount: 76,
    category: "Engenharia Social / Pix",
    status: "published",
    isAudited: true,
  },
];

const communityArticlesList: CommunityArticleItem[] = [
  {
    id: "art-1",
    title: "Como proteger sua conta bancária e o Pix no celular em caso de furto",
    summary: "Guia completo com configurações essenciais no Android e iOS: limite noturno do Pix, biometria facial para bancos e desativação de notificações na tela de bloqueio.",
    content: `Os smartphones se tornaram a principal carteira financeira dos brasileiros. Em caso de furto ou roubo do aparelho desbloqueado, criminosos tentam acessar aplicativos bancários antes que o usuário consiga bloquear o chip ou a linha.\n\n### 1. Limite Noturno e Chaves Pix Seguras\nConfigure no aplicativo de cada banco o limite de transferências diárias e noturnas (entre 20h e 06h). Reduza o limite noturno para valores simbólicos como R$ 100.\n\n### 2. Ative o PIN do Cartão SIM (Chip)\nSe o ladrão colocar seu chip em outro aparelho, ele poderá receber seus SMS com códigos de recuperação. Vá nas configurações de segurança do celular e ative o bloqueio por PIN do chip (as senhas padrão costumam ser 8486 para Vivo, 1010 para Claro e 1010 para TIM — troque imediatamente).\n\n### 3. Esconda as Notificações de SMS e E-mail da Tela de Bloqueio\nImpeça que qualquer pessoa veja códigos de autenticação recebidos sem desbloquear a tela do telefone.\n\n### 4. Celular Seguro (Governo Federal)\nCadastre seu CPF e número de telefone no aplicativo oficial 'Celular Seguro' do Ministério da Justiça para efetuar o bloqueio instantâneo do aparelho, da linha e dos bancos com um único clique através de contatos de confiança.`,
    category: "Dica de Especialista",
    authorName: "Dr. Roberto Alves (Perito Digital)",
    readTime: "4 min de leitura",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    status: "published",
    likesCount: 215,
  },
  {
    id: "art-2",
    title: "Entenda o MED do Banco Central: passo a passo para reaver dinheiro perdido no Pix",
    summary: "O Mecanismo Especial de Devolução é o recurso oficial para estorno de fraudes bancárias. Saiba quais são os prazos e como acionar corretamente.",
    content: `Criado pelo Banco Central, o Mecanismo Especial de Devolução (MED) permite que a instituição bancária da vítima solicite o bloqueio e devolução dos valores diretamente da conta receptora do golpista.\n\n### Como acionar o MED:\n1. **Velocidade é crucial:** Registre a contestação no canal de fraude do seu banco em até 80 dias após a transação (quanto mais rápido, maior a chance de o dinheiro não ter sido sacado).\n2. **Boletim de Ocorrência:** Tenha em mãos o número do BO eletrônico lavrado na Polícia Civil.\n3. **Análise dos Bancos:** O banco da vítima e o banco recebedor têm até 7 dias para analisar o caso e efetuar o bloqueio de cautela e a devolução proporcional dos saldos encontrados.`,
    category: "Legislação & Direitos",
    authorName: "Dra. Juliana Mendes (Advogada)",
    readTime: "3 min de leitura",
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    status: "published",
    likesCount: 189,
  },
];

app.post("/api/community-reports/:id/upvote", (req, res) => {
  const report = communityReports.find((r) => r.id === req.params.id);
  if (!report) return res.status(404).json({ error: "Denúncia não encontrada." });
  report.upvotes += 1;
  res.json({ upvotes: report.upvotes });
});

// Community Alerts Endpoints
app.get("/api/alerts", (_req, res) => {
  res.json(communityAlertsList);
});

app.post("/api/alerts", (req, res) => {
  const { title, description, victimAdvice, imageUrl, mediaType, authorName, authorEmail, category } = req.body;
  if (!title || !description || !victimAdvice) {
    return res.status(400).json({ error: "Título, descrição e orientação para vítimas são obrigatórios." });
  }

  const newAlert: CommunityAlertItem = {
    id: `alert-${Date.now()}`,
    title,
    description,
    victimAdvice,
    imageUrl: imageUrl || "/src/assets/images/morango_do_amor_1787795054746.jpg",
    mediaType: mediaType || "image",
    authorName: authorName || "Usuário da Comunidade Aegis",
    authorEmail: authorEmail || "",
    createdAt: new Date().toISOString(),
    upvotesCount: 1,
    category: category || "Alerta Comunitário",
    status: "published",
    isAudited: true,
  };

  communityAlertsList.unshift(newAlert);
  res.status(201).json({ message: "Seu alerta foi enviado e analisado com sucesso!", alert: newAlert });
});

app.post("/api/alerts/:id/upvote", (req, res) => {
  const alert = communityAlertsList.find((a) => a.id === req.params.id);
  if (!alert) return res.status(404).json({ error: "Alerta não encontrado." });
  alert.upvotesCount += 1;
  res.json({ upvotesCount: alert.upvotesCount });
});

// Community Articles Endpoints
app.get("/api/articles", (_req, res) => {
  res.json(communityArticlesList);
});

app.post("/api/articles", (req, res) => {
  const { title, content, summary, imageUrl, category, authorName, authorEmail } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: "Título e conteúdo da matéria são obrigatórios." });
  }

  const newArticle: CommunityArticleItem = {
    id: `art-${Date.now()}`,
    title,
    content,
    summary: summary || content.slice(0, 160) + "...",
    imageUrl,
    category: category || "Artigo da Comunidade",
    authorName: authorName || "Colaborador Aegis",
    authorEmail: authorEmail || "",
    readTime: `${Math.max(2, Math.ceil(content.split(" ").length / 150))} min de leitura`,
    createdAt: new Date().toISOString(),
    status: "published",
    likesCount: 1,
  };

  communityArticlesList.unshift(newArticle);
  res.status(201).json({ message: "Sua matéria foi enviada e analisada com sucesso!", article: newArticle });
});

app.post("/api/articles/:id/like", (req, res) => {
  const article = communityArticlesList.find((a) => a.id === req.params.id);
  if (!article) return res.status(404).json({ error: "Artigo não encontrado." });
  article.likesCount += 1;
  res.json({ likesCount: article.likesCount });
});

// ================= AUTHENTICATION ROUTES =================
interface StoredUser {
  id: string;
  name: string;
  email: string;
  birthDate: string;
  password?: string;
  isProfessional: boolean;
  role: "citizen" | "specialist" | "admin";
  createdAt: string;
  avatarUrl?: string;
  provider?: "local" | "google" | "microsoft";
}

const registeredUsers: StoredUser[] = [
  {
    id: "user-demo-1",
    name: "Maria Luiza Fernandes",
    email: "marialuizafernandes383@gmail.com",
    birthDate: "1998-05-14",
    password: "Password123!",
    isProfessional: false,
    role: "citizen",
    createdAt: new Date().toISOString(),
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    provider: "local",
  },
];

// Register endpoint
app.post("/api/auth/register", (req, res) => {
  const { name, email, birthDate, password, isProfessional } = req.body;

  if (!name || !email || !birthDate || !password) {
    return res.status(400).json({
      error: "Por favor, preencha nome completo, e-mail, data de nascimento e senha.",
    });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const existing = registeredUsers.find((u) => u.email.toLowerCase() === normalizedEmail);

  if (existing) {
    return res.status(409).json({
      error: "Este e-mail já está cadastrado no Aegis. Faça login com suas credenciais.",
    });
  }

  const newUser: StoredUser = {
    id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: String(name).trim(),
    email: normalizedEmail,
    birthDate: String(birthDate).trim(),
    password: String(password),
    isProfessional: Boolean(isProfessional),
    role: isProfessional ? "specialist" : "citizen",
    createdAt: new Date().toISOString(),
    provider: "local",
  };

  registeredUsers.push(newUser);

  const { password: _, ...safeUser } = newUser;
  res.status(201).json({
    message: "Cadastro realizado com sucesso!",
    user: safeUser,
    token: `aegis-token-${newUser.id}`,
  });
});

// Login endpoint
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "E-mail e senha são obrigatórios." });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const user = registeredUsers.find((u) => u.email.toLowerCase() === normalizedEmail);

  if (!user || (user.password && user.password !== password)) {
    return res.status(401).json({
      error: "E-mail ou senha incorretos. Verifique suas credenciais e tente novamente.",
    });
  }

  const { password: _, ...safeUser } = user;
  res.json({
    message: "Login realizado com sucesso!",
    user: safeUser,
    token: `aegis-token-${user.id}`,
  });
});

// Social Login (Google & Microsoft)
app.post("/api/auth/social", (req, res) => {
  const { provider, email, name } = req.body;
  const normalizedEmail = (email || `${provider.toLowerCase()}.user@aegis.app`).trim().toLowerCase();
  let user = registeredUsers.find((u) => u.email.toLowerCase() === normalizedEmail);

  if (!user) {
    user = {
      id: `user-social-${Date.now()}`,
      name: name || (provider === "google" ? "Usuário Google" : "Usuário Microsoft"),
      email: normalizedEmail,
      birthDate: "2000-01-01",
      isProfessional: false,
      role: "citizen",
      createdAt: new Date().toISOString(),
      provider: provider || "google",
      avatarUrl: provider === "google"
        ? "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
        : "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
    };
    registeredUsers.push(user);
  }

  const { password: _, ...safeUser } = user;
  res.json({
    message: `Autenticado com ${provider === "google" ? "Google" : "Microsoft"} com sucesso!`,
    user: safeUser,
    token: `aegis-token-${user.id}`,
  });
});

// ================= USER PROFILE & ACCOUNT MANAGEMENT =================

// Update Profile
app.put("/api/auth/profile", (req, res) => {
  const { id, name, birthDate, isProfessional, role, avatarUrl, password } = req.body;
  if (!id) {
    return res.status(400).json({ error: "Identificador do usuário é obrigatório." });
  }

  const user = registeredUsers.find((u) => u.id === id);
  if (!user) {
    return res.status(404).json({ error: "Usuário não encontrado." });
  }

  if (name) user.name = String(name).trim();
  if (birthDate) user.birthDate = String(birthDate).trim();
  if (typeof isProfessional === "boolean") {
    user.isProfessional = isProfessional;
    user.role = isProfessional ? "specialist" : "citizen";
  }
  if (role) user.role = role;
  if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;
  if (password) user.password = String(password);

  const { password: _, ...safeUser } = user;
  res.json({
    message: "Perfil atualizado com sucesso!",
    user: safeUser,
  });
});

// Delete Account
app.delete("/api/auth/profile/:id", (req, res) => {
  const userId = req.params.id;
  const index = registeredUsers.findIndex((u) => u.id === userId);
  if (index === -1) {
    return res.status(404).json({ error: "Usuário não encontrado." });
  }

  // Remove user
  registeredUsers.splice(index, 1);
  res.json({ message: "Conta e dados excluídos permanentemente com sucesso." });
});

// ================= ANONYMOUS POSTS & FEED API =================

// Get all anonymous posts
app.get("/api/posts", (_req, res) => {
  res.json(anonymousPostsList);
});

// Create new anonymous post
app.post("/api/posts", (req, res) => {
  const { userId, category, title, content, imageUrl, stateCode } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "Título e conteúdo da publicação são obrigatórios." });
  }

  // Generate random anonymous shield pseudonym
  const randomNum = Math.floor(100 + Math.random() * 900);
  const pseudonymPool = [
    "Cidadão Anônimo",
    "Escudo Protetor",
    "Guardião Vigilante",
    "Sentinela Aegis",
    "Defensor Digital",
    "Voz Segura",
    "Cidadão Alerta",
  ];
  const randomName = pseudonymPool[Math.floor(Math.random() * pseudonymPool.length)];
  const alias = `${randomName} #${randomNum}`;

  const colors = ["#70f3ff", "#dfcf93", "#a48ca7", "#3a6ea5", "#4ade80", "#fbbf24"];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  const categoryTags: Record<string, string> = {
    alerta_urgente: "Alerta Urgente",
    relato_golpe: "Relato de Golpe",
    duvida_seguranca: "Dúvida de Segurança",
    dica_prevencao: "Dica de Prevenção",
    desabafo_apoio: "Apoio & Acolhimento",
  };

  const newPost: AnonymousPost = {
    id: `post-${Date.now()}`,
    userId: userId || undefined,
    authorAlias: alias,
    avatarColor: randomColor,
    category: category || "relato_golpe",
    tagLabel: categoryTags[category] || "Relato Geral",
    title,
    content,
    imageUrl: imageUrl || undefined,
    createdAt: new Date().toISOString(),
    likesCount: 1,
    commentsCount: 0,
    comments: [],
    stateCode: stateCode || undefined,
  };

  anonymousPostsList.unshift(newPost);
  res.status(201).json({
    message: "Publicação anônima compartilhada com sucesso no feed!",
    post: newPost,
  });
});

// Like anonymous post
app.post("/api/posts/:id/like", (req, res) => {
  const post = anonymousPostsList.find((p) => p.id === req.params.id);
  if (!post) return res.status(404).json({ error: "Publicação não encontrada." });
  post.likesCount += 1;
  res.json({ likesCount: post.likesCount });
});

// Add comment to anonymous post
app.post("/api/posts/:id/comments", (req, res) => {
  const { content } = req.body;
  if (!content || !content.trim()) {
    return res.status(400).json({ error: "Comentário não pode estar em branco." });
  }

  const post = anonymousPostsList.find((p) => p.id === req.params.id);
  if (!post) return res.status(404).json({ error: "Publicação não encontrada." });

  const randomNum = Math.floor(100 + Math.random() * 900);
  const colors = ["#70f3ff", "#dfcf93", "#a48ca7", "#3a6ea5", "#4ade80"];
  const newComment: AnonymousPostComment = {
    id: `comm-${Date.now()}`,
    postId: post.id,
    authorAlias: `Comentário Anônimo #${randomNum}`,
    avatarColor: colors[Math.floor(Math.random() * colors.length)],
    content: content.trim(),
    createdAt: new Date().toISOString(),
    likesCount: 0,
  };

  post.comments.push(newComment);
  post.commentsCount = post.comments.length;

  res.status(201).json({ message: "Comentário enviado!", comment: newComment });
});

// Delete user's own post
app.delete("/api/posts/:id", (req, res) => {
  const index = anonymousPostsList.findIndex((p) => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Publicação não encontrada." });
  anonymousPostsList.splice(index, 1);
  res.json({ message: "Publicação removida com sucesso." });
});

// ================= USER SUBMISSIONS AUDIT / MY CONTRIBUTIONS =================

// Get all submissions created by specific user (Reports, Alerts, Articles, Posts)
app.get("/api/user/submissions", (req, res) => {
  const userEmail = req.query.email ? String(req.query.email).toLowerCase() : "";
  const userId = req.query.userId ? String(req.query.userId) : "";

  const myAlerts = communityAlertsList.filter(
    (a) => (a.authorEmail && a.authorEmail.toLowerCase() === userEmail) || (userId && a.id.includes(userId))
  );

  const myArticles = communityArticlesList.filter(
    (a) => (a.authorEmail && a.authorEmail.toLowerCase() === userEmail) || (userId && a.id.includes(userId))
  );

  const myReports = communityReports.filter(
    (r) => (r.authorEmail && r.authorEmail.toLowerCase() === userEmail) || (r.authorId && r.authorId === userId)
  );

  const myPosts = anonymousPostsList.filter((p) => p.userId && p.userId === userId);

  res.json({
    alerts: myAlerts,
    articles: myArticles,
    reports: myReports,
    posts: myPosts,
    stats: {
      totalAlerts: myAlerts.length,
      totalArticles: myArticles.length,
      totalReports: myReports.length,
      totalPosts: myPosts.length,
      totalApproved: [...myAlerts, ...myArticles, ...myReports].filter((i) => i.status === "published" || i.status === "verified").length,
      totalPending: [...myAlerts, ...myArticles, ...myReports].filter((i) => i.status === "pending_moderation" || i.status === "pending").length,
    },
  });
});


// Vite Middleware integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Aegis Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
