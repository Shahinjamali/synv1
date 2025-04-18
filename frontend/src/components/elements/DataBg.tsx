'use client';

import { useEffect } from 'react';

const DataBg: React.FC = () => {
  useEffect(() => {
    const elements = document.querySelectorAll('[data-bg]');
    elements.forEach((element) => {
      const bgAttribute = element.getAttribute('data-bg');
      if (bgAttribute && element instanceof HTMLElement) {
        element.style.backgroundImage = `url(${bgAttribute})`;
      } else {
        console.warn('Invalid element or data-bg attribute:', element);
      }
    });
  }, []);

  return <></>;
};

export default DataBg;
