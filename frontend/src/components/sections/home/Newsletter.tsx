import React, { useState } from 'react';
import Image from 'next/image';
import { subscribeToNewsletter } from '@/utils/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NewsLetter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<
    'idle' | 'submitting' | 'success' | 'error'
  >('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      const res = await subscribeToNewsletter(email);
      if (res.data.subscribed) {
        setStatus('success');
        toast.success('Thank you for subscribing!');
        setEmail('');
      } else {
        throw new Error('Subscription failed.');
      }
    } catch (err) {
      const error = err as { message?: string };
      setStatus('error');
      toast.error(error.message || 'Something went wrong.');
    }
  };

  return (
    <section className="cta-three">
      <div className="container">
        <div className="row">
          <div className="col-xl-6">
            <div className="cta-three__left">
              <div className="cta-three__img-box">
                <div className="cta-three__img">
                  <Image
                    src="/assets/images/resources/cta-three-img-1.png"
                    alt=""
                    width={500}
                    height={400}
                  />
                </div>
                <div className="cta-three__img-2">
                  <Image
                    src="/assets/images/resources/cta-three-img-2.png"
                    alt=""
                    width={300}
                    height={200}
                  />
                </div>
                <div className="cta-three__shape-2"></div>
              </div>
            </div>
          </div>
          <div className="col-xl-6">
            <div className="cta-three__right">
              <h3 className="cta-three__title">
                Subscribe to Our
                <br /> Newsletter
              </h3>
              <p className="cta-three__text">
                It is a long established fact that a reader will be distracted
                <br />
                by the readable content of a page when looking at its layout
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
                  />
                  <button
                    type="submit"
                    className="cta-three__btn thm-btn"
                    disabled={status === 'submitting'}
                  >
                    Subscribe Now
                    <span className="icon-dabble-arrow-right"></span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsLetter;
