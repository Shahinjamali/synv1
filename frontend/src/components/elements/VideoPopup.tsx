'use client';
import { useState } from 'react';
import ModalVideo from 'react-modal-video';
import React from 'react';
import Image from 'next/image';

interface VideoPopupProps {
  style?: number;
  text?: string;
}

const VideoPopup: React.FC<VideoPopupProps> = ({ style, text }) => {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      {/* <a onClick={() => setOpen(true)} className="lightbox-image"><i className="icon-play" /></a> */}
      {/* <span className="play-icon flaticon-play" onClick={() => setOpen(true)} /> */}
      {!style && (
        <a
          onClick={() => setOpen(true)}
          className="overlay-link lightbox-image video-fancybox ripple"
        >
          <span className="play-icon flaticon-play" />
        </a>
      )}

      {style === 1 && (
        <div className="video-btn">
          <a
            onClick={() => setOpen(true)}
            className="overlay-link lightbox-image video-fancybox ripple"
          >
            <span className="play-icon flaticon-play" />
          </a>
        </div>
      )}
      {style === 2 && (
        <div className="video-btn">
          <a
            onClick={() => setOpen(true)}
            className="overlay-link lightbox-image video-fancybox ripple"
          >
            <span className="play-icon flaticon-play" />
          </a>
          <h6>{text ? text : 'Latest Program Video'}</h6>
        </div>
      )}
      {style === 3 && (
        <div className="video-btn">
          <a onClick={() => setOpen(true)} className="lightbox-image">
            <i className="customicon-play-button" />
            <span className="border-animation border-1" />
            <span className="border-animation border-2" />
            <span className="border-animation border-3" />
          </a>
        </div>
      )}
      {style === 4 && (
        <div className="video-btn">
          <a onClick={() => setOpen(true)} className="lightbox-image">
            <Image
              src="/assets/images-4/icons/video-btn-1.png"
              alt=""
              width={100}
              height={100}
            />
          </a>
        </div>
      )}
      {style === 5 && (
        <a
          onClick={() => setOpen(true)}
          className="video-btn overlay-link lightbox-image video-fancybox ripple"
        >
          <span className="fas fa-play" />
        </a>
      )}

      <ModalVideo
        channel="youtube"
        isOpen={isOpen}
        videoId="vfhzo499OeA"
        onClose={() => setOpen(false)}
      />
    </>
  );
};

export default VideoPopup;
