'use client';

import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';

/**
 * A safe component to render relative time without hydration mismatches.
 * It waits until after the initial client-side render to display the time.
 */
export function RelativeTime({ date, short = false }: { date: string | Date; short?: boolean }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <span className="opacity-0">Loading...</span>;
  }

  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return <span>Recently</span>;
    
    const distance = formatDistanceToNow(dateObj, { addSuffix: !short });
    
    // Simple shortener logic if requested
    if (short) {
      return <span>{distance.replace('about ', '').replace('less than a minute', 'just now')}</span>;
    }

    return <span>{distance}</span>;
  } catch (e) {
    return <span>Recently</span>;
  }
}
