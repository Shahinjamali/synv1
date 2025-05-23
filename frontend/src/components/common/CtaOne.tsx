'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { subscribeToNewsletter } from '@/utils/api';

const CtaOne: React.FC = () => {
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
    <section className="cta-one mt-5">
      <div className="container">
        <div className="cta-one__inner">
          <div className="cta-one__img">
            <Image
              src="/assets/images/placeholders/cta-p.webp"
              alt="Newsletter Illustration"
              width={500}
              height={400}
            />
          </div>

          <h3 className="cta-one__title">
            Craftin digital experiences
            <br /> With that inspire
          </h3>

          <div className="cta-one__from-box">
            <form className="cta-one__form" onSubmit={handleSubmit}>
              <div className="cta-one__input-box">
                <input
                  type="email"
                  placeholder="Your E-mail"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
              <button
                type="submit"
                className="cta-one__btn thm-btn"
                disabled={loading}
              >
                {loading ? 'Subscribing...' : 'Subscribe Us'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaOne;
