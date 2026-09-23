import React, { createContext, useContext, useState, useEffect } from 'react';

interface HighContrastContextType {
  isHighContrast: boolean;
  toggleHighContrast: () => void;
  setHighContrast: (value: boolean) => void;
}

const HighContrastContext = createContext<HighContrastContextType | undefined>(undefined);

const STORAGE_KEY = 'happywind_high_contrast';

export const HighContrastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isHighContrast, setIsHighContrastState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        return saved === 'true';
      }
      // Check system preference
      if (typeof window !== 'undefined' && window.matchMedia) {
        return window.matchMedia('(prefers-contrast: more)').matches;
      }
    } catch {
      // LocalStorage or matchMedia might fail in restricted environments
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isHighContrast) {
      root.classList.add('high-contrast');
      root.setAttribute('data-high-contrast', 'true');
    } else {
      root.classList.remove('high-contrast');
      root.setAttribute('data-high-contrast', 'false');
    }

    try {
      localStorage.setItem(STORAGE_KEY, String(isHighContrast));
    } catch {
      // Ignore storage errors
    }
  }, [isHighContrast]);

  const toggleHighContrast = () => {
    setIsHighContrastState((prev) => !prev);
  };

  const setHighContrast = (value: boolean) => {
    setIsHighContrastState(value);
  };

  return (
    <HighContrastContext.Provider value={{ isHighContrast, toggleHighContrast, setHighContrast }}>
      {children}
    </HighContrastContext.Provider>
  );
};

export function useHighContrast(): HighContrastContextType {
  const context = useContext(HighContrastContext);
  if (!context) {
    throw new Error('useHighContrast must be used within a HighContrastProvider');
  }
  return context;
}
