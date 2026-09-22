import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, AuthState } from '../types';

interface RegisterData {
  name: string;
  email: string;
  birthDate: string;
  password: string;
  isProfessional?: boolean;
}

interface AuthContextType extends AuthState {
  authMode: 'login' | 'register';
  isAuthModalOpen: boolean;
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  setAuthMode: (mode: 'login' | 'register') => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  loginSocial: (provider: 'google' | 'microsoft') => Promise<{ success: boolean; error?: string }>;
  updateProfile: (data: Partial<UserProfile> & { password?: string }) => Promise<{ success: boolean; error?: string }>;
  deleteAccount: () => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USER_KEY = 'aegis_auth_user';
const LOCAL_STORAGE_TOKEN_KEY = 'aegis_auth_token';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error('Erro ao restaurar sessão de usuário:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Erro ao realizar login.' };
      }

      setUser(data.user);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(data.user));
      localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, data.token);
      setIsAuthModalOpen(false);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: 'Falha de conexão com o servidor Aegis.' };
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const resData = await res.json();
      if (!res.ok) {
        return { success: false, error: resData.error || 'Erro ao realizar cadastro.' };
      }

      setUser(resData.user);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(resData.user));
      localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, resData.token);
      setIsAuthModalOpen(false);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: 'Falha de conexão com o servidor Aegis.' };
    }
  };

  const loginSocial = async (provider: 'google' | 'microsoft') => {
    try {
      const defaultEmail = provider === 'google' ? 'usuario.google@gmail.com' : 'usuario.ms@outlook.com';
      const defaultName = provider === 'google' ? 'Usuário Google' : 'Usuário Microsoft';

      const res = await fetch('/api/auth/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, email: defaultEmail, name: defaultName }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Erro no login social.' };
      }

      setUser(data.user);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(data.user));
      localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, data.token);
      setIsAuthModalOpen(false);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: 'Falha na autenticação externa.' };
    }
  };

  const updateProfile = async (data: Partial<UserProfile> & { password?: string }) => {
    if (!user) return { success: false, error: 'Usuário não autenticado.' };
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, ...data }),
      });

      const resData = await res.json();
      if (!res.ok) {
        return { success: false, error: resData.error || 'Erro ao atualizar perfil.' };
      }

      setUser(resData.user);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(resData.user));
      return { success: true };
    } catch (e: any) {
      return { success: false, error: 'Falha de comunicação ao atualizar perfil.' };
    }
  };

  const deleteAccount = async () => {
    if (!user) return { success: false, error: 'Usuário não autenticado.' };
    try {
      const res = await fetch(`/api/auth/profile/${user.id}`, {
        method: 'DELETE',
      });

      const resData = await res.json();
      if (!res.ok) {
        return { success: false, error: resData.error || 'Erro ao excluir conta.' };
      }

      logout();
      return { success: true };
    } catch (e: any) {
      return { success: false, error: 'Falha de comunicação ao excluir conta.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        authMode,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        setAuthMode,
        login,
        register,
        loginSocial,
        updateProfile,
        deleteAccount,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
