import React, { useState, useEffect } from 'react';

export function PageFlipContainer({ selectedDate, children }) {
  const [isFlipping, setIsFlipping] = useState(false);
  const [displayDate, setDisplayDate] = useState(selectedDate);

  useEffect(() => {
    if (selectedDate !== displayDate) {
      setIsFlipping(true);
      const timer = setTimeout(() => {
        setDisplayDate(selectedDate);
        setIsFlipping(false);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [selectedDate, displayDate]);

  return (
    <div className="relative w-full page-flip-wrapper">
      <div
        className={`w-full transition-all duration-300 transform-gpu ${
          isFlipping
            ? 'opacity-40 scale-95 rotate-y-12 blur-[1px]'
            : 'opacity-100 scale-100 rotate-y-0'
        }`}
      >
        {children}
      </div>
    </div>
  );
}
