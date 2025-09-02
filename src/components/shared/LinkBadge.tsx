import React from 'react';
import { motion } from 'framer-motion';

interface LinkBadgeProps {
  badge: 'NEW' | 'HOT' | 'PRIVATE' | 'HIDDEN';
}

const badgeConfig = {
  NEW: { bg: 'bg-green-500', text: 'text-white', animate: false },
  HOT: { bg: 'bg-red-500', text: 'text-white', animate: true },
  PRIVATE: { bg: 'bg-yellow-500', text: 'text-black', animate: false },
  HIDDEN: { bg: 'bg-gray-500', text: 'text-white', animate: false }
};

export function LinkBadge({ badge }: LinkBadgeProps) {
  const config = badgeConfig[badge];

  return (
    <motion.span 
      className={`px-2 py-1 text-xs font-bold rounded-full ${config.bg} ${config.text}`}
      animate={config.animate ? { 
        scale: [1, 1.05, 1],
        rotate: [0, 1, -1, 0]
      } : {}}
      transition={config.animate ? { 
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      } : {}}
    >
      {badge}
    </motion.span>
  );
}