import React, { useState } from 'react';
import {
  Shield,
  ShieldAlert,
  Bot,
  Search,
  PhoneOff,
  MapPin,
  Eye,
  Users,
  HeartHandshake,
  KeyRound,
  BookOpen,
  Menu,
  X,
  Sparkles,
  User,
  LogOut,
  ChevronDown,
  UserCheck,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';
import { ActiveTab } from '../types';
import { LIA_AVATAR_IMG } from '../assets/branding';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenSOS: () => void;
  isMobileMenuOpen?: boolean;
  setIsMobileMenuOpen?: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenSOS,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) => {
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const getTabTitle = (tab: ActiveTab) => {
    switch (tab) {
      case 'dashboard':
        return {
          title: 'Central de Segurança',
          subtitle: 'Visão geral da sua proteção e monitoramento diário',
          icon: Shield,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
        };
      case 'lia-ai':
        return {
          title: 'Assistente Lia IA',
          subtitle: 'Tire dúvidas em tempo real e verifique mensagens suspeitas',
          icon: Bot,
          color: 'text-indigo-600',
          bgColor: 'bg-indigo-50',
        };
      case 'scanner':
        return {
          title: 'Verificador de Ameaças',
          subtitle: 'Analise links, mensagens de WhatsApp, boletos bancários e arquivos',
          icon: Search,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
        };
      case 'call-blocker':
        return {
          title: 'Bloqueador de Chamadas',
          subtitle: 'Proteção contra ligações de falso banco e números invasivos',
          icon: PhoneOff,
          color: 'text-amber-600',
          bgColor: 'bg-amber-50',
        };
      case 'scam-map':
        return {
          title: 'Mapa de Golpes & Notícias',
          subtitle: 'Principais golpes aplicados por estado no Brasil e alertas',
          icon: MapPin,
          color: 'text-emerald-600',
          bgColor: 'bg-emerald-50',
        };
      case 'leak-radar':
        return {
          title: 'Radar de Vazamentos',
          subtitle: 'Verifique se seu CPF, e-mail ou senhas foram expostos',
          icon: Eye,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
        };
      case 'feed':
        return {
          title: 'Feed Anônimo da Comunidade',
          subtitle: 'Rede social segura para relatos, dúvidas e alertas sobre golpes',
          icon: MessageSquare,
          color: 'text-[#dfcf93]',
          bgColor: 'bg-[#a48ca7]/10',
        };
      case 'user-profile':
        return {
          title: 'Meu Perfil',
          subtitle: 'Gerencie suas credenciais, preferências e publicações no Aegis',
          icon: UserCheck,
          color: 'text-[#70f3ff]',
          bgColor: 'bg-[#3a6ea5]/20',
        };
      case 'my-submissions':
        return {
          title: 'Minhas Contribuições',
          subtitle: 'Acompanhe o status de aprovação de denúncias, alertas e notícias',
          icon: ShieldCheck,
          color: 'text-emerald-400',
          bgColor: 'bg-emerald-500/10',
        };
      case 'community-reports':
        return {
          title: 'Comunidade & Denúncias',
          subtitle: 'Compartilhe tentativas de golpe e ajude a proteger outras pessoas',
          icon: Users,
          color: 'text-indigo-600',
          bgColor: 'bg-indigo-50',
        };
      case 'post-scam-care':
        return {
          title: 'Apoio Especializado & MED',
          subtitle: 'Orientação jurídica, apoio psicológico e recuperação Pix',
          icon: HeartHandshake,
          color: 'text-rose-600',
          bgColor: 'bg-rose-50',
        };
      case 'digital-vault':
        return {
          title: 'Cofre de Senhas',
          subtitle: 'Gerenciador seguro de credenciais com criptografia local',
          icon: KeyRound,
          color: 'text-slate-700',
          bgColor: 'bg-slate-100',
        };
      case 'glossary':
        return {
          title: 'Glossário Descomplicado',
          subtitle: 'Aprenda os termos de segurança de forma simples e direta',
          icon: BookOpen,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
        };
      default:
        return {
          title: 'Central de Segurança',
          subtitle: 'Ambiente de proteção Aegis',
          icon: Shield,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
        };
    }
  };

  const currentInfo = getTabTitle(activeTab);
  const CurrentIcon = currentInfo.icon;

  return (
    <header className="h-16 sm:h-18 border-b border-[#2a2e39] px-3 sm:px-6 lg:px-8 flex items-center justify-between bg-[#1b1d23]/95 backdrop-blur-md z-30 sticky top-0 w-full">
      {/* Left: Mobile hamburger & Tab Header */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 mr-2">
        {setIsMobileMenuOpen && (
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-[#d2d2d2] hover:text-white rounded-xl bg-[#23262f] hover:bg-[#2a2e39] transition-colors border border-[#323744] shrink-0 cursor-pointer"
            aria-label="Abrir Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        )}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="p-2 sm:p-2.5 rounded-xl bg-[#23262f] border border-[#323744] hidden sm:flex items-center justify-center text-[#70f3ff] shrink-0">
            <CurrentIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#70f3ff]" />
          </div>
          <div className="min-w-0">
            <h2 className="font-heading font-bold text-sm sm:text-base lg:text-lg text-white tracking-tight truncate">
              {currentInfo.title}
            </h2>
            <p className="text-xs text-[#94a3b8] hidden md:block truncate">
              {currentInfo.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Right: Actions, User Profile & SOS Button */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* User Account / Login Button */}
        {isAuthenticated && user ? (
          <div className="relative">
            <button
              type="button"
              id="header-user-profile-btn"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-[#23262f] hover:bg-[#2a2e39] border border-[#323744] text-[#d2d2d2] hover:text-white transition-all cursor-pointer"
              title={user.name}
            >
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#3a6ea5] text-white flex items-center justify-center text-xs font-bold shrink-0">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}
              </div>
              <span className="text-xs font-semibold max-w-[80px] md:max-w-[120px] truncate hidden md:inline">
                {user.name.split(' ')[0]}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[#94a3b8] hidden sm:inline" />
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#1b1d23] border border-[#323744] shadow-2xl p-3 z-50 animate-fade-in text-xs space-y-2"
                onClick={() => setIsUserMenuOpen(false)}
              >
                <div className="p-2.5 rounded-xl bg-[#14151a] border border-[#2a2e39]">
                  <p className="font-bold text-white text-sm truncate">{user.name}</p>
                  <p className="text-[#94a3b8] text-[11px] truncate mt-0.5">{user.email}</p>
                  <div className="mt-2 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-[#70f3ff]/10 text-[#70f3ff] text-[10px] font-bold border border-[#70f3ff]/30">
                      {user.isProfessional ? 'Especialista / Pro' : 'Cidadão Protegido'}
                    </span>
                  </div>
                </div>

                <div className="pt-1 space-y-1">
                  <button
                    type="button"
                    id="header-menu-profile-btn"
                    onClick={() => {
                      setActiveTab('user-profile');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-white hover:bg-[#23262f] font-semibold transition-colors cursor-pointer"
                  >
                    <UserCheck className="w-4 h-4 text-[#70f3ff]" />
                    <span>Meu Perfil & Edição</span>
                  </button>

                  <button
                    type="button"
                    id="header-menu-submissions-btn"
                    onClick={() => {
                      setActiveTab('my-submissions');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-white hover:bg-[#23262f] font-semibold transition-colors cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Minhas Contribuições</span>
                  </button>

                  <button
                    type="button"
                    id="header-menu-feed-btn"
                    onClick={() => {
                      setActiveTab('feed');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-white hover:bg-[#23262f] font-semibold transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 text-[#dfcf93]" />
                    <span>Feed Anônimo</span>
                  </button>

                  <div className="border-t border-[#2a2e39] my-1" />

                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 font-semibold transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sair da Conta</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            type="button"
            id="header-login-btn"
            onClick={() => openAuthModal('login')}
            className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-[#23262f] hover:bg-[#2a2e39] text-[#d2d2d2] hover:text-white font-heading font-semibold text-xs sm:text-sm border border-[#323744] transition-all shrink-0 cursor-pointer"
          >
            <User className="w-4 h-4 text-[#70f3ff]" />
            <span>Entrar</span>
          </button>
        )}

        {/* Quick Lia AI Button */}
        <button
          id="header-lia-quick-btn"
          onClick={() => setActiveTab('lia-ai')}
          className={`flex items-center gap-1.5 sm:gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl font-heading font-semibold text-xs sm:text-sm transition-all border shrink-0 cursor-pointer ${
            activeTab === 'lia-ai'
              ? 'bg-[#3a6ea5]/30 text-[#70f3ff] border-[#70f3ff]/40 shadow-xs'
              : 'bg-[#23262f] text-[#d2d2d2] hover:text-white hover:bg-[#2a2e39] border-[#323744]'
          }`}
          title="Falar com a IA Lia Antifraude"
        >
          <div className="w-6 h-6 rounded-full overflow-hidden border border-[#dfcf93]/40 shrink-0">
            <img
              src={LIA_AVATAR_IMG}
              alt="Lia Avatar"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="hidden md:inline">Conversar com Lia</span>
          <span className="hidden sm:inline md:hidden">Lia IA</span>
        </button>

        {/* SOS Emergency Button */}
        <button
          id="header-sos-btn"
          onClick={onOpenSOS}
          className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-heading font-semibold text-xs sm:text-sm shadow-sm hover:shadow-rose-900/40 active:scale-95 transition-all shrink-0 cursor-pointer"
          title="SOS Emergência - Guia rápido para quando você sofrer ou suspeitar de um golpe"
        >
          <ShieldAlert className="w-4 h-4 text-white shrink-0" />
          <span className="hidden sm:inline">Emergência </span>
          <span>SOS</span>
        </button>
      </div>
    </header>
  );
};



