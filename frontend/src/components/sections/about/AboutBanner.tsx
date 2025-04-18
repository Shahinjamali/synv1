'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import heroData from '@/data/about/hero.json';
import { Drops, DashboardGauge } from '@/components/common/Icons';

const AboutBanner: React.FC = () => {
  const feature1 = heroData.features?.[0];
  const feature2 = heroData.features?.[1];

  return (
    <section className="about-one about-seven" aria-label="About Synix Banner">
      <div className="container">
        <div className="row">
          {/* Left Image Section */}
          <div className="col-xl-6">
            <div className="about-one__left">
              <div
                className="about-one__img wow slideInLeft"
                data-wow-delay="100ms"
                data-wow-duration="2500ms"
              >
                <Image
                  src={heroData.image.src}
                  alt={heroData.image.alt || 'About Synix'}
                  width={500}
                  height={400}
                  priority
                />
              </div>
            </div>
          </div>

          {/* Right Text Section */}
          <div className="col-xl-6">
            <div className="about-one__right">
              <div className="section-title text-left">
                <div className="section-title__tagline-box">
                  <span className="section-title__tagline">
                    {heroData.tagline}
                  </span>
                </div>
                <h2 className="section-title__title">{heroData.title}</h2>
              </div>
              <p className="about-one__text">{heroData.description}</p>

              <ul className="about-one__points-list list-unstyled">
                {feature1 && (
                  <li>
                    <div className="icon">
                      <DashboardGauge
                        size={40}
                        defaultColor="#faa319"
                        hoverColor="#FAFAFA"
                      />
                    </div>
                    <div className="content">
                      <h3>
                        <Link href={feature1.link}>{feature1.title}</Link>
                      </h3>
                      <p>{feature1.description}</p>
                    </div>
                  </li>
                )}
                {feature2 && (
                  <li>
                    <div className="icon">
                      <Drops
                        size={40}
                        defaultColor="#faa319"
                        hoverColor="#FAFAFA"
                      />
                    </div>
                    <div className="content">
                      <h3>
                        <Link href={feature2.link}>{feature2.title}</Link>
                      </h3>
                      <p>{feature2.description}</p>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutBanner;
