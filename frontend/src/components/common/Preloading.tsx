'use client';

import { Suspense } from 'react';
import PreloadingWrappers from './preloadingWrappers';

interface PreloadingProps {
  text?: string;
  color?: string;
  delay?: number;
  forceLongDelay?: boolean;
}

export default function Preloading(props: PreloadingProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PreloadingWrappers {...props} />
    </Suspense>
  );
}
