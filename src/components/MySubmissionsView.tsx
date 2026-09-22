import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  FileText,
  Radio,
  Newspaper,
  ShieldAlert,
  ThumbsUp,
  ExternalLink,
  ChevronRight,
  Filter,
  ArrowLeft,
  User,
  Search,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CollaborativeReport, CommunityAlert, CommunityArticle } from '../types';

interface MySubmissionsViewProps {
  onBackToProfile?: () => void;
  onNavigateToNewReport?: () => void;
  onNavigateToNewAlert?: () => void;
}

export const MySubmissionsView: React.FC<MySubmissionsViewProps> = ({
  onBackToProfile,
  onNavigateToNewReport,
  onNavigateToNewAlert,
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'all' | 'reports' | 'alerts' | 'articles'>('all');
  const [loading, setLoading] = useState(true);

  const [alerts, setAlerts] = useState<CommunityAlert[]>([]);
  const [articles, setArticles] = useState<CommunityArticle[]>([]);
  const [reports, setReports] = useState<CollaborativeReport[]>([]);
  const [stats, setStats] = useState({
    totalAlerts: 0,
    totalArticles: 0,
    totalReports: 0,
    totalApproved: 0,
    totalPending: 0,
  });

  useEffect(() => {
    fetchSubmissions();
  }, [user]);

  const fetchSubmissions = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await fetch(
        `/api/user/submissions?email=${encodeURIComponent(user.email)}&userId=${encodeURIComponent(user.id)}`
      );
      const data = await res.json();
      if (res.ok) {
        setAlerts(data.alerts || []);
        setArticles(data.articles || []);
        setReports(data.reports || []);
        if (data.stats) setStats(data.stats);
      }
    } catch (e) {
      console.error('Error fetching submissions:', e);
    } finally {
      setLoading(false);
    }
  };

  const renderStatusBadge = (status: string, isAudited?: boolean) => {
    if (status === 'published' || status === 'verified') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Aprovado pela Equipe Aegis</span>
        </span>
      );
    }
    if (status === 'investigating') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#70f3ff]/10 border border-[#70f3ff]/30 text-[#70f3ff]">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span>Em Investigação Técnica</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 border border-amber-500/30 text-amber-300">
        <Clock className="w-3.5 h-3.5" />
        <span>Em Análise / Moderação</span>
      </span>
    );
  };

  // Compile items with normalized format
  const allItems = [
    ...reports.map((r) => ({
      id: r.id,
      type: 'report' as const,
      typeName: 'Denúncia de Fraude',
      title: r.title,
      description: r.description,
      target: r.target,
      category: r.scamCategory,
      createdAt: r.reportedAt,
      status: r.status,
      upvotes: r.upvotes,
    })),
    ...alerts.map((a) => ({
      id: a.id,
      type: 'alert' as const,
      typeName: 'Alerta Comunitário',
      title: a.title,
      description: a.description,
      advice: a.victimAdvice,
      category: a.category,
      createdAt: a.createdAt,
      status: a.status,
      upvotes: a.upvotesCount,
    })),
    ...articles.map((art) => ({
      id: art.id,
      type: 'article' as const,
      typeName: 'Notícia / Artigo',
      title: art.title,
      description: art.summary || art.content,
      category: art.category,
      createdAt: art.createdAt,
      status: art.status,
      upvotes: art.likesCount,
    })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const filteredItems = allItems.filter((item) => {
    if (activeTab === 'reports') return item.type === 'report';
    if (activeTab === 'alerts') return item.type === 'alert';
    if (activeTab === 'articles') return item.type === 'article';
    return true;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#171920] via-[#1b1e28] to-[#171920] border border-[#2a2e39] p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            {onBackToProfile && (
              <button
                type="button"
                onClick={onBackToProfile}
                className="text-xs text-[#70f3ff] hover:underline font-bold flex items-center gap-1.5 mb-2 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar ao Perfil</span>
              </button>
            )}
            <h1 className="font-heading font-black text-2xl sm:text-3xl text-white">
              Painel de Contribuições & Status de Aprovação
            </h1>
            <p className="text-xs sm:text-sm text-[#94a3b8] mt-1 max-w-2xl">
              Acompanhe o processo de análise, auditoria e publicação das suas denúncias, alertas de novos golpes e matérias enviadas para a plataforma Aegis.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-[#131418] border border-[#2a2e39] text-center min-w-[100px]">
              <span className="font-heading font-black text-xl text-emerald-400">
                {stats.totalApproved}
              </span>
              <p className="text-[10px] text-[#94a3b8]">Aprovados</p>
            </div>
            <div className="p-3 rounded-2xl bg-[#131418] border border-[#2a2e39] text-center min-w-[100px]">
              <span className="font-heading font-black text-xl text-amber-400">
                {stats.totalPending}
              </span>
              <p className="text-[10px] text-[#94a3b8]">Em Moderação</p>
            </div>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-[#2a2e39]/60">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              activeTab === 'all'
                ? 'bg-[#3a6ea5] border-[#70f3ff] text-white shadow-xs'
                : 'bg-[#131418] border-[#2a2e39] text-[#94a3b8] hover:text-white'
            }`}
          >
            Todos os Envios ({allItems.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('reports')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              activeTab === 'reports'
                ? 'bg-[#3a6ea5] border-[#70f3ff] text-white shadow-xs'
                : 'bg-[#131418] border-[#2a2e39] text-[#94a3b8] hover:text-white'
            }`}
          >
            Denúncias ({reports.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('alerts')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              activeTab === 'alerts'
                ? 'bg-[#3a6ea5] border-[#70f3ff] text-white shadow-xs'
                : 'bg-[#131418] border-[#2a2e39] text-[#94a3b8] hover:text-white'
            }`}
          >
            Alertas de Golpes ({alerts.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('articles')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              activeTab === 'articles'
                ? 'bg-[#3a6ea5] border-[#70f3ff] text-white shadow-xs'
                : 'bg-[#131418] border-[#2a2e39] text-[#94a3b8] hover:text-white'
            }`}
          >
            Notícias & Artigos ({articles.length})
          </button>
        </div>
      </div>

      {/* Submissions List */}
      {loading ? (
        <div className="p-12 text-center text-[#94a3b8]">
          <div className="w-8 h-8 border-2 border-[#70f3ff] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs">Buscando suas submissões e status de moderação...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="p-12 rounded-3xl bg-[#171920] border border-[#2a2e39] text-center space-y-4">
          <ShieldAlert className="w-12 h-12 text-[#686868] mx-auto opacity-50" />
          <div className="space-y-1">
            <h3 className="font-heading font-bold text-base text-white">
              Nenhuma contribuição nesta categoria
            </h3>
            <p className="text-xs text-[#94a3b8] max-w-md mx-auto">
              Você pode enviar denúncias de links/números suspeitos ou cadastrar notícias e alertas de novos golpes.
            </p>
          </div>
          <div className="flex justify-center gap-3 pt-2">
            {onNavigateToNewReport && (
              <button
                type="button"
                onClick={onNavigateToNewReport}
                className="px-4 py-2 rounded-xl bg-[#3a6ea5] text-white text-xs font-bold hover:bg-[#2d5884] cursor-pointer"
              >
                Fazer Denúncia
              </button>
            )}
            {onNavigateToNewAlert && (
              <button
                type="button"
                onClick={onNavigateToNewAlert}
                className="px-4 py-2 rounded-xl bg-[#a48ca7] text-white text-xs font-bold hover:bg-[#967d99] cursor-pointer"
              >
                Cadastrar Alerta/Notícia
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="p-5 sm:p-6 rounded-3xl bg-[#171920] border border-[#2a2e39] hover:border-[#3a6ea5]/50 transition-all space-y-4 shadow-lg"
            >
              {/* Header with Type & Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-xl bg-[#131418] border border-[#2a2e39] text-[11px] font-heading font-bold text-[#dfcf93]">
                    {item.typeName}
                  </span>
                  <span className="text-xs text-[#94a3b8]">• {item.category}</span>
                </div>

                {renderStatusBadge(item.status)}
              </div>

              {/* Title & Description */}
              <div className="space-y-1.5">
                <h3 className="font-heading font-bold text-base sm:text-lg text-white">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#d2d2d2] leading-relaxed">
                  {item.description}
                </p>
                {'target' in item && item.target && (
                  <p className="text-xs text-[#70f3ff] font-mono bg-[#131418] p-2 rounded-xl border border-[#2a2e39] inline-block mt-1">
                    Alvo denunciado: {item.target}
                  </p>
                )}
                {'advice' in item && item.advice && (
                  <div className="p-3 rounded-2xl bg-[#131418] border border-[#2a2e39] text-xs text-[#94a3b8] space-y-1 mt-2">
                    <span className="font-bold text-emerald-400">Orientação cadastrada para vítimas:</span>
                    <p className="text-[#d2d2d2]">{item.advice}</p>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-[#2a2e39] flex items-center justify-between text-xs text-[#686868]">
                <span>
                  Enviado em{' '}
                  {new Date(item.createdAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>

                <div className="flex items-center gap-1.5 text-[#94a3b8]">
                  <ThumbsUp className="w-3.5 h-3.5 text-[#70f3ff]" />
                  <span>{item.upvotes} Votos da Comunidade</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
