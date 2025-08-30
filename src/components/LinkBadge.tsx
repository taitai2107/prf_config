import React from 'react';
import { motion } from 'framer-motion';

interface LinkBadgeProps {
  badge: 'NEW' | 'HOT' | 'PRIVATE' | 'HIDDEN';
}

export function LinkBadge({ badge }: LinkBadgeProps) {
  const badgeStyles = {
    NEW: 'bg-green-500 text-white',
    HOT: 'bg-red-500 text-white animate-pulse',
    PRIVATE: 'bg-yellow-500 text-black',
    HIDDEN: 'bg-gray-500 text-white'
  };

  return (
    <motion.span 
      className={`px-2 py-1 text-xs font-bold rounded-full ${badgeStyles[badge]}`}
      animate={badge === 'HOT' ? { 
        scale: [1, 1.05, 1],
        rotate: [0, 1, -1, 0]
      } : {}}
      transition={badge === 'HOT' ? { 
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      } : {}}
    >
      {badge}
    </motion.span>
  );
}