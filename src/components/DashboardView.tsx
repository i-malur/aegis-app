import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Search,
  Bot,
  PhoneOff,
  MapPin,
  Eye,
  Users,
  HeartHandshake,
  KeyRound,
  ArrowRight,
  Zap,
  Radio,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  BookOpen,
  Sparkles,
  AlertTriangle,
  Send,
  Lock,
  Compass,
} from 'lucide-react';
import { ActiveTab } from '../types';
import { LIA_AVATAR_IMG } from '../assets/branding';

interface DashboardViewProps {
  setActiveTab: (tab: ActiveTab) => void;
  onOpenSOS: () => void;
  onQuickScan: (text: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  setActiveTab,
  onOpenSOS,
  onQuickScan,
}) => {
  const [quickInput, setQuickInput] = useState('');

  const handleQuickScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    onQuickScan(quickInput);
    setActiveTab('scanner');
  };

  const featureCards = [
    {
      id: 'lia-ai',
      title: 'Assistente Lia IA',
      description: 'Converse com nossa IA para tirar dúvidas sobre mensagens, simular situações e receber conselhos de prevenção.',
      icon: Bot,
      bgColor: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200/60',
      tag: 'Inteligência Antifraude',
      action: 'Conversar com a Lia',
    },
    {
      id: 'scam-alerts',
      title: 'Alertas & Matérias Colaborativas',
      description: 'Publique novos golpes emergentes, consulte o que fazer em caso de golpe e leia matérias educativas da comunidade.',
      icon: AlertTriangle,
      bgColor: 'bg-amber-50 text-amber-600 border-amber-100',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200/60',
      tag: 'Feed & Publicações',
      action: 'Ver alertas e publicar',
    },
    {
      id: 'scanner',
      title: 'Verificador de Ameaças',
      description: 'Analise links recebidos, boletos bancários em PDF, mensagens de WhatsApp e chaves Pix suspeitas.',
      icon: Search,
      bgColor: 'bg-blue-50 text-blue-600 border-blue-100',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200/60',
      tag: 'Links, Boletos & Pix',
      action: 'Verificar item agora',
    },
    {
      id: 'scam-map',
      title: 'Mapa de Golpes & Notícias',
      description: 'Descubra quais são os golpes mais comuns no seu estado e veja notícias e alertas de segurança do Brasil.',
      icon: MapPin,
      bgColor: 'bg-amber-50 text-amber-600 border-amber-100',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200/60',
      tag: '27 Estados do Brasil',
      action: 'Ver mapa por estado',
    },
    {
      id: 'call-blocker',
      title: 'Bloqueador de Chamadas',
      description: 'Proteção contra ligações de falsa central bancária (0800 fake), robocalls insistentes e clonagem.',
      icon: PhoneOff,
      bgColor: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
      tag: 'Blindagem de Ligações',
      action: 'Configurar bloqueador',
    },
    {
      id: 'leak-radar',
      title: 'Radar de Vazamentos',
      description: 'Verifique se seu e-mail, senhas ou CPF foram expostos e monitore se há perfis falsos com sua foto.',
      icon: Eye,
      bgColor: 'bg-purple-50 text-purple-600 border-purple-100',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200/60',
      tag: 'Proteção de Identidade',
      action: 'Consultar vazamentos',
    },
    {
      id: 'glossary',
      title: 'Glossário Descomplicado',
      description: 'Dicionário simples e prático de termos como Phishing, Ransomware, 2FA, VPN e Engenharia Social.',
      icon: BookOpen,
      bgColor: 'bg-sky-50 text-sky-600 border-sky-100',
      badgeColor: 'bg-sky-50 text-sky-700 border-sky-200/60',
      tag: 'Aprenda Fácil',
      action: 'Explorar termos',
    },
    {
      id: 'community-reports',
      title: 'Comunidade & Denúncias',
      description: 'Avise outros usuários sobre tentativas de fraude e gere um documento pronto para boletim de ocorrência.',
      icon: Users,
      bgColor: 'bg-teal-50 text-teal-600 border-teal-100',
      badgeColor: 'bg-teal-50 text-teal-700 border-teal-200/60',
      tag: 'Rede Colaborativa',
      action: 'Fazer denúncia',
    },
    {
      id: 'digital-vault',
      title: 'Cofre de Senhas',
      description: 'Guarde suas senhas com segurança, teste a força das suas credenciais e armazene contatos de emergência.',
      icon: KeyRound,
      bgColor: 'bg-slate-100 text-slate-700 border-slate-200',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-300',
      tag: 'Criptografia Local',
      action: 'Abrir cofre seguro',
    },
    {
      id: 'post-scam-care',
      title: 'Apoio Especializado & MED',
      description: 'Advogados, psicólogos credenciados e instruções passo a passo para acionar o estorno MED Pix.',
      icon: HeartHandshake,
      bgColor: 'bg-rose-50 text-rose-600 border-rose-100',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200/60',
      tag: 'Suporte Humano',
      action: 'Acessar apoio',
    },
  ] as const;

  return (
    <div className="space-y-8 pb-10">
      {/* Welcoming Top Card with Quick Scanner */}
      <section className="bg-[#1b1d23] border border-[#2a2e39] rounded-2xl p-6 sm:p-8 shadow-lg">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3a6ea5]/20 border border-[#70f3ff]/30 text-[#70f3ff] text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Central de Proteção Digital</span>
          </div>

          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-white tracking-tight">
            Olá! O que você gostaria de verificar hoje?
          </h2>
          <p className="text-sm text-[#d2d2d2] mt-2 leading-relaxed font-sans">
            Cole um link, mensagem suspeita, linha de boleto bancário ou chave Pix para saber imediatamente se é seguro.
          </p>
        </div>

        {/* Search / Scan Box */}
        <form onSubmit={handleQuickScanSubmit} className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-[#686868] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={quickInput}
              onChange={(e) => setQuickInput(e.target.value)}
              placeholder="Cole aqui um link, mensagem, Pix ou código de boleto..."
              className="w-full bg-[#14151a] border border-[#323744] focus:border-[#70f3ff] focus:ring-2 focus:ring-[#70f3ff]/20 rounded-xl pl-11 pr-4 py-3 text-sm text-[#d2d2d2] placeholder-[#686868] transition-all outline-none"
            />
          </div>
          <button
            type="submit"
            className="bg-[#3a6ea5] hover:bg-[#3a6ea5]/90 text-white px-7 py-3 rounded-xl text-sm font-heading font-semibold shadow-xs hover:shadow-[#3a6ea5]/30 active:scale-98 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <Zap className="w-4 h-4 text-[#70f3ff]" />
            <span>Verificar Agora</span>
          </button>
        </form>

        {/* Quick Sample Links & Status */}
        <div className="mt-4 pt-4 border-t border-[#2a2e39] flex flex-wrap items-center justify-between gap-3 text-xs text-[#686868]">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-[#d2d2d2]">Exemplos rápidos:</span>
            <button
              type="button"
              onClick={() => setQuickInput('https://rastreio-correios-taxa-libera.site/pagar')}
              className="px-2.5 py-1 rounded-lg bg-[#23262f] hover:bg-[#2a2e39] text-[#93bfed] border border-[#323744] transition-colors cursor-pointer"
            >
              Golpe dos Correios
            </button>
            <button
              type="button"
              onClick={() => setQuickInput('Mãe, troquei de número, me manda 1500 no Pix urgente')}
              className="px-2.5 py-1 rounded-lg bg-[#23262f] hover:bg-[#2a2e39] text-[#dfcf93] border border-[#323744] transition-colors cursor-pointer"
            >
              Falso Familiar
            </button>
            <button
              type="button"
              onClick={() => setQuickInput('https://nubank-atualizacao-seguranca.com')}
              className="px-2.5 py-1 rounded-lg bg-[#23262f] hover:bg-[#2a2e39] text-[#a88fac] border border-[#323744] transition-colors cursor-pointer"
            >
              Falso Banco
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              142 Itens Seguros
            </span>
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              29 Ameaças Bloqueadas
            </span>
          </div>
        </div>
      </section>

      {/* 2-Column Section: Mini Lia Chat & Real-Time Alerts */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Lia AI Quick Helper */}
        <div className="lg:col-span-6 bg-[#1b1d23] border border-[#2a2e39] rounded-2xl p-6 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
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
                  <h3 className="font-heading font-bold text-base text-white">
                    Converse com a Lia
                  </h3>
                  <p className="text-xs text-[#686868]">
                    Sua assistente inteligente para dúvidas de segurança
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#3a6ea5]/20 text-[#70f3ff] border border-[#70f3ff]/30">
                Online
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#14151a] border border-[#2a2e39] text-xs sm:text-sm text-[#d2d2d2] leading-relaxed space-y-2">
              <p className="font-semibold text-[#70f3ff]">Dica da Lia para hoje:</p>
              <p className="text-[#d2d2d2]">
                "Se você receber uma ligação ou mensagem dizendo que sua conta foi bloqueada ou que há uma compra suspeita no seu cartão, nunca clique no link nem ligue para o 0800 indicado na mensagem. Acesse o aplicativo oficial do seu banco."
              </p>
            </div>
          </div>
        </div>

        {/* Real-time Alerts */}
        <div className="lg:col-span-6 bg-[#1b1d23] border border-[#2a2e39] rounded-2xl p-6 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#2a2e39]">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                <h3 className="font-heading font-bold text-base text-white">
                  Alertas Recentes no Brasil
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('scam-map')}
                className="text-xs font-semibold text-[#70f3ff] hover:underline cursor-pointer"
              >
                Ver mapa completo →
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-[#23262f] border border-[#323744] text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-[#dfcf93]">Falsa Central 0800 Bancária</span>
                  <span className="text-[11px] text-[#686868]">Há 15 min</span>
                </div>
                <p className="text-[#d2d2d2]">
                  Mensagens falsas de SMS avisando sobre compras de alto valor para induzir a vítima a ligar para falso 0800.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#23262f] border border-[#323744] text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-rose-400">Falso Boleto de IPVA / Correios</span>
                  <span className="text-[11px] text-[#686868]">Há 1 hora</span>
                </div>
                <p className="text-[#d2d2d2]">
                  Sites falsos gerando cobranças com chave Pix particular em vez do órgão oficial.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('community-reports')}
            className="mt-4 pt-3 border-t border-[#2a2e39] text-xs font-semibold text-[#93bfed] hover:text-white text-center w-full transition-colors cursor-pointer"
          >
            Ver todas as denúncias da comunidade →
          </button>
        </div>
      </section>

      {/* Feature Grid: Full Protective Suite */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading font-bold text-xl text-white">
              Todas as Ferramentas de Proteção
            </h3>
            <p className="text-xs sm:text-sm text-[#686868] mt-0.5">
              Escolha um módulo para acessar recursos dedicados de segurança e assistência
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {featureCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                id={`card-feature-${card.id}`}
                onClick={() => setActiveTab(card.id as ActiveTab)}
                className="group relative rounded-2xl bg-[#1b1d23] p-6 border border-[#2a2e39] hover:border-[#70f3ff]/40 hover:shadow-lg hover:shadow-[#70f3ff]/5 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-xl p-2.5 flex items-center justify-center bg-[#23262f] border border-[#323744] text-[#70f3ff] transition-transform group-hover:scale-105">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span
                      className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#23262f] text-[#93bfed] border border-[#323744]"
                    >
                      {card.tag}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-heading font-bold text-base text-white group-hover:text-[#70f3ff] transition-colors">
                      {card.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-[#d2d2d2] mt-1.5 leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[#2a2e39] flex items-center justify-between text-xs sm:text-sm font-heading font-semibold text-[#70f3ff] group-hover:text-white">
                  <span>{card.action}</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};


