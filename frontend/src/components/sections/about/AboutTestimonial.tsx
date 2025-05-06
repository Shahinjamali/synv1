'use client';

import React from 'react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { SwiperOptions } from 'swiper/types';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Image from 'next/image';
import { TestimonialData } from '@/types/content';
import testimonialData from '@/data/about/testimonial.json';
import { resolveMediaUrl } from '@/utils/media';

interface TestimonialProps {
  testimonials?: TestimonialData[];
}

const swiperOptions: SwiperOptions = {
  modules: [Autoplay, Pagination, Navigation],
  slidesPerView: 1,
  spaceBetween: 0,
  loop: true,
  navigation: {
    nextEl: '.swiper-button-next1',
    prevEl: '.swiper-button-prev1',
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
};
const staticImg = '/assets/images/resources/testimonialsection.webp';

const AboutTestimonial: React.FC<TestimonialProps> = ({ testimonials }) => {
  const testimonialsList = testimonials || [];

  return (
    <section className="testimonial-one" aria-labelledby="testimonial-title">
      <div className="container">
        <div className="section-title text-center">
          <div className="section-title__tagline-box">
            <span className="section-title__tagline">
              {testimonialData.tagline}
            </span>
          </div>
          <h2 className="section-title__title" id="testimonial-title">
            {testimonialData.title}
            <br />
            {testimonialData.title2}
          </h2>
        </div>

        <div className="testimonial-one__swiper-box">
          <Swiper
            {...swiperOptions}
            className="thm-swiper__slider swiper-container"
            aria-roledescription="carousel"
            aria-label="Client Testimonials"
          >
            {testimonialsList.length > 0 ? (
              testimonialsList.map((item, index) => {
                const avatarSrc = resolveMediaUrl(item.imageUrl);
                return (
                  <SwiperSlide key={`${item.name}-${index}`}>
                    <div className="testimonial-one__single">
                      <div className="row">
                        <div className="col-xl-6 col-lg-6">
                          <div className="testimonial-one__content">
                            <div className="testimonial-one__quote">
                              <Image
                                src={avatarSrc}
                                alt={item.name || 'Anonymous'}
                                width={50}
                                height={50}
                                className="rounded-full"
                              />
                            </div>
                            <div className="testimonial-one__client-info">
                              <h3 className="testimonial-one__title">
                                {item.name || 'Anonymous'}
                              </h3>
                              <p className="testimonial-one__sub-title">
                                {item.position || 'Contributor'}
                              </p>
                            </div>
                            <p className="testimonial-one__text">
                              {item.quote || 'No testimonial provided.'}
                            </p>
                          </div>
                        </div>
                        <div className="col-xl-6 col-lg-6">
                          <div className="testimonial-one__img">
                            <Image
                              src={staticImg}
                              alt="Synix Testimonial Showcase"
                              width={300}
                              height={400}
                              className="rounded"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })
            ) : (
              <p className="text-center text-muted py-10">
                No testimonials available at this time.
              </p>
            )}
          </Swiper>

          {/* Navigation Controls */}
          <div
            className="testimonial-one__nav"
            aria-label="testimonial navigation"
          >
            <div
              className="swiper-button-prev1"
              role="button"
              aria-label="Previous testimonial"
            >
              <i className="icon-arrow-left" />
            </div>
            <div
              className="swiper-button-next1"
              role="button"
              aria-label="Next testimonial"
            >
              <i className="icon-arrow-right" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutTestimonial;
