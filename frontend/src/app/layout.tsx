// app/layout.tsx
import '@/styles/globals.css';
import { yantramanav } from '@/lib/font';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { AuthProvider } from '@/context/AuthContext';
import { Suspense } from 'react';
import Preloading from '@/components/common/Preloading';
import GlobalLoader from '@/components/common/GlobalLoader';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const metadata = {
  title: 'Synix Solutions',
  description: 'Sustainable lubricants and AI-driven maintenance solutions.',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
  ),
  openGraph: {
    title: 'Synix Solutions - Sustainable Lubricants & Reliability',
    description:
      'Discover eco-friendly lubrication solutions with high performance.',
    url: process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000',
    images: [{ url: '/og-image.jpg', alt: 'Synix Solutions' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Synix Solutions - Sustainable Lubricants & Reliability',
    description:
      'Discover eco-friendly lubrication solutions with high performance.',
    images: ['/og-image.jpg'],
  },
};

export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1.0,
  };
}

const StructuredDataScript = () => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Synix Solutions',
        url: process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000',
        description:
          'Sustainable lubricants and AI-driven maintenance solutions.',
        logo: '/logo.png',
      }),
    }}
  />
);

export default function RootAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={yantramanav.className} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" />
        <link rel="icon" href="/favicon-48x48.png" sizes="48x48" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <StructuredDataScript />
      </head>
      <body className="flex flex-col min-h-screen">
        <Preloading
          text="Synix Solutions ..."
          color="#f97316"
          forceLongDelay={false}
        />
        <Suspense
          fallback={
            <div className="flex justify-center items-center min-h-screen">
              <GlobalLoader stage="hydration" />
            </div>
          }
        >
          <ErrorBoundary>
            <AuthProvider>
              <main className="flex-grow">{children}</main>
            </AuthProvider>
          </ErrorBoundary>
        </Suspense>
        {/* ✅ Global Toast container */}
        <ToastContainer
          position="top-right"
          autoClose={10000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          theme="colored"
        />
      </body>
    </html>
  );
}
