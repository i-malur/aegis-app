import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Newspaper,
  BookOpen,
  AlertTriangle,
  TrendingUp,
  ShieldCheck,
  Search,
  Filter,
  ExternalLink,
  ChevronRight,
  Info,
  Radio,
  Sparkles,
  ShieldAlert,
  Flame,
  CheckCircle2,
  DollarSign,
  Users,
  Compass,
  ArrowUpRight,
  BarChart3,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { BRAZIL_ALL_STATES_SCAMS } from '../data/brazilStatesScams';
import { SECURITY_NEWS } from '../data/securityData';
import { StateScamData, StateScamDetail, SecurityNews } from '../types';

export const ScamMapNewsView: React.FC = () => {
  const [selectedStateCode, setSelectedStateCode] = useState<string>('SP');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [stateSearch, setStateSearch] = useState<string>('');
  const [expandedScamRank, setExpandedScamRank] = useState<number | null>(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [newsSearchQuery, setNewsSearchQuery] = useState<string>('');

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

  const filteredNews = SECURITY_NEWS.filter((n) => {
    const matchesCat =
      selectedCategory === 'all' || n.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch =
      n.title.toLowerCase().includes(newsSearchQuery.toLowerCase()) ||
      n.summary.toLowerCase().includes(newsSearchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const getThreatBadge = (threat: string) => {
    switch (threat) {
      case 'Crítico':
        return 'bg-rose-950/60 text-rose-300 border-rose-500/40';
      case 'Muito Alto':
        return 'bg-orange-950/60 text-orange-300 border-orange-500/40';
      case 'Alto':
        return 'bg-[#dfcf93]/20 text-[#dfcf93] border-[#dfcf93]/40';
      default:
        return 'bg-[#3a6ea5]/20 text-[#70f3ff] border-[#70f3ff]/30';
    }
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-rose-600 text-white shadow-2xs';
      case 2:
        return 'bg-orange-500 text-white shadow-2xs';
      case 3:
        return 'bg-[#dfcf93] text-[#14151a] shadow-2xs';
      case 4:
        return 'bg-[#3a6ea5] text-white shadow-2xs';
      default:
        return 'bg-[#23262f] text-[#d2d2d2]';
    }
  };

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3a6ea5]/20 border border-[#70f3ff]/30 text-[#70f3ff] text-xs font-semibold mb-1.5">
            <Compass className="w-3.5 h-3.5" />
            <span>Observatório Nacional de Fraudes</span>
          </div>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-white tracking-tight">
            Golpes por Estado & Notícias em Tempo Real
          </h1>
          <p className="text-xs sm:text-sm text-[#94a3b8] mt-1">
            Panorama detalhado com os <strong className="text-white">5 golpes mais comuns</strong> por estado brasileiro, dados de incidência, roteiros criminosos e guias de prevenção.
          </p>
        </div>
      </div>

      {/* REGIONAL STATE INTELLIGENCE HUB */}
      <section className="bg-[#1b1d23] rounded-2xl border border-[#2a2e39] p-6 sm:p-7 space-y-6 shadow-xl">
        {/* Top Control Bar: Region Filter, State Search, and Selected State Dropdown */}
        <div className="space-y-4 pb-5 border-b border-[#2a2e39]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h2 className="font-heading font-bold text-lg text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#70f3ff]" />
                Selecione o Estado para Análise
              </h2>
              <p className="text-xs text-[#686868]">
                Consulte estatísticas e os 5 golpes com maior registro de ocorrências.
              </p>
            </div>

            {/* Region Filter Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
              {(['all', 'Sudeste', 'Sul', 'Nordeste', 'Centro-Oeste', 'Norte'] as const).map((reg) => (
                <button
                  key={reg}
                  onClick={() => setSelectedRegion(reg)}
                  className={`px-3.5 py-1.5 rounded-xl font-heading font-medium transition-all whitespace-nowrap cursor-pointer ${
                    selectedRegion === reg
                      ? 'bg-[#3a6ea5] text-white shadow-2xs'
                      : 'bg-[#14151a] text-[#d2d2d2] hover:bg-[#23262f] border border-[#2a2e39]'
                  }`}
                >
                  {reg === 'all' ? 'Todos os Estados' : reg}
                </button>
              ))}
            </div>
          </div>

          {/* State Interactive Pills Grid */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#686868] uppercase tracking-wide">
                Estados disponíveis ({filteredStatesList.length}):
              </span>
              <div className="relative w-48 sm:w-64">
                <Search className="w-3.5 h-3.5 text-[#686868] absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={stateSearch}
                  onChange={(e) => setStateSearch(e.target.value)}
                  placeholder="Buscar estado ou capital..."
                  className="w-full bg-[#14151a] border border-[#323744] focus:border-[#70f3ff] rounded-xl pl-8 pr-2 py-1.5 text-xs text-[#d2d2d2] placeholder-[#686868] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-2">
              {filteredStatesList.map((st) => {
                const isSelected = selectedStateCode === st.stateCode;
                return (
                  <button
                    key={st.stateCode}
                    onClick={() => {
                      setSelectedStateCode(st.stateCode);
                      setExpandedScamRank(1);
                    }}
                    className={`p-2.5 rounded-xl text-left transition-all border flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-[#3a6ea5]/25 border-[#70f3ff]/60 ring-1 ring-[#70f3ff]/30 text-white shadow-xs'
                        : 'bg-[#14151a] hover:bg-[#23262f] border-[#2a2e39] text-[#d2d2d2]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-heading font-bold text-sm text-white">{st.stateCode}</span>
                      <span
                        className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-md border ${getThreatBadge(
                          st.threatLevel
                        )}`}
                      >
                        {st.threatLevel}
                      </span>
                    </div>
                    <div className="mt-1">
                      <span className="text-[11px] font-medium text-[#d2d2d2] block truncate">
                        {st.stateName}
                      </span>
                      <span className="text-[10px] text-[#686868] block truncate">
                        Cap. {st.capital}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected State Dashboard Layout */}
        <div className="space-y-6">
          {/* State Summary Banner */}
          <div className="bg-[#14151a] border border-[#2a2e39] rounded-2xl p-6 shadow-md">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#3a6ea5]/20 text-[#70f3ff] border border-[#70f3ff]/30">
                    Região {currentState.region} • Capital: {currentState.capital}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${getThreatBadge(
                      currentState.threatLevel
                    )}`}
                  >
                    Nível de Ameaça: {currentState.threatLevel}
                  </span>
                </div>
                <h2 className="font-heading font-bold text-2xl sm:text-3xl text-white tracking-tight flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-[#70f3ff]" />
                  <span>
                    {currentState.stateName} ({currentState.stateCode})
                  </span>
                </h2>
                <p className="text-xs sm:text-sm text-[#94a3b8]">
                  Ranking dos 5 golpes mais reportados com base em denúncias comunitárias e delegacias de crimes cibernéticos.
                </p>
              </div>

              {/* 3 Metric Badges */}
              <div className="grid grid-cols-3 gap-3 shrink-0">
                <div className="bg-[#1b1d23] p-3.5 rounded-xl border border-[#2a2e39] text-center shadow-xs">
                  <span className="text-[11px] text-[#686868] font-medium block">
                    Aumento Anual
                  </span>
                  <span className="font-heading font-bold text-base text-rose-400">
                    {currentState.scamIncrease}
                  </span>
                </div>
                <div className="bg-[#1b1d23] p-3.5 rounded-xl border border-[#2a2e39] text-center shadow-xs">
                  <span className="text-[11px] text-[#686868] font-medium block">
                    Prejuízo Médio
                  </span>
                  <span className="font-heading font-bold text-base text-[#dfcf93]">
                    {currentState.avgLossPerVictim}
                  </span>
                </div>
                <div className="bg-[#1b1d23] p-3.5 rounded-xl border border-[#2a2e39] text-center shadow-xs">
                  <span className="text-[11px] text-[#686868] font-medium block">
                    Resolução / MED
                  </span>
                  <span className="font-heading font-bold text-base text-emerald-400">
                    {currentState.complaintResolutionRate}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 5 MOST COMMON SCAMS SECTION */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-rose-500" />
                <h3 className="font-heading font-bold text-lg text-white">
                  Top 5 Golpes Mais Comuns em {currentState.stateName}
                </h3>
              </div>
              <span className="text-xs text-[#686868]">
                Clique para ver o roteiro detalhado do golpe
              </span>
            </div>

            {/* List of 5 Scams */}
            <div className="space-y-3">
              {topScams.map((scam: StateScamDetail) => {
                const isExpanded = expandedScamRank === scam.rank;
                return (
                  <div
                    key={scam.rank}
                    id={`state-scam-rank-${scam.rank}`}
                    className={`rounded-2xl border transition-all ${
                      isExpanded
                        ? 'bg-[#14151a] border-[#70f3ff]/40 ring-1 ring-[#70f3ff]/20 shadow-md'
                        : 'bg-[#14151a] hover:border-[#323744] border-[#2a2e39]'
                    }`}
                  >
                    {/* Header Row of the Scam Card (Always Visible & Clickable) */}
                    <button
                      type="button"
                      onClick={() => setExpandedScamRank(isExpanded ? null : scam.rank)}
                      className="w-full p-4 sm:p-5 flex items-start sm:items-center justify-between gap-4 text-left cursor-pointer"
                    >
                      <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                        {/* Rank Badge #1, #2, #3, #4, #5 */}
                        <div
                          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-heading font-bold text-sm shrink-0 ${getRankBadge(
                            scam.rank
                          )}`}
                        >
                          #{scam.rank}
                        </div>

                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#3a6ea5]/20 text-[#70f3ff] border border-[#70f3ff]/30">
                              {scam.category}
                            </span>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-rose-950/60 text-rose-300 border border-rose-500/40">
                              {scam.financialImpact}
                            </span>
                          </div>
                          <h4 className="font-heading font-bold text-sm sm:text-base text-white truncate sm:text-clip">
                            {scam.title}
                          </h4>
                        </div>
                      </div>

                      {/* Percentage & Accordion Icon */}
                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-right">
                          <span className="text-[11px] text-[#686868] font-medium block">
                            Incidência
                          </span>
                          <span className="font-heading font-bold text-sm sm:text-base text-[#70f3ff]">
                            {scam.incidentPercentage}%
                          </span>
                        </div>
                        <div className="p-1.5 rounded-lg bg-[#23262f] text-[#d2d2d2]">
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-[#70f3ff]" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </div>
                    </button>

                    {/* Expanded Deep Details */}
                    {isExpanded && (
                      <div className="px-4 pb-5 sm:px-5 sm:pb-5 space-y-4 border-t border-[#2a2e39] pt-4">
                        {/* Description */}
                        <div>
                          <span className="text-xs font-semibold text-[#d2d2d2] uppercase tracking-wide block mb-1">
                            Como os golpistas operam:
                          </span>
                          <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed">
                            {scam.description}
                          </p>
                        </div>

                        {/* Real-world Scenario / Speech Quote */}
                        <div className="p-4 rounded-xl bg-[#dfcf93]/10 border border-[#dfcf93]/30 space-y-1.5">
                          <div className="flex items-center gap-1.5 text-xs text-[#dfcf93] font-bold">
                            <AlertTriangle className="w-4 h-4 text-[#dfcf93]" />
                            <span>Exemplo de abordagem ou mensagem usada pelo criminoso:</span>
                          </div>
                          <p className="text-xs sm:text-sm text-[#d2d2d2] italic pl-3 border-l-2 border-[#dfcf93]">
                            "{scam.exampleScenario}"
                          </p>
                        </div>

                        {/* Direct Defense Action */}
                        <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 flex items-start gap-3">
                          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                          <div className="space-y-1">
                            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wide block">
                              Ação de Defesa Recomendada:
                            </span>
                            <p className="text-xs sm:text-sm text-[#d2d2d2] leading-relaxed">
                              {scam.defenseAction}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Practical Prevention Hub (3 Cards) */}
      <section className="bg-[#1b1d23] rounded-2xl border border-[#2a2e39] p-6 sm:p-7 space-y-4 shadow-xl">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#70f3ff]" />
          <h3 className="font-heading font-bold text-base sm:text-lg text-white">
            Diretrizes Gerais de Proteção Imediata
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-[#14151a] border border-[#2a2e39] space-y-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-[#dfcf93]/20 text-[#dfcf93] border border-[#dfcf93]/30">
              Passo 1 • Emergencial
            </span>
            <h4 className="font-heading font-bold text-sm text-white">
              Acione o MED em até 80 dias
            </h4>
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              O Mecanismo Especial de Devolução (MED) do Banco Central bloqueia as contas receptoras antes da dispersão em cascata.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#14151a] border border-[#2a2e39] space-y-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-[#3a6ea5]/20 text-[#70f3ff] border border-[#70f3ff]/30">
              Passo 2 • Blindagem
            </span>
            <h4 className="font-heading font-bold text-sm text-white">
              Desative SMS como 2º Fator
            </h4>
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              Troque SMS por aplicativos autenticadores (Google Authenticator) para impedir clonagem de chip via golpe do SIM Swap.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#14151a] border border-[#2a2e39] space-y-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-emerald-950/40 text-emerald-300 border border-emerald-500/30">
              Passo 3 • Família
            </span>
            <h4 className="font-heading font-bold text-sm text-white">
              Palavra-Passe Secreta Familiar
            </h4>
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              Combine uma palavra secreta em casa para verificar pedidos de dinheiro no WhatsApp e clonagem de voz por inteligência artificial.
            </p>
          </div>
        </div>
      </section>

      {/* Real-time News Feed */}
      <section className="bg-[#1b1d23] rounded-2xl border border-[#2a2e39] p-6 sm:p-7 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-[#70f3ff]" />
            <h3 className="font-heading font-bold text-base sm:text-lg text-white">
              Notícias & Alertas de Segurança em Tempo Real
            </h3>
          </div>

          {/* Search & Filter */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#686868] absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={newsSearchQuery}
                onChange={(e) => setNewsSearchQuery(e.target.value)}
                placeholder="Buscar notícias e alertas..."
                className="bg-[#14151a] border border-[#323744] focus:border-[#70f3ff] rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#d2d2d2] placeholder-[#686868] outline-none"
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {filteredNews.map((news) => (
            <article
              key={news.id}
              className="p-5 rounded-xl bg-[#14151a] hover:bg-[#23262f] border border-[#2a2e39] hover:border-[#323744] transition-all space-y-2"
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-md ${
                      news.urgency === 'high'
                        ? 'bg-rose-950/60 text-rose-300 border border-rose-500/40'
                        : 'bg-[#3a6ea5]/20 text-[#70f3ff] border border-[#70f3ff]/30'
                    }`}
                  >
                    {news.category}
                  </span>
                  <span className="text-xs text-[#686868]">{news.date}</span>
                </div>
                <span className="text-xs text-[#686868] font-medium">
                  Fonte: {news.source} • {news.readTime}
                </span>
              </div>

              <h4 className="font-heading font-bold text-sm sm:text-base text-white">
                {news.title}
              </h4>
              <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed">
                {news.summary}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

