import React from 'react';
import { Phone, MessageCircle, Send, Mail, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

interface QuickActionsProps {
  profile: {
    phone: string;
    email: string;
  };
  isDark: boolean;
}

export function QuickActions({ profile, isDark }: QuickActionsProps) {
  const [copiedItem, setCopiedItem] = React.useState<string | null>(null);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(label);
      toast.success(`Đã copy ${label}`);
      setTimeout(() => setCopiedItem(null), 2000);
    } catch {
      toast.error('Không thể copy');
    }
  };

  const actions = [
    {
      label: 'Gọi',
      icon: Phone,
      action: () => window.open(`tel:${profile.phone}`),
      copyText: profile.phone,
      color: 'from-green-500 to-emerald-500'
    },
    {
      label: 'Zalo',
      icon: MessageCircle,
      action: () => window.open(`https://zalo.me/${profile.phone.replace(/\D/g, '')}`),
      copyText: `https://zalo.me/${profile.phone.replace(/\D/g, '')}`,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      label: 'Telegram',
      icon: Send,
      action: () => window.open(`https://t.me/tainguyen2017`),
      copyText: `https://t.me/tainguyen2017`,
      color: 'from-sky-500 to-blue-500'
    },
    {
      label: 'Email',
      icon: Mail,
      action: () => window.open(`mailto:${profile.email}`),
      copyText: profile.email,
      color: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <div className="mb-8">
      <h3 className={`text-lg font-semibold mb-4 text-center ${
        isDark ? 'text-slate-200' : 'text-slate-700'
      }`}>
        Liên hệ nhanh
      </h3>
      
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => {
          const IconComponent = action.icon;
          const isCopied = copiedItem === action.label;
          
          return (
            <div key={action.label} className="relative group">
              <button
                onClick={action.action}
                className={`w-full p-4 rounded-2xl bg-gradient-to-r ${action.color} text-white font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center gap-2`}
              >
                <IconComponent className="w-5 h-5" />
                <span className="text-sm">{action.label}</span>
              </button>
              
              <button
                onClick={() => copyToClipboard(action.copyText, action.label)}
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
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}