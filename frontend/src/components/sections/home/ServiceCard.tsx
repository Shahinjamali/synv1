'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Service } from '@/types/services';

interface ServiceCardProps {
  service: Service;
  delay?: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  delay = '100ms',
}) => {
  const imageUrl =
    service.mediaAssets?.[0]?.url || '/assets/images/services/services-6-1.jpg';

  const description = service.description?.short || 'No description available.';

  const href = `/services/${service.categorySlug}/${service.slug}`;

  return (
    <div className="col-xl-4 col-lg-4 wow fadeInUp" data-wow-delay={delay}>
      <div className="services-six__single">
        <div className="services-six__img-box">
          <div className="services-six__img">
            <Image
              src={imageUrl}
              alt={`${service.title} - Reliability service`}
              width={400}
              height={300}
              loading="lazy"
            />
          </div>
        </div>
        <div className="services-six__content">
          <h3 className="services-six__title">
            <Link href={href}>{service.title}</Link>
          </h3>
          <p className="services-six__text">{description}</p>
          <div className="services-six__read-more">
            <Link href={href}>
              Read More
              <span
                className="icon-dabble-arrow-right"
                aria-hidden="true"
              ></span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
