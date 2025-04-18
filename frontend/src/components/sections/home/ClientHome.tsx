'use client';

import React, { lazy, Suspense } from 'react';
import { Product } from '@/types/products';
import { Service } from '@/types/services';
import { TestimonialData, Blogs } from '@/types/content';
import GlobalLoader from '@/components/common/GlobalLoader';

// Lazy-loaded sections
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

const ClientHome: React.FC<ClientHomeProps> = ({
  products,
  services,
  testimonials,
  blogs,
}) => {
  return (
    <>
      <Suspense fallback={<GlobalLoader stage="data" />}>
        <Products products={products} />
      </Suspense>

      <Suspense fallback={<GlobalLoader stage="data" />}>
        <Services services={services} />
      </Suspense>

      <Suspense fallback={<GlobalLoader stage="data" />}>
        <Testimonial testimonials={testimonials} />
      </Suspense>

      <Suspense fallback={<GlobalLoader stage="data" />}>
        <Blog blogs={blogs} />
      </Suspense>

      <Suspense fallback={<GlobalLoader stage="data" />}>
        <Newsletter />
      </Suspense>
    </>
  );
};

export default ClientHome;
