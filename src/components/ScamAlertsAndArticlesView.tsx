import React, { useState, useEffect, useMemo } from 'react';
import {
  AlertTriangle,
  Newspaper,
  Plus,
  ChevronDown,
  ChevronUp,
  Video,
  FileText,
  Check,
  ShieldCheck,
  Search,
  ThumbsUp,
  Heart,
  Share2,
  Sparkles,
  ArrowLeft,
  X,
  CheckCircle2,
  Info,
  Clock,
  BookOpen,
  Send,
  MapPin,
  Flame,
  Radio,
  ExternalLink,
  ShieldAlert,
  Mail,
  User,
  Shield,
} from 'lucide-react';
import { CommunityAlert, CommunityArticle, ActiveTab, StateScamData } from '../types';
import { useAuth } from '../context/AuthContext';
import { SECURITY_NEWS } from '../data/securityData';
import { BRAZIL_ALL_STATES_SCAMS } from '../data/brazilStatesScams';

interface ScamAlertsAndArticlesViewProps {
  onOpenSOS?: () => void;
  setActiveTab?: (tab: ActiveTab) => void;
}

export const ScamAlertsAndArticlesView: React.FC<ScamAlertsAndArticlesViewProps> = ({
  onOpenSOS,
  setActiveTab,
}) => {
  const { user } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState<'alerts' | 'articles' | 'news' | 'map'>('alerts');
  const [alerts, setAlerts] = useState<CommunityAlert[]>([]);
  const [articles, setArticles] = useState<CommunityArticle[]>([]);
  const [expandedAlertIds, setExpandedAlertIds] = useState<Record<string, boolean>>({});

  // Map & News States
  const [selectedStateCode, setSelectedStateCode] = useState<string>('SP');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [stateSearch, setStateSearch] = useState<string>('');
  const [newsCategoryFilter, setNewsCategoryFilter] = useState<string>('all');
  const [expandedScamRank, setExpandedScamRank] = useState<number | null>(1);

  // Modal / Screen Creation States
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [createMode, setCreateMode] = useState<'alert' | 'article'>('alert');

  // Form States - Alert
  const [alertTitle, setAlertTitle] = useState('');
  const [alertAuthorName, setAlertAuthorName] = useState(user?.name || '');
  const [alertAuthorEmail, setAlertAuthorEmail] = useState(user?.email || '');
  const [alertDescription, setAlertDescription] = useState('');
  const [alertVictimAdvice, setAlertVictimAdvice] = useState('');
  const [alertCategory, setAlertCategory] = useState('Golpe Comercial / Pix');
  const [alertAwareConsent, setAlertAwareConsent] = useState(true);
  const [alertTruthConsent, setAlertTruthConsent] = useState(true);

  // Form States - Article
  const [articleTitle, setArticleTitle] = useState('');
  const [articleAuthorName, setArticleAuthorName] = useState(user?.name || '');
  const [articleAuthorEmail, setArticleAuthorEmail] = useState(user?.email || '');
  const [articleContent, setArticleContent] = useState('');
  const [articleCategory, setArticleCategory] = useState('Dica de Especialista');
  const [articleAwareConsent, setArticleAwareConsent] = useState(true);
  const [articleTruthConsent, setArticleTruthConsent] = useState(true);

  // Search & Status
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Read Article Modal
  const [selectedArticle, setSelectedArticle] = useState<CommunityArticle | null>(null);

  useEffect(() => {
    fetchAlerts();
    fetchArticles();
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await fetch('/api/alerts');
      const data = await res.json();
      if (Array.isArray(data)) {
        setAlerts(data);
      }
    } catch (e) {
      console.error('Error loading alerts:', e);
    }
  };

  const fetchArticles = async () => {
    try {
      const res = await fetch('/api/articles');
      const data = await res.json();
      if (Array.isArray(data)) {
        setArticles(data);
      }
    } catch (e) {
      console.error('Error loading articles:', e);
    }
  };

  const statesList = useMemo(() => Object.values(BRAZIL_ALL_STATES_SCAMS), []);

  const filteredStatesList = useMemo(() => {
    return statesList.filter((st) => {
      const matchRegion = selectedRegion === 'all' || st.region === selectedRegion;
      const matchSearch =
        !stateSearch.trim() ||
        st.stateName.toLowerCase().includes(stateSearch.toLowerCase().trim()) ||
        st.stateCode.toLowerCase().includes(stateSearch.toLowerCase().trim()) ||
        st.capital.toLowerCase().includes(stateSearch.toLowerCase().trim());
      return matchRegion && matchSearch;
    });
  }, [statesList, selectedRegion, stateSearch]);

  const currentState: StateScamData =
    BRAZIL_ALL_STATES_SCAMS[selectedStateCode] || BRAZIL_ALL_STATES_SCAMS.SP;

  const topScams = currentState.topScams || [];

  const toggleAlertAccordion = (id: string) => {
    setExpandedAlertIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleUpvoteAlert = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/alerts/${id}/upvote`, { method: 'POST' });
      const data = await res.json();
      setAlerts((prev) =>
        prev.map((a) => (a.id === id ? { ...a, upvotesCount: data.upvotesCount } : a))
      );
    } catch (e) {
      console.error('Error upvoting alert:', e);
    }
  };

  const handleLikeArticle = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/articles/${id}/like`, { method: 'POST' });
      const data = await res.json();
      setArticles((prev) =>
        prev.map((art) => (art.id === id ? { ...art, likesCount: data.likesCount } : art))
      );
    } catch (e) {
      console.error('Error liking article:', e);
    }
  };

  const handleCreateAlertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertTitle.trim() || !alertDescription.trim() || !alertVictimAdvice.trim()) return;
    if (!alertAwareConsent || !alertTruthConsent) {
      alert('Por favor, confirme os termos de veracidade e moderação.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: alertTitle,
          description: alertDescription,
          victimAdvice: alertVictimAdvice,
          authorName: alertAuthorName.trim() || 'Usuário da Comunidade Aegis',
          authorEmail: alertAuthorEmail.trim(),
          imageUrl: '',
          category: alertCategory,
        }),
      });

      const data = await res.json();
      setSuccessMessage('Seu alerta foi enviado para análise! Avisaremos por e-mail sobre o status da moderação.');
      fetchAlerts();

      setTimeout(() => {
        setSuccessMessage(null);
        setShowCreateModal(false);
        setAlertTitle('');
        setAlertAuthorName('');
        setAlertAuthorEmail('');
        setAlertDescription('');
        setAlertVictimAdvice('');
        setAlertMediaPreview('');
      }, 2500);
    } catch (err) {
      console.error('Error creating alert:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateArticleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleTitle.trim() || !articleContent.trim()) return;
    if (!articleAwareConsent || !articleTruthConsent) {
      alert('Por favor, confirme os termos de veracidade e moderação.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: articleTitle,
          content: articleContent,
          authorName: articleAuthorName.trim() || 'Colaborador Aegis',
          authorEmail: articleAuthorEmail.trim(),
          imageUrl: '',
          category: articleCategory,
        }),
      });

      const data = await res.json();
      setSuccessMessage('Sua matéria foi enviada para análise! Avisaremos por e-mail sobre a aprovação.');
      fetchArticles();

      setTimeout(() => {
        setSuccessMessage(null);
        setShowCreateModal(false);
        setArticleTitle('');
        setArticleAuthorName('');
        setArticleAuthorEmail('');
        setArticleContent('');
        setArticleMediaPreview('');
      }, 2500);
    } catch (err) {
      console.error('Error creating article:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredAlerts = alerts.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.victimAdvice.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredArticles = articles.filter(
    (art) =>
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredNews = SECURITY_NEWS.filter((n) => {
    const matchesCat =
      newsCategoryFilter === 'all' || n.category.toLowerCase().includes(newsCategoryFilter.toLowerCase());
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-16 font-sans">
      {/* Top Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#dfcf93]/20 border border-[#dfcf93]/40 text-[#dfcf93] text-xs font-semibold mb-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Colaboração & Notícias Oficiais</span>
          </div>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-white tracking-tight">
            Alertas de Novos Golpes & Matérias
          </h1>
          <p className="text-xs sm:text-sm text-[#94a3b8] mt-1">
            Espaço colaborativo para publicação e consulta de alertas em tempo real sobre golpes emergentes e artigos de conscientização.
          </p>
        </div>

        {/* Action Buttons to open Figma modals */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => {
              setCreateMode('alert');
              setShowCreateModal(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-[#3b6f9f] hover:bg-[#325f89] text-white font-heading font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Criar Novo Alerta</span>
          </button>

          <button
            onClick={() => {
              setCreateMode('article');
              setShowCreateModal(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-[#a48ca7] hover:bg-[#937b96] text-white font-heading font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Escrever Matéria</span>
          </button>
        </div>
      </div>

      {/* Tabs Selector & Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#2a2e39] pb-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveSubTab('alerts')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-heading font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeSubTab === 'alerts'
                ? 'bg-[#3b6f9f] text-white shadow-xs'
                : 'bg-[#1b1d23] text-[#d2d2d2] hover:bg-[#23262f] border border-[#2a2e39]'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-300" />
            <span>Alertas de Novos Golpes ({alerts.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('news')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-heading font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeSubTab === 'news'
                ? 'bg-[#3a6ea5] text-white shadow-xs'
                : 'bg-[#1b1d23] text-[#d2d2d2] hover:bg-[#23262f] border border-[#2a2e39]'
            }`}
          >
            <Radio className="w-4 h-4 text-[#70f3ff] animate-pulse" />
            <span>Notícias Oficiais ({SECURITY_NEWS.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('articles')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-heading font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeSubTab === 'articles'
                ? 'bg-[#a48ca7] text-white shadow-xs'
                : 'bg-[#1b1d23] text-[#d2d2d2] hover:bg-[#23262f] border border-[#2a2e39]'
            }`}
          >
            <FileText className="w-4 h-4 text-[#dfcf93]" />
            <span>Matérias & Guias ({articles.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('map')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-heading font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeSubTab === 'map'
                ? 'bg-[#dfcf93] text-gray-900 shadow-xs font-extrabold'
                : 'bg-[#1b1d23] text-[#d2d2d2] hover:bg-[#23262f] border border-[#2a2e39]'
            }`}
          >
            <MapPin className="w-4 h-4 text-rose-400" />
            <span>Mapa por Estado (27 UFs)</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-[#686868] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeSubTab === 'alerts'
                ? 'Buscar alerta de golpe...'
                : activeSubTab === 'news'
                ? 'Buscar notícias oficiais...'
                : activeSubTab === 'map'
                ? 'Buscar por estado ou golpe...'
                : 'Buscar matérias educativas...'
            }
            className="w-full bg-[#14151a] border border-[#323744] focus:border-[#70f3ff] rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-[#d2d2d2] placeholder-[#686868] outline-none"
          />
        </div>
      </div>

      {/* SUB-VIEW 1: ALERTS FEED (Matching Figma 'tela_alertaGolpes') */}
      {activeSubTab === 'alerts' && (
        <div className="space-y-6">
          <div className="text-center sm:text-left">
            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-white tracking-tight">
              Alertas de novos golpes
            </h2>
            <p className="text-xs text-[#94a3b8] mt-0.5">
              Toque nos cards para expandir o roteiro do golpe e ver o que fazer caso tenha sido vítima.
            </p>
          </div>

          {/* Alerts Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAlerts.map((alert) => {
              const isExpanded = !!expandedAlertIds[alert.id];
              return (
                <div
                  key={alert.id}
                  className="rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 flex flex-col self-start h-fit bg-[#1e232d] border border-[#2e3748]"
                >
                  {/* Category - No Image */}
                  <div className="px-5 sm:px-6 pt-5 sm:pt-6 bg-[#356799]">
                    <span className="inline-block text-[11px] font-bold px-2.5 py-1 rounded-full bg-black/20 text-white border border-white/20">
                      {alert.category}
                    </span>
                  </div>

                  {/* Card Body - Classic Blue Container from Figma Mockup */}
                  <div className="bg-[#356799] px-5 pb-5 sm:px-6 sm:pb-6 text-white w-full">
                    {/* Header Row with Chevron Accordion Toggle */}
                    <button
                      type="button"
                      onClick={() => toggleAlertAccordion(alert.id)}
                      aria-expanded={isExpanded}
                      aria-controls={`alert-content-${alert.id}`}
                      className="w-full flex items-center justify-between gap-3 text-left cursor-pointer select-none group"
                    >
                      <h3 className="font-heading font-extrabold text-base sm:text-lg leading-snug group-hover:text-amber-200 transition-colors">
                        {alert.title}
                      </h3>
                      <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center shrink-0 group-hover:bg-white/25 transition-all">
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-white stroke-[2.5]" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-white stroke-[2.5]" />
                        )}
                      </div>
                    </button>

                    {/* Accordion Content */}
                    {isExpanded ? (
                      <div
                        id={`alert-content-${alert.id}`}
                        className="mt-4 pt-4 border-t border-white/20 space-y-4 animate-fade-in text-xs sm:text-sm leading-relaxed text-blue-50"
                      >
                        {/* Scam Description */}
                        <p className="whitespace-pre-line text-blue-50/95 font-normal">
                          {alert.description}
                        </p>

                        {/* What to do when a victim section */}
                        <div className="pt-2">
                          <h4 className="font-heading font-extrabold text-sm sm:text-base text-white mb-1.5 flex items-center gap-1.5">
                            <span>O que fazer quando for vítima?</span>
                          </h4>
                          <p className="text-blue-100 bg-black/20 p-3.5 rounded-2xl border border-white/15 leading-relaxed text-xs">
                            {alert.victimAdvice}
                          </p>
                        </div>

                        {/* Metadata Footer */}
                        <div className="pt-2 flex items-center justify-between text-[11px] text-blue-200/90 border-t border-white/10">
                          <span>
                            {new Date(alert.createdAt).toLocaleDateString('pt-BR')} • {alert.authorName}
                          </span>
                          <button
                            onClick={(e) => handleUpvoteAlert(alert.id, e)}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 hover:bg-white/25 transition-all cursor-pointer font-bold text-white"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span>{alert.upvotesCount}</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-2 text-[11px] text-blue-200/80 flex items-center justify-between">
                        <span>Toque para ler detalhes</span>
                        <span className="font-semibold">{alert.upvotesCount} confirmações</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Floating Collaborator Banner (Matching Figma Bottom CTA) */}
          <div className="mt-10 p-6 rounded-3xl bg-[#1b1d23] border border-[#2a2e39] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-[#dfcf93]/20 border border-[#dfcf93]/40 flex items-center justify-center text-[#dfcf93] shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base sm:text-lg text-white">
                  Quer colaborar e criar um alerta?
                </h3>
                <p className="text-xs text-[#94a3b8]">
                  Identificou um golpe novo na sua região? Avise nossa comunidade em segundos.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setCreateMode('alert');
                setShowCreateModal(true);
              }}
              className="w-14 h-14 rounded-full bg-black hover:bg-[#14151a] border-2 border-white/20 hover:border-white/40 text-white flex items-center justify-center shadow-2xl transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0"
              title="Criar novo alerta"
            >
              <Plus className="w-7 h-7 stroke-[2.5]" />
            </button>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: OFFICIAL REAL-TIME NEWS FEED */}
      {activeSubTab === 'news' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-white tracking-tight flex items-center gap-2">
                <Radio className="w-5 h-5 text-[#70f3ff] animate-pulse" />
                <span>Notícias Oficiais & Boletins de Segurança</span>
              </h2>
              <p className="text-xs text-[#94a3b8] mt-0.5">
                Monitoramento contínuo com dados da FEBRABAN, CERT.br, ANPD e Delegacias de Crimes Cibernéticos.
              </p>
            </div>

            {/* Quick Category Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {['all', 'Alerta de Golpe', 'Dica de Especialista', 'Vazamento'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setNewsCategoryFilter(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    newsCategoryFilter === cat
                      ? 'bg-[#3a6ea5] text-white'
                      : 'bg-[#1b1d23] text-[#94a3b8] hover:text-white border border-[#2a2e39]'
                  }`}
                >
                  {cat === 'all' ? 'Todas' : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredNews.map((news) => (
              <article
                key={news.id}
                className="p-6 rounded-3xl bg-[#1b1d23] hover:bg-[#20232c] border border-[#2a2e39] hover:border-[#3a6ea5]/50 transition-all space-y-3 shadow-xl"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        news.urgency === 'high'
                          ? 'bg-rose-950/60 text-rose-300 border border-rose-500/40'
                          : news.urgency === 'medium'
                          ? 'bg-amber-950/60 text-amber-300 border border-amber-500/40'
                          : 'bg-[#3a6ea5]/20 text-[#70f3ff] border border-[#70f3ff]/30'
                      }`}
                    >
                      {news.category}
                    </span>
                    <span className="text-xs text-[#686868]">• {news.date}</span>
                  </div>
                  <span className="text-xs font-medium text-[#93bfed] flex items-center gap-1 bg-[#14151a] px-2.5 py-1 rounded-md border border-[#2a2e39]">
                    Fonte: {news.source}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-lg text-white leading-snug">
                  {news.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#d2d2d2] leading-relaxed">
                  {news.summary}
                </p>

                <div className="pt-3 border-t border-[#2a2e39] flex items-center justify-between text-xs text-[#686868]">
                  <span>{news.readTime}</span>
                  <div className="flex items-center gap-2 text-[#70f3ff] font-semibold">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Verificado por Inteligência Aegis</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: BRAZILIAN STATE SCAMS MAP */}
      {activeSubTab === 'map' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-white tracking-tight flex items-center gap-2">
                <MapPin className="w-5 h-5 text-rose-400" />
                <span>Golpes mais Frequentes por Estado (Brasil)</span>
              </h2>
              <p className="text-xs text-[#94a3b8] mt-0.5">
                Selecione sua Unidade Federativa para ver o ranking dos golpes que mais fazem vítimas na sua região.
              </p>
            </div>

            {/* Region Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {['all', 'Sudeste', 'Sul', 'Nordeste', 'Centro-Oeste', 'Norte'].map((reg) => (
                <button
                  key={reg}
                  onClick={() => setSelectedRegion(reg)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedRegion === reg
                      ? 'bg-[#dfcf93] text-gray-900 font-bold'
                      : 'bg-[#1b1d23] text-[#94a3b8] hover:text-white border border-[#2a2e39]'
                  }`}
                >
                  {reg === 'all' ? 'Todas Regiões' : reg}
                </button>
              ))}
            </div>
          </div>

          {/* Quick State Pills Selector */}
          <div className="bg-[#1b1d23] p-4 rounded-2xl border border-[#2a2e39] space-y-2.5">
            <div className="flex items-center justify-between text-xs text-[#94a3b8]">
              <span className="font-semibold text-white">Escolha um estado ({filteredStatesList.length} disponíveis):</span>
              <span>Estado atual: <b className="text-[#dfcf93]">{currentState.stateName} ({currentState.stateCode})</b></span>
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
              {filteredStatesList.map((st) => (
                <button
                  key={st.stateCode}
                  onClick={() => {
                    setSelectedStateCode(st.stateCode);
                    setExpandedScamRank(1);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-heading font-bold transition-all cursor-pointer ${
                    selectedStateCode === st.stateCode
                      ? 'bg-[#3a6ea5] text-white shadow-md scale-105'
                      : 'bg-[#14151a] text-[#d2d2d2] hover:bg-[#23262f] border border-[#2a2e39]'
                  }`}
                >
                  {st.stateCode} - {st.stateName}
                </button>
              ))}
            </div>
          </div>

          {/* Selected State Scams Spotlight */}
          <div className="bg-[#1b1d23] border border-[#2a2e39] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2a2e39] pb-5">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#dfcf93]/20 border border-[#dfcf93]/30 text-[#dfcf93] text-xs font-semibold mb-2">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Região {currentState.region} • Capital: {currentState.capital}</span>
                </div>
                <h3 className="font-heading font-extrabold text-2xl text-white">
                  {currentState.stateName} ({currentState.stateCode})
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <div className="px-4 py-2 rounded-2xl bg-[#14151a] border border-[#2a2e39] text-center">
                  <span className="block text-[10px] text-[#686868] font-bold uppercase">Nível de Risco</span>
                  <span className="text-xs font-extrabold text-rose-400">
                    {currentState.threatLevel || 'Alto'}
                  </span>
                </div>
                <div className="px-4 py-2 rounded-2xl bg-[#14151a] border border-[#2a2e39] text-center">
                  <span className="block text-[10px] text-[#686868] font-bold uppercase">Prejuízo Médio</span>
                  <span className="text-xs font-extrabold text-[#70f3ff]">
                    {currentState.avgLossPerVictim || 'R$ 2.450'}
                  </span>
                </div>
              </div>
            </div>

            {/* Top Scams for this State */}
            <div className="space-y-4">
              <h4 className="font-heading font-bold text-base text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Top Golpes mais Aplicados em {currentState.stateName}</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topScams.map((scam) => {
                  const isScamExpanded = expandedScamRank === scam.rank;
                  return (
                    <div
                      key={scam.rank}
                      onClick={() => setExpandedScamRank(isScamExpanded ? null : scam.rank)}
                      className="p-5 rounded-2xl bg-[#14151a] border border-[#2a2e39] hover:border-[#dfcf93]/50 transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="w-6 h-6 rounded-full bg-[#dfcf93]/20 text-[#dfcf93] border border-[#dfcf93]/40 text-xs font-bold flex items-center justify-center">
                            #{scam.rank}
                          </span>
                          <span className="text-[11px] font-bold text-rose-400 bg-rose-950/40 px-2.5 py-0.5 rounded-md border border-rose-900/50">
                            {scam.incidentPercentage}% dos casos
                          </span>
                        </div>

                        <h5 className="font-heading font-bold text-base text-white group-hover:text-[#dfcf93] transition-colors leading-snug">
                          {scam.title}
                        </h5>

                        <p className="text-xs text-[#94a3b8] leading-relaxed">
                          {scam.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-[#2a2e39] text-[11px] text-[#70f3ff] flex items-center justify-between font-semibold">
                        <span>Como se proteger: {scam.defenseAction}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 4: ARTICLES & GUIDES FEED */}
      {activeSubTab === 'articles' && (
        <div className="space-y-6">
          <div className="text-center sm:text-left">
            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-white tracking-tight">
              Matérias & Artigos de Segurança
            </h2>
            <p className="text-xs text-[#94a3b8] mt-0.5">
              Conteúdos didáticos, guias passo a passo e análises jurídicas para você e sua família.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredArticles.map((art) => (
              <article
                key={art.id}
                onClick={() => setSelectedArticle(art)}
                className="bg-[#1b1d23] hover:bg-[#20232c] border border-[#2a2e39] hover:border-[#a48ca7]/50 rounded-3xl p-6 transition-all duration-300 shadow-xl flex flex-col justify-between space-y-4 cursor-pointer group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#a48ca7]/20 text-[#d8c7db] border border-[#a48ca7]/40">
                      {art.category}
                    </span>
                    <span className="text-xs text-[#686868] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {art.readTime}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-lg text-white group-hover:text-[#d8c7db] transition-colors leading-snug">
                    {art.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed line-clamp-3">
                    {art.summary || art.content.slice(0, 160) + '...'}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#2a2e39] flex items-center justify-between text-xs text-[#686868]">
                  <span>Por {art.authorName}</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => handleLikeArticle(art.id, e)}
                      className="flex items-center gap-1 text-[#d2d2d2] hover:text-rose-400 transition-colors"
                    >
                      <Heart className="w-4 h-4" />
                      <span>{art.likesCount}</span>
                    </button>
                    <span className="text-[#a48ca7] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      Ler Matéria →
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* FULL-SCREEN / DRAWER CREATION MODAL (Harmonized Aegis Design) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-[#171920] border border-[#2a2e39] rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh] text-[#d2d2d2]">
            {/* Top Bar Header with Navigation & Return */}
            <div className="bg-[#131418] px-6 py-4 flex items-center justify-between border-b border-[#2a2e39]">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#94a3b8] hover:text-white px-3.5 py-2 rounded-xl bg-[#1b1d23] hover:bg-[#23262f] border border-[#2a2e39] transition-all cursor-pointer"
                title="Voltar ao painel de alertas"
              >
                <ArrowLeft className="w-4 h-4 text-[#70f3ff]" />
                <span>Voltar</span>
              </button>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#70f3ff]/10 border border-[#70f3ff]/30 flex items-center justify-center text-[#70f3ff]">
                  <Shield className="w-4 h-4" />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="font-heading font-extrabold text-sm sm:text-base text-white tracking-tight">
                    {createMode === 'alert'
                      ? 'Novo Alerta Comunitário'
                      : 'Nova Matéria Educativa'}
                  </h3>
                  <p className="text-[11px] text-[#94a3b8] hidden sm:block">
                    Central de Contribuição & Inteligência Aegis
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="w-9 h-9 rounded-xl bg-[#1b1d23] hover:bg-[#23262f] border border-[#2a2e39] flex items-center justify-center text-[#94a3b8] hover:text-white transition-colors cursor-pointer"
                title="Fechar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="px-6 py-3 bg-[#14151a] border-b border-[#2a2e39] flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setCreateMode('alert')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-heading font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  createMode === 'alert'
                    ? 'bg-[#356799] text-white shadow-md'
                    : 'bg-[#1b1d23] text-[#94a3b8] hover:text-white border border-[#2a2e39]'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
                <span>Alerta de Novo Golpe</span>
              </button>
              <button
                type="button"
                onClick={() => setCreateMode('article')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-heading font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  createMode === 'article'
                    ? 'bg-[#a48ca7] text-white shadow-md'
                    : 'bg-[#1b1d23] text-[#94a3b8] hover:text-white border border-[#2a2e39]'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-[#dfcf93]" />
                <span>Matéria / Artigo Educativo</span>
              </button>
            </div>

            {/* Success Banner */}
            {successMessage && (
              <div className="mx-6 mt-4 p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs sm:text-sm flex items-center gap-3 animate-fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <p className="font-bold">{successMessage}</p>
                  <p className="text-[11px] text-emerald-300/80 mt-0.5">
                    Nossa equipe avaliará a publicação e enviará o parecer por e-mail.
                  </p>
                </div>
              </div>
            )}

            {/* FORM 1: CRIAR ALERTA DE NOVO GOLPE */}
            {createMode === 'alert' && (
              <form
                onSubmit={handleCreateAlertSubmit}
                className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1 custom-scrollbar"
              >
                {/* Identification & Notification Section (Name + Email) */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#131418] border border-[#2a2e39] space-y-3.5">
                  <div className="flex items-center gap-2 text-white font-heading font-bold text-sm">
                    <User className="w-4 h-4 text-[#70f3ff]" />
                    <span>Responsável pelo Alerta (Contato & Moderação)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#94a3b8] block">
                        Seu Nome ou Apelido <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={alertAuthorName}
                        onChange={(e) => setAlertAuthorName(e.target.value)}
                        placeholder="Ex: Carlos Eduardo (São Paulo)"
                        className="w-full bg-[#1b1d23] border border-[#2a2e39] focus:border-[#70f3ff] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-[#686868] outline-none transition-colors font-medium"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#94a3b8] block">
                        E-mail para Contato <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={alertAuthorEmail}
                        onChange={(e) => setAlertAuthorEmail(e.target.value)}
                        placeholder="seu.email@exemplo.com"
                        className="w-full bg-[#1b1d23] border border-[#2a2e39] focus:border-[#70f3ff] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-[#686868] outline-none transition-colors font-medium"
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#3a6ea5]/10 border border-[#3a6ea5]/30 text-xs text-[#93bfed] flex items-start gap-2.5">
                    <Mail className="w-4 h-4 text-[#70f3ff] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">
                      <strong>Aviso de Moderação:</strong> Entraremos em contato através deste e-mail para avisar se o alerta foi aceito e publicado ou se são necessárias informações adicionais.
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl bg-[#131418] border border-[#2a2e39] p-4 text-xs text-[#94a3b8]">
                  Publicação sem imagem: o conteúdo será exibido apenas em formato textual.
                </div>

                {/* Fields: Title & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-white uppercase tracking-wider block">
                      Nome / Título do Golpe <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={alertTitle}
                      onChange={(e) => setAlertTitle(e.target.value)}
                      placeholder="Ex: Golpe do morango do amor, Falsa entrega no iFood..."
                      className="w-full bg-[#131418] border border-[#2a2e39] focus:border-[#356799] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-[#686868] outline-none font-medium transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-white uppercase tracking-wider block">
                      Categoria
                    </label>
                    <select
                      value={alertCategory}
                      onChange={(e) => setAlertCategory(e.target.value)}
                      className="w-full bg-[#131418] border border-[#2a2e39] focus:border-[#356799] rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white outline-none font-medium cursor-pointer"
                    >
                      <option value="Golpe Comercial / Pix">Golpe Comercial / Pix</option>
                      <option value="Falsa Central de Segurança">Falsa Central / Bancário</option>
                      <option value="Entrega & Maquininha">Entrega & Maquininha</option>
                      <option value="Phishing & Links Falsos">Phishing & Links Falsos</option>
                      <option value="Redes Sociais & WhatsApp">Redes Sociais / WhatsApp</option>
                    </select>
                  </div>
                </div>

                {/* Field: Como funciona o golpe */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white uppercase tracking-wider block">
                    Como os criminosos agem? (Modus Operandi) <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={alertDescription}
                    onChange={(e) => setAlertDescription(e.target.value)}
                    placeholder="Explique como a vítima é abordada, quais pretextos usam e como o golpe é concluído..."
                    className="w-full bg-[#131418] border border-[#2a2e39] rounded-xl p-3 text-xs sm:text-sm text-white placeholder-[#686868] outline-none focus:border-[#356799] font-medium leading-relaxed"
                  />
                </div>

                {/* Field: O que fazer quando for vítima */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#dfcf93] uppercase tracking-wider block">
                    O que fazer quando for vítima? (Orientações de Emergência) <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={alertVictimAdvice}
                    onChange={(e) => setAlertVictimAdvice(e.target.value)}
                    placeholder="Instruções imediatas: acionar MED do Pix, registrar BO eletrônico, bloquear cartões, avisar contatos..."
                    className="w-full bg-[#131418] border border-[#2a2e39] rounded-xl p-3 text-xs sm:text-sm text-white placeholder-[#686868] outline-none focus:border-[#dfcf93] font-medium leading-relaxed"
                  />
                </div>

                {/* Disclaimers & Checkboxes */}
                <div className="space-y-2.5 pt-3 border-t border-[#2a2e39]">
                  <p className="font-heading font-bold text-xs text-white flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    <span>Termos de Veracidade & Moderação</span>
                  </p>

                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#d2d2d2] select-none">
                    <input
                      type="checkbox"
                      checked={alertAwareConsent}
                      onChange={(e) => setAlertAwareConsent(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded text-[#356799] accent-[#356799] cursor-pointer"
                    />
                    <span className="font-medium">
                      Estou ciente de que meu alerta passará por auditoria da equipe de segurança antes de ir para o mural público.
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#d2d2d2] select-none">
                    <input
                      type="checkbox"
                      checked={alertTruthConsent}
                      onChange={(e) => setAlertTruthConsent(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded text-[#356799] accent-[#356799] cursor-pointer"
                    />
                    <span className="font-medium">
                      Confirmo que as informações compartilhadas são verídicas e buscam proteger outros cidadãos.
                    </span>
                  </label>
                </div>

                {/* Footer Action Buttons */}
                <div className="pt-3 border-t border-[#2a2e39] flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-[#1b1d23] hover:bg-[#23262f] text-[#94a3b8] hover:text-white text-xs sm:text-sm font-bold transition-all border border-[#2a2e39] cursor-pointer"
                  >
                    Cancelar e Voltar
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#356799] hover:bg-[#2c5680] text-white font-heading font-bold text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Enviando para Análise...' : 'Enviar Alerta para Moderação'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* FORM 2: ESCREVER ARTIGO / MATÉRIA EDUCATIVA */}
            {createMode === 'article' && (
              <form
                onSubmit={handleCreateArticleSubmit}
                className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1 custom-scrollbar"
              >
                {/* Identification & Notification Section (Name + Email) */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#131418] border border-[#2a2e39] space-y-3.5">
                  <div className="flex items-center gap-2 text-white font-heading font-bold text-sm">
                    <User className="w-4 h-4 text-[#a48ca7]" />
                    <span>Responsável pela Matéria (Contato & Moderação)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#94a3b8] block">
                        Seu Nome ou Especialidade <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={articleAuthorName}
                        onChange={(e) => setArticleAuthorName(e.target.value)}
                        placeholder="Ex: Dra. Camila Rocha (Especialista em Direito Digital)"
                        className="w-full bg-[#1b1d23] border border-[#2a2e39] focus:border-[#a48ca7] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-[#686868] outline-none transition-colors font-medium"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#94a3b8] block">
                        E-mail para Notificação <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={articleAuthorEmail}
                        onChange={(e) => setArticleAuthorEmail(e.target.value)}
                        placeholder="seu.email@exemplo.com"
                        className="w-full bg-[#1b1d23] border border-[#2a2e39] focus:border-[#a48ca7] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-[#686868] outline-none transition-colors font-medium"
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#a48ca7]/10 border border-[#a48ca7]/30 text-xs text-[#d8c7db] flex items-start gap-2.5">
                    <Mail className="w-4 h-4 text-[#a48ca7] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">
                      <strong>Aviso de Moderação:</strong> Entraremos em contato via e-mail para confirmar se a sua matéria foi aprovada para os leitores do Aegis.
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl bg-[#131418] border border-[#2a2e39] p-4 text-xs text-[#94a3b8]">
                  Publicação sem imagem: o conteúdo será exibido apenas em formato textual.
                </div>

                {/* Fields: Title & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-white uppercase tracking-wider block">
                      Título da Notícia / Artigo <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={articleTitle}
                      onChange={(e) => setArticleTitle(e.target.value)}
                      placeholder="Ex: Como proteger seu WhatsApp contra golpes e invasões em 2026"
                      className="w-full bg-[#131418] border border-[#2a2e39] focus:border-[#a48ca7] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-[#686868] outline-none font-medium transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-white uppercase tracking-wider block">
                      Tema / Categoria
                    </label>
                    <select
                      value={articleCategory}
                      onChange={(e) => setArticleCategory(e.target.value)}
                      className="w-full bg-[#131418] border border-[#2a2e39] focus:border-[#a48ca7] rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white outline-none font-medium cursor-pointer"
                    >
                      <option value="Dica de Especialista">Dica de Especialista</option>
                      <option value="Guia Prático">Guia Prático</option>
                      <option value="Legislação & Direitos">Legislação & Direitos</option>
                      <option value="Análise de Segurança">Análise de Segurança</option>
                      <option value="Prevenção Familiar">Prevenção Familiar</option>
                    </select>
                  </div>
                </div>

                {/* Field: Conteúdo da Matéria */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-white uppercase tracking-wider block">
                      Conteúdo Completo da Matéria <span className="text-rose-400">*</span>
                    </label>
                    <span className="text-[11px] text-[#686868]">Suporta títulos com ### e parágrafos</span>
                  </div>

                  <textarea
                    rows={7}
                    required
                    value={articleContent}
                    onChange={(e) => setArticleContent(e.target.value)}
                    placeholder="Escreva orientações completas, alertas preventivos ou relatos informativos..."
                    className="w-full bg-[#131418] border border-[#2a2e39] rounded-xl p-3.5 text-xs sm:text-sm text-white placeholder-[#686868] outline-none focus:border-[#a48ca7] font-medium leading-relaxed"
                  />

                  {/* Formatting Toolbar */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setArticleContent((prev) => prev + '\n\n### Subtítulo Exemplo\n')}
                      className="px-2.5 py-1 rounded-lg bg-[#1b1d23] hover:bg-[#23262f] border border-[#2a2e39] text-[11px] text-[#d2d2d2] transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <FileText className="w-3 h-3 text-[#a48ca7]" />
                      <span>+ Subtítulo</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setArticleContent((prev) => prev + '\n- Passo 1:\n- Passo 2:\n')}
                      className="px-2.5 py-1 rounded-lg bg-[#1b1d23] hover:bg-[#23262f] border border-[#2a2e39] text-[11px] text-[#d2d2d2] transition-colors cursor-pointer"
                    >
                      <span>+ Lista de Dicas</span>
                    </button>
                  </div>
                </div>

                {/* Disclaimers & Checkboxes */}
                <div className="space-y-2.5 pt-3 border-t border-[#2a2e39]">
                  <p className="font-heading font-bold text-xs text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#a48ca7]" />
                    <span>Moderação & Confiabilidade</span>
                  </p>

                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#d2d2d2] select-none">
                    <input
                      type="checkbox"
                      checked={articleAwareConsent}
                      onChange={(e) => setArticleAwareConsent(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded text-[#a48ca7] accent-[#a48ca7] cursor-pointer"
                    />
                    <span className="font-medium">
                      Estou ciente de que a matéria será revisada pela equipe antes de ser destacada no aplicativo.
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#d2d2d2] select-none">
                    <input
                      type="checkbox"
                      checked={articleTruthConsent}
                      onChange={(e) => setArticleTruthConsent(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded text-[#a48ca7] accent-[#a48ca7] cursor-pointer"
                    />
                    <span className="font-medium">
                      Declaro que o conteúdo é original ou devidamente fundamentado em fontes confiáveis.
                    </span>
                  </label>
                </div>

                {/* Footer Action Buttons */}
                <div className="pt-3 border-t border-[#2a2e39] flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-[#1b1d23] hover:bg-[#23262f] text-[#94a3b8] hover:text-white text-xs sm:text-sm font-bold transition-all border border-[#2a2e39] cursor-pointer"
                  >
                    Cancelar e Voltar
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#a48ca7] hover:bg-[#967d99] text-white font-heading font-bold text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Enviando Matéria...' : 'Enviar Matéria para Revisão'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ARTICLE READER MODAL */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#1b1d23] border border-[#2a2e39] rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5 my-8 text-[#d2d2d2]">
            <div className="flex items-center justify-between border-b border-[#2a2e39] pb-4">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#a48ca7]/20 text-[#d8c7db] border border-[#a48ca7]/40">
                {selectedArticle.category}
              </span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="w-8 h-8 rounded-full bg-[#23262f] hover:bg-[#2e3340] text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <h2 className="font-heading font-bold text-xl sm:text-2xl text-white leading-snug">
                {selectedArticle.title}
              </h2>
              <div className="flex items-center gap-3 text-xs text-[#686868]">
                <span>Por {selectedArticle.authorName}</span>
                <span>•</span>
                <span>{selectedArticle.readTime}</span>
                <span>•</span>
                <span>{new Date(selectedArticle.createdAt).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>

            <div className="prose prose-invert max-w-none text-xs sm:text-sm leading-relaxed text-[#d2d2d2] space-y-4 pt-2 border-t border-[#2a2e39]">
              {selectedArticle.content.split('\n\n').map((paragraph, pIdx) => {
                if (paragraph.startsWith('### ')) {
                  return (
                    <h3
                      key={pIdx}
                      className="font-heading font-bold text-base text-white pt-2 text-[#70f3ff]"
                    >
                      {paragraph.replace('### ', '')}
                    </h3>
                  );
                }
                return (
                  <p key={pIdx} className="leading-relaxed">
                    {paragraph}
                  </p>
                );
              })}
            </div>

            <div className="pt-4 border-t border-[#2a2e39] flex items-center justify-between">
              <button
                onClick={(e) => handleLikeArticle(selectedArticle.id, e)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#23262f] hover:bg-[#2a2e39] text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                <Heart className="w-4 h-4 text-rose-400" />
                <span>{selectedArticle.likesCount} Curtidas</span>
              </button>

              <button
                onClick={() => setSelectedArticle(null)}
                className="px-5 py-2 rounded-xl bg-[#a48ca7] text-white font-heading font-semibold text-xs cursor-pointer"
              >
                Fechar Artigo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
