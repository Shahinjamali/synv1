// app/page.tsx
import { Suspense } from 'react';
import Layout from '@/components/layout/Layout';
import Banner from '@/components/sections/home/Banner';
import About from '@/components/sections/home/About';
import GlobalLoader from '@/components/common/GlobalLoader';
import {
  getProducts,
  getServices,
  getTestimonials,
  getThreeBlogs,
} from '@/utils/api';
import ClientHome from '@/components/sections/home/ClientHome';
import { Product } from '@/types/products';
import { Service } from '@/types/services';
import { TestimonialData, Blogs } from '@/types/content';
import { HOMEPAGE_LIMIT } from '@/data/constants/homepage';
// import * as Sentry from '@sentry/nextjs'; // Uncomment when ready

export const metadata = {
  title: 'Synix Solutions - Home',
  description:
    'Explore sustainable lubricants and AI-driven maintenance solutions.',
};

export default async function Home() {
  try {
    const [productsRes, servicesRes, testimonialsRes, blogsRes] =
      await Promise.all([
        getProducts({ limit: HOMEPAGE_LIMIT }),
        getServices({ limit: HOMEPAGE_LIMIT }),
        getTestimonials(),
        getThreeBlogs(),
      ]);

    const products: Product[] = productsRes?.data?.items ?? [];
    const services: Service[] = servicesRes?.data?.items ?? [];
    const testimonials: TestimonialData[] = testimonialsRes?.data ?? [];
    const blogs: Blogs[] = blogsRes?.data ?? [];

    return (
      <Layout>
        <Banner />
        <About />
        <Suspense
          fallback={
            <div className="flex justify-center items-center min-h-[200px]">
              <GlobalLoader stage="data" />
            </div>
          }
        >
          <ClientHome
            products={products}
            services={services}
            testimonials={testimonials}
            blogs={blogs}
          />
        </Suspense>
      </Layout>
    );
  } catch (error) {
    if (process.env.NODE_ENV === 'production') {
      // Sentry.captureException(error);
    }
    console.error('[Home Page] Data fetch failed:', error);
    return (
      <Layout>
        <div className="text-center py-16 text-red-600 font-semibold">
          Error loading Synix homepage content. Please try again later.
        </div>
      </Layout>
    );
  }
}
