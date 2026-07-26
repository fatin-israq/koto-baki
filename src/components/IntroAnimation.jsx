import React, { useEffect, useState } from 'react';
import './IntroAnimation.css';

export default function IntroAnimation({ onComplete }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Start opening animation after a short delay
    const timer1 = setTimeout(() => setIsOpen(true), 500);
    
    // Complete the intro and unmount after animation finishes
    const timer2 = setTimeout(() => {
      onComplete();
    }, 2200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  return (
    <div className="intro-container" onClick={onComplete}>
      <div className={`khata-book ${isOpen ? 'open' : ''}`}>
        {/* The book cover acts as an overlay over the actual App */}
        <div className="khata-cover">
          <div className="cover-spine-texture"></div>
          <div className="cover-content">
            <h1 className="cover-title">হালখাতা</h1>
            <h2 className="cover-subtitle">২০২৬</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
