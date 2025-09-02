import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Phone, MessageCircle, Send, Mail, Copy, Check } from 'lucide-react';
import { Profile } from '../types';
import { ANIMATION_DELAYS, EXTERNAL_LINKS } from '../constants';
import { useClipboard } from '../hooks/useClipboard';

interface QuickActionsProps {
  profile: Pick<Profile, 'phone' | 'email'>;
  isDark: boolean;
}

export function QuickActions({ profile, isDark }: QuickActionsProps) {
  const { t } = useTranslation();
  const { copyToClipboard, copiedItem } = useClipboard();

  const actions = useMemo(() => [
    {
      id: 'call',
      label: t('actions.call'),
      icon: Phone,
      action: () => window.open(`tel:${profile.phone}`),
      copyText: profile.phone,
      color: 'from-green-500 to-emerald-500',
    },
    {
      id: 'zalo',
      label: t('actions.zalo'),
      icon: MessageCircle,
      action: () => window.open(`https://zalo.me/${profile.phone.replace(/\D/g, '')}`),
      copyText: `https://zalo.me/${profile.phone.replace(/\D/g, '')}`,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'telegram',
      label: t('actions.telegram'),
      icon: Send,
      action: () => window.open(EXTERNAL_LINKS.TELEGRAM),
      copyText: EXTERNAL_LINKS.TELEGRAM,
      color: 'from-sky-500 to-blue-500',
    },
    {
      id: 'email',
      label: t('actions.email'),
      icon: Mail,
      action: () => window.open(`mailto:${profile.email}`),
      copyText: profile.email,
      color: 'from-purple-500 to-pink-500',
    },
  ], [profile.phone, profile.email, t]);

  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: ANIMATION_DELAYS.QUICK_ACTIONS }}
    >
      <h3 className={`text-lg font-semibold mb-4 text-center ${
        isDark ? 'text-slate-200' : 'text-slate-700'
      }`}>
        {t('contact.title')}
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => {
          const IconComponent = action.icon;
          const isCopied = copiedItem === action.id;

          return (
            <motion.div
              key={action.id}
              className="relative group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button
                onClick={action.action}
                className={`w-full p-4 rounded-2xl bg-gradient-to-r ${action.color} text-white font-medium transition-all duration-300 hover:shadow-xl flex items-center justify-center gap-2`}
              >
                <IconComponent className="w-5 h-5" />
                <span className="text-sm">{action.label}</span>
              </button>

              <motion.button
                onClick={() => copyToClipboard(action.id, action.copyText, action.label)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`absolute -top-2 -right-2 p-2 rounded-full backdrop-blur-md border transition-all duration-300 opacity-0 group-hover:opacity-100 ${
                  isDark
                    ? 'bg-slate-800/80 border-white/20 text-white'
                    : 'bg-white/80 border-slate-200 text-slate-600'
                }`}
              >
                {isCopied ? (
                  <Check className="w-3 h-3 text-green-500" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </motion.button>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}