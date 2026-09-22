import React, { useState, useEffect } from 'react';
import {
  Lock,
  Unlock,
  Key,
  ShieldCheck,
  Eye,
  EyeOff,
  Copy,
  Check,
  Plus,
  Trash2,
  RefreshCw,
  Sparkles,
  Sliders,
  AlertTriangle,
  FileText,
  CreditCard,
  Globe,
  Fingerprint,
} from 'lucide-react';
import { VaultItem } from '../types';
import { INITIAL_VAULT_ITEMS } from '../data/securityData';

export const DigitalVaultView: React.FC = () => {
  const [vaultItems, setVaultItems] = useState<VaultItem[]>(() => {
    const saved = localStorage.getItem('aegis_vault_items');
    return saved ? JSON.parse(saved) : INITIAL_VAULT_ITEMS;
  });

  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showNewItemModal, setShowNewItemModal] = useState(false);
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Generator states
  const [genLength, setGenLength] = useState(18);
  const [genIncludeSymbols, setGenIncludeSymbols] = useState(true);
  const [genIncludeNumbers, setGenIncludeNumbers] = useState(true);
  const [genIncludeUppercase, setGenIncludeUppercase] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState('');

  // Password Strength Checker
  const [testPassword, setTestPassword] = useState('');

  // New item form
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'bank' | 'social' | 'email' | 'crypto' | 'note'>('social');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newNotes, setNewNotes] = useState('');

  useEffect(() => {
    localStorage.setItem('aegis_vault_items', JSON.stringify(vaultItems));
  }, [vaultItems]);

  useEffect(() => {
    generateRandomPassword();
  }, [genLength, genIncludeSymbols, genIncludeNumbers, genIncludeUppercase]);

  const generateRandomPassword = () => {
    let chars = 'abcdefghijklmnopqrstuvwxyz';
    if (genIncludeUppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (genIncludeNumbers) chars += '0123456789';
    if (genIncludeSymbols) chars += '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    let result = '';
    const array = new Uint32Array(genLength);
    crypto.getRandomValues(array);
    for (let i = 0; i < genLength; i++) {
      result += chars[array[i] % chars.length];
    }
    setGeneratedPassword(result);
  };

  const calculateStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: 'Vazia', color: 'text-slate-400', timeToCrack: '0 segundos' };
    let score = 0;
    if (pwd.length >= 8) score += 20;
    if (pwd.length >= 14) score += 30;
    if (/[A-Z]/.test(pwd)) score += 15;
    if (/[0-9]/.test(pwd)) score += 15;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 20;

    let label = 'Muito Fraca';
    let color = 'text-rose-600';
    let timeToCrack = 'Alguns segundos';

    if (score >= 80) {
      label = 'Excelente (Nível Máximo)';
      color = 'text-emerald-600';
      timeToCrack = '400 trilhões de anos';
    } else if (score >= 60) {
      label = 'Forte';
      color = 'text-blue-600';
      timeToCrack = '3.000 anos';
    } else if (score >= 40) {
      label = 'Moderada';
      color = 'text-amber-600';
      timeToCrack = '3 dias';
    }

    return { score, label, color, timeToCrack };
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const strengthObj = calculateStrength(newPassword);
    const item: VaultItem = {
      id: `vault-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      username: newUsername,
      password: newPassword,
      strength: strengthObj.score >= 70 ? 'strong' : strengthObj.score >= 45 ? 'medium' : 'weak',
      lastUpdated: 'Agora',
      notes: newNotes,
    };

    setVaultItems([item, ...vaultItems]);
    setShowNewItemModal(false);
    setNewTitle('');
    setNewUsername('');
    setNewPassword('');
    setNewNotes('');
  };

  const handleDelete = (id: string) => {
    setVaultItems(vaultItems.filter((i) => i.id !== id));
  };

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredItems = vaultItems.filter(
    (i) => filterCategory === 'all' || i.category === filterCategory
  );

  const testStrength = calculateStrength(testPassword);

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3a6ea5]/20 border border-[#70f3ff]/30 text-[#70f3ff] text-xs font-semibold mb-1.5">
            <Lock className="w-3.5 h-3.5" />
            <span>Criptografia Local</span>
          </div>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-white tracking-tight">
            Cofre de Senhas & Chaves
          </h1>
          <p className="text-xs sm:text-sm text-[#94a3b8] mt-1">
            Armazenamento seguro, gerador de chaves fortes e diagnóstico de vulnerabilidade de senhas.
          </p>
        </div>

        <button
          onClick={() => setShowNewItemModal(true)}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-[#3a6ea5] hover:bg-[#3a6ea5]/80 text-white font-heading font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#70f3ff]" />
          <span>Guardar Nova Senha</span>
        </button>
      </div>

      {/* Generator & Strength Checker Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Generator */}
        <div className="lg:col-span-7 bg-[#1b1d23] p-6 sm:p-7 rounded-2xl border border-[#2a2e39] space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-[#70f3ff]" />
              <h2 className="font-heading font-bold text-base text-white">
                Gerador de Senhas Seguras
              </h2>
            </div>
            <button
              onClick={generateRandomPassword}
              className="p-1.5 rounded-lg bg-[#23262f] hover:bg-[#2a2e39] text-[#d2d2d2] transition-colors cursor-pointer border border-[#323744]"
              title="Gerar nova senha"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Generated Result Output */}
          <div className="flex items-center gap-2 p-3 bg-[#14151a] rounded-xl border border-[#323744]">
            <span className="font-mono text-sm sm:text-base text-[#70f3ff] font-bold flex-1 truncate select-all tracking-wider">
              {generatedPassword}
            </span>
            <button
              onClick={() => handleCopy(generatedPassword, 'gen')}
              className="px-3 py-1.5 rounded-lg bg-[#3a6ea5] hover:bg-[#3a6ea5]/80 text-white font-heading font-semibold text-xs flex items-center gap-1 shrink-0 shadow-2xs cursor-pointer"
            >
              {copiedId === 'gen' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedId === 'gen' ? 'Copiado!' : 'Copiar'}</span>
            </button>
          </div>

          {/* Controls */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs text-[#d2d2d2]">
              <span>Comprimento: <strong className="text-white">{genLength} caracteres</strong></span>
              <input
                type="range"
                min="8"
                max="36"
                value={genLength}
                onChange={(e) => setGenLength(Number(e.target.value))}
                className="w-44 accent-[#70f3ff] cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs text-[#d2d2d2]">
              <label className="flex items-center gap-1.5 cursor-pointer bg-[#14151a] p-2.5 rounded-lg border border-[#2a2e39] hover:bg-[#23262f]">
                <input
                  type="checkbox"
                  checked={genIncludeUppercase}
                  onChange={(e) => setGenIncludeUppercase(e.target.checked)}
                  className="accent-[#3a6ea5]"
                />
                <span>Maiúsculas (A-Z)</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer bg-[#14151a] p-2.5 rounded-lg border border-[#2a2e39] hover:bg-[#23262f]">
                <input
                  type="checkbox"
                  checked={genIncludeNumbers}
                  onChange={(e) => setGenIncludeNumbers(e.target.checked)}
                  className="accent-[#3a6ea5]"
                />
                <span>Números (0-9)</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer bg-[#14151a] p-2.5 rounded-lg border border-[#2a2e39] hover:bg-[#23262f]">
                <input
                  type="checkbox"
                  checked={genIncludeSymbols}
                  onChange={(e) => setGenIncludeSymbols(e.target.checked)}
                  className="accent-[#3a6ea5]"
                />
                <span>Símbolos (!@#)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Password Strength Analyzer */}
        <div className="lg:col-span-5 bg-[#1b1d23] p-6 sm:p-7 rounded-2xl border border-[#2a2e39] space-y-4 shadow-xl">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="font-heading font-bold text-base text-white">
              Avaliador de Força de Senha
            </h2>
          </div>
          <p className="text-xs text-[#94a3b8]">
            Teste qualquer senha para descobrir a segurança e tempo de quebra.
          </p>

          <input
            type="text"
            value={testPassword}
            onChange={(e) => setTestPassword(e.target.value)}
            placeholder="Digite uma senha para testar..."
            className="w-full bg-[#14151a] border border-[#323744] focus:border-[#70f3ff] rounded-xl px-3.5 py-2.5 text-sm text-[#d2d2d2] placeholder-[#686868] focus:outline-none font-mono"
          />

          {testPassword && (
            <div className="p-3.5 rounded-xl bg-[#14151a] border border-[#2a2e39] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#94a3b8]">Nível de Proteção:</span>
                <span className={`font-bold ${testStrength.color}`}>
                  {testStrength.label} ({testStrength.score}%)
                </span>
              </div>
              <div className="w-full bg-[#23262f] h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    testStrength.score >= 70
                      ? 'bg-emerald-400'
                      : testStrength.score >= 40
                      ? 'bg-[#dfcf93]'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${testStrength.score}%` }}
                />
              </div>
              <p className="text-xs text-[#94a3b8] pt-1">
                ⏱️ <strong className="text-white">Tempo estimado para quebra:</strong> {testStrength.timeToCrack}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Stored Vault Items List */}
      <section className="bg-[#1b1d23] p-6 sm:p-7 rounded-2xl border border-[#2a2e39] space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-heading font-bold text-base sm:text-lg text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#70f3ff]" />
              <span>Suas Contas & Chaves Salvas</span>
            </h2>
            <p className="text-xs text-[#686868]">
              {vaultItems.length} registros guardados com segurança no dispositivo.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {['all', 'bank', 'social', 'email', 'crypto'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-heading font-semibold capitalize cursor-pointer transition-colors ${
                  filterCategory === cat
                    ? 'bg-[#3a6ea5] text-white shadow-2xs'
                    : 'bg-[#14151a] text-[#686868] hover:bg-[#23262f] border border-[#2a2e39]'
                }`}
              >
                {cat === 'all' ? 'Todas' : cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredItems.map((item) => {
            const isRevealed = !!revealedIds[item.id];
            return (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-[#14151a] border border-[#2a2e39] space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-[#23262f] border border-[#323744] text-[#70f3ff] shadow-2xs">
                      {item.category === 'bank' ? (
                        <CreditCard className="w-4 h-4" />
                      ) : item.category === 'social' ? (
                        <Globe className="w-4 h-4" />
                      ) : (
                        <Lock className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-sm text-white">
                        {item.title}
                      </h3>
                      <span className="text-xs text-[#686868]">{item.username}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-[#686868] hover:text-rose-400 p-1 cursor-pointer"
                    title="Excluir do cofre"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Password field */}
                <div className="flex items-center justify-between gap-2 bg-[#1b1d23] p-2.5 rounded-lg border border-[#323744]">
                  <span className="font-mono text-xs text-[#d2d2d2] truncate flex-1 font-medium">
                    {isRevealed ? item.password : '••••••••••••••••'}
                  </span>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => toggleReveal(item.id)}
                      className="p-1 text-[#686868] hover:text-[#d2d2d2] cursor-pointer"
                      title={isRevealed ? 'Ocultar' : 'Mostrar'}
                    >
                      {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => handleCopy(item.password, item.id)}
                      className="p-1 text-[#70f3ff] hover:text-white cursor-pointer"
                      title="Copiar senha"
                    >
                      {copiedId === item.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {item.notes && (
                  <p className="text-xs text-[#686868] italic line-clamp-1">
                    Nota: {item.notes}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* New Vault Item Modal */}
      {showNewItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-[#1b1d23] border border-[#2a2e39] rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#2a2e39] pb-3">
              <h3 className="font-heading font-bold text-base text-white">
                Guardar Nova Conta no Cofre
              </h3>
              <button
                onClick={() => setShowNewItemModal(false)}
                className="text-[#686868] hover:text-[#d2d2d2] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#d2d2d2] block mb-1">
                  Nome do Serviço / Banco:
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Nubank, Instagram, E-mail Pessoal"
                  className="w-full bg-[#14151a] border border-[#323744] rounded-xl px-3 py-2 text-sm text-[#d2d2d2] placeholder-[#686868] focus:outline-none focus:border-[#70f3ff]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#d2d2d2] block mb-1">
                  Categoria:
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-[#14151a] border border-[#323744] rounded-xl px-3 py-2 text-sm text-[#d2d2d2] focus:outline-none focus:border-[#70f3ff]"
                >
                  <option value="bank">Banco / Financeiro</option>
                  <option value="social">Rede Social</option>
                  <option value="email">E-mail</option>
                  <option value="crypto">Chaves Cripto / Pix</option>
                  <option value="note">Anotação Segura</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#d2d2d2] block mb-1">
                  Usuário / E-mail / Chave:
                </label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="Ex: seu.email@exemplo.com"
                  className="w-full bg-[#14151a] border border-[#323744] rounded-xl px-3 py-2 text-sm text-[#d2d2d2] placeholder-[#686868] focus:outline-none focus:border-[#70f3ff]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-[#d2d2d2] block">
                    Senha:
                  </label>
                  <button
                    type="button"
                    onClick={() => setNewPassword(generatedPassword)}
                    className="text-xs text-[#70f3ff] hover:underline cursor-pointer font-medium"
                  >
                    Usar senha gerada
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Digite ou cole a senha..."
                  className="w-full bg-[#14151a] border border-[#323744] rounded-xl px-3 py-2 text-sm text-[#d2d2d2] placeholder-[#686868] focus:outline-none focus:border-[#70f3ff] font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#686868] block mb-1">
                  Notas adicionais (opcional):
                </label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Ex: PIN secundário, agência..."
                  className="w-full bg-[#14151a] border border-[#323744] rounded-xl px-3 py-2 text-xs text-[#d2d2d2] placeholder-[#686868] focus:outline-none focus:border-[#70f3ff]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowNewItemModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#23262f] text-[#d2d2d2] hover:bg-[#2a2e39] text-xs font-semibold cursor-pointer border border-[#323744]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#3a6ea5] hover:bg-[#3a6ea5]/80 text-white font-heading font-semibold text-xs cursor-pointer shadow-xs"
                >
                  Salvar no Cofre
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

