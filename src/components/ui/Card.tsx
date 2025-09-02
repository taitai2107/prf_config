import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  isDark: boolean;
  hover?: boolean;
  delay?: number;
}

export function Card({ children, className = '', isDark, hover = true, delay = 0 }: CardProps) {
  const baseClasses = `p-6 rounded-2xl backdrop-blur-md border transition-all duration-300 ${
    isDark
      ? 'bg-white/5 border-white/10'
      : 'bg-white/70 border-white/30'
  }`;

  const hoverClasses = hover ? (isDark ? 'hover:bg-white/10' : 'hover:bg-white/90') : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={hover ? { scale: 1.01 } : {}}
      className={`${baseClasses} ${hoverClasses} ${className}`}
    >
      {children}
    </motion.div>
  );
}