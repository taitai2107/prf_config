import React, { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { DivideIcon as LucideIcon, QrCode, AlertTriangle, Clock } from 'lucide-react';
import { LinkItem } from '../types';
import { LinkBadge } from './LinkBadge';
import { CountdownTimer } from './CountdownTimer';
import { QRModal } from './QRModal';
import { getDeviceType } from '../utils/device';
import { trackClick } from '../utils/analytics';

interface EnhancedLinkButtonProps {
  item: LinkItem;
  isDark: boolean;
}

export function EnhancedLinkButton({ item, isDark }: EnhancedLinkButtonProps) {
  const [showQR, setShowQR] = useState(false);
  const IconComponent = (LucideIcons as any)[item.icon] as LucideIcon || LucideIcons.Link;
  
  const isLinkActive = () => {
    if (!item.isActive) return false;
    
    const now = new Date();
    if (item.startDate && new Date(item.startDate) > now) return false;
    if (item.endDate && new Date(item.endDate) < now) return false;
    
    return true;
  };

  const shouldShowOnDevice = () => {
    if (!item.deviceOnly) return true;
    const deviceType = getDeviceType();
    return item.deviceOnly === deviceType;
  };

  const handleClick = () => {
    if (!isLinkActive()) return;
    
    trackClick(item.id, getDeviceType(), document.referrer || 'direct');
    window.open(item.url, '_blank', 'noopener,noreferrer');
  };

  if (!shouldShowOnDevice()) return null;

  const isActive = isLinkActive();
  const isScheduled = item.endDate && new Date(item.endDate) > new Date();

  return (
    <>
      <div className="relative group">
        <button
          onClick={handleClick}
          disabled={!isActive}
          className={`w-full p-4 rounded-2xl backdrop-blur-md border transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl ${
            isActive
              ? (isDark
                  ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                  : 'bg-white/70 border-white/30 hover:bg-white/90 hover:border-white/50')
              : 'opacity-50 cursor-not-allowed bg-gray-500/20 border-gray-500/30'
          }`}
          style={{
            boxShadow: isActive ? `0 8px 32px ${item.color}20` : 'none',
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className={`p-3 rounded-xl flex-shrink-0 transition-transform duration-300 ${
                isActive ? 'group-hover:scale-110' : ''
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
                <h3 className={`font-semibold text-lg ${
                  isDark ? 'text-white' : 'text-slate-800'
                }`}>
                  {item.title}
                </h3>
                {item.badge && <LinkBadge badge={item.badge} />}
                {item.healthStatus === 'error' && (
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                )}
              </div>
              
              <p className={`text-sm ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}>
                {item.description}
              </p>
              
              {!isActive && isScheduled && item.endDate && (
                <CountdownTimer endDate={item.endDate} isDark={isDark} />
              )}
              
              {item.clicks !== undefined && (
                <p className={`text-xs mt-1 ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  {item.clicks} lượt click
                </p>
              )}
            </div>
          </div>
        </button>

        {isActive && (
          <button
            onClick={() => setShowQR(true)}
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