export type ActiveTab =
  | 'dashboard'
  | 'lia-ai'
  | 'scanner'
  | 'scam-alerts'
  | 'call-blocker'
  | 'scam-map'
  | 'leak-radar'
  | 'community-reports'
  | 'feed'
  | 'user-profile'
  | 'my-submissions'
  | 'post-scam-care'
  | 'digital-vault'
  | 'glossary';

export type NavigationTab = ActiveTab;

export interface AnonymousPostComment {
  id: string;
  postId: string;
  authorAlias: string; // e.g. "Cidadão Anônimo #492"
  avatarColor: string;
  content: string;
  createdAt: string;
  likesCount: number;
}

export interface AnonymousPost {
  id: string;
  userId?: string; // Private ID for author tracking
  authorAlias: string; // Public pseudonym e.g., "Cidadão Protegido #812"
  avatarColor: string;
  category: 'alerta_urgente' | 'relato_golpe' | 'duvida_seguranca' | 'dica_prevencao' | 'desabafo_apoio';
  tagLabel: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  comments?: AnonymousPostComment[];
  isPinned?: boolean;
  stateCode?: string; // Optional UF state tag
}

export interface GlossaryTerm {
  id: string;
  term: string;
  pronunciation?: string;
  category: 'threats' | 'defense' | 'protocols' | 'scams' | 'privacy';
  severity?: 'critical' | 'high' | 'medium' | 'info';
  shortDefinition: string;
  fullDefinition: string;
  example: string;
  realWorldScenario: string;
  howToProtect: string[];
  relatedTerms: string[];
  aliases?: string[];
  popularSearch?: boolean;
}

export type ScannerCategory = 'link' | 'sms' | 'email' | 'boleto' | 'file';

export interface ScanResult {
  status: 'safe' | 'suspicious' | 'dangerous';
  threatScore: number;
  verdictTitle: string;
  category: string;
  summary: string;
  fraudIndicators: string[];
  recommendation: string;
  officialChannels?: string;
  canReport?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedActions?: string[];
  isEmergencyAction?: boolean;
}

export interface BlacklistPhone {
  id: string;
  number: string;
  category: string;
  reputation: 'dangerous' | 'suspect' | 'telemarketing';
  reportsCount: number;
  lastReported: string;
  notes: string;
}

export interface CollaborativeReport {
  id: string;
  type: 'link' | 'phone' | 'email' | 'profile' | 'pix' | 'sms';
  target: string;
  title: string;
  description: string;
  evidenceCount: number;
  reportedAt: string;
  status: 'verified' | 'pending' | 'investigating';
  upvotes: number;
  tags: string[];
  victimLoss?: string;
  scamCategory: string;
}

export interface StateScamDetail {
  rank: number;
  title: string;
  category: string;
  incidentPercentage: number; // e.g. 34%
  riskLevel: 'Crítico' | 'Muito Alto' | 'Alto' | 'Médio';
  description: string;
  exampleScenario: string;
  defenseAction: string;
  financialImpact: 'Prejuízo Alto' | 'Prejuízo Médio' | 'Prejuízo Crítico' | 'Prejuízo Baixo';
}

export interface StateScamData {
  stateCode: string;
  stateName: string;
  capital: string;
  region: 'Norte' | 'Nordeste' | 'Centro-Oeste' | 'Sudeste' | 'Sul';
  threatLevel: 'Alto' | 'Muito Alto' | 'Crítico' | 'Médio';
  scamIncrease: string;
  victimsEstimated: string;
  avgLossPerVictim: string;
  complaintResolutionRate: string;
  topScams: StateScamDetail[];
  // Legacy / convenience fields
  topScam?: string;
  scamType?: string;
  description?: string;
  tips?: string[];
}

export interface SecurityNews {
  id: string;
  title: string;
  category: 'Alerta de Golpe' | 'Vazamento' | 'Dica de Especialista' | 'Legislação';
  date: string;
  source: string;
  summary: string;
  urgency: 'high' | 'medium' | 'normal';
  readTime: string;
}

export interface VaultItem {
  id: string;
  title: string;
  username: string;
  password?: string;
  passwordEncrypted?: string;
  category: string;
  website?: string;
  notes?: string;
  strength: 'weak' | 'medium' | 'strong' | 'pwned';
  lastUpdated: string;
}

export interface VaultAccessLog {
  id: string;
  timestamp: string;
  status: 'success' | 'failed';
  ipAddress: string;
  device: string;
  location: string;
}

export interface Specialist {
  id: string;
  name: string;
  role: string;
  type: 'psychology' | 'lawyer' | 'cybersecurity';
  registryType: 'CRP' | 'OAB' | 'SBCP' | 'Outro';
  registryNumber: string;
  photoUrl: string;
  priceTag: string;
  specialties: string[];
  approach: string;
  targetAudience: string;
  about: string;
  fullBio?: string;
  cityState: string;
  whatsappNumber: string;
  formattedPhone: string;
  defaultMessage: string;
  isOnlineNow?: boolean;
  rating?: number;
  consultationsCount?: number;
}

export interface CommunityAlert {
  id: string;
  title: string;
  description: string;
  victimAdvice: string;
  imageUrl?: string;
  mediaType?: 'image' | 'video';
  authorName?: string;
  authorEmail?: string;
  createdAt: string;
  upvotesCount: number;
  category: string;
  status: 'published' | 'pending_moderation';
  isAudited?: boolean;
}

export interface CommunityArticle {
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
  status: 'published' | 'pending_moderation';
  likesCount: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  birthDate: string;
  isProfessional?: boolean;
  role?: 'citizen' | 'specialist' | 'admin';
  createdAt: string;
  avatarUrl?: string;
}

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

