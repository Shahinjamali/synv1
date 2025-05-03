'use client';
import React from 'react';
import Image from 'next/image';
import { Category } from '@/types/category';

interface serviceAboutProps {
  details: Category;
}
const PLACEHOLDER_IMAGE = '/assets/images/placeholders/predictive-600x740.webp';

const serviceAbout: React.FC<serviceAboutProps> = ({ details }) => {
  const { title, mediaAssets, overview, keyFeatures } = details;

  const featureImage =
    Array.isArray(mediaAssets) && mediaAssets.length > 0
      ? (mediaAssets.find((asset) => asset.type === 'tallFeature')?.url ??
        PLACEHOLDER_IMAGE)
      : PLACEHOLDER_IMAGE;
  return (
    <section className="about-three" aria-labelledby="about-section-title">
      <div className="container">
        <div className="row">
          {/* Image */}
          <div className="col-xl-6">
            <div className="about-three__left">
              <div
                className="about-three__img"
                data-wow-delay="100ms"
                data-wow-duration="2500ms"
              >
                <Image
                  src={featureImage}
                  alt={title || 'About Synix Solutions'}
                  width={600}
                  height={740}
                  priority
                />
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="col-xl-6">
            <div className="about-three__rightM">
              <div className="section-title text-left">
                <h2 className="section-title__title" id="about-section-title">
                  {title}
                </h2>
              </div>

              <p className="about-three__text">{overview}</p>

              {/* Features / Points */}
              <h3 className="sr-only">Key Features</h3>
              <ul
                className="about-three__points list-unstyled"
                aria-label="Key value points"
              >
                {Array.isArray(keyFeatures) && keyFeatures.length > 0 ? (
                  keyFeatures.map((app, index) => (
                    <li key={index}>
                      <div className="icon">
                        <span className="icon-check-3" aria-hidden="true" />
                      </div>
                      <div className="content">
                        <p>{app}</p>
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

export default serviceAbout;
