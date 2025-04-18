'use client';
import Link from 'next/link';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import React from 'react';
import Image from 'next/image';

const swiperOptions = {
  modules: [Autoplay, Pagination, Navigation],
  slidesPerView: 1,
  spaceBetween: 0,
  // autoplay: {
  //   delay: 2500,
  //   disableOnInteraction: false,
  // },
  loop: true,

  // Navigation
  navigation: {
    nextEl: '.h1n',
    prevEl: '.h1p',
  },

  // Pagination
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
};

const Testimonial: React.FC = () => {
  return (
    <>
      {/* Testimonial Four Start */}
      <section className="testimonial-four">
        <div className="container">
          <div className="section-title text-center">
            <div className="section-title__tagline-box">
              <span className="section-title__tagline">Clients talk</span>
            </div>
            <h2 className="section-title__title">
              Your visionour construction <br />
              the expertise
            </h2>
          </div>
          <div className="row">
            <div className="col-xl-7">
              <div className="testimonial-four__left">
                <div className="testimonial-four__img">
                  <Image
                    src="/assets/images/testimonial/testimonial-four-img-1.jpg"
                    alt="Testimonial Image"
                    width={600} // Adjust these values based on your image's dimensions
                    height={400}
                  />
                </div>
              </div>
            </div>
            <div className="col-xl-5">
              <div className="testimonial-four__right">
                <Swiper
                  {...swiperOptions}
                  className="thm-swiper__slider swiper-container"
                >
                  <div className="swiper-wrapper">
                    {/*Testimonial Four Single Start*/}
                    <SwiperSlide>
                      <div className="swiperslide">
                        <div className="testimonial-four__single">
                          <div className="testimonial-four__quote-and-rating">
                            <div className="testimonial-four__quote">
                              <span className="icon-quote-2"></span>
                            </div>
                            <div className="testimonial-four__rating">
                              <span className="icon-star"></span>
                              <span className="icon-star"></span>
                              <span className="icon-star"></span>
                              <span className="icon-star"></span>
                              <span className="icon-star"></span>
                            </div>
                          </div>
                          <p className="testimonial-four__text">
                            Financial planners hel people to knowledge about how
                            inv and i save their moneye the mo efficient way ve
                            plan nerst a people tioniio know ledige in about how
                            thr man loren ipsum
                          </p>
                          <div className="testimonial-four__client-info">
                            <div className="testimonial-four__client-img">
                              <Image
                                src="/assets/images/testimonial/testimonial-four-client-1-1.jpg"
                                alt="Client 1"
                                width={80} // Adjust these values based on your image's dimensions
                                height={80}
                              />
                            </div>
                            <div className="testimonial-four__client-content">
                              <h5 className="testimonial-four__client-name">
                                Eleanor Pena
                              </h5>
                              <p className="testimonial-four__client-sub-title">
                                Creative Partner
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                    {/*Testimonial Four Single End*/}
                    {/*Testimonial Four Single Start*/}
                    <SwiperSlide>
                      <div className="swiperslide">
                        <div className="testimonial-four__single">
                          <div className="testimonial-four__quote-and-rating">
                            <div className="testimonial-four__quote">
                              <span className="icon-quote-2"></span>
                            </div>
                            <div className="testimonial-four__rating">
                              <span className="icon-star"></span>
                              <span className="icon-star"></span>
                              <span className="icon-star"></span>
                              <span className="icon-star"></span>
                              <span className="icon-star"></span>
                            </div>
                          </div>
                          <p className="testimonial-four__text">
                            Financial planners hel people to knowledge about how
                            inv and i save their moneye the mo efficient way ve
                            plan nerst a people tioniio know ledige in about how
                            thr man loren ipsum
                          </p>
                          <div className="testimonial-four__client-info">
                            <div className="testimonial-four__client-img">
                              <Image
                                src="/assets/images/testimonial/testimonial-four-client-1-2.jpg"
                                alt="Client 2"
                                width={80} // Adjust these values based on your image's dimensions
                                height={80}
                              />
                            </div>
                            <div className="testimonial-four__client-content">
                              <h5 className="testimonial-four__client-name">
                                Grant Elliot
                              </h5>
                              <p className="testimonial-four__client-sub-title">
                                Creative Partner
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                    {/*Testimonial Four Single End*/}
                    {/*Testimonial Four Single Start*/}
                    <SwiperSlide>
                      <div className="swiperslide">
                        <div className="testimonial-four__single">
                          <div className="testimonial-four__quote-and-rating">
                            <div className="testimonial-four__quote">
                              <span className="icon-quote-2"></span>
                            </div>
                            <div className="testimonial-four__rating">
                              <span className="icon-star"></span>
                              <span className="icon-star"></span>
                              <span className="icon-star"></span>
                              <span className="icon-star"></span>
                              <span className="icon-star"></span>
                            </div>
                          </div>
                          <p className="testimonial-four__text">
                            Financial planners hel people to knowledge about how
                            inv and i save their moneye the mo efficient way ve
                            plan nerst a people tioniio know ledige in about how
                            thr man loren ipsum
                          </p>
                          <div className="testimonial-four__client-info">
                            <div className="testimonial-four__client-img">
                              <Image
                                src="/assets/images/testimonial/testimonial-four-client-1-3.jpg"
                                alt="Client 3"
                                width={80} // Adjust these values based on your image's dimensions
                                height={80}
                              />
                            </div>
                            <div className="testimonial-four__client-content">
                              <h5 className="testimonial-four__client-name">
                                Asle Brown
                              </h5>
                              <p className="testimonial-four__client-sub-title">
                                Creative Partner
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                    {/*Testimonial Four Single End*/}
                  </div>
                  <div className="testimonial-four__dot-style">
                    <div className="swiper-dot-style1"></div>
                  </div>
                </Swiper>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Testimonial Four End */}
    </>
  );
};

export default Testimonial;
