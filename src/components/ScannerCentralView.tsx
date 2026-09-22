import React, { useState } from 'react';
import {
  Search,
  Upload,
  Link as LinkIcon,
  MessageSquare,
  Mail,
  FileCode,
  AlertOctagon,
  ShieldCheck,
  AlertTriangle,
  FileText,
  X,
  Sparkles,
  Zap,
  CheckCircle,
  Copy,
  ExternalLink,
  QrCode,
  ShieldAlert,
} from 'lucide-react';
import { ScannerCategory, ScanResult } from '../types';

interface ScannerCentralViewProps {
  initialScanText?: string;
  onOpenSOS: () => void;
  onReportFraud?: (reportData: any) => void;
}

export const ScannerCentralView: React.FC<ScannerCentralViewProps> = ({
  initialScanText = '',
  onOpenSOS,
  onReportFraud,
}) => {
  const [activeCategory, setActiveCategory] = useState<ScannerCategory>('link');
  const [textContent, setTextContent] = useState(initialScanText);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const categories = [
    {
      id: 'link',
      label: 'Links & Sites',
      icon: LinkIcon,
      placeholder: 'Cole a URL suspeita (ex: https://rastreio-correios-taxa.site) ou anexe uma captura de tela...',
      hint: 'Verifica domínios falsos, downloads suspeitos e páginas falsas de banco.',
    },
    {
      id: 'sms',
      label: 'Mensagens & WhatsApp',
      icon: MessageSquare,
      placeholder: 'Cole a mensagem recebida via WhatsApp, SMS ou direct do Instagram...',
      hint: 'Detecta golpes de falso parente ("troquei de número"), ofertas falsas e premiações.',
    },
    {
      id: 'email',
      label: 'E-mails Suspeitos',
      icon: Mail,
      placeholder: 'Cole o conteúdo do e-mail recebido, remetente ou anexe o print completo...',
      hint: 'Analisa falsificação de remetente, ameaças de bloqueio de conta e cobranças falsas.',
    },
    {
      id: 'boleto',
      label: 'Boletos & QR Code Pix',
      icon: QrCode,
      placeholder: 'Cole a linha digitável do boleto, código Copia e Cola do Pix ou anexe o PDF...',
      hint: 'Identifica adulterações no código de barras ou destinatários divergentes.',
    },
  ] as const;

  const handleFileChange = (file: File) => {
    setSelectedFile(file);
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const runAnalysis = async () => {
    if (!textContent.trim() && !selectedFile && !previewImage) return;

    setIsAnalyzing(true);
    setScanResult(null);

    try {
      let imageBase64: string | undefined;
      let mimeType: string | undefined;

      if (selectedFile && previewImage) {
        imageBase64 = previewImage;
        mimeType = selectedFile.type;
      }

      const response = await fetch('/api/analyze-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: activeCategory,
          content: textContent,
          fileName: selectedFile?.name,
          imageBase64,
          mimeType,
        }),
      });

      // 1. Obtém a resposta como texto
      const rawText = await response.text();

      // 2. Limpa os marcadores de código Markdown ```json e ```
      const cleanJson = rawText.replace(/```json|```/g, '').trim();

      // 3. Converte para o objeto de resultado
      const data: ScanResult = JSON.parse(cleanJson);

      setScanResult(data);
    } catch (err) {
      console.error('Scan error:', err);
      // Fallback em caso de erro real de rede ou formato
      setScanResult({
        status: 'suspicious',
        threatScore: 65,
        verdictTitle: 'Verificação em Modo de Segurança',
        category: 'Modo de Segurança Ativo',
        summary: 'Não foi possível concluir a varredura profunda no momento. Na dúvida, NÃO clique e NÃO compartilhe dados.',
        fraudIndicators: [
          'Instabilidade temporária na análise automática',
        ],
        recommendation: 'Procure o canal oficial da instituição mencionada.',
        canReport: true,
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const currentCategoryObj = categories.find((c) => c.id === activeCategory)!;

  return (
    <div className="space-y-6 pb-12">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3a6ea5]/20 border border-[#70f3ff]/30 text-[#70f3ff] text-xs font-semibold mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Análise Multimodal</span>
          </div>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-white tracking-tight">
            Verificador de Ameaças
          </h1>
          <p className="text-xs sm:text-sm text-[#94a3b8] mt-1">
            Analise links, imagens, mensagens, e-mails e boletos bancários antes de clicar ou efetuar pagamentos.
          </p>
        </div>

        <button
          onClick={onOpenSOS}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer"
        >
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <span>Já sofreu um golpe? SOS</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setScanResult(null);
              }}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${isSelected
                ? 'bg-[#3a6ea5]/25 border-[#70f3ff]/40 shadow-md ring-1 ring-[#70f3ff]/30'
                : 'bg-[#1b1d23] border-[#2a2e39] text-[#d2d2d2] hover:border-[#323744] hover:bg-[#23262f]'
                }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${isSelected ? 'bg-[#3a6ea5] text-[#70f3ff] shadow-xs' : 'bg-[#23262f] text-[#686868]'
                  }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <span className="font-heading font-bold text-sm block text-white">
                  {cat.label}
                </span>
                <span
                  className={`text-xs block mt-0.5 ${isSelected ? 'text-[#70f3ff] font-medium' : 'text-[#686868]'
                    }`}
                >
                  {cat.id === 'link'
                    ? 'URLs e Domínios'
                    : cat.id === 'sms'
                      ? 'WhatsApp e SMS'
                      : cat.id === 'email'
                        ? 'Remetente e Phishing'
                        : 'Pix e Boletos'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Input / Upload Section */}
      <div className="bg-[#1b1d23] rounded-2xl border border-[#2a2e39] p-6 sm:p-7 space-y-5 shadow-xl">
        <div className="flex items-center justify-between">
          <label className="font-heading font-bold text-sm text-white flex items-center gap-2">
            <span>Conteúdo para análise:</span>
          </label>
          <span className="text-xs text-[#686868] hidden sm:inline">
            {currentCategoryObj.hint}
          </span>
        </div>

        {/* Text Input Area */}
        <textarea
          value={textContent}
          onChange={(e) => setTextContent(e.target.value)}
          placeholder={currentCategoryObj.placeholder}
          rows={4}
          className="w-full bg-[#14151a] border border-[#323744] focus:border-[#70f3ff] focus:ring-2 focus:ring-[#70f3ff]/20 rounded-xl p-4 text-sm text-[#d2d2d2] placeholder-[#686868] outline-none transition-all"
        />

        {/* Drag and Drop File Upload Area */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all ${dragActive
            ? 'border-[#70f3ff] bg-[#3a6ea5]/20'
            : 'border-[#323744] hover:border-[#70f3ff]/40 bg-[#14151a]/60'
            }`}
        >
          {selectedFile || previewImage ? (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {previewImage && (
                <img
                  src={previewImage}
                  alt="Anexo selecionado"
                  className="max-h-24 max-w-[140px] rounded-xl object-contain border border-[#323744] shadow-xs"
                />
              )}
              <div className="text-left space-y-1">
                <p className="text-xs font-semibold text-white truncate max-w-xs">
                  {selectedFile ? selectedFile.name : 'Imagem anexada'}
                </p>
                <p className="text-xs text-[#686868]">
                  {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : 'Pronta para verificação'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewImage(null);
                  }}
                  className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-medium cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" /> Remover anexo
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="w-7 h-7 text-[#70f3ff] mx-auto" />
              <div>
                <label className="cursor-pointer text-sm font-semibold text-[#70f3ff] hover:text-[#93bfed]">
                  <span>Clique para anexar print ou comprovante</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*,.pdf,.txt,.apk"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileChange(e.target.files[0]);
                      }
                    }}
                  />
                </label>
                <span className="text-sm text-[#686868]"> ou arraste para cá</span>
              </div>
              <p className="text-xs text-[#686868]">
                Suporta fotos de tela, prints de conversa, PDFs de boleto ou arquivos
              </p>
            </div>
          )}
        </div>

        {/* Action Button & Sample Preset Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 text-xs text-[#686868] flex-wrap">
            <span className="font-medium text-[#d2d2d2]">Exemplos rápidos:</span>
            <button
              type="button"
              onClick={() => {
                setActiveCategory('link');
                setTextContent('https://bb-seguranca-atualizacao-conta.online/login');
              }}
              className="px-2.5 py-1 rounded-lg bg-[#23262f] hover:bg-[#2a2e39] text-[#93bfed] border border-[#323744] transition-colors cursor-pointer"
            >
              Falso Banco
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveCategory('sms');
                setTextContent('Mãe, troquei de número. Preciso pagar o aluguel hoje urgente e meu app travou, faz um Pix de 1250 na chave 11987654321');
              }}
              className="px-2.5 py-1 rounded-lg bg-[#23262f] hover:bg-[#2a2e39] text-[#dfcf93] border border-[#323744] transition-colors cursor-pointer"
            >
              Falso Parente
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveCategory('boleto');
                setTextContent('34191.79001 01043.510047 91020.150008 8 99870000085000');
              }}
              className="px-2.5 py-1 rounded-lg bg-[#23262f] hover:bg-[#2a2e39] text-[#a88fac] border border-[#323744] transition-colors cursor-pointer"
            >
              Boleto Suspeito
            </button>
          </div>

          <button
            type="button"
            onClick={runAnalysis}
            disabled={(!textContent.trim() && !selectedFile && !previewImage) || isAnalyzing}
            className="w-full sm:w-auto px-7 py-3 rounded-xl bg-[#3a6ea5] hover:bg-[#3a6ea5]/80 disabled:opacity-40 text-white font-heading font-semibold text-sm flex items-center justify-center gap-2 shadow-xs hover:shadow-md active:scale-98 transition-all cursor-pointer shrink-0"
          >
            {isAnalyzing ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-[#70f3ff]" />
                <span>Analisando com IA...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-[#70f3ff]" />
                <span>Verificar Ameaça</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Scan Results Presentation */}
      {scanResult && (
        <div
          className={`rounded-2xl border p-6 sm:p-7 space-y-6 shadow-xl transition-all ${scanResult.status === 'dangerous'
            ? 'bg-[#1b1d23] border-rose-500/40'
            : scanResult.status === 'suspicious'
              ? 'bg-[#1b1d23] border-[#dfcf93]/40'
              : 'bg-[#1b1d23] border-emerald-500/40'
            }`}
        >
          {/* Header Verdict */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2a2e39]">
            <div className="flex items-center gap-3.5">
              <div
                className={`p-3 rounded-2xl ${scanResult.status === 'dangerous'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : scanResult.status === 'suspicious'
                    ? 'bg-[#dfcf93] text-[#14151a] shadow-sm'
                    : 'bg-emerald-600 text-white shadow-sm'
                  }`}
              >
                {scanResult.status === 'dangerous' ? (
                  <AlertOctagon className="w-7 h-7" />
                ) : scanResult.status === 'suspicious' ? (
                  <AlertTriangle className="w-7 h-7" />
                ) : (
                  <ShieldCheck className="w-7 h-7" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${scanResult.status === 'dangerous'
                      ? 'bg-rose-950/60 text-rose-300 border border-rose-500/40'
                      : scanResult.status === 'suspicious'
                        ? 'bg-[#dfcf93]/20 text-[#dfcf93] border border-[#dfcf93]/40'
                        : 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40'
                      }`}
                  >
                    {scanResult.status === 'dangerous'
                      ? 'Perigo • Golpe Identificado'
                      : scanResult.status === 'suspicious'
                        ? 'Atenção • Risco Elevado'
                        : 'Seguro • Nenhuma Ameaça Detectada'}
                  </span>
                  <span className="text-xs text-[#686868] font-medium">
                    Score: {scanResult.threatScore}/100
                  </span>
                </div>
                <h3 className="font-heading font-bold text-xl text-white mt-1">
                  {scanResult.verdictTitle}
                </h3>
              </div>
            </div>

            {/* Severity Gauge */}
            <div className="bg-[#14151a] px-4 py-2 rounded-xl border border-[#2a2e39] self-start sm:self-auto shadow-xs">
              <div className="text-right">
                <span className="text-[11px] text-[#686868] uppercase font-semibold block">
                  Índice de Risco
                </span>
                <span
                  className={`font-heading font-bold text-xl ${scanResult.threatScore > 70
                    ? 'text-rose-400'
                    : scanResult.threatScore > 35
                      ? 'text-[#dfcf93]'
                      : 'text-emerald-400'
                    }`}
                >
                  {scanResult.threatScore}%
                </span>
              </div>
            </div>
          </div>

          {/* Detailed Summary */}
          <div className="space-y-2">
            <h4 className="font-heading font-bold text-sm text-white">
              Diagnóstico do Aegis:
            </h4>
            <p className="text-sm text-[#d2d2d2] leading-relaxed bg-[#14151a] p-4 rounded-xl border border-[#2a2e39]">
              {scanResult.summary}
            </p>
          </div>

          {/* Fraud Indicators List */}
          {scanResult.fraudIndicators && scanResult.fraudIndicators.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-heading font-bold text-sm text-white">
                Evidências e Sinais de Atenção:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {scanResult.fraudIndicators.map((ind, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-[#14151a] border border-[#2a2e39] text-xs sm:text-sm text-[#d2d2d2]"
                  >
                    <span className="w-2 h-2 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                    <span>{ind}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Recommendation */}
          <div className="bg-[#14151a] p-5 rounded-xl border border-[#2a2e39] space-y-3">
            <div className="flex items-center gap-2 text-white font-heading font-bold text-sm">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>O que você deve fazer:</span>
            </div>
            <p className="text-xs sm:text-sm text-[#d2d2d2] leading-relaxed">
              {scanResult.recommendation}
            </p>

            {scanResult.officialChannels && (
              <div className="text-xs text-[#dfcf93] bg-[#23262f] p-3 rounded-lg border border-[#dfcf93]/30">
                <strong>Canal Seguro Oficial:</strong> {scanResult.officialChannels}
              </div>
            )}
          </div>

          {/* Next Steps Buttons */}
          {scanResult.status !== 'safe' && (
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {onReportFraud && (
                <button
                  type="button"
                  onClick={() =>
                    onReportFraud({
                      type: activeCategory,
                      target: textContent || selectedFile?.name,
                      title: scanResult.verdictTitle,
                      description: scanResult.summary,
                    })
                  }
                  className="px-4 py-2.5 rounded-xl bg-[#3a6ea5] hover:bg-[#3a6ea5]/80 text-white font-heading font-semibold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
                >
                  Registrar Denúncia na Comunidade
                </button>
              )}

              <button
                type="button"
                onClick={onOpenSOS}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-heading font-semibold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
              >
                Preciso de Ajuda Emergencial (SOS)
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

