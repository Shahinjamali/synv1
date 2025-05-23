'use client';

import React from 'react';
import featureData from '@/data/about/features.json';
import Image from 'next/image';

const AboutFeature: React.FC = () => {
  return (
    <section className="work-process" aria-label="Key Features of Synix">
      <div
        className="work-process__bg-shape"
        style={{
          backgroundImage: 'url(/assets/images/backgrounds/about-feature.png)',
        }}
        role="presentation"
      />
      <div className="container">
        <div className="work-process__inner">
          <div className="work-process__shape-1" />
          <div className="row">
            {featureData.map((item) => {
              return (
                <div key={item.title} className="col-xl-3 col-lg-6 col-md-6">
                  <div
                    className="work-process__single wow fadeInUp"
                    data-wow-delay="100ms"
                  >
                    <div className="work-process__icon" aria-label={item.title}>
                      <Image
                        src={item.icon}
                        alt={item?.title || 'About Synix Solutions'}
                        width={500}
                        height={600}
                        priority
                      />
                    </div>
                    <h3 className="work-process__title">{item.title}</h3>
                    <p className="work-process__text">{item.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutFeature;
