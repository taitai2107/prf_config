import { useRef, useCallback } from 'react';
import { HOLD_DURATION } from '../constants';

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
  holdDuration = HOLD_DURATION,
  disabled = false
}: UseHoldGestureOptions) {
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isHoldingRef = useRef(false);

  const startHold = useCallback(() => {
    if (disabled || isHoldingRef.current) return;

    isHoldingRef.current = true;
    onHoldStart?.();

    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }

    holdTimerRef.current = setTimeout(() => {
      if (isHoldingRef.current) {
        onHold();
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

  return {
    touchHandlers: {
      onTouchStart: startHold,
      onTouchEnd: endHold,
      onTouchCancel: endHold,
      onTouchMove: endHold,
    },
    isHolding: isHoldingRef.current
  };
}