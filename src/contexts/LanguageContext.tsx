// Language Context for Step Up Naija internationalization

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, type Language, type Translation } from '@/i18n/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: Translation;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(() => {
    // Get saved language from localStorage or default to English
    const saved = localStorage.getItem('stepup_language') as Language;
    return saved && translations[saved] ? saved : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('stepup_language', lang);
    
    // Update document direction for RTL languages (if any are added)
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    // Set initial document language
    document.documentElement.lang = language;
  }, [language]);

  const contextValue: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language],
    isRTL: language === 'ar' // Currently no RTL languages, but prepared for Arabic if added
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

// Hook to use language context
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Hook to get translations directly
export function useTranslations() {
  const { t } = useLanguage();
  return { t };
}