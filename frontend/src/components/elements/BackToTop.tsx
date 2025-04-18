import React from 'react';

interface BackToTopProps {
  scroll: boolean;
}

const BackToTop: React.FC<BackToTopProps> = ({ scroll }) => {
  return (
    <>
      {scroll && (
        <a className="scroll-to-top scroll-to-target d-block" href="#top">
          <i className="fas fa-angle-up"></i>
        </a>
      )}
    </>
  );
};

export default BackToTop;
