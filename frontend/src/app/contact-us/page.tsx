'use client';
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import Image from 'next/image';
import contactData from '@/data/contact/contact.json';
import { sendContactMessage, subscribeToNewsletter } from '@/utils/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const ContactUs: React.FC = () => {
  const [form, setForm] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleContactChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await sendContactMessage(form);
      if (res.success === true) {
        toast.success('Message sent successfully!');
        setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        toast.error('Failed to send message.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong. Please try again.');
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) {
      toast.warn('Please enter your email');
      return;
    }
    try {
      const res = await subscribeToNewsletter(newsletterEmail);
      if (res.success === true) {
        toast.success('Subscribed successfully!');
        setNewsletterEmail('');
      } else {
        toast.error(res.message || 'Subscription failed.');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <>
      <Layout breadcrumbTitle="Contact">
        <section className="contact-page">
          <div className="container">
            <div className="row">
              <div className="col-xl-6 col-lg-6">
                <div className="contact-page__left">
                  <div className="contact-page__img">
                    <Image
                      src="/assets/images/resources/contact-page-img-1.jpg"
                      alt=""
                      width={500}
                      height={400}
                    />
                  </div>
                </div>
              </div>
              <div className="col-xl-6 col-lg-6">
                <div className="contact-page__right">
                  <h3 className="contact-page__title">{contactData.title}</h3>
                  <ul className="contact-page__contact-list list-unstyled">
                    {contactData.details.map((item, idx) => (
                      <li key={idx}>
                        <div className="icon">
                          <span className={item.icon}></span>
                        </div>
                        <div className="content">
                          <h3>{item.type}</h3>
                          <p>
                            {item.url ? (
                              <a href={item.url}>{item.value}</a>
                            ) : (
                              item.value
                            )}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="contact-page__social">
                    <a href="#">
                      <i className="icon-facebook"></i>
                    </a>
                    <a href="#">
                      <i className="icon-twitter"></i>
                    </a>
                    <a href="#">
                      <i className="icon-instagram"></i>
                    </a>
                    <a href="#">
                      <i className="icon-link-in"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="google-map-one">
          <iframe
            src="https://www.google.com/maps/embed?pb=..."
            className="google-map__one"
          ></iframe>
        </section>

        <section className="contact-three">
          <div className="container">
            <div className="row">
              <div className="section-title text-center">
                <div className="section-title__tagline-box">
                  <span className="section-title__tagline">Get in touch</span>
                </div>
                <h2 className="section-title__title">Send us a message</h2>
              </div>
              <form
                onSubmit={handleContactSubmit}
                className="contact-three__form"
              >
                <div className="row">
                  <div className="col-xl-3 col-lg-6">
                    <div className="contact-three__input-box">
                      <input
                        type="text"
                        placeholder="Your Name"
                        name="name"
                        value={form.name}
                        onChange={handleContactChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-6">
                    <div className="contact-three__input-box">
                      <input
                        type="email"
                        placeholder="Your Email"
                        name="email"
                        value={form.email}
                        onChange={handleContactChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-6">
                    <div className="contact-three__input-box">
                      <input
                        type="text"
                        placeholder="Phone Number"
                        name="phone"
                        value={form.phone}
                        onChange={handleContactChange}
                      />
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-6">
                    <div className="contact-three__input-box">
                      <input
                        type="text"
                        placeholder="Your Subject"
                        name="subject"
                        value={form.subject}
                        onChange={handleContactChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-xl-12 col-lg-12">
                    <div className="contact-three__input-box text-message-box">
                      <textarea
                        name="message"
                        placeholder="Write your Message"
                        value={form.message}
                        onChange={handleContactChange}
                        required
                      ></textarea>
                    </div>
                  </div>
                  <div className="col-xl-12">
                    <div className="contact-three__btn-box">
                      <button
                        type="submit"
                        className="thm-btn contact-three__btn"
                      >
                        Send message
                        <span className="icon-dabble-arrow-right"></span>
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>

        <section className="cta-one">
          <div className="container">
            <div className="cta-one__inner">
              <div className="cta-one__shape-1">
                <Image
                  src="/assets/images/shapes/cta-one-shape-1.png"
                  alt=""
                  width={100}
                  height={100}
                />
              </div>
              <div className="cta-one__img">
                <Image
                  src="/assets/images/resources/cta-one-img.png"
                  alt=""
                  width={500}
                  height={400}
                />
              </div>
              <h3 className="cta-one__title">
                Crafting digital experiences
                <br /> that inspire
              </h3>
              <div className="cta-one__from-box">
                <form
                  onSubmit={handleNewsletterSubmit}
                  className="cta-one__form"
                >
                  <div className="cta-one__input-box">
                    <input
                      type="email"
                      placeholder="Your E-mail"
                      name="newsletter"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="cta-one__btn thm-btn">
                    Subscribe Us
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default ContactUs;
