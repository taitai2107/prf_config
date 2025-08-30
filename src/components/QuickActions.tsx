import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Phone, MessageCircle, Send, Mail, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

interface QuickActionsProps {
  profile: { phone: string; email: string };
  isDark: boolean;
}

export function QuickActions({ profile, isDark }: QuickActionsProps) {
  const { t } = useTranslation();
  const [copiedItem, setCopiedItem] = React.useState<string | null>(null);

  const copyToClipboard = async (id: string, text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(id);
      toast.success(`${t('actions.copied')} ${label}`);
      setTimeout(() => setCopiedItem(null), 2000);
    } catch {
      toast.error('Copy failed');
    }
  };

 
  const actions = React.useMemo(
    () => [
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
        action: () =>
          window.open(`https://zalo.me/${profile.phone.replace(/\D/g, '')}`),
        copyText: `https://zalo.me/${profile.phone.replace(/\D/g, '')}`,
        color: 'from-blue-500 to-cyan-500',
      },
      {
        id: 'telegram',
        label: t('actions.telegram'),
        icon: Send,
        action: () => window.open(`https://t.me/tainguyen2017`),
        copyText: `https://t.me/tainguyen2017`,
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
    ],
    [profile.phone, profile.email, t]
  );

  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
    >
      <h3
        className={`text-lg font-semibold mb-4 text-center ${
          isDark ? 'text-slate-200' : 'text-slate-700'
        }`}
      >
        {t('contact.title')}
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => {
          const IconComponent = action.icon;
          const isCopied = copiedItem === action.id;

          return (
            <motion.div
              key={action.id}              
              className="relative group"
              initial={false}              
              animate={{ opacity: 1, scale: 1 }}
              style={{ opacity: 1, transform: 'scale(1)' }}
              transition={{ duration: 0.3 }}
            >
              <motion.button
                onClick={action.action}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full p-4 rounded-2xl bg-gradient-to-r ${action.color} text-white font-medium transition-all duration-300 hover:shadow-xl flex items-center justify-center gap-2`}
              >
                <IconComponent className="w-5 h-5" />
                <span className="text-sm">{action.label}</span>
              </motion.button>

              <motion.button
                onClick={() =>
                  copyToClipboard(action.id, action.copyText, action.label)
                }
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`absolute -top-2 -right-2 p-2 rounded-full backdrop-blur-md border transition-all duration-300 opacity-0 group-hover:opacity-100 hover:shadow-lg ${
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
