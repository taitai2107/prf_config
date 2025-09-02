import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { AlertTriangle, QrCode } from 'lucide-react';

import { LinkItem } from '../types';
import { LinkBadge, CountdownTimer, QRModal, LoadingOverlay, HoldTooltip } from './shared';
import { getDeviceType, trackClick } from '../utils';
import { useHoldGesture } from '../hooks/useHoldGesture';
import { useMouseTilt } from '../hooks/useMouseTilt';
import { useRipple } from '../hooks/useRipple';
import { LOADING_DURATION } from '../constants';

interface EnhancedLinkButtonProps {
  item: LinkItem;
  isDark: boolean;
}

export function EnhancedLinkButton({ item, isDark }: EnhancedLinkButtonProps) {
  const { t } = useTranslation();
  const [showQR, setShowQR] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showHoldTooltip, setShowHoldTooltip] = useState(false);

  const IconComponent: LucideIcon =
    ((LucideIcons as any)[item.icon] as LucideIcon) || (LucideIcons as any).Link;

  const { tiltStyle, tiltHandlers } = useMouseTilt(4);
  const { createRipple, RippleEffect } = useRipple();

  const isLinkActive = () => {
    if (item.isActive === false) return false;
    const now = new Date();
    if (item.startDate && new Date(item.startDate) > now) return false;
    if (item.endDate && new Date(item.endDate) < now) return false;
    return true;
  };

  const shouldShowOnDevice = () => {
    if (!item.deviceOnly) return true;
    return item.deviceOnly === getDeviceType();
  };

  const isActive = isLinkActive();
  const isScheduled = !!(item.endDate && new Date(item.endDate) > new Date());

  const openLink = () => {
    if (!isActive) return;
    trackClick(item.id, getDeviceType(), document.referrer || 'direct');
    window.open(item.url, '_blank', 'noopener,noreferrer');
  };

  const { touchHandlers } = useHoldGesture({
    onHold: openLink,
    onHoldStart: () => setShowHoldTooltip(true),
    onHoldEnd: () => setShowHoldTooltip(false),
    disabled: !isActive,
  });

  const handleClick = (e: React.MouseEvent) => {
    if (!isActive) return;

    const isSpecialClick = e.button === 1 || e.ctrlKey || e.metaKey;
    if (isSpecialClick) {
      openLink();
      return;
    }

    createRipple(e);
    setIsLoading(true);
    setLoadingProgress(0);

    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, LOADING_DURATION / 10);

    setTimeout(() => {
      setIsLoading(false);
      setLoadingProgress(0);
      openLink();
    }, LOADING_DURATION);
  };

  if (!shouldShowOnDevice()) return null;

  return (
    <>
      <motion.div
        className="relative group"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        <motion.button
          onClick={handleClick}
          {...touchHandlers}
          {...tiltHandlers}
          disabled={!isActive}
          style={tiltStyle}
          className={`relative overflow-hidden w-full p-4 rounded-2xl backdrop-blur-md border transition-all duration-300 ${
            isActive
              ? isDark
                ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 hover:shadow-xl hover:shadow-blue-500/20'
                : 'bg-white/70 border-white/30 hover:bg-white/90 hover:border-white/50 hover:shadow-xl hover:shadow-blue-500/10'
              : 'opacity-50 cursor-not-allowed bg-gray-500/20 border-gray-500/30'
          }`}
        >
          <RippleEffect color={`${item.color}40`} />

          <div className="flex items-center gap-4">
            <div
              className={`p-3 rounded-xl flex-shrink-0 transition-all duration-300 ${
                isActive ? 'group-hover:scale-110 group-hover:rotate-3' : ''
              }`}
              style={{ backgroundColor: `${item.color}20` }}
            >
              <IconComponent
                className="w-6 h-6"
                style={{ color: isActive ? item.color : '#9ca3af' }}
              />
            </div>

            <div className="flex-1 text-left">
              <div className="flex items-center gap-2 mb-1">
                <h3 className={`font-semibold text-lg ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  {item.title}
                </h3>
                {item.badge && <LinkBadge badge={item.badge} />}
                {item.healthStatus === 'error' && <AlertTriangle className="w-4 h-4 text-red-500" />}
              </div>

              <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {t(`link.${item.id}.description`, { defaultValue: item.description })}
              </p>

              {!isActive && isScheduled && item.endDate && (
                <CountdownTimer endDate={item.endDate} isDark={isDark} />
              )}

              {item.clicks !== undefined && (
                <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {item.clicks} lượt click
                </p>
              )}
            </div>

            {isActive && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowQR(true);
                }}
                className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-md border transition-all duration-300 opacity-0 group-hover:opacity-100 ${
                  isDark
                    ? 'bg-slate-800/80 border-white/20 text-white hover:bg-slate-700/80'
                    : 'bg-white/80 border-slate-200 text-slate-600 hover:bg-white'
                }`}
              >
                <QrCode className="w-4 h-4" />
              </button>
            )}
          </div>

          <LoadingOverlay
            isVisible={isLoading}
            progress={loadingProgress}
            linkTitle={item.title}
            isDark={isDark}
          />
        </motion.button>

        <HoldTooltip 
          isVisible={showHoldTooltip} 
          text={t('actions.holdToOpen')} 
          isDark={isDark} 
        />
      </motion.div>

      <QRModal
        isOpen={showQR}
        onClose={() => setShowQR(false)}
        url={item.url}
        title={item.title}
        isDark={isDark}
      />
    </>
  );
}