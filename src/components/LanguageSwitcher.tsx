import { Globe } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { supportedLanguages } from '@/i18n/translations';

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();

  const currentLanguage = supportedLanguages.find(lang => lang.code === language);

  return (
    <Select value={language} onValueChange={setLanguage} data-testid="language-switcher">
      <SelectTrigger className="w-[140px] h-9">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <SelectValue>
            {currentLanguage?.nativeName || 'English'}
          </SelectValue>
        </div>
      </SelectTrigger>
      <SelectContent>
        {supportedLanguages.map((lang) => (
          <SelectItem 
            key={lang.code} 
            value={lang.code}
            data-testid={`language-option-${lang.code}`}
          >
            <div className="flex flex-col">
              <span className="font-medium">{lang.nativeName}</span>
              <span className="text-xs text-muted-foreground">{lang.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// Compact version for mobile
export function MobileLanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const currentLanguage = supportedLanguages.find(lang => lang.code === language);

  return (
    <Select value={language} onValueChange={setLanguage} data-testid="mobile-language-switcher">
      <SelectTrigger className="w-[100px] h-8 text-sm">
        <div className="flex items-center gap-1">
          <Globe className="h-3 w-3" />
          <SelectValue>
            {currentLanguage?.code.toUpperCase() || 'EN'}
          </SelectValue>
        </div>
      </SelectTrigger>
      <SelectContent>
        {supportedLanguages.map((lang) => (
          <SelectItem 
            key={lang.code} 
            value={lang.code}
            data-testid={`mobile-language-option-${lang.code}`}
          >
            <div className="text-center">
              <div className="font-bold">{lang.code.toUpperCase()}</div>
              <div className="text-xs">{lang.nativeName}</div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}