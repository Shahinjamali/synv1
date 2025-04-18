'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import footerData from '@/data/layout/footer.json';

// Type definitions
interface FooterLink {
  name: string;
  url: string;
}

interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

interface ContactDetail {
  type: string;
  value: string;
  url?: string;
  icon: string;
}

interface Article {
  title: string;
  url: string;
  date: string;
}

interface FooterData {
  about: {
    logo: string;
    description: string;
    socialTitle: string;
    socialLinks: SocialLink[];
  };
  services: {
    title: string;
    links: FooterLink[];
  };
  news: {
    title: string;
    articles: Article[];
  };
  contact: {
    title: string;
    details: ContactDetail[];
  };
  bottom: {
    copyright: string;
    nav: FooterLink[];
  };
}

const Footer: React.FC = () => {
  const { about, services, news, contact, bottom } = footerData as FooterData;

  return (
    <footer className="site-footer">
      {/* Background Shape */}
      <div className="site-footer__shape-1">
        <Image
          src="/assets/images/shapes/contact-and-team-bg-shape.png"
          alt="Decorative Shape"
          width={1000}
          height={100}
          className="object-cover"
        />
      </div>

      {/* Top Section */}
      <div className="site-footer__top">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* About Column */}
            <div
              className="footer-widget__column footer-widget__about animate-fadeIn"
              data-wow-delay="100ms"
            >
              <div className="footer-widget__logo mb-6">
                <Link href="/">
                  <Image
                    src={about.logo}
                    alt="Synix Solutions Logo"
                    width={200}
                    height={50}
                    className="object-contain"
                    style={{ height: 'auto' }}
                    priority
                  />
                </Link>
              </div>
              <p className="footer-widget__about-text text-gray-400 mb-6">
                {about.description}
              </p>
              <div className="site-footer__social-box">
                <h3 className="site-footer__social-title text-lg font-semibold mb-4">
                  {about.socialTitle}
                </h3>
                <div className="site-footer__social flex gap-4">
                  {about.socialLinks.map((link, index) => (
                    <Link
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.platform}
                    >
                      <i
                        className={`${link.icon} text-xl hover:text-blue-500 transition-colors`}
                      ></i>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Services Column */}
            <div
              className="footer-widget__column footer-widget__services animate-fadeIn"
              data-wow-delay="200ms"
            >
              <h3 className="footer-widget__title text-lg font-semibold mb-4">
                {services.title}
              </h3>
              <ul className="footer-widget__services-list list-unstyled space-y-2">
                {services.links.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.url}
                      className="text-gray-400 hover:text-blue-500 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* News Column */}
            <div
              className="footer-widget__column footer-widget__news animate-fadeIn"
              data-wow-delay="300ms"
            >
              <h3 className="footer-widget__title text-lg font-semibold mb-4">
                {news.title}
              </h3>
              <ul className="footer-widget__news-list list-unstyled space-y-4">
                {news.articles.map((article, index) => (
                  <li key={index} className="flex gap-4">
                    <div className="footer-widget__news-date text-gray-500 text-sm">
                      <p>
                        <span className="icon-calender mr-1"></span>
                        {article.date}
                      </p>
                    </div>
                    <h3 className="footer-widget__news-title text-base">
                      <Link
                        href={article.url}
                        className="text-gray-400 hover:text-blue-500 transition-colors"
                      >
                        {article.title}
                      </Link>
                    </h3>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Column */}
            <div
              className="footer-widget__column footer-widget__contact animate-fadeIn"
              data-wow-delay="400ms"
            >
              <h3 className="footer-widget__title text-lg font-semibold mb-4">
                {contact.title}
              </h3>
              <ul className="footer-widget__contact-list list-unstyled space-y-4">
                {contact.details.map((detail, index) => (
                  <li key={index} className="flex gap-4">
                    <div className="icon text-blue-500">
                      <span className={detail.icon}></span>
                    </div>
                    <div className="content">
                      {detail.url ? (
                        <Link
                          href={detail.url}
                          className="text-gray-400 hover:text-blue-700 transition-colors"
                        >
                          {detail.value}
                        </Link>
                      ) : (
                        <p className="text-gray-400">{detail.value}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="site-footer__bottom py-4 mt-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="site-footer__bottom-text text-gray-400">
              {bottom.copyright}
            </p>
            <ul className="list-unstyled site-footer__bottom-menu flex gap-6">
              {bottom.nav.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.url}
                    className="text-gray-400 hover:text-blue-500 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default memo(Footer);
