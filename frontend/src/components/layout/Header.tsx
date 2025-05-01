'use client';
import Link from 'next/link';
import Image from 'next/image';
import Menu from './Menu';
import MobileMenu from './MobileMenu';
import React from 'react';

interface HeaderProps {
  scroll: boolean;
  handleMobileMenu: () => void;
  isSidebar: boolean;
}

const Header: React.FC<HeaderProps> = ({ scroll, handleMobileMenu }) => {
  return (
    <>
      <header className={`main-header-three ${scroll ? 'fixed-header' : ''}`}>
        <nav className="main-menu main-menu-three">
          <div className="main-menu-three__wrapper">
            <div className="container">
              <div className="main-menu-three__wrapper-inner">
                <div className="main-menu-three__left">
                  <div className="main-menu-three__logo">
                    <Link href="/">
                      <Image
                        src="/assets/images/resources/synixLogo.png"
                        alt="Synix Solutions logo"
                        width={150}
                        height={50}
                        style={{ height: 'auto' }}
                        priority
                      />
                    </Link>
                  </div>
                </div>
                <div className="main-menu-three__main-menu-box">
                  <button
                    type="button"
                    className="mobile-nav__toggler"
                    onClick={handleMobileMenu}
                    aria-label="Toggle mobile navigation"
                  >
                    <i className="fa fa-bars"></i>
                  </button>
                  <Menu />
                </div>
                {/* <div className="main-menu-three__right">
                  <div className="main-menu-three__btn-box">
                    <Link
                      href="/dashboard"
                      className="main-menu-three__btn thm-btn"
                    >
                      Dashboard
                    </Link>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </nav>
      </header>

      <MobileMenu handleMobileMenu={handleMobileMenu} />

      <div
        className={`stricky-header stricked-menu main-menu main-menu-three ${scroll ? 'stricky-fixed' : ''}`}
      >
        <div className="sticky-header__content">
          <nav className="main-menu main-menu-three">
            <div className="main-menu-three__wrapper">
              <div className="container">
                <div className="main-menu-three__wrapper-inner">
                  <div className="main-menu-three__left">
                    <div className="main-menu-three__logo">
                      <Link href="/">
                        <Image
                          src="/assets/images/resources/synixLogo.png"
                          alt="Synix Solutions logo"
                          width={150}
                          height={50}
                          style={{ height: 'auto' }}
                          priority
                        />
                      </Link>
                    </div>
                  </div>
                  <div className="main-menu-three__main-menu-box">
                    <button
                      type="button"
                      className="mobile-nav__toggler"
                      onClick={handleMobileMenu}
                      aria-label="Toggle mobile navigation"
                    >
                      <i className="fa fa-bars"></i>
                    </button>
                    <Menu />
                  </div>
                  {/* <div className="main-menu-three__right">
                    <div className="main-menu-three__btn-box">
                      <Link
                        href="/dashboard"
                        className="main-menu-three__btn thm-btn"
                      >
                        Dashboard
                      </Link>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Header;
