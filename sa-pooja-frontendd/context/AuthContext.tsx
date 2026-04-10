
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, UserRole } from '../types';

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signUp: (email: string, password: string, name: string, contact?: string) => Promise<{ error?: string }>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  session: any; // Kept for compatibility with existing components
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = 'http://localhost:5000/api';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local storage for existing session
    const savedUser = localStorage.getItem('jj_user');
    const token = localStorage.getItem('jj_token');
    
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const signUp = async (email: string, password: string, name: string, contact?: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, contact })
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.message || 'Registration failed' };
      }

      // Store in local storage for persistence
      localStorage.setItem('jj_token', data.token);
      localStorage.setItem('jj_user', JSON.stringify(data.user));
      setUser(data.user);

      return {};
    } catch (error) {
      console.error('SignUp error:', error);
      return { error: 'Backend service unavailable. Please ensure the backend is running on port 5000.' };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.message || 'Login failed' };
      }

      localStorage.setItem('jj_token', data.token);
      localStorage.setItem('jj_user', JSON.stringify(data.user));
      setUser(data.user);

      return {};
    } catch (error) {
      console.error('SignIn error:', error);
      return { error: 'Backend service unavailable. Please ensure the backend is running on port 5000.' };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('jj_token');
    localStorage.removeItem('jj_user');
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    signUp,
    signIn,
    signOut,
    session: user ? { user } : null // Mock session for compatibility
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

