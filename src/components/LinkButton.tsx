import React from 'react';
import * as LucideIcons from 'lucide-react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface LinkButtonProps {
  item: {
    title: string;
    url: string;
    description: string;
    icon: string;
    color: string;
  };
  isDark: boolean;
}

export function LinkButton({ item, isDark }: LinkButtonProps) {
  const IconComponent = (LucideIcons as any)[item.icon] as LucideIcon || LucideIcons.Link;
  
  const handleClick = () => {
    window.open(item.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full p-4 rounded-2xl backdrop-blur-md border transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl group ${
        isDark
          ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
          : 'bg-white/70 border-white/30 hover:bg-white/90 hover:border-white/50'
      }`}
      style={{
        boxShadow: `0 8px 32px ${item.color}20`,
      }}
    >
      <div className="flex items-center gap-4">
        <div
          className="p-3 rounded-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
          style={{ backgroundColor: `${item.color}20` }}
        >
          <IconComponent 
            className="w-6 h-6" 
            style={{ color: item.color }}
          />
        </div>
        
        <div className="flex-1 text-left">
          <h3 className={`font-semibold text-lg mb-1 ${
            isDark ? 'text-white' : 'text-slate-800'
          }`}>
            {item.title}
          </h3>
          <p className={`text-sm ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}>
            {item.description}
          </p>
        </div>
      </div>
    </button>
  );
}