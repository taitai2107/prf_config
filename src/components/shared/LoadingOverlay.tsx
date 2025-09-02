import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, RefreshCw } from 'lucide-react';

interface LoadingOverlayProps {
  isVisible: boolean;
  progress: number;
  linkTitle: string;
  isDark: boolean;
  size?: 'sm' | 'xs';
}

export function LoadingOverlay({
  isVisible,
  progress,
  linkTitle,
  isDark,
  size = 'sm',
}: LoadingOverlayProps) {
  const config = useMemo(() => ({
    ring: size === 'xs' ? 24 : 32,
    hole: size === 'xs' ? 16 : 20,
    spinner: size === 'xs' ? 10 : 14,
    barWidth: size === 'xs' ? 'w-20' : 'w-32',
    textSize: size === 'xs' ? 'text-[11px]' : 'text-sm',
  }), [size]);

  const progressPercent = Math.max(0, Math.min(100, progress));

  const isComplete = progressPercent >= 100;

  const ringBackground = useMemo(() => {
    const color1 = isDark ? '#60a5fa' : '#2563eb';
    const color2 = isDark ? '#a78bfa' : '#7c3aed';
    const degrees = progressPercent * 3.6;
    return `conic-gradient(${color1} ${degrees}deg, ${color2} ${degrees}deg 360deg)`;
  }, [progressPercent, isDark]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl backdrop-blur-sm"
        style={{ 
          background: isDark ? 'rgba(15,23,42,0.75)' : 'rgba(255,255,255,0.78)' 
        }}
      >
        <div className="text-center" style={{ maxWidth: 180 }}>
          <div className="relative mx-auto mb-2" style={{ width: config.ring, height: config.ring }}>
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{ rotate: isComplete ? 0 : 360 }}
              transition={{ 
                duration: isComplete ? 0 : 1,
                repeat: isComplete ? 0 : Infinity,
                ease: 'linear'
              }}
              style={{
                background: ringBackground,
                mask: 'radial-gradient(farthest-side, transparent 65%, #000 66%)',
                WebkitMask: 'radial-gradient(farthest-side, transparent 65%, #000 66%)',
              }}
            />
            <div
              className={`absolute rounded-full flex items-center justify-center ${
                isDark ? 'bg-slate-950' : 'bg-white'
              }`}
              style={{
                inset: `${(config.ring - config.hole) / 2}px`,
                width: config.hole,
                height: config.hole,
              }}
            >
              {isComplete ? (
                <motion.span 
                  initial={{ scale: 0, opacity: 0 }} 
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, ease: 'backOut' }}
                >
                  <Check className={`${isDark ? 'text-emerald-400' : 'text-emerald-600'} w-3.5 h-3.5`} />
                </motion.div>
              ) : (
                <motion.div
                  className={`rounded-full border-2 border-t-transparent ${
                    isDark ? 'border-blue-400' : 'border-blue-600'
                  }`}
                  style={{ width: config.spinner, height: config.spinner }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                />
                </motion.div>
            </div>
          </div>

          <p className={`${config.textSize} font-medium truncate ${
            isDark ? 'text-slate-200' : 'text-slate-700'
          }`}>
            {isComplete ? 'Đang chuyển hướng...' : `Đang mở ${linkTitle}...`}
          </p>

          <div className={`${config.barWidth} h-1 rounded-full mt-2 mx-auto overflow-hidden ${
            isDark ? 'bg-slate-700' : 'bg-slate-200'
          }`}>
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-fuchsia-500"
              style={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.1, ease: 'easeOut' }}
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}