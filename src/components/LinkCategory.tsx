import React from 'react';
import { LinkButton } from './LinkButton';

interface LinkCategoryProps {
  category: {
    category: string;
    items: Array<{
      title: string;
      url: string;
      description: string;
      icon: string;
      color: string;
    }>;
  };
  isDark: boolean;
}

export function LinkCategory({ category, isDark }: LinkCategoryProps) {
  return (
    <div className="mb-8">
      <h2 className={`text-xl font-bold mb-4 text-center ${
        isDark ? 'text-slate-200' : 'text-slate-700'
      }`}>
        {category.category}
      </h2>
      <div className="space-y-3">
        {category.items.map((item, index) => (
          <LinkButton 
            key={index} 
            item={item} 
            isDark={isDark}
          />
        ))}
      </div>
    </div>
  );
}