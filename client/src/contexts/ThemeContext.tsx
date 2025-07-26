import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

export type Theme = 'anurag-kashyap' | 'raju-hirani';

interface ThemeContextProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, _setTheme] = useState<Theme>('anurag-kashyap'); // Default to dark theme

  useEffect(() => {
    const storedTheme = localStorage.getItem('movie-masala-theme') as Theme;
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.setAttribute('data-theme', storedTheme);
    } else {
      document.documentElement.setAttribute('data-theme', 'anurag-kashyap');
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    _setTheme(newTheme);
    localStorage.setItem('movie-masala-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
