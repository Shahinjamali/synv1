'use client';
import React from 'react';
import Image from 'next/image';
import aboutData from '@/data/home/about.json';

const About: React.FC = () => {
  const { image, tagline, title, description, points } = aboutData;

  return (
    <section className="about-three" aria-labelledby="about-section-title">
      <div className="container">
        <div className="row">
          {/* Image */}
          <div className="col-xl-6">
            <div className="about-three__left">
              <div
                className="about-three__img wow slideInLeft"
                data-wow-delay="100ms"
                data-wow-duration="2500ms"
              >
                {image?.src && (
                  <Image
                    src={image.src}
                    alt={image.alt || 'About Synix Solutions'}
                    width={image.width}
                    height={image.height}
                    priority
                  />
                )}
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="col-xl-6">
            <div className="about-three__right">
              <div className="section-title text-left">
                <div className="section-title__tagline-box">
                  <span className="section-title__tagline">{tagline}</span>
                </div>
                <h2 className="section-title__title" id="about-section-title">
                  {title}
                </h2>
              </div>

              <p className="about-three__text">{description}</p>

              {/* Features / Points */}
              <h3 className="sr-only">Key Features</h3>
              <ul
                className="about-three__points list-unstyled"
                aria-label="Key value points"
              >
                {Array.isArray(points) && points.length > 0 ? (
                  points.map((point) => (
                    <li key={point.id}>
                      <div className="icon">
                        <span className="icon-check-3" aria-hidden="true" />
                      </div>
                      <div className="content">
                        <h3>{point.title}</h3>
                        <p>{point.description}</p>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="text-muted">No key points available.</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
