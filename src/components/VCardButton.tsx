import React from 'react';
import { UserPlus } from 'lucide-react';
import { generateVCard, downloadVCard } from '../utils/vcard';
import toast from 'react-hot-toast';

interface VCardButtonProps {
  profile: {
    name: string;
    phone: string;
    email: string;
  };
  isDark: boolean;
}

export function VCardButton({ profile, isDark }: VCardButtonProps) {
  const handleDownload = () => {
    const vcard = generateVCard({
      name: profile.name,
      phone: profile.phone,
      email: profile.email,
      url: window.location.href,
      organization: 'Personal'
    });
    
    downloadVCard(vcard, profile.name.replace(/\s+/g, '_'));
    toast.success('vCard đã được tải xuống');
  };

  return (
    <button
      onClick={handleDownload}
      className={`w-full p-4 rounded-2xl backdrop-blur-md border transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl flex items-center justify-center gap-3 ${
        isDark
          ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white'
          : 'bg-white/70 border-white/30 hover:bg-white/90 text-slate-800'
      }`}
    >
      <UserPlus className="w-5 h-5" />
      <span className="font-medium">Thêm vào danh bạ</span>
    </button>
  );
}