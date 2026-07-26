import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './WriteInAnimation.css';

export default function WriteInAnimation({ entry, onComplete, existingEntriesCount }) {
  const containerRef = useRef(null);
  const entryRowRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !entryRowRef.current || !textRef.current) return;

    const tl = gsap.timeline({ onComplete });

    gsap.set(containerRef.current, { scale: 1 });
    gsap.set(textRef.current, { clipPath: 'inset(0 100% 0 0)' }); 

    tl.to(containerRef.current, { scale: 0.8, duration: 0.6, ease: "power2.inOut" });
    tl.to(containerRef.current, { scale: 1.5, y: -50, duration: 0.8, ease: "power2.inOut" });
    tl.to(textRef.current, { clipPath: 'inset(0 0% 0 0)', duration: 1.2, ease: "power1.inOut" });
    tl.to({}, { duration: 0.5 });
    tl.to(containerRef.current, { scale: 1, y: 0, duration: 0.6, ease: "power2.inOut" });

  }, [onComplete]);

  return (
    <div className="write-in-overlay">
      <div className="khata-page-mock" ref={containerRef}>
        <div className="margin-rule-fake"></div>
        <div className="mock-entries">
          {Array.from({ length: existingEntriesCount }).map((_, i) => (
            <div key={i} className="mock-row">
              <div className="m-who">পূর্বের হিসাব {i+1}</div>
            </div>
          ))}
          <div className="mock-row new-entry" ref={entryRowRef}>
            <div className="m-who text-reveal" ref={textRef}>
              <span style={{ color: entry.type === 'baki' ? '#9E2B25' : '#1E2A38' }}>
                {entry.customer} - {entry.item} : ৳{entry.amount}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
