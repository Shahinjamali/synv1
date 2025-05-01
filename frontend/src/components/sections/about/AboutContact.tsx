'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import contactData from '@/data/about/contact.json';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { sendContactMessage } from '@/utils/api';

const isErrorWithMessage = (err: unknown): err is { message: string } =>
  typeof err === 'object' && err !== null && 'message' in err;

const AboutContact: React.FC = () => {
  const { title, tagline, description, phone } = contactData;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await sendContactMessage(formData);
      toast.success('Message sent successfully!');
      setFormData({
        name: '',
        email: '',
        phone: '',
        location: '',
        message: '',
      });
    } catch (error: unknown) {
      const message = isErrorWithMessage(error)
        ? error.message
        : 'Something went wrong.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      className="contact-two contact-four"
      aria-labelledby="about-contact-heading"
    >
      <div className="container">
        <div className="row">
          {/* Info Column */}
          <div className="col-xl-6 col-lg-6">
            <div className="contact-two__left">
              <div className="section-title text-left">
                <div className="section-title__tagline-box">
                  <span className="section-title__tagline">{tagline}</span>
                </div>
                <h2 className="section-title__title" id="about-contact-heading">
                  {title}
                </h2>
              </div>
              <p className="contact-two__text">{description}</p>
              <div className="contact-two__call-box">
                <div className="icon">
                  <span className="icon-call" />
                </div>
                <div className="content">
                  <span>Need help?</span>
                  <p>
                    <Link href={`tel:${phone}`}>{phone}</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="col-xl-6 col-lg-6">
            <div className="contact-two__right">
              <form
                onSubmit={handleSubmit}
                className="contact-two__form contact-form-validated"
              >
                <div className="row">
                  {[
                    {
                      name: 'name',
                      placeholder: 'Your Name',
                      autoComplete: 'name',
                    },
                    {
                      name: 'email',
                      placeholder: 'Your E-mail',
                      autoComplete: 'email',
                      type: 'email',
                      pattern: '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$',
                    },
                    {
                      name: 'phone',
                      placeholder: 'Your Phone',
                      autoComplete: 'tel',
                    },
                    {
                      name: 'location',
                      placeholder: 'Your Location',
                      autoComplete: 'address-level1',
                    },
                  ].map(
                    ({
                      name,
                      placeholder,
                      type = 'text',
                      autoComplete,
                      pattern,
                    }) => (
                      <div className="col-xl-6 col-lg-6 col-md-6" key={name}>
                        <div className="contact-two__input-box">
                          <input
                            type={type}
                            name={name}
                            placeholder={placeholder}
                            value={formData[name as keyof typeof formData]}
                            onChange={handleChange}
                            required={name === 'name' || name === 'email'}
                            autoComplete={autoComplete}
                            aria-label={placeholder}
                            pattern={pattern}
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>
                <div className="row">
                  <div className="col-xl-12 col-lg-12">
                    <div className="contact-two__input-box text-message-box">
                      <textarea
                        name="message"
                        placeholder="Your Message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        autoComplete="off"
                        aria-label="Your message"
                      />
                    </div>
                    <div className="contact-two__btn-box">
                      <button
                        type="submit"
                        className="thm-btn contact-two__btn"
                        disabled={isSubmitting}
                        aria-busy={isSubmitting}
                      >
                        {isSubmitting ? 'Sending...' : 'Send us'}
                        <span className="icon-dabble-arrow-right" />
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutContact;
