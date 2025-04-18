'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import contactData from '@/data/about/contact.json';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { sendContactMessage } from '@/utils/api';

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
    try {
      setIsSubmitting(true);
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
      const err = error as { message: string };
      toast.error(err.message || 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="contact-two contact-four">
      <div className="container">
        <div className="row">
          <div className="col-xl-6 col-lg-6">
            <div className="contact-two__left">
              <div className="section-title text-left">
                <div className="section-title__tagline-box">
                  <span className="section-title__tagline">{tagline}</span>
                </div>
                <h2 className="section-title__title">{title}</h2>
              </div>
              <p className="contact-two__text">{description}</p>
              <div className="contact-two__call-box">
                <div className="icon">
                  <span className="icon-call"></span>
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
          <div className="col-xl-6 col-lg-6">
            <div className="contact-two__right">
              <form
                onSubmit={handleSubmit}
                className="contact-two__form contact-form-validated"
              >
                <div className="row">
                  <div className="col-xl-6 col-lg-6 col-md-6">
                    <div className="contact-two__input-box">
                      <input
                        type="text"
                        placeholder="Your Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-xl-6 col-lg-6 col-md-6">
                    <div className="contact-two__input-box">
                      <input
                        type="email"
                        placeholder="Your E-mail"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-xl-6 col-lg-6 col-md-6">
                    <div className="contact-two__input-box">
                      <input
                        type="text"
                        placeholder="Your Phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-xl-6 col-lg-6 col-md-6">
                    <div className="contact-two__input-box">
                      <input
                        type="text"
                        placeholder="Your Location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
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
                      ></textarea>
                    </div>
                    <div className="contact-two__btn-box">
                      <button
                        type="submit"
                        className="thm-btn contact-two__btn"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Sending...' : 'Send us'}
                        <span className="icon-dabble-arrow-right"></span>
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
