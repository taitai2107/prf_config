import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Share2, Copy, QrCode, Check, X } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { ANIMATION_DELAYS, EXTERNAL_LINKS } from '../constants';
import { useClipboard } from '../hooks/useClipboard';

interface ShareSectionProps {
  isDark: boolean;
}

export function ShareSection({ isDark }: ShareSectionProps) {
  const { t } = useTranslation();
  const [showQR, setShowQR] = useState(false);
  const { copyToClipboard, copiedItem } = useClipboard();

  const handleCopyBank = () => {
    copyToClipboard('bank', EXTERNAL_LINKS.BANK_INFO, 'Bank Info');
  };

  return (
    <Card isDark={isDark} delay={ANIMATION_DELAYS.SHARE} className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <Share2 className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-green-700'}`} />
        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
          {t('share.title')}
        </h3>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={handleCopyBank}
          variant="secondary"
          isDark={isDark}
          icon={copiedItem === 'bank' ? Check : Copy}
          className="flex-1"
        >
          {copiedItem === 'bank' ? t('actions.copied') : t('actions.copyBank')}
        </Button>

        <Button
          onClick={() => setShowQR(!showQR)}
          variant="secondary"
          isDark={isDark}
          icon={showQR ? X : QrCode}
        >
          {showQR ? 'Close' : 'QR Code'}
        </Button>
      </div>

      <AnimatePresence>
        {showQR && (
          <motion.div 
            className="mt-6 text-center"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative w-[200px] mx-auto">
              <motion.img
                src={EXTERNAL_LINKS.BANK_QR}
                alt="QR Code"
                className="relative z-10 rounded-xl shadow-2xl border border-green-500"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
              />
              <motion.div 
                className="absolute inset-0 z-0 rounded-xl bg-green-500/10 blur-lg"
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
            <p className={`text-sm mt-3 ${isDark ? 'text-green-400' : 'text-green-700'}`}>
              {t('share.scanQR')}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}