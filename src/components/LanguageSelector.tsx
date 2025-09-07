// Enhanced Language selector component for Step Up Naija
// Allows users to switch between English, Hausa, Yoruba, and Igbo

import { useState } from 'react';
import { Check, Globe, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTranslation, SUPPORTED_LANGUAGES } from '@/hooks/useTranslation';

interface LanguageSelectorProps {
  compact?: boolean;
  showLabel?: boolean;
  variant?: 'dropdown' | 'select' | 'buttons';
  className?: string;
}

const languageFlags = {
  en: '🇺🇸',
  ha: '🇳🇬', 
  ig: '🇳🇬',
  yo: '🇳🇬'
};

const nativeNames = {
  en: 'English',
  ha: 'Harshen Hausa',
  ig: 'Asụsụ Igbo',
  yo: 'Èdè Yorùbá'
};

export function LanguageSelector({ 
  compact = false, 
  showLabel = true, 
  variant = 'dropdown',
  className = ''
}: LanguageSelectorProps) {
  const { language, setLanguage, isLoading } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    setIsOpen(false);
  };

  if (variant === 'buttons') {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => (
          <Button
            key={code}
            onClick={() => setLanguage(code)}
            variant={language === code ? 'default' : 'outline'}
            size="sm"
            disabled={isLoading}
            className={`flex items-center gap-2 ${
              language === code 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'hover:bg-green-50 hover:text-green-700 hover:border-green-300'
            }`}
            data-testid={`language-button-${code}`}
          >
            <span>{languageFlags[code as keyof typeof languageFlags]}</span>
            <span>{name}</span>
            {code !== 'en' && (
              <Badge variant="secondary" className="text-xs ml-1">
                Beta
              </Badge>
            )}
          </Button>
        ))}
      </div>
    );
  }

  if (variant === 'select') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Globe className="h-4 w-4 text-gray-500" />
        <Select
          value={language}
          onValueChange={setLanguage}
          disabled={isLoading}
        >
          <SelectTrigger className="w-[140px]" data-testid="language-select-trigger">
            <SelectValue>
              <div className="flex items-center gap-2">
                <span>{languageFlags[language as keyof typeof languageFlags]}</span>
                <span>{SUPPORTED_LANGUAGES[language as keyof typeof SUPPORTED_LANGUAGES]}</span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => (
              <SelectItem key={code} value={code} data-testid={`language-select-${code}`}>
                <div className="flex items-center gap-2">
                  <span>{languageFlags[code as keyof typeof languageFlags]}</span>
                  <span>{name}</span>
                  {code !== 'en' && (
                    <Badge variant="outline" className="text-xs ml-2">
                      Beta
                    </Badge>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {isLoading && (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
        )}
      </div>
    );
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size={compact ? "sm" : "default"}
          className={`gap-2 h-auto px-2 py-1.5 text-gray-700 hover:text-gray-900 hover:bg-gray-100 ${className}`}
          data-testid="language-selector-button"
          disabled={isLoading}
        >
          <Globe className="h-4 w-4" />
          {showLabel && (
            <span className="hidden sm:inline">
              {compact ? language.toUpperCase() : 'Language'}
            </span>
          )}
          <span className="text-sm">
            {languageFlags[language as keyof typeof languageFlags]}
          </span>
          {isLoading && (
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-green-600 ml-1"></div>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-48">
        {Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => handleLanguageChange(code)}
            className="flex items-center justify-between cursor-pointer"
            data-testid={`language-option-${code}`}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{languageFlags[code as keyof typeof languageFlags]}</span>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{name}</span>
                  {code !== 'en' && (
                    <Badge variant="outline" className="text-xs">
                      Beta
                    </Badge>
                  )}
                </div>
                {name !== nativeNames[code as keyof typeof nativeNames] && (
                  <span className="text-xs text-gray-500">{nativeNames[code as keyof typeof nativeNames]}</span>
                )}
              </div>
            </div>
            
            {language === code && (
              <Check className="h-4 w-4 text-green-600" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Language Toggle for mobile/compact spaces
export function LanguageToggle({ className = '' }: { className?: string }) {
  const { language, setLanguage } = useTranslation();
  
  const languages = Object.keys(SUPPORTED_LANGUAGES);
  const currentIndex = languages.indexOf(language);
  
  const toggleLanguage = () => {
    const nextIndex = (currentIndex + 1) % languages.length;
    setLanguage(languages[nextIndex]);
  };

  return (
    <Button
      onClick={toggleLanguage}
      variant="outline"
      size="sm"
      className={`flex items-center gap-2 ${className}`}
      data-testid="language-toggle-button"
    >
      <Languages className="h-4 w-4" />
      <span>{languageFlags[language as keyof typeof languageFlags]}</span>
      <span className="hidden sm:inline">
        {SUPPORTED_LANGUAGES[language as keyof typeof SUPPORTED_LANGUAGES]}
      </span>
    </Button>
  );
}