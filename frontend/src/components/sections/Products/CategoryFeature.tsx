'use client';
import React from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import CounterUp from '@/components/elements/CounterUp';
import Image from 'next/image'; // Import the Next.js Image component

interface CategoryFeatureProps {
  // Add any props your component expects here, if any.
}

const CategoryFeature: React.FC<CategoryFeatureProps> = () => {
  return (
    <>
      {/*CategoryFeature One Start */}
      <section className="feature-one">
        <div className="container">
          <div className="row">
            <div className="col-xl-6">
              <div className="feature-one__left">
                <div className="section-title text-left">
                  <div className="section-title__tagline-box">
                    <span className="section-title__tagline">Our Features</span>
                  </div>
                  <h2 className="section-title__title">
                    Building the we live{' '}
                  </h2>
                </div>
                <p className="feature-one__text">
                  Construction is the process of creating or ass infrastructure
                  a buildings, or other large structures. It involves plan
                  designing and executing various tasks
                </p>
                <div className="feature-one__count-box">
                  <div className="feature-one__count-icon">
                    <span className="icon-madel-2"></span>
                  </div>
                  <div className="feature-one__count-content">
                    <div className="feature-one__count count-box">
                      <h3>
                        <CounterUp end={20} />
                      </h3>
                      <span>+</span>
                    </div>
                    <p className="feature-one__count-text">Winning award</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-6">
              <div className="feature-one__right">
                <div className="feature-one__img">
                  <Image
                    src="/assets/images/resources/feature-one-img-1.jpg" // Ensure path is correct
                    alt=""
                    width={500} // Adjust width as needed
                    height={400} // Adjust width as needed
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/*CategoryFeature One End */}
    </>
  );
};

export default CategoryFeature;
