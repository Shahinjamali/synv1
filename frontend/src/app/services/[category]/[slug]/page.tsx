'use client';

import React, { useEffect, useState } from 'react';
import { throttle } from 'lodash';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ServiceContent from './serviceContent';

export default function ServicePage({
  params: paramsPromise,
}: {
  params: Promise<{ slug: string }>;
}) {
  const params = React.use(paramsPromise); // ✅ your working solution
  const [scroll, setScroll] = useState(false);
  const [isMobileMenu, setMobileMenu] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isSidebar, setSidebar] = useState(false);

  const handleMobileMenu = () => {
    const open = !isMobileMenu;
    setMobileMenu(open);
    document.body.classList.toggle('mobile-menu-visible', open);
  };

  useEffect(() => {
    const handleScroll = throttle(() => {
      setScroll(window.scrollY > 100);
    }, 100);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!params?.slug) {
    return (
      <div className="text-center text-danger py-10">
        Invalid service route.
      </div>
    );
  }

  return (
    <>
      <div className="page-wrapper" id="top">
        <Header
          scroll={scroll}
          handleMobileMenu={handleMobileMenu}
          isSidebar={isSidebar}
        />
        <main className="container mt-5 overflow-hidden" role="main">
          <ServiceContent slug={params.slug} />
        </main>
        <Footer />
      </div>
    </>
  );
}
