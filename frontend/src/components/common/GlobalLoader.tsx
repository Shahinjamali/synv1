'use client';

import { useState, useEffect, memo } from 'react';
import Preloading from '@/components/common/Preloading';
import Loading from '@/components/common/Loading';

const stageTextMap = {
  hydration: 'Synix Solutions...',
  auth: 'Authenticating...',
  data: 'Loading Synix Solutions...',
  about: 'Loading About Us...',
  team: 'Loading Team Section...',
  faq: 'Loading FAQs...',
  testimonials: 'Loading Testimonials...',
} as const;

type LoaderStage = keyof typeof stageTextMap;

const GlobalLoader: React.FC<{ stage: LoaderStage }> = memo(({ stage }) => {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHydrated(true), 700);
    return () => clearTimeout(timer);
  }, []);

  const loadingText = stageTextMap[stage] ?? 'Loading...';

  if (!hydrated || stage === 'hydration') {
    return <Preloading text={loadingText} color="#f97316" />;
  }

  return (
    <div
      className="flex justify-center items-center min-h-screen"
      data-testid="global-loader"
    >
      <Loading text={loadingText} size="large" color="#1e3a8a" />
    </div>
  );
});

GlobalLoader.displayName = 'GlobalLoader';
export default GlobalLoader;
