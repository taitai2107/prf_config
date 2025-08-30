import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
      toast.success(t('share.qrDownloaded'));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          
          <motion.div 
            className={`relative p-6 rounded-2xl backdrop-blur-md border max-w-sm w-full ${
            isDark
              ? 'bg-slate-800/90 border-white/20'
              : 'bg-white/90 border-slate-200'
          }`}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                QR Code - {title}
              </h3>
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`p-2 rounded-full transition-colors ${
                  isDark ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-black/10 text-slate-600'
                }`}
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>
            
            <div className="text-center">
              <motion.div 
                className={`p-4 rounded-xl mb-4 ${
                isDark ? 'bg-white/10' : 'bg-slate-100'
              }`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <canvas ref={canvasRef} className="mx-auto" />
              </motion.div>
              
              <motion.button
                onClick={downloadQR}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Tải xuống QR
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
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