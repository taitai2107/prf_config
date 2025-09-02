import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Search, X } from 'lucide-react';
import { ANIMATION_DELAYS } from '../constants';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  isDark: boolean;
}

export interface SearchBarRef {
  focus: () => void;
}

export const SearchBar = forwardRef<SearchBarRef, SearchBarProps>(
  ({ searchTerm, onSearchChange, isDark }, ref) => {
  const { t } = useTranslation();
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus()
  }));

  return (
    <motion.div 
      className="relative mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: ANIMATION_DELAYS.SEARCH }}
    >
      <motion.div 
        className={`relative rounded-2xl backdrop-blur-md border ${
          isDark
            ? 'bg-white/5 border-white/10'
            : 'bg-white/70 border-white/30'
        }`}
        animate={{ scale: isFocused ? 1.02 : 1 }}
        transition={{ duration: 0.2 }}
      >
        <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
          isDark ? 'text-slate-400' : 'text-slate-500'
        }`} />
        
        <input
          ref={inputRef}
          type="text"
          placeholder={t('navigation.search')}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full pl-12 pr-12 py-4 rounded-2xl bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 ${
            isDark ? 'text-white placeholder-slate-400' : 'text-slate-800 placeholder-slate-500'
          }`}
        />
        
        {searchTerm && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onSearchChange('')}
            className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-full transition-colors ${
              isDark ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-black/10 text-slate-500'
            }`}
          >
            <X className="w-4 h-4" />
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
});

SearchBar.displayName = 'SearchBar';