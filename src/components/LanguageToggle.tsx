import React from 'react';
import { Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface LanguageToggleProps {
  isDark: boolean;
}

export function LanguageToggle({ isDark }: LanguageToggleProps) {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'vi' ? 'en' : 'vi';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="fixed top-4 left-4 z-50 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 group"
      aria-label="Toggle language"
      title={`Switch to ${i18n.language === 'vi' ? 'English' : 'Tiếng Việt'}`}
    >
      <div className="flex items-center gap-2">
        <Languages className="w-5 h-5 text-white group-hover:rotate-12 transition-transform duration-300" />
        <span className="text-sm font-medium text-white">
          {i18n.language === 'vi' ? 'EN' : 'VI'}
        </span>
      </div>
    </button>
  );
}