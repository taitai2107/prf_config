import React, { useImperativeHandle, forwardRef } from 'react';
import { Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface LanguageToggleProps {
  isDark: boolean;
}

export interface LanguageToggleRef {
  toggle: () => void;
}

export const LanguageToggle = forwardRef<LanguageToggleRef, LanguageToggleProps>(
  ({ isDark }, ref) => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'vi' ? 'en' : 'vi';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  useImperativeHandle(ref, () => ({
    toggle: toggleLanguage
  }));

  const bgColor = isDark ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-slate-900/10 hover:bg-slate-900/20 text-slate-900';
  const borderColor = isDark ? 'border-white/20' : 'border-slate-300';

  return (
    <button
      onClick={toggleLanguage}
      className={`fixed top-4 left-4 z-50 p-3 rounded-full backdrop-blur-md border transition-all duration-300 group ${bgColor} ${borderColor}`}
      aria-label="Toggle language"
      title={`Switch to ${i18n.language === 'vi' ? 'English' : 'Tiếng Việt'}`}
    >
      <div className="flex items-center gap-2">
        <Languages className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
        <span className="text-sm font-medium">
          {i18n.language === 'vi' ? 'EN' : 'VI'}
        </span>
      </div>
    </button>
  );
});

LanguageToggle.displayName = 'LanguageToggle';
