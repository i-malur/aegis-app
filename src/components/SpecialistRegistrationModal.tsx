import React, { useState } from 'react';
import {
  X,
  UserCheck,
  Upload,
  CheckCircle,
  Camera,
  Check,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Info
} from 'lucide-react';

interface SpecialistRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ProfessionType = 'psicologia' | 'advocacia' | 'seguranca';

export const SpecialistRegistrationModal: React.FC<SpecialistRegistrationModalProps> = ({
  isOpen,
  onClose,
}) => {
  // Wizard step: 1 = Personal info & area, 2 = Professional credentials & documents, 3 = Confirmation
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: Personal info & Area selection (strictly matching Figma screens 1 & 2 without platform user signup)
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [nomeSocial, setNomeSocial] = useState('');
  const [cpf, setCpf] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [email, setEmail] = useState('');
  const [areaAtuacao, setAreaAtuacao] = useState<ProfessionType>('advocacia');
  const [desejaAtender, setDesejaAtender] = useState<boolean>(true);

  // Helper mask for CPF: 000.000.000-00 (11 digits numeric)
  const formatCPF = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    return digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  // Helper mask for CNPJ: 12.345.678/0001-95 (Alphanumeric 14 characters, standard Receita Federal reform)
  const formatCNPJ = (value: string) => {
    const cleaned = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 14);
    return cleaned
      .replace(/^([A-Z0-9]{2})([A-Z0-9])/, '$1.$2')
      .replace(/^([A-Z0-9]{2})\.([A-Z0-9]{3})([A-Z0-9])/, '$1.$2.$3')
      .replace(/\.([A-Z0-9]{3})([A-Z0-9])/, '.$1/$2')
      .replace(/\/([A-Z0-9]{4})([A-Z0-9]{1,2})$/, '/$1-$2');
  };

  // Step 2: Professional Details (matching Figma screens 3, 4 & 5)
  const [registroProfissional, setRegistroProfissional] = useState(''); // OAB or CRP
  const [estadoEmissao, setEstadoEmissao] = useState('');
  const [titulacoes, setTitulacoes] = useState<string[]>([]);
  const [especialidades, setEspecialidades] = useState('');
  const [abordagens, setAbordagens] = useState(''); // Only for Psicologia
  const [biografia, setBiografia] = useState('');
  const [fotoFile, setFotoFile] = useState<string | null>(null);
  const [diplomaFile, setDiplomaFile] = useState<string | null>(null);
  const [cienteDados, setCienteDados] = useState(false);
  const [cienteVeracidade, setCienteVeracidade] = useState(false);

  // Errors / Validation
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const toggleTitulacao = (titulo: string) => {
    setTitulacoes((prev) =>
      prev.includes(titulo) ? prev.filter((t) => t !== titulo) : [...prev, titulo]
    );
  };

  const handleFotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFotoFile(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDiplomaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDiplomaFile(file.name);
    }
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!nomeCompleto.trim() || !cpf.trim() || !email.trim()) {
      setErrorMsg('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const cleanCpf = cpf.replace(/\D/g, '');
    if (cleanCpf.length !== 11) {
      setErrorMsg('O CPF informado deve conter exatamente 11 dígitos numéricos.');
      return;
    }

    if (cnpj.trim()) {
      const cleanCnpj = cnpj.replace(/[^a-zA-Z0-9]/g, '');
      if (cleanCnpj.length !== 14) {
        setErrorMsg('O CNPJ (quando informado) deve conter exatamente 14 dígitos alfanuméricos.');
        return;
      }
    }

    if (!desejaAtender) {
      setErrorMsg('Selecione "Sim, desejo!" para prosseguir com o credenciamento de especialista.');
      return;
    }

    setStep(2);
  };

  const handleSubmitProfessional = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (areaAtuacao === 'advocacia' && (!registroProfissional.trim() || !estadoEmissao.trim())) {
      setErrorMsg('Por favor, informe sua OAB e a sigla do estado emissor.');
      return;
    }

    if (areaAtuacao === 'psicologia' && (!registroProfissional.trim() || !estadoEmissao.trim())) {
      setErrorMsg('Por favor, informe seu CRP e a sigla do estado emissor.');
      return;
    }

    if (!biografia.trim()) {
      setErrorMsg('Por favor, escreva uma breve biografia ou apresentação profissional.');
      return;
    }

    if (!cienteDados || !cienteVeracidade) {
      setErrorMsg('Você precisa marcar "Ciente" em ambos os termos de conformidade e veracidade.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(3);
    }, 1200);
  };

  const resetForm = () => {
    setStep(1);
    setNomeCompleto('');
    setNomeSocial('');
    setCpf('');
    setCnpj('');
    setDataNascimento('');
    setEmail('');
    setDesejaAtender(true);
    setAreaAtuacao('advocacia');
    setRegistroProfissional('');
    setEstadoEmissao('');
    setTitulacoes([]);
    setEspecialidades('');
    setAbordagens('');
    setBiografia('');
    setFotoFile(null);
    setDiplomaFile(null);
    setCienteDados(false);
    setCienteVeracidade(false);
    setErrorMsg('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#1b1d23] border border-[#2a2e39] rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#2a2e39] flex items-center justify-between bg-[#14151a]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#dfcf93]/20 border border-[#dfcf93]/40 text-[#dfcf93] flex items-center justify-center shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-base sm:text-lg text-white">
                Credenciamento de Especialista
              </h2>
              <p className="text-[11px] text-[#686868]">
                {step === 1 && 'Etapa 1 de 2 • Identificação Profissional & Área'}
                {step === 2 && 'Etapa 2 de 2 • Registro de Classe, Diplomas & Biografia'}
                {step === 3 && 'Solicitação Enviada • Aguardando Análise'}
              </p>
            </div>
          </div>

          <button
            onClick={resetForm}
            className="p-2 rounded-xl bg-[#23262f] text-[#686868] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 max-h-[82vh] overflow-y-auto space-y-5">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: IDENTIFICAÇÃO DO ESPECIALISTA & ÁREA */}
          {step === 1 && (
            <form onSubmit={handleNextStep} className="space-y-4 font-sans">
              <div className="p-3 rounded-xl bg-[#14151a] border border-[#2a2e39] flex items-start gap-2.5 text-xs text-[#94a3b8]">
                <Info className="w-4 h-4 text-[#dfcf93] shrink-0 mt-0.5" />
                <p>
                  Formulário exclusivo para <strong>advogados, psicólogos e peritos digitais</strong> que desejam ser listados no mural público para atendimento direto às vítimas.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-[#d2d2d2] block mb-1">
                    Nome completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={nomeCompleto}
                    onChange={(e) => setNomeCompleto(e.target.value)}
                    placeholder="Ex: Dra. Mariana Santos Ferreira"
                    className="w-full bg-[#14151a] border border-[#323744] focus:border-[#70f3ff] rounded-xl px-3.5 py-2.5 text-sm text-[#d2d2d2] placeholder-[#686868] outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#d2d2d2] block mb-1">
                    Nome social <span className="text-[11px] font-normal text-[#686868]">(Opcional)</span>
                  </label>
                  <input
                    type="text"
                    value={nomeSocial}
                    onChange={(e) => setNomeSocial(e.target.value)}
                    placeholder="Nome pelo qual prefere ser chamado(a) no mural"
                    className="w-full bg-[#14151a] border border-[#323744] focus:border-[#70f3ff] rounded-xl px-3.5 py-2.5 text-sm text-[#d2d2d2] placeholder-[#686868] outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[#d2d2d2] block mb-1">
                      CPF *
                    </label>
                    <input
                      type="text"
                      required
                      value={cpf}
                      onChange={(e) => setCpf(formatCPF(e.target.value))}
                      placeholder="000.000.000-00"
                      maxLength={14}
                      className="w-full bg-[#14151a] border border-[#323744] focus:border-[#70f3ff] rounded-xl px-3.5 py-2.5 text-sm text-[#d2d2d2] placeholder-[#686868] outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#d2d2d2] block mb-1">
                      CNPJ <span className="text-[11px] font-normal text-[#686868]">(Opcional / Alfanumérico)</span>
                    </label>
                    <input
                      type="text"
                      value={cnpj}
                      onChange={(e) => setCnpj(formatCNPJ(e.target.value))}
                      placeholder="00.000.000/0001-00"
                      maxLength={18}
                      className="w-full bg-[#14151a] border border-[#323744] focus:border-[#70f3ff] rounded-xl px-3.5 py-2.5 text-sm text-[#d2d2d2] placeholder-[#686868] outline-none uppercase transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[#d2d2d2] block mb-1">
                      Data de nascimento *
                    </label>
                    <input
                      type="date"
                      required
                      value={dataNascimento}
                      onChange={(e) => setDataNascimento(e.target.value)}
                      className="w-full bg-[#14151a] border border-[#323744] focus:border-[#70f3ff] rounded-xl px-3.5 py-2.5 text-sm text-[#d2d2d2] outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#d2d2d2] block mb-1">
                      Endereço de e-mail para contato *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu.email@profissional.com.br"
                      className="w-full bg-[#14151a] border border-[#323744] focus:border-[#70f3ff] rounded-xl px-3.5 py-2.5 text-sm text-[#d2d2d2] placeholder-[#686868] outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Bloco de Confirmação e Escolha de Área (Conforme Figma telas 1 e 2) */}
              <div className="pt-3 border-t border-[#2a2e39] space-y-3">
                <label className="text-xs font-heading font-semibold text-white block">
                  Você é advogado, psicólogo ou especialista em segurança digital e deseja encontrar clientes aqui?
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDesejaAtender(false)}
                    className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      desejaAtender === false
                        ? 'bg-rose-950/40 border-rose-500/50 text-rose-300'
                        : 'bg-[#14151a] border-[#323744] text-[#686868] hover:border-[#4b5563]'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${desejaAtender === false ? 'border-rose-400 bg-rose-500/20' : 'border-[#686868]'}`}>
                      {desejaAtender === false && <Check className="w-3 h-3 text-rose-400" />}
                    </div>
                    <span>Não desejo!</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDesejaAtender(true)}
                    className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      desejaAtender === true
                        ? 'bg-[#dfcf93]/20 border-[#dfcf93] text-[#dfcf93]'
                        : 'bg-[#14151a] border-[#323744] text-[#686868] hover:border-[#4b5563]'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${desejaAtender === true ? 'border-[#dfcf93] bg-[#dfcf93]/30' : 'border-[#686868]'}`}>
                      {desejaAtender === true && <Check className="w-3 h-3 text-[#dfcf93]" />}
                    </div>
                    <span>Sim, desejo!</span>
                  </button>
                </div>

                {/* Seleção da área de atuação (Figma card dourado estilizado) */}
                {desejaAtender && (
                  <div className="p-4 rounded-xl bg-[#dfcf93]/10 border border-[#dfcf93]/30 space-y-2.5 animate-fade-in">
                    <label className="text-xs font-heading font-bold text-[#dfcf93] block">
                      Qual sua área de atuação?
                    </label>

                    <div className="space-y-2">
                      {[
                        { id: 'psicologia', label: 'Psicologia (CRP)' },
                        { id: 'advocacia', label: 'Advocacia (OAB)' },
                        { id: 'seguranca', label: 'Segurança da Informação / Perícia Digital' },
                      ].map((item) => (
                        <label
                          key={item.id}
                          onClick={() => setAreaAtuacao(item.id as ProfessionType)}
                          className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                            areaAtuacao === item.id
                              ? 'bg-[#dfcf93]/20 border-[#dfcf93] text-white shadow-xs'
                              : 'bg-[#14151a] border-[#2a2e39] text-[#94a3b8] hover:border-[#dfcf93]/40'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded border flex items-center justify-center ${areaAtuacao === item.id ? 'border-[#dfcf93] bg-[#dfcf93]' : 'border-[#686868]'}`}>
                            {areaAtuacao === item.id && <Check className="w-3 h-3 text-[#1b1d23] stroke-[3]" />}
                          </div>
                          <span>{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#a88fac] hover:bg-[#9b82a3] text-[#1b1d23] font-heading font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xl cursor-pointer"
                >
                  <span>Prosseguir para Credenciais & Anexos</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: CREDENCIAIS PROFISSIONAIS, DIPLOMAS E BIOGRAFIA (Figma telas 3, 4 e 5) */}
          {step === 2 && (
            <form onSubmit={handleSubmitProfessional} className="space-y-4 font-sans">
              <div className="flex items-center justify-between bg-[#14151a] p-3 rounded-xl border border-[#2a2e39]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#70f3ff]" />
                  <span className="text-xs font-semibold text-white">
                    Área Selecionada: {areaAtuacao === 'advocacia' ? 'Advocacia (OAB)' : areaAtuacao === 'psicologia' ? 'Psicologia (CRP)' : 'Segurança da Informação'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-[#70f3ff] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3 h-3" /> Alterar área
                </button>
              </div>

              {/* Campos específicos da OAB (Figma tela 3) */}
              {areaAtuacao === 'advocacia' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-[#d2d2d2] block mb-1">
                        Qual sua OAB? *
                      </label>
                      <input
                        type="text"
                        required
                        value={registroProfissional}
                        onChange={(e) => setRegistroProfissional(e.target.value)}
                        placeholder="Exemplo: OAB/SP 123456"
                        className="w-full bg-[#14151a] border border-[#323744] focus:border-[#70f3ff] rounded-xl px-3.5 py-2.5 text-sm text-[#d2d2d2] placeholder-[#686868] outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#d2d2d2] block mb-1">
                        Qual o estado de emissão da sua OAB? *
                      </label>
                      <input
                        type="text"
                        required
                        value={estadoEmissao}
                        onChange={(e) => setEstadoEmissao(e.target.value)}
                        placeholder="Exemplo: SP"
                        maxLength={2}
                        className="w-full bg-[#14151a] border border-[#323744] focus:border-[#70f3ff] rounded-xl px-3.5 py-2.5 text-sm text-[#d2d2d2] placeholder-[#686868] outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Campos específicos do CRP (Figma tela 4) */}
              {areaAtuacao === 'psicologia' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-[#d2d2d2] block mb-1">
                        Qual o seu CRP? *
                      </label>
                      <input
                        type="text"
                        required
                        value={registroProfissional}
                        onChange={(e) => setRegistroProfissional(e.target.value)}
                        placeholder="Exemplo: 06/123456"
                        className="w-full bg-[#14151a] border border-[#323744] focus:border-[#70f3ff] rounded-xl px-3.5 py-2.5 text-sm text-[#d2d2d2] placeholder-[#686868] outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#d2d2d2] block mb-1">
                        Qual o estado de emissão do seu CRP? *
                      </label>
                      <input
                        type="text"
                        required
                        value={estadoEmissao}
                        onChange={(e) => setEstadoEmissao(e.target.value)}
                        placeholder="Exemplo: SP"
                        maxLength={2}
                        className="w-full bg-[#14151a] border border-[#323744] focus:border-[#70f3ff] rounded-xl px-3.5 py-2.5 text-sm text-[#d2d2d2] placeholder-[#686868] outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Titulações (Checkboxes do Figma) */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#d2d2d2] block">
                  Qual(is) titulação(ções) você possui?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {['Graduação', 'Especialização', 'Mestrado', 'Doutorado', 'Phd', 'Outros'].map((tit) => {
                    const isChecked = titulacoes.includes(tit);
                    return (
                      <label
                        key={tit}
                        onClick={() => toggleTitulacao(tit)}
                        className={`flex items-center gap-2 p-2 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
                          isChecked
                            ? 'bg-[#3a6ea5]/20 border-[#70f3ff]/40 text-[#70f3ff]'
                            : 'bg-[#14151a] border-[#2a2e39] text-[#94a3b8] hover:border-[#323744]'
                        }`}
                      >
                        <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${isChecked ? 'border-[#70f3ff] bg-[#70f3ff]' : 'border-[#686868]'}`}>
                          {isChecked && <Check className="w-2.5 h-2.5 text-[#1b1d23] stroke-[3]" />}
                        </div>
                        <span>{tit}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Especialidades */}
              <div>
                <label className="text-xs font-semibold text-[#d2d2d2] block mb-1">
                  Qual(is) é(são) sua(s) especialidade(s)?
                </label>
                <input
                  type="text"
                  value={especialidades}
                  onChange={(e) => setEspecialidades(e.target.value)}
                  placeholder="Separe cada especialidade por ',' (ex: Golpes Bancários, MED Pix, Extorsão Digital)"
                  className="w-full bg-[#14151a] border border-[#323744] focus:border-[#70f3ff] rounded-xl px-3.5 py-2.5 text-sm text-[#d2d2d2] placeholder-[#686868] outline-none transition-colors"
                />
              </div>

              {/* Abordagens (Apenas para Psicologia, conforme Figma tela 4) */}
              {areaAtuacao === 'psicologia' && (
                <div>
                  <label className="text-xs font-semibold text-[#d2d2d2] block mb-1">
                    Qual(is) é(são) sua(s) abordagem(ens)?
                  </label>
                  <input
                    type="text"
                    value={abordagens}
                    onChange={(e) => setAbordagens(e.target.value)}
                    placeholder="Separe cada abordagem por ',' (ex: TCC, Psicanálise, Terapia de Crise)"
                    className="w-full bg-[#14151a] border border-[#323744] focus:border-[#70f3ff] rounded-xl px-3.5 py-2.5 text-sm text-[#d2d2d2] placeholder-[#686868] outline-none transition-colors"
                  />
                </div>
              )}

              {/* Biografia */}
              <div>
                <label className="text-xs font-semibold text-[#d2d2d2] block mb-1">
                  Escreva sua biografia
                </label>
                <textarea
                  rows={3}
                  required
                  value={biografia}
                  onChange={(e) => setBiografia(e.target.value)}
                  placeholder="Fale mais de você, sua formação e carreira..."
                  className="w-full bg-[#14151a] border border-[#323744] focus:border-[#70f3ff] rounded-xl p-3 text-sm text-[#d2d2d2] placeholder-[#686868] outline-none transition-colors resize-none"
                />
              </div>

              {/* Uploads conforme botões ciano do Figma */}
              <div className="space-y-3 pt-1">
                {/* Foto */}
                <div>
                  <label className="text-xs font-semibold text-[#d2d2d2] block mb-1.5">
                    Anexe uma foto sua
                  </label>
                  <label className="w-full py-3 px-4 rounded-xl bg-[#70f3ff] hover:bg-[#70f3ff]/90 text-[#14151a] font-heading font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md">
                    <Camera className="w-4 h-4" />
                    <span>{fotoFile ? 'Foto Carregada com Sucesso!' : 'Anexar uma imagem de perfil'}</span>
                    <input
                      type="file"
                      accept="image/png, image/jpeg"
                      className="hidden"
                      onChange={handleFotoUpload}
                    />
                  </label>
                  <span className="text-[10px] text-[#686868] block mt-1 text-center">Formatos aceitos: PNG ou JPG</span>
                </div>

                {/* Diplomas */}
                <div>
                  <label className="text-xs font-semibold text-[#d2d2d2] block mb-1.5">
                    Anexe seus diplomas para comprovação
                  </label>
                  <label className="w-full py-3 px-4 rounded-xl bg-[#70f3ff] hover:bg-[#70f3ff]/90 text-[#14151a] font-heading font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md">
                    <Upload className="w-4 h-4" />
                    <span>{diplomaFile ? `Documento: ${diplomaFile}` : 'Anexar uma imagem de perfil / diploma'}</span>
                    <input
                      type="file"
                      accept=".pdf, image/png, image/jpeg"
                      className="hidden"
                      onChange={handleDiplomaUpload}
                    />
                  </label>
                  <span className="text-[10px] text-[#686868] block mt-1 text-center">Formatos aceitos: PDF, PNG ou JPG</span>
                </div>
              </div>

              {/* Termos e "Ciente" checkboxes do Figma */}
              <div className="pt-2 border-t border-[#2a2e39] space-y-3">
                <div className="space-y-1">
                  <p className="text-[11px] text-[#94a3b8] leading-relaxed">
                    Todos os dados serão protegidos e analisados por nossa equipe para sua aprovação como especialista na plataforma. Entraremos em contato!
                  </p>
                  <label
                    onClick={() => setCienteDados(!cienteDados)}
                    className="flex items-center gap-2 text-xs font-semibold text-white cursor-pointer select-none pt-0.5"
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${cienteDados ? 'border-[#a88fac] bg-[#a88fac]' : 'border-[#686868]'}`}>
                      {cienteDados && <Check className="w-3 h-3 text-[#1b1d23] stroke-[3]" />}
                    </div>
                    <span>Ciente</span>
                  </label>
                </div>

                <div className="space-y-1">
                  <p className="text-[11px] text-[#94a3b8] leading-relaxed">
                    Ao enviar seu cadastro, você confirma que todas as informações são verdadeiras.
                  </p>
                  <label
                    onClick={() => setCienteVeracidade(!cienteVeracidade)}
                    className="flex items-center gap-2 text-xs font-semibold text-white cursor-pointer select-none pt-0.5"
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${cienteVeracidade ? 'border-[#a88fac] bg-[#a88fac]' : 'border-[#686868]'}`}>
                      {cienteVeracidade && <Check className="w-3 h-3 text-[#1b1d23] stroke-[3]" />}
                    </div>
                    <span>Ciente</span>
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-xl bg-[#14151a] hover:bg-[#23262f] border border-[#2a2e39] text-[#d2d2d2] font-heading font-semibold text-xs transition-colors cursor-pointer"
                >
                  Voltar
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-initial px-8 py-3 rounded-xl bg-[#a88fac] hover:bg-[#9b82a3] text-[#1b1d23] font-heading font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xl cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-[#1b1d23] border-t-transparent rounded-full animate-spin" />
                      <span>Enviando Dados...</span>
                    </>
                  ) : (
                    <span>Cadastrar</span>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: CONFIRMAÇÃO E AVISO DE E-MAIL */}
          {step === 3 && (
            <div className="text-center py-6 space-y-4 animate-fade-in font-sans">
              <div className="w-16 h-16 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-xl">
                <ShieldCheck className="w-8 h-8" />
              </div>

              <div className="space-y-1.5 max-w-md mx-auto">
                <h3 className="font-heading font-bold text-xl text-white">
                  Credenciamento Enviado com Sucesso!
                </h3>
                <p className="text-xs sm:text-sm text-[#d2d2d2] leading-relaxed">
                  Seus dados e comprovações profissionais foram recebidos para homologação cadastral.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#14151a] border border-[#70f3ff]/30 text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex items-center gap-2 text-[#70f3ff] font-heading font-semibold">
                  <CheckCircle className="w-4 h-4" />
                  <span>Análise e Contato:</span>
                </div>
                <ul className="text-[#94a3b8] space-y-1.5 list-disc list-inside text-[11px] sm:text-xs">
                  <li>Nossa equipe técnica e jurídica analisará os documentos e a regularidade do registro ({areaAtuacao === 'advocacia' ? 'OAB' : areaAtuacao === 'psicologia' ? 'CRP' : 'Perícia'}).</li>
                  <li>
                    <strong>O cadastro será analisado pela equipe e entraremos em contato via e-mail</strong> ({email || 'no endereço informado'}).
                  </li>
                  <li>Uma vez aprovado, seu perfil com botão direto de WhatsApp e biografia ficará disponível publicamente no mural de especialistas.</li>
                </ul>
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2.5 rounded-xl bg-[#3a6ea5] hover:bg-[#3a6ea5]/80 text-white font-heading font-semibold text-xs sm:text-sm transition-all shadow-xl cursor-pointer"
                >
                  Concluir e Fechar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
