import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import confetti from 'canvas-confetti';

export function WriteInAnimation({ transactionId, onComplete }) {
  const overlayRef = useRef(null);
  const penRef = useRef(null);

  useEffect(() => {
    if (!transactionId) return;

    // Trigger subtle success confetti flourish
    try {
      confetti({
        particleCount: 25,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#D32F2F', '#2E7D32', '#FFB300']
      });
    } catch {
      // fallback if confetti canvas fails
    }

    const rowElem = document.getElementById(`row-${transactionId}`);

    if (rowElem && overlayRef.current) {
      // GSAP Timeline for Zoom -> Write -> Zoom Out
      const tl = gsap.timeline({
        onComplete: () => {
          setTimeout(() => {
            onComplete();
          }, 300);
        }
      });

      // Step 1: Flash row with ink glow
      tl.to(rowElem, {
        scale: 1.03,
        backgroundColor: '#fef3c7',
        duration: 0.4,
        ease: 'power2.out'
      })
      // Step 2: Ink reveal effect
      .to(rowElem.querySelectorAll('.ink-entry-text'), {
        opacity: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power1.inOut'
      })
      // Step 3: Return row to natural paper look
      .to(rowElem, {
        scale: 1,
        backgroundColor: 'transparent',
        duration: 0.5,
        ease: 'power2.in'
      });
    } else {
      const timer = setTimeout(onComplete, 1000);
      return () => clearTimeout(timer);
    }
  }, [transactionId, onComplete]);

  return (
    <div
      ref={overlayRef}
      className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center opacity-0 transition-opacity duration-300"
    >
      <div className="bg-red-950/20 backdrop-blur-[1px] inset-0 absolute" />
    </div>
  );
}
