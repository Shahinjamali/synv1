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
    <section className="faq-four pt-5 mt-5" aria-labelledby="why-us-heading">
      <div className="container">
        <div className="row">
          {/* Left: Accordion */}
          <div className="col-xl-6">
            <div className="faq-four__left">
              <div className="section-title text-left">
                <div className="section-title__tagline-box">
                  <span className="section-title__tagline">{tagline}</span>
                </div>
                <h2 className="section-title__title" id="why-us-heading">
                  {title}
                </h2>
              </div>

              <div
                className="accrodion-grp faq-one-accrodion"
                data-grp-name="faq-one-accrodion-1"
              >
                {Array.isArray(qs) && qs.length > 0 ? (
                  qs.map((item) => (
                    <div
                      key={item.id}
                      className={
                        activeAccordion === item.id
                          ? 'accrodion active'
                          : 'accrodion'
                      }
                      role="button"
                      tabIndex={0}
                      aria-expanded={activeAccordion === item.id}
                      aria-controls={`accordion-panel-${item.id}`}
                      onClick={() => handleToggle(item.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          handleToggle(item.id);
                        }
                      }}
                    >
                      <div
                        className="accrodion-title"
                        id={`accordion-title-${item.id}`}
                      >
                        <h4>{item.question}</h4>
                      </div>
                      <div
                        className="accrodion-content"
                        id={`accordion-panel-${item.id}`}
                        role="region"
                        aria-labelledby={`accordion-title-${item.id}`}
                      >
                        <div className="inner">
                          <p>{item.answer}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted">No FAQs available at this time.</p>
                )}
              </div>
            </div>
          </div>

          {/* Right: Images */}
          <div className="col-xl-6">
            <div className="faq-four__right">
              <div className="faq-four__img-box">
                <div className="faq-four__img">
                  <Image
                    src={
                      images?.primary || '/assets/images/resources/whyus-1.webp'
                    }
                    alt="Customer-focused lubrication service"
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
  );
};

export default WhyUs;
