import { useState, useCallback } from 'react';

interface RippleState {
  x: number;
  y: number;
  isActive: boolean;
}

export function useRipple() {
  const [ripple, setRipple] = useState<RippleState>({ x: 0, y: 0, isActive: false });

  const createRipple = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    
    let clientX: number, clientY: number;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    setRipple({ x, y, isActive: true });
    
    // Reset ripple after animation
    setTimeout(() => {
      setRipple(prev => ({ ...prev, isActive: false }));
    }, 300);
  }, []);

  const RippleEffect = ({ color = 'rgba(255, 255, 255, 0.3)' }: { color?: string }) => {
    if (!ripple.isActive) return null;

    return (
      <div
        className="absolute pointer-events-none rounded-full animate-ping"
        style={{
          left: ripple.x - 10,
          top: ripple.y - 10,
          width: 20,
          height: 20,
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          animation: 'ripple 300ms ease-out'
        }}
      />
    );
  };

  return {
    createRipple,
    RippleEffect
  };
}