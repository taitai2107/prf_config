import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface SplashScreenProps {
  profile: {
    name: string;
    avatar: string;
  };
  isDark: boolean;
  onComplete: () => void;
}

export function SplashScreen({ profile, isDark, onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = prefersReducedMotion ? 500 : 2000;
    
    // Allow skipping after 500ms
    const skipTimer = setTimeout(() => setCanSkip(true), 500);
    
    // Auto-complete after duration
    const completeTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 300); // Wait for exit animation
    }, duration);

    return () => {
      clearTimeout(skipTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  const handleSkip = () => {
    if (canSkip) {
      setIsVisible(false);
      setTimeout(onComplete, 300);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{
            background: isDark 
              ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)'
              : 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 50%, #f3e8ff 100%)'
          }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,theme(colors.blue.500/20),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,theme(colors.purple.500/20),transparent_50%)]" />
          </div>

          <div className="relative z-10 text-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                duration: 0.6, 
                ease: "easeOut",
                delay: 0.2 
              }}
              className="mb-6"
            >
              <div className="relative inline-block">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white/30 shadow-2xl"
                />
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500/30 to-purple-500/30"
                />
              </div>
            </motion.div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ 
                duration: 0.6, 
                delay: 0.4 
              }}
              className={`text-2xl font-bold bg-gradient-to-r ${
                isDark 
                  ? 'from-blue-400 to-purple-400' 
                  : 'from-blue-600 to-purple-600'
              } bg-clip-text text-transparent`}
            >
              {profile.name}
            </motion.h1>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ 
                duration: 1.5, 
                delay: 0.8,
                ease: "easeInOut"
              }}
              className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mt-6 max-w-32"
            />
          </div>

          {/* Skip Button */}
          {canSkip && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              onClick={handleSkip}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300"
              aria-label="Skip intro"
            >
              <X className="w-5 h-5 text-white" />
            </motion.button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}