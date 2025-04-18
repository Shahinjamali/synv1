// components/ui/Preloading.tsx
'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import styles from './Preloading.module.css';

interface PreloadingProps {
  text?: string;
  color?: string;
  delay?: number;
  forceLongDelay?: boolean; // New prop for manual control
}

const Preloading: React.FC<PreloadingProps> = ({
  text = 'Synix Solutions',
  color,
  delay,
  forceLongDelay = false,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const effectiveDelay =
    delay !== undefined
      ? delay
      : forceLongDelay
        ? 3000 // 10s if forced
        : 500; // Default 0.5s

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), effectiveDelay);
    return () => clearTimeout(timer);
  }, [pathname, searchParams, effectiveDelay]);

  if (!isLoading) return null;

  return (
    <div
      className={styles.preloadingContainer}
      role="status"
      aria-live="polite"
      style={
        { '--preload-delay': `${effectiveDelay}ms` } as React.CSSProperties
      }
    >
      <div
        className={styles.spinner}
        style={
          color
            ? {
                borderTopColor: color,
                borderRightColor: 'transparent',
                borderBottomColor: 'transparent',
                borderLeftColor: 'transparent',
              }
            : undefined
        }
      />
      {text && <span className={styles.preloadingText}>{text}</span>}
    </div>
  );
};

export default Preloading;
