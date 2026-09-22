import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  PlusCircle,
  Shield,
  ShieldAlert,
  Heart,
  MessageCircle,
  Share2,
  Filter,
  Search,
  Sparkles,
  Send,
  UserCheck,
  CheckCircle,
  Flame,
  AlertTriangle,
  HelpCircle,
  Lightbulb,
  Lock,
  ArrowRight,
  Eye,
  Image as ImageIcon,
  Pin,
  Clock,
  ThumbsUp,
  X,
} from 'lucide-react';
import { AnonymousPost, AnonymousPostComment } from '../types';
import { useAuth } from '../context/AuthContext';

interface AnonymousFeedViewProps {
  onOpenCreatePost?: () => void;
  onNavigateToProfile?: () => void;
}

export const AnonymousFeedView: React.FC<AnonymousFeedViewProps> = ({
  onOpenCreatePost,
  onNavigateToProfile,
}) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<AnonymousPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  // Quick create modal inside feed
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<AnonymousPost['category']>('relato_golpe');
  const [newStateCode, setNewStateCode] = useState('');
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/posts');
      const data = await res.json();
      if (Array.isArray(data)) {
        setPosts(data);
      }
    } catch (e) {
      console.error('Error fetching anonymous posts:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    if (likedPosts.has(postId)) return;

    setLikedPosts((prev) => new Set([...prev, postId]));
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, likesCount: p.likesCount + 1 } : p))
    );

    try {
      await fetch(`/api/posts/${postId}/like`, { method: 'POST' });
    } catch (e) {
      console.error('Error liking post:', e);
    }
  };

  const handleSendComment = async (postId: string) => {
    if (!commentInput.trim()) return;

    setIsSubmittingComment(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: commentInput }),
      });
      const data = await res.json();

      if (res.ok && data.comment) {
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  commentsCount: (p.commentsCount || 0) + 1,
                  comments: [...(p.comments || []), data.comment],
                }
              : p
          )
        );
        setCommentInput('');
      }
    } catch (e) {
      console.error('Error sending comment:', e);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleCreatePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    setIsSubmittingPost(true);
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          title: newTitle,
          content: newContent,
          category: newCategory,
          stateCode: newStateCode || undefined,
        }),
      });
      const data = await res.json();

      if (res.ok && data.post) {
        setPosts((prev) => [data.post, ...prev]);
        setPostSuccess(true);
        setTimeout(() => {
          setPostSuccess(false);
          setIsCreatingPost(false);
          setNewTitle('');
          setNewContent('');
        }, 1200);
      }
    } catch (e) {
      console.error('Error creating post:', e);
    } finally {
      setIsSubmittingPost(false);
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'alerta_urgente':
        return {
          label: 'Alerta Urgente',
          color: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
          icon: AlertTriangle,
        };
      case 'relato_golpe':
        return {
          label: 'Relato de Golpe',
          color: 'bg-[#a48ca7]/15 text-[#dfcf93] border-[#a48ca7]/30',
          icon: ShieldAlert,
        };
      case 'duvida_seguranca':
        return {
          label: 'Dúvida de Segurança',
          color: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
          icon: HelpCircle,
        };
      case 'dica_prevencao':
        return {
          label: 'Dica de Prevenção',
          color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          icon: Lightbulb,
        };
      case 'desabafo_apoio':
        return {
          label: 'Apoio & Acolhimento',
          color: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
          icon: Heart,
        };
      default:
        return {
          label: 'Comunidade',
          color: 'bg-[#2a2e39] text-[#d2d2d2] border-[#323744]',
          icon: MessageSquare,
        };
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesCat = categoryFilter === 'all' || post.category === categoryFilter;
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.authorAlias.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#171920] via-[#1b1d24] to-[#171920] border border-[#2a2e39] p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#70f3ff]/10 border border-[#70f3ff]/20 text-[#70f3ff] text-xs font-semibold">
              <Lock className="w-3.5 h-3.5" />
              <span>Rede Social 100% Anônima & Segura</span>
            </div>
            <h1 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight">
              Feed Comunitário de Relatos & Alertas
            </h1>
            <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed">
              Compartilhe tentativas de golpe que você presenciou, tire dúvidas com outros cidadãos e ajude milhares de pessoas a não caírem em fraudes — com pseudônimos gerados automaticamente e sigilo absoluto.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              id="feed-create-post-btn"
              onClick={() => setIsCreatingPost(true)}
              className="px-5 py-3 rounded-2xl bg-[#a48ca7] hover:bg-[#967d99] text-white font-heading font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer hover:scale-[1.02]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Nova Publicação Anônima</span>
            </button>

            {onNavigateToProfile && (
              <button
                type="button"
                id="feed-my-profile-btn"
                onClick={onNavigateToProfile}
                className="px-4 py-3 rounded-2xl bg-[#131418] hover:bg-[#23262f] border border-[#2a2e39] text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
              >
                <UserCheck className="w-4 h-4 text-[#70f3ff]" />
                <span>Meu Perfil</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#686868] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            id="feed-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por palavras-chave ou golpe..."
            className="w-full bg-[#1b1d23] border border-[#2a2e39] focus:border-[#70f3ff] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#686868] outline-none transition-colors"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 custom-scrollbar">
          {[
            { id: 'all', label: 'Todas as Publicações' },
            { id: 'alerta_urgente', label: 'Alertas Urgentes' },
            { id: 'relato_golpe', label: 'Relatos de Golpes' },
            { id: 'duvida_seguranca', label: 'Dúvidas' },
            { id: 'dica_prevencao', label: 'Dicas' },
            { id: 'desabafo_apoio', label: 'Apoio' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                categoryFilter === cat.id
                  ? 'bg-[#3a6ea5] border-[#70f3ff] text-white shadow-xs'
                  : 'bg-[#1b1d23] border-[#2a2e39] text-[#94a3b8] hover:text-white hover:bg-[#23262f]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Feed Container */}
      {loading ? (
        <div className="p-12 text-center text-[#94a3b8] space-y-3">
          <div className="w-8 h-8 border-2 border-[#70f3ff] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs">Carregando relatos anônimos da comunidade...</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="p-12 rounded-3xl bg-[#171920] border border-[#2a2e39] text-center space-y-4">
          <ShieldAlert className="w-12 h-12 text-[#94a3b8] mx-auto opacity-50" />
          <div className="space-y-1">
            <h3 className="font-heading font-bold text-white text-base">
              Nenhuma publicação encontrada
            </h3>
            <p className="text-xs text-[#94a3b8] max-w-md mx-auto">
              Seja o primeiro a compartilhar um relato ou alerta sobre golpes para proteger a comunidade!
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsCreatingPost(true)}
            className="px-4 py-2 rounded-xl bg-[#a48ca7] text-white text-xs font-bold hover:bg-[#967d99] cursor-pointer inline-flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Criar primeira publicação anônima</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => {
            const badge = getCategoryBadge(post.category);
            const BadgeIcon = badge.icon;
            const isLiked = likedPosts.has(post.id);
            const isCommentsOpen = activeCommentPostId === post.id;

            return (
              <article
                key={post.id}
                id={`post-card-${post.id}`}
                className="rounded-3xl bg-[#171920] border border-[#2a2e39] hover:border-[#3a6ea5]/50 transition-all p-5 sm:p-6 space-y-4 shadow-lg"
              >
                {/* Post Author Header */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm text-black shrink-0 shadow-md"
                      style={{ backgroundColor: post.avatarColor }}
                    >
                      <Shield className="w-5 h-5 text-[#0f1015]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-bold text-xs sm:text-sm text-white">
                          {post.authorAlias}
                        </span>
                        {post.isPinned && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#dfcf93] bg-[#dfcf93]/10 px-2 py-0.5 rounded-md border border-[#dfcf93]/20">
                            <Pin className="w-2.5 h-2.5" />
                            Fixado
                          </span>
                        )}
                        {post.stateCode && (
                          <span className="text-[10px] font-bold text-[#70f3ff] bg-[#70f3ff]/10 px-1.5 py-0.5 rounded border border-[#70f3ff]/20">
                            {post.stateCode}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#686868] flex items-center gap-1.5 mt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>
                          {new Date(post.createdAt).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </p>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-bold border ${badge.color}`}
                  >
                    <BadgeIcon className="w-3.5 h-3.5" />
                    <span>{badge.label}</span>
                  </span>
                </div>

                {/* Post Content */}
                <div className="space-y-2">
                  <h2 className="font-heading font-bold text-base sm:text-lg text-white leading-snug">
                    {post.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#d2d2d2] leading-relaxed whitespace-pre-line">
                    {post.content}
                  </p>
                </div>

                {/* Optional Media Image */}
                {post.imageUrl && (
                  <div className="rounded-2xl overflow-hidden border border-[#2a2e39] max-h-80 bg-[#131418]">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Interaction Footer */}
                <div className="pt-3 border-t border-[#2a2e39] flex items-center justify-between text-xs text-[#94a3b8]">
                  <div className="flex items-center gap-2 sm:gap-4">
                    {/* Like Button */}
                    <button
                      type="button"
                      id={`like-btn-${post.id}`}
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl transition-all cursor-pointer ${
                        isLiked
                          ? 'bg-rose-500/20 text-rose-400 font-bold'
                          : 'hover:bg-[#1b1d23] hover:text-white'
                      }`}
                    >
                      <Heart
                        className={`w-4 h-4 ${isLiked ? 'fill-rose-400 text-rose-400' : ''}`}
                      />
                      <span>{post.likesCount} Apoios</span>
                    </button>

                    {/* Comments Toggle Button */}
                    <button
                      type="button"
                      id={`comment-toggle-btn-${post.id}`}
                      onClick={() =>
                        setActiveCommentPostId(isCommentsOpen ? null : post.id)
                      }
                      className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl transition-all cursor-pointer ${
                        isCommentsOpen
                          ? 'bg-[#3a6ea5]/20 text-[#70f3ff] font-bold'
                          : 'hover:bg-[#1b1d23] hover:text-white'
                      }`}
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.commentsCount || post.comments?.length || 0} Comentários</span>
                    </button>
                  </div>

                  <div className="text-[11px] text-[#686868] flex items-center gap-1">
                    <Lock className="w-3 h-3 text-[#70f3ff]" />
                    <span className="hidden sm:inline">Identidade protegida</span>
                  </div>
                </div>

                {/* Expanded Comments Section */}
                {isCommentsOpen && (
                  <div className="pt-4 border-t border-[#2a2e39] space-y-3 animate-fade-in">
                    {/* Comments List */}
                    <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                      {post.comments && post.comments.length > 0 ? (
                        post.comments.map((comm) => (
                          <div
                            key={comm.id}
                            className="p-3 rounded-2xl bg-[#131418] border border-[#2a2e39] space-y-1"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                                <span
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: comm.avatarColor }}
                                />
                                {comm.authorAlias}
                              </span>
                              <span className="text-[10px] text-[#686868]">
                                {new Date(comm.createdAt).toLocaleTimeString('pt-BR', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                            <p className="text-xs text-[#d2d2d2] leading-relaxed">
                              {comm.content}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-[#686868] text-center py-2">
                          Nenhum comentário anônimo ainda. Envie uma resposta solidária!
                        </p>
                      )}
                    </div>

                    {/* Add Comment Input */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendComment(post.id);
                          }
                        }}
                        placeholder="Escreva um comentário anônimo..."
                        className="flex-1 bg-[#1b1d23] border border-[#2a2e39] focus:border-[#70f3ff] rounded-xl px-4 py-2 text-xs text-white placeholder-[#686868] outline-none transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => handleSendComment(post.id)}
                        disabled={isSubmittingComment || !commentInput.trim()}
                        className="px-4 py-2 rounded-xl bg-[#a48ca7] hover:bg-[#967d99] text-white font-bold text-xs disabled:opacity-50 transition-all cursor-pointer flex items-center gap-1"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Enviar</span>
                      </button>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      {/* ================= MODAL: CRIAR PUBLICAÇÃO ANÔNIMA ================= */}
      {isCreatingPost && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-[#171920] border border-[#2a2e39] rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-7 space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-[#2a2e39] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#a48ca7]/20 border border-[#a48ca7]/40 flex items-center justify-center text-[#dfcf93]">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-white">
                    Nova Publicação Anônima
                  </h3>
                  <p className="text-[11px] text-[#94a3b8]">
                    Seu nome real e e-mail jamais serão exibidos publicamente.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreatingPost(false)}
                className="w-8 h-8 rounded-xl bg-[#1b1d23] hover:bg-[#2a2e39] text-[#94a3b8] hover:text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {postSuccess && (
              <div className="p-3.5 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Publicação compartilhada com sucesso!</span>
              </div>
            )}

            <form onSubmit={handleCreatePostSubmit} className="space-y-4">
              {/* Category selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#94a3b8]">
                  Categoria da publicação
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-[#1b1d23] border border-[#2a2e39] focus:border-[#70f3ff] rounded-xl px-4 py-2.5 text-xs text-white outline-none transition-colors"
                >
                  <option value="relato_golpe">Relato de Golpe (Experiência Vivida)</option>
                  <option value="alerta_urgente">Alerta Urgente (Golpe em Andamento)</option>
                  <option value="duvida_seguranca">Dúvida de Segurança Digital</option>
                  <option value="dica_prevencao">Dica de Prevenção e Defesa</option>
                  <option value="desabafo_apoio">Apoio, Empatia & Acolhimento</option>
                </select>
              </div>

              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#94a3b8]">
                  Título do relato / alerta <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Cuidado com falso SMS do Banco pedindo para confirmar Pix"
                  className="w-full bg-[#1b1d23] border border-[#2a2e39] focus:border-[#70f3ff] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-[#686868] outline-none transition-colors"
                />
              </div>

              {/* Content */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#94a3b8]">
                  Conteúdo detalhado <span className="text-rose-400">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Conte o que aconteceu, quais canais usaram, como desconfiou ou como as pessoas podem se proteger..."
                  className="w-full bg-[#1b1d23] border border-[#2a2e39] focus:border-[#70f3ff] rounded-xl p-4 text-xs sm:text-sm text-white placeholder-[#686868] outline-none transition-colors resize-none"
                />
              </div>

              {/* State UF tag (optional) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#94a3b8]">
                  Estado / UF (Opcional para alertas regionais)
                </label>
                <input
                  type="text"
                  maxLength={2}
                  value={newStateCode}
                  onChange={(e) => setNewStateCode(e.target.value.toUpperCase())}
                  placeholder="Ex: SP, RJ, MG, BA"
                  className="w-32 bg-[#1b1d23] border border-[#2a2e39] focus:border-[#70f3ff] rounded-xl px-4 py-2 text-xs text-white placeholder-[#686868] outline-none transition-colors"
                />
              </div>

              {/* Pseudonym banner */}
              <div className="p-3 rounded-2xl bg-[#131418] border border-[#2a2e39] text-[11px] text-[#94a3b8] flex items-center gap-2.5">
                <Shield className="w-4 h-4 text-[#70f3ff] shrink-0" />
                <span>
                  Um pseudônimo aleatório como <strong className="text-white">Cidadão Protegido #000</strong> será atribuído a este post.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingPost(false)}
                  className="flex-1 py-3 rounded-xl bg-[#1b1d23] hover:bg-[#2a2e39] text-[#94a3b8] hover:text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPost || !newTitle.trim() || !newContent.trim()}
                  className="flex-1 py-3 rounded-xl bg-[#a48ca7] hover:bg-[#967d99] text-white font-heading font-bold text-xs disabled:opacity-50 transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmittingPost ? (
                    <span>Publicando...</span>
                  ) : (
                    <>
                      <span>Publicar Anonimamente</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
