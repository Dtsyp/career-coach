import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth';
import { UserPublic } from '../types/user';

interface AuthContextType {
  user: UserPublic | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    username: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserPublic | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        } catch {
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await authService.login({ email, password });
      localStorage.setItem('access_token', response.access_token);
      const userData = await authService.getCurrentUser();
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error: unknown) {
      const errorResponse = error as { response?: { status?: number } };
      if (errorResponse?.response?.status === 401) {
        throw new Error('Неверный email или пароль');
      } else if (errorResponse?.response?.status === 404) {
        throw new Error('Пользователь не найден');
      } else if (errorResponse?.response?.status === 422) {
        throw new Error('Неверный формат данных');
      } else {
        throw new Error('Ошибка подключения к серверу');
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string,
    username: string,
    password: string
  ) => {
    setLoading(true);
    try {
      const response = await authService.register({
        email,
        name: username,
        password,
      });
      localStorage.setItem('access_token', response.access_token);
      const userData = await authService.getCurrentUser();
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch {
      throw new Error('Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
  };

  const resetPassword = async (_email: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const value = {
    user,
    login,
    register,
    logout,
    resetPassword,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
