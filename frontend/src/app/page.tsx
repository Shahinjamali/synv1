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
import { TestimonialData, Blogs, ContentDocument } from '@/types/content';
import { HOMEPAGE_LIMIT } from '@/data/constants/homepage';

export const metadata = {
  title: 'Synix Solutions - Home',
  description:
    'Explore sustainable lubricants and AI-driven maintenance solutions.',
};

export default async function Home() {
  try {
    const results = await Promise.allSettled([
      getProducts({ limit: HOMEPAGE_LIMIT }),
      getServices({ limit: HOMEPAGE_LIMIT }),
      getTestimonials(),
      getThreeBlogs(),
    ]);

    const [productsResult, servicesResult, testimonialsResult, blogsResult] =
      results;

    const products: Product[] =
      productsResult.status === 'fulfilled'
        ? (productsResult.value?.data?.items ?? [])
        : [];

    const services: Service[] =
      servicesResult.status === 'fulfilled'
        ? (servicesResult.value?.data?.items ?? [])
        : [];

    const testimonials: (TestimonialData & { imageUrl?: string })[] =
      testimonialsResult.status === 'fulfilled'
        ? (testimonialsResult.value.data?.map(
            (item: ContentDocument<TestimonialData>) => ({
              ...item.content,
              imageUrl:
                item.mediaAssets?.[0]?.url ??
                '/assets/images/testimonial/default.jpg',
            })
          ) ?? [])
        : [];

    const blogs: Blogs[] =
      blogsResult.status === 'fulfilled' ? (blogsResult.value?.data ?? []) : [];

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
