import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { dataStore } from '../data/store';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (phone: string, password: string) => Promise<boolean>;
  register: (username: string, phone: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUserId = localStorage.getItem('currentUserId');
    if (savedUserId) {
      const savedUser = dataStore.getUserById(savedUserId);
      if (savedUser) {
        setUser(savedUser);
      }
    }
  }, []);

  const login = async (phone: string, _password: string): Promise<boolean> => {
    const foundUser = dataStore.getUserByPhone(phone);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('currentUserId', foundUser.id);
      return true;
    }
    return false;
  };

  const register = async (username: string, phone: string, _password: string): Promise<boolean> => {
    const existingUser = dataStore.getUserByPhone(phone);
    if (existingUser) {
      return false;
    }
    const newUser = dataStore.createUser({
      username,
      phone,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
      isMerchant: false,
    });
    setUser(newUser);
    localStorage.setItem('currentUserId', newUser.id);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUserId');
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = dataStore.updateUser(user.id, updates);
      if (updatedUser) {
        setUser(updatedUser);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
