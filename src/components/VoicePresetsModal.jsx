import React from 'react';
import { Volume2, Play, Sparkles, AlertCircle, X } from 'lucide-react';
import { VOICE_PRESETS } from '../services/mockData';

export function VoicePresetsModal({ onSelectPreset, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-stone-900 rounded-3xl p-6 shadow-2xl border border-amber-500/40 text-stone-100 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2 text-amber-300 font-brand text-lg font-bold">
            <Volume2 className="w-5 h-5 text-amber-400 animate-pulse" />
            <span>বাংলা ভয়েস টেস্ট সিমুলেটর (Judge Demo Launcher)</span>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-stone-400 font-ui">
          নিচের বাংলা ভয়েস প্রিসেটগুলোতে ক্লিক করে সরাসরি গেমমা ৪ (Gemma 4 Native Audio) এআই মডেলের রেসপন্স পরীক্ষা করুন:
        </p>

        {/* Presets List */}
        <div className="space-y-2.5">
          {VOICE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              className="w-full p-4 rounded-2xl bg-stone-950 hover:bg-stone-800 border border-stone-800 hover:border-amber-500/60 transition text-left group flex items-center justify-between gap-3 shadow-md"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold font-mono text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
                    {preset.label}
                  </span>
                  {preset.parsed.confidence < 0.7 && (
                    <span className="text-[10px] text-amber-400 flex items-center gap-1 font-mono">
                      <AlertCircle className="w-3 h-3" /> ফ্ল্যাগড এআই রেসপন্স
                    </span>
                  )}
                </div>
                <p className="text-sm font-ink text-stone-200 group-hover:text-amber-300 transition">
                  "{preset.spokenText}"
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-500 text-stone-950 group-hover:scale-110 transition shadow">
                <Play className="w-4 h-4 fill-current" />
              </div>
            </button>
          ))}
        </div>

        <div className="pt-2 border-t border-stone-800 text-[11px] text-stone-500 font-mono text-center">
          Gemma 4 E4B / 12B Audio-in to JSON Schema Pipeline Simulation
        </div>
      </div>
    </div>
  );
}
