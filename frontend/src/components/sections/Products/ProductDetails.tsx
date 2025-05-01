// src/components/sections/Products/ProductDetails.tsx
'use client';
import React from 'react';

import { Product } from '@/types/products';

interface ProductDetailsProps {
  product: Product;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  return (
    <section className="services-details">
      <div className="container">
        <div className="row">
          <div className="col-xl-8 col-lg-7">
            <div className="services-details__left">
              <div className="services-details__content">
                <h3 className="services-details__title-1">{product.title}</h3>
                {product.subtitle && (
                  <p className="services-details__text-1">{product.subtitle}</p>
                )}
                <p className="services-details__text-1">
                  {product.description?.short}
                </p>

                <h3 className="services-details__title-2">Features</h3>
                <div className="services-details__text-2">
                  <ul className="services-details__points list-unstyled">
                    {product.keyFeatures?.map((feature, index) => (
                      <li key={index}>
                        <div className="services-details__points-bullet"></div>
                        <p>{feature}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                <h3 className="services-details__title-2 mt-5">Application</h3>
                <div className="services-details__text-2">
                  <ul className="services-details__points list-unstyled">
                    {product.applications?.map((app, index) => (
                      <li key={index}>
                        <div className="services-details__points-bullet"></div>
                        <p>{app}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                <h3 className="services-details__title-2 mt-5">
                  Compatibility
                </h3>
                <div className="services-details__text-2 flex">
                  {product.compatibility?.filter((m) => m.type === 'material')
                    ?.length ? (
                    product.compatibility
                      .filter((material) => material.type === 'material')
                      .map((material, index) => {
                        const label = material.name.replace(
                          /([a-z])([A-Z])/g,
                          '$1 $2'
                        );

                        const ratingColorMap: Record<
                          | 'excellent'
                          | 'good'
                          | 'fair'
                          | 'poor'
                          | 'not_recommended'
                          | 'test_required',
                          string
                        > = {
                          excellent: 'primary', // blue
                          good: 'success', // green
                          fair: 'warning', // yellow
                          poor: 'danger', // light red
                          not_recommended: 'danger', // red
                          test_required: 'secondary', // gray
                        };

                        const badgeColor =
                          (material.rating &&
                            ratingColorMap[
                              material.rating as keyof typeof ratingColorMap
                            ]) ||
                          'secondary';

                        const badgeClass = `badge rounded-pill bg-${badgeColor}`;

                        return (
                          <div
                            key={`${material.name}-${index}`}
                            className="mb-2"
                          >
                            <span
                              className={badgeClass}
                              style={{
                                padding: '0.5em 0.75em',
                                fontSize: '0.9em',
                                marginRight: '0.5em',
                                opacity: '0.9',
                              }}
                            >
                              {label}
                            </span>
                          </div>
                        );
                      })
                  ) : (
                    <div className="text-muted fst-italic">
                      No compatible materials listed.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-lg-5">
            <div className="services-details__right">
              <div className="services-details__sidebar">
                <h3 className="services-details__sidebar-title mb-5">
                  Product Overview
                </h3>

                <p className="services-details__sidebar-text">
                  {/* {product.keyFeatures.join(', ')} */}
                </p>

                <ul className="project-details__information-list list-unstyled">
                  <li>
                    <p>
                      <span>Name:</span>
                      {product.title}
                    </p>
                  </li>
                  <li>
                    <p>
                      <span>Category:</span>
                      {product.categorySlug}
                    </p>
                  </li>
                  <li>
                    <p>
                      <span>Type: </span>
                      {product.subtitle}
                    </p>
                  </li>
                  <li>
                    <p>
                      <span>Application:</span>
                      {product.applications?.[0] && (
                        <>{product.applications[0]}</>
                      )}
                    </p>
                  </li>
                  <li>
                    <p>
                      <span>Rating:</span>
                      <i className="icon-star"></i>
                      <i className="icon-star"></i>
                      <i className="icon-star"></i>
                      <i className="icon-star"></i>
                      <i className="icon-star"></i>
                    </p>
                  </li>
                  <li>
                    <p>
                      <span>Documents: </span>
                    </p>

                    <a
                      href="mailto:info@synix.com"
                      className="btn btn-outline-primary mt-3"
                    >
                      Please contact us for Documents
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;
