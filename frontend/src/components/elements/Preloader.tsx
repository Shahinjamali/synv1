import React from 'react';

const Preloader: React.FC = () => {
  return (
    <>
      <div className="loader-wrap">
        <div className="preloader">
          <div id="handle-preloader" className="handle-preloader">
            <div className="animation-preloader">
              <div className="spinner"></div>
              <div className="txt-loading">
                <span data-text-preloader="E" className="letters-loading">
                  E
                </span>
                <span data-text-preloader="L" className="letters-loading">
                  L
                </span>
                <span data-text-preloader="I" className="letters-loading">
                  I
                </span>
                <span data-text-preloader="E" className="letters-loading">
                  E
                </span>
                <span data-text-preloader="C" className="letters-loading">
                  C
                </span>
                <span data-text-preloader="O" className="letters-loading">
                  O
                </span>
                <span data-text-preloader="N" className="letters-loading">
                  N
                </span>
                <span data-text-preloader="S" className="letters-loading">
                  S
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Preloader;
