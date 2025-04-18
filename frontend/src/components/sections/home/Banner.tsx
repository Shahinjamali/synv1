'use client';
import Link from 'next/link';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import React from 'react';
import bannerData from '@/data/home/banner.json';

const swiperOptions = {
  modules: [Autoplay, Pagination, Navigation],
  slidesPerView: 1,
  spaceBetween: 0,
  autoplay: {
    delay: 5000,
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

const Banner: React.FC = () => {
  return (
    <section className="main-slider-three">
      <Swiper
        {...swiperOptions}
        className="swiper-container thm-swiper__slider"
      >
        <div className="swiper-wrapper">
          {bannerData.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="swiper-slide">
                <div className="main-slider-three__social-box">
                  <div className="main-slider-three__social-title-box">
                    <h5 className="main-slider-three__social-title">
                      Follow Us
                    </h5>
                    <div className="main-slider-three__social-shape"></div>
                  </div>
                  <div className="main-slider-three__social">
                    <Link href="#">
                      <i className="icon-facebook"></i>
                    </Link>
                    <Link href="#">
                      <i className="icon-instagram"></i>
                    </Link>
                    <Link href="#">
                      <i className="icon-Frame"></i>
                    </Link>
                    <Link href="#">
                      <i className="icon-link-in"></i>
                    </Link>
                  </div>
                </div>
                <div
                  className="main-slider-three__bg"
                  style={{ backgroundImage: `url(${slide.image})` }}
                ></div>
                <div className="main-slider-three__shape-1"></div>
                <div className="container">
                  <div className="row">
                    <div className="col-xl-12">
                      <div className="main-slider-three__content">
                        <h2
                          className="main-slider-three__title"
                          dangerouslySetInnerHTML={{ __html: slide.title }}
                        />
                        <p className="main-slider-three__text">
                          {slide.description}
                        </p>
                        <div className="main-slider-three__btn-boxes">
                          <div className="main-slider-three__btn-box-1">
                            <Link
                              href={slide.links.readMore}
                              className="main-slider-three__btn-1 thm-btn"
                            >
                              Read more
                              <span className="icon-dabble-arrow-right"></span>
                            </Link>
                          </div>
                          <div className="main-slider-three__btn-box-2">
                            <Link
                              href={slide.links.contact}
                              className="main-slider-three__btn-2 thm-btn"
                            >
                              Contact Us
                              <span className="icon-dabble-arrow-right"></span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </div>
        <div className="main-slider-three__nav">
          <div
            className="swiper-button-prev h1p"
            id="main-slider__swiper-button-next"
          >
            <i className="icon-arrow-left"></i>
          </div>
          <div
            className="swiper-button-next h1n"
            id="main-slider__swiper-button-prev"
          >
            <i className="icon-arrow-right"></i>
          </div>
        </div>
      </Swiper>
    </section>
  );
};

export default Banner;
