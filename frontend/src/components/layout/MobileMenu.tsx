'use client';

import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import navItems from '@/data/layout/navItem.json';
import socials from '@/data/common/socials.json'; // ✅ Import shared socials

interface MobileMenuProps {
  handleMobileMenu: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ handleMobileMenu }) => {
  return (
    <div className="mobile-nav__wrapper">
      <div
        className="mobile-nav__overlay mobile-nav__toggler"
        onClick={handleMobileMenu}
        role="button"
        aria-label="Close Mobile Menu"
        tabIndex={0}
      />
      <div className="mobile-nav__content">
        <span
          className="mobile-nav__close mobile-nav__toggler"
          onClick={handleMobileMenu}
          role="button"
          aria-label="Close Menu"
          tabIndex={0}
        >
          <i className="fa fa-times" />
        </span>

        {/* Logo */}
        <div className="logo-box">
          <Link href="/" aria-label="Go to homepage">
            <Image
              src="/assets/images/resources/synixLogoWhite.png"
              alt="Synix Solutions"
              width={150}
              height={50}
              className="h-auto"
              priority
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="mobile-nav__container">
          <ul className="main-menu__list">
            {navItems.map((item, idx) => (
              <li key={`menu-${idx}`} className="dropdown">
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact Info */}
        <ul className="mobile-nav__contact list-unstyled">
          <li>
            <i className="fa fa-envelope"></i>
            <Link href="mailto:info@synix.ca">info@synix.ca</Link>
          </li>
          <li>
            <i className="fa fa-phone-alt"></i>
            <Link href="tel:+16479879696">+1 (647) 987 - 9696</Link>
          </li>
        </ul>

        {/* Social Media */}
        <div className="mobile-nav__top">
          <div className="mobile-nav__social flex gap-4">
            {socials.map((social, index) => (
              <Link
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.platform}
              >
                <i className={`${social.icon}`} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
