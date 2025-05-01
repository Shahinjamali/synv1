'use client';
import React, { useState, useEffect } from 'react';
import { throttle } from 'lodash';
import DataBg from '@/components/elements/DataBg';
import Header from './Header';
import Breadcrumb from './Breadcrumb';
import Footer from './Footer';
import BackToTop from '@/components/elements/BackToTop';

interface LayoutProps {
  breadcrumbTitle?: string;
  children: React.ReactNode;
  wrapperCls?: string;
}

const Layout: React.FC<LayoutProps> = ({
  breadcrumbTitle,
  children,
  wrapperCls,
}) => {
  const [scroll, setScroll] = useState<boolean>(false);
  const [isMobileMenu, setMobileMenu] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isSidebar, setSidebar] = useState<boolean>(false);

  const handleMobileMenu = () => {
    const newMobileMenuState = !isMobileMenu;
    setMobileMenu(newMobileMenuState);
    if (newMobileMenuState) {
      document.body.classList.add('mobile-menu-visible');
    } else {
      document.body.classList.remove('mobile-menu-visible');
    }
  };

  useEffect(() => {
    import('wowjs')
      .then((module) => {
        if (typeof window !== 'undefined') {
          const WOW = module.WOW || module.default;
          if (WOW && typeof WOW === 'function') {
            const wow = new WOW({
              live: false,
              boxClass: 'wow',
              animateClass: 'animated',
              offset: 0,
              mobile: true,
            });
            wow.init();
          } else {
            console.error('WOW.js is not a constructor:', WOW);
          }
        }
      })
      .catch((error) => {
        console.error('Error loading WOW.js:', error);
      });

    const handleScroll = throttle(() => {
      setScroll(window.scrollY > 100);
    }, 100); // runs once every 100ms

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div suppressHydrationWarning>
        <DataBg />
      </div>
      <div className={`page-wrapper ${wrapperCls ? wrapperCls : ''}`} id="#top">
        <Header
          scroll={scroll}
          handleMobileMenu={handleMobileMenu}
          isSidebar={isSidebar}
        />

        {breadcrumbTitle && <Breadcrumb breadcrumbTitle={breadcrumbTitle} />}
        {children}
        <Footer />
      </div>
      <BackToTop scroll={scroll} />
    </>
  );
};

export default Layout;
