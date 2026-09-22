import { StateScamData, SecurityNews, BlacklistPhone, CollaborativeReport } from '../types';
import { BRAZIL_ALL_STATES_SCAMS } from './brazilStatesScams';

export const BRAZIL_STATES_SCAM_DATA: Record<string, StateScamData> = BRAZIL_ALL_STATES_SCAMS;

export const SECURITY_NEWS: SecurityNews[] = [
  {
    id: 'news-1',
    title: 'Novo golpe do "Mecanismo Especial de Devolução": Golpistas criam falsos sites do Banco Central',
    category: 'Alerta de Golpe',
    date: 'Hoje, às 15:30',
    source: 'Aegis Threat Intel & FEBRABAN',
    summary: 'Criminosos estão usando anúncios patrocinados que prometem recuperar dinheiro perdido em golpes mediante pagamento de "taxa de desbloqueio do Pix". O Banco Central alerta que o serviço MED é 100% gratuito e acionado apenas pelo seu banco.',
    urgency: 'high',
    readTime: '3 min de leitura',
  },
  {
    id: 'news-2',
    title: 'Alerta Máximo: Campanha falsa de SMS dos Correios usa IA para simular códigos de rastreio reais',
    category: 'Alerta de Golpe',
    date: 'Ontem, às 18:45',
    source: 'CERT.br / Safernet',
    summary: 'Mensagens com textos como "Objeto retido na alfândega - pague taxa para liberação" direcionam para páginas clonadas com cobrança Pix. Os Correios reiteram que avisos oficiais só aparecem no app oficial e portal correios.com.br.',
    urgency: 'high',
    readTime: '2 min de leitura',
  },
  {
    id: 'news-3',
    title: 'Como ativar as chaves de segurança físicas e autenticadores no celular para blindar seu WhatsApp',
    category: 'Dica de Especialista',
    date: 'Há 2 dias',
    source: 'Especialistas Aegis',
    summary: 'O SMS como segundo fator de autenticação é vulnerável a golpes de portabilidade indevida (SIM Swap). Aprenda a migrar seus códigos para o Google Authenticator e colocar código PIN de 6 dígitos.',
    urgency: 'normal',
    readTime: '4 min de leitura',
  },
  {
    id: 'news-4',
    title: 'Vazamento massivo expõe 14 milhões de credenciais de lojas virtuais brasileiras',
    category: 'Vazamento',
    date: 'Há 3 dias',
    source: 'HaveIBeenPwned & ANPD',
    summary: 'Base com histórico de senhas criptografadas foi divulgada em fóruns clandestinos. Especialistas recomendam a alteração imediata de senhas repetidas e auditoria no cofre digital.',
    urgency: 'medium',
    readTime: '3 min de leitura',
  },
];

export const INITIAL_VAULT_ITEMS = [
  {
    id: 'vault-1',
    title: 'Conta Banco Principal',
    username: 'maria.luiza@email.com',
    passwordEncrypted: '••••••••••••••••',
    category: 'Bancário' as const,
    website: 'https://nubank.com.br',
    notes: 'Token de segurança ativado no celular principal. Não salvar cartão virtual.',
    strength: 'strong' as const,
    lastUpdated: '15/08/2026',
  },
  {
    id: 'vault-2',
    title: 'Instagram & Facebook',
    username: '@marialuiza_sec',
    passwordEncrypted: '••••••••••••',
    category: 'Rede Social' as const,
    website: 'https://instagram.com',
    notes: '2FA configurado com app autenticador.',
    strength: 'strong' as const,
    lastUpdated: '10/08/2026',
  },
  {
    id: 'vault-3',
    title: 'E-mail Pessoal Gmail',
    username: 'marialuizafernandes383@gmail.com',
    passwordEncrypted: '••••••••••••••••••••',
    category: 'Email' as const,
    website: 'https://mail.google.com',
    notes: 'Chave de segurança de recuperação salva offline.',
    strength: 'strong' as const,
    lastUpdated: '01/08/2026',
  },
];

export const INITIAL_ACCESS_LOGS = [
  {
    id: 'log-1',
    timestamp: 'Hoje, às 16:48',
    status: 'success' as const,
    ipAddress: '177.136.210.45',
    device: 'Chrome / macOS (Aparelho Autorizado)',
    location: 'São Paulo, Brasil',
  },
  {
    id: 'log-2',
    timestamp: 'Ontem, às 10:14',
    status: 'success' as const,
    ipAddress: '177.136.210.45',
    device: 'Mobile Safari / iOS (iPhone 15)',
    location: 'São Paulo, Brasil',
  },
  {
    id: 'log-3',
    timestamp: '18/08/2026, às 03:22',
    status: 'failed' as const,
    ipAddress: '185.220.101.5',
    device: 'Firefox / Linux (IP Suspeito / Bloqueado)',
    location: 'Frankfurt, Alemanha (Tentativa de Brute Force)',
  },
];
