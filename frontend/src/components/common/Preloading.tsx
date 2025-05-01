'use client';

import { Suspense } from 'react';
import PreloadingWrapper from './preloadingWrapper';

interface PreloadingProps {
  text?: string;
  color?: string;
  delay?: number;
  forceLongDelay?: boolean;
}

export default function PreloadingWrapper(props: PreloadingProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PreloadingWrapper {...props} />
    </Suspense>
  );
}
