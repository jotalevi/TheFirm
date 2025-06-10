'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@/types';
import { login as apiLogin, getUser } from '@/services/api';
import { useRouter } from 'next/navigation';
import jwtDecode from 'jwt-decode';
import { toast } from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (run: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

interface JwtPayload {
  unique_name: string;
  exp: number;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Verificar si el token ha expirado
          const decoded = jwtDecode<JwtPayload>(token);
          const currentTime = Date.now() / 1000;
          
          if (decoded.exp < currentTime) {
            logout();
            return;
          }
          
          // Obtener información del usuario
          const userRun = decoded.unique_name;
          const userData = await getUser(userRun);
          setUser(userData);
        } catch (error) {
          console.error('Error al inicializar la autenticación:', error);
          logout();
        }
      }
      
      setIsLoading(false);
    };
    
    initializeAuth();
  }, []);

  const login = async (run: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await apiLogin({ run, passwordHash: password });
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        
        // Obtener información del usuario
        const decoded = jwtDecode<JwtPayload>(response.token);
        const userData = await getUser(decoded.unique_name);
        setUser(userData);
        
        toast.success('Inicio de sesión exitoso');
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      toast.error('Error al iniciar sesión. Verifica tus credenciales.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe utilizarse dentro de un AuthProvider');
  }
  return context;
}; 