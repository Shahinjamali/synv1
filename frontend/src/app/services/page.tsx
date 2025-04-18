'use client';

import { useEffect, useState } from 'react';
import { getServices } from '@/utils/api';
import { Service } from '@/types/services';
import Layout from '@/components/layout/Layout';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
// import { Category } from '@/types/products';

const swiperOptions = {
  modules: [Autoplay, Pagination, Navigation],
  slidesPerView: 2,
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
  breakpoints: {
    320: { slidesPerView: 1, spaceBetween: 30 },
    575: { slidesPerView: 1, spaceBetween: 30 },
    767: { slidesPerView: 1, spaceBetween: 30 },
    991: { slidesPerView: 2, spaceBetween: 30 },
    1199: { slidesPerView: 2, spaceBetween: 30 },
    1350: { slidesPerView: 2, spaceBetween: 30 },
  },
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await getServices({
          status: 'active',
          scope: 'service',
        });

        const servicesItems = response?.data?.items || [];
        setServices(servicesItems);
      } catch (err) {
        setError('Failed to load services');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <Layout breadcrumbTitle="Services">
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
            {loading ? (
              <p>Loading services...</p>
            ) : error ? (
              <p>{error}</p>
            ) : !services || services.length === 0 ? (
              <p>No services available</p>
            ) : (
              <Swiper
                {...swiperOptions}
                className="thm-swiper__slider swiper-container"
              >
                {services.map((service) => (
                  <SwiperSlide key={service._id}>
                    <div className="services-eight__single">
                      <div className="services-eight__img-box">
                        <div className="services-eight__img">
                          <Image
                            src={
                              service.mediaAssets?.[0]?.url ||
                              '/assets/images/services/services-6-1.jpg'
                            }
                            alt={service.title}
                            width={400}
                            height={300}
                            priority
                          />
                        </div>
                      </div>
                      <div className="services-eight__content">
                        <div className="services-eight__title-box">
                          <div className="services-eight__icon">
                            {/* <span
                              className={`icon-${
                                service.category === 'Predictive Maintenance'
                                  ? 'predictive'
                                  : service.category ===
                                      'Preventive Maintenance'
                                    ? 'preventive'
                                    : 'default'
                              }`}
                            ></span> */}
                          </div>
                          <h4 className="services-eight__title">
                            <Link
                              href={`/services/${service.categorySlug.toLowerCase().replace(/\s+/g, '-')}/${service.slug}`}
                            >
                              {service.title}
                            </Link>
                          </h4>
                        </div>
                        <p className="services-eight__text">
                          {service.subtitle ||
                            (service.description?.short
                              ? service.description.short.substring(0, 100) +
                                '...'
                              : '')}
                        </p>
                        <div className="services-eight__btn-box">
                          <Link
                            href={`/services/${service.categorySlug.toLowerCase().replace(/\s+/g, '-')}/${service.slug}`}
                            className="services-eight__btn thm-btn"
                          >
                            Read More
                            <span className="icon-dabble-arrow-right"></span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
            <div className="services-eight__dot-style">
              <div className="swiper-pagination"></div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
