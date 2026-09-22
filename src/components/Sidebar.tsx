import React from 'react';
import {
  Shield,
  Bot,
  Search,
  PhoneOff,
  MapPin,
  Eye,
  Users,
  HeartHandshake,
  KeyRound,
  ShieldCheck,
  BookOpen,
  Sparkles,
  AlertTriangle,
  User,
  LogOut,
  MessageSquare,
  UserCheck,
  ClipboardList,
  ExternalLink,
} from 'lucide-react';
import { ActiveTab } from '../types';
import { AEGIS_LOGO_IMG, LIA_AVATAR_IMG } from '../assets/branding';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onCloseMobile,
}) => {
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();
  const securitySuiteItems = [
    { id: 'dashboard', label: 'Início & Proteção', icon: Shield },
    { id: 'feed', label: 'Feed Anônimo', icon: MessageSquare },
    { id: 'lia-ai', label: 'Assistente Lia IA', icon: Bot },
    { id: 'scam-alerts', label: 'Notícias & Alertas', icon: AlertTriangle },
    { id: 'scanner', label: 'Verificar Ameaças', icon: Search },
    { id: 'call-blocker', label: 'Bloquear Chamadas', icon: PhoneOff },
    { id: 'scam-map', label: 'Mapa Regional', icon: MapPin },
    { id: 'leak-radar', label: 'Radar de Vazamentos', icon: Eye },
    { id: 'community-reports', label: 'Comunidade & Denúncias', icon: Users },
  ] as const;

  const personalItems = [
    { id: 'user-profile', label: 'Meu Perfil', icon: UserCheck },
    { id: 'my-submissions', label: 'Minhas Contribuições', icon: ShieldCheck },
    { id: 'digital-vault', label: 'Cofre de Senhas', icon: KeyRound },
    { id: 'glossary', label: 'Glossário Descomplicado', icon: BookOpen },
    { id: 'post-scam-care', label: 'Apoio Especializado & MED', icon: HeartHandshake },
  ] as const;

  const handleItemClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside className="w-68 border-r border-[#2a2e39] bg-[#1b1d23] flex flex-col h-full select-none shrink-0 shadow-lg">
      {/* Brand Header with App Logo */}
      <div
        onClick={() => handleItemClick('dashboard')}
        className="p-4 border-b border-[#2a2e39] cursor-pointer group flex items-center justify-between transition-colors hover:bg-[#23262f]"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-[#dfcf93]/40 shadow-sm shadow-[#dfcf93]/20 group-hover:scale-105 transition-transform shrink-0 bg-black">
            <img
              src={AEGIS_LOGO_IMG}
              alt="Aegis Logo"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="font-heading font-bold text-lg tracking-tight text-white">
              Aegis
            </h1>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto scrollbar-none space-y-6">
        {/* Section: Security Suite */}
        <div>
          <div className="px-3 pb-2 text-[11px] uppercase tracking-wider text-[#686868] font-heading font-semibold">
            Ferramentas Principais
          </div>
          <div className="space-y-1">
            {securitySuiteItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`sidebar-nav-${item.id}`}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#3a6ea5]/25 text-[#70f3ff] font-heading font-semibold shadow-xs border border-[#70f3ff]/30'
                      : 'text-[#d2d2d2] hover:bg-[#23262f] hover:text-white border border-transparent'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 sm:w-4.5 sm:h-4.5 mr-3 shrink-0 transition-colors ${
                      isActive ? 'text-[#70f3ff]' : 'text-[#686868]'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section: Personal & Support */}
        <div>
          <div className="px-3 pb-2 text-[11px] uppercase tracking-wider text-[#686868] font-heading font-semibold">
            Apoio & Conhecimento
          </div>
          <div className="space-y-1">
            {personalItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`sidebar-nav-${item.id}`}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#3a6ea5]/25 text-[#70f3ff] font-heading font-semibold shadow-xs border border-[#70f3ff]/30'
                      : 'text-[#d2d2d2] hover:bg-[#23262f] hover:text-white border border-transparent'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 sm:w-4.5 sm:h-4.5 mr-3 shrink-0 transition-colors ${
                      isActive ? 'text-[#70f3ff]' : 'text-[#686868]'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section: Prototype Feedback */}
        <div className="pt-2">
          <div className="px-3 pb-2 text-[11px] uppercase tracking-wider text-[#dfcf93] font-heading font-semibold flex items-center justify-between">
            <span>Avaliação do Protótipo</span>
          </div>
          <a
            id="sidebar-feedback-link"
            href="https://forms.gle/dvJkVW2JBVQksRgs5"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-2.5 p-3 rounded-xl bg-[#dfcf93]/10 hover:bg-[#dfcf93]/15 border border-[#dfcf93]/30 text-white transition-all group cursor-pointer block"
            title="Abrir formulário de avaliação do protótipo Aegis"
          >
            <div className="p-1.5 rounded-lg bg-[#dfcf93]/20 text-[#dfcf93] shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
              <ClipboardList className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-bold text-xs text-[#dfcf93] group-hover:text-white transition-colors">
                  Feedback de Uso
                </span>
                <ExternalLink className="w-3 h-3 text-[#dfcf93]/70 group-hover:text-white shrink-0" />
              </div>
              <p className="text-[11px] text-[#94a3b8] mt-0.5 leading-snug">
                Sua opinião é vital: responda à pesquisa rápida no Google Forms.
              </p>
            </div>
          </a>
        </div>
      </nav>

      {/* User Account / Auth Card Footer */}
      <div className="p-4 border-t border-[#2a2e39] bg-[#14151a]">
        {isAuthenticated && user ? (
          <div className="p-3 rounded-2xl bg-[#1b1d23] border border-[#2a2e39] space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#3a6ea5] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-full h-full rounded-xl object-cover"
                  />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-heading font-bold text-xs text-white truncate">{user.name}</p>
                <p className="text-[11px] text-[#94a3b8] truncate">{user.email}</p>
              </div>
            </div>
            <div className="pt-2 border-t border-[#2a2e39] flex items-center justify-end">
              <button
                type="button"
                onClick={logout}
                className="text-[11px] text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-2xl bg-[#1b1d23] border border-[#2a2e39] space-y-2 text-center">
            <p className="text-xs font-heading font-bold text-white">Sua Conta Aegis</p>
            <p className="text-[11px] text-[#94a3b8] leading-tight">
              Acesse para salvar denúncias e monitorar seus dados.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                id="sidebar-login-btn"
                onClick={() => openAuthModal('login')}
                className="py-1.5 px-2 rounded-xl bg-[#23262f] hover:bg-[#2a2e39] text-white text-xs font-bold border border-[#323744] transition-all cursor-pointer"
              >
                Entrar
              </button>
              <button
                type="button"
                id="sidebar-register-btn"
                onClick={() => openAuthModal('register')}
                className="py-1.5 px-2 rounded-xl bg-[#a48ca7] hover:bg-[#967d99] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                Cadastrar
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};


