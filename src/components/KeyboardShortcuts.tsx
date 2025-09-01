import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface KeyboardShortcutsProps {
  onToggleHelp: () => void;
  onToggleTheme: () => void;
  onToggleLanguage: () => void;
  onFocusSearch: () => void;
  onSelectCategory: (category: string) => void;
  onOpenGitHub: () => void;
  onOpenTelegram: () => void;
  onOpenZalo: () => void;
  onOpenContact: () => void;
}

export function KeyboardShortcuts({
  onToggleHelp,
  onToggleTheme,
  onToggleLanguage,
  onFocusSearch,
  onSelectCategory,
  onOpenGitHub,
  onOpenTelegram,
  onOpenZalo,
  onOpenContact,
}: KeyboardShortcutsProps) {
  const { t } = useTranslation();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Prevent default for our shortcuts
      const key = e.key.toLowerCase();
      
      switch (key) {
        case '?':
          e.preventDefault();
          onToggleHelp();
          break;
        case '/':
          e.preventDefault();
          onFocusSearch();
          break;
        case '1':
          e.preventDefault();
          onSelectCategory('all');
          break;
        case '2':
          e.preventDefault();
          onSelectCategory('Professional');
          break;
        case '3':
          e.preventDefault();
          onSelectCategory('Personal');
          break;
        case '4':
          e.preventDefault();
          onSelectCategory('Gaming');
          break;
        case 't':
          e.preventDefault();
          onToggleLanguage();
          break;
        case 'b':
          e.preventDefault();
          onToggleTheme();
          break;
        case 'g':
          e.preventDefault();
          onOpenGitHub();
          break;
        case 'z':
          e.preventDefault();
          onOpenZalo();
          break;
        case 'c':
          e.preventDefault();
          onOpenContact();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [
    onToggleHelp,
    onToggleTheme,
    onToggleLanguage,
    onFocusSearch,
    onSelectCategory,
    onOpenGitHub,
    onOpenTelegram,
    onOpenZalo,
    onOpenContact,
  ]);

  return null;
}