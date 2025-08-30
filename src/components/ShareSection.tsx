import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Share2, Copy, QrCode, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface ShareSectionProps {
  isDark: boolean;
}

export function ShareSection({ isDark }: ShareSectionProps) {
  const { t } = useTranslation();
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);

  const qrImageUrl = 'https://res.cloudinary.com/doivdewue/image/upload/v1756226928/aceeec16-89c0-43f3-8098-4958d50ffcbc.png';
  const BankLink = 'MBBANK-21072001210703';

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(BankLink);
      setCopied(true);
      toast.success(t('actions.copied'));
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Copy failed');
    }
  };

  const toggleQR = () => {
    setShowQR(prev => !prev);
  };

  return (
    <motion.div 
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1.7 }}
    >
      <motion.div 
        className={`p-6 rounded-2xl backdrop-blur-md border ${
        isDark
          ? 'bg-white/5 border-white/10'
          : 'bg-white/70 border-white/30'
      }`}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Share2 className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-green-700'}`} />
          <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
            {t('share.title')}
          </h3>
        </div>

        <div className="flex gap-3">
          <motion.button
            onClick={copyToClipboard}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all duration-300 ${
              copied
                ? (isDark ? 'bg-green-500/20 border-green-500/30' : 'bg-green-100 border-green-300')
                : (isDark ? 'bg-white/10 hover:bg-white/15 border-white/20' : 'bg-white/50 hover:bg-white/80 border-white/40')
            } border`}
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            <span className={`text-sm font-medium ${
              copied
                ? 'text-green-500'
                : (isDark ? 'text-white' : 'text-slate-700')
            }`}>
              {copied ? t('actions.copied') : t('actions.copyBank')}
            </span>
          </motion.button>

          <motion.button
            onClick={toggleQR}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all duration-300 ${
              isDark
                ? 'bg-white/10 hover:bg-white/15 border-white/20 text-white'
                : 'bg-white/50 hover:bg-white/80 border-white/40 text-slate-700'
            }`}
          >
            {showQR ? (
              <X className="w-4 h-4" />
            ) : (
              <QrCode className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">
              {showQR ? 'Close' : 'QR Code'}
            </span>
          </motion.button>
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
                src={qrImageUrl}
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
      </motion.div>
    </motion.div>
  );
}
