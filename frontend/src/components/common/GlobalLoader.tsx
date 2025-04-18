'use client';

import { useState, useEffect } from 'react';
import Preloading from '@/components/common/Preloading';
import Loading from '@/components/common/Loading';

type LoaderStage =
  | 'hydration'
  | 'auth'
  | 'data'
  | 'about'
  | 'team'
  | 'faq'
  | 'testimonials';

const stageTextMap: Record<LoaderStage, string> = {
  hydration: 'Synix Solutions...',
  auth: 'Authenticating...',
  data: 'Loading Synix Solutions...',
  about: 'Loading About Us...',
  team: 'Loading Team Section...',
  faq: 'Loading FAQs...',
  testimonials: 'Loading Testimonials...',
};

const GlobalLoader = ({ stage }: { stage: LoaderStage }) => {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHydrated(true), 700);
    return () => clearTimeout(timer);
  }, []);

  const loadingText = stageTextMap[stage] || 'Loading...';

  if (!hydrated || stage === 'hydration') {
    return <Preloading text={loadingText} color="#f97316" />;
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Loading text={loadingText} size="large" color="#1e3a8a" />
    </div>
  );
};

export default GlobalLoader;
