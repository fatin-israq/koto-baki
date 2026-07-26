import React from 'react';
import { Mic, Sparkles } from 'lucide-react';

export function MicButton({ onClick, isListening }) {
  return (
    <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-30">
      <button
        onClick={onClick}
        className={`group relative flex items-center justify-center p-5 sm:p-6 rounded-full shadow-2xl transition transform active:scale-90 ${
          isListening
            ? "bg-red-600 text-white mic-recording-pulse scale-110"
            : "bg-gradient-to-tr from-red-800 via-red-700 to-amber-600 text-amber-200 hover:scale-105 hover:shadow-red-950/60"
        }`}
        title="কথা বলুন / হিসাব যোগ করুন"
      >
        {/* Glow Ring */}
        <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-red-600 to-amber-500 opacity-40 blur group-hover:opacity-75 transition duration-500" />

        <div className="relative flex items-center gap-2 font-bold font-brand text-base sm:text-lg">
          <Mic className={`w-7 h-7 sm:w-8 sm:h-8 ${isListening ? 'animate-bounce' : ''}`} />
          <span className="hidden sm:inline">কথা বলুন</span>
        </div>
      </button>
    </div>
  );
}
