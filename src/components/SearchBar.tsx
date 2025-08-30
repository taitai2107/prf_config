import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  isDark: boolean;
}

export function SearchBar({ searchTerm, onSearchChange, isDark }: SearchBarProps) {
  return (
    <div className="relative mb-6">
      <div className={`relative rounded-2xl backdrop-blur-md border ${
        isDark
          ? 'bg-white/5 border-white/10'
          : 'bg-white/70 border-white/30'
      }`}>
        <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
          isDark ? 'text-slate-400' : 'text-slate-500'
        }`} />
        
        <input
          type="text"
          placeholder="Tìm kiếm link..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className={`w-full pl-12 pr-12 py-4 rounded-2xl bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 ${
            isDark ? 'text-white placeholder-slate-400' : 'text-slate-800 placeholder-slate-500'
          }`}
        />
        
        {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-full transition-colors ${
              isDark ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-black/10 text-slate-500'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}