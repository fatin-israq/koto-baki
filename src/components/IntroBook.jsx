import React, { useState } from 'react';
import { BookOpen, Sparkles, Volume2, ArrowRight } from 'lucide-react';

export function IntroBook({ onComplete, shopName }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
    setTimeout(() => {
      onComplete();
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0c0a09] flex flex-col items-center justify-center p-4 overflow-hidden select-none">
      {/* Background Ambient Glow */}
      <div className="absolute w-[500px] h-[500px] bg-red-900/20 rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* 3D Book Container */}
      <div className="relative perspective-1200 w-full max-w-md cursor-pointer group" onClick={handleOpen}>
        <div
          className={`relative w-full h-[520px] rounded-r-2xl transition-all duration-1000 transform-style-3d shadow-2xl ${
            isOpen ? 'rotate-y-[-110deg] opacity-0 scale-95' : 'hover:scale-[1.02] hover:-rotate-y-6'
          }`}
          style={{
            background: 'linear-gradient(135deg, #7F1D1D 0%, #991B1B 40%, #450A0A 100%)',
            boxShadow: '-20px 20px 50px rgba(0,0,0,0.8), inset 4px 0 10px rgba(255,255,255,0.2)'
          }}
        >
          {/* Stitched Spine Left */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-red-950 via-red-900 to-transparent border-r-2 border-dashed border-amber-400/60 flex flex-col justify-between py-6 items-center">
            <div className="w-1 h-full bg-amber-400/20 rounded" />
          </div>

          {/* Book Gold Foil Embossing & Cover Art */}
          <div className="h-full flex flex-col items-center justify-between p-8 text-center border-4 border-amber-400/40 rounded-r-xl m-3 bg-red-950/40">
            {/* Top Shop Crest */}
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> ভয়েস-ফার্স্ট ডিজিটাল লাল খাতা
              </div>
              <p className="text-amber-200/60 text-xs mt-2 font-mono">ESTD. 2015</p>
            </div>

            {/* Central Book Title */}
            <div className="my-auto space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 p-1 shadow-lg shadow-amber-900/50 flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-red-950 flex items-center justify-center border border-amber-300/40">
                  <BookOpen className="w-10 h-10 text-amber-400 transform -rotate-6" />
                </div>
              </div>

              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-amber-300 font-brand tracking-wide drop-shadow-md">
                  {shopName || "মেসার্স রহিম স্টোর"}
                </h1>
                <p className="text-amber-100/90 text-sm font-ui tracking-wider font-medium">
                  কারওয়ান বাজার, ঢাকা
                </p>
              </div>

              <div className="w-24 h-0.5 mx-auto bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
            </div>

            {/* Tap to Open Prompt */}
            <div className="space-y-3">
              <button
                className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-amber-400 text-red-950 font-bold text-base shadow-lg hover:bg-amber-300 transition duration-300 group-hover:scale-105"
              >
                <span>খাতা খুলুন</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
              </button>
              <p className="text-amber-200/50 text-xs">
                ট্যাপ করে খাতার পাতা খুলুন
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Skip Button */}
      <button
        onClick={handleOpen}
        className="mt-8 text-amber-300/70 hover:text-amber-300 text-xs font-mono uppercase tracking-widest border border-amber-400/20 px-4 py-1.5 rounded-full hover:bg-amber-400/10 transition"
      >
        [Skip Intro]
      </button>
    </div>
  );
}
