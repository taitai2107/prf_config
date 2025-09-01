import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HoldTooltipProps {
  isVisible: boolean;
  text: string;
  isDark: boolean;
}

export function HoldTooltip({ isVisible, text, isDark }: HoldTooltipProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className={`absolute -top-12 left-1/2 transform -translate-x-1/2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap z-20 ${
            isDark
              ? 'bg-slate-800 text-white border border-white/20'
              : 'bg-white text-slate-800 border border-slate-200 shadow-lg'
          }`}
        >
          {text}
          <div 
            className={`absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent ${
              isDark ? 'border-t-slate-800' : 'border-t-white'
            }`}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}