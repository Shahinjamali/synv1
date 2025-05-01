'use client';

import Link from 'next/link';
import React from 'react';
import backgroundMap from '@/data/images/backgrounds.json';

interface BreadcrumbProps {
  breadcrumbTitle?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ breadcrumbTitle }) => {
  const bgUrl =
    backgroundMap[breadcrumbTitle as keyof typeof backgroundMap] ??
    '/assets/images/backgrounds/default.webp';

  return (
    <section className="page-header">
      <div
        className="page-header__bg"
        style={{ backgroundImage: `url(${bgUrl})` }}
      />
      <div className="container">
        <div className="page-header__inner">
          <h2>{breadcrumbTitle}</h2>
          <nav aria-label="breadcrumb">
            <ul className="thm-breadcrumb list-unstyled">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <span className="icon-angle-left" aria-hidden="true" />
              </li>
              <li aria-current="page">{breadcrumbTitle}</li>
            </ul>
          </nav>
        </div>
      </div>
    </section>
  );
};

export default Breadcrumb;
