'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Service } from '@/types/services';

const PLACEHOLDER_IMAGE = '/assets/images/placeholders/service.webp';

interface ServiceCardProps {
  service: Service;
  delay?: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  delay = '100ms',
}) => {
  const imageUrl =
    Array.isArray(service.mediaAssets) && service.mediaAssets.length > 0
      ? (service.mediaAssets.find((asset) => asset.type === 'bannerMini')
          ?.url ?? PLACEHOLDER_IMAGE)
      : PLACEHOLDER_IMAGE;

  const isValidLink = service.slug && service.categorySlug;
  const hrefUrl = isValidLink
    ? `/services/${service.categorySlug}/${service.slug}`
    : '/services';

  return (
    <div className="col-xl-4 col-lg-4 wow fadeInUp" data-wow-delay={delay}>
      <article
        className="services-six__single"
        aria-label={`Service: ${service.title}`}
      >
        <div className="services-six__img-box">
          <div className="services-six__img">
            <Image
              src={imageUrl}
              alt={`${service.title} - Reliability service`}
              width={400}
              height={300}
              loading="lazy"
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
        </div>
        <div className="services-six__content">
          <h3 className="services-six__title">
            <Link href={hrefUrl}>{service.title}</Link>
          </h3>
          <p className="services-six__text">
            {service.description?.short || 'No description available.'}
          </p>
          <div className="services-six__read-more">
            <Link href={hrefUrl}>
              Read More
              <span className="icon-dabble-arrow-right" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
};

export default ServiceCard;
