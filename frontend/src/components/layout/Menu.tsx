import Link from 'next/link';
import React from 'react';

const Menu: React.FC = () => {
  return (
    <ul className="main-menu__list">
      <li>
        <Link href="/">Home</Link>
      </li>
      <li>
        <Link href="/about-us">About</Link>
      </li>
      <li>
        <Link href="/services">Services</Link>
      </li>
      <li>
        <Link href="/products">Products</Link>
      </li>
      <li>
        <Link href="/contact-us">Contact</Link>
      </li>
    </ul>
  );
};

export default Menu;
