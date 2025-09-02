import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  isDark: boolean;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
  isDark,
}: CategoryFilterProps) {
  const { t } = useTranslation();

  const getCategoryLabel = (category: string) => {
    const key = category.toLowerCase();
    const labelMap: Record<string, string> = {
      professional: t('navigation.professional'),
      personal: t('navigation.personal'),
      gaming: t('navigation.gaming'),
    };
    return labelMap[key] || category;
  };

  const buttonClass = (isSelected: boolean) => `
    px-4 py-2 rounded-xl font-medium transition-all duration-300 whitespace-nowrap
    ${isSelected
      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
      : isDark
        ? 'bg-white/10 text-slate-300 hover:bg-white/20'
        : 'bg-white/50 text-slate-600 hover:bg-white/80'
    }
  `;

  return (
    <motion.div
      className="flex gap-2 mb-6 overflow-x-auto pb-2"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.9 }}
    >
      <motion.button
        onClick={() => onCategoryChange('all')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={buttonClass(selectedCategory === 'all')}
      >
        {t('navigation.all')}
      </motion.button>

      {categories.map((category, index) => (
        <motion.button
          key={category}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 1.0 + index * 0.1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onCategoryChange(category)}
          className={buttonClass(selectedCategory === category)}
        >
          {getCategoryLabel(category)}
        </motion.button>
      ))}
    </motion.div>
  );
}