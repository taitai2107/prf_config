import React, { useEffect, useRef } from 'react';
import { X, Download } from 'lucide-react';
import QRCode from 'qrcode';
import toast from 'react-hot-toast';

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
  isDark: boolean;
}

export function QRModal({ isOpen, onClose, url, title, isDark }: QRModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, url, {
        width: 256,
        margin: 2,
        color: {
          dark: isDark ? '#ffffff' : '#000000',
          light: isDark ? '#1e293b' : '#ffffff'
        }
      });
    }
  }, [isOpen, url, isDark]);

  const downloadQR = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = `${title.replace(/\s+/g, '_')}_QR.png`;
      link.href = canvasRef.current.toDataURL();
      link.click();
      toast.success('QR Code đã được tải xuống');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className={`relative p-6 rounded-2xl backdrop-blur-md border max-w-sm w-full ${
        isDark
          ? 'bg-slate-800/90 border-white/20'
          : 'bg-white/90 border-slate-200'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
            QR Code - {title}
          </h3>
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${
              isDark ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-black/10 text-slate-600'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="text-center">
          <div className={`p-4 rounded-xl mb-4 ${
            isDark ? 'bg-white/10' : 'bg-slate-100'
          }`}>
            <canvas ref={canvasRef} className="mx-auto" />
          </div>
          
          <button
            onClick={downloadQR}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Tải xuống QR
          </button>
        </div>
      </div>
    </div>
  );
}