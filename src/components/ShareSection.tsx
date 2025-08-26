import React, { useState } from 'react';
import { Share2, Copy, QrCode, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface ShareSectionProps {
  isDark: boolean;
}

export function ShareSection({ isDark }: ShareSectionProps) {
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);

  // Ảnh QR ngân hàng đã upload
  const qrImageUrl = 'https://res.cloudinary.com/doivdewue/image/upload/v1756226928/aceeec16-89c0-43f3-8098-4958d50ffcbc.png';
  const copyLink = 'https://res.cloudinary.com/doivdewue/image/upload/v1756226727/Screenshot_2025-08-26_234048_ygjfrw.png';

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(copyLink);
      setCopied(true);
      toast.success('Copy thành công');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Copy link thất bại');
    }
  };

  const toggleQR = () => {
    setShowQR(prev => !prev);
  };

  return (
    <div className="mb-8">
      <div className={`p-6 rounded-2xl backdrop-blur-md border ${
        isDark
          ? 'bg-white/5 border-white/10'
          : 'bg-white/70 border-white/30'
      }`}>
        <div className="flex items-center gap-3 mb-4">
          <Share2 className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
          <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
            Donate
          </h3>
        </div>

        <div className="flex gap-3">
          <button
            onClick={copyToClipboard}
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
              {copied ? 'Copied!' : 'Copy Link'}
            </span>
          </button>

          <button
            onClick={toggleQR}
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
          </button>
        </div>

        {showQR && (
          <div className="mt-6 text-center animate-fadeIn">
            <img
              src={qrImageUrl}
              alt="QR Code"
              className="mx-auto rounded-xl shadow-lg"
              style={{ maxWidth: '200px' }}
            />
            <p className={`text-sm mt-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Quét bằng điện thoại để chuyển khoản MB Bank
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
