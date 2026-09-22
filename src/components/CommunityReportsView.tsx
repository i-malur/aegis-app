import React, { useState, useEffect } from 'react';
import {
  Users,
  PlusCircle,
  ThumbsUp,
  AlertOctagon,
  FileCheck,
  Search,
  Filter,
  Upload,
  Send,
  Download,
  Building,
  CheckCircle,
  ExternalLink,
  Copy,
  Check,
  ShieldAlert,
  ShieldCheck,
  Clock,
  Info,
} from 'lucide-react';
import { CollaborativeReport } from '../types';
import { useAuth } from '../context/AuthContext';

interface CommunityReportsViewProps {
  initialReportData?: any;
}

export const CommunityReportsView: React.FC<CommunityReportsViewProps> = ({
  initialReportData,
}) => {
  const { user } = useAuth();
  const [reports, setReports] = useState<CollaborativeReport[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Form states
  const [formType, setFormType] = useState<'link' | 'phone' | 'email' | 'profile' | 'pix' | 'sms'>('link');
  const [formTarget, setFormTarget] = useState(initialReportData?.target || '');
  const [formTitle, setFormTitle] = useState(initialReportData?.title || '');
  const [formCategory, setFormCategory] = useState('Phishing & Pix Falso');
  const [formDescription, setFormDescription] = useState(initialReportData?.description || '');
  const [formVictimLoss, setFormVictimLoss] = useState('');
  const [formForwardTo, setFormForwardTo] = useState<string[]>(['safernet', 'procon']);
  const [formSuccess, setFormSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Official dispatch generator modal state
  const [dispatchReport, setDispatchReport] = useState<CollaborativeReport | null>(null);
  const [copiedDispatch, setCopiedDispatch] = useState(false);

  useEffect(() => {
    fetchReports();
    if (initialReportData) {
      setShowForm(true);
    }
  }, [initialReportData]);

  const fetchReports = async () => {
    try {
      const res = await fetch('/api/community-reports');
      const data = await res.json();
      if (Array.isArray(data)) {
        setReports(data);
      }
    } catch (e) {
      console.error('Error fetching reports:', e);
    }
  };

  const handleUpvote = async (id: string) => {
    try {
      const res = await fetch(`/api/community-reports/${id}/upvote`, {
        method: 'POST',
      });
      const data = await res.json();
      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, upvotes: data.upvotes } : r))
      );
    } catch (e) {
      console.error('Upvote error:', e);
    }
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTarget.trim() || !formTitle.trim() || !formDescription.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/community-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: formType,
          target: formTarget,
          title: formTitle,
          description: formDescription,
          scamCategory: formCategory,
          victimLoss: formVictimLoss || undefined,
          tags: [formCategory, formType.toUpperCase(), 'Denúncia Verificada'],
          authorId: user?.id,
          authorEmail: user?.email,
        }),
      });

      await res.json();
      setFormSuccess(true);
      fetchReports();
      setTimeout(() => {
        setFormSuccess(false);
        setShowForm(false);
        setFormTarget('');
        setFormTitle('');
        setFormDescription('');
        setFormVictimLoss('');
      }, 4000);
    } catch (err) {
      console.error('Submit report error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredReports = reports.filter((r) => {
    const matchesType = filterType === 'all' || r.type === filterType;
    const matchesSearch =
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const generateDispatchText = (r: CollaborativeReport) => {
    return `=====================================================
NOTIFICAÇÃO FORMAL DE CRIME CIBERNÉTICO / FRAUDE VIRTUAL
GERADO POR: AEGIS SEGURANÇA DIGITAL
DESTINATÁRIO: Órgãos de Investigação e Defesa do Consumidor
(Polícia Civil / Delegacia Eletrônica, PROCON e Safernet Brasil)
=====================================================

1. DADOS DA FRAUDE IDENTIFICADA:
- Título da Infração: ${r.title}
- Categoria do Golpe: ${r.scamCategory}
- Endereço / Telefone / Alvo: ${r.target}
- Data do Registro: ${new Date(r.reportedAt).toLocaleDateString('pt-BR')}
- Estimativa de Vítimas/Prejuízo: ${r.victimLoss || 'Tentativa de estelionato'}
- Reputação na Comunidade Aegis: ${r.upvotes} confirmações de golpe

2. RELATO DOS FATOS:
${r.description}

3. FUNDAMENTAÇÃO LEGAL (CÓDIGO PENAL BRASILEIRO):
- Art. 171, §2º-B (Fraude Eletrônica / Estelionato Cibernético)
- Art. 154-A (Invasão de Dispositivo Informático)
- Lei 13.709/2018 (Lei Geral de Proteção de Dados Pessoais - LGPD)

4. PEDIDO:
Solicita-se a investigação dos responsáveis, bloqueio imediato do domínio/linha e medidas cabíveis para estorno e proteção à coletividade.
=====================================================`;
  };

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3a6ea5]/20 border border-[#70f3ff]/30 text-[#70f3ff] text-xs font-semibold mb-1.5">
            <Users className="w-3.5 h-3.5" />
            <span>Rede de Proteção Comunitária</span>
          </div>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-white tracking-tight">
            Denúncias da Comunidade
          </h1>
          <p className="text-xs sm:text-sm text-[#686868] mt-1">
            Compartilhe tentativas de golpe para análise da nossa equipe técnica e ajude a alertar milhares de cidadãos com despachos oficiais pré-formatados.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-[#3a6ea5] hover:bg-[#3a6ea5]/80 text-white font-heading font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{showForm ? 'Fechar Formulário' : 'Fazer Nova Denúncia'}</span>
        </button>
      </div>

      {/* Moderation Notice Banner */}
      <div className="bg-[#14151a] border border-[#2a2e39] rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 text-xs text-[#d2d2d2]">
        <div className="w-8 h-8 rounded-xl bg-[#3a6ea5]/20 border border-[#70f3ff]/30 text-[#70f3ff] flex items-center justify-center shrink-0 mt-0.5">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div className="space-y-1">
          <h4 className="font-heading font-bold text-white text-sm">
            Protocolo de Curadoria e Moderação de Denúncias
          </h4>
          <p className="text-[#686868] leading-relaxed">
            Para garantir a precisão das informações e proteger os cidadãos contra trotes ou alegações indevidas, <strong className="text-white">todas as denúncias enviadas passam por uma rigorosa análise prévia da nossa equipe de segurança</strong> antes de serem catalogadas e publicadas no mural aberto da comunidade.
          </p>
        </div>
      </div>

      {/* New Report Form Drawer */}
      {showForm && (
        <div className="bg-[#1b1d23] rounded-2xl border border-[#3a6ea5]/40 p-6 sm:p-7 space-y-5 shadow-xl animate-fade-in">
          <div className="flex items-center justify-between border-b border-[#2a2e39] pb-4">
            <div>
              <h3 className="font-heading font-bold text-lg text-white">
                Formulário de Denúncia de Fraude
              </h3>
              <p className="text-xs text-[#686868]">
                Sua denúncia será avaliada e auditada pela equipe técnica do Aegis antes da publicação oficial.
              </p>
            </div>
            <span className="text-xs text-emerald-400 font-semibold px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% Anônimo & Auditado
            </span>
          </div>

          {formSuccess && (
            <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500 text-emerald-200 text-sm flex items-start gap-3 animate-fade-in">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Denúncia recebida com sucesso!</p>
                <p className="text-xs text-emerald-300 mt-0.5">
                  Nossa equipe de segurança irá analisar as evidências e o relato. Assim que a moderação for concluída, ela será publicada no mural público para alertar outros usuários.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmitReport} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#d2d2d2] block mb-1">
                  Tipo de Ameaça:
                </label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value as any)}
                  className="w-full bg-[#14151a] border border-[#323744] rounded-xl px-3 py-2.5 text-sm text-[#d2d2d2] focus:outline-none focus:border-[#70f3ff]"
                >
                  <option value="link">Link / Site Clonado (URL)</option>
                  <option value="phone">Telefone / Falsa Central / WhatsApp</option>
                  <option value="email">E-mail de Phishing</option>
                  <option value="profile">Perfil Falso em Rede Social</option>
                  <option value="pix">Chave Pix Fraudulenta</option>
                  <option value="sms">Mensagem de SMS Maliciosa</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#d2d2d2] block mb-1">
                  Categoria do Golpe:
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full bg-[#14151a] border border-[#323744] rounded-xl px-3 py-2.5 text-sm text-[#d2d2d2] focus:outline-none focus:border-[#70f3ff]"
                >
                  <option value="Falsa Central Telefônica">Falsa Central Telefônica (0800 Falso)</option>
                  <option value="Golpe da Falsa Taxa dos Correios">Golpe da Falsa Taxa dos Correios</option>
                  <option value="Golpe do WhatsApp (Falso Familiar)">Golpe do WhatsApp (Falso Familiar)</option>
                  <option value="Falso E-commerce / Promoção Falsa">Falsa Loja Virtual / Promoção Falsa</option>
                  <option value="Falsa Oferta de Emprego">Falsa Oferta de Emprego (Tarefas)</option>
                  <option value="Boleto Bancário Adulterado">Boleto Bancário Adulterado</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#d2d2d2] block mb-1">
                  Endereço, Link, Telefone ou Chave Pix Denunciada:
                </label>
                <input
                  type="text"
                  required
                  value={formTarget}
                  onChange={(e) => setFormTarget(e.target.value)}
                  placeholder="Ex: https://site-falso.online ou (11) 98765-4321"
                  className="w-full bg-[#14151a] border border-[#323744] rounded-xl px-3 py-2.5 text-sm text-[#d2d2d2] placeholder-[#686868] focus:outline-none focus:border-[#70f3ff]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#d2d2d2] block mb-1">
                  Título Resumido da Denúncia:
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Ex: Falso e-mail de banco cobrando fatura atrasada"
                  className="w-full bg-[#14151a] border border-[#323744] rounded-xl px-3 py-2.5 text-sm text-[#d2d2d2] placeholder-[#686868] focus:outline-none focus:border-[#70f3ff]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#d2d2d2] block mb-1">
                Relato Detalhado: Como aconteceu a abordagem?
              </label>
              <textarea
                rows={3}
                required
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Descreva a abordagem, valores cobrados, dados solicitados e alertas que ajudem outros usuários a reconhecerem..."
                className="w-full bg-[#14151a] border border-[#323744] rounded-xl p-3 text-sm text-[#d2d2d2] placeholder-[#686868] focus:outline-none focus:border-[#70f3ff]"
              />
            </div>

            {/* Optional Loss */}
            <div>
              <label className="text-xs font-semibold text-[#686868] block mb-1">
                Houve perda financeira? (Opcional):
              </label>
              <input
                type="text"
                value={formVictimLoss}
                onChange={(e) => setFormVictimLoss(e.target.value)}
                placeholder="Ex: R$ 450 transferidos via Pix ou 'Tentativa barrada a tempo'"
                className="w-full bg-[#14151a] border border-[#323744] rounded-xl px-3 py-2 text-xs text-[#d2d2d2] placeholder-[#686868] focus:outline-none focus:border-[#70f3ff]"
              />
            </div>

            {/* Dispatch destinations */}
            <div className="bg-[#14151a] p-4 rounded-xl border border-[#2a2e39] space-y-2">
              <label className="text-xs font-semibold text-white block">
                Encaminhar denúncia e gerar relatório para os órgãos oficiais:
              </label>
              <div className="flex flex-wrap gap-4 text-xs text-[#d2d2d2]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-[#70f3ff]" />
                  <span>Safernet Brasil (Crimes Virtuais)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-[#70f3ff]" />
                  <span>PROCON (Defesa do Consumidor)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-[#70f3ff]" />
                  <span>Delegacia de Crimes Cibernéticos</span>
                </label>
              </div>
            </div>

            {/* Explanatory note */}
            <div className="flex items-center gap-2 text-xs text-[#dfcf93] bg-[#dfcf93]/10 p-3 rounded-xl border border-[#dfcf93]/30">
              <Clock className="w-4 h-4 text-[#dfcf93] shrink-0" />
              <span>
                Após o envio, os peritos da plataforma farão a triagem das informações para publicação no mural em instantes.
              </span>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2.5 rounded-xl bg-[#14151a] text-[#d2d2d2] hover:bg-[#23262f] border border-[#2a2e39] font-heading font-semibold text-xs cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-[#3a6ea5] hover:bg-[#3a6ea5]/80 text-white font-heading font-semibold text-sm shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Enviando para Análise...' : 'Enviar Denúncia para Análise da Equipe'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reports Feed Filter & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {['all', 'link', 'phone', 'email', 'profile', 'sms'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-heading font-semibold capitalize whitespace-nowrap transition-colors cursor-pointer ${
                filterType === t
                  ? 'bg-[#3a6ea5] text-white shadow-2xs'
                  : 'bg-[#1b1d23] text-[#d2d2d2] hover:bg-[#23262f] border border-[#2a2e39]'
              }`}
            >
              {t === 'all' ? 'Todos os Golpes' : t}
            </button>
          ))}
        </div>

        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por link, telefone ou palavra-chave..."
            className="bg-[#14151a] border border-[#323744] rounded-xl px-3.5 py-2 text-xs text-[#d2d2d2] placeholder-[#686868] focus:outline-none focus:border-[#70f3ff] w-full sm:w-64"
          />
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="bg-[#1b1d23] rounded-2xl border border-[#2a2e39] hover:border-[#3a6ea5]/50 transition-all p-5 sm:p-6 flex flex-col justify-between space-y-4 shadow-xl"
          >
            <div className="space-y-3">
              {/* Header with tags and upvote */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  {/* Category & Verified Status Badges with generous spacing */}
                  <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                    <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-md bg-rose-950/60 text-rose-300 border border-rose-500/40">
                      {report.scamCategory}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-md bg-emerald-950/60 text-emerald-300 border border-emerald-500/40">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      Analisada e Aprovada pela Equipe
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-base sm:text-lg text-white leading-snug">
                    {report.title}
                  </h3>
                </div>

                {/* Upvote Button */}
                <button
                  onClick={() => handleUpvote(report.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#14151a] hover:bg-[#3a6ea5]/20 text-[#d2d2d2] hover:text-[#70f3ff] border border-[#2a2e39] text-xs font-semibold transition-all active:scale-95 shrink-0 cursor-pointer"
                  title="Confirmar que este golpe é real"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{report.upvotes}</span>
                </button>
              </div>

              {/* Target */}
              <div className="p-3 rounded-xl bg-[#14151a] border border-[#2a2e39] font-mono text-xs text-[#70f3ff] truncate select-all">
                🎯 {report.target}
              </div>

              <p className="text-xs sm:text-sm text-[#d2d2d2] leading-relaxed">
                {report.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {report.tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="text-xs px-2.5 py-0.5 rounded-md bg-[#14151a] text-[#686868] border border-[#2a2e39] font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer with Dispatch Generator */}
            <div className="pt-3 border-t border-[#2a2e39] flex items-center justify-between">
              <span className="text-xs text-[#686868]">
                {new Date(report.reportedAt).toLocaleDateString('pt-BR')} • {report.evidenceCount} evidências
              </span>

              <button
                onClick={() => setDispatchReport(report)}
                className="text-xs font-heading font-semibold text-[#70f3ff] hover:text-[#93bfed] flex items-center gap-1 cursor-pointer"
              >
                <span>Gerar Despacho Oficial</span>
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Dispatch Export Modal */}
      {dispatchReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-2xl bg-[#1b1d23] border border-[#2a2e39] rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#2a2e39] pb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-[#70f3ff]" />
                <h3 className="font-heading font-bold text-lg text-white">
                  Despacho Oficial Pré-Formatado
                </h3>
              </div>
              <button
                onClick={() => setDispatchReport(null)}
                className="text-[#686868] hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#d2d2d2]">
              Copie o documento formatado abaixo e cole diretamente no portal da Delegacia Eletrônica, formulário do PROCON ou Safernet.
            </p>

            <textarea
              readOnly
              rows={12}
              value={generateDispatchText(dispatchReport)}
              className="w-full bg-[#14151a] border border-[#2a2e39] rounded-xl p-3.5 font-mono text-xs text-[#d2d2d2] focus:outline-none select-all"
            />

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <a
                  href="https://new.safernet.org.br/denuncie"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-[#14151a] hover:bg-[#23262f] border border-[#2a2e39] text-[#d2d2d2] text-xs font-semibold flex items-center gap-1"
                >
                  Abrir Safernet <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="https://delegaciaeletronica.policiacivil.sp.gov.br"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-[#14151a] hover:bg-[#23262f] border border-[#2a2e39] text-[#d2d2d2] text-xs font-semibold flex items-center gap-1"
                >
                  Delegacia Eletrônica <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(generateDispatchText(dispatchReport));
                  setCopiedDispatch(true);
                  setTimeout(() => setCopiedDispatch(false), 2000);
                }}
                className="px-4 py-2 rounded-xl bg-[#3a6ea5] hover:bg-[#3a6ea5]/80 text-white font-heading font-semibold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                {copiedDispatch ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedDispatch ? 'Copiado!' : 'Copiar Documento'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

