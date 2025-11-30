import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '../types';
import { saveUser, getUser, removeUser } from '../utils/storage';

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredUser();
  }, []);

  const loadStoredUser = async () => {
    try {
      const storedUser = await getUser();
      setUser(storedUser);
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      // Mock authentication - in a real app, this would call an API
      // For demo purposes, we'll create a user or use existing one
      const existingUser = await getUser();
      
      if (existingUser && existingUser.email === email) {
        setUser(existingUser);
        return;
      }

      // Create new user for demo
      const newUser: User = {
        id: Date.now().toString(),
        name: email.split('@')[0],
        email,
        isPremium: false,
        createdAt: new Date(),
      };

      await saveUser(newUser);
      setUser(newUser);
    } catch (error) {
      console.error('Error signing in:', error);
      throw new Error('Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  const signUp = async (name: string, email: string, password: string): Promise<void> => {
    try {
      // Mock registration - in a real app, this would call an API
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        isPremium: false,
        createdAt: new Date(),
      };

      await saveUser(newUser);
      setUser(newUser);
    } catch (error) {
      console.error('Error signing up:', error);
      throw new Error('Erro ao criar conta. Tente novamente.');
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await removeUser();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw new Error('Erro ao fazer logout.');
    }
  };

  const updateUser = async (userData: Partial<User>): Promise<void> => {
    try {
      if (!user) throw new Error('Usuário não encontrado');

      const updatedUser = { ...user, ...userData };
      await saveUser(updatedUser);
      setUser(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Erro ao atualizar usuário.');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
