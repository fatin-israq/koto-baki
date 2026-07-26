import React, { useRef, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import './PageFlipView.css';

const PageCover = React.forwardRef((props, ref) => {
  return (
    <div className="page page-cover" ref={ref} data-density="hard">
      <div className="page-content">
        <h2>{props.children}</h2>
      </div>
    </div>
  );
});

const Page = React.forwardRef((props, ref) => {
  return (
    <div className="page" ref={ref}>
      <div className="page-content">
        <h3 className="page-header">{props.title}</h3>
        <div className="page-body">
          {props.children}
        </div>
      </div>
    </div>
  );
});

export default function PageFlipView({ groupedLedger, rowHTML }) {
  const flipBook = useRef(null);
  
  // groupedLedger is an array of [dateString, entriesArray]
  
  return (
    <div className="flipbook-container">
      <HTMLFlipBook 
        width={350} 
        height={500} 
        size="stretch"
        minWidth={300}
        maxWidth={800}
        minHeight={400}
        maxHeight={1000}
        showCover={true}
        usePortrait={true}
        ref={flipBook}
        className="khata-flipbook"
      >
        <PageCover>খাতা ২০২৬</PageCover>
        
        {groupedLedger.map(([date, entries], index) => (
          <Page key={date} title={`তারিখ: ${date}`}>
            <div className="flip-ledger-list">
              {entries.length > 0 ? (
                entries.map(rowHTML)
              ) : (
                <div className="empty-note">কোনো হিসাব নেই</div>
              )}
            </div>
          </Page>
        ))}
        
        <PageCover>সমাপ্ত</PageCover>
      </HTMLFlipBook>
    </div>
  );
}
