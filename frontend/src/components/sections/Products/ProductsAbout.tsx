'use client';
import React from 'react';
import Image from 'next/image';
import productsData from '@/data/products/about.json';

const ProductsAbout: React.FC = () => {
  const { title, tagline, description, subtitle, features, badge, image } =
    productsData;

  return (
    <section className="about-five">
      <div className="container">
        <div className="row">
          {/* Left Side: Image + Badge */}
          <div className="col-xl-6">
            <div className="about-five__left">
              <div
                className="about-five__img-box wow slideInLeft"
                data-wow-delay="100ms"
                data-wow-duration="2500ms"
              >
                <div className="about-five__shape-1 float-bob-y">
                  <Image
                    src={'/assets/images/placeholders/productCardCat.webp'}
                    alt={image?.[0]?.alt || 'Synix Product'}
                    width={image?.[0]?.width || 400}
                    height={image?.[0]?.height || 100}
                    loading="lazy"
                  />
                </div>

                {badge && (
                  <div className="about-five__experience">
                    <div className="about-five__experience-icon">
                      <span className="icon-medal"></span>
                    </div>
                    <div className="about-five__experience-content">
                      <h3 className="about-five__experience-text">
                        {badge.title}
                      </h3>
                      <h3 className="about-five__experience-text pl-2">
                        {badge.title2}
                      </h3>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Side: Text & Features */}
          <div className="col-xl-6">
            <div className="about-five__right">
              <div className="section-title text-left">
                <div className="section-title__tagline-box">
                  <span className="section-title__tagline">{tagline}</span>
                </div>
                <h2 className="section-title__title">
                  {title} <br />
                  {subtitle}
                </h2>
              </div>

              <div className="about-five__text-box">
                <p className="about-five__text">{description}</p>
              </div>

              <ul className="about-five__points list-unstyled">
                {features?.slice(0, 2).map((feature, index) => (
                  <li key={index}>
                    <div className="icon">
                      <span
                        className={
                          index === 0 ? 'icon-blueprint-1' : 'icon-renovate'
                        }
                      ></span>
                    </div>
                    <div className="text">
                      <p>
                        {feature.text} <br /> {feature.text2}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductsAbout;
