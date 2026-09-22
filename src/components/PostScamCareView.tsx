import React, { useState, useMemo } from 'react';
import {
  HeartHandshake,
  Scale,
  CheckCircle,
  Calendar,
  ShieldAlert,
  Send,
  MessageCircle,
  Users,
  Search,
  ArrowRight,
  Filter,
  CheckCircle2,
  Phone,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Smile,
  X,
  Star,
  MapPin,
  Clock,
  Award,
  UserPlus,
} from 'lucide-react';
import { Specialist } from '../types';
import { SPECIALISTS_DATA } from '../data/specialistsData';
import { SpecialistRegistrationModal } from './SpecialistRegistrationModal';

interface PostScamCareViewProps {
  onOpenLia: () => void;
  onOpenSOS: () => void;
}

export const PostScamCareView: React.FC<PostScamCareViewProps> = ({
  onOpenLia,
  onOpenSOS,
}) => {
  const [breathingStep, setBreathingStep] = useState<'inspire' | 'segure' | 'expire'>('inspire');
  const [breathingActive, setBreathingActive] = useState(false);

  // Specialist filter & search state
  const [selectedType, setSelectedType] = useState<'all' | 'psychology' | 'lawyer' | 'cybersecurity'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialistModal, setSelectedSpecialistModal] = useState<Specialist | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // Booking consultation state
  const [consultName, setConsultName] = useState('');
  const [consultPhone, setConsultPhone] = useState('');
  const [consultScamType, setConsultScamType] = useState('Golpe do Pix / Falsa Central');
  const [consultEstimatedLoss, setConsultEstimatedLoss] = useState('');
  const [consultSubmitted, setConsultSubmitted] = useState(false);

  const startBreathingExercise = () => {
    setBreathingActive(true);
    let step = 0;
    const interval = setInterval(() => {
      step = (step + 1) % 3;
      if (step === 0) setBreathingStep('inspire');
      else if (step === 1) setBreathingStep('segure');
      else setBreathingStep('expire');
    }, 4000);

    setTimeout(() => {
      clearInterval(interval);
      setBreathingActive(false);
    }, 36000);
  };

  const handleConsultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultName.trim() || !consultPhone.trim()) return;
    setConsultSubmitted(true);
    setTimeout(() => {
      setConsultSubmitted(false);
      setConsultName('');
      setConsultPhone('');
      setConsultEstimatedLoss('');
    }, 5000);
  };

  const filteredSpecialists = useMemo(() => {
    return SPECIALISTS_DATA.filter((spec) => {
      if (selectedType !== 'all' && spec.type !== selectedType) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = spec.name.toLowerCase().includes(query);
        const matchesRole = spec.role.toLowerCase().includes(query);
        const matchesRegistry = spec.registryNumber.toLowerCase().includes(query);
        const matchesSpecialties = spec.specialties.some((s) => s.toLowerCase().includes(query));
        const matchesCity = spec.cityState.toLowerCase().includes(query);
        const matchesAbout = spec.about.toLowerCase().includes(query);

        return matchesName || matchesRole || matchesRegistry || matchesSpecialties || matchesCity || matchesAbout;
      }
      return true;
    });
  }, [selectedType, searchQuery]);

  const openWhatsApp = (specialist: Specialist) => {
    const url = `https://wa.me/${specialist.whatsappNumber}?text=${encodeURIComponent(specialist.defaultMessage)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-semibold mb-1.5">
          <HeartHandshake className="w-3.5 h-3.5" />
          <span>Espaço de Cuidado & Defesa</span>
        </div>
        <h1 className="font-heading font-bold text-2xl sm:text-3xl text-white tracking-tight">
          Acolhimento & Suporte Especializado
        </h1>
        <p className="text-xs sm:text-sm text-[#94a3b8] mt-1">
          Espaço seguro e humanizado. Conecte-se diretamente pelo WhatsApp com psicólogos e advogados especialistas em fraudes.
        </p>
      </div>

      {/* Empathy & Emotional Care Card */}
      <section className="bg-[#1b1d23] rounded-2xl border border-[#2a2e39] p-6 sm:p-7 space-y-5 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-950/60 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0 shadow-2xs">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="font-heading font-bold text-lg sm:text-xl text-white">
              Você não está sozinho e a responsabilidade NUNCA é sua
            </h2>
            <p className="text-xs sm:text-sm text-[#d2d2d2] leading-relaxed">
              Quadrilhas profissionais utilizam táticas coercitivas e manipulação psicológica avançada. O sentimento de frustração é natural, mas agir com auxílio de profissionais capacitados faz toda a diferença para sua saúde mental e recuperação patrimonial.
            </p>
          </div>
        </div>

        {/* Guided Breathing Widget for Immediate Calming */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#14151a] border border-[#2a2e39] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
          <div className="space-y-0.5 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Smile className="w-4 h-4 text-[#70f3ff]" />
              <h3 className="font-heading font-bold text-sm text-white">
                Exercício de Respiração Anti-Pânico (Técnica 4-4-4)
              </h3>
            </div>
            <p className="text-xs text-[#686868]">
              Diminua o estresse e a frequência cardíaca para tomar decisões com clareza.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            {breathingActive ? (
              <div className="flex items-center gap-3 bg-[#3a6ea5]/20 px-5 py-2.5 rounded-xl border border-[#70f3ff]/40 animate-pulse">
                <span className="text-xs font-bold text-[#70f3ff]">
                  {breathingStep === 'inspire'
                    ? '🌬️ Inspire profundamente (4s)...'
                    : breathingStep === 'segure'
                    ? '🧘 Segure o ar (4s)...'
                    : '😮‍💨 Expire lentamente (4s)...'}
                </span>
              </div>
            ) : (
              <button
                onClick={startBreathingExercise}
                className="px-4 py-2 rounded-xl bg-[#3a6ea5] hover:bg-[#3a6ea5]/80 text-white font-heading font-semibold text-xs shadow-xs transition-all cursor-pointer"
              >
                Iniciar Respiração Guiada (30s)
              </button>
            )}
          </div>
        </div>
      </section>

      {/* SPECIALISTS SECTION (PsyMeet Inspired Cards) */}
      <section className="space-y-5">
        {/* Prominent High-Visibility Call-to-Action Banner for Specialists */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#1b1d23] via-[#23262f] to-[#1b1d23] border-2 border-[#dfcf93]/60 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#dfcf93]/20 border border-[#dfcf93]/50 text-[#dfcf93] flex items-center justify-center shrink-0 shadow-lg">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-[#dfcf93] text-[#1b1d23] text-[10px] font-heading font-black tracking-wider uppercase">
                  Credenciamento Aberto
                </span>
                <span className="text-xs text-[#70f3ff] font-medium hidden sm:inline">Advogados • Psicólogos • Peritos</span>
              </div>
              <h3 className="font-heading font-bold text-base sm:text-lg text-white mt-1">
                Você é especialista e deseja atender vítimas de fraudes?
              </h3>
              <p className="text-xs text-[#94a3b8] mt-0.5">
                Envie seus dados e comprovações de classe para homologação e apareça com destaque no mural público.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsRegisterModalOpen(true)}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#dfcf93] hover:bg-[#ebdca6] text-[#1b1d23] font-heading font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xl hover:scale-102 active:scale-98 cursor-pointer shrink-0"
          >
            <UserPlus className="w-4 h-4 text-[#1b1d23] stroke-[2.5]" />
            <span>Cadastrar como Especialista</span>
          </button>
        </div>

        <div className="bg-[#1b1d23] border border-[#2a2e39] rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#2a2e39]">
            <div>
              <h2 className="font-heading font-bold text-lg sm:text-xl text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-[#70f3ff]" />
                Especialistas Credenciados para Contato Direto
              </h2>
              <p className="text-xs sm:text-sm text-[#686868] mt-1 max-w-2xl leading-relaxed">
                Psicólogos (CRP), Advogados especialistas em fraudes bancárias (OAB) e Peritos forenses prontos para atendimento imediato via WhatsApp.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
              <button
                onClick={() => setSelectedType('all')}
                className={`px-3.5 py-1.5 rounded-xl font-heading font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedType === 'all'
                    ? 'bg-[#3a6ea5] text-white shadow-2xs'
                    : 'bg-[#14151a] text-[#d2d2d2] hover:bg-[#23262f] border border-[#2a2e39]'
                }`}
              >
                Todos ({SPECIALISTS_DATA.length})
              </button>
              <button
                onClick={() => setSelectedType('psychology')}
                className={`px-3.5 py-1.5 rounded-xl font-heading font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedType === 'psychology'
                    ? 'bg-[#a88fac] text-white shadow-2xs'
                    : 'bg-[#a88fac]/10 text-[#a88fac] hover:bg-[#a88fac]/20 border border-[#a88fac]/30'
                }`}
              >
                Psicologia (CRP)
              </button>
              <button
                onClick={() => setSelectedType('lawyer')}
                className={`px-3.5 py-1.5 rounded-xl font-heading font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedType === 'lawyer'
                    ? 'bg-[#dfcf93] text-[#1b1d23] font-semibold shadow-2xs'
                    : 'bg-[#dfcf93]/10 text-[#dfcf93] hover:bg-[#dfcf93]/20 border border-[#dfcf93]/30'
                }`}
              >
                Advogados (OAB)
              </button>
              <button
                onClick={() => setSelectedType('cybersecurity')}
                className={`px-3.5 py-1.5 rounded-xl font-heading font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedType === 'cybersecurity'
                    ? 'bg-[#3a6ea5] text-[#70f3ff] shadow-2xs border border-[#70f3ff]/40'
                    : 'bg-[#14151a] text-[#70f3ff] hover:bg-[#23262f] border border-[#70f3ff]/30'
                }`}
              >
                Perícia Digital
              </button>
            </div>
          </div>

          {/* Search bar inside specialist section */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#686868] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nome, OAB/CRP, especialidade (ex: Ansiedade, MED Pix, Extorsão, Idosos)..."
              className="w-full bg-[#14151a] border border-[#323744] focus:border-[#70f3ff] rounded-xl pl-10 pr-10 py-2.5 text-sm text-[#d2d2d2] placeholder-[#686868] outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#686868] hover:text-[#d2d2d2] px-2 py-0.5 bg-[#23262f] rounded-md cursor-pointer"
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* Specialists Cards Grid */}
        <div className="space-y-4">
          {filteredSpecialists.length === 0 ? (
            <div className="bg-[#1b1d23] border border-[#2a2e39] rounded-2xl p-10 text-center space-y-3 shadow-xl">
              <Users className="w-10 h-10 text-[#686868] mx-auto" />
              <h3 className="font-heading font-bold text-white text-base">
                Nenhum especialista encontrado para o filtro
              </h3>
              <p className="text-xs text-[#686868] max-w-md mx-auto">
                Tente ajustar a busca ou a categoria para encontrar o profissional desejado.
              </p>
              <button
                onClick={() => {
                  setSelectedType('all');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-xl bg-[#3a6ea5] hover:bg-[#3a6ea5]/80 text-white text-xs font-heading font-semibold cursor-pointer"
              >
                Ver Todos os Especialistas
              </button>
            </div>
          ) : (
            filteredSpecialists.map((specialist) => (
              <div
                key={specialist.id}
                id={`specialist-card-${specialist.id}`}
                className="bg-[#1b1d23] hover:border-[#3a6ea5]/50 border border-[#2a2e39] rounded-2xl p-5 sm:p-6 transition-all shadow-xl relative group"
              >
                {/* Header Row: Photo, Info, and Registry Number */}
                <div className="flex flex-col md:flex-row items-start gap-5">
                  {/* Left Column: Avatar + Price Tag */}
                  <div className="flex flex-col items-center shrink-0 self-center md:self-start">
                    <div className="relative">
                      <img
                        src={specialist.photoUrl}
                        alt={specialist.name}
                        referrerPolicy="no-referrer"
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-[#2a2e39] shadow-sm group-hover:ring-2 group-hover:ring-[#70f3ff]/30 transition-all"
                      />
                      {specialist.isOnlineNow && (
                        <span
                          title="Disponível para contato online"
                          className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-[#1b1d23] rounded-full"
                        />
                      )}
                    </div>
                    <div className="mt-2 text-center">
                      <span className="font-heading font-bold text-sm sm:text-base text-white tracking-tight">
                        {specialist.priceTag}
                      </span>
                      <span className="text-[11px] text-[#686868] block">
                        por sessão / avaliação
                      </span>
                    </div>
                  </div>

                  {/* Middle & Right Content */}
                  <div className="flex-1 space-y-3.5 w-full">
                    {/* Top line with Name and Registry Badge */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div>
                        <h3 className="font-heading font-bold text-lg sm:text-xl text-white tracking-tight">
                          {specialist.name}
                        </h3>
                        <p className="text-xs text-[#70f3ff] font-semibold mt-0.5">
                          {specialist.role}
                        </p>
                      </div>

                      {/* Official Registry Badge (OAB / CRP) */}
                      <div className="self-start sm:self-auto">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#14151a] text-[#dfcf93] border border-[#dfcf93]/30 flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-[#dfcf93]" />
                          {specialist.registryNumber}
                        </span>
                      </div>
                    </div>

                    {/* Specialties Badges / Pills */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {specialist.specialties.map((specTag, idx) => (
                        <span
                          key={idx}
                          className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                            specialist.type === 'psychology'
                              ? 'bg-[#a88fac]/15 text-[#a88fac] border border-[#a88fac]/30'
                              : specialist.type === 'lawyer'
                              ? 'bg-[#dfcf93]/15 text-[#dfcf93] border border-[#dfcf93]/30'
                              : 'bg-[#3a6ea5]/20 text-[#70f3ff] border border-[#70f3ff]/30'
                          }`}
                        >
                          {specTag}
                        </span>
                      ))}
                    </div>

                    {/* Approach & Target Audience Line */}
                    <div className="text-xs text-[#d2d2d2] flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 pt-1 border-t border-[#2a2e39]">
                      <div>
                        <strong className="text-white font-semibold">Abordagem:</strong>{' '}
                        <span className="text-[#94a3b8]">{specialist.approach}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-[#94a3b8]">
                        <Users className="w-3.5 h-3.5 text-[#70f3ff] shrink-0" />
                        <span>{specialist.targetAudience}</span>
                      </div>
                    </div>

                    {/* About section */}
                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-[#686868] uppercase tracking-wide block">
                        Sobre o profissional:
                      </span>
                      <p className="text-xs sm:text-sm text-[#d2d2d2] leading-relaxed line-clamp-2">
                        {specialist.about}
                      </p>
                    </div>

                    {/* Bottom Action Row: Ver perfil -> on the left, Quero me consultar (WhatsApp) + Telefone on the right */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-[#2a2e39]">
                      {/* Left: Ver Perfil */}
                      <button
                        type="button"
                        onClick={() => setSelectedSpecialistModal(specialist)}
                        className="text-xs font-heading font-bold text-[#70f3ff] hover:text-[#93bfed] transition-colors flex items-center gap-1.5 self-start group/link cursor-pointer"
                      >
                        <span>Ver perfil completo</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                      </button>

                      {/* Right: Green WhatsApp CTA Button & Phone Display */}
                      <div className="flex flex-col sm:items-end gap-1 w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={() => openWhatsApp(specialist)}
                          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                        >
                          <MessageCircle className="w-4 h-4 fill-current" />
                          <span>Falar no WhatsApp</span>
                        </button>
                        <span className="text-[11px] text-[#686868] font-medium flex items-center gap-1">
                          <Phone className="w-3 h-3 text-[#686868]" />
                          {specialist.formattedPhone}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Full Profile Modal */}
      {selectedSpecialistModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#1b1d23] border border-[#2a2e39] rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-7 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setSelectedSpecialistModal(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-[#14151a] text-[#686868] hover:text-white hover:bg-[#23262f] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="flex items-start gap-4">
              <img
                src={selectedSpecialistModal.photoUrl}
                alt={selectedSpecialistModal.name}
                referrerPolicy="no-referrer"
                className="w-20 h-20 rounded-full object-cover border-2 border-[#2a2e39] shadow-sm shrink-0"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-heading font-bold text-lg text-white">
                    {selectedSpecialistModal.name}
                  </h3>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#dfcf93]/15 text-[#dfcf93] border border-[#dfcf93]/30">
                    {selectedSpecialistModal.registryNumber}
                  </span>
                </div>
                <p className="text-xs text-[#70f3ff] font-semibold">
                  {selectedSpecialistModal.role}
                </p>
                <div className="flex items-center gap-3 text-xs text-[#686868] pt-0.5">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#686868]" />
                    {selectedSpecialistModal.cityState}
                  </span>
                  <span className="flex items-center gap-1 text-[#dfcf93] font-semibold">
                    <Star className="w-3.5 h-3.5 fill-current text-[#dfcf93]" />
                    {selectedSpecialistModal.rating} ({selectedSpecialistModal.consultationsCount} atendimentos)
                  </span>
                </div>
              </div>
            </div>

            {/* Specialties & Target in modal */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-[#d2d2d2] uppercase tracking-wide block">
                Especialidades & Foco de Atuação:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedSpecialistModal.specialties.map((spec, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-0.5 rounded-full bg-[#a88fac]/15 text-[#a88fac] border border-[#a88fac]/30 font-medium"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* Approach */}
            <div className="bg-[#14151a] p-4 rounded-xl border border-[#2a2e39] text-xs space-y-1.5">
              <div>
                <strong className="text-white">Linha / Abordagem:</strong>{' '}
                <span className="text-[#94a3b8]">{selectedSpecialistModal.approach}</span>
              </div>
              <div>
                <strong className="text-white">Público Atendido:</strong>{' '}
                <span className="text-[#94a3b8]">{selectedSpecialistModal.targetAudience}</span>
              </div>
            </div>

            {/* Full Bio */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-[#d2d2d2] uppercase tracking-wide block">
                Biografia & Experiência:
              </span>
              <p className="text-xs sm:text-sm text-[#d2d2d2] leading-relaxed bg-[#14151a] p-4 rounded-xl border border-[#2a2e39]">
                {selectedSpecialistModal.fullBio || selectedSpecialistModal.about}
              </p>
            </div>

            {/* Pre-filled Message Preview */}
            <div className="space-y-1">
              <span className="text-xs font-medium text-[#686868] block">
                Mensagem automática que será enviada no WhatsApp:
              </span>
              <div className="p-3 rounded-xl bg-[#14151a] border border-[#2a2e39] text-xs text-[#94a3b8] italic">
                "{selectedSpecialistModal.defaultMessage}"
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#2a2e39]">
              <div>
                <span className="text-xs text-[#686868] block">Valor informado:</span>
                <span className="font-heading font-bold text-white text-base">
                  {selectedSpecialistModal.priceTag}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedSpecialistModal(null)}
                  className="px-4 py-2 rounded-xl bg-[#14151a] text-[#d2d2d2] hover:bg-[#23262f] border border-[#2a2e39] text-xs font-semibold cursor-pointer"
                >
                  Fechar
                </button>
                <button
                  type="button"
                  onClick={() => openWhatsApp(selectedSpecialistModal)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Conversar no WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Legal Recovery Roadmap (Súmula 479 STJ & MED) */}
      <section className="bg-[#1b1d23] rounded-2xl border border-[#2a2e39] p-6 sm:p-7 space-y-6 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#3a6ea5]/20 text-[#70f3ff] border border-[#70f3ff]/30">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-lg text-white">
              Direitos da Vítima & Como Pedir Ressarcimento
            </h2>
            <p className="text-xs text-[#686868]">
              Fundamentos jurídicos e jurisprudência brasileira para recuperação de perdas.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#14151a] border border-[#2a2e39] space-y-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#3a6ea5]/20 text-[#70f3ff] border border-[#70f3ff]/30">
              Passo 1 • Imediato
            </span>
            <h3 className="font-heading font-bold text-sm text-white">
              Acionamento do MED (Banco Central)
            </h3>
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              O Mecanismo Especial de Devolução permite o bloqueio cautelar das contas recebedoras se solicitado em até 80 dias da fraude.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#14151a] border border-[#2a2e39] space-y-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#dfcf93]/20 text-[#dfcf93] border border-[#dfcf93]/30">
              Passo 2 • Provas
            </span>
            <h3 className="font-heading font-bold text-sm text-white">
              Boletim de Ocorrência & Ata Notarial
            </h3>
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              Guarde comprovantes com número de autenticação, prints de mensagens e registre o BO por Estelionato Eletrônico.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#14151a] border border-[#2a2e39] space-y-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-rose-950/60 text-rose-300 border border-rose-500/40">
              Passo 3 • Responsabilidade
            </span>
            <h3 className="font-heading font-bold text-sm text-white">
              Súmula 479 do STJ (Fortuito Interno)
            </h3>
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              As instituições financeiras respondem objetivamente pelos danos gerados por fraudes cometidas por terceiros em operações bancárias.
            </p>
          </div>
        </div>
      </section>

      {/* Free / Triaged Request Form */}
      <section className="bg-[#1b1d23] rounded-2xl border border-[#2a2e39] p-6 sm:p-7 space-y-5 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#14151a] text-[#70f3ff] border border-[#2a2e39]">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-white">
                Solicitar Triagem de Orientação Geral
              </h3>
              <p className="text-xs text-[#686868]">
                Caso prefira encaminhar seu caso para defensoria pública ou consultores parceiros:
              </p>
            </div>
          </div>
        </div>

        {consultSubmitted && (
          <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500 text-emerald-200 text-sm flex items-center gap-2">
            <CheckCircle className="w-5 h-5 shrink-0 text-emerald-400" />
            <span>Solicitação registrada com sucesso! Um especialista entrará em contato em horário comercial.</span>
          </div>
        )}

        <form onSubmit={handleConsultSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#d2d2d2] block mb-1.5">
                Seu Nome Completo:
              </label>
              <input
                type="text"
                required
                value={consultName}
                onChange={(e) => setConsultName(e.target.value)}
                placeholder="Ex: Maria Luiza"
                className="w-full bg-[#14151a] border border-[#323744] focus:border-[#70f3ff] rounded-xl px-4 py-2.5 text-sm text-[#d2d2d2] placeholder-[#686868] outline-none transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#d2d2d2] block mb-1.5">
                WhatsApp para Contato Seguro:
              </label>
              <input
                type="tel"
                required
                value={consultPhone}
                onChange={(e) => setConsultPhone(e.target.value)}
                placeholder="Ex: (11) 98765-4321"
                className="w-full bg-[#14151a] border border-[#323744] focus:border-[#70f3ff] rounded-xl px-4 py-2.5 text-sm text-[#d2d2d2] placeholder-[#686868] outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#d2d2d2] block mb-1.5">
                Tipo de Golpe Sofrido:
              </label>
              <select
                value={consultScamType}
                onChange={(e) => setConsultScamType(e.target.value)}
                className="w-full bg-[#14151a] border border-[#323744] focus:border-[#70f3ff] rounded-xl px-4 py-2.5 text-sm text-[#d2d2d2] outline-none transition-all"
              >
                <option value="Golpe do Pix / Falsa Central">Golpe do Pix / Falsa Central Telefônica</option>
                <option value="Golpe do WhatsApp / Falso Parente">Golpe do WhatsApp / Clonagem</option>
                <option value="Falso Leilão de Veículos">Falso Leilão de Veículos ou Imóveis</option>
                <option value="Falso Empréstimo com Depósito">Falso Empréstimo com Exigência de Taxa</option>
                <option value="Invasão de Conta e Roubo de Dados">Invasão de Dispositivo / Mão Fantasma</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#d2d2d2] block mb-1.5">
                Valor Aproximado do Prejuízo:
              </label>
              <input
                type="text"
                value={consultEstimatedLoss}
                onChange={(e) => setConsultEstimatedLoss(e.target.value)}
                placeholder="Ex: R$ 3.500,00"
                className="w-full bg-[#14151a] border border-[#323744] focus:border-[#70f3ff] rounded-xl px-4 py-2.5 text-sm text-[#d2d2d2] placeholder-[#686868] outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#3a6ea5] hover:bg-[#3a6ea5]/80 text-white font-heading font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <Send className="w-4 h-4 text-white" />
              <span>Enviar Pedido de Triagem</span>
            </button>
          </div>
        </form>
      </section>

      {/* Specialist Registration Modal */}
      <SpecialistRegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
    </div>
  );
};

