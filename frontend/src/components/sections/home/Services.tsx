'use client';
import React from 'react';
import Link from 'next/link';
import ServiceCard from './ServiceCard';
import servicesData from '@/data/home/services.json';
import { Service } from '@/types/services';

interface ServicesProps {
  services?: Service[];
}

const Services: React.FC<ServicesProps> = ({ services }) => {
  const servicesList = services || [];

  return (
    <section className="services-six" aria-labelledby="homepage-services">
      <div className="services-six__bg-box">
        <div
          className="services-six__bg"
          style={{
            backgroundImage: 'url(/assets/images/placeholders/services-bg.png)',
          }}
        />
      </div>
      <div className="container">
        <div className="services-six__top">
          <div className="section-title text-left">
            <div className="section-title__tagline-box">
              <span className="section-title__tagline">
                {servicesData.tagline}
              </span>
            </div>
            <h2
              className="section-title__title"
              id="homepage-services"
              dangerouslySetInnerHTML={{ __html: servicesData.title }}
            />
          </div>
          <div className="services-six__btn-box">
            <Link href="/services" className="services-six__btn thm-btn">
              Explore All Services
              <span className="icon-dabble-arrow-right" aria-hidden="true" />
            </Link>
          </div>
        </div>
        <div className="services-six__bottom">
          {servicesList.length === 0 ? (
            <p className="text-center">No services available at this time.</p>
          ) : (
            <div className="row">
              {servicesList.map((service, index) => (
                <ServiceCard
                  key={service._id || service.slug}
                  service={service}
                  delay={`${100 + index * 200}ms`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Services;
