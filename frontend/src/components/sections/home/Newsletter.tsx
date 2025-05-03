'use client';

import React, { useState } from 'react';

import Image from 'next/image';
import { subscribeToNewsletter } from '@/utils/api';
import { toast } from 'react-toastify';

const PLACEHOLDER_IMG1 = '/assets/images/resources/cta-1.webp';

const NewsLetter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address.');
      return;
    }

    try {
      setLoading(true);
      await subscribeToNewsletter(email);
      toast.success('Subscribed successfully!');
      setEmail('');
    } catch (err: unknown) {
      console.error('Subscription failed:', err);
      toast.error('Failed to subscribe. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="cta-three" aria-labelledby="newsletter-title">
      <div className="container">
        <div className="row">
          {/* Image Column */}
          <div className="col-xl-6">
            <div className="cta-three__left">
              <div className="cta-three__img-box">
                <div className="cta-three__img">
                  <Image
                    src={PLACEHOLDER_IMG1}
                    alt="Reading a newsletter"
                    width={800}
                    height={400}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="col-xl-6">
            <div className="cta-three__right">
              <h3 className="cta-three__title" id="newsletter-title">
                Subscribe to Our <br /> Newsletter
              </h3>
              <p className="cta-three__text">
                Stay updated with our latest news, product launches, and
                industrial tips.
              </p>
              <form className="cta-three__form" onSubmit={handleSubmit}>
                <div className="cta-three__input-box">
                  <input
                    type="email"
                    placeholder="Enter Your Email"
                    name="EMAIL"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                    aria-label="Your email address"
                  />
                  <button
                    type="submit"
                    className="cta-three__btn thm-btn"
                    disabled={loading}
                  >
                    {loading ? 'Subscribing...' : 'Subscribe Us'}
                  </button>
                </div>
              </form>

              {/* Screen reader-friendly feedback */}
              {/* <div role="status" aria-live="polite" className="sr-only">
                {status === 'success' && 'Successfully subscribed!'}
                {status === 'error' && 'Subscription failed. Try again.'}
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsLetter;
