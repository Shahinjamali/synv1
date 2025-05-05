'use client';

import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import React from 'react';
import Image from 'next/image';
import { TestimonialData } from '@/types/content';
import testimonialData from '@/data/home/testimonials.json';
import { truncateWords } from '@/utils/string';
import { resolveMediaUrl } from '@/utils/media';

interface TestimonialProps {
  testimonials?: TestimonialData[];
}

const swiperOptions = {
  modules: [Autoplay, Pagination, Navigation],
  slidesPerView: 1,
  spaceBetween: 0,
  autoplay: {
    delay: 7000,
    disableOnInteraction: false,
  },
  loop: true,
  navigation: {
    nextEl: '.h1n',
    prevEl: '.h1p',
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
};

const Testimonial: React.FC<TestimonialProps> = ({ testimonials }) => {
  const testimonialsList = testimonials || [];
  const staticImg = '/assets/images/placeholders/testimonialsection.webp';
  const placeholder = resolveMediaUrl(staticImg);

  return (
    <section
      className="testimonial-four"
      aria-labelledby="testimonial-section-title"
    >
      <div className="container">
        <div className="section-title text-center">
          <div className="section-title__tagline-box">
            <span className="section-title__tagline">
              {testimonialData.tagline}
            </span>
          </div>
          <h2 className="section-title__title" id="testimonial-section-title">
            {testimonialData.title} <br /> {testimonialData.title2}
          </h2>
        </div>
        <div className="row">
          <div className="col-xl-7">
            <div className="testimonial-four__left">
              <div className="testimonial-four__img">
                <Image
                  src={placeholder}
                  alt="Synix Clients"
                  width={600}
                  height={400}
                  style={{ width: '100%', height: 'auto' }}
                />
              </div>
            </div>
          </div>
          <div className="col-xl-5">
            <div className="testimonial-four__right">
              <Swiper
                {...swiperOptions}
                className="thm-swiper__slider"
                aria-roledescription="carousel"
                aria-label="Client Testimonials"
              >
                {testimonialsList.map((testimonial, index) => {
                  const avatarSrc = resolveMediaUrl(testimonial.imageUrl);

                  return (
                    <SwiperSlide
                      key={testimonial.name ?? index}
                      role="group"
                      aria-label={`Testimonial from ${testimonial.name}`}
                    >
                      <div className="testimonial-four__single">
                        <div className="testimonial-four__quote-and-rating">
                          <div className="testimonial-four__quote">
                            <span className="icon-quote-2" />
                          </div>
                          <div className="testimonial-four__rating">
                            {Array.from(
                              { length: Math.ceil(testimonial.rating) },
                              (_, i) => (
                                <span
                                  key={i}
                                  className="icon-star text-yellow-400"
                                ></span>
                              )
                            )}
                          </div>
                        </div>
                        <p className="testimonial-four__text">
                          {truncateWords(testimonial.quote, 30)}
                        </p>
                        <div className="testimonial-four__client-info">
                          <div className="testimonial-four__client-img">
                            <Image
                              src={avatarSrc}
                              alt={testimonial.name}
                              width={80}
                              height={80}
                              style={{ borderRadius: '50%' }}
                            />
                          </div>
                          <div className="testimonial-four__client-content">
                            <h5 className="testimonial-four__client-name">
                              {testimonial.name}
                            </h5>
                            <p className="testimonial-four__client-sub-title">
                              {testimonial.position}
                            </p>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
