// components/ui/Loading.tsx
'use client';

import styles from './Loading.module.css';
import { memo } from 'react';

interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  text?: string;
}

const Loading: React.FC<LoadingProps> = memo(
  ({ size = 'medium', color, text = 'Loading...' }) => {
    return (
      <div
        className={`${styles.loadingContainer} ${styles[size]}`}
        role="status"
        aria-live="polite"
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
        {text && <span className={styles.loadingText}>{text}</span>}
      </div>
    );
  }
);

Loading.displayName = 'Loading';
export default Loading;
