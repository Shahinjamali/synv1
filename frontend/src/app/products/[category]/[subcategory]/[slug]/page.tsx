// src/app/products/[category]/[subcategory]/[slug]/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { throttle } from 'lodash';
import ProductContent from './productContent';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function ProductPage({
  params: paramsPromise,
}: {
  params: Promise<{ category: string; subcategory: string; slug: string }>;
}) {
  const params = React.use(paramsPromise); // Unwrap the params Promise
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
    const handleScroll = throttle(() => {
      setScroll(window.scrollY > 100);
    }, 100);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div className="page-wrapper" id="#top">
        <Header
          scroll={scroll}
          handleMobileMenu={handleMobileMenu}
          isSidebar={isSidebar}
        />
        <div className="container mt-5 overflow-hidden">
          <ProductContent slug={params.slug} />
        </div>
        <Footer />
      </div>
    </>
  );
}
