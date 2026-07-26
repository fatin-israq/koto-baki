import React, { useState } from 'react';
import { Mic, Square, X, Sparkles, AlertTriangle, Send } from 'lucide-react';

export function ListeningOverlay({
  isRecording,
  recordingTime,
  waveformData,
  permissionError,
  onStop,
  onCancel,
  onSubmitManualText
}) {
  const [manualText, setManualText] = useState("");

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualText.trim()) {
      onSubmitManualText(manualText.trim());
      setManualText("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/95 backdrop-blur-xl flex flex-col items-center justify-between p-4 sm:p-8 animate-fadeIn">
      {/* Top Header */}
      <div className="w-full max-w-xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-600 animate-ping" />
          <span className="text-amber-400 font-brand text-xl font-bold tracking-wide">
            ভয়েস এন্ট্রি শুনছি...
          </span>
        </div>

        <button
          onClick={onCancel}
          className="p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 transition"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Central Ruled Paper Listening Surface */}
      <div className="w-full max-w-xl my-auto bg-[#FAF6EE] rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-red-900/40 relative overflow-hidden text-center space-y-6">
        {/* Margin Line */}
        <div className="absolute left-10 top-0 bottom-0 w-0.5 bg-red-400/60" />

        {/* Audio Waveform Bars */}
        <div className="flex items-end justify-center gap-1.5 h-24 my-4">
          {waveformData.map((height, i) => (
            <div
              key={i}
              className="w-2 sm:w-2.5 bg-gradient-to-t from-red-800 to-amber-500 rounded-full transition-all duration-75 shadow-sm"
              style={{ height: `${height}px` }}
            />
          ))}
        </div>

        {/* Timer Display */}
        <div className="space-y-1">
          <div className="text-3xl font-mono font-bold text-red-950">
            {formatTime(recordingTime)}
          </div>
          <p className="text-xs text-stone-600 font-ui">
            স্পষ্ট করে বাংলায় লেনদেনের বিবরণ বলুন
          </p>
        </div>

        {/* Permission Error or Hint */}
        {permissionError ? (
          <div className="p-3 bg-amber-100 border border-amber-300 rounded-xl text-amber-900 text-xs flex items-center gap-2 text-left">
            <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0" />
            <span>{permissionError}</span>
          </div>
        ) : (
          <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-stone-700 text-xs font-ui space-y-1">
            <p className="font-bold text-red-900 flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> উদাহরণ টিপস:
            </p>
            <p className="font-ink text-sm text-stone-800">
              "করিম ভাই ৫০ টাকার চিনি বাকী নিল" অথবা "শাহ আলম সাহেব ১০০০ টাকা জমা দিলেন"
            </p>
          </div>
        )}

        {/* Action Button: Stop Recording */}
        <div className="pt-2 flex justify-center">
          <button
            onClick={onStop}
            className="flex items-center gap-3 px-8 py-4 rounded-full bg-red-700 hover:bg-red-600 text-white font-bold text-lg shadow-xl shadow-red-950/50 transform hover:scale-105 transition active:scale-95"
          >
            <Square className="w-5 h-5 fill-current" />
            <span>বলা শেষ (সম্পন্ন করুন)</span>
          </button>
        </div>

        {/* Alternative Text Prompt input */}
        <form onSubmit={handleManualSubmit} className="pt-4 border-t border-stone-300 flex items-center gap-2">
          <input
            type="text"
            placeholder="অথবা বাংলায় সরাসরি লিখে টাইপ করুন..."
            value={manualText}
            onChange={(e) => setManualText(e.target.value)}
            className="flex-1 px-4 py-2 rounded-xl bg-white border border-stone-300 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-red-600 font-ui"
          />
          <button
            type="submit"
            disabled={!manualText.trim()}
            className="p-2.5 bg-stone-900 hover:bg-stone-800 disabled:opacity-40 text-amber-300 rounded-xl transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Footer Instructions */}
      <p className="text-xs text-stone-500 font-mono">
        Gemma 4 Native Audio Extraction Engine • Mudi Dokan Khata
      </p>
    </div>
  );
}
