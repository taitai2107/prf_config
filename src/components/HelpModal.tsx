import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { X, Keyboard } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}

export function HelpModal({ isOpen, onClose, isDark }: HelpModalProps) {
  const { t } = useTranslation();

  const shortcuts = [
    { key: '?', action: t('help.shortcuts.help') },
    { key: '/', action: t('help.shortcuts.search') },
    { key: '1', action: t('help.shortcuts.all') },
    { key: '2', action: t('help.shortcuts.professional') },
    { key: '3', action: t('help.shortcuts.personal') },
    { key: '4', action: t('help.shortcuts.gaming') },
    { key: 'T', action: t('help.shortcuts.language') },
    { key: 'B', action: t('help.shortcuts.theme') },
    { key: 'G', action: t('help.shortcuts.github') },    
    { key: 'Z', action: t('help.shortcuts.zalo') },
    { key: 'C', action: t('help.shortcuts.contact') },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        >
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`relative p-6 rounded-2xl backdrop-blur-md border max-w-md w-full max-h-[80vh] overflow-y-auto ${
              isDark
                ? 'bg-slate-800/95 border-white/20'
                : 'bg-white/95 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Keyboard className={`w-6 h-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  {t('help.title')}
                </h2>
              </div>
              <button
                onClick={onClose}
                className={`p-2 rounded-full transition-colors ${
                  isDark ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-black/10 text-slate-600'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <h3 className={`font-semibold mb-3 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                {t('help.keyboardShortcuts')}
              </h3>
              
              {shortcuts.map((shortcut, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`flex items-center justify-between p-3 rounded-xl ${
                    isDark ? 'bg-white/5' : 'bg-slate-50'
                  }`}
                >
                  <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {shortcut.action}
                  </span>
                  <kbd className={`px-3 py-1 text-sm font-mono rounded-lg border ${
                    isDark
                      ? 'bg-slate-700 border-slate-600 text-white'
                      : 'bg-white border-slate-300 text-slate-800'
                  }`}>
                    {shortcut.key}
                  </kbd>
                </motion.div>
              ))}
            </div>

            <div className={`mt-6 p-4 rounded-xl ${
              isDark ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'
            }`}>
              <p className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                {t('help.tip')}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}