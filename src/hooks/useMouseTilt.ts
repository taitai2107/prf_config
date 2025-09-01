import { useState, useCallback, useRef } from 'react';

interface TiltState {
  rotateX: number;
  rotateY: number;
}

export function useMouseTilt(maxTilt: number = 6) {
  const [tilt, setTilt] = useState<TiltState>({ rotateX: 0, rotateY: 0 });
  const elementRef = useRef<HTMLElement | null>(null);
  const throttleRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!elementRef.current) return;

    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    // Throttle for performance
    if (throttleRef.current) return;
    
    throttleRef.current = setTimeout(() => {
      throttleRef.current = null;
    }, 16); // ~60fps

    const rect = elementRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    const rotateX = (mouseY / rect.height) * maxTilt * -1;
    const rotateY = (mouseX / rect.width) * maxTilt;
    
    setTilt({ rotateX, rotateY });
  }, [maxTilt]);

  const handleMouseLeave = useCallback(() => {
    setTilt({ rotateX: 0, rotateY: 0 });
  }, []);

  const tiltStyle = {
    transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
    transition: 'transform 0.1s ease-out'
  };

  return {
    tiltStyle,
    tiltHandlers: {
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
      ref: elementRef
    }
  };
}