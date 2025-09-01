import React, { useImperativeHandle, forwardRef } from 'react';
import { Moon, Sun } from 'lucide-react';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export interface ThemeToggleRef {
  toggle: () => void;
}

export const ThemeToggle = forwardRef<ThemeToggleRef, ThemeToggleProps>(
  ({ isDark, onToggle }, ref) => {
  
  useImperativeHandle(ref, () => ({
    toggle: onToggle
  }));

  return (
    <button
      onClick={onToggle}
      className="fixed top-4 right-4 z-50 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 group"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-yellow-400 group-hover:rotate-45 transition-transform duration-300" />
      ) : (
        <Moon className="w-5 h-5 text-slate-600 group-hover:-rotate-12 transition-transform duration-300" />
      )}
    </button>
  );
});

ThemeToggle.displayName = 'ThemeToggle';