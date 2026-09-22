import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Calendar,
  Shield,
  ShieldCheck,
  Edit3,
  Trash2,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  FileText,
  AlertOctagon,
  Newspaper,
  MessageSquare,
  ArrowRight,
  LogOut,
  Sparkles,
  ExternalLink,
  Clock,
  ThumbsUp,
  Heart,
  UserCheck,
  Check,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AnonymousPost, CollaborativeReport, CommunityAlert, CommunityArticle } from '../types';

interface UserProfileViewProps {
  onNavigateToSubmissions?: () => void;
  onNavigateToFeed?: () => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  onNavigateToSubmissions,
  onNavigateToFeed,
}) => {
  const { user, updateProfile, deleteAccount, logout } = useAuth();

  // Mode: 'overview' | 'edit_profile' | 'delete_confirm'
  const [viewMode, setViewMode] = useState<'overview' | 'edit_profile' | 'delete_confirm'>('overview');

  // Edit form state
  const [name, setName] = useState(user?.name || '');
  const [birthDate, setBirthDate] = useState(user?.birthDate || '');
  const [isProfessional, setIsProfessional] = useState(user?.isProfessional || false);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Stats & User Posts
  const [myPosts, setMyPosts] = useState<AnonymousPost[]>([]);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalReports: 0,
    totalAlerts: 0,
    totalArticles: 0,
    totalApproved: 0,
    totalPending: 0,
  });
  const [loadingPosts, setLoadingPosts] = useState(true);

  // Feedback states
  const [isSaving, setIsSaving] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setBirthDate(user.birthDate || '');
      setIsProfessional(user.isProfessional || false);
      setAvatarUrl(user.avatarUrl || '');
      fetchUserSubmissions();
    }
  }, [user]);

  const fetchUserSubmissions = async () => {
    if (!user) return;
    try {
      setLoadingPosts(true);
      const res = await fetch(`/api/user/submissions?email=${encodeURIComponent(user.email)}&userId=${encodeURIComponent(user.id)}`);
      const data = await res.json();
      if (res.ok) {
        setMyPosts(data.posts || []);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (e) {
      console.error('Error fetching user submissions:', e);
    } finally {
      setLoadingPosts(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackError(null);
    setFeedbackSuccess(null);

    if (password && password !== confirmPassword) {
      setFeedbackError('A nova senha e a confirmação de senha não coincidem.');
      return;
    }

    if (password && password.length < 8) {
      setFeedbackError('A nova senha deve ter no mínimo 8 caracteres.');
      return;
    }

    setIsSaving(true);
    const updatePayload: any = {
      name,
      birthDate,
      isProfessional,
      avatarUrl: avatarUrl || undefined,
    };
    if (password) {
      updatePayload.password = password;
    }

    const res = await updateProfile(updatePayload);
    setIsSaving(false);

    if (!res.success) {
      setFeedbackError(res.error || 'Erro ao atualizar dados.');
    } else {
      setFeedbackSuccess('Perfil atualizado com sucesso!');
      setPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setViewMode('overview');
        setFeedbackSuccess(null);
      }, 1500);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText.trim().toUpperCase() !== 'EXCLUIR') {
      setFeedbackError('Digite a palavra EXCLUIR para confirmar.');
      return;
    }

    setIsDeleting(true);
    const res = await deleteAccount();
    setIsDeleting(false);

    if (!res.success) {
      setFeedbackError(res.error || 'Falha ao excluir a conta.');
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const res = await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
      if (res.ok) {
        setMyPosts((prev) => prev.filter((p) => p.id !== postId));
        setStats((prev) => ({ ...prev, totalPosts: Math.max(0, prev.totalPosts - 1) }));
      }
    } catch (e) {
      console.error('Error deleting post:', e);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Profile Header Hero Card */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#171920] via-[#1b1e28] to-[#171920] border border-[#2a2e39] p-6 sm:p-8 shadow-xl overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4 sm:gap-5">
            {/* User Avatar */}
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#3a6ea5] border-2 border-[#70f3ff]/40 overflow-hidden flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#171920] flex items-center justify-center">
                <Check className="w-3 h-3 text-black font-bold" />
              </span>
            </div>

            {/* Info */}
            <div className="space-y-1">
              <div>
                <h1 className="font-heading font-black text-xl sm:text-2xl text-white">
                  {user.name}
                </h1>
              </div>
              <p className="text-xs text-[#94a3b8] flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#70f3ff]" />
                <span>{user.email}</span>
              </p>
              <p className="text-[11px] text-[#686868] flex items-center gap-2">
                <Calendar className="w-3 h-3" />
                <span>
                  Membro desde {new Date(user.createdAt).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                </span>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {viewMode === 'overview' ? (
              <>
                <button
                  type="button"
                  id="profile-edit-btn"
                  onClick={() => {
                    setFeedbackError(null);
                    setFeedbackSuccess(null);
                    setViewMode('edit_profile');
                  }}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl bg-[#a48ca7] hover:bg-[#967d99] text-white font-heading font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Editar Perfil</span>
                </button>
                <button
                  type="button"
                  id="profile-logout-btn"
                  onClick={logout}
                  className="px-3.5 py-2.5 rounded-2xl bg-[#1b1d23] hover:bg-rose-950/40 text-[#94a3b8] hover:text-rose-300 border border-[#2a2e39] hover:border-rose-500/40 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sair</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setFeedbackError(null);
                  setFeedbackSuccess(null);
                  setViewMode('overview');
                }}
                className="px-4 py-2.5 rounded-2xl bg-[#1b1d23] hover:bg-[#2a2e39] text-[#94a3b8] hover:text-white border border-[#2a2e39] text-xs font-bold transition-all cursor-pointer"
              >
                Voltar ao Perfil
              </button>
            )}
          </div>
        </div>

        {/* Quick Stats Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-[#2a2e39]/60">
          <div className="p-3 rounded-2xl bg-[#131418]/80 border border-[#2a2e39] text-center">
            <span className="font-heading font-black text-xl text-[#70f3ff]">{stats.totalPosts}</span>
            <p className="text-[11px] text-[#94a3b8] mt-0.5">Posts Anônimos</p>
          </div>

          <div className="p-3 rounded-2xl bg-[#131418]/80 border border-[#2a2e39] text-center">
            <span className="font-heading font-black text-xl text-[#dfcf93]">{stats.totalReports}</span>
            <p className="text-[11px] text-[#94a3b8] mt-0.5">Denúncias Feitas</p>
          </div>

          <div className="p-3 rounded-2xl bg-[#131418]/80 border border-[#2a2e39] text-center">
            <span className="font-heading font-black text-xl text-[#a48ca7]">{stats.totalAlerts + stats.totalArticles}</span>
            <p className="text-[11px] text-[#94a3b8] mt-0.5">Alertas & Notícias</p>
          </div>

          <div className="p-3 rounded-2xl bg-[#131418]/80 border border-[#2a2e39] text-center cursor-pointer hover:border-[#70f3ff]/40 transition-colors" onClick={onNavigateToSubmissions}>
            <span className="font-heading font-black text-xl text-emerald-400">{stats.totalApproved}</span>
            <p className="text-[11px] text-[#94a3b8] mt-0.5 flex items-center justify-center gap-1">
              <span>Aprovados</span>
              <ArrowRight className="w-2.5 h-2.5 text-emerald-400" />
            </p>
          </div>
        </div>
      </div>

      {/* ================= VIEW MODE 1: EDIT PROFILE SCREEN ================= */}
      {viewMode === 'edit_profile' && (
        <div className="rounded-3xl bg-[#171920] border border-[#2a2e39] p-6 sm:p-8 space-y-6 animate-scale-up shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#2a2e39] pb-4">
            <div>
              <h2 className="font-heading font-bold text-lg text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#a48ca7]" />
                <span>Editar Informações da Conta</span>
              </h2>
              <p className="text-xs text-[#94a3b8] mt-0.5">
                Atualize seus dados cadastrais ou redefina sua senha de acesso.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setViewMode('delete_confirm')}
              className="text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/30 border border-rose-500/30 hover:bg-rose-950/60 transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Excluir Conta</span>
            </button>
          </div>

          {feedbackSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{feedbackSuccess}</span>
            </div>
          )}

          {feedbackError && (
            <div className="p-3.5 rounded-2xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{feedbackError}</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#94a3b8]">
                  Nome Completo
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#1b1d23] border border-[#2a2e39] focus:border-[#70f3ff] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white outline-none transition-colors"
                />
              </div>

              {/* Birth Date */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#94a3b8]">
                  Data de Nascimento
                </label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full bg-[#1b1d23] border border-[#2a2e39] focus:border-[#70f3ff] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white outline-none transition-colors"
                />
              </div>
            </div>

            {/* Avatar URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#94a3b8]">
                Link da Foto de Perfil (Avatar URL opcional)
              </label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://exemplo.com/sua-foto.jpg"
                className="w-full bg-[#1b1d23] border border-[#2a2e39] focus:border-[#70f3ff] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-[#686868] outline-none transition-colors"
              />
            </div>

            {/* Professional Option */}
            <div className="p-4 rounded-2xl bg-[#131418] border border-[#2a2e39] space-y-2">
              <label className="text-xs font-bold text-white flex items-center justify-between cursor-pointer">
                <span>Perfil de Especialista / Advogado / Psicólogo</span>
                <input
                  type="checkbox"
                  checked={isProfessional}
                  onChange={(e) => setIsProfessional(e.target.checked)}
                  className="w-4 h-4 rounded text-[#70f3ff] focus:ring-0 cursor-pointer"
                />
              </label>
              <p className="text-[11px] text-[#94a3b8]">
                Marque se você deseja disponibilizar consultoria ou assistência jurídica para vítimas de golpes no Aegis.
              </p>
            </div>

            {/* Change Password Block */}
            <div className="p-4 rounded-2xl bg-[#131418] border border-[#2a2e39] space-y-4">
              <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#dfcf93]" />
                <span>Alterar Senha (deixe em branco se não desejar alterar)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-[#94a3b8]">Nova Senha</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo 8 caracteres"
                      className="w-full bg-[#1b1d23] border border-[#2a2e39] focus:border-[#70f3ff] rounded-xl px-4 py-2 text-xs text-white placeholder-[#686868] outline-none transition-colors pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#686868] hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-[#94a3b8]">Confirmar Nova Senha</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita a nova senha"
                    className="w-full bg-[#1b1d23] border border-[#2a2e39] focus:border-[#70f3ff] rounded-xl px-4 py-2 text-xs text-white placeholder-[#686868] outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Save Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setViewMode('overview')}
                className="flex-1 py-3 rounded-xl bg-[#1b1d23] hover:bg-[#2a2e39] text-[#94a3b8] hover:text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 py-3 rounded-xl bg-[#a48ca7] hover:bg-[#967d99] text-white font-heading font-bold text-xs disabled:opacity-50 transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2"
              >
                {isSaving ? <span>Salvando Alterações...</span> : <span>Salvar Dados</span>}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= VIEW MODE 2: DELETE ACCOUNT CONFIRMATION ================= */}
      {viewMode === 'delete_confirm' && (
        <div className="rounded-3xl bg-rose-950/20 border border-rose-500/40 p-6 sm:p-8 space-y-5 animate-scale-up">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-base sm:text-lg text-white">
                Excluir Conta Permanentemente
              </h2>
              <p className="text-xs text-rose-300">
                Esta ação é irreversível. Todos os seus dados, histórico e configurações locais serão apagados.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#131418] border border-rose-500/30 text-xs text-[#94a3b8] space-y-2">
            <p>Para confirmar a exclusão definitiva, digite a palavra <strong className="text-rose-400 font-bold">EXCLUIR</strong> abaixo:</p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="Digite EXCLUIR"
              className="w-full bg-[#1b1d23] border border-rose-500/40 focus:border-rose-400 rounded-xl px-4 py-2 text-xs text-white placeholder-[#686868] outline-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setViewMode('edit_profile')}
              className="flex-1 py-3 rounded-xl bg-[#1b1d23] hover:bg-[#2a2e39] text-[#94a3b8] hover:text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleDeleteAccount}
              disabled={isDeleting || deleteConfirmText.trim().toUpperCase() !== 'EXCLUIR'}
              className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-heading font-bold text-xs disabled:opacity-40 transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2"
            >
              {isDeleting ? <span>Excluindo Conta...</span> : <span>Confirmar e Excluir Definitivamente</span>}
            </button>
          </div>
        </div>
      )}

      {/* ================= VIEW MODE 3: OVERVIEW & USER'S ANONYMOUS POSTS ================= */}
      {viewMode === 'overview' && (
        <div className="space-y-6">
          {/* Quick Access to Submissions / Moderation Status */}
          <div className="p-5 rounded-3xl bg-[#171920] border border-[#2a2e39] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-[#3a6ea5]/20 border border-[#70f3ff]/30 flex items-center justify-center text-[#70f3ff]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-sm text-white">
                  Acompanhar Denúncias, Alertas e Notícias Enviadas
                </h3>
                <p className="text-xs text-[#94a3b8]">
                  Veja o status de aprovação e auditoria da nossa equipe de moderação.
                </p>
              </div>
            </div>

            <button
              type="button"
              id="goto-my-submissions-btn"
              onClick={onNavigateToSubmissions}
              className="px-4 py-2.5 rounded-2xl bg-[#3a6ea5] hover:bg-[#2d5884] text-white font-heading font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <span>Minhas Contribuições & Status</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* User's Anonymous Posts Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading font-bold text-lg text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#a48ca7]" />
                  <span>Minhas Publicações Anônimas no Feed ({myPosts.length})</span>
                </h2>
                <p className="text-xs text-[#94a3b8] mt-0.5">
                  Apenas você consegue visualizar suas publicações reunidas nesta tela. No feed público, elas aparecem 100% anônimas.
                </p>
              </div>

              {onNavigateToFeed && (
                <button
                  type="button"
                  onClick={onNavigateToFeed}
                  className="text-xs text-[#70f3ff] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span>Ver Feed Geral</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {loadingPosts ? (
              <div className="p-8 text-center text-xs text-[#94a3b8]">
                Carregando suas publicações...
              </div>
            ) : myPosts.length === 0 ? (
              <div className="p-8 rounded-3xl bg-[#171920] border border-[#2a2e39] text-center space-y-3">
                <MessageSquare className="w-10 h-10 text-[#686868] mx-auto" />
                <p className="text-xs text-[#94a3b8]">
                  Você ainda não fez nenhuma publicação anônima no feed.
                </p>
                {onNavigateToFeed && (
                  <button
                    type="button"
                    onClick={onNavigateToFeed}
                    className="px-4 py-2 rounded-xl bg-[#a48ca7] text-white text-xs font-bold hover:bg-[#967d99] cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <span>Ir para o Feed e Publicar</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {myPosts.map((post) => (
                  <div
                    key={post.id}
                    className="p-5 rounded-3xl bg-[#171920] border border-[#2a2e39] hover:border-[#3a6ea5]/40 transition-all space-y-3 shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">
                          Pseudônimo atribuído: <span className="text-[#70f3ff]">{post.authorAlias}</span>
                        </span>
                        <span className="text-[10px] text-[#686868]">
                          • {new Date(post.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeletePost(post.id)}
                        className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer transition-colors p-1"
                        title="Remover publicação"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Excluir</span>
                      </button>
                    </div>

                    <div>
                      <h4 className="font-heading font-bold text-sm sm:text-base text-white">
                        {post.title}
                      </h4>
                      <p className="text-xs text-[#d2d2d2] mt-1 line-clamp-3">
                        {post.content}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#2a2e39] flex items-center justify-between text-[11px] text-[#94a3b8]">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                          <span>{post.likesCount} Apoios</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5 text-[#70f3ff]" />
                          <span>{post.commentsCount || 0} Comentários</span>
                        </span>
                      </div>

                      <span className="text-[#dfcf93] font-semibold">
                        {post.tagLabel}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
