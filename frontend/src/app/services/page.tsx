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
        if (process.env.NODE_ENV === 'development') {
          console.error(err);
        }
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
              <p className="text-danger">{error}</p>
            ) : services.length === 0 ? (
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
                    const imageUrl =
                      service.mediaAssets?.find(
                        (asset) => asset.type === 'serviceCard'
                      )?.url || '/assets/images/placeholders/servicecat.webp';

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
                                src={imageUrl}
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
                              {service.subtitle ||
                                truncateWords(
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
    </Layout>
  );
}
