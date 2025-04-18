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

interface TestimonialProps {
  testimonials?: TestimonialData[];
}

const swiperOptions: SwiperOptions = {
  modules: [Autoplay, Pagination, Navigation],
  slidesPerView: 1,
  spaceBetween: 0,
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
          >
            {testimonialsList.map((item, index) => (
              <SwiperSlide key={item.name + index}>
                <div className="testimonial-one__single">
                  <div className="row">
                    <div className="col-xl-6 col-lg-6">
                      <div className="testimonial-one__content">
                        <div className="testimonial-one__quote">
                          <Image
                            src={item.img}
                            alt={item.name}
                            width={50}
                            height={50}
                          />
                        </div>
                        <div className="testimonial-one__client-info">
                          <h3 className="testimonial-one__title">
                            {item.name}
                          </h3>
                          <p className="testimonial-one__sub-title">
                            {item.position}
                          </p>
                        </div>
                        <p className="testimonial-one__text">{item.quote}</p>
                      </div>
                    </div>
                    <div className="col-xl-6 col-lg-6">
                      <div className="testimonial-one__img">
                        <Image
                          src="/assets/images/testimonial/testimonial-1-1.jpg"
                          alt="Synix Testimonial"
                          width={300}
                          height={400}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Controls */}
          <div
            className="testimonial-one__nav"
            aria-label="testimonial navigation"
          >
            <div
              className="swiper-button-prev1 h1p"
              role="button"
              aria-label="Previous testimonial"
            >
              <i className="icon-arrow-left"></i>
            </div>
            <div
              className="swiper-button-next1 h1n"
              role="button"
              aria-label="Next testimonial"
            >
              <i className="icon-arrow-right"></i>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutTestimonial;
