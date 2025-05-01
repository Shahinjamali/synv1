// services main list page\n\nexport default function ServicesPage() {\n  return <div>services page</div>;\n}
'use client';

'use client';

import { getServices } from '@/utils/api';
import { Service } from '@/types/services';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getServices({})
      .then((res) => {
        setServices(res.data.items);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Services Manager</h1>
      <Link href="./services/new" className="btn-primary mb-4 inline-block">
        ➕ Add New Service
      </Link>

      {loading ? (
        <p>Loading...</p>
      ) : services.length === 0 ? (
        <p>No services found.</p>
      ) : (
        <div className="space-y-4">
          {services.map((service) => (
            <div
              key={service._id}
              className="border p-4 rounded shadow-sm bg-white"
            >
              <div className="font-semibold">{service.title}</div>
              <div className="text-gray-600">{service.slug}</div>
              <Link
                href={`./services/${service.slug}`}
                className="text-blue-600 hover:underline"
              >
                ✏️ Edit
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
