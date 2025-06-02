
import React, { createContext, useContext, useState, useEffect } from 'react';

export type SpiritualTheme = 'desert' | 'ocean' | 'forest' | 'mountain';

interface ThemeContextType {
  theme: SpiritualTheme;
  setTheme: (theme: SpiritualTheme) => void;
  timeBasedBackground: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const themes = {
  desert: {
    gradient: 'from-amber-50 via-orange-50 to-red-50',
    primary: 'from-amber-400 to-orange-500',
    accent: 'amber'
  },
  ocean: {
    gradient: 'from-blue-50 via-cyan-50 to-teal-50',
    primary: 'from-blue-400 to-cyan-500',
    accent: 'blue'
  },
  forest: {
    gradient: 'from-green-50 via-emerald-50 to-teal-50',
    primary: 'from-green-400 to-emerald-500',
    accent: 'green'
  },
  mountain: {
    gradient: 'from-slate-50 via-gray-50 to-stone-50',
    primary: 'from-slate-400 to-gray-500',
    accent: 'slate'
  }
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<SpiritualTheme>(() => {
    const saved = localStorage.getItem('spiritual-theme');
    return (saved as SpiritualTheme) || 'desert';
  });

  const [timeBasedBackground, setTimeBasedBackground] = useState('');

  useEffect(() => {
    localStorage.setItem('spiritual-theme', theme);
    
    // Update CSS variables for the current theme
    const root = document.documentElement;
    const currentTheme = themes[theme];
    root.style.setProperty('--theme-gradient', currentTheme.gradient);
    root.style.setProperty('--theme-primary', currentTheme.primary);
    root.style.setProperty('--theme-accent', currentTheme.accent);
  }, [theme]);

  useEffect(() => {
    const updateTimeBasedBackground = () => {
      const hour = new Date().getHours();
      const currentTheme = themes[theme];
      
      if (hour >= 5 && hour < 12) {
        // Morning
        setTimeBasedBackground(`bg-gradient-to-br ${currentTheme.gradient}`);
      } else if (hour >= 12 && hour < 18) {
        // Afternoon
        setTimeBasedBackground(`bg-gradient-to-br ${currentTheme.gradient.replace('50', '100')}`);
      } else {
        // Evening/Night
        setTimeBasedBackground(`bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800`);
      }
    };

    updateTimeBasedBackground();
    const interval = setInterval(updateTimeBasedBackground, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, timeBasedBackground }}>
      {children}
    </ThemeContext.Provider>
  );
};
