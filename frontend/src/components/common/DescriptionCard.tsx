'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Category } from '@/types/category';
import ReactPlayer from 'react-player';
import { resolveMediaUrl } from '@/utils/media';

interface DescriptionCardProps {
  details: Category;
}

const PLACEHOLDER_IMAGE = '/assets/images/placeholders/product.webp';

const DescriptionCard: React.FC<DescriptionCardProps> = ({ details }) => {
  const [isOpen, setOpen] = useState(false);

  const { tagline, overview, keyFeatures, applications, mediaAssets } = details;

  const featureImage =
    Array.isArray(mediaAssets) && mediaAssets.length > 0
      ? resolveMediaUrl(
          mediaAssets.find((asset) => asset.type === 'cardSquare')?.url ??
            PLACEHOLDER_IMAGE
        )
      : PLACEHOLDER_IMAGE;

  const iconImage =
    Array.isArray(mediaAssets) && mediaAssets.length > 0
      ? resolveMediaUrl(
          mediaAssets.find((asset) => asset.type === 'icon')?.url ??
            PLACEHOLDER_IMAGE
        )
      : PLACEHOLDER_IMAGE;

  return (
    <>
      <div className="container">
        <div className="project-details__content">
          <h3 className="project-details__title-2">{tagline}</h3>
          <p className="project-details__text-2">{overview}</p>
          <div className="project-details__bottom mt-5">
            <div className="row">
              <div className="col-xl-8 col-lg-7">
                <div className="project-details__bottom-left">
                  <ul className="project-details__bottom-points list-unstyled">
                    {keyFeatures?.map((feature, index) => (
                      <li key={index}>
                        <div className="services-details__points-bullet"></div>
                        <p>{feature}</p>
                      </li>
                    ))}
                  </ul>
                  <div className="project-details__client-box">
                    <div className="project-details__client-img">
                      <Image
                        src={iconImage}
                        alt="icon"
                        width={100}
                        height={100}
                      />
                    </div>
                    <div className="project-details__client-content">
                      <h3>Applications:</h3>
                      <ul className="services-details__points list-unstyled">
                        {applications?.map((app, index) => (
                          <li key={index}>
                            <div className="services-details__points-bullet"></div>
                            <p>{app}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-lg-5">
                <div className="project-details__bottom-right">
                  <div className="project-details__bottom-img">
                    <Image
                      src={featureImage}
                      alt="features"
                      width={400}
                      height={300}
                    />
                    <div className="project-details__video-link">
                      <a onClick={() => setOpen(true)} className="video-popup">
                        <div className="project-details__video-icon">
                          <span className="icon-play"></span>
                          <i className="ripple"></i>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setOpen(false)}>
              ✕
            </button>
            <ReactPlayer
              url="https://www.youtube.com/watch?v=LXb3EKWsInQ"
              playing
              controls
              width="100%"
              height="100%"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default DescriptionCard;
