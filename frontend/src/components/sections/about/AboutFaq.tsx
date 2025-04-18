'use client';

import React, { useState } from 'react';
import faqData from '@/data/about/faq.json';

const AboutFaq: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { title, tagline, description, questions } = faqData;

  const handleToggle = (index: number) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="faq-one faq-five" aria-labelledby="faq-title">
      <div className="container">
        <div className="row">
          {/* Left Column */}
          <div className="col-xl-6 col-lg-6">
            <div className="faq-one__left">
              <div className="section-title text-left">
                <div className="section-title__tagline-box">
                  <span className="section-title__tagline">{tagline}</span>
                </div>
                <h2 className="section-title__title" id="faq-title">
                  {title}
                </h2>
              </div>
              <p className="faq-one__text">{description}</p>
            </div>
          </div>

          {/* Right Column - Accordion */}
          <div className="col-xl-6 col-lg-6">
            <div className="faq-one__right">
              <div
                className="accrodion-grp faq-one-accrodion"
                role="tablist"
                aria-multiselectable="true"
              >
                {questions.map((item, index) => {
                  const isActive = activeIndex === index;
                  return (
                    <div
                      key={item.question}
                      className={`accrodion${isActive ? ' active' : ''}`}
                    >
                      <div
                        className="accrodion-title"
                        role="button"
                        tabIndex={0}
                        onClick={() => handleToggle(index)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            handleToggle(index);
                          }
                        }}
                        aria-expanded={isActive}
                        aria-controls={`faq-panel-${index}`}
                        id={`faq-header-${index}`}
                      >
                        <h4>{item.question}</h4>
                      </div>
                      <div
                        className="accrodion-content"
                        id={`faq-panel-${index}`}
                        role="region"
                        aria-labelledby={`faq-header-${index}`}
                        hidden={!isActive}
                      >
                        <div className="inner">
                          <p>{item.answer}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutFaq;
