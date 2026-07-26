import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './WriteInAnimation.css';

export default function WriteInAnimation({ entry, onComplete, existingEntries }) {
  const containerRef = useRef(null);
  const entryRowRef = useRef(null);
  const textRef = useRef(null);

  const title = entry.type === 'baki' ? 'বাকির খাতা' : (entry.type === 'sale' ? 'বিক্রির হিসাব' : 'পরিশোধের হিসাব');
  const relevantEntries = existingEntries.filter(e => e.type === entry.type).slice(-10);

  useEffect(() => {
    if (!containerRef.current || !entryRowRef.current || !textRef.current) return;

    const tl = gsap.timeline({ onComplete });

    const rowY = 100 + (entryRowRef.current?.offsetTop || 0) + 20; // 100px header + offset + half row

    gsap.set(containerRef.current, { scale: 1, transformOrigin: `20% ${rowY}px` });
    gsap.set(textRef.current, { clipPath: 'inset(0 100% 0 0)' }); 

    // Zoom in dynamically focusing exactly on the new entry line! No hardcoded 'y' movement.
    tl.to(containerRef.current, { scale: 1.5, duration: 0.8, ease: "power2.inOut" });
    
    // Write the new input
    tl.to(textRef.current, { clipPath: 'inset(0 0% 0 0)', duration: 1.2, ease: "power1.inOut" });
    tl.to({}, { duration: 0.6 });
    
    // Zoom back out
    tl.to(containerRef.current, { scale: 1, duration: 0.6, ease: "power2.inOut" });

    return () => {
      tl.kill(); 
    };
  }, [onComplete]);

  return (
    <div className="write-in-overlay">
      <div className="khata-page-mock" ref={containerRef}>
        <div className="margin-rule-fake"></div>
        <div className="mock-header">
           <h2>{title}</h2>
        </div>
        <div className="mock-entries">
          {relevantEntries.map((e) => (
            <div key={e.id} className="mock-row">
              <div className="m-who">
                {e.customer} - {e.item} : ৳{e.amount}
              </div>
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
