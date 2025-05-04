'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Service } from '@/types/services';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { resolveMediaUrl } from '@/utils/media'; // ✅ Import your helper

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface servicesListProps {
  services: Service[];
  title2?: string;
  header?: string;
}

const swiperOptions = {
  modules: [Autoplay, Pagination, Navigation],
  slidesPerView: 2,
  spaceBetween: 30,
  loop: true,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  breakpoints: {
    320: { slidesPerView: 1, spaceBetween: 30 },
    991: { slidesPerView: 2, spaceBetween: 30 },
  },
};

const truncateWords = (text: string, limit: number): string => {
  const words = text.trim().split(/\s+/);
  return words.length <= limit ? text : words.slice(0, limit).join(' ') + '...';
};

const PLACEHOLDER_IMAGE = '/assets/images/placeholders/servicecat.webp';

export default function servicesList({ services }: servicesListProps) {
  return (
    <section className="services-eight">
      <div className="container">
        <div className="section-title text-center">
          <div className="section-title__tagline-box">
            <span className="section-title__tagline">Our Expertise</span>
          </div>
          <h2 className="section-title__title">
            Predictive Maintenance <br /> Powered by AI
          </h2>
        </div>

        <div className="services-eight__carousel-box">
          {services.length === 0 ? (
            <p>No services available at this time.</p>
          ) : (
            <>
              <Swiper
                {...swiperOptions}
                className="thm-swiper__slider swiper-container"
                aria-roledescription="carousel"
                aria-label="Service Highlights Carousel"
              >
                {services.map((service) => {
                  const rawUrl = service.mediaAssets?.find(
                    (asset) => asset.type === 'cardFeature'
                  )?.url;

                  const cardImage =
                    resolveMediaUrl(rawUrl) || PLACEHOLDER_IMAGE;

                  const categoryPath = service.categorySlug
                    ? service.categorySlug.toLowerCase().replace(/\s+/g, '-')
                    : 'uncategorized';

                  const detailHref = `/services/${categoryPath}/${service.slug}`;

                  return (
                    <SwiperSlide key={service._id}>
                      <div className="services-eight__single">
                        <div className="services-eight__img-box">
                          <div className="services-eight__img">
                            <Image
                              src={cardImage}
                              alt={service.title}
                              width={400}
                              height={300}
                              loading="lazy"
                            />
                          </div>
                        </div>
                        <div className="services-eight__content">
                          <div className="services-eight__title-box">
                            <h4 className="services-eight__title">
                              <Link href={detailHref}>{service.title}</Link>
                            </h4>
                          </div>
                          <p className="services-eight__text">
                            {truncateWords(
                              service.description?.short || '',
                              20
                            )}
                          </p>
                          <div className="services-eight__btn-box">
                            <Link
                              href={detailHref}
                              className="services-eight__btn thm-btn"
                            >
                              Read More
                              <span className="icon-dabble-arrow-right" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
              <div className="services-eight__dot-style">
                <div className="swiper-pagination" />
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
