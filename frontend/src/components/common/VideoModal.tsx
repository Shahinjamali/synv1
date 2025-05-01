// components/VideoModal.tsx
'use client';

import { useState } from 'react';
import ModalVideo from 'react-modal-video';
import 'react-modal-video/css/modal-video.min.css'; // Import styles if not already included

export default function VideoModal() {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <div className="project-details__video-link">
        <a onClick={() => setOpen(true)} className="video-popup">
          <div className="project-details__video-icon">
            <span className="icon-play"></span>
            <i className="ripple"></i>
          </div>
        </a>
      </div>
      <ModalVideo
        channel="youtube"
        isOpen={isOpen}
        videoId="Get7rqXYrbQ" // Replace with a relevant video ID
        onClose={() => setOpen(false)}
      />
    </>
  );
}
