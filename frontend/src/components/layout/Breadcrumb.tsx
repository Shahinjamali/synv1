import Link from 'next/link';
import React from 'react';

interface BreadcrumbProps {
  breadcrumbTitle?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ breadcrumbTitle }) => {
  return (
    <>
      {/*Page Header Start*/}
      <section className="page-header">
        {breadcrumbTitle === 'About Us' && (
          <div
            className="page-header__bg"
            style={{
              backgroundImage: 'url(assets/images/backgrounds/About-us.webp)',
            }}
          ></div>
        )}
        {breadcrumbTitle === 'Services' && (
          <div
            className="page-header__bg"
            style={{
              backgroundImage:
                'url(assets/images/backgrounds/services-banner.webp)',
            }}
          ></div>
        )}
        {breadcrumbTitle === 'Products' && (
          <div
            className="page-header__bg"
            style={{
              backgroundImage:
                'url(assets/images/backgrounds/products-banner.webp)',
            }}
          ></div>
        )}
        <div className="container">
          <div className="page-header__inner">
            <h2>{breadcrumbTitle}</h2>
            <div className="thm-breadcrumb__box">
              <ul className="thm-breadcrumb list-unstyled">
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li>
                  <span className="icon-angle-left"></span>
                </li>
                <li>{breadcrumbTitle}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      {/*Page Header End*/}
    </>
  );
};

export default Breadcrumb;
