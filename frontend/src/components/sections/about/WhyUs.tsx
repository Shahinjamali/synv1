'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import whyUsData from '@/data/about/whyUs.json';

interface QSItem {
  id: number;
  question: string;
  answer: string;
}

interface WhyUsData {
  title: string;
  tagline: string;
  qs: QSItem[];
  images: {
    primary: string;
    secondary: string;
  };
}

const WhyUs: React.FC = () => {
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);

  const handleToggle = (id: number) => {
    setActiveAccordion((prevActive) => (prevActive === id ? null : id));
  };

  const { title, tagline, qs, images } = whyUsData as WhyUsData;

  return (
    <>
      <section className="faq-four pt-5 mt-5" aria-labelledby="why-us-heading">
        <div className="container">
          <div className="row">
            <div className="col-xl-6">
              <div className="faq-four__left">
                <div className="section-title text-left">
                  <div className="section-title__tagline-box">
                    <span className="section-title__tagline">{tagline}</span>
                  </div>
                  <h2 className="section-title__title">{title}</h2>
                </div>
                <div
                  className="accrodion-grp faq-one-accrodion"
                  data-grp-name="faq-one-accrodion-1"
                >
                  {qs.map((item) => (
                    <div
                      className={
                        activeAccordion === item.id
                          ? 'accrodion active'
                          : 'accrodion'
                      }
                      onClick={() => handleToggle(item.id)}
                      key={item.id}
                    >
                      <div className="accrodion-title">
                        <h4>{item.question}</h4>
                      </div>
                      <div className="accrodion-content">
                        <div className="inner">
                          <p>{item.answer}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Images */}
            <div className="col-xl-6">
              <div className="faq-four__right">
                <div className="faq-four__img-box">
                  <div className="faq-four__img">
                    <Image
                      src={images.primary}
                      alt="Customer-focused lubrication service"
                      width={500}
                      height={400}
                    />
                  </div>
                  <div className="faq-four__img-2">
                    <Image
                      src={images.secondary}
                      alt="Smart maintenance systems by Synix"
                      width={500}
                      height={400}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default WhyUs;
