// Internationalization system for Step Up Naija
// Supporting Nigeria's major languages: English, Hausa, Yoruba, and Igbo

export type Language = 'en' | 'ha' | 'yo' | 'ig';

export interface LanguageInfo {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

export const supportedLanguages: LanguageInfo[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧'
  },
  {
    code: 'ha',
    name: 'Hausa',
    nativeName: 'Hausa',
    flag: '🌍'
  },
  {
    code: 'yo',
    name: 'Yoruba',
    nativeName: 'Yorùbá',
    flag: '🌍'
  },
  {
    code: 'ig',
    name: 'Igbo',
    nativeName: 'Igbo',
    flag: '🌍'
  }
];

export const defaultLanguage: Language = 'en';

// Get browser language preference with fallback
export function getBrowserLanguage(): Language {
  if (typeof window === 'undefined') return defaultLanguage;
  
  const browserLang = navigator.language.split('-')[0] as Language;
  const supportedCodes = supportedLanguages.map(lang => lang.code);
  
  return supportedCodes.includes(browserLang) ? browserLang : defaultLanguage;
}

// Save language preference to localStorage
export function saveLanguagePreference(language: Language): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('step-up-naija-language', language);
  }
}

// Load language preference from localStorage
export function loadLanguagePreference(): Language {
  if (typeof window === 'undefined') return defaultLanguage;
  
  const saved = localStorage.getItem('step-up-naija-language') as Language;
  const supportedCodes = supportedLanguages.map(lang => lang.code);
  
  return saved && supportedCodes.includes(saved) ? saved : getBrowserLanguage();
}