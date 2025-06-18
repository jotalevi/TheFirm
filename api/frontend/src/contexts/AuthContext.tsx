'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  run: string;
  firstNames: string;
  lastNames: string;
  email: string;
  phone: string;
  isAdmin: boolean;
  companiesModerated?: number[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (run: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isModerator: boolean;
  companiesModerated: number[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Verificar si hay un token guardado al cargar la aplicación
  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('auth_user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    
    setIsLoading(false);
  }, []);

  const login = async (run: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5100'}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          run,
          passwordHash: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const authToken = data.token;
        
        // Guardar token en localStorage
        localStorage.setItem('auth_token', authToken);
        setToken(authToken);

        // Obtener información del usuario
        const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5100'}/users/${run}`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          // Obtener empresas donde es moderador
          const modCompaniesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5100'}/users/${run}/companies-moderated`, {
            headers: {
              'Authorization': `Bearer ${authToken}`,
            },
          });
          let companiesModerated: number[] = [];
          if (modCompaniesRes.ok) {
            companiesModerated = await modCompaniesRes.json();
          }
          const userWithRoles = { ...userData, companiesModerated };
          localStorage.setItem('auth_user', JSON.stringify(userWithRoles));
          setUser(userWithRoles);
        }

        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setToken(null);
    setUser(null);
    router.push('/login');
  };

  const isAuthenticated = !!token && !!user;
  const isAdmin = !!user?.isAdmin;
  const isModerator = !!user?.companiesModerated && user.companiesModerated.length > 0;

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isLoading,
    isAuthenticated,
    isAdmin,
    isModerator,
    companiesModerated: user?.companiesModerated || [],
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 