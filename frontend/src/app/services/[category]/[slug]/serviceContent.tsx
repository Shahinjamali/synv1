'use client';

import React, { useEffect, useState } from 'react';
import { getServiceBySlug } from '@/utils/api';
import { Service } from '@/types/services';
import ServiceDetails from '@/components/sections/services/ServiceDetails';
import GlobalLoader from '@/components/common/GlobalLoader';

const ServiceContent = ({ slug }: { slug: string }) => {
  const [service, setService] = useState<Service | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await getServiceBySlug(slug);
        setService(res.data);
      } catch (err) {
        setError(true);
        if (process.env.NODE_ENV === 'development') {
          console.error('Service fetch error:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [slug]);

  if (error) {
    return (
      <div className="text-center text-danger py-20">
        Service not found or failed to load.
      </div>
    );
  }

  if (loading || !service) {
    return <GlobalLoader stage={'data'} />;
  }

  return <ServiceDetails service={service} />;
};

export default ServiceContent;
