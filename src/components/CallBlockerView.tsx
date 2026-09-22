import React, { useState, useEffect } from 'react';
import {
  PhoneOff,
  PhoneCall,
  BellRing,
  VolumeX,
  ShieldBan,
  ShieldCheck,
  PlusCircle,
  Search,
  CheckCircle,
  AlertTriangle,
  Radio,
  PhoneForwarded,
  UserCheck,
  X,
  Smartphone,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { BlacklistPhone } from '../types';

interface CallBlockerViewProps {
  onOpenSOS: () => void;
}

export const CallBlockerView: React.FC<CallBlockerViewProps> = ({ onOpenSOS }) => {
  const [protectionMode, setProtectionMode] = useState<'alerta' | 'silencioso' | 'bloqueio_total'>('alerta');
  const [blacklist, setBlacklist] = useState<BlacklistPhone[]>([]);
  const [queryNumber, setQueryNumber] = useState('');
  const [queryResult, setQueryResult] = useState<BlacklistPhone | null | 'not_found'>(null);
  const [isSearching, setIsSearching] = useState(false);

  // New report form state
  const [newNumber, setNewNumber] = useState('');
  const [newCategory, setNewCategory] = useState('Falsa Central Bancária');
  const [newNotes, setNewNotes] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  // Simulator state
  const [isSimulatingCall, setIsSimulatingCall] = useState(false);
  const [simulatedCaller, setSimulatedCaller] = useState<BlacklistPhone | null>(null);

  useEffect(() => {
    fetchBlacklist();
  }, []);

  const fetchBlacklist = async () => {
    try {
      const res = await fetch('/api/blacklist-phones');
      const data = await res.json();
      if (Array.isArray(data)) {
        setBlacklist(data);
      }
    } catch (e) {
      console.error('Error fetching blacklist:', e);
    }
  };

  const handleSearchNumber = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryNumber.trim()) return;

    setIsSearching(true);
    const clean = queryNumber.replace(/\D/g, '');

    setTimeout(() => {
      const found = blacklist.find((p) => p.number.includes(clean) || clean.includes(p.number));
      if (found) {
        setQueryResult(found);
      } else {
        setQueryResult('not_found');
      }
      setIsSearching(false);
    }, 400);
  };

  const handleRegisterFraudPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNumber.trim()) return;

    try {
      const res = await fetch('/api/blacklist-phones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          number: newNumber,
          category: newCategory,
          notes: newNotes,
        }),
      });

      const data = await res.json();
      setFormSuccess(true);
      setNewNumber('');
      setNewNotes('');
      fetchBlacklist();
      setTimeout(() => setFormSuccess(false), 4000);
    } catch (err) {
      console.error('Error registering phone:', err);
    }
  };

  const triggerCallSimulation = () => {
    const randomScamNumber: BlacklistPhone = blacklist[0] || {
      id: 'sim-1',
      number: '11987214409',
      category: 'Falsa Central Bancária',
      reputation: 'dangerous',
      reportsCount: 184,
      lastReported: 'Agora',
      notes: 'Ligação automatizada simulando compra suspeita no Nubank/Bradesco.',
    };

    setSimulatedCaller(randomScamNumber);
    setIsSimulatingCall(true);
  };

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3a6ea5]/20 border border-[#70f3ff]/30 text-[#70f3ff] text-xs font-semibold mb-1.5">
            <PhoneOff className="w-3.5 h-3.5" />
            <span>Escudo Telefônico</span>
          </div>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-white tracking-tight">
            Bloqueador de Chamadas & Falsas Centrais
          </h1>
          <p className="text-xs sm:text-sm text-[#94a3b8] mt-1">
            Proteção inteligente contra robocalls, golpes do 0800 falso e clonagem de WhatsApp com lista colaborativa.
          </p>
        </div>

        <button
          onClick={triggerCallSimulation}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-[#3a6ea5] hover:bg-[#3a6ea5]/80 text-white font-heading text-xs font-semibold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
        >
          <PhoneCall className="w-4 h-4 text-[#70f3ff]" />
          <span>Simular Chamada Suspeita</span>
        </button>
      </div>

      {/* Simulated Incoming Call Notification Overlay if triggered */}
      {isSimulatingCall && simulatedCaller && (
        <div className="relative rounded-2xl bg-[#1b1d23] border-2 border-rose-500/80 p-6 shadow-xl animate-fade-in">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-14 h-14 rounded-2xl bg-rose-600 flex items-center justify-center text-white shrink-0 shadow-sm animate-pulse">
                <PhoneCall className="w-7 h-7" />
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-rose-600 text-white">
                  {protectionMode === 'bloqueio_total'
                    ? 'CHAMADA BLOQUEADA AUTOMATICAMENTE'
                    : protectionMode === 'silencioso'
                    ? 'CHAMADA SILENCIADA'
                    : 'ALERTA DE RISCO ELEVADO'}
                </span>
                <h3 className="font-heading font-bold text-xl text-white mt-1.5">
                  (11) 98721-4409 • {simulatedCaller.category}
                </h3>
                <p className="text-xs sm:text-sm text-[#94a3b8] mt-0.5">
                  {simulatedCaller.reportsCount} denúncias na base • {simulatedCaller.notes}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSimulatingCall(false)}
                className="px-4 py-2 rounded-xl bg-[#23262f] text-white hover:bg-[#2a2e39] border border-[#323744] text-xs font-semibold cursor-pointer"
              >
                Dispensar Teste
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3 Protection Modes Selection */}
      <section className="bg-[#1b1d23] p-6 sm:p-7 rounded-2xl border border-[#2a2e39] space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading font-bold text-base sm:text-lg text-white">
              Modo de Proteção Ativa
            </h2>
            <p className="text-xs text-[#686868] mt-0.5">
              Defina o comportamento do aplicativo ao identificar uma chamada de número suspeito.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Mode 1: Alerta */}
          <div
            onClick={() => setProtectionMode('alerta')}
            className={`p-5 rounded-xl border cursor-pointer transition-all ${
              protectionMode === 'alerta'
                ? 'bg-[#3a6ea5]/25 border-[#70f3ff]/50 ring-1 ring-[#70f3ff]/30 shadow-md'
                : 'bg-[#14151a] border-[#2a2e39] hover:bg-[#23262f]'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-[#3a6ea5]/30 text-[#70f3ff]">
                <BellRing className="w-5 h-5" />
              </div>
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-md ${
                  protectionMode === 'alerta'
                    ? 'bg-[#3a6ea5] text-white'
                    : 'bg-[#23262f] text-[#686868]'
                }`}
              >
                {protectionMode === 'alerta' ? 'Ativado' : 'Selecionar'}
              </span>
            </div>
            <h3 className="font-heading font-bold text-sm text-white">
              Modo Alerta
            </h3>
            <p className="text-xs text-[#94a3b8] mt-1 leading-relaxed">
              O celular toca normalmente, mas você recebe um aviso sonoro e visual de risco na tela antes de atender.
            </p>
          </div>

          {/* Mode 2: Silencioso */}
          <div
            onClick={() => setProtectionMode('silencioso')}
            className={`p-5 rounded-xl border cursor-pointer transition-all ${
              protectionMode === 'silencioso'
                ? 'bg-[#dfcf93]/20 border-[#dfcf93]/50 ring-1 ring-[#dfcf93]/30 shadow-md'
                : 'bg-[#14151a] border-[#2a2e39] hover:bg-[#23262f]'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-[#dfcf93]/20 text-[#dfcf93]">
                <VolumeX className="w-5 h-5" />
              </div>
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-md ${
                  protectionMode === 'silencioso'
                    ? 'bg-[#dfcf93] text-[#14151a]'
                    : 'bg-[#23262f] text-[#686868]'
                }`}
              >
                {protectionMode === 'silencioso' ? 'Ativado' : 'Selecionar'}
              </span>
            </div>
            <h3 className="font-heading font-bold text-sm text-white">
              Modo Silencioso
            </h3>
            <p className="text-xs text-[#94a3b8] mt-1 leading-relaxed">
              Silencia instantaneamente o toque e vibração de ligações suspeitas sem interromper suas atividades.
            </p>
          </div>

          {/* Mode 3: Bloqueio Total */}
          <div
            onClick={() => setProtectionMode('bloqueio_total')}
            className={`p-5 rounded-xl border cursor-pointer transition-all ${
              protectionMode === 'bloqueio_total'
                ? 'bg-rose-950/40 border-rose-500/50 ring-1 ring-rose-500/30 shadow-md'
                : 'bg-[#14151a] border-[#2a2e39] hover:bg-[#23262f]'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-rose-950/60 text-rose-400">
                <ShieldBan className="w-5 h-5" />
              </div>
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-md ${
                  protectionMode === 'bloqueio_total'
                    ? 'bg-rose-600 text-white'
                    : 'bg-[#23262f] text-[#686868]'
                }`}
              >
                {protectionMode === 'bloqueio_total' ? 'Ativado' : 'Selecionar'}
              </span>
            </div>
            <h3 className="font-heading font-bold text-sm text-white">
              Modo Bloqueio Total
            </h3>
            <p className="text-xs text-[#94a3b8] mt-1 leading-relaxed">
              Recusa e encerra imediatamente qualquer chamada de números denunciados sem tocar seu aparelho.
            </p>
          </div>
        </div>
      </section>

      {/* Number Checker & Collaborative Registration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Number Lookup */}
        <div className="lg:col-span-6 bg-[#1b1d23] p-6 sm:p-7 rounded-2xl border border-[#2a2e39] space-y-4 shadow-xl">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-[#70f3ff]" />
            <h3 className="font-heading font-bold text-base sm:text-lg text-white">
              Consultar Número de Telefone
            </h3>
          </div>
          <p className="text-xs text-[#94a3b8]">
            Verifique se um número pertence a uma falsa central telefônica, robocall ou golpista de WhatsApp.
          </p>

          <form onSubmit={handleSearchNumber} className="space-y-3">
            <div>
              <input
                type="text"
                value={queryNumber}
                onChange={(e) => setQueryNumber(e.target.value)}
                placeholder="Ex: (11) 98721-4409 ou 0800 123 4567"
                className="w-full bg-[#14151a] border border-[#323744] focus:border-[#70f3ff] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#d2d2d2] placeholder-[#686868] focus:outline-none transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching || !queryNumber.trim()}
              className="w-full py-2.5 rounded-xl bg-[#3a6ea5] hover:bg-[#3a6ea5]/80 disabled:opacity-50 text-white font-heading font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              {isSearching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>Consultar na Base Pública & Colaborativa</span>
            </button>
          </form>

          {/* Search result display */}
          {queryResult && (
            <div className="pt-2">
              {queryResult === 'not_found' ? (
                <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-xs space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Nenhuma denúncia cadastrada para este número.</span>
                  </div>
                  <p className="text-[#94a3b8]">
                    Ainda assim, lembre-se: bancos NUNCA pedem transferências, senhas ou tokens por telefone.
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs space-y-2">
                  <div className="flex items-center gap-2 text-rose-300 font-bold">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span>NÚMERO MALICIOSO IDENTIFICADO!</span>
                  </div>
                  <div className="space-y-1 text-[#d2d2d2]">
                    <p>
                      <strong className="text-white">Classificação:</strong> {queryResult.category}
                    </p>
                    <p>
                      <strong className="text-white">Denúncias registradas:</strong> {queryResult.reportsCount} vítimas
                    </p>
                    <p className="text-[#94a3b8]">
                      <strong className="text-white">Relato:</strong> {queryResult.notes}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Collaborative Blacklist Registration Form */}
        <div className="lg:col-span-6 bg-[#1b1d23] p-6 sm:p-7 rounded-2xl border border-[#2a2e39] space-y-4 shadow-xl">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-[#70f3ff]" />
            <div>
              <h3 className="font-heading font-bold text-base sm:text-lg text-white">
                Cadastrar Telefone Fraudulento
              </h3>
            </div>
          </div>
          <p className="text-xs text-[#94a3b8]">
            Contribua com a base comunitária para proteger milhares de outros usuários do mesmo golpe.
          </p>

          {formSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Número cadastrado com sucesso na base de bloqueio! Obrigado pela colaboração.</span>
            </div>
          )}

          <form onSubmit={handleRegisterFraudPhone} className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-[#d2d2d2] block mb-1">
                Número do Telefone / WhatsApp:
              </label>
              <input
                type="text"
                required
                value={newNumber}
                onChange={(e) => setNewNumber(e.target.value)}
                placeholder="Ex: (11) 97740-2319"
                className="w-full bg-[#14151a] border border-[#323744] focus:border-[#70f3ff] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#d2d2d2] placeholder-[#686868] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#d2d2d2] block mb-1">
                Tipo de Golpe Praticado:
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full bg-[#14151a] border border-[#323744] focus:border-[#70f3ff] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#d2d2d2] focus:outline-none"
              >
                <option value="Falsa Central Bancária">Falsa Central Bancária (0800 / Compra Falsa)</option>
                <option value="Golpe do WhatsApp / Falso Filho">Golpe do WhatsApp (Falso Filho / Parente)</option>
                <option value="Falso Emprego / Tarefas TikTok">Falsa Oferta de Emprego (TikTok / Shopee)</option>
                <option value="Cobrança Falsa de Cartão / Pix">Cobrança Indevida / Pix Falso</option>
                <option value="Robocall Agressivo">Robocall Silencioso / Spam Excessivo</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#d2d2d2] block mb-1">
                Como foi a abordagem do golpista?
              </label>
              <textarea
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                rows={2}
                placeholder="Ex: Ligaram dizendo que meu cartão Nubank foi clonado e mandaram transferir R$ 2.000 para estornar..."
                className="w-full bg-[#14151a] border border-[#323744] focus:border-[#70f3ff] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#d2d2d2] placeholder-[#686868] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#3a6ea5] hover:bg-[#3a6ea5]/80 text-white font-heading font-semibold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
            >
              Adicionar à Lista Colaborativa
            </button>
          </form>
        </div>
      </div>

      {/* Community Blacklist Feed */}
      <section className="bg-[#1b1d23] p-6 sm:p-7 rounded-2xl border border-[#2a2e39] space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#70f3ff] animate-pulse" />
            <h3 className="font-heading font-bold text-base sm:text-lg text-white">
              Últimos Telefones Bloqueados pela Comunidade
            </h3>
          </div>
          <span className="text-xs text-[#686868]">
            {blacklist.length} números monitorados
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {blacklist.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-[#14151a] border border-[#2a2e39] flex flex-col justify-between space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-mono font-bold text-sm text-white">
                    {item.number}
                  </span>
                  <span className="block text-xs font-semibold text-rose-400 mt-0.5">
                    {item.category}
                  </span>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-rose-950/60 text-rose-300 border border-rose-500/40">
                  {item.reportsCount} Denúncias
                </span>
              </div>
              <p className="text-xs text-[#94a3b8] line-clamp-2">
                {item.notes}
              </p>
              <div className="pt-2 border-t border-[#2a2e39] flex items-center justify-between text-xs text-[#686868]">
                <span>Último reporte: {item.lastReported}</span>
                <span className="text-emerald-400 font-medium">Bloqueio Ativo</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

