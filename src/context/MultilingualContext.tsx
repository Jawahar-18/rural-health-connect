import React, { createContext, useContext, useState } from 'react';
import type { LanguageCode } from '../types';
import { translations } from '../utils/translations';

interface MultilingualContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
}

const MultilingualContext = createContext<MultilingualContextType | undefined>(undefined);

export const MultilingualProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<LanguageCode>('en');

  const t = (key: string): string => {
    const langDict = translations[language] || translations['en'];
    return langDict[key] || translations['en'][key] || key;
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
