'use client';

import { useEffect, useState, memo } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import styles from './Preloading.module.css';

interface PreloadingProps {
  text?: string;
  color?: string;
  delay?: number;
  forceLongDelay?: boolean;
}

const Preloading: React.FC<PreloadingProps> = memo(
  ({
    text = 'Synix Solutions',
    color = '#faa31a',
    delay,
    forceLongDelay = false,
  }) => {
    const [isLoading, setIsLoading] = useState(true);
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const effectiveDelay = delay ?? (forceLongDelay ? 3000 : 500);

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
        data-testid="preloading-container"
        style={
          { '--preload-delay': `${effectiveDelay}ms` } as React.CSSProperties
        }
      >
        <div
          className={styles.spinner}
          style={{
            borderTopColor: color,
            borderRightColor: 'transparent',
            borderBottomColor: 'transparent',
            borderLeftColor: 'transparent',
          }}
        />
        {text && <span className={styles.preloadingText}>{text}</span>}
      </div>
    );
  }
);

Preloading.displayName = 'Preloading';
export default Preloading;
