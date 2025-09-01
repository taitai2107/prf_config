import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, HelpCircle, Music, X } from 'lucide-react';
import { HelpModal } from './HelpModal';
import { MusicPlayer } from './MusicPlayer';

interface SettingsButtonProps {
  isDark: boolean;
}

export function SettingsButton({ isDark }: SettingsButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showMusic, setShowMusic] = useState(false);

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-16 right-0 mb-2"
            >
              <div className={`p-4 rounded-2xl backdrop-blur-md border shadow-xl ${
                isDark
                  ? 'bg-slate-800/90 border-white/20'
                  : 'bg-white/90 border-slate-200'
              }`}>
                <div className="space-y-2 min-w-[160px]">
                  <motion.button
                    onClick={() => setShowMusic(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                      isDark
                        ? 'hover:bg-white/10 text-white'
                        : 'hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <Music className="w-5 h-5" />
                    <span className="font-medium">Music</span>
                  </motion.button>

                  <motion.button
                    onClick={() => setShowHelp(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                      isDark
                        ? 'hover:bg-white/10 text-white'
                        : 'hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <HelpCircle className="w-5 h-5" />
                    <span className="font-medium">Help</span>
                    {/* <kbd className={`ml-auto px-2 py-1 text-xs rounded ${
                      isDark ? 'bg-white/10 text-slate-300' : 'bg-slate-100 text-slate-600'
                    }`}>?</kbd> */}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`p-4 rounded-full backdrop-blur-md border transition-all duration-300 ${
            isDark
              ? 'bg-slate-800/80 border-white/20 text-white hover:bg-slate-700/80'
              : 'bg-white/80 border-slate-200 text-slate-600 hover:bg-white'
          }`}
          aria-label="Settings"
        >
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Settings className="w-6 h-6" />}
          </motion.div>
        </motion.button>
      </div>

      <HelpModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        isDark={isDark}
      />

      <MusicPlayer
        isOpen={showMusic}
        onClose={() => setShowMusic(false)}
        isDark={isDark}
      />
    </>
  );
}