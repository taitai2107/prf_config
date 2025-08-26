import React from 'react';
import * as LucideIcons from 'lucide-react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface FooterProps {
  socialMedia: Array<{
    platform: string;
    url: string;
    icon: string;
  }>;
  copyright: string;
  isDark: boolean;
}

export function Footer({ socialMedia, copyright, isDark }: FooterProps) {
  return (
    <footer className={`text-center py-8 border-t ${
      isDark ? 'border-white/10' : 'border-white/20'
    }`}>
      <div className="flex justify-center gap-4 mb-6">
        {socialMedia.map((social, index) => {
          const IconComponent = (LucideIcons as any)[social.icon] as LucideIcon || LucideIcons.Link;
          
          return (
            <a
              key={index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-3 rounded-full backdrop-blur-md border transition-all duration-300 hover:scale-110 group ${
                isDark
                  ? 'bg-white/5 border-white/10 hover:bg-white/10'
                  : 'bg-white/30 border-white/40 hover:bg-white/50'
              }`}
              aria-label={social.platform}
            >
              <IconComponent className={`w-5 h-5 ${
                isDark ? 'text-slate-300 group-hover:text-white' : 'text-slate-600 group-hover:text-slate-800'
              }`} />
            </a>
          );
        })}
      </div>
      
      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
        {copyright}
      </p>
    </footer>
  );
}