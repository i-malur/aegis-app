import React, { useState } from 'react';
import {
  ShieldAlert,
  X,
  PhoneCall,
  FileText,
  Lock,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  LifeBuoy,
} from 'lucide-react';
import { LIA_AVATAR_IMG } from '../assets/branding';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLia: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  onOpenLia,
}) => {
  const [copiedBankMsg, setCopiedBankMsg] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  if (!isOpen) return null;

  const toggleStep = (stepNumber: number) => {
    setCompletedSteps((prev) =>
      prev.includes(stepNumber)
        ? prev.filter((s) => s !== stepNumber)
        : [...prev, stepNumber]
    );
  };

  const sampleBankScript = `Prezados, sou vítima de um golpe financeiro via Pix realizado hoje. Solicito imediatamente o acionamento do MECANISMO ESPECIAL DE DEVOLUÇÃO (MED) regulamentado pelo Banco Central (Resolução BCB nº 103), com o bloqueio cautelar e notificação imediata da instituição financeira receptora para devolução dos valores.`;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(sampleBankScript);
    setCopiedBankMsg(true);
    setTimeout(() => setCopiedBankMsg(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#1b1d23] border border-rose-500/30 rounded-2xl shadow-2xl overflow-hidden my-8 font-sans">
        {/* Header Alert */}
        <div className="bg-[#14151a] p-5 sm:p-6 border-b border-[#2a2e39] flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-600 rounded-2xl text-white shadow-xs">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-950/60 text-rose-300 border border-rose-500/40">
                  Protocolo de Emergência
                </span>
                <span className="text-xs text-rose-400 font-medium">Aja nos primeiros minutos</span>
              </div>
              <h2 className="font-heading font-bold text-xl sm:text-2xl text-white mt-1">
                Sofri um Golpe: Guia Imediato de Contenção
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#d2d2d2] hover:text-white p-2 rounded-xl bg-[#23262f] border border-[#323744] shadow-2xs transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Calming Message */}
          <div className="bg-[#3a6ea5]/20 p-4 rounded-xl border border-[#70f3ff]/20 flex items-start gap-3">
            <LifeBuoy className="w-5 h-5 text-[#70f3ff] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-heading font-bold text-white text-sm">
                Respire fundo: a culpa não é sua!
              </h4>
              <p className="text-xs text-[#d2d2d2] mt-1 leading-relaxed">
                Golpistas utilizam técnicas avançadas de manipulação psicológica e tecnologia. O mais importante agora é seguir a ordem dos 3 passos abaixo para estancar os prejuízos e recuperar valores.
              </p>
            </div>
          </div>

          {/* 3 Step Protocol */}
          <div className="space-y-4">
            {/* Step 1 */}
            <div
              className={`p-4 rounded-xl border transition-all ${
                completedSteps.includes(1)
                  ? 'bg-emerald-950/30 border-emerald-500/40'
                  : 'bg-[#14151a] border-[#2a2e39] shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                    1
                  </span>
                  <div>
                    <h3 className="font-heading font-bold text-white text-base">
                      Acione o MED do Pix no seu Banco (Mecanismo Especial de Devolução)
                    </h3>
                    <p className="text-xs text-[#94a3b8] mt-1 leading-relaxed">
                      Ligue imediatamente para o SAC do seu banco (número atrás do cartão ou botão "Contestar transação" no extrato Pix do app). Exija o registro da contestação por fraude via MED do Banco Central.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => toggleStep(1)}
                  className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                    completedSteps.includes(1)
                      ? 'bg-emerald-600 text-white border-emerald-500'
                      : 'border-[#323744] text-[#686868] hover:text-white bg-[#23262f]'
                  }`}
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>

              {/* Script helper to talk with bank */}
              <div className="mt-3 p-3.5 rounded-xl bg-[#1b1d23] border border-[#323744] text-xs">
                <div className="flex items-center justify-between text-[#70f3ff] mb-1 font-semibold">
                  <span>Texto para ler ou enviar no chat do banco:</span>
                  <button
                    onClick={handleCopyScript}
                    className="flex items-center gap-1 text-xs text-[#70f3ff] hover:underline cursor-pointer"
                  >
                    {copiedBankMsg ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copiar Texto
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[#dfcf93] italic text-xs font-mono select-all bg-[#14151a] p-2.5 rounded-lg border border-[#2a2e39]">
                  "{sampleBankScript}"
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div
              className={`p-4 rounded-xl border transition-all ${
                completedSteps.includes(2)
                  ? 'bg-emerald-950/30 border-emerald-500/40'
                  : 'bg-[#14151a] border-[#2a2e39] shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-[#3a6ea5] text-white flex items-center justify-center font-bold text-sm shrink-0">
                    2
                  </span>
                  <div>
                    <h3 className="font-heading font-bold text-white text-base">
                      Faça o Boletim de Ocorrência Online (BO)
                    </h3>
                    <p className="text-xs text-[#94a3b8] mt-1 leading-relaxed">
                      Registre o BO na Delegacia Eletrônica do seu estado sob a tipificação <strong>Estelionato Eletrônico (Art. 171, §2º-B do CP)</strong>. Anexe comprovantes Pix, prints de conversas e telefone do golpista.
                    </p>
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      <a
                        href="https://delegaciaeletronica.policiacivil.sp.gov.br"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#23262f] hover:bg-[#2a2e39] text-[#93bfed] border border-[#323744] text-xs font-semibold"
                      >
                        Delegacia Eletrônica SP <ExternalLink className="w-3 h-3" />
                      </a>
                      <a
                        href="https://dedic.pcerj.rj.gov.br"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#23262f] hover:bg-[#2a2e39] text-[#93bfed] border border-[#323744] text-xs font-semibold"
                      >
                        Delegacia Crimes Virtuais RJ <ExternalLink className="w-3 h-3" />
                      </a>
                      <a
                        href="https://new.safernet.org.br/denuncie"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#23262f] hover:bg-[#2a2e39] text-[#93bfed] border border-[#323744] text-xs font-semibold"
                      >
                        Denúncia Safernet <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => toggleStep(2)}
                  className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                    completedSteps.includes(2)
                      ? 'bg-emerald-600 text-white border-emerald-500'
                      : 'border-[#323744] text-[#686868] hover:text-white bg-[#23262f]'
                  }`}
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Step 3 */}
            <div
              className={`p-4 rounded-xl border transition-all ${
                completedSteps.includes(3)
                  ? 'bg-emerald-950/30 border-emerald-500/40'
                  : 'bg-[#14151a] border-[#2a2e39] shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-[#23262f] text-[#70f3ff] border border-[#323744] flex items-center justify-center font-bold text-sm shrink-0">
                    3
                  </span>
                  <div>
                    <h3 className="font-heading font-bold text-white text-base">
                      Desconecte Sessões, Altere Senhas e Consulte o Registrato
                    </h3>
                    <p className="text-xs text-[#94a3b8] mt-1 leading-relaxed">
                      Se você baixou algum aplicativo suspeito ou digitou senha em link falso, desinstale-o imediatamente, acesse "Aparelhos Conectados" no WhatsApp e encerre todas as sessões. Acesse o <strong>Registrato do Banco Central</strong> para verificar se abriram contas em seu nome.
                    </p>
                    <div className="mt-2">
                      <a
                        href="https://registrato.bcb.gov.br"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-[#70f3ff] hover:underline font-semibold"
                      >
                        Acessar Registrato Banco Central (gov.br) <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => toggleStep(3)}
                  className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                    completedSteps.includes(3)
                      ? 'bg-emerald-600 text-white border-emerald-500'
                      : 'border-[#323744] text-[#686868] hover:text-white bg-[#23262f]'
                  }`}
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Talk with Lia CTA */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#3a6ea5]/20 border border-[#70f3ff]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-[#dfcf93]/40 shrink-0 bg-[#23262f] shadow-sm">
                <img
                  src={LIA_AVATAR_IMG}
                  alt="Lia"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-heading font-bold text-white text-sm">
                  Precisa de orientação passo a passo agora?
                </h4>
                <p className="text-xs text-[#d2d2d2] mt-0.5">
                  Nossa IA Lia pode te guiar no preenchimento do BO e no contato com o banco.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenLia();
              }}
              className="px-4 py-2.5 rounded-xl bg-[#3a6ea5] hover:bg-[#3a6ea5]/80 text-white font-heading font-semibold text-xs sm:text-sm whitespace-nowrap shadow-xs cursor-pointer"
            >
              Abrir Chat com Lia IA
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#14151a] px-6 py-4 border-t border-[#2a2e39] flex items-center justify-between">
          <span className="text-xs text-[#686868] font-medium">
            Progresso: {completedSteps.length} de 3 passos concluídos
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#23262f] border border-[#323744] text-[#d2d2d2] hover:text-white hover:bg-[#2a2e39] font-semibold text-xs transition-colors cursor-pointer"
          >
            Fechar Janela
          </button>
        </div>
      </div>
    </div>
  );
};

