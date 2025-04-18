'use client';
import React from 'react';
import Image from 'next/image';
import aboutData from '@/data/home/about.json'; // Adjust path as needed

const About: React.FC = () => {
  return (
    <section className="about-three">
      <div className="container">
        <div className="row">
          <div className="col-xl-6">
            <div className="about-three__left">
              <div
                className="about-three__img wow slideInLeft"
                data-wow-delay="100ms"
                data-wow-duration="2500ms"
              >
                <Image
                  src={aboutData.image.src}
                  alt={aboutData.image.alt}
                  width={aboutData.image.width}
                  height={aboutData.image.height}
                />
              </div>
            </div>
          </div>
          <div className="col-xl-6">
            <div className="about-three__right">
              <div className="section-title text-left">
                <div className="section-title__tagline-box">
                  <span className="section-title__tagline">
                    {aboutData.tagline}
                  </span>
                </div>
                <h2 className="section-title__title">{aboutData.title}</h2>
              </div>
              <p className="about-three__text">{aboutData.description}</p>
              <ul className="about-three__points list-unstyled">
                {aboutData.points.map((point) => (
                  <li key={point.id}>
                    <div className="icon">
                      <span className="icon-check-3" aria-hidden="true"></span>
                    </div>
                    <div className="content">
                      <h3>{point.title}</h3>
                      <p>{point.description}</p>
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

export default About;
