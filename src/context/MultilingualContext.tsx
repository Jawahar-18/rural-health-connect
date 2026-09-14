import React, { createContext, useContext, useState, useEffect } from 'react';
import type { LanguageCode } from '../types';
import { translations } from '../utils/translations';

interface MultilingualContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, fallback?: string) => string;
}

const MultilingualContext = createContext<MultilingualContextType | undefined>(undefined);

export const MultilingualProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem('rhc_language') as LanguageCode;
      if (saved && (saved === 'en' || saved === 'mr' || saved === 'hi' || saved === 'ta')) {
        return saved;
      }
    } catch {
      // localStorage may fail in restricted environments
    }
    return 'en';
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('rhc_language', lang);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string, fallback?: string): string => {
    const langDict = translations[language];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    const enDict = translations['en'];
    if (enDict && enDict[key]) {
      return enDict[key];
    }
    return fallback || key;
  };

  return (
    <MultilingualContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </MultilingualContext.Provider>
  );
};

export const useTranslation = (): MultilingualContextType => {
  const context = useContext(MultilingualContext);
  if (!context) {
    throw new Error('useTranslation must be used within a MultilingualProvider');
  }
  return context;
};

