import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Layout from '@/components/layout/Layout';
import AboutBanner from '@/components/sections/about/AboutBanner';
import WhyUs from '@/components/sections/about/WhyUs';
import AboutContact from '@/components/sections/about/AboutContact';
import AboutFeatures from '@/components/sections/about/AboutFeatures';
import { getTestimonials } from '@/utils/api';
import { TestimonialData } from '@/types/content';
import GlobalLoader from '@/components/common/GlobalLoader';

// Metadata for SEO
export const metadata = {
  title: 'About Us - Synix Solutions',
  description:
    'Learn more about Synix Solutions, our mission, our team, and our commitment to sustainable innovation.',
};

// Lazy load heavier sections
const AboutTeam = dynamic(
  () => import('@/components/sections/about/AboutTeam'),
  {
    loading: () => <GlobalLoader stage="team" />,
  }
);
const AboutFaq = dynamic(() => import('@/components/sections/about/AboutFaq'), {
  loading: () => <GlobalLoader stage="faq" />,
});
const AboutTestimonial = dynamic(
  () => import('@/components/sections/about/AboutTestimonial'),
  {
    loading: () => <GlobalLoader stage="testimonials" />,
  }
);

export default async function About() {
  try {
    const testimonialsResponse = await getTestimonials();
    const testimonials: TestimonialData[] = testimonialsResponse.data;

    return (
      <Suspense fallback={<GlobalLoader stage="about" />}>
        <Layout breadcrumbTitle="About Us">
          <AboutBanner />
          <AboutFeatures />
          <WhyUs />
          <AboutTeam />
          <AboutFaq />
          <AboutTestimonial testimonials={testimonials} />
          <AboutContact />
        </Layout>
      </Suspense>
    );
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('About page fetch error:', error);
    }
    return (
      <Layout breadcrumbTitle="About Us">
        <div className="text-center py-20 text-red-600 font-semibold">
          Sorry, we couldnt load the About page right now. Please try again
          later.
        </div>
      </Layout>
    );
  }
}
