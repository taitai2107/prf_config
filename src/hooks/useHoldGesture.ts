import { useRef, useCallback } from 'react';

interface UseHoldGestureOptions {
  onHold: () => void;
  onHoldStart?: () => void;
  onHoldEnd?: () => void;
  holdDuration?: number;
  disabled?: boolean;
}

export function useHoldGesture({
  onHold,
  onHoldStart,
  onHoldEnd,
  holdDuration = 500,
  disabled = false
}: UseHoldGestureOptions) {
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isHoldingRef = useRef(false);

  const startHold = useCallback(() => {
    if (disabled || isHoldingRef.current) return;

    isHoldingRef.current = true;
    onHoldStart?.();

    // Vibrate on supported devices
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }

    holdTimerRef.current = setTimeout(() => {
      if (isHoldingRef.current) {
        onHold();
        // Stronger vibration on hold complete
        if ('vibrate' in navigator) {
          navigator.vibrate([20, 10, 20]);
        }
      }
    }, holdDuration);
  }, [onHold, onHoldStart, holdDuration, disabled]);

  const endHold = useCallback(() => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    
    if (isHoldingRef.current) {
      isHoldingRef.current = false;
      onHoldEnd?.();
    }
  }, [onHoldEnd]);

  const touchHandlers = {
    onTouchStart: startHold,
    onTouchEnd: endHold,
    onTouchCancel: endHold,
    onTouchMove: endHold, // Cancel on move
  };

  return {
    touchHandlers,
    isHolding: isHoldingRef.current
  };
}