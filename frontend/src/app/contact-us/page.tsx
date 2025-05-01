'use client';
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import Image from 'next/image';
import contactData from '@/data/contact/contact.json';
import { sendContactMessage } from '@/utils/api';
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
      console.error('Contact form submission error:', err);
      toast.error('Something went wrong. Please try again.');
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
                      src="/assets/images/resources/cta-1.webp"
                      alt="Contact Synix"
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
                    {/* TODO: Replace with real social links */}
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
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
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
                  {[
                    { name: 'name', placeholder: 'Your Name', required: true },
                    {
                      name: 'email',
                      placeholder: 'Your Email',
                      required: true,
                      type: 'email',
                    },
                    {
                      name: 'phone',
                      placeholder: 'Phone Number',
                      required: false,
                    },
                    {
                      name: 'subject',
                      placeholder: 'Your Subject',
                      required: false,
                    },
                  ].map((field, idx) => (
                    <div className="col-xl-3 col-lg-6" key={idx}>
                      <div className="contact-three__input-box">
                        <input
                          type={field.type || 'text'}
                          placeholder={field.placeholder}
                          name={field.name}
                          value={form[field.name as keyof ContactFormData]}
                          onChange={handleContactChange}
                          required={field.required}
                          autoComplete={field.name}
                        />
                      </div>
                    </div>
                  ))}
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
      </Layout>
    </>
  );
};

export default ContactUs;
