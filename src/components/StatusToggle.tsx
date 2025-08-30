import React from 'react';
import { Circle } from 'lucide-react';

interface StatusToggleProps {
  status: 'available' | 'busy';
  onStatusChange: (status: 'available' | 'busy') => void;
  isDark: boolean;
}

export function StatusToggle({ status, onStatusChange, isDark }: StatusToggleProps) {
  return (
    <div className={`flex items-center justify-center gap-3 p-4 rounded-2xl backdrop-blur-md border mb-6 ${
      isDark
        ? 'bg-white/5 border-white/10'
        : 'bg-white/70 border-white/30'
    }`}>
      <button
        onClick={() => onStatusChange('available')}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
          status === 'available'
            ? 'bg-green-500 text-white shadow-lg'
            : isDark
              ? 'bg-white/10 text-slate-300 hover:bg-white/20'
              : 'bg-white/50 text-slate-600 hover:bg-white/80'
        }`}
      >
        <Circle className={`w-3 h-3 ${status === 'available' ? 'fill-current' : ''}`} />
        <span className="text-sm font-medium">Available</span>
      </button>
      
      <button
        onClick={() => onStatusChange('busy')}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
          status === 'busy'
            ? 'bg-red-500 text-white shadow-lg'
            : isDark
              ? 'bg-white/10 text-slate-300 hover:bg-white/20'
              : 'bg-white/50 text-slate-600 hover:bg-white/80'
        }`}
      >
        <Circle className={`w-3 h-3 ${status === 'busy' ? 'fill-current' : ''}`} />
        <span className="text-sm font-medium">Busy</span>
      </button>
    </div>
  );
}