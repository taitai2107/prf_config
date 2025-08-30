import React from 'react';

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
    <span className={`px-2 py-1 text-xs font-bold rounded-full ${badgeStyles[badge]}`}>
      {badge}
    </span>
  );
}