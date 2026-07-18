'use client';

import { useEffect, useState } from 'react';

// Returns true on phone-width viewports. SSR-safe: starts false (desktop),
// corrects on mount — a brief desktop flash on mobile is acceptable here.
export function useIsMobile(breakpoint = 760) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [breakpoint]);

  return isMobile;
}
