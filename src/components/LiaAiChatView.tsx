import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  HelpCircle,
  Volume2,
  VolumeX,
  RotateCcw,
  User,
  ArrowRight,
  Lightbulb,
  CheckCircle2,
} from 'lucide-react';
import { ChatMessage } from '../types';
import { LIA_AVATAR_IMG } from '../assets/branding';

interface LiaAiChatViewProps {
  onOpenSOS: () => void;
  initialQuery?: string;
}

export const LiaAiChatView: React.FC<LiaAiChatViewProps> = ({
  onOpenSOS,
  initialQuery,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: `Olá! Eu sou a **Lia**, sua assistente de segurança digital do Aegis. 🛡️\n\nEstou aqui para tirar dúvidas com linguagem simples, analisar se uma mensagem ou situação é golpe e te orientar passo a passo sobre como proteger seu dinheiro, suas contas e sua família.\n\nComo posso te ajudar hoje?`,
      timestamp: 'Agora',
      suggestedActions: [
        'Como saber se um e-mail é falso?',
        'O que fazer se caí num golpe do Pix?',
        'Recebi uma ligação do banco sobre compra suspeita',
        'Simular um teste de golpe para treinar',
      ],
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      handleSendMessage(initialQuery);
    }
  }, [initialQuery]);

  const speakText = (text: string) => {
    if (!speechEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_`]/g, '').slice(0, 300);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.05;
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          conversationHistory: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();
      const replyText =
        data.reply ||
        'Não foi possível obter a resposta no momento. Em caso de golpe, acione imediatamente o seu banco e a delegacia eletrônica.';

      const liaMessage: ChatMessage = {
        id: `lia-${Date.now()}`,
        role: 'assistant',
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, liaMessage]);
      speakText(replyText);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `Tive uma oscilação na conexão. Mas lembre-se: nunca compartilhe senhas, e se sofreu golpe, ligue imediatamente para o SAC do seu banco solicitando o MED do Pix!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const quickScenarios = [
    {
      title: '🚨 Fui Vítima de Golpe',
      prompt: 'Sofri um golpe financeiro agora há pouco! O que devo fazer imediatamente passo a passo?',
    },
    {
      title: '📞 Ligação de Compra Falsa',
      prompt: 'Recebi uma ligação dizendo que foi aprovada uma compra de 3 mil reais no meu cartão e mandaram digitar 2 para cancelar. Isso é golpe?',
    },
    {
      title: '📦 SMS de Taxa dos Correios',
      prompt: 'Recebi um SMS com link dizendo que meu pedido dos Correios foi retido na alfândega e preciso pagar taxa Pix. É seguro?',
    },
    {
      title: '📱 WhatsApp "Troquei de Número"',
      prompt: 'Uma pessoa me mandou mensagem com a foto do meu filho dizendo que trocou de número e precisa de um Pix urgente. Como confirmar?',
    },
    {
      title: '🎯 Testar Simulador de Golpes',
      prompt: 'Lia, me apresente uma situação de teste de um golpe comum e veja se eu consigo identificar se é fraude ou seguro!',
    },
  ];

  return (
    <div className="h-[calc(100vh-12rem)] min-h-[580px] flex flex-col bg-[#1b1d23] rounded-2xl border border-[#2a2e39] overflow-hidden shadow-xl">
      {/* Lia Header Bar */}
      <div className="bg-[#1b1d23] p-4 sm:p-5 border-b border-[#2a2e39] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-[#dfcf93]/50 shadow-md shrink-0 bg-[#23262f]">
            <img
              src={LIA_AVATAR_IMG}
              alt="Lia Avatar"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-[#1b1d23]" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-white text-base sm:text-lg">
              Lia Assistente
            </h2>
            <p className="text-xs text-[#94a3b8]">
              Orientação instantânea 24h com linguagem acessível e clara
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* TTS Toggle */}
          <button
            onClick={() => {
              if (speechEnabled && window.speechSynthesis) {
                window.speechSynthesis.cancel();
              }
              setSpeechEnabled(!speechEnabled);
            }}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              speechEnabled
                ? 'bg-[#3a6ea5]/30 text-[#70f3ff] border-[#70f3ff]/40'
                : 'bg-[#23262f] text-[#d2d2d2] border-[#323744] hover:bg-[#2a2e39]'
            }`}
            title={speechEnabled ? 'Desativar voz da Lia' : 'Ativar leitura por voz'}
          >
            {speechEnabled ? <Volume2 className="w-4 h-4 text-[#70f3ff]" /> : <VolumeX className="w-4 h-4 text-[#686868]" />}
            <span className="hidden sm:inline">
              {speechEnabled ? 'Voz Ativa' : 'Voz'}
            </span>
          </button>

          <button
            onClick={() => {
              setMessages([
                {
                  id: 'welcome-reset',
                  role: 'assistant',
                  content: `Conversa reiniciada! Como posso te ajudar a se proteger hoje? 🛡️`,
                  timestamp: 'Agora',
                },
              ]);
            }}
            className="p-2 rounded-xl bg-[#23262f] text-[#d2d2d2] hover:text-white hover:bg-[#2a2e39] border border-[#323744] transition-colors cursor-pointer"
            title="Limpar histórico da conversa"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preset Topics Bar */}
      <div className="bg-[#14151a] px-4 py-2.5 border-b border-[#2a2e39] overflow-x-auto scrollbar-none flex items-center gap-2">
        <span className="text-xs font-semibold text-[#686868] shrink-0 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#70f3ff]" />
          Dúvidas frequentes:
        </span>
        {quickScenarios.map((sc, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(sc.prompt)}
            className="px-3 py-1 rounded-full bg-[#23262f] hover:bg-[#2a2e39] text-[#d2d2d2] hover:text-white border border-[#323744] text-xs font-medium whitespace-nowrap transition-colors cursor-pointer"
          >
            {sc.title}
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#14151a]">
        {messages.map((msg) => {
          const isLia = msg.role === 'assistant';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                isLia ? 'justify-start' : 'justify-end'
              }`}
            >
              {isLia && (
                <div className="w-8 h-8 rounded-full overflow-hidden border border-[#dfcf93]/40 shrink-0 mt-1 shadow-sm bg-[#23262f]">
                  <img
                    src={LIA_AVATAR_IMG}
                    alt="Lia"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div
                className={`max-w-xl sm:max-w-2xl rounded-2xl p-4 sm:p-5 space-y-2 text-sm leading-relaxed ${
                  isLia
                    ? 'bg-[#1b1d23] text-[#d2d2d2] border border-[#2a2e39] shadow-md'
                    : 'bg-[#3a6ea5] text-white font-normal ml-8 shadow-md'
                }`}
              >
                <div className={`flex items-center justify-between text-xs pb-1.5 border-b ${
                  isLia ? 'border-[#2a2e39] text-[#686868]' : 'border-blue-400/40 text-blue-100'
                }`}>
                  <span className="font-semibold text-[#70f3ff]">
                    {isLia ? 'Lia • Especialista' : 'Você'}
                  </span>
                  <span className="text-[#FFFFFF]">{msg.timestamp}</span>
                </div>

                {/* Content with basic formatting */}
                <div className="whitespace-pre-wrap space-y-2 text-[#d2d2d2]">
                  {msg.content.split('\n\n').map((paragraph, pIdx) => {
                    const formatted = paragraph.replace(
                      /\*\*(.*?)\*\*/g,
                      '<strong class="font-semibold text-white">$1</strong>'
                    );
                    return (
                      <p
                        key={pIdx}
                        dangerouslySetInnerHTML={{ __html: formatted }}
                      />
                    );
                  })}
                </div>

                {/* Suggested actions if present */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="pt-3 border-t border-[#2a2e39] mt-2 space-y-2">
                    <p className="text-xs font-semibold text-[#dfcf93]">
                      Perguntas sugeridas:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.suggestedActions.map((act, aIdx) => (
                        <button
                          key={aIdx}
                          onClick={() => handleSendMessage(act)}
                          className="text-xs px-3 py-1 rounded-lg bg-[#23262f] hover:bg-[#2a2e39] text-[#93bfed] border border-[#323744] text-left transition-colors cursor-pointer font-medium"
                        >
                          {act} →
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {!isLia && (
                <div className="w-8 h-8 rounded-xl bg-[#23262f] text-white border border-[#323744] shrink-0 mt-1 flex items-center justify-center shadow-xs">
                  <User className="w-4 h-4 text-[#70f3ff]" />
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start gap-3 justify-start animate-fade-in">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-[#dfcf93]/50 shrink-0 bg-[#23262f] animate-pulse">
              <img
                src={LIA_AVATAR_IMG}
                alt="Lia"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="bg-[#1b1d23] p-4 rounded-2xl border border-[#2a2e39] flex items-center gap-2.5 text-xs text-[#d2d2d2] shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#70f3ff] animate-ping" />
              <span>Lia está redigindo a orientação...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Bar */}
      <div className="p-3 sm:p-4 bg-[#1b1d23] border-t border-[#2a2e39]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua dúvida ou cole uma mensagem suspeita..."
              className="w-full bg-[#14151a] border border-[#323744] focus:border-[#70f3ff] rounded-xl px-4 py-3 text-sm text-[#d2d2d2] placeholder-[#686868] outline-none transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-5 py-3 rounded-xl bg-[#3a6ea5] hover:bg-[#3a6ea5]/80 disabled:opacity-40 text-white font-heading font-semibold text-sm shrink-0 flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Enviar</span>
          </button>
        </form>
      </div>
    </div>
  );
};

