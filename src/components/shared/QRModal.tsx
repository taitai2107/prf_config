import React, { useEffect, useRef } from 'react';
import { Download } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`QR Code - ${title}`}
      isDark={isDark}
      maxWidth="sm"
    >
      <div className="text-center">
        <div className={`p-4 rounded-xl mb-4 ${
          isDark ? 'bg-white/10' : 'bg-slate-100'
        }`}>
          <canvas ref={canvasRef} className="mx-auto" />
        </div>
        
        <Button
          onClick={downloadQR}
          variant="primary"
          icon={Download}
          className="w-full"
        >
          Tải xuống QR
        </Button>
      </div>
    </Modal>
  );
}