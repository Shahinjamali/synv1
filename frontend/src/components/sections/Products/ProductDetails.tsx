// src/components/sections/Products/ProductDetails.tsx
'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { Product, AuthenticatedProduct } from '@/types/products';

// Type guard to check if product is at least AuthenticatedProduct
const hasSpecifications = (
  product: Product
): product is AuthenticatedProduct => {
  return 'specifications' in product;
};

interface ProductDetailsProps {
  product: Product;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const { user, isAuthenticated } = useAuth();
  const roles = user?.roles || [];
  const isAdmin = roles.includes('admin');
  const isSuperadmin = roles.includes('superadmin');
  const isAnalyst = roles.includes('analyst');
  const isSubscriber = roles.includes('subscriber');

  const canSeeTDS = isAnalyst || isAdmin || isSuperadmin;
  const canSeeSDS = isSubscriber || isAdmin || isSuperadmin;

  console.log('Product Details:', product); // Log the product for debugging

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
                {product.media?.thumbnails[0] && (
                  <Image
                    src={product.media.thumbnails[0].url}
                    alt={product.title}
                    width={600}
                    height={400}
                    className="my-4"
                  />
                )}
                <p className="services-details__text-1">
                  {product.description?.short}
                </p>
                {isAuthenticated && product.description.detailed && (
                  <>
                    <h3 className="services-details__title-2">
                      Product Details
                    </h3>
                    <p className="services-details__text-2">
                      {product.description.detailed}
                    </p>
                  </>
                )}
                {(isAnalyst || isAdmin || isSuperadmin) &&
                  hasSpecifications(product) &&
                  product.specifications && (
                    <>
                      <h3 className="services-details__title-2">
                        Specifications
                      </h3>
                      <ul className="services-details__points list-unstyled">
                        {product.specifications.map((spec, idx) => (
                          <li key={idx}>
                            <div className="services-details__points-bullet"></div>
                            <p>
                              {spec.key}: {spec.value} {spec.unit || ''}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                {(isAdmin || isSuperadmin || isAnalyst || isSubscriber) &&
                  product.media.documents && (
                    <div className="services-details__bottom">
                      <h3 className="services-details__title-2">Documents</h3>
                      <div className="row">
                        {product.media.documents.map((doc, idx) => {
                          if (
                            (doc.type === 'TDS' && canSeeTDS) ||
                            (doc.type === 'SDS' && canSeeSDS) ||
                            doc.type === 'Cert'
                          ) {
                            return (
                              <div key={idx} className="col-xl-6">
                                <div className="services-details__bottom-single">
                                  <div className="services-details__icon">
                                    <span
                                      className={
                                        doc.type === 'TDS'
                                          ? 'icon-architect'
                                          : doc.type === 'SDS'
                                            ? 'icon-brick-wall'
                                            : 'icon-swift-cargo'
                                      }
                                    ></span>
                                  </div>
                                  <h3 className="services-details__bottom-title">
                                    <a
                                      href={doc.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {doc.title || doc.type}
                                    </a>
                                  </h3>
                                  <p className="services-details__bottom-text">
                                    {doc.type === 'TDS'
                                      ? 'Technical Data Sheet'
                                      : doc.type === 'SDS'
                                        ? 'Safety Data Sheet'
                                        : 'Certification'}
                                  </p>
                                  <div className="services-details__bottom-btn-box">
                                    <a
                                      href={doc.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="services-details__bottom-btn thm-btn"
                                    >
                                      Download
                                      <span className="icon-dabble-arrow-right"></span>
                                    </a>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-lg-5">
            <div className="services-details__right">
              <div className="services-details__sidebar">
                <h3 className="services-details__sidebar-title">
                  Product Overview
                </h3>
                {/* <span className="services-details__sidebar-sub-title">
                  {product.category} - {product.subcategory}
                </span> */}
                <p className="services-details__sidebar-text">
                  {/* {product.keyFeatures.join(', ')} */}
                </p>
                {isAuthenticated &&
                  'applications' in product &&
                  product.applications && (
                    <>
                      <h3 className="services-details__sidebar-title-2">
                        Applications
                      </h3>
                      <p className="services-details__sidebar-text-2">
                        {product.applications.context ||
                          product.applications.range.join(', ')}
                      </p>
                      <ul className="services-details__sidebar-points list-unstyled">
                        {product.applications.range.map((app, idx) => (
                          <li key={idx}>
                            <div className="icon">
                              <span className="icon-check"></span>
                            </div>
                            <p>{app}</p>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                {(isAdmin || isSuperadmin) &&
                  'visibility' in product &&
                  product.visibility && (
                    <div className="services-details__sidebar-btn-box">
                      <Link
                        href={`/dashboard/admin/products/edit/${product.slug}`}
                        className="services-details__sidebar-btn thm-btn"
                      >
                        Edit Product
                        <span className="icon-dabble-arrow-right"></span>
                      </Link>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;
