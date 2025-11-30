import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Theme } from '../types';
import { defaultTheme, premiumTheme } from '../utils/theme';
import { useAuth } from './AuthContext';

interface ThemeContextData {
  theme: Theme;
  setCustomTheme: (theme: Theme) => void;
  resetTheme: () => void;
}

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [customTheme, setCustomTheme] = useState<Theme | null>(null);

  const getCurrentTheme = (): Theme => {
    if (customTheme) return customTheme;
    return user?.isPremium ? premiumTheme : defaultTheme;
  };

  const setTheme = (theme: Theme) => {
    if (user?.isPremium) {
      setCustomTheme(theme);
    }
  };

  const resetTheme = () => {
    setCustomTheme(null);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: getCurrentTheme(),
        setCustomTheme: setTheme,
        resetTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextData => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
