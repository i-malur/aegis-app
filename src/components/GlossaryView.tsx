import React, { useState, useMemo } from 'react';
import {
  Search,
  BookOpen,
  Volume2,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
  ExternalLink,
  Bot,
  Copy,
  Check,
  Filter,
  Sparkles,
  Zap,
  ArrowRight,
  HelpCircle,
  RotateCcw,
  Tag,
  AlertTriangle,
  Radio,
  Lock,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { GlossaryTerm, ActiveTab } from '../types';
import { GLOSSARY_TERMS, GLOSSARY_CATEGORIES } from '../data/glossaryData';
import { LIA_AVATAR_IMG } from '../assets/branding';

interface GlossaryViewProps {
  setActiveTab: (tab: ActiveTab) => void;
  onAskLia: (prompt: string) => void;
}

export const GlossaryView: React.FC<GlossaryViewProps> = ({
  setActiveTab,
  onAskLia,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedLetter, setSelectedLetter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'alpha' | 'severity'>('popular');
  const [expandedTermId, setExpandedTermId] = useState<string | null>('phishing');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(['phishing', 'dois-fatores-2fa', 'golpe-do-pix']);
  const [onlyBookmarks, setOnlyBookmarks] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeViewMode, setActiveViewMode] = useState<'glossary' | 'quiz'>('glossary');

  // Quiz State
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const quizQuestions = [
    {
      question: 'Você recebe um SMS com o texto: "CORREIOS: Sua encomenda está retida por taxa pendente. Pague agora em correios-taxas.online/liberar". Qual é o tipo de ameaça?',
      options: [
        { text: 'Ataque de Força Bruta (Brute Force)', correct: false },
        { text: 'Phishing (especificamente Smishing)', correct: true },
        { text: 'SIM Swap', correct: false },
        { text: 'Zero-Day Vulnerability', correct: false },
      ],
      explanation: 'Trata-se de Phishing via SMS (Smishing), onde golpistas usam senso de urgência e um site clonado fora do domínio oficial correios.com.br para roubar pagamentos.',
      relatedTermId: 'phishing',
    },
    {
      question: 'Qual é a principal vantagem de usar Passkeys (chaves de acesso) ou aplicativos autenticadores (2FA) em relação a códigos enviados por SMS?',
      options: [
        { text: 'São imunes a golpes de SIM Swap e clonagem de chip telefônico', correct: true },
        { text: 'Funcionam apenas quando o computador está desligado', correct: false },
        { text: 'Não necessitam de biometria nem de dispositivo físico', correct: false },
        { text: 'Permitem compartilhar senhas abertamente na internet', correct: false },
      ],
      explanation: 'Códigos por SMS podem ser interceptados se o criminoso clonar sua linha (SIM Swap). Passkeys e apps autenticadores (TOTP) ficam no seu aparelho físico e não dependem da operadora de telefonia.',
      relatedTermId: 'dois-fatores-2fa',
    },
    {
      question: 'O que o Mecanismo Especial de Devolução (MED) do Banco Central permite fazer?',
      options: [
        { text: 'Bloquear e contestar compras feitas apenas com cartão de crédito internacional', correct: false },
        { text: 'Acionar o banco recebedor para estornar e bloquear saldos de Pix decorrentes de fraude ou golpe', correct: true },
        { text: 'Aumentar o limite diário de transferência noturna sem autorização', correct: false },
        { text: 'Recuperar senhas esquecidas em redes sociais', correct: false },
      ],
      explanation: 'O MED é a regra oficial do Banco Central que permite ao seu banco abrir uma notificação de infração e bloquear cautelarmente valores de fraude na conta de destino.',
      relatedTermId: 'golpe-do-pix',
    },
    {
      question: 'Por que ter o ícone de "cadeado" (HTTPS) na barra do navegador NÃO garante 100% que um site seja confiável?',
      options: [
        { text: 'Porque o HTTPS foi descontinuado mundialmente', correct: false },
        { text: 'O HTTPS garante que a conexão é criptografada, mas golpistas também podem emitir certificados HTTPS para sites falsos', correct: true },
        { text: 'Porque o cadeado só funciona em computadores desktop', correct: false },
        { text: 'O HTTPS só serve para sites de e-commerce norte-americanos', correct: false },
      ],
      explanation: 'O HTTPS criptografa o tráfego de dados, mas criminosos também colocam certificados SSL em seus sites de phishing. Sempre verifique o endereço e domínio exato!',
      relatedTermId: 'https-ssl',
    },
    {
      question: 'Se seu computador sofrer um ataque de Ransomware e todos os arquivos forem criptografados, qual é a conduta recomendada?',
      options: [
        { text: 'Pagar o resgate imediatamente na esperança de receber a chave', correct: false },
        { text: 'Isolar a máquina da rede, restaurar backups offline seguros e nunca pagar o resgate', correct: true },
        { text: 'Formatar o roteador Wi-Fi e continuar usando os arquivos criptografados', correct: false },
        { text: 'Divulgar as senhas da empresa para os criminosos', correct: false },
      ],
      explanation: 'Especialistas e autoridades recomendam nunca pagar o resgate: o pagamento não garante a devolução dos dados e financia o crime organizado. A prevenção é ter backups isolados (offline).',
      relatedTermId: 'ransomware',
    },
  ];

  // Available Alphabet letters from terms
  const alphabet = useMemo(() => {
    const letters = new Set<string>();
    GLOSSARY_TERMS.forEach((t) => {
      const firstChar = t.term.charAt(0).toUpperCase();
      if (/[A-Z]/.test(firstChar)) {
        letters.add(firstChar);
      }
    });
    return Array.from(letters).sort();
  }, []);

  // Filtered and Sorted Terms
  const filteredTerms = useMemo(() => {
    return GLOSSARY_TERMS.filter((term) => {
      // Bookmark filter
      if (onlyBookmarks && !bookmarkedIds.includes(term.id)) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && term.category !== selectedCategory) {
        return false;
      }

      // Severity filter
      if (selectedSeverity !== 'all' && term.severity !== selectedSeverity) {
        return false;
      }

      // Alphabet filter
      if (selectedLetter !== 'all' && !term.term.toUpperCase().startsWith(selectedLetter)) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTerm = term.term.toLowerCase().includes(query);
        const matchesShort = term.shortDefinition.toLowerCase().includes(query);
        const matchesFull = term.fullDefinition.toLowerCase().includes(query);
        const matchesExample = term.example.toLowerCase().includes(query);
        const matchesAliases = term.aliases?.some((a) => a.toLowerCase().includes(query));
        const matchesScenario = term.realWorldScenario.toLowerCase().includes(query);

        return matchesTerm || matchesShort || matchesFull || matchesExample || matchesAliases || matchesScenario;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'alpha') {
        return a.term.localeCompare(b.term);
      }
      if (sortBy === 'severity') {
        const severityRank = { critical: 3, high: 2, medium: 1, info: 0 };
        return (severityRank[b.severity || 'info'] || 0) - (severityRank[a.severity || 'info'] || 0);
      }
      // Popular first, then alpha
      if (a.popularSearch && !b.popularSearch) return -1;
      if (!a.popularSearch && b.popularSearch) return 1;
      return a.term.localeCompare(b.term);
    });
  }, [searchQuery, selectedCategory, selectedSeverity, selectedLetter, sortBy, onlyBookmarks, bookmarkedIds]);

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCopyDefinition = (term: GlossaryTerm, e: React.MouseEvent) => {
    e.stopPropagation();
    const textToCopy = `[Aegis Glossário de Segurança] ${term.term}\n\nDefinição: ${term.shortDefinition}\n\nExemplo Prático: ${term.example}\n\nComo se proteger:\n${term.howToProtect.map((p) => `• ${p}`).join('\n')}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(term.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handlePronounce = (term: GlossaryTerm, e: React.MouseEvent) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(term.term);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSelectRelatedTerm = (relatedId: string) => {
    const target = GLOSSARY_TERMS.find((t) => t.id === relatedId || t.relatedTerms.includes(relatedId));
    if (target) {
      setExpandedTermId(target.id);
      setSelectedCategory('all');
      setSelectedSeverity('all');
      setSelectedLetter('all');
      setSearchQuery('');
      // Scroll to element
      setTimeout(() => {
        const el = document.getElementById(`term-card-${target.id}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  };

  const handleQuizAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    setShowExplanation(true);
    if (quizQuestions[quizIndex].options[index].correct) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (quizIndex < quizQuestions.length - 1) {
      setQuizIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    setQuizIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setQuizScore(0);
    setQuizCompleted(false);
  };

  const getSeverityBadge = (severity?: string) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="text-xs font-semibold bg-rose-950/60 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded-md flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-rose-400" />
            Crítico
          </span>
        );
      case 'high':
        return (
          <span className="text-xs font-semibold bg-amber-950/60 text-[#dfcf93] border border-[#dfcf93]/40 px-2 py-0.5 rounded-md flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-[#dfcf93]" />
            Alto Risco
          </span>
        );
      case 'medium':
        return (
          <span className="text-xs font-semibold bg-[#3a6ea5]/20 text-[#70f3ff] border border-[#70f3ff]/30 px-2 py-0.5 rounded-md">
            Moderado
          </span>
        );
      default:
        return (
          <span className="text-xs font-semibold bg-[#14151a] text-[#d2d2d2] border border-[#2a2e39] px-2 py-0.5 rounded-md">
            Informativo
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Top Banner / Header */}
      <section className="bg-[#1b1d23] border border-[#2a2e39] rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#2a2e39]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3a6ea5]/20 border border-[#70f3ff]/30 text-[#70f3ff] text-xs font-semibold mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Base de Conhecimento Antifraude</span>
            </div>
            <h2 className="font-heading font-bold text-2xl text-white tracking-tight">
              Glossário Interativo de Cibersegurança
            </h2>
            <p className="text-xs sm:text-sm text-[#94a3b8] mt-1 max-w-2xl leading-relaxed">
              Dicionário prático com termos essenciais, pronúncias em áudio, exemplos reais do cotidiano brasileiro e diretrizes de defesa digital.
            </p>
          </div>

          {/* View Mode Toggle: Glossário vs Quiz */}
          <div className="flex items-center bg-[#14151a] p-1 rounded-xl border border-[#2a2e39] self-start md:self-auto shrink-0">
            <button
              onClick={() => setActiveViewMode('glossary')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-heading font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeViewMode === 'glossary'
                  ? 'bg-[#3a6ea5] text-white shadow-2xs'
                  : 'text-[#686868] hover:text-[#d2d2d2]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Termos & Conceitos
            </button>
            <button
              onClick={() => setActiveViewMode('quiz')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-heading font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeViewMode === 'quiz'
                  ? 'bg-[#3a6ea5] text-white shadow-2xs'
                  : 'text-[#686868] hover:text-[#d2d2d2]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#dfcf93]" />
              Desafio (Quiz)
            </button>
          </div>
        </div>

        {/* Quick Highlights / Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs font-sans">
          <div className="bg-[#14151a] p-3 rounded-xl border border-[#2a2e39] flex items-center justify-between">
            <span className="text-[#686868]">Base Total:</span>
            <span className="font-bold text-white">{GLOSSARY_TERMS.length} Termos</span>
          </div>
          <div className="bg-[#14151a] p-3 rounded-xl border border-[#2a2e39] flex items-center justify-between">
            <span className="text-[#686868]">Categorias:</span>
            <span className="font-bold text-[#70f3ff]">4 Módulos</span>
          </div>
          <div className="bg-[#14151a] p-3 rounded-xl border border-[#2a2e39] flex items-center justify-between">
            <span className="text-[#686868]">Ameaças Críticas:</span>
            <span className="font-bold text-rose-400">
              {GLOSSARY_TERMS.filter((t) => t.severity === 'critical').length} Catalogadas
            </span>
          </div>
          <div className="bg-[#14151a] p-3 rounded-xl border border-[#2a2e39] flex items-center justify-between">
            <span className="text-[#686868]">Seus Salvos:</span>
            <span className="font-bold text-[#dfcf93]">{bookmarkedIds.length} Favoritos</span>
          </div>
        </div>
      </section>

      {/* QUIZ MODE VIEW */}
      {activeViewMode === 'quiz' && (
        <section className="bg-[#1b1d23] border border-[#2a2e39] rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-[#2a2e39]">
            <div>
              <span className="text-xs uppercase font-semibold text-[#70f3ff]">
                TESTE SEU CONHECIMENTO ANTIFRAUDE
              </span>
              <h3 className="font-heading font-bold text-lg text-white mt-0.5">
                Desafio de Cibersegurança
              </h3>
            </div>
            {!quizCompleted && (
              <span className="text-xs font-medium bg-[#14151a] px-3 py-1 rounded-full border border-[#2a2e39] text-[#d2d2d2]">
                Questão {quizIndex + 1} de {quizQuestions.length}
              </span>
            )}
          </div>

          {!quizCompleted ? (
            <div className="space-y-5">
              {/* Question text */}
              <div className="bg-[#14151a] p-4 sm:p-5 rounded-xl border border-[#2a2e39]">
                <p className="text-sm sm:text-base text-white font-medium leading-relaxed">
                  {quizQuestions[quizIndex].question}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {quizQuestions[quizIndex].options.map((option, idx) => {
                  const isSelected = selectedAnswer === idx;
                  const isCorrect = option.correct;
                  let optionStyle = 'bg-[#14151a] border-[#2a2e39] hover:border-[#70f3ff]/50 text-[#d2d2d2]';

                  if (selectedAnswer !== null) {
                    if (isCorrect) {
                      optionStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-semibold';
                    } else if (isSelected && !isCorrect) {
                      optionStyle = 'bg-rose-950/60 border-rose-500 text-rose-200';
                    } else {
                      optionStyle = 'bg-[#14151a] border-[#2a2e39] text-[#686868] opacity-50';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleQuizAnswer(idx)}
                      disabled={selectedAnswer !== null}
                      className={`w-full text-left p-3.5 sm:p-4 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer ${optionStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-[#23262f] border border-[#323744] flex items-center justify-center text-xs font-bold text-[#70f3ff] shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{option.text}</span>
                      </div>
                      {selectedAnswer !== null && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Card */}
              {showExplanation && (
                <div className="bg-[#3a6ea5]/20 p-4 rounded-xl border border-[#70f3ff]/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#70f3ff] flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#dfcf93]" />
                      Explicação do Especialista:
                    </span>
                    <button
                      onClick={() => {
                        setActiveViewMode('glossary');
                        handleSelectRelatedTerm(quizQuestions[quizIndex].relatedTermId);
                      }}
                      className="text-xs text-[#70f3ff] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      Ver no glossário <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-[#d2d2d2] leading-relaxed">
                    {quizQuestions[quizIndex].explanation}
                  </p>
                </div>
              )}

              {/* Action Button */}
              {selectedAnswer !== null && (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleNextQuestion}
                    className="px-6 py-2.5 rounded-xl bg-[#3a6ea5] hover:bg-[#3a6ea5]/80 text-white font-heading font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-xs cursor-pointer"
                  >
                    <span>
                      {quizIndex < quizQuestions.length - 1 ? 'Próxima Questão' : 'Ver Resultado Final'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Quiz Completed Results */
            <div className="text-center py-8 space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-950/60 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-400">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-xl sm:text-2xl text-white">
                  Desafio Concluído!
                </h4>
                <p className="text-sm text-[#94a3b8] mt-1">
                  Você acertou <strong className="text-[#70f3ff]">{quizScore}</strong> de{' '}
                  <strong className="text-white">{quizQuestions.length}</strong> questões ({((quizScore / quizQuestions.length) * 100).toFixed(0)}%).
                </p>
              </div>

              <div className="p-4 bg-[#14151a] rounded-xl border border-[#2a2e39] max-w-md mx-auto text-xs text-[#d2d2d2] leading-relaxed text-left">
                {quizScore >= 4 ? (
                  <p className="text-emerald-300 font-semibold">
                    Excelente! Seu nível de conscientização e reflexos de defesa cibernética estão afiados. Continue consultando o glossário para se manter atualizado.
                  </p>
                ) : (
                  <p className="text-[#dfcf93]">
                    Bom esforço! Recomendamos revisar os termos de Phishing, Golpe do Pix e Autenticação em 2 Fatores no Glossário para blindar seu dia a dia.
                  </p>
                )}
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={resetQuiz}
                  className="px-5 py-2.5 rounded-xl bg-[#14151a] hover:bg-[#23262f] text-[#d2d2d2] border border-[#2a2e39] text-xs font-semibold flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Tentar Novamente
                </button>
                <button
                  onClick={() => setActiveViewMode('glossary')}
                  className="px-5 py-2.5 rounded-xl bg-[#3a6ea5] hover:bg-[#3a6ea5]/80 text-white text-xs font-semibold flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Explorar Glossário Completo
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* GLOSSARY MAIN VIEW */}
      {activeViewMode === 'glossary' && (
        <>
          {/* Search, Filter & Alphabet Bar */}
          <section className="bg-[#1b1d23] border border-[#2a2e39] rounded-2xl p-5 space-y-4 shadow-xl">
            {/* Primary Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#686868] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="glossary-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Busque por termo, conceito ou exemplo (ex: Phishing, Ransomware, Pix, 2FA, VPN)..."
                className="w-full bg-[#14151a] border border-[#323744] focus:border-[#70f3ff] rounded-xl pl-10 pr-10 py-2.5 text-sm text-[#d2d2d2] placeholder-[#686868] outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#686868] hover:text-[#d2d2d2] px-1.5 py-0.5 bg-[#23262f] rounded-md cursor-pointer"
                >
                  Limpar
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
              <span className="text-[#686868] text-xs font-semibold uppercase shrink-0 mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3 text-[#70f3ff]" /> Categoria:
              </span>
              {GLOSSARY_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setSelectedLetter('all');
                  }}
                  className={`px-3 py-1.5 rounded-xl font-heading font-medium whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-[#3a6ea5] text-white shadow-2xs'
                      : 'bg-[#14151a] text-[#d2d2d2] hover:bg-[#23262f] border border-[#2a2e39]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}

              <button
                onClick={() => setOnlyBookmarks(!onlyBookmarks)}
                className={`ml-auto px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  onlyBookmarks
                    ? 'bg-[#dfcf93] text-[#1b1d23] font-semibold'
                    : 'bg-[#dfcf93]/10 text-[#dfcf93] hover:bg-[#dfcf93]/20 border border-[#dfcf93]/30'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Salvos ({bookmarkedIds.length})</span>
              </button>
            </div>

            {/* Sub-Filters: A-Z Alphabet Bar & Severity Sort */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-[#2a2e39]">
              {/* Alphabet Quick Jump */}
              <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-1 scrollbar-none">
                <span className="text-xs text-[#686868] mr-1 shrink-0">A-Z:</span>
                <button
                  onClick={() => setSelectedLetter('all')}
                  className={`px-2 py-0.5 rounded-md text-xs font-semibold cursor-pointer ${
                    selectedLetter === 'all'
                      ? 'bg-[#3a6ea5] text-white'
                      : 'bg-[#14151a] text-[#686868] hover:bg-[#23262f] border border-[#2a2e39]'
                  }`}
                >
                  TODOS
                </button>
                {alphabet.map((letter) => (
                  <button
                    key={letter}
                    onClick={() => setSelectedLetter(letter)}
                    className={`w-6 h-6 rounded-md text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer ${
                      selectedLetter === letter
                        ? 'bg-[#3a6ea5] text-white'
                        : 'bg-[#14151a] text-[#686868] hover:bg-[#23262f] border border-[#2a2e39]'
                    }`}
                  >
                    {letter}
                  </button>
                ))}
              </div>

              {/* Sort Order Selector */}
              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 text-xs">
                <span className="text-[#686868]">Ordenar:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-[#14151a] border border-[#323744] rounded-lg px-2.5 py-1 text-xs text-[#d2d2d2] outline-none focus:border-[#70f3ff]"
                >
                  <option value="popular">Mais Relevantes / Populares</option>
                  <option value="alpha">Ordem Alfabética (A-Z)</option>
                  <option value="severity">Maior Gravidade de Risco</option>
                </select>
              </div>
            </div>
          </section>

          {/* Results Summary Bar */}
          <div className="flex items-center justify-between text-xs text-[#686868] px-1">
            <span>
              Mostrando <strong className="text-white">{filteredTerms.length}</strong> de{' '}
              {GLOSSARY_TERMS.length} termos
              {searchQuery && ` para "${searchQuery}"`}
              {selectedCategory !== 'all' && ` em [${selectedCategory}]`}
              {selectedLetter !== 'all' && ` iniciando com "${selectedLetter}"`}
            </span>
            {(searchQuery || selectedCategory !== 'all' || selectedLetter !== 'all' || onlyBookmarks) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedLetter('all');
                  setSelectedSeverity('all');
                  setOnlyBookmarks(false);
                }}
                className="text-[#70f3ff] hover:underline font-semibold text-xs cursor-pointer"
              >
                Resetar Filtros
              </button>
            )}
          </div>

          {/* Term Cards List */}
          {filteredTerms.length === 0 ? (
            <div className="bg-[#1b1d23] border border-[#2a2e39] rounded-2xl p-12 text-center space-y-4 shadow-xl">
              <HelpCircle className="w-12 h-12 text-[#686868] mx-auto" />
              <div>
                <h3 className="font-heading font-bold text-base text-white">
                  Nenhum termo correspondente encontrado
                </h3>
                <p className="text-xs text-[#686868] mt-1 max-w-md mx-auto">
                  Não encontramos resultados para sua busca atual. Tente outro termo ou pergunte diretamente para nossa IA Especialista Lia.
                </p>
              </div>
              <button
                onClick={() => onAskLia(`O que significa "${searchQuery}" em segurança digital?`)}
                className="px-5 py-2 rounded-xl bg-[#3a6ea5] hover:bg-[#3a6ea5]/80 text-white text-xs font-heading font-semibold inline-flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Bot className="w-4 h-4 text-[#70f3ff]" />
                Perguntar sobre "{searchQuery}" para a Lia IA
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTerms.map((term) => {
                const isExpanded = expandedTermId === term.id;
                const isBookmarked = bookmarkedIds.includes(term.id);

                return (
                  <div
                    key={term.id}
                    id={`term-card-${term.id}`}
                    className={`bg-[#1b1d23] border rounded-2xl transition-all duration-200 shadow-xl ${
                      isExpanded
                        ? 'border-[#70f3ff]/50 ring-2 ring-[#70f3ff]/10'
                        : 'border-[#2a2e39] hover:border-[#323744]'
                    }`}
                  >
                    {/* Collapsed Header Bar (Clickable) */}
                    <div
                      onClick={() => setExpandedTermId(isExpanded ? null : term.id)}
                      className="p-5 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start sm:items-center gap-3">
                        {/* Status Icon */}
                        <div className="w-10 h-10 rounded-xl bg-[#14151a] border border-[#2a2e39] flex items-center justify-center shrink-0">
                          {term.category === 'threats' ? (
                            <ShieldAlert className="w-5 h-5 text-rose-400" />
                          ) : term.category === 'scams' ? (
                            <AlertTriangle className="w-5 h-5 text-[#dfcf93]" />
                          ) : term.category === 'defense' ? (
                            <ShieldCheck className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <Lock className="w-5 h-5 text-[#70f3ff]" />
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-heading font-bold text-base text-white hover:text-[#70f3ff] transition-colors">
                              {term.term}
                            </h3>

                            {/* Pronunciation button */}
                            {term.pronunciation && (
                              <button
                                type="button"
                                onClick={(e) => handlePronounce(term, e)}
                                title="Ouvir pronúncia"
                                className="text-xs font-mono text-[#686868] hover:text-[#70f3ff] bg-[#14151a] px-2 py-0.5 rounded-md border border-[#2a2e39] flex items-center gap-1 cursor-pointer"
                              >
                                <Volume2 className="w-3 h-3 text-[#70f3ff]" />
                                <span>/{term.pronunciation}/</span>
                              </button>
                            )}

                            {getSeverityBadge(term.severity)}

                            {term.popularSearch && (
                              <span className="text-xs font-semibold bg-[#dfcf93]/20 text-[#dfcf93] border border-[#dfcf93]/30 px-2 py-0.5 rounded-md">
                                POPULAR
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-[#94a3b8] mt-1 leading-relaxed line-clamp-2">
                            {term.shortDefinition}
                          </p>
                        </div>
                      </div>

                      {/* Right controls: Bookmark, Copy, Expand Indicator */}
                      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                        <button
                          type="button"
                          onClick={(e) => toggleBookmark(term.id, e)}
                          title={isBookmarked ? 'Remover dos favoritos' : 'Salvar termo'}
                          className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                            isBookmarked
                              ? 'bg-[#dfcf93]/20 border-[#dfcf93]/40 text-[#dfcf93]'
                              : 'bg-[#14151a] border-[#2a2e39] text-[#686868] hover:text-[#d2d2d2]'
                          }`}
                        >
                          <Bookmark className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleCopyDefinition(term, e)}
                          title="Copiar definição e dicas"
                          className="p-2 rounded-xl bg-[#14151a] border border-[#2a2e39] text-[#686868] hover:text-[#70f3ff] transition-colors cursor-pointer"
                        >
                          {copiedId === term.id ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>

                        <div className="w-8 h-8 rounded-xl bg-[#14151a] border border-[#2a2e39] flex items-center justify-center text-[#686868]">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Detailed Section */}
                    {isExpanded && (
                      <div className="px-5 pb-6 pt-2 border-t border-[#2a2e39] space-y-5 text-xs text-[#d2d2d2]">
                        {/* Full Detailed Explanation */}
                        <div>
                          <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-[#70f3ff] mb-1.5 flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5" />
                            Explicação Aprofundada
                          </h4>
                          <p className="text-sm text-[#d2d2d2] leading-relaxed bg-[#14151a] p-4 rounded-xl border border-[#2a2e39]">
                            {term.fullDefinition}
                          </p>
                        </div>

                        {/* Practical Example vs Real World Brazil Scenario */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Practical Example Box */}
                          <div className="bg-[#14151a] p-4 rounded-xl border border-[#2a2e39] flex flex-col justify-between">
                            <div>
                              <span className="text-xs font-bold uppercase tracking-wider text-[#70f3ff] block mb-1">
                                Exemplo Prático Simulado
                              </span>
                              <p className="text-xs text-[#94a3b8] leading-relaxed italic">
                                "{term.example}"
                              </p>
                            </div>
                            <div className="mt-3 pt-2 border-t border-[#2a2e39] flex items-center gap-1.5 text-xs text-[#686868]">
                              <Zap className="w-3 h-3 text-[#dfcf93]" />
                              <span>Situação rotineira em e-mails e redes</span>
                            </div>
                          </div>

                          {/* Real World Brazil Scenario Box */}
                          <div className="bg-[#14151a] p-4 rounded-xl border border-[#2a2e39] flex flex-col justify-between">
                            <div>
                              <span className="text-xs font-bold uppercase tracking-wider text-[#dfcf93] block mb-1">
                                Cenário Real Registrado no Brasil
                              </span>
                              <p className="text-xs text-[#94a3b8] leading-relaxed">
                                {term.realWorldScenario}
                              </p>
                            </div>
                            <div className="mt-3 pt-2 border-t border-[#2a2e39] flex items-center gap-1.5 text-xs text-[#686868]">
                              <Radio className="w-3 h-3 text-rose-400" />
                              <span>Golpe reportado com frequência</span>
                            </div>
                          </div>
                        </div>

                        {/* How To Protect Checklist */}
                        <div className="bg-[#14151a] p-4 rounded-xl border border-[#2a2e39] space-y-2.5">
                          <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-white flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            Como se Proteger:
                          </h4>
                          <div className="space-y-2">
                            {term.howToProtect.map((step, idx) => (
                              <div key={idx} className="flex items-start gap-2.5 text-xs text-[#d2d2d2]">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                                <span>{step}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Related Terms & Aliases */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#2a2e39]">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs text-[#686868] font-semibold">
                              Termos Relacionados:
                            </span>
                            {term.relatedTerms.map((relId) => {
                              const relatedObj = GLOSSARY_TERMS.find((t) => t.id === relId);
                              return (
                                <button
                                  key={relId}
                                  type="button"
                                  onClick={() => handleSelectRelatedTerm(relId)}
                                  className="px-2.5 py-1 rounded-lg bg-[#23262f] hover:bg-[#3a6ea5]/30 text-[#d2d2d2] hover:text-[#70f3ff] border border-[#323744] text-xs transition-colors cursor-pointer"
                                >
                                  #{relatedObj ? relatedObj.term.split(' ')[0] : relId}
                                </button>
                              );
                            })}
                          </div>

                          {/* Quick Actions with Lia AI or Scanner */}
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                onAskLia(
                                  `Lia, pode me dar mais detalhes práticos e me ensinar como me proteger do perigo de ${term.term}?`
                                )
                              }
                              className="px-3 py-1.5 rounded-xl bg-[#3a6ea5] hover:bg-[#3a6ea5]/80 text-white font-heading font-semibold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                            >
                              <div className="w-4 h-4 rounded-full overflow-hidden shrink-0 border border-[#dfcf93]/40">
                                <img
                                  src={LIA_AVATAR_IMG}
                                  alt="Lia"
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              Tirar Dúvida com Lia IA
                            </button>

                            {(term.id === 'phishing' || term.id === 'boleto-adulterado' || term.id === 'smishing-vishing') && (
                              <button
                                type="button"
                                onClick={() => setActiveTab('scanner')}
                                className="px-3 py-1.5 rounded-xl bg-[#14151a] hover:bg-[#23262f] text-[#d2d2d2] border border-[#2a2e39] font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                              >
                                <ExternalLink className="w-3 h-3 text-[#70f3ff]" />
                                Abrir Scanner
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};
