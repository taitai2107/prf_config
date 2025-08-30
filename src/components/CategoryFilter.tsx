import React from 'react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  isDark: boolean;
}

export function CategoryFilter({ categories, selectedCategory, onCategoryChange, isDark }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
      <button
        onClick={() => onCategoryChange('all')}
        className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
          selectedCategory === 'all'
            ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
            : isDark
              ? 'bg-white/10 text-slate-300 hover:bg-white/20'
              : 'bg-white/50 text-slate-600 hover:bg-white/80'
        }`}
      >
        Tất cả
      </button>
      
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
            selectedCategory === category
              ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
              : isDark
                ? 'bg-white/10 text-slate-300 hover:bg-white/20'
                : 'bg-white/50 text-slate-600 hover:bg-white/80'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}