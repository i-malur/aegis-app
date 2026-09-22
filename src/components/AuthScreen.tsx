import React, { useState } from 'react';
import {
  Shield,
  ShieldCheck,
  Lock,
  Mail,
  User,
  Calendar,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Check,
  UserPlus,
  ArrowRight,
  ShieldAlert,
  Zap,
  Users,
  KeyRound,
  FileCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AEGIS_LOGO_IMG } from '../assets/branding';

export const AuthScreen: React.FC = () => {
  const {
    authMode,
    setAuthMode,
    login,
    register,
    loginSocial,
  } = useAuth();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register form state
  const [registerName, setRegisterName] = useState('');
  const [registerBirthDate, setRegisterBirthDate] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false);
  const [isProfessional, setIsProfessional] = useState(false);

  // UI feedback states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState<string | null>(null);

  // Password criteria check
  const hasMinLength = registerPassword.length >= 8;
  const hasUpperAndLower = /[a-z]/.test(registerPassword) && /[A-Z]/.test(registerPassword);
  const hasNumbers = /[0-9]/.test(registerPassword);
  const hasSymbols = /[^A-Za-z0-9]/.test(registerPassword);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setForgotPasswordMessage(null);
    setIsLoading(true);

    const res = await login(loginEmail, loginPassword);
    setIsLoading(false);

    if (!res.success) {
      setErrorMessage(res.error || 'Falha ao autenticar.');
    } else {
      setSuccessMessage('Acesso autorizado! Carregando painel...');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setForgotPasswordMessage(null);

    if (!registerName.trim() || !registerBirthDate || !registerEmail.trim() || !registerPassword) {
      setErrorMessage('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (registerPassword !== registerConfirmPassword) {
      setErrorMessage('As senhas digitadas não coincidem. Verifique e tente novamente.');
      return;
    }

    if (!hasMinLength) {
      setErrorMessage('A senha precisa ter no mínimo 8 caracteres.');
      return;
    }

    setIsLoading(true);
    const res = await register({
      name: registerName,
      birthDate: registerBirthDate,
      email: registerEmail,
      password: registerPassword,
      isProfessional,
    });
    setIsLoading(false);

    if (!res.success) {
      setErrorMessage(res.error || 'Erro ao realizar cadastro.');
    } else {
      setSuccessMessage('Conta criada com sucesso! Redirecionando...');
    }
  };

  const handleSocialClick = async (provider: 'google' | 'microsoft') => {
    setErrorMessage(null);
    setForgotPasswordMessage(null);
    setIsLoading(true);
    const res = await loginSocial(provider);
    setIsLoading(false);

    if (!res.success) {
      setErrorMessage(res.error || 'Falha na autenticação.');
    }
  };

  const handleForgotPassword = () => {
    if (!loginEmail.trim()) {
      setErrorMessage('Digite seu e-mail no campo acima para redefinir a senha.');
    } else {
      setErrorMessage(null);
      setForgotPasswordMessage(`Link de redefinição enviado para ${loginEmail}. Verifique sua caixa de entrada.`);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0c10] text-[#d2d2d2] flex items-center justify-center p-3 sm:p-6 md:p-8 lg:p-10 relative overflow-y-auto selection:bg-[#70f3ff]/30 selection:text-white">
      {/* Dynamic Background Glow Elements */}
      <div className="fixed top-1/4 -left-28 w-[450px] h-[450px] bg-[#70f3ff]/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-1/4 -right-28 w-[450px] h-[450px] bg-[#a48ca7]/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#dfcf93]/3 rounded-full blur-[160px] pointer-events-none" />

      {/* Main Responsive Authentication Container */}
      <div className="relative w-full max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-5xl xl:max-w-6xl bg-[#14161d] border border-[#262a36] rounded-3xl lg:rounded-[36px] shadow-[0_24px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden my-auto transition-all duration-300">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
          
          {/* ========================================================= */}
          {/* LEFT COLUMN: BRANDING (Desktop & Tablet) */}
          {/* ========================================================= */}
          <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-[#101218] via-[#141721] to-[#191b26] border-b lg:border-b-0 lg:border-r border-[#262a36] p-8 xl:p-12 flex-col items-center justify-center text-center relative overflow-hidden">
            {/* Ambient Corner Flare */}
            <div className="absolute -top-24 -left-24 w-60 h-60 bg-[#70f3ff]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-[#a48ca7]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col items-center gap-6 z-10">
              <div className="w-44 h-44 xl:w-52 xl:h-52 rounded-full overflow-hidden shadow-[0_0_55px_rgba(223,207,147,0.4)] border-4 border-[#dfcf93]/80 ring-4 ring-[#dfcf93]/20 bg-[#0d0e13] p-2.5 shrink-0 flex items-center justify-center transition-transform hover:scale-105 duration-300">
                <img
                  src={AEGIS_LOGO_IMG}
                  alt="Aegis Logo"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <h1 className="font-heading font-black text-4xl xl:text-5xl text-white tracking-widest">
                AEGIS
              </h1>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: INTERACTIVE AUTH FORM WORKSPACE */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 flex flex-col justify-between p-5 sm:p-8 md:p-10 bg-[#161821]">
            
            {/* Top Bar for Mobile & Tablet (Logo & Badge) */}
            <div className="lg:hidden flex flex-col items-center justify-center pb-6 mb-2 border-b border-[#262a36] text-center">
              <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full overflow-hidden shadow-[0_0_55px_rgba(223,207,147,0.4)] border-4 border-[#dfcf93]/80 ring-4 ring-[#dfcf93]/20 bg-[#0d0e13] p-2.5 shrink-0 flex items-center justify-center transition-transform hover:scale-105 duration-300">
                <img
                  src={AEGIS_LOGO_IMG}
                  alt="Aegis Logo"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="mt-4 flex flex-col items-center">
                <h1 className="font-heading font-black text-4xl sm:text-5xl md:text-6xl text-white tracking-widest">AEGIS</h1>
              </div>
            </div>

            {/* Mode Switcher Pills (Entrar vs Criar Conta) */}
            <div className="pt-2 lg:pt-0">
              <div className="flex p-1.5 rounded-2xl bg-[#0f1117] border border-[#262a36] gap-1.5">
                <button
                  type="button"
                  id="auth-tab-login-btn"
                  onClick={() => {
                    setErrorMessage(null);
                    setForgotPasswordMessage(null);
                    setAuthMode('login');
                  }}
                  className={`flex-1 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-heading font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    authMode === 'login'
                      ? 'bg-[#a48ca7] text-white shadow-lg'
                      : 'text-[#94a3b8] hover:text-white hover:bg-[#1b1e28]'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Entrar no App</span>
                </button>

                <button
                  type="button"
                  id="auth-tab-register-btn"
                  onClick={() => {
                    setErrorMessage(null);
                    setForgotPasswordMessage(null);
                    setAuthMode('register');
                  }}
                  className={`flex-1 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-heading font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    authMode === 'register'
                      ? 'bg-[#a48ca7] text-white shadow-lg'
                      : 'text-[#94a3b8] hover:text-white hover:bg-[#1b1e28]'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Criar Nova Conta</span>
                </button>
              </div>
            </div>

            {/* Form Section Header Title */}
            <div className="my-5">
              <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-white">
                {authMode === 'login' ? 'Bem-vindo(a) de volta' : 'Criar sua conta no Aegis'}
              </h2>
              <p className="text-xs sm:text-sm text-[#94a3b8] mt-1">
                {authMode === 'login'
                  ? 'Informe seus dados de acesso para entrar na plataforma protegida.'
                  : 'Preencha as informações para ativar seus recursos de segurança antifraude.'}
              </p>
            </div>

            {/* Status Feedback Messages */}
            {errorMessage && (
              <div className="mb-4 p-3.5 sm:p-4 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs sm:text-sm flex items-start gap-2.5 animate-fade-in">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-3.5 sm:p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm flex items-center gap-2.5 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0" />
                <span className="font-semibold">{successMessage}</span>
              </div>
            )}

            {forgotPasswordMessage && (
              <div className="mb-4 p-3.5 sm:p-4 rounded-2xl bg-sky-950/60 border border-sky-500/40 text-sky-300 text-xs sm:text-sm flex items-center gap-2.5 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-sky-400 shrink-0" />
                <span className="font-medium">{forgotPasswordMessage}</span>
              </div>
            )}

            {/* ========================================================= */}
            {/* VIEW 1: TELA DE LOGIN (Redesenhada com disposição inteligente) */}
            {/* ========================================================= */}
            {authMode === 'login' && (
              <div className="space-y-5">
                {/* 1-Click Social Sign-In Buttons Side-by-Side */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    id="login-google-btn"
                    onClick={() => handleSocialClick('google')}
                    disabled={isLoading}
                    className="w-full py-3 sm:py-3.5 px-4 rounded-2xl bg-[#11131a] hover:bg-[#1b1e28] border border-[#2b3040] hover:border-[#70f3ff]/40 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-3 transition-all cursor-pointer disabled:opacity-60 shadow-sm"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#EA4335"
                        d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.4 8.8 5 12 5z"
                      />
                      <path
                        fill="#4285F4"
                        d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.7s.1-2 .4-2.7L1.6 6.4C.6 8.3 0 10.1 0 12s.6 3.7 1.6 5.6l3.7-2.9z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.2 0-5.8-2.4-6.7-5.3L1.6 15.9C3.5 19.7 7.4 23 12 23z"
                      />
                    </svg>
                    <span>Entrar com o Google</span>
                  </button>

                  <button
                    type="button"
                    id="login-microsoft-btn"
                    onClick={() => handleSocialClick('microsoft')}
                    disabled={isLoading}
                    className="w-full py-3 sm:py-3.5 px-4 rounded-2xl bg-[#11131a] hover:bg-[#1b1e28] border border-[#2b3040] hover:border-[#70f3ff]/40 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-3 transition-all cursor-pointer disabled:opacity-60 shadow-sm"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" viewBox="0 0 23 23">
                      <path fill="#f35325" d="M1 1h10v10H1z" />
                      <path fill="#81bc06" d="M12 1h10v10H12z" />
                      <path fill="#05a6f0" d="M1 12h10v10H1z" />
                      <path fill="#ffba08" d="M12 12h10v10H12z" />
                    </svg>
                    <span>Entrar com a Microsoft</span>
                  </button>
                </div>

                {/* Divider: OU COM SEU E-MAIL */}
                <div className="relative flex items-center justify-center py-1">
                  <div className="border-t border-[#262a36] w-full" />
                  <span className="bg-[#161821] px-4 font-heading font-bold text-[11px] sm:text-xs text-[#757d8e] uppercase tracking-wider whitespace-nowrap">
                    ou com seu e-mail
                  </span>
                  <div className="border-t border-[#262a36] w-full" />
                </div>

                {/* Login Form Fields */}
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  {/* Field: Endereço de e-mail */}
                  <div className="space-y-1.5">
                    <label className="text-xs sm:text-sm font-semibold text-[#94a3b8] flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#70f3ff]" />
                      <span>Endereço de e-mail</span>
                    </label>
                    <input
                      type="email"
                      required
                      id="login-email-input"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="seu.email@exemplo.com"
                      className="w-full bg-[#11131a] border border-[#2b3040] focus:border-[#70f3ff] focus:ring-1 focus:ring-[#70f3ff]/40 rounded-2xl px-4 sm:px-5 py-3 sm:py-3.5 text-xs sm:text-sm md:text-base text-white placeholder-[#686868] outline-none transition-all font-medium shadow-inner"
                    />
                  </div>

                  {/* Field: Senha */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs sm:text-sm font-semibold text-[#94a3b8] flex items-center gap-2">
                        <Lock className="w-4 h-4 text-[#dfcf93]" />
                        <span>Senha de acesso</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-xs text-[#70f3ff] hover:underline cursor-pointer transition-colors"
                      >
                        Esqueceu a senha?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showLoginPassword ? 'text' : 'password'}
                        required
                        id="login-password-input"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Digite sua senha cadastrada"
                        className="w-full bg-[#11131a] border border-[#2b3040] focus:border-[#70f3ff] focus:ring-1 focus:ring-[#70f3ff]/40 rounded-2xl px-4 sm:px-5 py-3 sm:py-3.5 pr-12 text-xs sm:text-sm md:text-base text-white placeholder-[#686868] outline-none transition-all font-medium shadow-inner"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#686868] hover:text-[#d2d2d2] cursor-pointer transition-colors p-1"
                      >
                        {showLoginPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me Option */}
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2.5 cursor-pointer text-xs sm:text-sm text-[#94a3b8] select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-[#2b3040] bg-[#11131a] text-[#a48ca7] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#a48ca7]"
                      />
                      <span>Manter conectado neste dispositivo</span>
                    </label>
                  </div>

                  {/* Entrar Button */}
                  <button
                    type="submit"
                    id="login-submit-btn"
                    disabled={isLoading}
                    className="w-full py-3.5 sm:py-4 rounded-2xl bg-[#a48ca7] hover:bg-[#967d99] text-white font-heading font-extrabold text-sm sm:text-base shadow-xl transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2.5 mt-4 hover:scale-[1.01]"
                  >
                    {isLoading ? (
                      <span>Autenticando...</span>
                    ) : (
                      <>
                        <span>Entrar no Aegis</span>
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      </>
                    )}
                  </button>
                </form>

                {/* Switch to Register */}
                <div className="text-center pt-2">
                  <p className="text-xs sm:text-sm text-[#94a3b8]">
                    Ainda não possui uma conta?{' '}
                    <button
                      type="button"
                      id="switch-to-register-link"
                      onClick={() => {
                        setErrorMessage(null);
                        setForgotPasswordMessage(null);
                        setAuthMode('register');
                      }}
                      className="text-[#70f3ff] hover:underline font-bold cursor-pointer transition-colors"
                    >
                      Cadastre-se gratuitamente
                    </button>
                  </p>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* VIEW 2: TELA DE CADASTRO (Disposição Inteligente em Multi-Colunas) */}
            {/* ========================================================= */}
            {authMode === 'register' && (
              <div className="space-y-4 max-h-[70vh] lg:max-h-[75vh] overflow-y-auto pr-1 custom-scrollbar">
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  
                  {/* Linha 1: Grid com Nome Completo & Data de Nascimento */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Field 1: Nome completo */}
                    <div className="space-y-1.5">
                      <label className="text-xs sm:text-sm font-semibold text-[#94a3b8] flex items-center gap-1.5">
                        <User className="w-4 h-4 text-[#70f3ff]" />
                        <span>Nome completo <span className="text-rose-400">*</span></span>
                      </label>
                      <input
                        type="text"
                        required
                        id="register-name-input"
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        placeholder="Ex: João da Silva"
                        className="w-full bg-[#11131a] border border-[#2b3040] focus:border-[#70f3ff] focus:ring-1 focus:ring-[#70f3ff]/40 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder-[#686868] outline-none transition-all font-medium shadow-inner"
                      />
                    </div>

                    {/* Field 2: Data de nascimento */}
                    <div className="space-y-1.5">
                      <label className="text-xs sm:text-sm font-semibold text-[#94a3b8] flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-[#70f3ff]" />
                        <span>Data de nascimento <span className="text-rose-400">*</span></span>
                      </label>
                      <input
                        type="date"
                        required
                        id="register-birthdate-input"
                        value={registerBirthDate}
                        onChange={(e) => setRegisterBirthDate(e.target.value)}
                        className="w-full bg-[#11131a] border border-[#2b3040] focus:border-[#70f3ff] focus:ring-1 focus:ring-[#70f3ff]/40 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder-[#686868] outline-none transition-all font-medium shadow-inner"
                      />
                    </div>
                  </div>

                  {/* Linha 2: Endereço de e-mail (Full Width) */}
                  <div className="space-y-1.5">
                    <label className="text-xs sm:text-sm font-semibold text-[#94a3b8] flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-[#70f3ff]" />
                      <span>Endereço de e-mail principal <span className="text-rose-400">*</span></span>
                    </label>
                    <input
                      type="email"
                      required
                      id="register-email-input"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      placeholder="seu.email@exemplo.com"
                      className="w-full bg-[#11131a] border border-[#2b3040] focus:border-[#70f3ff] focus:ring-1 focus:ring-[#70f3ff]/40 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder-[#686868] outline-none transition-all font-medium shadow-inner"
                    />
                  </div>

                  {/* Linha 3: Grid com Senha & Confirmação de Senha */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Field 4: Senha */}
                    <div className="space-y-1.5">
                      <label className="text-xs sm:text-sm font-semibold text-[#94a3b8] flex items-center gap-1.5">
                        <Lock className="w-4 h-4 text-[#dfcf93]" />
                        <span>Crie sua senha <span className="text-rose-400">*</span></span>
                      </label>
                      <div className="relative">
                        <input
                          type={showRegisterPassword ? 'text' : 'password'}
                          required
                          id="register-password-input"
                          value={registerPassword}
                          onChange={(e) => setRegisterPassword(e.target.value)}
                          placeholder="Mínimo 8 caracteres"
                          className="w-full bg-[#11131a] border border-[#2b3040] focus:border-[#70f3ff] focus:ring-1 focus:ring-[#70f3ff]/40 rounded-2xl px-4 py-3 pr-11 text-xs sm:text-sm text-white placeholder-[#686868] outline-none transition-all font-medium shadow-inner"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#686868] hover:text-[#d2d2d2] cursor-pointer transition-colors p-1"
                        >
                          {showRegisterPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Field 5: Repita a senha */}
                    <div className="space-y-1.5">
                      <label className="text-xs sm:text-sm font-semibold text-[#94a3b8] flex items-center gap-1.5">
                        <Lock className="w-4 h-4 text-[#dfcf93]" />
                        <span>Repita a senha <span className="text-rose-400">*</span></span>
                      </label>
                      <div className="relative">
                        <input
                          type={showRegisterConfirmPassword ? 'text' : 'password'}
                          required
                          id="register-confirm-password-input"
                          value={registerConfirmPassword}
                          onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                          placeholder="Repita sua senha criada"
                          className="w-full bg-[#11131a] border border-[#2b3040] focus:border-[#70f3ff] focus:ring-1 focus:ring-[#70f3ff]/40 rounded-2xl px-4 py-3 pr-11 text-xs sm:text-sm text-white placeholder-[#686868] outline-none transition-all font-medium shadow-inner"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegisterConfirmPassword(!showRegisterConfirmPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#686868] hover:text-[#d2d2d2] cursor-pointer transition-colors p-1"
                        >
                          {showRegisterConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Password Criteria Checklist: 2x2 Matrix */}
                  <div className="p-3.5 rounded-2xl bg-[#11131a] border border-[#2b3040] text-xs space-y-2 text-[#94a3b8]">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-[11px] uppercase tracking-wider">Critérios da Senha:</span>
                      <span className="text-[11px] text-[#70f3ff]">Segurança Forte</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] sm:text-xs">
                      <div className={`flex items-center gap-2 ${hasMinLength ? 'text-emerald-400 font-semibold' : ''}`}>
                        <span className={`w-2 h-2 rounded-full shrink-0 ${hasMinLength ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' : 'bg-[#404555]'}`} />
                        <span>Mínimo 8 caracteres</span>
                      </div>
                      <div className={`flex items-center gap-2 ${hasUpperAndLower ? 'text-emerald-400 font-semibold' : ''}`}>
                        <span className={`w-2 h-2 rounded-full shrink-0 ${hasUpperAndLower ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' : 'bg-[#404555]'}`} />
                        <span>Maiúsculas e minúsculas</span>
                      </div>
                      <div className={`flex items-center gap-2 ${hasNumbers ? 'text-emerald-400 font-semibold' : ''}`}>
                        <span className={`w-2 h-2 rounded-full shrink-0 ${hasNumbers ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' : 'bg-[#404555]'}`} />
                        <span>Pelo menos um número</span>
                      </div>
                      <div className={`flex items-center gap-2 ${hasSymbols ? 'text-emerald-400 font-semibold' : ''}`}>
                        <span className={`w-2 h-2 rounded-full shrink-0 ${hasSymbols ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' : 'bg-[#404555]'}`} />
                        <span>Símbolo especial (@, #, $, ...)</span>
                      </div>
                    </div>
                  </div>

                  {/* Professional / Specialist Selection Cards */}
                  <div className="p-4 rounded-2xl bg-[#11131a] border border-[#2b3040] space-y-2.5">
                    <p className="text-xs font-semibold text-white leading-relaxed">
                      Deseja atuar como especialista credenciado (advogado, psicólogo ou perito em cibersegurança)?
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setIsProfessional(false)}
                        className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                          !isProfessional
                            ? 'border-[#70f3ff] bg-[#70f3ff]/10 text-white font-bold shadow-sm'
                            : 'border-[#262a36] bg-[#161821] text-[#94a3b8] hover:text-white'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                            !isProfessional ? 'border-[#70f3ff] bg-[#70f3ff] text-black' : 'border-[#686868]'
                          }`}
                        >
                          {!isProfessional && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <div className="text-xs">
                          <p className="font-semibold text-white">Não, sou cidadão comum</p>
                          <p className="text-[10px] text-[#94a3b8] font-normal">Quero me proteger de golpes</p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsProfessional(true)}
                        className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                          isProfessional
                            ? 'border-[#a48ca7] bg-[#a48ca7]/20 text-white font-bold shadow-sm'
                            : 'border-[#262a36] bg-[#161821] text-[#94a3b8] hover:text-white'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                            isProfessional ? 'border-[#a48ca7] bg-[#a48ca7] text-white' : 'border-[#686868]'
                          }`}
                        >
                          {isProfessional && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <div className="text-xs">
                          <p className="font-semibold text-white">Sim, sou especialista</p>
                          <p className="text-[10px] text-[#94a3b8] font-normal">Quero prestar consultoria</p>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Submit Registration Button */}
                  <button
                    type="submit"
                    id="register-submit-btn"
                    disabled={isLoading}
                    className="w-full py-3.5 sm:py-4 rounded-2xl bg-[#a48ca7] hover:bg-[#967d99] text-white font-heading font-extrabold text-sm sm:text-base shadow-xl transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2.5 hover:scale-[1.01]"
                  >
                    {isLoading ? (
                      <span>Cadastrando...</span>
                    ) : (
                      <>
                        <span>Criar Minha Conta e Acessar</span>
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      </>
                    )}
                  </button>

                  {/* Link back to login */}
                  <div className="text-center pt-1 pb-1">
                    <p className="text-xs sm:text-sm text-[#94a3b8]">
                      Já possui uma conta?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setErrorMessage(null);
                          setForgotPasswordMessage(null);
                          setAuthMode('login');
                        }}
                        className="text-[#70f3ff] hover:underline font-bold cursor-pointer transition-colors"
                      >
                        Fazer Login no Aegis
                      </button>
                    </p>
                  </div>
                </form>
              </div>
            )}

            {/* Footer Terms & Security Assurance */}
            <div className="mt-6 pt-4 border-t border-[#262a36] text-center">
              <p className="text-[11px] text-[#6e7687]">
                Ao entrar ou se cadastrar, você concorda com os protocolos de segurança e sigilo de dados do Aegis.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

