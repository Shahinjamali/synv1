'use client';

import Link from 'next/link';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import React from 'react';
import bannerData from '@/data/home/banner.json';
import socials from '@/data/common/socials.json';

const swiperOptions = {
  modules: [Autoplay, Pagination, Navigation],
  slidesPerView: 1,
  spaceBetween: 0,
  autoplay: { delay: 5000, disableOnInteraction: false },
  loop: true,
  navigation: { nextEl: '.h1n', prevEl: '.h1p' },
  pagination: { el: '.swiper-pagination', clickable: true },
};

const Banner: React.FC = () => {
  const renderSocialLinks = () => (
    <div className="main-slider-three__social flex gap-4">
      {socials.map((social, index) => (
        <Link
          key={index}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.platform}
        >
          <i className={social.icon} />
        </Link>
      ))}
    </div>
  );

  return (
    <section className="main-slider-three" aria-label="Homepage Slider">
      <Swiper
        {...swiperOptions}
        className="swiper-container thm-swiper__slider"
      >
        {Array.isArray(bannerData) && bannerData.length > 0 ? (
          bannerData.map((slide) => (
            <SwiperSlide key={slide.id}>
              {/* Social Section */}
              <div className="main-slider-three__social-box">
                <div className="main-slider-three__social-title-box">
                  <h5 className="main-slider-three__social-title">Follow Us</h5>
                  <div className="main-slider-three__social-shape" />
                </div>
                {renderSocialLinks()}
              </div>

              {/* Background */}
              <div
                className="main-slider-three__bg"
                style={{ backgroundImage: `url(${slide.image})` }}
                aria-hidden="true"
              ></div>
              <div className="main-slider-three__shape-1" />

              {/* Slide Content */}
              <div className="container">
                <div className="main-slider-three__content">
                  <h2
                    className="main-slider-three__title"
                    dangerouslySetInnerHTML={{ __html: slide.title }}
                  />
                  <p className="main-slider-three__text">{slide.description}</p>
                  <div className="main-slider-three__btn-boxes">
                    <Link
                      href={slide.links.readMore}
                      className="main-slider-three__btn-1 thm-btn"
                    >
                      Read more <span className="icon-dabble-arrow-right" />
                    </Link>
                    <Link
                      href={slide.links.contact}
                      className="main-slider-three__btn-2 thm-btn"
                    >
                      Contact Us <span className="icon-dabble-arrow-right" />
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))
        ) : (
          <div className="text-center text-red-600 py-8">
            No banner data available.
          </div>
        )}

        {/* Navigation */}
        <div className="main-slider-three__nav">
          <div className="swiper-button-prev h1p">
            <i className="icon-arrow-left" />
          </div>
          <div className="swiper-button-next h1n">
            <i className="icon-arrow-right" />
          </div>
        </div>
      </Swiper>
    </section>
  );
};

export default Banner;
