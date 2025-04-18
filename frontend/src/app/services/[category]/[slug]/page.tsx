// app/services/[category]/[slug]/page.tsx
import { getServiceBySlug } from '@/utils/api';
import { Service } from '@/types/services';
import Image from 'next/image';
import VideoModal from '@/components/common/VideoModal';

export default async function ServiceDetails({
  params: paramsPromise,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const params = await paramsPromise;
  const { slug } = params;
  const serviceResponse = await getServiceBySlug(slug);
  const service: Service = serviceResponse.data.item; // ✅ fixed

  return (
    <>
      {/* Project Details Start */}
      <section className="project-details">
        <div className="container">
          <div className="project-details__img">
            <Image
              src={
                service.mediaAssets?.[0]?.url ||
                '/assets/images/services/services-6-1.jpg'
              }
              alt={service.title}
              width={800}
              height={600}
            />
            <div className="project-details__information">
              <div className="project-details__information-minus"></div>
              <h3 className="project-details__information-title">
                Service Information
              </h3>
              <p className="project-details__information-text">
                {service.subtitle ||
                  'Advanced predictive maintenance solutions.'}
              </p>
              <ul className="project-details__information-list list-unstyled">
                <li>
                  <p>
                    <span>Category:</span> {service.categorySlug}
                  </p>
                </li>
                <li>
                  <p>
                    <span>Status:</span> {service.metadata.status || 'Active'}
                  </p>
                </li>
                <li>
                  <p>
                    <span>Price:</span>{' '}
                    {/* {service.price ? `$${service.price}` : 'Contact for pricing'} */}
                  </p>
                </li>
                {service.duration && (
                  <li>
                    <p>
                      <span>Duration:</span> {service.duration}
                    </p>
                  </li>
                )}
                {service.applicableIndustries &&
                  service.applicableIndustries.length > 0 && (
                    <li>
                      <p>
                        <span>Industries:</span>{' '}
                        {service.applicableIndustries.join(', ')}
                      </p>
                    </li>
                  )}
              </ul>
            </div>
          </div>
          <div className="project-details__content">
            <h3 className="project-details__title">{service.title}</h3>
            <p className="project-details__text">{service.description.short}</p>
            <h3 className="project-details__title-2">Key Features</h3>

            {service.keyBenefits && service.keyBenefits.length > 0 ? (
              service.keyBenefits.map((benefit, index) => (
                <p className="project-details__text-2" key={index}>
                  {benefit}
                </p>
              ))
            ) : (
              <span>No key features available.</span>
            )}
            {service.dataSources && service.dataSources.length > 0 && (
              <div className="project-details__bottom">
                <div className="row">
                  <div className="col-xl-8 col-lg-7">
                    <div className="project-details__bottom-left">
                      <ul className="project-details__bottom-points list-unstyled">
                        {service.dataSources.map((source, index) => (
                          <li key={index}>
                            <div className="project-details__points-bullet"></div>
                            <p>
                              {source.description} ({source.type})
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-5">
                    <div className="project-details__bottom-right">
                      <div className="project-details__bottom-img">
                        <Image
                          src="/assets/images/services/dashboard-preview.jpg"
                          alt="Service Dashboard"
                          width={400}
                          height={300}
                        />
                        <VideoModal />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
