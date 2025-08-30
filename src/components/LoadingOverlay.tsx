import React from 'react';
import { motion } from 'framer-motion';

interface LoadingOverlayProps {
  isVisible: boolean;
  progress: number;
  linkTitle: string;
  isDark: boolean;
}

export function LoadingOverlay({ isVisible, progress, linkTitle, isDark }: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl backdrop-blur-sm"
      style={{
        background: isDark 
          ? 'rgba(15, 23, 42, 0.8)' 
          : 'rgba(255, 255, 255, 0.8)'
      }}
    >
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className={`w-8 h-8 border-2 border-t-transparent rounded-full mx-auto mb-3 ${
            isDark ? 'border-blue-400' : 'border-blue-600'
          }`}
        />
        
        <p className={`text-sm font-medium ${
          isDark ? 'text-slate-200' : 'text-slate-700'
        }`}>
          Đang mở {linkTitle}...
        </p>
        
        <div className={`w-32 h-1 rounded-full mt-3 mx-auto overflow-hidden ${
          isDark ? 'bg-slate-700' : 'bg-slate-200'
        }`}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
          />
        </div>
      </div>
    </motion.div>
  );
}