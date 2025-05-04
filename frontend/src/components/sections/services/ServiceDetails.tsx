'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Service } from '@/types/services';
import ReactPlayer from 'react-player';
import { toast } from 'react-toastify';
import WrappedParagraph from '@/components/common/WrappedParagraph';
import { sendContactMessage } from '@/utils/api';
import { resolveMediaUrl } from '@/utils/media';
import './videoModel.css';

interface ServiceDetailsProps {
  service: Service;
}

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const PLACEHOLDER_IMAGE = '/assets/images/placeholders/service-banner.webp';
const PLACEHOLDER_IMAGE_2 = '/assets/images/placeholders/service.webp';

const ServiceDetails: React.FC<ServiceDetailsProps> = ({ service }) => {
  const [isOpen, setOpen] = useState(false);
  const [form, setForm] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const bannerImage =
    resolveMediaUrl(
      service.mediaAssets?.find((asset) => asset.type === 'bannerDefault')?.url
    ) || PLACEHOLDER_IMAGE;

  const featureImage =
    resolveMediaUrl(
      service.mediaAssets?.find((asset) => asset.type === 'cardSquare')?.url
    ) || PLACEHOLDER_IMAGE_2;

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

  const { title, overview, tagline, keyBenefits, applicableIndustries } =
    service;

  return (
    <>
      <section className="project-details">
        <div className="container">
          <div className="project-details__img">
            <Image
              src={bannerImage}
              alt={service.title}
              width={800}
              height={400}
            />
            <div className="project-details__information">
              <div className="project-details__information-minus"></div>
              <h3 className="project-details__information-title">
                Service Information
              </h3>
              <ul className="project-details__information-list list-unstyled mt-5">
                <li>
                  <p>
                    <span>Name:</span>
                    {service.title}
                  </p>
                </li>
                <li>
                  <p>
                    <span>Category:</span>
                    {service.categorySlug}
                  </p>
                </li>
                <li>
                  <p>
                    <span>Type:</span>
                    {service.subtitle}
                  </p>
                </li>
                <li>
                  <p>
                    <span>Application:</span>
                    {service.applicableIndustries?.[0] || 'N/A'}
                  </p>
                </li>
                <li>
                  <p>
                    <span>Rating:</span>
                    <i className="icon-star"></i>
                    <i className="icon-star"></i>
                    <i className="icon-star"></i>
                    <i className="icon-star"></i>
                    <i className="icon-star"></i>
                  </p>
                </li>
                <li>
                  <p>
                    <span>Documents:</span>
                  </p>
                  <a
                    href="mailto:info@synix.com"
                    className="btn btn-outline-primary mt-3"
                  >
                    Please contact us for Documents
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="project-details__content">
          <h3 className="project-details__title">{title}</h3>
          <WrappedParagraph text={overview} wordsPerLine={9} />
          <h3 className="project-details__title-2">{tagline}</h3>
          <p className="project-details__text-2">
            {service.description.detailed}
          </p>

          <div className="project-details__bottom">
            <div className="row">
              <div className="col-xl-8 col-lg-7">
                <div className="project-details__bottom-left">
                  <h3 className="project-details__title-2">Benefits</h3>
                  <ul className="project-details__bottom-points list-unstyled">
                    {keyBenefits?.map((benefit, index) => (
                      <li key={index}>
                        <div className="services-details__points-bullet"></div>
                        <p>{benefit}</p>
                      </li>
                    ))}
                  </ul>

                  <h3 className="project-details__title-2">Application</h3>
                  <ul className="project-details__bottom-points list-unstyled">
                    {applicableIndustries?.map((ind, index) => (
                      <li key={index}>
                        <div className="services-details__points-bullet"></div>
                        <p>{ind}</p>
                      </li>
                    ))}
                  </ul>

                  <h3 className="project-details__title-2">Design For</h3>
                  <ul className="project-details__bottom-points list-unstyled">
                    {service.applicableEquipment?.map((eq, index) => (
                      <li key={index}>
                        <div className="services-details__points-bullet"></div>
                        <p>{eq}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="col-xl-4 col-lg-5">
                <div className="project-details__bottom-right">
                  <div className="project-details__bottom-img">
                    <Image src={featureImage} alt="" width={400} height={300} />
                    <div className="project-details__video-link">
                      <a onClick={() => setOpen(true)} className="video-popup">
                        <div className="project-details__video-icon">
                          <span className="icon-play"></span>
                          <i className="ripple"></i>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-two">
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
                {['name', 'email', 'phone', 'subject'].map((field, idx) => (
                  <div className="col-xl-3 col-lg-6" key={idx}>
                    <div className="contact-three__input-box">
                      <input
                        type="text"
                        placeholder={`Your ${field.charAt(0).toUpperCase() + field.slice(1)}`}
                        name={field}
                        value={form[field as keyof ContactFormData]}
                        onChange={handleContactChange}
                        required={field !== 'phone'}
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

      {isOpen && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setOpen(false)}>
              ✕
            </button>
            <ReactPlayer
              url="https://www.youtube.com/watch?v=LXb3EKWsInQ"
              playing
              controls
              width="100%"
              height="100%"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ServiceDetails;
