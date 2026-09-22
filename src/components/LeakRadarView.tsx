import React, { useState } from 'react';
import {
  Eye,
  Search,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  UserX,
  Camera,
  Upload,
  ExternalLink,
  Lock,
  Mail,
  Fingerprint,
  Phone,
  User,
  Sparkles,
  CheckCircle,
  FileText,
  Building,
} from 'lucide-react';

export const LeakRadarView: React.FC = () => {
  const [queryType, setQueryType] = useState<'email' | 'cpf' | 'phone' | 'username'>('email');
  const [queryValue, setQueryValue] = useState('');
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        setUserPhoto(reader.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleRunSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryValue.trim() && !userPhoto) return;

    setIsSearching(true);
    setResult(null);

    try {
      const response = await fetch('/api/leak-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: queryType,
          query: queryValue,
          hasPhoto: !!userPhoto,
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error('Leak check error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3a6ea5]/20 border border-[#70f3ff]/30 text-[#70f3ff] text-xs font-semibold mb-1.5">
          <Eye className="w-3.5 h-3.5" />
          <span>Monitor de Identidade</span>
        </div>
        <h1 className="font-heading font-bold text-2xl sm:text-3xl text-white tracking-tight">
          Radar de Vazamentos & Perfis Falsos
        </h1>
        <p className="text-xs sm:text-sm text-[#94a3b8] mt-1">
          Descubra se seu e-mail ou CPF foram expostos e localize perfis falsos criados com suas fotos e dados nas redes sociais.
        </p>
      </div>

      {/* Query Engine Form */}
      <div className="bg-[#1b1d23] rounded-2xl border border-[#2a2e39] p-6 sm:p-7 space-y-6 shadow-xl">
        {/* Selector of Query Type */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'email', label: 'E-mail', icon: Mail },
            { id: 'cpf', label: 'CPF', icon: Fingerprint },
            { id: 'phone', label: 'Celular / WhatsApp', icon: Phone },
            { id: 'username', label: 'Nome de Usuário (@)', icon: User },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = queryType === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setQueryType(tab.id as any);
                  setResult(null);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-heading font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#3a6ea5] text-white shadow-2xs'
                    : 'bg-[#14151a] text-[#d2d2d2] hover:bg-[#23262f] border border-[#2a2e39]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <form onSubmit={handleRunSearch} className="space-y-5">
          {/* Main Query Field */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#d2d2d2] flex items-center justify-between">
              <span>
                {queryType === 'email'
                  ? 'Digite seu endereço de e-mail:'
                  : queryType === 'cpf'
                  ? 'Digite seu CPF para verificação:'
                  : queryType === 'phone'
                  ? 'Digite seu número com DDD:'
                  : 'Digite seu nome de usuário das redes sociais:'}
              </span>
              <span className="text-[11px] text-[#686868] font-normal">Consulta segura em tempo real</span>
            </label>
            <input
              type={queryType === 'email' ? 'email' : 'text'}
              required
              value={queryValue}
              onChange={(e) => setQueryValue(e.target.value)}
              placeholder={
                queryType === 'email'
                  ? 'exemplo: seu.nome@gmail.com'
                  : queryType === 'cpf'
                  ? 'exemplo: 123.456.789-00'
                  : queryType === 'phone'
                  ? 'exemplo: (11) 98765-4321'
                  : 'exemplo: @seunome_oficial'
              }
              className="w-full bg-[#14151a] border border-[#323744] focus:border-[#70f3ff] rounded-xl px-4 py-3 text-sm text-[#d2d2d2] placeholder-[#686868] focus:outline-none transition-colors"
            />
          </div>

          {/* Optional Facial / Photo Verification Area (Redesigned Clean Layout) */}
          <div className="p-4 rounded-xl bg-[#14151a] border border-[#2a2e39] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#3a6ea5]/20 text-[#70f3ff] border border-[#70f3ff]/30 flex items-center justify-center shrink-0">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-heading font-semibold text-white">
                    Busca Reversa por Foto de Rosto <span className="text-[11px] font-normal text-[#686868]">(Opcional)</span>
                  </h3>
                  <p className="text-[11px] text-[#686868]">
                    Localize contas falsas ou perfis clones usando sua foto em redes sociais.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {userPhoto ? (
                  <div className="flex items-center gap-3 bg-[#1b1d23] px-3 py-1.5 rounded-xl border border-[#2a2e39]">
                    <img
                      src={userPhoto}
                      alt="Rosto enviado"
                      className="w-7 h-7 rounded-full object-cover border border-[#70f3ff]"
                    />
                    <span className="text-xs text-emerald-400 font-medium">Foto anexada</span>
                    <button
                      type="button"
                      onClick={() => setUserPhoto(null)}
                      className="text-xs text-rose-400 hover:text-rose-300 ml-1 cursor-pointer"
                      title="Remover foto"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <label className="inline-flex items-center gap-1.5 cursor-pointer px-3.5 py-1.5 rounded-xl bg-[#23262f] hover:bg-[#2a2e39] text-[#70f3ff] text-xs font-heading font-semibold border border-[#323744] transition-all shadow-2xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Anexar Foto de Perfil</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoUpload}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Privacy & Zero-Storage Guarantee Banner */}
          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[#14151a]/90 border border-[#70f3ff]/30 text-xs">
            <div className="w-8 h-8 rounded-lg bg-[#3a6ea5]/20 border border-[#70f3ff]/40 flex items-center justify-center shrink-0 text-[#70f3ff] mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-heading font-bold text-[#70f3ff] text-xs">
                  Garantia de Privacidade & Não Armazenamento
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                  Processamento Volátil
                </span>
              </div>
              <p className="text-[#94a3b8] leading-relaxed text-[11px] sm:text-xs">
                Todos os dados informados nesta verificação (<strong>foto</strong>, <strong>e-mail</strong>, <strong>telefone</strong>, <strong>nome de usuário</strong> e <strong>CPF</strong>) são utilizados <span className="text-white font-medium">exclusivamente no momento da consulta</span> para cruzar bases públicas de vazamentos e <strong>não são armazenados, compartilhados nem salvos</strong> em nenhum servidor ou banco de dados.
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={isSearching || !queryValue.trim()}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#3a6ea5] hover:bg-[#3a6ea5]/80 text-white font-heading font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSearching ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-[#70f3ff]" />
                  <span>Cruzando bases de vazamentos...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 text-[#70f3ff]" />
                  <span>Escanear Vazamentos & Contas Clones</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Query Results */}
      {result && (
        <div className="space-y-6 animate-fade-in">
          {/* Top Alert Banner */}
          <div
            className={`p-6 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              result.breachesCount > 0 || result.impersonationsFound > 0
                ? 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div
                className={`p-3 rounded-xl ${
                  result.breachesCount > 0 ? 'bg-rose-600' : 'bg-emerald-600'
                } text-white shadow-xs`}
              >
                {result.breachesCount > 0 ? (
                  <ShieldAlert className="w-6 h-6 animate-pulse" />
                ) : (
                  <ShieldCheck className="w-6 h-6" />
                )}
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-white">
                  {result.breachesCount > 0
                    ? `Atenção: Registro encontrado em ${result.breachesCount} vazamento(s) de dados!`
                    : 'Nenhum vazamento recente identificado para este registro.'}
                </h3>
                <p className="text-xs text-[#94a3b8] mt-0.5">
                  Consulta realizada em bases públicas de incidentes de segurança e redes sociais.
                </p>
              </div>
            </div>

            <div className="px-4 py-2 rounded-xl bg-[#14151a] border border-[#2a2e39] text-right shrink-0 shadow-xs">
              <span className="text-[11px] text-[#686868] font-medium block">
                Nível de Exposição
              </span>
              <span className="font-heading font-bold text-base text-[#dfcf93]">
                {result.securityScore}% de Risco
              </span>
            </div>
          </div>

          {/* Breaches Cards Grid */}
          {result.breaches && result.breaches.length > 0 && (
            <div className="bg-[#1b1d23] rounded-2xl border border-[#2a2e39] p-6 sm:p-7 space-y-4 shadow-xl">
              <h3 className="font-heading font-bold text-base sm:text-lg text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                <span>Histórico de Vazamentos Encontrados</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {result.breaches.map((b: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#14151a] border border-[#2a2e39] space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-heading font-bold text-sm text-white">
                        {b.title}
                      </h4>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-rose-950/60 text-rose-300 border border-rose-500/40">
                        {b.severity}
                      </span>
                    </div>

                    <p className="text-xs text-[#94a3b8] leading-relaxed">
                      {b.description}
                    </p>

                    <div className="pt-2 border-t border-[#2a2e39] flex flex-wrap gap-1 items-center">
                      <span className="text-xs text-[#686868] mr-1">Dados expostos:</span>
                      {b.compromisedData.map((d: string, dIdx: number) => (
                        <span
                          key={dIdx}
                          className="text-xs px-2 py-0.5 rounded-md bg-[#23262f] text-[#d2d2d2] border border-[#323744] font-medium"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Social Media Impersonation Radar Results */}
          {result.impersonations && result.impersonations.length > 0 && (
            <div className="bg-[#1b1d23] rounded-2xl border border-[#2a2e39] p-6 sm:p-7 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserX className="w-5 h-5 text-[#a88fac]" />
                  <h3 className="font-heading font-bold text-base sm:text-lg text-white">
                    Perfis Suspeitos / Clones Detectados nas Redes Sociais
                  </h3>
                </div>
                <span className="text-xs font-semibold text-rose-400">
                  {result.impersonations.length} conta(s) encontrada(s)
                </span>
              </div>

              <div className="space-y-3">
                {result.impersonations.map((imp: any, iIdx: number) => (
                  <div
                    key={iIdx}
                    className="p-4 rounded-xl bg-[#14151a] border border-[#dfcf93]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-bold text-sm text-white">
                          {imp.platform}: {imp.profileHandle}
                        </span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#dfcf93]/20 text-[#dfcf93] border border-[#dfcf93]/30">
                          {imp.similarityScore}% similaridade
                        </span>
                      </div>
                      <p className="text-xs text-[#94a3b8]">
                        {imp.findings} • Detectado: {imp.detectedAt}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={imp.actionUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-heading font-semibold text-xs flex items-center gap-1 shadow-2xs"
                      >
                        <span>Denunciar Perfil Falso</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Recommendations & Legal Dispatch */}
          <div className="bg-[#1b1d23] rounded-2xl border border-[#2a2e39] p-6 sm:p-7 space-y-4 shadow-xl">
            <h3 className="font-heading font-bold text-base sm:text-lg text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span>Plano de Blindagem Recomendado:</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {result.recommendations?.map((rec: string, rIdx: number) => (
                <div
                  key={rIdx}
                  className="p-4 rounded-xl bg-[#14151a] border border-[#2a2e39] text-xs text-[#d2d2d2] flex items-start gap-3"
                >
                  <span className="w-5 h-5 rounded-full bg-[#3a6ea5] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {rIdx + 1}
                  </span>
                  <span className="leading-relaxed">{rec}</span>
                </div>
              ))}
            </div>

            {/* Official Report Outlets */}
            <div className="pt-3 border-t border-[#2a2e39] flex flex-wrap items-center gap-3">
              <span className="text-xs text-[#686868] font-medium">
                Encaminhar denúncia para órgãos oficiais:
              </span>
              <a
                href="https://new.safernet.org.br/denuncie"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-[#14151a] hover:bg-[#23262f] text-[#d2d2d2] text-xs font-semibold flex items-center gap-1.5 border border-[#2a2e39] transition-colors"
              >
                <Building className="w-3.5 h-3.5 text-[#686868]" /> Safernet Brasil
              </a>
              <a
                href="https://www.procon.sp.gov.br"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-[#14151a] hover:bg-[#23262f] text-[#d2d2d2] text-xs font-semibold flex items-center gap-1.5 border border-[#2a2e39] transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-[#686868]" /> PROCON
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

