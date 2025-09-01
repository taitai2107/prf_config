import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

interface LoadingOverlayProps {
  isVisible: boolean;
  progress: number;   // 0..100
  linkTitle: string;
  isDark: boolean;
  size?: 'sm' | 'xs'; // <-- thêm, mặc định 'sm'
}

export function LoadingOverlay({
  isVisible,
  progress,
  linkTitle,
  isDark,
  size = 'sm',
}: LoadingOverlayProps) {
  if (!isVisible) return null;

  const pct = Math.max(0, Math.min(100, progress));
  const ring = size === 'xs' ? 24 : 32;              // vòng ngoài
  const hole = size === 'xs' ? 16 : 20;              // lõi trong
  const spinner = size === 'xs' ? 10 : 14;           // spinner bên trong
  const barW = size === 'xs' ? 'w-20' : 'w-32';      // thanh tiến độ
  const textCls = size === 'xs' ? 'text-[11px]' : 'text-sm';

  const ringBg = useMemo(() => {
    const a1 = isDark ? '#60a5fa' : '#2563eb';
    const a2 = isDark ? '#a78bfa' : '#7c3aed';
    const deg = pct * 3.6;
    return `conic-gradient(${a1} ${deg}deg, ${a2} ${deg}deg 360deg)`;
  }, [pct, isDark]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        role="status"
        aria-busy={pct < 100}
        className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl backdrop-blur-sm"
        style={{ background: isDark ? 'rgba(15,23,42,0.75)' : 'rgba(255,255,255,0.78)' }}
      >
        <div className="text-center min-w-0" style={{ maxWidth: 180 }}>
          {/* Vòng tiến độ rất nhỏ */}
          <div className="relative mx-auto mb-2" style={{ width: ring, height: ring }}>
            <div
              aria-hidden
              className="absolute inset-0 rounded-full"
              style={{
                background: ringBg,
                mask: 'radial-gradient(farthest-side, transparent 65%, #000 66%)',
                WebkitMask: 'radial-gradient(farthest-side, transparent 65%, #000 66%)',
              }}
            />
            <div
              className={`absolute rounded-full flex items-center justify-center ${
                isDark ? 'bg-slate-950' : 'bg-white'
              }`}
              style={{
                inset: `${(ring - hole) / 2}px`,
                width: hole,
                height: hole,
              }}
            >
              {pct >= 100 ? (
                <motion.span initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                  <Check className={`${isDark ? 'text-emerald-400' : 'text-emerald-600'} w-3.5 h-3.5`} />
                </motion.span>
              ) : (
                <motion.span
                  aria-hidden
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                  className={`rounded-full border-2 border-t-transparent ${
                    isDark ? 'border-blue-400' : 'border-blue-600'
                  }`}
                  style={{ width: spinner, height: spinner }}
                />
              )}
            </div>
          </div>

          {/* Tiêu đề thật gọn */}
          <p
            className={`${textCls} font-medium truncate ${
              isDark ? 'text-slate-200' : 'text-slate-700'
            }`}
          >
            Đang mở <span className="font-semibold">{linkTitle}</span>…
          </p>

          {/* Thanh tiến độ siêu nhỏ */}
          <div
            className={`${barW} h-1 rounded-full mt-2 mx-auto overflow-hidden ${
              isDark ? 'bg-slate-700' : 'bg-slate-200'
            }`}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-fuchsia-500"
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
