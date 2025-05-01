'use client';

import React, { lazy, Suspense } from 'react';
import { Product } from '@/types/products';
import { Service } from '@/types/services';
import { TestimonialData, Blogs } from '@/types/content';
import GlobalLoader from '@/components/common/GlobalLoader';
import ErrorBoundary from '@/components/common/ErrorBoundary';

// Lazy-loaded homepage sections
const Products = lazy(() => import('@/components/sections/home/Products'));
const Services = lazy(() => import('@/components/sections/home/Services'));
const Testimonial = lazy(
  () => import('@/components/sections/home/Testimonial')
);
const Blog = lazy(() => import('@/components/sections/home/Blog'));
const Newsletter = lazy(() => import('@/components/sections/home/Newsletter'));

interface ClientHomeProps {
  products: Product[];
  services: Service[];
  testimonials: TestimonialData[];
  blogs: Blogs[];
}

// Helper to reduce Suspense/ErrorBoundary duplication
const LazySection = ({
  fallback,
  sectionName,
  children,
}: {
  fallback?: React.ReactNode;
  sectionName: string;
  children: React.ReactNode;
}) => (
  <ErrorBoundary sectionName={sectionName}>
    <Suspense fallback={fallback ?? <GlobalLoader stage="data" />}>
      {children}
    </Suspense>
  </ErrorBoundary>
);

const ClientHome: React.FC<ClientHomeProps> = ({
  products,
  services,
  testimonials,
  blogs,
}) => {
  return (
    <>
      <LazySection sectionName="Products">
        <Products products={products} />
      </LazySection>

      <LazySection sectionName="Services">
        <Services services={services} />
      </LazySection>

      <LazySection sectionName="Testimonials">
        <Testimonial testimonials={testimonials} />
      </LazySection>

      <LazySection sectionName="Blogs">
        <Blog blogs={blogs} />
      </LazySection>

      <LazySection sectionName="Newsletter">
        <Newsletter />
      </LazySection>
    </>
  );
};

export default ClientHome;
