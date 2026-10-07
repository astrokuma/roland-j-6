import { useRef } from "react";

/** Horizontal swipe detection that leaves vertical scrolling alone. */
const useSwipe = ({ onSwipeLeft, onSwipeRight, threshold = 70 }) => {
  const start = useRef(null);

  return {
    onTouchStart: (event) => {
      const touch = event.touches[0];
      start.current = { x: touch.clientX, y: touch.clientY };
    },
    onTouchEnd: (event) => {
      if (!start.current) return;
      const touch = event.changedTouches[0];
      const dx = touch.clientX - start.current.x;
      const dy = touch.clientY - start.current.y;
      start.current = null;
      if (Math.abs(dx) < threshold || Math.abs(dx) < Math.abs(dy) * 2) return;
      if (dx < 0) onSwipeLeft?.();
      else onSwipeRight?.();
    },
  };
};

export default useSwipe;
