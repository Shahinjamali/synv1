'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import heroData from '@/data/about/hero.json';

const PLACEHOLDER_IMAGE = '/assets/images/resources/about-banner.webp';

const AboutBanner: React.FC = () => {
  const { image, tagline, title, description, features } = heroData;

  return (
    <section
      className="about-one about-seven"
      aria-labelledby="about-banner-title"
    >
      <div className="container">
        <div className="row">
          {/* Image Section */}
          <div className="col-xl-6">
            <div className="about-one__left">
              <div
                className="about-one__img wow slideInLeft"
                data-wow-delay="100ms"
                data-wow-duration="2500ms"
              >
                <Image
                  src={PLACEHOLDER_IMAGE}
                  alt={image?.alt || 'About Synix Solutions'}
                  width={500}
                  height={600}
                  priority
                />
              </div>
            </div>
          </div>

          {/* Text Section */}
          <div className="col-xl-6">
            <div className="about-one__right">
              <div className="section-title text-left">
                <div className="section-title__tagline-box">
                  <span className="section-title__tagline">{tagline}</span>
                </div>
                <h2 className="section-title__title" id="about-banner-title">
                  {title}
                </h2>
              </div>

              <p className="about-one__text">{description}</p>

              {/* Feature List */}
              <ul className="about-one__points-list list-unstyled">
                {Array.isArray(features) &&
                  features.map((feature, index) => {
                    return (
                      <li key={feature.title + index}>
                        <div className="icon">
                          <Image
                            src={feature.icon}
                            alt={image?.alt || 'About Synix Solutions'}
                            width={500}
                            height={600}
                            priority
                          />
                        </div>
                        <div className="content">
                          <h3>
                            <Link href={feature.link}>{feature.title}</Link>
                          </h3>
                          <p>{feature.description}</p>
                        </div>
                      </li>
                    );
                  })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutBanner;
